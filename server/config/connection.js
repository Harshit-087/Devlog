import {Pool} from "pg"
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client';
dotenv.config()


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// Pass the URL here from your .env   
// When you create your database instance in your code
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

export { prisma ,pool};