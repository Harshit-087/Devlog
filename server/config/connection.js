import { Pool } from "pg";
   import { PrismaPg } from "@prisma/adapter-pg"; // You need this!
   import dotenv from "dotenv";
   import { createRequire } from "module";

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

   export default prisma;