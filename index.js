import dotenv from "dotenv";
import http from "http";
import logger from "./src/utils/logger.js";
import app from "./src/app.js";
import {prisma} from "./src/config/prisma.js";

dotenv.config();
const server = http.createServer(app);

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    server.listen(process.env.PORT, () => {
      logger.info(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to database");
    logger.error(error);
    process.exit(0);
  }
}

startServer();
