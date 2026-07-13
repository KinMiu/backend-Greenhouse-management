import {prisma} from "../../config/prisma.js";
import logger from "../../utils/logger.js";
import {mqttClient} from "../../utils/mqtt.js";

export const getMyGreenhouseDeviceComponentSensor = async (
  greenhouseId,
  userId,
  componentId,
  page = 1,
  limit = 20,
) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const skip = (page - 1) * limit;

  const [sensorData, totalCount] = await prisma.$transaction([
    prisma.sensorData.findMany({
      where: {componentId: componentId},
      orderBy: {createdAt: "desc"},
      take: limit,
      skip: skip,
    }),
    prisma.sensorData.count({
      where: {componentId: componentId},
    }),
  ]);

  return {
    data: sensorData,
    pagination: {
      totalData: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit: limit,
    },
  };
};
