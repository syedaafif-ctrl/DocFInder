// ============================================================
// DocHub BD — API Layer
// Axios instance + typed request functions
// In dev, calls go to Next.js API routes (/api/*)
// In prod, routes proxy to NestJS backend at NEXT_PUBLIC_API_URL
// ============================================================

import axios from 'axios';
import type {
  DoctorListItem,
  Doctor,
  PaginatedResponse,
  DoctorSearchResponse,
  SearchFilters,
  SlotResponse,
} from '@/types';

// ─── Axios instance ───────────────────────────────────────

const api = axios.create({
  baseURL: '/api', // hits Next.js API routes
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token injection (for future use)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('dochub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Error normalisation
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Doctors ─────────────────────────────────────────────

export async function fetchDoctors(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DoctorListItem>> {
  const { data } = await api.get('/doctors', { params });
  return data;
}

export async function searchDoctors(
  filters: SearchFilters
): Promise<DoctorSearchResponse> {
  // Strip undefined/empty values
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') {
      clean[k] = v as string | number | boolean;
    }
  }
  const { data } = await api.get('/doctors/search', { params: clean });
  return data;
}

export async function fetchFeaturedDoctors(): Promise<DoctorListItem[]> {
  const { data } = await api.get('/doctors/featured');
  return data;
}

export async function fetchTrendingDoctors(): Promise<DoctorListItem[]> {
  const { data } = await api.get('/doctors/trending');
  return data;
}

export async function fetchDoctorBySlug(slug: string): Promise<Doctor> {
  const { data } = await api.get(`/doctors/${slug}`);
  return data;
}

export async function fetchDoctorSlots(
  doctorId: string,
  chamberId: string,
  date: string
): Promise<SlotResponse> {
  const { data } = await api.get(`/doctors/${doctorId}/slots`, {
    params: { chamberId, date },
  });
  return data;
}

// ─── Search / Autocomplete ────────────────────────────────

export async function fetchAutocomplete(query: string) {
  if (!query || query.length < 2) return { suggestions: [] };
  const { data } = await api.get('/search/autocomplete', { params: { q: query } });
  return data;
}

export async function fetchPopularSearches() {
  const { data } = await api.get('/search/popular');
  return data;
}

// ─── Specialties ──────────────────────────────────────────

export async function fetchSpecialties() {
  const { data } = await api.get('/specialties');
  return data;
}

// ─── Hospitals ────────────────────────────────────────────

export async function fetchHospitals(params?: {
  page?: number;
  limit?: number;
  districtId?: string;
  type?: string;
  isFeatured?: boolean;
}) {
  const { data } = await api.get('/hospitals', { params });
  return data;
}

// ─── Appointments ─────────────────────────────────────────

export async function bookAppointment(payload: {
  doctorId: string;
  chamberId: string;
  appointmentDate: string;
  slotTime: string;
  type: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  symptoms?: string;
}) {
  const { data } = await api.post('/appointments', payload);
  return data;
}

export async function fetchMyAppointments(params?: {
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get('/appointments/me', { params });
  return data;
}

export async function cancelAppointment(id: string, reason?: string) {
  const { data } = await api.patch(`/appointments/${id}/cancel`, { reason });
  return data;
}

export default api;