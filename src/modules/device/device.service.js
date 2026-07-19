import {prisma} from "../../config/prisma.js";

export const getMyGreenhouseDevice = async (userId) => {
  const superAdminValidation = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!superAdminValidation || superAdminValidation.role !== "SUPER_ADMIN") {
    throw new Error("access denied");
  }

  const devices = await prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      components: true,
      greenhouse: {
        include: {
          owner: true,
        },
      },
    },
  });

  return devices;
};

export const getMyGreenhouseDeviceByGreenhouse = async (
  greenhouseId,
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

export const createDevice = async (userId, payload) => {
  const {name, macAddress} = payload;
  const superAdminValidation = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!superAdminValidation || superAdminValidation.role !== "SUPER_ADMIN") {
    throw new Error("access denied");
  }

  const checkMac = await prisma.device.findFirst({
    where: {macAddress: macAddress},
  });

  if (checkMac) {
    throw new Error("This MAC Address is already registered to another device");
  }

  const device = await prisma.device.create({
    data: {
      name: name,
      macAddress: macAddress,
    },
  });

  return device;
};

export const getDeviceDetail = async (deviceId, user) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
    },
    include: {
      components: true,
      area: true,
      statusLogs: {
        orderBy: {
          createAt: "desc",
        },
      },
      greenhouse: {
        include: {
          owner: true,
        },
      },
    },
  });
  // console.log(device);

  if (device.greenhouse === null) {
    if (user.role !== "SUPER_ADMIN") {
      throw new Error("Device not found or access denied");
    }
    return device;
  }

  console.log(user.role);
  if (user.role !== "SUPER_ADMIN") {
    if (device.greenhouse.ownerId !== user.id) {
      throw new Error("Greenhouse not found or access denied");
    }
  }

  return device;
};

export const updateDevice = async (deviceId, greenhouseId, userId, payload) => {
  const {name, macAddress, areaId} = payload;

  const device = await prisma.device.findUnique({
    where: {
      id: deviceId,
    },
  });

  if (!device) {
    throw new Error("Device not found or access denied");
  }

  if (device.greenhouseId !== null && device.greenhouseId !== greenhouseId) {
    throw new Error("Device not found or access denied");
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
  if (greenhouseId !== undefined) dataUpdate.greenhouseId = greenhouseId;

  console.log("data update", dataUpdate);

  const deviceUpdate = await prisma.device.update({
    where: {
      id: deviceId,
    },
    data: dataUpdate,
  });

  return deviceUpdate;
};

export const deleteDevice = async (deviceId, greenhouseId, userId) => {
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
