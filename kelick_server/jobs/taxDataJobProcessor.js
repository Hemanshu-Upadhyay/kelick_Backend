import { Queue, Worker } from "bullmq";
import { logger } from "../config/logger.js";

const connection = {
  host: "localhost",
  port: 6379,
};

const queue = new Queue("taxDataQueue", { connection });

export const taxDataJobProcessor = () => {
  queue.add("syncTaxData", { userId: "123" });

  const worker = new Worker(
    "taxDataQueue",
    async (job) => {
      logger.info(
        `Processing tax data sync job for userId: ${job.data.userId}`
      );
      console.log("Processing tax data sync job for userId:", job.data.userId);
    },
    { connection }
  );

  worker.on("completed", (job) => {
    logger.info(`Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job failed: ${job.id}, Error: ${err.message}`);
  });
};
