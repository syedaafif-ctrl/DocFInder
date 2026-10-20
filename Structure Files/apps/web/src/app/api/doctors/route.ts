import { NextResponse } from 'next/server';
import { MOCK_DOCTORS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(MOCK_DOCTORS);
}