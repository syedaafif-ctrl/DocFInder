import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: {
      specialties: {
        include: {
          specialty: true,
        },
      },
      hospitals: {
        include: {
          hospital: true,
        },
      },
      district: true,
    },
  });

  return NextResponse.json(doctors);
}