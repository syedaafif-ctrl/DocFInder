import { NextResponse } from 'next/server';
import { MOCK_DOCTORS } from '@/lib/mockData';

export async function GET() {
  const featured = MOCK_DOCTORS.filter((d) => d.isFeatured)
    .sort((a, b) => {
      if (a.sponsoredRank && b.sponsoredRank) return a.sponsoredRank - b.sponsoredRank;
      if (a.sponsoredRank) return -1;
      if (b.sponsoredRank) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 8);

  return NextResponse.json(featured);
}