import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { Account } from '@/types/account';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to /api/accounts
export async function GET() {
  try {
    const accounts: any[] = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM accounts", (err, rows) => {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}