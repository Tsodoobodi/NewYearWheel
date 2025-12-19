// app/api/lottery/test-winners/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Simple count
    const count = await client.query('SELECT COUNT(*) FROM lottery_winners');
    
    // All winners
    const winners = await client.query('SELECT * FROM lottery_winners ORDER BY won_at DESC');
    
    client.release();

    return NextResponse.json({
      count: count.rows[0].count,
      winners: winners.rows
    });

  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}