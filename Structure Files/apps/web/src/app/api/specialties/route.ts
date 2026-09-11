import { NextResponse } from 'next/server';
import { SPECIALTIES } from '@/constants';

export async function GET() {
  return NextResponse.json(SPECIALTIES);
}