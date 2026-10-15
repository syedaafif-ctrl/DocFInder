// apps/web/src/lib/admin.ts
// Administrative API Client for Swastha BD

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface AdminStats {
  doctors: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  hospitals: {
    total: number;
  };
  appointments: {
    total: number;
    pending: number;
    completed: number;
  };
  users: {
    total: number;
    patients: number;
  };
  revenue: {
    grossAmount: number;
  };
  recentAppointments: Array<{
    id: string;
    appointmentNumber: string;
    appointmentDate: string;
    slotTime: string;
    status: string;
    totalAmount: number;
    patientName: string;
    doctor: {
      id: string;
      name: string;
      slug: string;
      title?: string | null;
      photo?: string | null;
    };
  }>;
  pendingDoctorQueue: Array<{
    id: string;
    name: string;
    slug: string;
    bmdcNumber?: string | null;
    createdAt: string;
    specialties: Array<{ specialty: { name: string } }>;
    district?: { name: string } | null;
  }>;
}

export async function getAdminStatsApi(token: string): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
  return data;
}

export async function getAdminDoctorsApi(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    verificationStatus?: string;
    isFeatured?: boolean;
  }
) {
  const url = new URL(`${API_BASE}/admin/doctors`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.verificationStatus) url.searchParams.set('verificationStatus', params.verificationStatus);
  if (params?.isFeatured !== undefined) url.searchParams.set('isFeatured', String(params.isFeatured));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load doctors');
  return data;
}

export async function updateDoctorStatusApi(doctorId: string, status: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update doctor status');
  return data;
}

export async function updateDoctorVerificationApi(
  doctorId: string,
  verificationStatus: string,
  bmdcVerified: boolean,
  token: string
) {
  const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/verification`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ verificationStatus, bmdcVerified }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update doctor verification');
  return data;
}

export async function toggleDoctorFeaturedApi(doctorId: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/featured`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle doctor featured status');
  return data;
}

export async function getAdminHospitalsApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string }
) {
  const url = new URL(`${API_BASE}/admin/hospitals`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load hospitals');
  return data;
}

export async function toggleHospitalFeaturedApi(hospitalId: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/hospitals/${hospitalId}/featured`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle hospital featured status');
  return data;
}

export async function toggleHospitalVerifiedApi(hospitalId: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/hospitals/${hospitalId}/verified`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle hospital verification status');
  return data;
}

export async function getAdminAppointmentsApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string; status?: string }
) {
  const url = new URL(`${API_BASE}/admin/appointments`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status) url.searchParams.set('status', params.status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load appointments');
  return data;
}

export async function getAdminUsersApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }
) {
  const url = new URL(`${API_BASE}/admin/users`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.role) url.searchParams.set('role', params.role);
  if (params?.status) url.searchParams.set('status', params.status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load users');
  return data;
}

export async function updateUserStatusApi(userId: string, status: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user status');
  return data;
}

export async function getAdminReviewsApi(
  token: string,
  params?: { page?: number; limit?: number; status?: string }
) {
  const url = new URL(`${API_BASE}/admin/reviews`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.status) url.searchParams.set('status', params.status);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load reviews');
  return data;
}

export async function updateReviewStatusApi(reviewId: string, status: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/reviews/${reviewId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update review status');
  return data;
}
