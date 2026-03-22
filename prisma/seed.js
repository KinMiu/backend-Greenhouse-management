import "dotenv/config";
import bcrypt from "bcrypt";
import logger from "../src/utils/logger.js";
import {prisma} from "../src/config/prisma.js";

async function main() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  if (existingSuperAdmin) {
    logger.info("SUPER_ADMIN already exists");
    return;
  }

  const hashPassword = await bcrypt.hash("superadmin123", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@GH.com",
      password: hashPassword,
      role: "SUPER_ADMIN",
    },
  });

  logger.info("SUPER_ADMIN already exists");
}

main()
  .catch((e) => {
    logger.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
