import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Ubah dari DATABASE_URL menjadi DIRECT_URL
    url: process.env.DIRECT_URL as string, 
  },
});