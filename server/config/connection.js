import { Pool } from "pg";
   import { PrismaPg } from "@prisma/adapter-pg"; // You need this!
   import dotenv from "dotenv";
   import { createRequire } from "module";
import { Redis } from 'ioredis'

   dotenv.config();
   const require = createRequire(import.meta.url);
   const { PrismaClient } = require("../generated/prisma/index.js");

   // 1. Create your standard PG Pool
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });

   // 2. Wrap it in the Prisma Adapter
   const adapter = new PrismaPg(pool);

   // 3. Pass the adapter to the constructor
   // This satisfies the "requires either adapter or accelerateUrl" check!
   const prisma = new PrismaClient({ adapter });
  console.log("Prisma models available:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));

const redis = new Redis(
  process.env.REDIS_URL,
 {
  maxRetriesPerRequest: null, // This prevents the specific error you saw
  connectTimeout: 10000,      // Give it 10 seconds to connect
  tls: {
    rejectUnauthorized: false // Necessary for some cloud environments
  }
})

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));


   export { prisma,redis};