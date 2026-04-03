import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Bot stopped' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to stop bot' 
    }, { status: 500 });
  }
}
