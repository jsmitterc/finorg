import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';


// GET /api/accounts/[accountId]/transactions
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string, transaction_id: string }> }) {
    const { id, transaction_id } =  await params;
  
    if (!id || !transaction_id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
  
    try {
      const transaction = await new Promise((resolve, reject) => {
        db.get(
          'SELECT description, id, debit,credit, debit_account_id, credit_account_id, date_transaction, CASE WHEN category_id = 0 THEN NULL ELSE category_id END as category_id FROM transactions WHERE id =  ? ORDER BY date_transaction DESC',
          [transaction_id],
          (err: any, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
  
      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

// PUT /api/accounts/[accountId]/transactions/[transactionId]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string, transaction_id: string }> }) {
    const { id, transaction_id } = await params;
    
    // Parse the request body to get updated transaction details
    const updatedTransaction = await req.json();
    
    console.log(updatedTransaction)
    // Validate input data
    if (!updatedTransaction || !updatedTransaction.description || !updatedTransaction.debit || !updatedTransaction.credit || !updatedTransaction.debit_account_id || !updatedTransaction.credit_account_id || !updatedTransaction.category_id) {
      return NextResponse.json({ error: 'All fields are required to update the transaction' }, { status: 400 });
    }
  
    try {
      // Update the transaction in the database
      const result = await new Promise((resolve, reject) => {
        db.run(
          'UPDATE transactions SET description = ?, debit = ?, credit = ?, debit_account_id = ?, credit_account_id = ?, category_id = ? WHERE id = ?',
          [
            updatedTransaction.description,
            updatedTransaction.debit,
            updatedTransaction.credit,
            updatedTransaction.debit_account_id,
            updatedTransaction.credit_account_id,
            updatedTransaction.category_id,
            transaction_id
          ],
          function (err: any) {
            if (err) reject(err);
            else resolve(this.changes);  // Return the number of rows affected
          }
        );
      });
  
      // If no rows were updated, return an error
      if (result === 0) {
        return NextResponse.json({ error: 'Transaction not found or no changes made' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Transaction updated successfully' }, { status: 200 });
  
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }