import {prisma} from "../../config/prisma.js";

export const getMyGreenhouseStaffRole = async (greenhouseId, userId) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const staffRoles = await prisma.staffRoles.findMany({
    where: {greenhouseId: greenhouseId},
    orderBy: {
      createdAt: "desc",
    },
  });

  return staffRoles;
};

export const createStaffRole = async (greenhouseId, userId, payload) => {
  const {name, description, permissions} = payload;

  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== userId) {
    throw new Error("Greenhouse not found or access denied");
  }

  const checkRole = await prisma.staffRoles.findFirst({
    where: {
      greenhouseId: greenhouseId,
      name: name,
    },
  });

  if (checkRole) {
    throw new Error("Role with this name already exists");
  }

  const role = await prisma.staffRoles.create({
    data: {
      name: name,
      description: description,
      permissions: permissions,
      greenhouseId: greenhouse.id,
    },
  });

  return role;
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
  roleId,
  greenhouseId,
  userId,
  payload,
) => {
  const {name, description, permissions} = payload;

  const role = await prisma.staffRoles.findFirst({
    where: {
      id: roleId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!role) {
    throw new Error("Staff role not found or access denied");
  }

  const dataUpdate = {};

  if (name !== undefined) dataUpdate.name = name;
  if (description !== undefined) dataUpdate.description = description;
  if (permissions !== undefined) dataUpdate.permissions = permissions;

  const staffRoles = await prisma.staffRoles.update({
    where: {
      id: roleId,
    },
    data: dataUpdate,
  });

  return staffRoles;
};

export const deleteStaffRole = async (roleId, greenhouseId, userId) => {
  const role = await prisma.staffRoles.findFirst({
    where: {
      id: roleId,
      greenhouseId: greenhouseId,
      greenhouse: {
        ownerId: userId,
      },
    },
  });

  if (!role) {
    throw new Error("Staff role not found or access denied");
  }

  const staffCount = await prisma.user.count({
    where: {
      staffRoleId: roleId,
    },
  });

  if (staffCount > 0) {
    throw new Error("Cannot delete role, because it is still used by staff");
  }

  const staffRoles = await prisma.staffRoles.delete({
    where: {
      id: roleId,
    },
  });

  return staffRoles;
};
