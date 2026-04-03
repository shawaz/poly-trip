import { NextResponse } from 'next/server';

const BOT_URL = process.env.BOT_API_URL || 'http://localhost:8080';

export async function POST() {
  try {
    const res = await fetch(`${BOT_URL}/start`, { method: 'POST' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to start bot' }, { status: 500 });
  }
}
