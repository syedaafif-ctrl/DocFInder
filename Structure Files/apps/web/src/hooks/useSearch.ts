import { useQuery } from '@tanstack/react-query';
import { searchDoctors, fetchAutocomplete } from '@/lib/api';
import { useDebounce } from './useDebounce';
import type { SearchFilters } from '@/types';

export const searchKeys = {
  all:          () => ['search'] as const,
  results:      (f: SearchFilters) => [...searchKeys.all(), 'results', f] as const,
  autocomplete: (q: string) => [...searchKeys.all(), 'autocomplete', q] as const,
  popular:      () => [...searchKeys.all(), 'popular'] as const,
};

export function useSearchDoctors(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: searchKeys.results(filters),
    queryFn:  () => searchDoctors(filters),
    enabled:  enabled,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useAutocomplete(query: string) {
  const debounced = useDebounce(query, 300);

  return useQuery({
    queryKey: searchKeys.autocomplete(debounced),
    queryFn:  () => fetchAutocomplete(debounced),
    enabled:  debounced.length >= 2,
    staleTime: 60 * 1000,
  });
}