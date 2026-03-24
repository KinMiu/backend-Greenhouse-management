import {prisma} from "../../config/prisma.js";

export const getMyGreenhouseStaffs = async (greenhouseId, ownerId) => {
  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: ownerId,
    },
  });

  if (!greenhouse) {
    throw new Error("Greenhouse not found or access denied");
  }

  const greenhouseStaffs = await prisma.user.findMany({
    where: {greenhouseId: greenhouseId, role: "STAFF"},
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      staffRoleId: true,
      staffRoles: true,
    },
  });

  return greenhouseStaffs;
};

export const updateStaff = async (staffId, greenhouseId, userId, payload) => {
  const {name, email, staffRoleId} = payload;

  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: userId,
    },
  });

  if (!greenhouse) {
    throw new Error("Greenhouse not found or access denied");
  }

  const checkStaff = await prisma.user.findFirst({
    where: {
      id: staffId,
      greenhouseId: greenhouseId,
    },
  });

  console.log(checkStaff);

  if (!checkStaff) {
    throw new Error("Staff not found or access denied");
  }

  const dataUpdate = {};

  if (name !== undefined) dataUpdate.name = name;
  if (email !== undefined) dataUpdate.email = email;
  if (staffRoleId !== undefined) dataUpdate.staffRoleId = staffRoleId;

  const staff = await prisma.user.update({
    where: {
      id: staffId,
    },
    data: dataUpdate,
  });

  return staff;
};

export const deleteGreenhouseStaffs = async (
  staffId,
  greenhouseId,
  ownerId,
) => {
  console.log(greenhouseId, ownerId);
  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: ownerId,
    },
  });

  if (!greenhouse) {
    throw new Error("Greenhouse not found or access denied");
  }

  await prisma.user.delete({
    where: {
      id: staffId,
      greenhouseId: greenhouseId,
    },
  });

  return true;
};
