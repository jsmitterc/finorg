import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { Account } from '@/types/account';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to /api/accounts
export async function GET() {

    const entity_id = 1;
  try {
    const accounts: any[] = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM categories WHERE entity_id = ?",[entity_id], (err, rows) => {
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


export async function POST(req: NextRequest) {
    
    // Parse the request body to get updated transaction details
    const { name } = await req.json();
    const entity_id = 1;
    
    const categoryExists = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM categories WHERE name = UPPER(?) AND entity_id = ?", [name, entity_id], (err, row) => {

            if (err) reject(err);
            else resolve(row); // `row` will be `undefined` if not found
        })
    })

    console.log(categoryExists)

    if (categoryExists != undefined){
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }
  

    try {

        const result = await new Promise((resolve, reject) => {
            db.get("INSERT INTO categories (name, entity_id) VALUES (UPPER(?),?)", [name, entity_id], (err, row) => {
                if (err) reject(err);
                else resolve(row); // `row` will be `undefined` if not found
            })
        })
        
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

// Handle PUT requests to /api/categories (for deletion)
export async function PUT(req: NextRequest) {
  const { id } = await req.json(); // Get the ID of the category to remove
  const entity_id = 1;

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    // Delete the category from the database
    const result = await new Promise((resolve, reject) => {
      db.run("DELETE FROM categories WHERE id = ? AND entity_id = ?", [id, entity_id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // If no rows were deleted, return an error
    if (!result) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}