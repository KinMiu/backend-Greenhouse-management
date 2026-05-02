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

  return condigData;
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
    const area = await prisma.device.findFirst({
      where: {
        id: deviceId,
        greenhouseId: greenhouseId,
      },
    });

    if (!area) {
      throw new Error("Area not found in this greenhouse");
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

export const updateAutomation = async (
  deviceId,
  greenhouseId,
  userId,
  payload,
) => {
  const {name, macAddress, areaId} = payload;

  const role = await prisma.device.findFirst({
    where: {
      id: deviceId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!role) {
    throw new Error("Staff role not found or access denied");
  }

  if (macAddress !== undefined && macAddress.trim() !== "") {
    const checkMac = await prisma.device.findFirst({
      where: {macAddress: macAddress},
    });

    if (checkMac && checkMac.id !== deviceId) {
      throw new Error(
        "This MAC Address is already registered to another device",
      );
    }
  }

  const dataUpdate = {};

  console.log(name);
  console.log(macAddress);
  if (name !== undefined) dataUpdate.name = name;
  if (macAddress !== undefined) dataUpdate.macAddress = macAddress;
  if (areaId !== undefined) dataUpdate.areaId = areaId;

  console.log("data update", dataUpdate);

  const device = await prisma.device.update({
    where: {
      id: deviceId,
    },
    data: dataUpdate,
  });

  return device;
};

export const deleteAutomation = async (deviceId, greenhouseId, userId) => {
  const role = await prisma.device.findFirst({
    where: {
      id: deviceId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!role) {
    throw new Error("Staff role not found or access denied");
  }

  const staffRoles = await prisma.device.delete({
    where: {
      id: deviceId,
    },
  });

  return staffRoles;
};
