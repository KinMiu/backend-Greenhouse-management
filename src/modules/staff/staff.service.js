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
  });

  return greenhouseStaffs;
};

export const deleteGreenhouseStaffs = async (query, ownerId) => {
  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: query.greenhouseId,
      ownerId: ownerId,
    },
  });

  if (!greenhouse) {
    throw new Error("Greenhouse not found or access denied");
  }

  await prisma.user.delete({
    where: {
      id: query.idStaff,
      greenhouseId: query.greenhouseId,
    },
  });

  return true;
};
