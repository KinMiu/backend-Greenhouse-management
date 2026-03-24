import bcrypt from "bcrypt";
import {prisma} from "../../config/prisma.js";
import {safeMessage} from "../../utils/safeMessage.js";
import jwt from "jsonwebtoken";

export const registerOwner = async (payload) => {
  const {name, email, password, greenhouseName, location} = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw safeMessage(
      "Email is already registered",
      "Request cannot be processed",
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: "OWNER",
        isActive: false,
      },
    });

    const greenhouse = await tx.greenhouse.create({
      data: {
        name: greenhouseName,
        location,
        ownerId: user.id,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      greenhouse: {
        id: greenhouse.id,
        name: greenhouse.name,
        location: greenhouse.location,
      },
    };
  });

  return result;
};

export const registerStaff = async (greenhouseId, ownerId, payload) => {
  const {name, email, staffRoleId} = payload;

  console.log(payload);
  if (!name || !email || !greenhouseId) {
    throw new Error("All required fields must be provided");
  }

  const greenhouse = await prisma.greenhouse.findFirst({
    where: {
      id: greenhouseId,
      ownerId: ownerId,
    },
  });

  if (!greenhouse) {
    throw new Error("Greenhouse not found or access denied");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // console.log(payload);

  if (existingUser) {
    throw safeMessage(
      "Email is already registered",
      "Request cannot be processed",
    );
  }

  if (staffRoleId) {
    const role = await prisma.staffRoles.findFirst({
      where: {
        id: staffRoleId,
        greenhouseId: greenhouseId,
      },
    });

    if (!role) {
      throw new Error("Staff role not found in this greenhouse");
    }
  }

  const hashPassword = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
      role: "STAFF",
      isActive: true,
      greenhouseId: greenhouseId,
      staffRoleId: staffRoleId || "",
    },
  });

  const result = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    staffRoleId: user.staffRoleId,
    staffRoles: user.staffRoles,
  };

  return result;
};

export const login = async ({email, password}) => {
  const user = await prisma.user.findUnique({
    where: {email: email},
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });
  console.log(user);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is not activated");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
