import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DOCTORS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query         = searchParams.get('query')?.toLowerCase() || '';
  const specialtyId   = searchParams.get('specialtyId') || searchParams.get('specialtySlug') || '';
  const districtId    = searchParams.get('districtId') || '';
  const gender        = searchParams.get('gender') || '';
  const minFee        = searchParams.get('minFee') ? parseInt(searchParams.get('minFee')!) : undefined;
  const maxFee        = searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')!) : undefined;
  const minExp        = searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience')!) : undefined;
  const isOnline      = searchParams.get('isAvailableOnline');
  const sortBy        = searchParams.get('sortBy') || 'relevance';
  const page          = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit         = Math.min(50, parseInt(searchParams.get('limit') || '12'));

  let results = [...MOCK_DOCTORS];

  // Text search
  if (query) {
    results = results.filter((d) => {
      const specialtyMatch = d.specialties.some((s) =>
        s.specialty.name.toLowerCase().includes(query) ||
        (s.specialty.nameBn ? s.specialty.nameBn.includes(query) : false)
      );
      const qualMatch = d.qualifications.some((q) =>
        q.degree.toLowerCase().includes(query) ||
        (q.institution ? q.institution.toLowerCase().includes(query) : false)
      );
      return (
        d.name.toLowerCase().includes(query) ||
        (d.nameBn && d.nameBn.includes(query)) ||
        specialtyMatch ||
        qualMatch
      );
    });
  }

  // Specialty filter
  if (specialtyId) {
    results = results.filter((d) =>
      d.specialties.some(
        (s) => s.specialtyId === specialtyId || s.specialty.slug === specialtyId
      )
    );
  }

  // District filter
  if (districtId) {
    results = results.filter((d) =>
      d.district?.id === districtId ||
      d.district?.slug === districtId ||
      d.district?.name.toLowerCase() === districtId.toLowerCase()
    );
  }

  // Gender filter
  if (gender) {
    results = results.filter((d) => d.gender === gender);
  }

  // Fee filter
  if (minFee !== undefined) {
    results = results.filter((d) => d.consultationFee >= minFee);
  }
  if (maxFee !== undefined) {
    results = results.filter((d) => d.consultationFee <= maxFee);
  }

  // Experience filter
  if (minExp !== undefined) {
    results = results.filter((d) => d.experience >= minExp);
  }

  // Online filter
  if (isOnline === 'true') {
    results = results.filter((d) => d.isAvailableOnline);
  }

  // Sort
  switch (sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'experience':
      results.sort((a, b) => b.experience - a.experience);
      break;
    case 'fee_low':
      results.sort((a, b) => a.consultationFee - b.consultationFee);
      break;
    case 'fee_high':
      results.sort((a, b) => b.consultationFee - a.consultationFee);
      break;
    case 'popular':
      results.sort((a, b) => b.totalAppointments - a.totalAppointments);
      break;
    case 'newest':
      results.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default: // relevance — sponsored first, then featured, then rating
      results.sort((a, b) => {
        if (a.sponsoredRank && b.sponsoredRank) return a.sponsoredRank - b.sponsoredRank;
        if (a.sponsoredRank) return -1;
        if (b.sponsoredRank) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.rating - a.rating;
      });
  }

  const total = results.length;
  const data  = results.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    query: query || undefined,
    filters: { specialtyId, districtId, gender, minFee, maxFee },
  });
}