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

const app = express();

process.on("SIGINT", async () => {
  logger.info("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({message: "Welcome to GH MAnagement System"});
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/greenhouses", greenhouseRoute);
app.use("/api/staff", staffRoute);
app.use("/api/staff-roles", staffRoleRoute);
app.use("/api/device", deviceRoute);

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
