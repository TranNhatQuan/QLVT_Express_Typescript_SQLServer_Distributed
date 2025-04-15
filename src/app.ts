import { ClassConstructor } from 'class-transformer'
import {
    Application,
    NextFunction,
    Request,
    Response,
    Router,
    urlencoded,
} from 'express'
import expressBasicAuth from 'express-basic-auth'
import morgan from 'morgan'
import 'reflect-metadata'
import Container from 'typedi'
import { Config, validateEnv } from './configs'
import { initDataSource } from './database/connection'
import { QueueManager, setupQueues } from './queues/queues'
import { setupWorkers } from './queues/workers'
import { handleError } from './utils/error'
import { logger } from './utils/logger'
import { SystemCronJobService } from './queues/services/system-cron-job.service'
import promClient from 'prom-client'
import { createExpressServer, useContainer } from 'routing-controllers'
import { authorizationChecker } from './auth/authorizationChecker'
import { currentUserChecker } from './auth/currentUserChecker'
import { RoutingControllers } from './controllers'
import { Middlewares } from './middlewares'

export interface AppRoute {
    route?: string
    router: Router
}

export interface GroupableRoute {
    group?: string
    routes: ClassConstructor<AppRoute>[]
}

export interface VersionableRoute {
    version: string
    groups: GroupableRoute[]
}

export class App {
    private app: Application

    constructor(private config: Config, versionableRoutes: VersionableRoute[]) {
        useContainer(Container)
        this.app = createExpressServer({
            cors: {
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            },
            classTransformer: true,
            routePrefix: '',
            controllers: RoutingControllers,
            middlewares: Middlewares,
            defaultErrorHandler: false,
            authorizationChecker: authorizationChecker(),
            currentUserChecker: currentUserChecker(),
        })

        setupQueues()
        this.initMiddlewares()
        this.initRoutes(versionableRoutes)
    }

    private initMiddlewares() {
        // cross-origin resource sharing
        // this.app.use(cors())

        // body parser
        // this.app.use(json())
        this.app.use(urlencoded({ extended: true }))

        // http request logger
        this.app.use(
            morgan('short', {
                skip: (req) => {
                    return (
                        req.url.startsWith('/api/queues') ||
                        req.url.startsWith('/admin/queues') ||
                        req.url.startsWith('/healthcheck')
                    )
                },
            })
        )

        //promClient.collectDefaultMetrics()
        const requestDuration = new promClient.Histogram({
            name: 'http_request_duration_ms',
            help: 'Duration of HTTP requests in ms',
            labelNames: ['method', 'route', 'code'],
            buckets: [1, 10, 50, 100, 500],
        })
        this.app.use((req, res, next) => {
            const start = Date.now()
            const endpoint = decodeURIComponent(req.originalUrl)
            if (req.path !== '/metrics' && req.path !== '/healthcheck') {
                res.once('finish', () => {
                    const duration = Date.now() - start
                    requestDuration
                        .labels(req.method, endpoint, res.statusCode.toString())
                        .observe(duration)
                })
            }
            next()
        })

        this.app.get('/metrics', async (req: Request, res: Response) => {
            res.setHeader('Content-Type', promClient.register.contentType)
            const result = await promClient.register.metrics()
            res.send(result)
        })
    }

    private initRoutes(vRoutes: VersionableRoute[]) {
        vRoutes.forEach((vRoute) => {
            vRoute.groups.forEach((gRoute) => {
                let path = '/'
                if (vRoute.version) {
                    path += vRoute.version + '/'
                }
                if (gRoute.group) {
                    path += gRoute.group + '/'
                }
                gRoute.routes.forEach((clsRoute) => {
                    const route = Container.get(clsRoute)
                    this.app.use(path + (route.route ?? ''), route.router)
                })
            })
        })

        // queue dashboard
        this.app.use(
            '/admin/queues',
            expressBasicAuth({
                challenge: true,
                users: { admin: this.config.basicAuthPassword },
            }),
            Container.get(QueueManager).createBoard().getRouter()
        )
        this.app.use(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                handleError(err, res)
            }
        )
    }

    async start() {
        const start = Date.now()

        validateEnv(this.config)
        await initDataSource()

        await Promise.all([Container.get(SystemCronJobService).initCronJob()])
        setupWorkers()

        this.app.listen(this.config.port, () => {
            return logger.info(
                `Server is listening at port ${
                    this.config.port
                } - Elapsed time: ${(Date.now() - start) / 1000}s`
            )
        })

        process.on('uncaughtException', (err) => {
            logger.error(err)
        })

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(
                `Unhandled Rejection at: Promise ${JSON.stringify({
                    promise,
                    reason,
                })}`
            )
        })
    }
}
