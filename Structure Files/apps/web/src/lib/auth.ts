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
