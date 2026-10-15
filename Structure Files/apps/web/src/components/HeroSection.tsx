'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Stethoscope, ChevronRight, Star, Users, Building2, Shield } from 'lucide-react';
import { SPECIALTIES, DISTRICTS, STATS } from '@/data/doctors';
import { cn } from '@/lib/utils';

const POPULAR_SEARCHES = [
  { label: 'Cardiologist in Dhaka', specialty: 'cardiology', district: 'dhaka-district' },
  { label: 'Child Specialist',       specialty: 'pediatrics',    district: '' },
  { label: 'Gynecologist',           specialty: 'gynecology',    district: '' },
  { label: 'Neurologist',            specialty: 'neurology',     district: '' },
  { label: 'Skin Doctor',            specialty: 'dermatology',   district: '' },
  { label: 'Bone Specialist',        specialty: 'orthopedics',   district: '' },
];

const QUICK_SPECIALTIES = SPECIALTIES.slice(0, 8);

const STAT_ITEMS = [
  { value: '12,400+', label: 'Verified Doctors', icon: Stethoscope, color: 'text-sky-600' },
  { value: '850+', label: 'Hospitals', icon: Building2, color: 'text-emerald-600' },
  { value: '9.8L+', label: 'Patients Helped', icon: Users, color: 'text-violet-600' },
  { value: '64', label: 'Districts Covered', icon: MapPin, color: 'text-amber-600' },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = POPULAR_SEARCHES.filter(s =>
  s.label.toLowerCase().includes(query.toLowerCase())
);

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (district) params.set('district', district);
  // If query exactly matches a popular search, use structured params instead
  const match = POPULAR_SEARCHES.find(p => p.label.toLowerCase() === query.toLowerCase());
  if (match) {
    const p = new URLSearchParams();
    if (match.specialty) p.set('specialty', match.specialty);
    if (match.district) p.set('district', match.district);
    router.push(`/doctors?${p.toString()}`);
    return;
  }
  router.push(`/doctors?${params.toString()}`);
};

  const handleSuggestionClick = (item: typeof POPULAR_SEARCHES[0]) => {
  // Navigate directly with proper slugs instead of setting text
  const params = new URLSearchParams();
  if (item.specialty) params.set('specialty', item.specialty);
  if (item.district) params.set('district', item.district);
  router.push(`/doctors?${params.toString()}`);
  setShowSuggestions(false);
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestion(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusedSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[focusedSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !suggestionsRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">

      {/* ── Background ── */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-dots opacity-[0.06]" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-700/20 blur-3xl" />

      {/* Floating doctor pills (decorative) */}
      <div className="absolute top-24 right-8 lg:right-24 hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md rounded-full px-4 py-2 animate-bounce-gentle">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <Star className="w-3 h-3 text-white fill-white" />
        </div>
        <span className="text-slate-800 text-xs font-semibold">4.9 ★ &nbsp;Prof. Aminul Islam</span>
      </div>
      <div className="absolute bottom-32 right-16 lg:right-40 hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md rounded-full px-4 py-2 animation-delay-1000 animate-bounce-gentle delay-300">
        <Shield className="w-4 h-4 text-sky-600" />
        <span className="text-slate-800 text-xs font-semibold">BMDC Verified Doctor</span>
      </div>

      {/* ── Content ── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20">

        {/* Eyebrow */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200/80 rounded-full px-4 py-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-sky-900 font-semibold">Bangladesh's #1 Doctor Discovery Platform</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8 animate-fade-in delay-100">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight mb-5">
            Find the Right
            <br />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600">
                Doctor Near You
              </span>
              <svg className="absolute -bottom-2 left-0 w-full hidden sm:block" viewBox="0 0 400 12" fill="none">
                <path d="M2 8 Q100 2 200 8 Q300 14 398 8" stroke="url(#heroUnderline)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="heroUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.8"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-dm">
            Search from 12,400+ verified specialists across 64 districts.
            Book appointments instantly — in Bengali or English.
          </p>
        </div>

        {/* ── Search Box ── */}
        <div className="max-w-3xl mx-auto animate-fade-in delay-200">
          <form onSubmit={handleSearch}>
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2">

              {/* Doctor/specialty input */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setFocusedSuggestion(-1); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Doctor name, specialty, hospital…"
                  className="w-full pl-12 pr-4 py-3.5 text-slate-800 text-sm sm:text-base placeholder-slate-400 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
                  aria-label="Search doctors"
                  aria-autocomplete="list"
                  autoComplete="off"
                />

                {/* Suggestions dropdown */}
                {showSuggestions && query.length > 0 && filteredSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-scale-in"
                  >
                    <p className="text-xs text-slate-400 font-medium px-4 pt-3 pb-1">Popular searches</p>
                    {filteredSuggestions.map((s, i) => (
  <button
    key={s.label}
    type="button"
    onClick={() => handleSuggestionClick(s)}
    className={cn(
      'flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors',
      focusedSuggestion === i ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-50 text-slate-700'
    )}
  >
    <Search className="w-4 h-4 text-slate-400 shrink-0" />
    {s.label}
  </button>
))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-slate-200 my-1" />

              {/* Location select */}
              <div className="relative sm:w-44">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 text-sm text-slate-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200 appearance-none cursor-pointer"
                  aria-label="Select district"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-xl px-6 py-3.5 text-base shrink-0 shadow-brand"
              >
                <Search className="w-5 h-5" />
                <span className="hidden xs:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-slate-500 text-xs font-semibold">Popular:</span>
            {POPULAR_SEARCHES.slice(0, 5).map(tag => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleSuggestionClick(tag)}
                className="text-xs bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 px-3 py-1 rounded-full shadow-sm transition-colors font-medium"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Quick Specialty Grid ── */}
        <div className="mt-14 animate-fade-in delay-300">
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-5">
            Browse by specialty
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 max-w-4xl mx-auto">
            {QUICK_SPECIALTIES.map((spec, i) => (
              <Link
                key={spec.id}
                href={`/doctors?specialty=${spec.slug}`}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all hover:scale-105 hover:shadow-md animate-fade-in group',
                  'bg-white hover:bg-sky-50/80 border border-slate-200/90 hover:border-sky-300 shadow-sm',
                )}
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                <span className="text-2xl leading-none">{spec.icon}</span>
                <span className="text-slate-700 group-hover:text-sky-700 text-xs font-semibold leading-tight line-clamp-2 transition-colors">
                  {spec.name.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="mt-16 animate-fade-in delay-400">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {STAT_ITEMS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                  <span className="font-playfair font-bold text-xl sm:text-2xl text-slate-900">{stat.value}</span>
                </div>
                <span className="text-slate-500 text-xs font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12 animate-bounce-gentle delay-500">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 text-xs font-medium">Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
