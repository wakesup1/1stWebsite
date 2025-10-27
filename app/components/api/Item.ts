// API route handler for managing transaction items
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../api/lib/mongodb';
import Item from '../../api/models/Item';

/**
 * GET: Retrieve all items from the database
 * POST: Create a new item in the database
 */
export async function GET() {
  try {
    await dbConnect();
    const items = await Item.find({});
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 400 });
  }
}

/**
 * POST: Create a new transaction item
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const item = await Item.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 400 });
  }
}