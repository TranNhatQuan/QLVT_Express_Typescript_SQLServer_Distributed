import { Inject, Service } from "typedi";
import { QueueManager, QueueName } from "../queues/queues";

@Service()
export class QueueHelper {
  constructor(@Inject() protected queueManager: QueueManager) {}

  async pushJobWithUniqueWaitingCond(
    queueName: QueueName,
    jobId: string,
    jobData: any
  ) {
    const queue = this.queueManager.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (await job?.isWaiting()) {
      return;
    }

    if (job?.failedReason || (await job?.isCompleted())) {
      await job.remove();
    }

    await queue.add(jobId, jobData, { jobId });
  }
}
