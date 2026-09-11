import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DOCTOR_DETAIL, MOCK_DOCTORS } from '@/lib/mockData';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Check full detail map first
  if (MOCK_DOCTOR_DETAIL[slug]) {
    return NextResponse.json(MOCK_DOCTOR_DETAIL[slug]);
  }

  // Fall back to list item (partial data)
  const doctor = MOCK_DOCTORS.find((d) => d.slug === slug);
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }

  return NextResponse.json(doctor);
}