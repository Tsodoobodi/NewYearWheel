// lib/db.ts
import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL тохируулаагүй байна');
}

// ✅ Connection pool үүсгэх
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // ✅ Нэмэлт тохиргоо
  max: 10, // Maximum 10 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// ✅ Connection тест (Error type нэмэх)
pool.on('error', (err: Error) => {
  console.error('Unexpected pool error:', err);
});

export default pool;