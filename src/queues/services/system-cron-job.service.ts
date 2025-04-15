import { Inject, Service } from 'typedi'
import { QueueManager } from '../queues'

@Service()
export class SystemCronJobService {
    constructor(@Inject() protected queueManager: QueueManager) {}

    async initCronJob() {
        //
    }

    // async initClearOldDbDataCronJob() {
    //     await this.queueManager
    //         .getQueue(QueueName.clearOldDataDB)
    //         .add('clear-old-db-data', null, {
    //             repeat: {
    //                 pattern: '0 14 * * *',
    //             },
    //         })
    // }
}
