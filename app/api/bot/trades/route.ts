import { NextResponse } from 'next/server';

const BOT_URL = process.env.BOT_API_URL || 'http://localhost:8080';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '50';
  
  try {
    const res = await fetch(`${BOT_URL}/trades?limit=${limit}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
