// apps/web/src/lib/utils.ts
// DocFinder BD — Production utility functions
// Compatible with Next.js 15, Tailwind CSS, and all existing components

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  Doctor,
  DoctorSpecialty,
  Chamber,
  ChamberSchedule,
  DayOfWeek,
} from '@/types';

// ============================================================
// TAILWIND CLASS MERGING
// ============================================================

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Used throughout all components as `cn(...)`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================
// CURRENCY FORMATTING
// ============================================================

/**
 * Formats a BDT amount into a human-readable string.
 * @example formatCurrency(1500) → "৳1,500"
 * @example formatCurrency(1500, { compact: true }) → "৳1.5K"
 */
export function formatCurrency(
  amount: number,
  options: {
    compact?: boolean;
    symbol?: string;
    locale?: string;
  } = {}
): string {
  const { compact = false, symbol = '৳', locale = 'en-BD' } = options;

  if (isNaN(amount) || amount == null) return `${symbol}0`;

  if (compact) {
    if (amount >= 100_000) return `${symbol}${(amount / 100_000).toFixed(1)}L`;
    if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`;
    return `${symbol}${amount}`;
  }

  return `${symbol}${new Intl.NumberFormat(locale).format(amount)}`;
}

// ============================================================
// EXPERIENCE FORMATTING
// ============================================================

/**
 * Formats years of experience into a readable label.
 * @example formatExperience(1) → "1 year experience"
 * @example formatExperience(18) → "18 years experience"
 * @example formatExperience(0) → "New doctor"
 */
export function formatExperience(years: number): string {
  if (!years || years <= 0) return 'New doctor';
  if (years === 1) return '1 year experience';
  return `${years} years experience`;
}

/**
 * Returns a short badge label for experience.
 * @example formatExperienceShort(18) → "18 yrs exp"
 */
export function formatExperienceShort(years: number): string {
  if (!years || years <= 0) return 'New';
  return `${years} yrs exp`;
}

// ============================================================
// DOCTOR SPECIALTY HELPERS
// ============================================================

/**
 * Returns the primary specialty of a doctor, or the first specialty if none is marked primary.
 * Returns undefined if the doctor has no specialties.
 */
export function getPrimarySpecialty(doctor: Pick<Doctor, 'specialties'>): DoctorSpecialty | undefined {
  if (!doctor.specialties || doctor.specialties.length === 0) return undefined;
  return (
    doctor.specialties.find((s) => s.isPrimary) ?? doctor.specialties[0]
  );
}

/**
 * Returns the display name of the primary specialty.
 * Falls back to 'General Physician' if none found.
 */
export function getPrimarySpecialtyName(doctor: Pick<Doctor, 'specialties'>, lang: 'en' | 'bn' = 'en'): string {
  const primary = getPrimarySpecialty(doctor);
  if (!primary) return 'General Physician';
  return lang === 'bn' ? primary.specialty.nameBn : primary.specialty.name;
}

/**
 * Returns an array of all specialty names for a doctor.
 */
export function getAllSpecialtyNames(doctor: Pick<Doctor, 'specialties'>, lang: 'en' | 'bn' = 'en'): string[] {
  if (!doctor.specialties?.length) return [];
  return doctor.specialties.map((s) =>
    lang === 'bn' ? s.specialty.nameBn : s.specialty.name
  );
}

// ============================================================
// CHAMBER / LOCATION HELPERS
// ============================================================

/**
 * Returns the main chamber of a doctor (isMain = true), or the first chamber if none is marked main.
 */
export function getMainChamber(doctor: Pick<Doctor, 'chambers'>): Chamber | undefined {
  if (!doctor.chambers || doctor.chambers.length === 0) return undefined;
  return doctor.chambers.find((c) => c.isMain) ?? doctor.chambers[0];
}

/**
 * Returns the area name of the main chamber.
 * Falls back to the chamber address if no area is linked.
 */
export function getMainChamberArea(doctor: Pick<Doctor, 'chambers'>, lang: 'en' | 'bn' = 'en'): string | undefined {
  const chamber = getMainChamber(doctor);
  if (!chamber) return undefined;
  if (chamber.area) {
    return lang === 'bn' ? chamber.area.nameBn : chamber.area.name;
  }
  return chamber.address;
}

/**
 * Returns the full address of the main chamber.
 */
export function getMainChamberAddress(doctor: Pick<Doctor, 'chambers'>, lang: 'en' | 'bn' = 'en'): string | undefined {
  const chamber = getMainChamber(doctor);
  if (!chamber) return undefined;
  return lang === 'bn' ? (chamber.addressBn ?? chamber.address) : chamber.address;
}

// ============================================================
// AVAILABILITY / SCHEDULE HELPERS
// ============================================================

const DAY_ORDER: DayOfWeek[] = [
  'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY',
];

const DAY_SHORT: Record<DayOfWeek, string> = {
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
};

/**
 * Returns the available (non-closed) days from the main chamber's schedules,
 * sorted in Bangladesh week order (Sat → Fri).
 */
export function getDoctorAvailabilityDays(doctor: Pick<Doctor, 'chambers'>): DayOfWeek[] {
  const chamber = getMainChamber(doctor);
  if (!chamber || !chamber.schedules?.length) return [];

  const activeDays = chamber.schedules
    .filter((s: ChamberSchedule) => !s.isClosed)
    .map((s: ChamberSchedule) => s.day);

  return DAY_ORDER.filter((day) => activeDays.includes(day));
}

/**
 * Returns human-readable short day labels for available days.
 * @example ["Sat", "Sun", "Mon", ...]
 */
export function getDoctorAvailabilityLabels(doctor: Pick<Doctor, 'chambers'>): string[] {
  return getDoctorAvailabilityDays(doctor).map((d) => DAY_SHORT[d]);
}

/**
 * Returns a compact availability string like "Sat – Thu" or "Mon, Wed, Fri".
 */
export function getAvailabilitySummary(doctor: Pick<Doctor, 'chambers'>): string {
  const days = getDoctorAvailabilityDays(doctor);
  if (!days.length) return 'Not available';

  const labels = days.map((d) => DAY_SHORT[d]);

  // Check if it's a contiguous range
  const indices = days.map((d) => DAY_ORDER.indexOf(d));
  const isContiguous =
    indices.length > 1 &&
    indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);

  if (isContiguous && labels.length >= 3) {
    return `${labels[0]} – ${labels[labels.length - 1]}`;
  }

  return labels.join(', ');
}

/**
 * Returns the schedule for a specific day from the main chamber.
 */
export function getDaySchedule(
  doctor: Pick<Doctor, 'chambers'>,
  day: DayOfWeek
): ChamberSchedule | undefined {
  const chamber = getMainChamber(doctor);
  if (!chamber?.schedules) return undefined;
  return chamber.schedules.find((s) => s.day === day);
}

// ============================================================
// RATING HELPERS
// ============================================================

/**
 * Formats a numeric rating to one decimal place.
 * @example formatRating(4.666) → "4.7"
 */
export function formatRating(rating: number): string {
  if (!rating || isNaN(rating)) return '0.0';
  return rating.toFixed(1);
}

/**
 * Returns a label for a rating score.
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.8) return 'Excellent';
  if (rating >= 4.5) return 'Very Good';
  if (rating >= 4.0) return 'Good';
  if (rating >= 3.5) return 'Average';
  return 'Below Average';
}

// ============================================================
// QUALIFICATION HELPERS
// ============================================================

/**
 * Returns a compact qualification string like "MBBS, MD, FRCP".
 */
export function getQualificationSummary(doctor: Pick<Doctor, 'qualifications'>): string {
  if (!doctor.qualifications?.length) return '';
  return doctor.qualifications
    .slice(0, 4)
    .map((q) => q.degree)
    .join(', ');
}

// ============================================================
// GENERAL UTILITIES
// ============================================================

/**
 * Truncates text to a max character count, appending "..." if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generates a WhatsApp chat URL.
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '');
  const number = clean.startsWith('880') ? clean : `880${clean}`;
  const msg = encodeURIComponent(message ?? 'Hello, I would like to book an appointment.');
  return `https://wa.me/${number}?text=${msg}`;
}

/**
 * Generates initials from a full name (max 2 chars).
 * @example getInitials("Dr. Aminul Islam") → "AI"
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  const cleaned = name.replace(/^(Dr\.|Prof\.|Assoc\. Prof\.)\s*/i, '');
  const parts = cleaned.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns a DiceBear avatar URL as a fallback for doctor photos.
 */
export function getFallbackAvatar(seed: string): string {
  return `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Formats a number with commas.
 * @example formatNumber(12400) → "12,400"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-BD').format(n);
}

/**
 * Pluralizes a word based on count.
 * @example pluralize(1, 'review') → "1 review"
 * @example pluralize(5, 'review') → "5 reviews"
 */
export function pluralize(count: number, word: string, plural?: string): string {
  const pluralForm = plural ?? `${word}s`;
  return `${formatNumber(count)} ${count === 1 ? word : pluralForm}`;
}

/**
 * Builds a URL search params string from an object, filtering out null/undefined/empty values.
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      sp.set(key, String(value));
    }
  }
  const str = sp.toString();
  return str ? `?${str}` : '';
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Returns true if the current environment is a browser.
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Delays execution for a given number of milliseconds (useful in async flows).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
