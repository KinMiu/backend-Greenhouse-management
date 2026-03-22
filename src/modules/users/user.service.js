import {prisma} from "../../config/prisma.js";

export const activateUser = async (userId, query) => {
  const {isActive} = query;

  const filters = {};

  if (isActive !== undefined) {
    filters.isActive = isActive === "true";
  }

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateUser = await prisma.user.update({
    where: {id: userId},
    data: {isActive: filters.isActive},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updateUser;
};

export const getAllUsers = async (query) => {
  const {isActive} = query;

  const filters = {};

  if (isActive !== undefined) {
    filters.isActive = isActive === "true";
  }

  // console.log(filters);

  const users = await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
