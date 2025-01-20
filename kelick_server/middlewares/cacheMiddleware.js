import { redisClient } from "../config/redisClient.js";
import { logger } from "../config/logger.js";

export const cacheMiddleware = async (req, res, next) => {
  const { userId } = req.params;

  redisClient.get(userId, (err, data) => {
    if (err) {
      logger.error("Error fetching data from Redis", err);
      return next();
    }

    if (data) {
      logger.info(`Cache hit for userId: ${userId}`);
      return res.json(JSON.parse(data));
    }

    next();
  });
};
