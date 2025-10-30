import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { verifyUser } from '../../lib/auth';

/**
 * GET /api/auth/me
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user from token
    const tokenPayload = verifyUser(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user by ID
    const user = await User.findById(tokenPayload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
