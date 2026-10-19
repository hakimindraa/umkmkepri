import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is not set.');
}

const sql = neon(connectionString || 'postgresql://placeholder@localhost/neondb');
export const db = drizzle(sql, { schema });
