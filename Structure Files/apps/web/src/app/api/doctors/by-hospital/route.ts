import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hospitalId = searchParams.get('hospitalId');
  const department = searchParams.get('department');

  const params = new URLSearchParams();
  if (hospitalId) params.set('hospitalId', hospitalId);
  if (department) params.set('query', department);
  params.set('limit', '50');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors/search?${params}`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  return NextResponse.json(data);
}