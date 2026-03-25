import {prisma} from "../../config/prisma.js";

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
  });

  return devices;
};

export const createDevice = async (greenhouseId, userId, payload) => {
  const {name, type, macAddress, status, areaId} = payload;
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

  if (areaId) {
    const area = await prisma.area.findFirst({
      where: {
        id: areaId,
        greenhouseId: greenhouseId,
      },
    });

    if (!area) {
      throw new Error("Area not found in this greenhouse");
    }
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
      type: type,
      macAddress: macAddress,
      status: "OFFLINE",
      greenhouseId: greenhouseId,
      areaId: areaId || null,
    },
  });

  return device;
};

export const getStaffRoleDetail = async (roleId, greenhouseId, userId) => {
  const staffRoles = await prisma.staffRoles.findFirst({
    where: {
      id: roleId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!staffRoles) {
    throw new Error("Staff role not found or access denied");
  }

  return staffRoles;
};

export const updateStaffRole = async (
  deviceId,
  greenhouseId,
  userId,
  payload,
) => {
  const {name, type, macAddress, status, areaId} = payload;

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
  if (type !== undefined) dataUpdate.type = type;
  if (macAddress !== undefined) dataUpdate.macAddress = macAddress;
  if (status !== undefined) dataUpdate.status = status;
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

export const deleteStaffRole = async (deviceId, greenhouseId, userId) => {
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
