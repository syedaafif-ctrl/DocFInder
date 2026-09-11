import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DOCTORS } from '@/lib/mockData';
import { SPECIALTIES } from '@/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const doctors = MOCK_DOCTORS
    .filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.specialties.some((s) => s.specialty.name.toLowerCase().includes(q))
    )
    .slice(0, 4)
    .map((d) => ({
      type: 'doctor',
      id: d.id,
      name: d.name,
      slug: d.slug,
      photo: d.photo,
      specialty: d.specialties[0]?.specialty.name,
      district: d.district?.name,
    }));

  const specialties = SPECIALTIES
    .filter((s) => s.name.toLowerCase().includes(q) || s.nameBn.includes(q))
    .slice(0, 3)
    .map((s) => ({
      type: 'specialty',
      id: s.id,
      name: s.name,
      nameBn: s.nameBn,
      slug: s.slug,
    }));

  return NextResponse.json({ suggestions: [...doctors, ...specialties] });
}