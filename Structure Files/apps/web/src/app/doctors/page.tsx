'use client';

// apps/web/src/app/doctors/page.tsx
// Drop this file at: apps/web/src/app/doctors/page.tsx

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, MapPin, Star, Clock, Phone, Filter,
  BadgeCheck, Zap, ChevronRight, X, SlidersHorizontal,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ALL_DOCTORS, filterDoctors } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import type { Doctor } from '@/types';

// ─── Static options ───────────────────────────────────────────
const SPECIALTIES = [
  { label: 'Cardiology', slug: 'cardiology' },
  { label: 'Neurology', slug: 'neurology' },
  { label: 'Gynecology', slug: 'gynecology' },
  { label: 'Pediatrics', slug: 'pediatrics' },
  { label: 'Orthopedics', slug: 'orthopedics' },
  { label: 'Dermatology', slug: 'dermatology' },
  { label: 'Ophthalmology', slug: 'ophthalmology' },
  { label: 'Endocrinology', slug: 'endocrinology' },
];

const DISTRICTS = [
  { label: 'Dhaka', slug: 'dhaka-district' },
  { label: 'Chittagong', slug: 'chittagong-district' },
  { label: 'Sylhet', slug: 'sylhet-district' },
  { label: 'Rajshahi', slug: 'rajshahi-district' },
];

const SORT_OPTIONS = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Experienced', value: 'experience' },
  { label: 'Fee: Low to High', value: 'fee_low' },
  { label: 'Fee: High to Low', value: 'fee_high' },
];

// ─── DoctorCard ───────────────────────────────────────────────
function DoctorCard({ doctor }: { doctor: Doctor }) {
  const primarySpecialty = doctor.specialties.find((s) => s.isPrimary) ?? doctor.specialties[0];
  const mainChamber = doctor.chambers.find((c) => c.isMain) ?? doctor.chambers[0];
  const qualStr = doctor.qualifications.slice(0, 3).map((q) => q.degree).join(', ');

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow">
              <Image
                src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
                alt={doctor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shadow border-2 border-white">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-sky-700 transition-colors">
                  {doctor.title} {doctor.name}
                </h3>
                {primarySpecialty && (
                  <p className="text-sky-600 text-xs font-semibold mt-0.5">{primarySpecialty.specialty.name}</p>
                )}
                <p className="text-slate-400 text-xs mt-0.5 truncate">{qualStr}</p>
              </div>
              {doctor.sponsoredRank && (
                <span className="shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5" />Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {doctor.experience} yrs
              </div>
              {mainChamber?.area && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {mainChamber.area.name}
                </div>
              )}
              {doctor.isAvailableOnline && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Online
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Fee</p>
            <p className="font-bold text-slate-900 text-sm">৳{doctor.consultationFee.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            {doctor.whatsapp && (
              <a
                href={`https://wa.me/880${doctor.whatsapp.replace(/\D/g, '')}?text=I%20want%20to%20book%20an%20appointment`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <Link
              href={`/doctors/${doctor.slug}`}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              Book Now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
function DoctorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL params as initial state
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') ?? '');
  const [district, setDistrict] = useState(searchParams.get('district') ?? '');
  const [gender, setGender] = useState(searchParams.get('gender') ?? '');
  const [online, setOnline] = useState(searchParams.get('online') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') ?? 'relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (specialty) params.set('specialty', specialty);
    if (district) params.set('district', district);
    if (gender) params.set('gender', gender);
    if (online) params.set('online', online);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    router.replace(`/doctors?${params.toString()}`, { scroll: false });
  }, [query, specialty, district, gender, online, sortBy]);

  // Also sync when URL changes externally (e.g. clicking a specialty pill on homepage)
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setSpecialty(searchParams.get('specialty') ?? '');
    setDistrict(searchParams.get('district') ?? '');
    setGender(searchParams.get('gender') ?? '');
    setOnline(searchParams.get('online') ?? '');
    setSortBy(searchParams.get('sort') ?? 'relevance');
  }, [searchParams.toString()]);

  // Filter doctors
  const filtered = useMemo(
  () =>
    filterDoctors({
      q: query,
      specialty,
      district,
      gender,
      online,
      sortBy,
    }),
  [query, specialty, district, gender, online, sortBy]
);

  const hasFilters = !!(query || specialty || district || gender || online);

  function clearAll() {
    setQuery('');
    setSpecialty('');
    setDistrict('');
    setGender('');
    setOnline('');
    setSortBy('relevance');
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">

        {/* ── Search bar ── */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex gap-2">
              {/* Text search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctor, specialty, hospital…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 bg-slate-50"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Specialty */}
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="hidden sm:block text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 text-slate-700"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.label}</option>
                ))}
              </select>

              {/* District */}
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="hidden sm:block text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 text-slate-700"
              >
                <option value="">All Districts</option>
                {DISTRICTS.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.label}</option>
                ))}
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'sm:hidden flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-xl border transition-colors',
                  showFilters ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-200 text-slate-600 bg-slate-50'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 text-slate-700"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile expanded filters */}
            {showFilters && (
              <div className="sm:hidden flex gap-2 mt-2">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  <option value="">All Specialties</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.label}</option>
                  ))}
                </select>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* ── Sidebar + Grid ── */}
          <div className="flex gap-6">

            {/* Sidebar filters — desktop only */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-36">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  {hasFilters && (
                    <button onClick={clearAll} className="text-xs text-sky-600 hover:underline">Clear all</button>
                  )}
                </div>

                {/* Gender */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Gender</p>
                  {['', 'MALE', 'FEMALE'].map((g) => (
                    <label key={g} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="accent-sky-600"
                      />
                      <span className="text-sm text-slate-700">{g === '' ? 'Any' : g === 'MALE' ? 'Male' : 'Female'}</span>
                    </label>
                  ))}
                </div>

                {/* Online only */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Availability</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={online === 'true'}
                      onChange={(e) => setOnline(e.target.checked ? 'true' : '')}
                      className="accent-sky-600"
                    />
                    <span className="text-sm text-slate-700">Online consultation</span>
                  </label>
                </div>

                {/* Specialty quick links */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Specialty</p>
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => setSpecialty('')}
                      className={cn('text-sm text-left px-2 py-1.5 rounded-lg transition-colors', specialty === '' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50')}
                    >
                      All
                    </button>
                    {SPECIALTIES.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => setSpecialty(s.slug)}
                        className={cn('text-sm text-left px-2 py-1.5 rounded-lg transition-colors', specialty === s.slug ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-50')}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Result count + active filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''} found
                  {query && <span className="text-slate-400"> for "{query}"</span>}
                </p>

                {/* Active filter chips */}
                <div className="flex flex-wrap gap-2">
                  {specialty && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-200">
                      {SPECIALTIES.find((s) => s.slug === specialty)?.label}
                      <button onClick={() => setSpecialty('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {district && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-200">
                      {DISTRICTS.find((d) => d.slug === district)?.label}
                      <button onClick={() => setDistrict('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {gender && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-200">
                      {gender === 'MALE' ? 'Male' : 'Female'}
                      <button onClick={() => setGender('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {online && (
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-200">
                      Online only
                      <button onClick={() => setOnline('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              </div>

              {/* Doctor grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">No doctors found</h3>
                  <p className="text-slate-500 text-sm mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}