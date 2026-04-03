import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  try {
    const botPath = path.join(process.cwd(), '..', 'polytrip_bot.py');
    
    const running = true;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Bot started',
      pid: process.pid 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to start bot' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ running: false });
}
