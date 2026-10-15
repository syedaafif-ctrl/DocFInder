// apps/web/src/lib/doctor.ts
// Doctor Portal API Client for Swastha BD

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface DoctorStats {
  doctor: {
    id: string;
    name: string;
    title?: string | null;
    photo?: string | null;
    slug: string;
    consultationFee: number;
  };
  metrics: {
    todayPatients: number;
    pendingApprovals: number;
    confirmedUpcoming: number;
    completedConsultations: number;
    totalBookings: number;
    totalChambers: number;
    earnedRevenue: number;
  };
}

export interface DoctorChamber {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  appointmentFee?: number | null;
  isMain: boolean;
  hospital?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  area?: {
    id: string;
    name: string;
  } | null;
  schedules?: Array<{
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    maxPatients: number;
    isClosed: boolean;
  }>;
  _count?: {
    appointments: number;
  };
}

export interface DoctorAppointment {
  id: string;
  appointmentNumber: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  appointmentDate: string;
  slotTime: string;
  symptoms?: string | null;
  notes?: string | null;
  consultationNotes?: string | null;
  patientName: string;
  patientPhone: string;
  patientAge?: number | null;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  consultationFee: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  chamber?: {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    hospital?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
  hospital?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function getDoctorStatsApi(token: string): Promise<DoctorStats> {
  const res = await fetch(`${API_BASE}/appointments/doctor/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch doctor dashboard statistics');
  return data;
}

export async function getDoctorChambersApi(token: string): Promise<DoctorChamber[]> {
  const res = await fetch(`${API_BASE}/appointments/doctor/chambers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load practice chambers');
  return data;
}

export async function getDoctorAppointmentsApi(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    chamberId?: string;
    status?: string;
    dateScope?: string; // 'today' | 'upcoming' | 'past' | 'all'
    search?: string;
  }
): Promise<{ data: DoctorAppointment[]; total: number; page: number; limit: number; totalPages: number }> {
  const url = new URL(`${API_BASE}/appointments/doctor/my`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.chamberId) url.searchParams.set('chamberId', params.chamberId);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.dateScope) url.searchParams.set('dateScope', params.dateScope);
  if (params?.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load doctor appointments');
  return data;
}

export async function confirmDoctorAppointmentApi(id: string, token: string) {
  const res = await fetch(`${API_BASE}/appointments/${id}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to confirm appointment');
  return data;
}

export async function cancelDoctorAppointmentApi(id: string, reason: string, token: string) {
  const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel appointment');
  return data;
}

export async function completeDoctorAppointmentApi(id: string, notes: string | undefined, token: string) {
  const res = await fetch(`${API_BASE}/appointments/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark appointment completed');
  return data;
}
