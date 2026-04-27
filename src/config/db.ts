import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL as string;

// prepare: false sangat penting untuk Vercel Serverless
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });