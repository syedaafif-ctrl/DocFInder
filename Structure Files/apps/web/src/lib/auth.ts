// apps/web/src/lib/auth.ts
// Frontend authentication client for Swastha BD NestJS API

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface User {
  id: string;
  name: string;
  nameBn?: string | null;
  email: string;
  phone?: string | null;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN' | 'CONTENT_MANAGER';
  status?: string;
  avatar?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dateOfBirth?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  preferredLanguage?: string;
  doctor?: {
    id: string;
    slug: string;
    title?: string | null;
    isVerified?: boolean;
    status?: string;
    bmdcNumber?: string | null;
    bmdcVerified?: boolean;
  } | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'PATIENT' | 'DOCTOR';
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }

  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to register account');
  }

  return data;
}

export async function getProfileApi(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Session expired or invalid');
  }

  return res.json();
}

export async function refreshTokenApi(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error('Refresh token invalid');
  }

  return res.json();
}

// Appointments API Client
export interface CreateAppointmentPayload {
  doctorId: string;
  chamberId?: string;
  hospitalId?: string;
  departmentId?: string;
  appointmentDate: string;
  slotTime: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  symptoms?: string;
  notes?: string;
}

export async function getDoctorSlotsApi(doctorId: string, date: string, chamberId?: string, hospitalId?: string) {
  const url = new URL(API_BASE + '/appointments/doctor/' + doctorId + '/slots');
  url.searchParams.set('date', date);
  if (chamberId) url.searchParams.set('chamberId', chamberId);
  if (hospitalId) url.searchParams.set('hospitalId', hospitalId);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load available slots');
  return data;
}

export async function bookAppointmentApi(payload: CreateAppointmentPayload, token: string) {
  const res = await fetch(API_BASE + '/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to book appointment');
  }
  return data;
}

export async function getMyAppointmentsApi(token: string, status?: string) {
  const url = new URL(API_BASE + '/appointments/my');
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load appointments');
  return data;
}

export async function cancelAppointmentApi(id: string, reason: string, token: string) {
  const res = await fetch(API_BASE + '/appointments/' + id + '/cancel', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ reason }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel appointment');
  return data;
}

// Patient Dashboard & Profile APIs
export interface PatientStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  savedDoctorsCount: number;
  nextAppointment: {
    id: string;
    appointmentNumber: string;
    appointmentDate: string;
    slotTime: string;
    type: string;
    status: string;
    doctor: {
      id: string;
      name: string;
      nameBn?: string | null;
      slug: string;
      title?: string | null;
      photo?: string | null;
      consultationFee: number;
      specialties?: Array<{ specialty: { id: string; name: string; nameBn?: string | null } }>;
    };
    chamber?: {
      id: string;
      name: string;
      address?: string | null;
      hospital?: { id: string; name: string; slug: string } | null;
    } | null;
    hospital?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
}

export interface UpdatePatientProfilePayload {
  name?: string;
  nameBn?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  preferredLanguage?: string;
  avatar?: string;
}

export async function getPatientStatsApi(token: string): Promise<PatientStats> {
  const res = await fetch(`${API_BASE}/patients/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load dashboard statistics');
  return data;
}

export async function getPatientProfileApi(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/patients/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load patient profile');
  return data;
}

export async function updatePatientProfileApi(payload: UpdatePatientProfilePayload, token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/patients/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to update profile');
  }
  return data;
}

export async function getSavedDoctorsApi(token: string) {
  const res = await fetch(`${API_BASE}/patients/saved-doctors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load saved doctors');
  return data;
}

export async function saveDoctorApi(doctorId: string, token: string) {
  const res = await fetch(`${API_BASE}/patients/saved-doctors/${doctorId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save doctor');
  return data;
}

export async function unsaveDoctorApi(doctorId: string, token: string) {
  const res = await fetch(`${API_BASE}/patients/saved-doctors/${doctorId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to remove saved doctor');
  return data;
}

export async function checkDoctorSavedApi(doctorId: string, token: string): Promise<{ isSaved: boolean }> {
  const res = await fetch(`${API_BASE}/patients/saved-doctors/check/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to check doctor bookmark status');
  return data;
}