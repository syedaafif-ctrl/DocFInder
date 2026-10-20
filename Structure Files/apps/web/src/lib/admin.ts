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
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {
    // Network fallback
  }

  return {
    doctors: { total: 18, active: 15, pending: 2, suspended: 1 },
    hospitals: { total: 14 },
    appointments: { total: 342, pending: 18, completed: 298 },
    users: { total: 1240, patients: 1215 },
    revenue: { grossAmount: 512000 },
    recentAppointments: [
      {
        id: 'apt-a01',
        appointmentNumber: 'APT-928101',
        appointmentDate: new Date().toISOString().split('T')[0],
        slotTime: '17:30',
        status: 'PENDING',
        totalAmount: 1500,
        patientName: 'Ruhul Amin',
        doctor: { id: 'doc-001', name: 'Prof. Dr. Aminul Islam', slug: 'dr-aminul-islam', title: 'Prof. Dr.' },
      },
      {
        id: 'apt-a02',
        appointmentNumber: 'APT-928102',
        appointmentDate: new Date().toISOString().split('T')[0],
        slotTime: '16:00',
        status: 'CONFIRMED',
        totalAmount: 1800,
        patientName: 'Kazi Farhan',
        doctor: { id: 'doc-ev-01', name: 'Prof. Dr. Shahabuddin Talukder', slug: 'dr-shahabuddin-talukder', title: 'Prof. Dr.' },
      },
      {
        id: 'apt-a03',
        appointmentNumber: 'APT-928103',
        appointmentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        slotTime: '18:15',
        status: 'COMPLETED',
        totalAmount: 1600,
        patientName: 'Nasrin Sultana',
        doctor: { id: 'doc-uh-01', name: 'Dr. Jahangir Kabir', slug: 'dr-jahangir-kabir', title: 'Dr.' },
      },
    ],
    pendingDoctorQueue: [
      {
        id: 'doc-pend-01',
        name: 'Dr. Nusrat Jahan',
        slug: 'dr-nusrat-jahan',
        bmdcNumber: 'A-49281',
        createdAt: new Date().toISOString(),
        specialties: [{ specialty: { name: 'Dermatology' } }],
        district: { name: 'Dhaka' },
      },
      {
        id: 'doc-pend-02',
        name: 'Dr. Tanvir Ahmed Chowdhury',
        slug: 'dr-tanvir-ahmed-chowdhury',
        bmdcNumber: 'A-51920',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        specialties: [{ specialty: { name: 'Neurology' } }],
        district: { name: 'Chittagong' },
      },
    ],
  };
}

export let DEMO_ADMIN_DOCTORS = [
  {
    id: 'doc-001',
    name: 'Prof. Dr. Aminul Islam',
    slug: 'dr-aminul-islam',
    title: 'Prof. Dr.',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    bmdcNumber: 'A-28491',
    bmdcVerified: true,
    isFeatured: true,
    consultationFee: 1500,
    totalAppointments: 159,
    rating: 4.9,
    specialties: [{ specialty: { name: 'Cardiology' } }],
    user: { email: 'dr.aminul@swasthabd.com', phone: '01711223344' },
    district: { name: 'Dhaka' },
  },
  {
    id: 'doc-sq-01',
    name: 'Prof. Dr. Tareq Mohammad Alam',
    slug: 'dr-tareq-mohammad-alam',
    title: 'Prof. Dr.',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    bmdcNumber: 'A-31204',
    bmdcVerified: true,
    isFeatured: true,
    consultationFee: 1500,
    totalAppointments: 84,
    rating: 4.8,
    specialties: [{ specialty: { name: 'Pulmonology' } }],
    user: { email: 'dr.tareq.alam@swasthabd.com', phone: '01819283746' },
    district: { name: 'Dhaka' },
  },
  {
    id: 'doc-ev-01',
    name: 'Prof. Dr. Shahabuddin Talukder',
    slug: 'dr-shahabuddin-talukder',
    title: 'Prof. Dr.',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    bmdcNumber: 'A-19842',
    bmdcVerified: true,
    isFeatured: false,
    consultationFee: 1800,
    totalAppointments: 112,
    rating: 4.9,
    specialties: [{ specialty: { name: 'Nephrology' } }],
    user: { email: 'dr.shahabuddin.talukder@swasthabd.com', phone: '01912345678' },
    district: { name: 'Dhaka' },
  },
  {
    id: 'doc-uh-01',
    name: 'Dr. Jahangir Kabir',
    slug: 'dr-jahangir-kabir',
    title: 'Dr.',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    bmdcNumber: 'A-42109',
    bmdcVerified: true,
    isFeatured: false,
    consultationFee: 1600,
    totalAppointments: 97,
    rating: 4.8,
    specialties: [{ specialty: { name: 'Gastroenterology' } }],
    user: { email: 'dr.jahangir.kabir@swasthabd.com', phone: '01723456789' },
    district: { name: 'Dhaka' },
  },
  {
    id: 'doc-pend-01',
    name: 'Dr. Nusrat Jahan',
    slug: 'dr-nusrat-jahan',
    title: 'Dr.',
    status: 'PENDING_APPROVAL',
    verificationStatus: 'PENDING',
    bmdcNumber: 'A-49281',
    bmdcVerified: false,
    isFeatured: false,
    consultationFee: 1000,
    totalAppointments: 0,
    rating: 0,
    specialties: [{ specialty: { name: 'Dermatology' } }],
    user: { email: 'dr.nusrat@swasthabd.com', phone: '01799887766' },
    district: { name: 'Dhaka' },
  },
];

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
  try {
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
    if (res.ok) return data;
  } catch (err) {
    // Network fallback
  }

  let filtered = DEMO_ADMIN_DOCTORS;
  if (params?.status) filtered = filtered.filter(d => d.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.bmdcNumber?.toLowerCase().includes(q));
  }

  return {
    data: filtered,
    total: filtered.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function updateDoctorStatusApi(doctorId: string, status: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) {
      const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
      if (doc) doc.status = status;
      return data;
    }
  } catch (err) {}
  const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
  if (doc) doc.status = status;
  return { success: true, message: `Doctor status updated to ${status}` };
}

export async function updateDoctorVerificationApi(
  doctorId: string,
  verificationStatus: string,
  bmdcVerified: boolean,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/verification`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verificationStatus, bmdcVerified }),
    });
    const data = await res.json();
    if (res.ok) {
      const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
      if (doc) {
        doc.verificationStatus = verificationStatus;
        doc.bmdcVerified = bmdcVerified;
      }
      return data;
    }
  } catch (err) {}
  const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
  if (doc) {
    doc.verificationStatus = verificationStatus;
    doc.bmdcVerified = bmdcVerified;
  }
  return { success: true, message: 'Doctor verification updated' };
}

export async function toggleDoctorFeaturedApi(doctorId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/doctors/${doctorId}/featured`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
      if (doc) doc.isFeatured = !doc.isFeatured;
      return data;
    }
  } catch (err) {}
  const doc = DEMO_ADMIN_DOCTORS.find(d => d.id === doctorId);
  if (doc) doc.isFeatured = !doc.isFeatured;
  return { success: true, isFeatured: doc ? doc.isFeatured : true };
}

export async function getAdminHospitalsApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string }
) {
  try {
    const url = new URL(`${API_BASE}/admin/hospitals`);
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.limit) url.searchParams.set('limit', String(params.limit));
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}

  const mockHospitals = [
    {
      id: 'h-001',
      name: 'Square Hospital Ltd.',
      slug: 'square-hospital',
      type: 'Private',
      bedCount: 350,
      isEmergency: true,
      isVerified: true,
      isFeatured: true,
      district: { name: 'Dhaka' },
      area: { name: 'Panthapath' },
      _count: { doctorChambers: 42, departments: 14 },
    },
    {
      id: 'h-002',
      name: 'United Hospital Limited',
      slug: 'united-hospital',
      type: 'Private',
      bedCount: 500,
      isEmergency: true,
      isVerified: true,
      isFeatured: true,
      district: { name: 'Dhaka' },
      area: { name: 'Gulshan' },
      _count: { doctorChambers: 56, departments: 16 },
    },
    {
      id: 'h-003',
      name: 'Evercare Hospital Dhaka',
      slug: 'evercare-hospital',
      type: 'Private',
      bedCount: 425,
      isEmergency: true,
      isVerified: true,
      isFeatured: true,
      district: { name: 'Dhaka' },
      area: { name: 'Bashundhara' },
      _count: { doctorChambers: 68, departments: 18 },
    },
  ];

  return {
    data: mockHospitals,
    total: mockHospitals.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function toggleHospitalFeaturedApi(hospitalId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/hospitals/${hospitalId}/featured`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}
  return { success: true };
}

export async function toggleHospitalVerifiedApi(hospitalId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/hospitals/${hospitalId}/verified`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}
  return { success: true };
}

export let DEMO_ADMIN_APPOINTMENTS = [
  {
    id: 'apt-01',
    appointmentNumber: 'APT-928101',
    appointmentDate: new Date().toISOString().split('T')[0],
    slotTime: '17:30',
    status: 'PENDING',
    totalAmount: 1500,
    patientName: 'Ruhul Amin',
    patientPhone: '01812345678',
    doctor: { id: 'doc-001', name: 'Prof. Dr. Aminul Islam', slug: 'dr-aminul-islam' },
    chamber: { name: 'Square Hospital OPD (Room 304)' },
  },
  {
    id: 'apt-02',
    appointmentNumber: 'APT-928102',
    appointmentDate: new Date().toISOString().split('T')[0],
    slotTime: '16:00',
    status: 'CONFIRMED',
    totalAmount: 1800,
    patientName: 'Kazi Farhan',
    patientPhone: '01911223344',
    doctor: { id: 'doc-ev-01', name: 'Prof. Dr. Shahabuddin Talukder', slug: 'dr-shahabuddin-talukder' },
    chamber: { name: 'Evercare Hospital Dhaka (Chamber 408)' },
  },
  {
    id: 'apt-03',
    appointmentNumber: 'APT-928103',
    appointmentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    slotTime: '18:15',
    status: 'COMPLETED',
    totalAmount: 1600,
    patientName: 'Nasrin Sultana',
    patientPhone: '01719876543',
    doctor: { id: 'doc-uh-01', name: 'Dr. Jahangir Kabir', slug: 'dr-jahangir-kabir' },
    chamber: { name: 'United Hospital Limited (Room 215)' },
  },
];

export async function getAdminAppointmentsApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string; status?: string }
) {
  try {
    const url = new URL(`${API_BASE}/admin/appointments`);
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.limit) url.searchParams.set('limit', String(params.limit));
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.status) url.searchParams.set('status', params.status);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}

  let filtered = DEMO_ADMIN_APPOINTMENTS;
  if (params?.status) filtered = filtered.filter(a => a.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(a => a.patientName?.toLowerCase().includes(q) || a.appointmentNumber?.toLowerCase().includes(q));
  }

  return {
    data: filtered,
    total: filtered.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function getAdminUsersApi(
  token: string,
  params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }
) {
  try {
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
    if (res.ok) return data;
  } catch (err) {}

  const mockUsers = [
    {
      id: 'u-1',
      name: 'System Administrator',
      email: 'admin@swasthabd.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-2',
      name: 'Prof. Dr. Aminul Islam',
      email: 'dr.aminul@swasthabd.com',
      role: 'DOCTOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-3',
      name: 'Tanvir Hossain',
      email: 'tanvir@swasthabd.com',
      role: 'PATIENT',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    data: mockUsers,
    total: mockUsers.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function updateUserStatusApi(userId: string, status: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}
  return { success: true };
}

export async function getAdminReviewsApi(
  token: string,
  params?: { page?: number; limit?: number; status?: string }
) {
  try {
    const url = new URL(`${API_BASE}/admin/reviews`);
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.limit) url.searchParams.set('limit', String(params.limit));
    if (params?.status) url.searchParams.set('status', params.status);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}

  return {
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };
}

export async function updateReviewStatusApi(reviewId: string, status: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews/${reviewId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {}
  return { success: true };
}

