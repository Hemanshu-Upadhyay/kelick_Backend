import { prisma } from "../config/prismaClient.js";
import { irasService } from "../services/irasService.js";
import { logger } from "../config/logger.js";
import { redis } from "../config/redisClient.js";

export const getTaxData = async (req, res) => {
  const { userId } = req.params;

  try {
    const cachedTaxData = await redis.get(`taxData:${userId}`);

    if (cachedTaxData) {
      logger.info(`Cache hit for userId: ${userId}`);
      return res.json(JSON.parse(cachedTaxData));
    }

    let taxData = await prisma.taxData.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!taxData) {
      logger.info(
        `No local tax data found for userId: ${userId}. Fetching from IRAS API...`
      );

      const irasData = await irasService();
      if (!irasData) {
        logger.error("No data found from IRAS API.");
        return res.status(404).send("Tax data not found");
      }

      taxData = await prisma.taxData.create({
        data: {
          employeeName: irasData.employeeName,
          taxableIncome: irasData.taxableIncome,
          taxYear: irasData.taxYear,
          taxAmount: irasData.taxAmount,
        },
      });

      logger.info(
        `Tax data fetched from IRAS API and stored for userId: ${userId}`
      );
    }

    await redis.setex(`taxData:${userId}`, 3600, JSON.stringify(taxData));

    logger.info(`Tax data cached for userId: ${userId}`);

    res.json(taxData);
  } catch (error) {
    logger.error(`Error fetching tax data for userId: ${userId}`, error);
    res.status(500).send("Server Error");
  }
};
