// API route handler for managing individual transactions
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Transaction from '../../models/Item';

/**
 * DELETE: Remove a specific transaction by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedTransaction },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update a specific transaction by ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedTransaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update transaction' },
      { status: 400 }
    );
  }
}
