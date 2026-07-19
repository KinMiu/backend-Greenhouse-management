import "dotenv/config";
import {defineConfig} from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.js",
    path: "prisma/migrations",
  },
  datasource: {
    // Biarkan Prisma membaca variabel DATABASE_URL secara langsung dan universal
    url: process.env.DATABASE_URL_PROD,
  },
});
