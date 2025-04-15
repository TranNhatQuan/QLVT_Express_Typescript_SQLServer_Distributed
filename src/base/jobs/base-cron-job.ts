import { QueueManager, QueueName } from '../../queues/queues'
import Container from 'typedi'
import { IBaseJob } from './base.job'

export abstract class BaseCronJob implements IBaseJob {
    //region Properties

    protected _pattern: string
    protected _queueName: QueueName

    jobData: unknown

    //endregion

    protected constructor(queue: QueueName, pattern: string) {
        this._queueName = queue
        this._pattern = pattern
    }

    //region Abstract Methods

    abstract execute()

    //endregion

    //region Public Methods

    async pushJobToQueueAsync() {
        return Container.get(QueueManager)
            .getQueue(this._queueName)
            .add(this._queueName, this.jobData, {
                repeat: {
                    pattern: this._pattern,
                },
            })
    }

    //endregion
}
