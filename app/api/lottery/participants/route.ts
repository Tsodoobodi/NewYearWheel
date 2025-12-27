// app/api/lottery/participants/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        lp.id,
        lp.ft_code,
        lp.full_name,
        g.mobile_phone
      FROM lottery_participants lp
      INNER JOIN guests g ON lp.guest_id = g.id
      WHERE g.is_checked_in = true
      ORDER BY lp.entered_at ASC
    `);

    client.release();

    // ✅ Map snake_case to camelCase
    const participants = result.rows.map(row => ({
      id: row.id,
      ftCode: row.ft_code,           // ✅ ft_code -> ftCode
      fullName: row.full_name,       // ✅ full_name -> fullName
      mobilePhone: row.mobile_phone  // ✅ mobile_phone -> mobilePhone
    }));

    return NextResponse.json(participants);

  } catch (error) {
    console.error('Get participants error:', error);
    return NextResponse.json(
      { message: 'Алдаа гарлаа', error: String(error) },
      { status: 500 }
    );
  }
}