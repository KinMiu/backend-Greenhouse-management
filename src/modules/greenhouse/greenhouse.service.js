import {prisma} from "../../config/prisma.js";

export const getMyGreenhouse = async (ownerId) => {
  const greenhouses = await prisma.greenhouse.findMany({
    where: {ownerId: ownerId},
    orderBy: {
      createdAt: "desc",
    },
  });

  return greenhouses;
};

export const getGreenhouseDetail = async (greenhouseId, user) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: user.id,
    },
    include: {
      staff: true,
      staffRoles: {
        select: {
          id: true,
          name: true,
          description: true,
          permissions: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!greenhouse || greenhouse.ownerId !== user.id) {
    throw new Error("Greenhouse not found or access denied");
  }

  return greenhouse;
};

export const createGreenhouse = async (ownerId, payload) => {
  const {name, location} = payload;

  if (!name || !location) {
    throw new Error("Name and location are required");
  }

  const greenhouse = await prisma.greenhouse.create({
    data: {
      name: name,
      location: location,
      ownerId: ownerId,
    },
    include: {
      staff: true,
      staffRoles: true,
      _count: {
        select: {
          staff: true,
          staffRoles: true,
        },
      },
    },
  });

  return greenhouse;
};

export const updateGreenhouse = async (greenhouseId, user, data) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: user.id,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== user.id) {
    throw new Error("Greenhouse not found or access denied");
  }

  const updateGreenhouse = await prisma.greenhouse.update({
    where: {
      id: greenhouseId,
    },
    data: {
      ...(data.name && {name: data.name}),
      ...(data.location && {location: data.location}),
    },
  });

  return updateGreenhouse;
};

export const deleteGreenhouse = async (greenhouseId, ownerId) => {
  const greenhouse = await prisma.greenhouse.findUnique({
    where: {
      id: greenhouseId,
      ownerId: ownerId,
    },
  });

  if (!greenhouse || greenhouse.ownerId !== ownerId) {
    throw new Error("Greenhouse not found or access denied");
  }

  await prisma.greenhouse.delete({
    where: {
      id: greenhouseId,
    },
  });

  return true;
};
