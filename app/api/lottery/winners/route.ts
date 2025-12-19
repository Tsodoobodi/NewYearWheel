// app/api/lottery/winners/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('=== GET WINNERS API CALLED ===');
  
  try {
    const client = await pool.connect();
    
    // ✅ Энгийн query эхлээд (JOIN-гүйгээр)
    const simpleResult = await client.query(`
      SELECT 
        id,
        ft_code,
        full_name,
        prize_name,
        won_at,
        participant_id
      FROM lottery_winners
      ORDER BY won_at DESC
    `);
    
    console.log('Simple query result:', simpleResult.rows);

    // ✅ Дараа нь mobile_phone авах (LEFT JOIN)
    const result = await client.query(`
      SELECT 
        lw.id,
        lw.ft_code,
        lw.full_name,
        lw.prize_name,
        lw.won_at,
        g.mobile_phone
      FROM lottery_winners lw
      LEFT JOIN guests g ON UPPER(lw.ft_code) = UPPER(g.ft_code)
      ORDER BY lw.won_at DESC
    `);
    console.log('Winners query result:', result.rows);


    client.release();

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Get winners error:', error);
    return NextResponse.json(
      { message: 'Алдаа гарлаа', error: String(error) },
      { status: 500 }
    );
  }
}