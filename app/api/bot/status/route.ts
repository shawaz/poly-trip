import { NextResponse } from 'next/server';

const BOT_URL = process.env.BOT_API_URL || 'http://localhost:8080';

export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/status`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'unknown' });
  }
}
