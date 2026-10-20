import { NextRequest, NextResponse } from 'next/server';
import { getDoctorsByHospitalAndDepartment } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hospitalId = searchParams.get('hospitalId') || '';
  const department = searchParams.get('department') || '';

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const params = new URLSearchParams();
      if (hospitalId) params.set('hospitalId', hospitalId);
      if (department) params.set('query', department);
      params.set('limit', '50');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/search?${params}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {}
  }

  const doctors = getDoctorsByHospitalAndDepartment(hospitalId, department);
  return NextResponse.json({
    data: doctors,
    total: doctors.length,
    page: 1,
    limit: 50,
  });
}