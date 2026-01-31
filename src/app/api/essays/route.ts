import { NextResponse } from 'next/server';
import { getAllEssays } from '@/lib/essays';

export async function GET() {
  const essays = getAllEssays();
  return NextResponse.json(essays);
}
