import { useQuery } from '@tanstack/react-query';
import {
  fetchDoctors,
  fetchFeaturedDoctors,
  fetchTrendingDoctors,
  fetchDoctorBySlug,
  fetchDoctorSlots,
} from '@/lib/api';
import type { SearchFilters } from '@/types';

// ─── Keys ────────────────────────────────────────────────

export const doctorKeys = {
  all:      () => ['doctors'] as const,
  lists:    () => [...doctorKeys.all(), 'list'] as const,
  list:     (p: { page?: number; limit?: number }) => [...doctorKeys.lists(), p] as const,
  featured: () => [...doctorKeys.all(), 'featured'] as const,
  trending: () => [...doctorKeys.all(), 'trending'] as const,
  detail:   (slug: string) => [...doctorKeys.all(), 'detail', slug] as const,
  slots:    (doctorId: string, chamberId: string, date: string) =>
    [...doctorKeys.all(), 'slots', doctorId, chamberId, date] as const,
};

// ─── Hooks ───────────────────────────────────────────────

export function useDoctors(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn:  () => fetchDoctors(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useFeaturedDoctors() {
  return useQuery({
    queryKey: doctorKeys.featured(),
    queryFn:  fetchFeaturedDoctors,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrendingDoctors() {
  return useQuery({
    queryKey: doctorKeys.trending(),
    queryFn:  fetchTrendingDoctors,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorDetail(slug: string) {
  return useQuery({
    queryKey: doctorKeys.detail(slug),
    queryFn:  () => fetchDoctorBySlug(slug),
    enabled:  !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorSlots(
  doctorId: string,
  chamberId: string,
  date: string
) {
  return useQuery({
    queryKey: doctorKeys.slots(doctorId, chamberId, date),
    queryFn:  () => fetchDoctorSlots(doctorId, chamberId, date),
    enabled:  !!(doctorId && chamberId && date),
    staleTime: 30 * 1000,
  });
}