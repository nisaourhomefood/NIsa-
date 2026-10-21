import { NextResponse } from 'next/server';

const DEFAULT_ANNOUNCEMENT = '🌶️  Authentic Andhra Home Food          ✦          🏠  Made in Small Batches in Tenali          ✦          🚚  Shipped Pan-India in 3–5 Days          ✦          🎉  First Order? ₹99 OFF on ₹1499+  — Use code FIRSTORDER99          ✦          🫙  Zero Artificial Preservatives          ✦          🌿  Wood-Pressed Sesame Oil          ✦          🔥  Gongura Chicken Pickle — Customer Favourite          ✦          ⭐  4.9★ Rated by 10,000+ Andhra Families';

// In-memory store (replace with Supabase store_settings table for persistence)
let announcementText = DEFAULT_ANNOUNCEMENT;

export async function GET() {
  return NextResponse.json({ text: announcementText });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.text && typeof body.text === 'string') {
    announcementText = body.text;
  }
  return NextResponse.json({ text: announcementText, success: true });
}
