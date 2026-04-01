import {prisma} from "../../config/prisma.js";

export const getMyGreenhouseArea = async (greenhouseId, userId) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const devices = await prisma.area.findMany({
    where: {greenhouseId: greenhouseId},
    include: {
      devices: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return devices;
};

export const createArea = async (greenhouseId, userId, payload) => {
  const {name, description} = payload;
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

  const area = await prisma.area.create({
    data: {
      name: name,
      description: description,
      greenhouseId: greenhouseId,
    },
  });

  return area;
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

export const updateArea = async (areaId, greenhouseId, userId, payload) => {
  const {name, description} = payload;

  const area = await prisma.area.findFirst({
    where: {
      id: areaId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!area) {
    throw new Error("Staff role not found or access denied");
  }

  const dataUpdate = {};

  if (name !== undefined) dataUpdate.name = name;
  if (description !== undefined) dataUpdate.description = description;

  const device = await prisma.area.update({
    where: {
      id: areaId,
    },
    data: dataUpdate,
  });

  return device;
};

export const deleteArea = async (areaId, greenhouseId, userId) => {
  const role = await prisma.area.findFirst({
    where: {
      id: areaId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!role) {
    throw new Error("Area not found or access denied");
  }

  const staffRoles = await prisma.area.delete({
    where: {
      id: areaId,
    },
  });

  return staffRoles;
};
