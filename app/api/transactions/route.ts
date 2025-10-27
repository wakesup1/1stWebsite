// API route handler for managing income and expense transactions
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../lib/mongodb';
import Transaction from '../models/Item';

/**
 * GET: Retrieve all transactions from the database
 * Returns transactions sorted by date (newest first)
 */
export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new transaction
 * Expects: { type, amount, category, description, date }
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate required fields
    if (!body.type || !body.amount || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, amount, and category are required' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create(body);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create transaction' },
      { status: 400 }
    );
  }
}

/**
 * DELETE: Remove all transactions (for testing purposes)
 */
export async function DELETE() {
  try {
    await dbConnect();
    await Transaction.deleteMany({});
    return NextResponse.json({ success: true, message: 'All transactions deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transactions' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update multiple transactions or perform bulk operations
 * Expects: { ids: string[], update: object } for bulk update
 * Or: { operation: 'recalculate' } for recalculating totals
 */
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Bulk update multiple transactions
    if (body.ids && Array.isArray(body.ids) && body.update) {
      const result = await Transaction.updateMany(
        { _id: { $in: body.ids } },
        { $set: body.update }
      );
      
      return NextResponse.json(
        { 
          success: true, 
          message: `Updated ${result.modifiedCount} transactions`,
          modifiedCount: result.modifiedCount 
        },
        { status: 200 }
      );
    }

    // Other bulk operations can be added here
    return NextResponse.json(
      { success: false, error: 'Invalid PATCH request format' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in PATCH operation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update transactions' },
      { status: 500 }
    );
  }
}
