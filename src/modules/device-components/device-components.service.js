import {prisma} from "../../config/prisma.js";
import logger from "../../utils/logger.js";
import {mqttClient} from "../../utils/mqtt.js";

export const getMyGreenhouseDevice = async (greenhouseId, userId) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const devices = await prisma.device.findMany({
    where: {greenhouseId: greenhouseId},
    orderBy: {
      createdAt: "desc",
    },
    include: {
      components: true,
    },
  });

  return devices;
};

export const createDeviceComponent = async (deviceId, userId, payload) => {
  console.log(payload);
  const {name, type, category, unit, pin} = payload;

  const superAdminValidation = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!superAdminValidation || superAdminValidation.role !== "SUPER_ADMIN") {
    throw new Error("access denied");
  }

  const deviceComponents = await prisma.deviceComponents.create({
    data: {
      name: name,
      type: type,
      category: category || null,
      unit: unit || null,
      pin: pin || null,
      deviceId: deviceId,
    },
  });

  return deviceComponents;
};

export const getDeviceDetail = async (deviceId, userId) => {
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
    },
  });

  if (!device) {
    throw new Error("Device not found or access denied");
  }

  return device;
};

export const updateDeviceComponent = async (
  componentsId,
  deviceId,
  greenhouseId,
  userId,
  payload,
) => {
  const {name, type, category, unit, pin} = payload;

  const existingComponents = await prisma.deviceComponents.findFirst({
    where: {
      id: componentsId,
      deviceId: deviceId,
      device: {
        greenhouseId: greenhouseId,
        greenhouse: {
          ownerId: userId,
        },
      },
    },
  });

  if (!existingComponents) {
    throw new Error("Component not found or access denied");
  }

  const dataUpdate = {};

  if (name !== undefined) dataUpdate.name = name;
  if (type !== undefined) dataUpdate.type = type;
  if (category !== undefined) dataUpdate.category = category;
  if (unit !== undefined) dataUpdate.unit = unit;
  if (pin !== undefined) dataUpdate.pin = pin;

  const deviceComponent = await prisma.deviceComponents.update({
    where: {
      id: componentsId,
    },
    data: dataUpdate,
  });

  return deviceComponent;
};

export const deleteDeviceComponent = async (
  componentsId,
  deviceId,
  greenhouseId,
  userId,
) => {
  console.log("componentsId", componentsId);
  console.log("deviceId", deviceId);
  console.log("greenhouseId", greenhouseId);
  console.log("userId", userId);
  const existingComponents = await prisma.deviceComponents.findFirst({
    where: {
      id: componentsId,
      deviceId: deviceId,
      device: {
        greenhouseId: greenhouseId,
        greenhouse: {
          ownerId: userId,
        },
      },
    },
  });

  console.log(existingComponents);

  if (!existingComponents) {
    throw new Error("Component not found or access denied");
  }

  const deviceComponents = await prisma.deviceComponents.delete({
    where: {
      id: componentsId,
    },
  });

  return deviceComponents;
};

export const toggleActuatorService = async (
  deviceId,
  componentsId,
  userId,
  command,
) => {
  const existingComponent = await prisma.deviceComponents.findFirst({
    where: {
      id: componentsId,
      deviceId: deviceId,
      device: {
        greenhouse: {
          ownerId: userId,
        },
      },
    },
    include: {
      device: {
        include: {
          components: true,
        },
      },
    },
  });

  if (!existingComponent) {
    throw new Error("Component not found or access denied");
  }

  if (existingComponent.type !== "ACTUATOR") {
    throw new Error("Invalid operation: This component is not a actuator");
  }

  console.log(componentsId);

  const macAddress = existingComponent.device.macAddress;
  const topic = `command/${macAddress}`;

  const payload = JSON.stringify({
    componentId: componentsId,
    pin: existingComponent.id,
    command: command ? "ON" : "OFF",
  });

  mqttClient.publish(topic, payload, {qos: 1}, (err) => {
    if (err) {
      logger.error("Failed to publish MQTT message: ", err);
      throw new Error("Failed to send command to device");
    }
  });

  logger.info(`Published to ${topic}: ${payload}`);

  return {
    topic,
    action: command ? "ON" : "OFF",
    component: existingComponent.name,
  };
};
