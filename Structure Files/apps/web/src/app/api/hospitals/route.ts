import { NextRequest, NextResponse } from 'next/server';
import { MOCK_HOSPITALS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '12'));
  const type  = searchParams.get('type') || '';

  let results = [...MOCK_HOSPITALS];

  if (type) {
    results = results.filter((h) => h.type.toLowerCase() === type.toLowerCase());
  }

  const total = results.length;
  const data  = results.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
}