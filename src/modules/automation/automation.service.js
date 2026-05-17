import {prisma} from "../../config/prisma.js";

export const getMyGreenhouseAutomation = async (
  greenhouseId,
  deviceId,
  componentId,
  userId,
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

  const configData = await prisma.automation.findMany({
    where: {deviceId: deviceId, componentId: componentId},
    orderBy: {
      createdAt: "desc",
    },
  });

  return configData;
};

export const getMyGreenhouseAutomationByArea = async (
  greenhouseId,
  areaId,
  userId,
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

  const configData = await prisma.automation.findMany({
    where: {
      device: {
        areaId: areaId,
        greenhouseId: greenhouseId,
      },
    },
    include: {
      device: true,
      component: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // console.log(configData);

  return configData;
};

export const createAutomation = async (greenhouseId, userId, payload) => {
  const {deviceId, componentId, action, time, duration} = payload;
  console.log(payload);

  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  if (deviceId) {
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        greenhouseId: greenhouseId,
      },
    });

    if (!device) {
      throw new Error("Device not found in this greenhouse");
    }
  }

  const saveConfigData = await prisma.automation.create({
    data: {
      deviceId: deviceId,
      componentId: componentId,
      action: action,
      time: time,
      duration: duration,
      isActive: true,
    },
  });

  return saveConfigData;
};

export const getAutomationDetail = async (deviceId, userId) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      greenhouse: {
        ownerId: userId,
      },
    },
    include: {
      components: true,
      area: true,
      statusLogs: {
        orderBy: {
          createAt: "desc",
        },
      },
    },
  });

  if (!device) {
    throw new Error("Device not found or access denied");
  }

  return device;
};

export const updateAutomation = async (id, greenhouseId, userId, payload) => {
  const {deviceId, componentId, action, time, duration, isActive} = payload;

  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  if (deviceId) {
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        greenhouseId: greenhouseId,
      },
    });

    if (!device) {
      throw new Error("Device not found in this greenhouse");
    }
  }

  const dataUpdate = {};

  if (deviceId !== undefined) dataUpdate.deviceId = deviceId;
  if (componentId !== undefined) dataUpdate.componentId = componentId;
  if (action !== undefined) dataUpdate.action = action;
  if (time !== undefined) dataUpdate.time = time;
  if (duration !== undefined) dataUpdate.duration = duration;
  if (isActive !== undefined) dataUpdate.isActive = isActive;

  console.log("data update", dataUpdate);

  const automation = await prisma.automation.update({
    where: {
      id: id,
    },
    data: dataUpdate,
  });

  return automation;
};

export const deleteAutomation = async (id, greenhouseId, userId) => {
  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const automation = await prisma.automation.delete({
    where: {
      id: id,
    },
  });

  return automation;
};
