import express from "express";
import cors from "cors";
import {prisma} from "./config/prisma.js";

// routes
import authRoute from "./modules/auth/auth.route.js";
import userRoute from "./modules/users/user.route.js";
import greenhouseRoute from "./modules/greenhouse/greenhouse.route.js";
import staffRoute from "./modules/staff/staff.route.js";
import staffRoleRoute from "./modules/staff-role/staffRole.route.js";
import deviceRoute from "./modules/device/device.route.js";
import deviceComponentsRoute from "./modules/device-components/device-components.route.js";
import deviceComponentSensorRoute from "./modules/device-component-sensor/device-component-sensor.route.js";
import areaRoute from "./modules/area/area.route.js";
import automationRoute from "./modules/automation/automation.route.js";

import logger from "./utils/logger.js";
import {requireApiKey} from "./middleware/apiKey.middleware.js";
import {
  authLimiter,
  globalLimiter,
} from "./middleware/rateLimiter.middaleware.js";

const app = express();

process.on("SIGINT", async () => {
  logger.info("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({message: "Welcome to GH MAnagement System"});
});

app.use("/api", requireApiKey());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/greenhouses", greenhouseRoute);
app.use("/api/staff", staffRoute);
app.use("/api/staff-roles", staffRoleRoute);
app.use("/api/device", deviceRoute);
app.use("/api/device-components", deviceComponentsRoute);
app.use("/api/device-component-sensor", deviceComponentSensorRoute);
app.use("/api/areas", areaRoute);
app.use("/api/automations", automationRoute);

app.get("/health", async (req, res) => {
  try {
    // console.log(process.env.DATABASE_URL);
    await prisma.$queryRaw`SELECT 1`;
    res.json({status: "ok"});
  } catch (error) {
    res.status(500).json({status: "error"});
  }
});

export default app;
