import {Pool} from "pg"
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client';
dotenv.config()

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:Number(process.env.DB_PORT),
})


// Pass the URL here from your .env   
// When you create your database instance in your code
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

export { prisma ,pool};