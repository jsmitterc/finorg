import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';


// GET /api/accounts/[accountId]/transactions
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
  
    try {
      const transactions = await new Promise((resolve, reject) => {
        db.all(
          'SELECT description, transactions.id, CASE WHEN debit_account_id != ? THEN NULL ELSE debit END as debit, CASE WHEN credit_account_id != ? THEN NULL ELSE credit END as credit, debit_account_id, credit_account_id, date_transaction, categories.name as category_name FROM transactions LEFT JOIN categories ON categories.id = transactions.category_id WHERE debit_account_id = ? or credit_account_id = ?',
          [id,id,id,id],
          (err: any, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
  
      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }