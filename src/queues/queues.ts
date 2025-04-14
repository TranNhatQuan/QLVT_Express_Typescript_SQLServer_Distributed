import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { DefaultJobOptions, FlowProducer, Queue } from "bullmq";
import { Redis } from "ioredis";
import Container, { Inject, Service } from "typedi";
import { config, Config } from "../configs";

export enum QueueName {
  mail = "mail",
}

@Service()
export class QueueManager {
  private readonly queues: Record<string, Queue> = {};

  constructor(@Inject() private config: Config) {}

  createQueue(
    queueName: QueueName,
    jobOptions: DefaultJobOptions = {
      removeOnComplete: 200,
      removeOnFail: 200,
    }
  ): Queue {
    const queue = new Queue(queueName, {
      connection: new Redis(this.config.redis),
      defaultJobOptions: jobOptions,
    });
    this.queues[queueName] = queue;
    return queue;
  }

  getQueue<T>(queueName: QueueName): Queue<T> {
    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue [${queueName}] does not exist`);
    }
    return queue;
  }

  createBoard() {
    const queueAdapter = new ExpressAdapter();
    createBullBoard({
      queues: Object.values(this.queues).map(
        (queue) => new BullMQAdapter(queue)
      ),
      serverAdapter: queueAdapter,
      options: {
        uiConfig: {
          boardTitle: "",
          boardLogo: { path: "" },
        },
      },
    });
    queueAdapter.setBasePath("/admin/queues");

    return queueAdapter;
  }

  async getJob(queueName: QueueName, jobId: string) {
    return await this.getQueue(queueName).getJob(jobId);
  }

  createJobFlow() {
    return new FlowProducer({
      connection: new Redis({
        ...config.redis,
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
      }),
    });
  }
}

export const setupQueues = () => {
  Object.values(QueueName).forEach((queueName) =>
    Container.get(QueueManager).createQueue(queueName)
  );
};
