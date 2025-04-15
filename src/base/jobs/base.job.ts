import { QueueManager, QueueName } from '../../queues/queues'
import Container from 'typedi'
import { FlowJob, JobsOptions } from 'bullmq'

export interface IBaseJob {
    execute()
    pushJobToQueueAsync()
}

export abstract class BaseJob implements IBaseJob {
    //region Properties

    protected _jobOptions: JobsOptions
    protected _jobId: string
    protected _queueName: QueueName

    jobData: unknown

    //endregion

    //region Getters and Setters

    get jobName() {
        return this._queueName
    }

    get queueName() {
        return this._queueName
    }

    get jobId() {
        return this._jobId
    }

    //endregion

    protected constructor(queueName: QueueName, jobOpts?: JobsOptions) {
        this._queueName = queueName
        this._jobOptions = jobOpts
    }

    //region Abstract Methods

    abstract execute()

    //endregion

    //region Public Methods

    async pushJobToQueueAsync() {
        return Container.get(QueueManager)
            .getQueue(this._queueName)
            .add(this.jobName, this.jobData, {
                ...this._jobOptions,
                jobId: this._jobId,
            })
    }

    async pushJobWithParentToQueueAsync(parentJob: BaseJob) {
        if (parentJob) {
            const flowJob: FlowJob = {
                name: parentJob.jobName,
                opts: {
                    jobId: parentJob.jobId,
                },
                queueName: parentJob.queueName,
                data: parentJob.jobData,
                children: [
                    <FlowJob>{
                        name: this.jobName,
                        queueName: this.queueName,
                        data: this.jobData,
                        opts: {
                            jobId: this.jobId,
                            failParentOnFailure: true,
                        },
                    },
                ],
            }

            return Container.get(QueueManager).createJobFlow().add(flowJob)
        }

        return null
    }

    async removeFailedJobIfExistAsync() {
        const existedJob = await Container.get(QueueManager)
            .getQueue(this._queueName)
            .getJob(this._jobId)

        if (existedJob?.failedReason) {
            await existedJob.remove()

            return existedJob
        }

        return null
    }

    async removeCompletedJobIfExistAsync() {
        const existedJob = await Container.get(QueueManager)
            .getQueue(this._queueName)
            .getJob(this._jobId)

        if (!existedJob) {
            return null
        }

        if (existedJob.failedReason || (await existedJob.isCompleted())) {
            await existedJob.remove()

            return existedJob
        }

        return null
    }

    //endregion
}
