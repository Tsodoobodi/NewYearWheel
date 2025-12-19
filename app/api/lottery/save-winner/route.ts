// app/api/lottery/save-winner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('=== SAVE WINNER API CALLED ===');
  
  let client;
  
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { participantId, ftCode, fullName, prizeName } = body;

    if (!participantId || !ftCode || !fullName) {
      return NextResponse.json(
        { message: 'Мэдээлэл дутуу байна' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    console.log('✅ Database connected');

    try {
      await client.query('BEGIN');
      console.log('✅ Transaction started');

      // ✅ 1. ЭХЛЭЭД WINNER НЭМЭХ (participant байхад нь)
      console.log('Inserting winner...');
      const insertQuery = `
        INSERT INTO lottery_winners (participant_id, ft_code, full_name, prize_name)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const insertResult = await client.query(insertQuery, [
        participantId, 
        ftCode, 
        fullName, 
        prizeName || 'Шагнал'
      ]);
      console.log('✅ Winner inserted:', insertResult.rows[0]);

      // ✅ 2. ДАРАА НЬ PARTICIPANT УСТГАХ
      console.log('Deleting participant...');
      const deleteQuery = 'DELETE FROM lottery_participants WHERE id = $1 RETURNING *';
      const deleteResult = await client.query(deleteQuery, [participantId]);
      console.log('✅ Participant deleted:', deleteResult.rowCount, 'rows');

      await client.query('COMMIT');
      console.log('✅ Transaction committed successfully!');

      return NextResponse.json({
        success: true,
        message: 'Хожигч хадгалагдлаа',
        winner: insertResult.rows[0]
      });

    } catch (error) {
      console.error('❌ Transaction error, rolling back...');
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('=== SAVE WINNER ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        message: 'Алдаа гарлаа', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Releasing database connection...');
      client.release();
      console.log('✅ Connection released');
    }
  }
}