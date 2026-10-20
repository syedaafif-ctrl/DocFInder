import { NextResponse } from 'next/server';
import { MOCK_APPOINTMENTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    data: MOCK_APPOINTMENTS,
    total: MOCK_APPOINTMENTS.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
}