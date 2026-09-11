'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Star, MapPin, Clock, Phone, MessageCircle, Calendar,
  BadgeCheck, Video, Award, ChevronRight, Bookmark, BookmarkCheck
} from 'lucide-react';
import { cn, formatCurrency, formatExperience, getPrimarySpecialty, getMainChamberArea, getDoctorAvailabilityDays } from '@/lib/utils';
import type { Doctor } from '@/types';
import { useState } from 'react';

interface DoctorCardProps {
  doctor: Doctor;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
  isSponsored?: boolean;
}

const DAYS_SHORT: Record<string, string> = {
  Saturday: 'Sat', Sunday: 'Sun', Monday: 'Mon',
  Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri',
};

export default function DoctorCard({ doctor, variant = 'default', className, isSponsored }: DoctorCardProps) {
  const [saved, setSaved] = useState(false);
  const primarySpecialty = getPrimarySpecialty(doctor);
  const area = getMainChamberArea(doctor);
  const availDays = getDoctorAvailabilityDays(doctor);
  const qualAbbrev = doctor.qualifications.map(q => q.degree).join(', ');

  if (variant === 'compact') {
    return (
      <Link
        href={`/doctors/${doctor.slug}`}
        className={cn('flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all group', className)}
      >
        <div className="relative shrink-0">
          <Image
            src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
            alt={doctor.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover bg-slate-100"
          />
          {doctor.isVerified && (
            <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-sky-500 fill-sky-50 drop-shadow" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-700">{doctor.name}</p>
          <p className="text-xs text-slate-500 truncate">{primarySpecialty}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-slate-700">{doctor.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-sky-700">{formatCurrency(doctor.consultationFee)}</p>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors ml-auto mt-1" />
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn(
        'relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden card-hover',
        className
      )}>
        {isSponsored && (
          <div className="absolute top-3 right-3 z-10 badge badge-blue text-[10px]">
            <Award className="w-3 h-3" /> Sponsored
          </div>
        )}

        <div className="flex gap-0">
          {/* Photo column */}
          <div className="relative w-28 sm:w-36 shrink-0">
            <Image
              src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
              alt={doctor.name}
              width={144}
              height={200}
              className="w-full h-full object-cover bg-slate-100"
            />
            {doctor.isAvailableOnline && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 bg-emerald-500 rounded-lg py-1 text-white text-[10px] font-medium">
                <Video className="w-3 h-3" /> Online
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-base font-bold text-slate-900 hover:text-sky-700 transition-colors">
                    <Link href={`/doctors/${doctor.slug}`}>{doctor.name}</Link>
                  </h3>
                  {doctor.isVerified && (
                    <BadgeCheck className="w-4.5 h-4.5 text-sky-500 shrink-0" />
                  )}
                </div>
                <p className="text-sm font-semibold text-sky-700 mb-0.5">{primarySpecialty}</p>
                <p className="text-xs text-slate-500 truncate">{qualAbbrev}</p>
              </div>

              <button
                onClick={e => { e.preventDefault(); setSaved(!saved); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all shrink-0"
                aria-label={saved ? 'Remove from saved' : 'Save doctor'}
              >
                {saved ? <BookmarkCheck className="w-4.5 h-4.5 text-sky-600" /> : <Bookmark className="w-4.5 h-4.5" />}
              </button>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={cn('w-3 h-3', i <= Math.round(doctor.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200')} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatExperience(doctor.experience)} exp.
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {area}
              </div>
            </div>

            {/* Availability days */}
            {availDays.length > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex gap-1 flex-wrap">
                  {availDays.map(day => (
                    <span key={day} className="text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-200/60 px-2 py-0.5 rounded-full">
                      {DAYS_SHORT[day] ?? day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fee + Actions */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Consultation Fee</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(doctor.consultationFee)}</p>
              </div>

              <div className="flex items-center gap-2">
                {doctor.whatsapp && (
                  <a
                    href={`https://wa.me/880${doctor.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="btn btn-primary btn-sm gap-1.5 rounded-xl"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ── Default Card (Grid) ──
  return (
    <article className={cn(
      'relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden card-hover group',
      className
    )}>
      {/* Sponsored badge */}
      {isSponsored && (
        <div className="absolute top-3 left-3 z-10 badge badge-blue text-[10px]">
          <Award className="w-3 h-3" /> Sponsored
        </div>
      )}

      {/* Save button */}
      <button
        onClick={e => { e.preventDefault(); setSaved(!saved); }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-slate-400 hover:text-sky-600 transition-all"
        aria-label={saved ? 'Unsave' : 'Save'}
      >
        {saved ? <BookmarkCheck className="w-4 h-4 text-sky-600" /> : <Bookmark className="w-4 h-4" />}
      </button>

      {/* Photo area */}
      <div className="relative h-44 sm:h-48 bg-gradient-to-br from-sky-50 to-slate-100 overflow-hidden">
        <Image
          src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
          alt={doctor.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Online badge */}
        {doctor.isAvailableOnline && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Online Available
          </div>
        )}

        {/* Featured ribbon */}
        {doctor.isFeatured && (
          <div className="absolute top-0 left-0 bg-amber-400 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-br-xl">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-start gap-1.5 mb-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-tight flex-1">
              <Link href={`/doctors/${doctor.slug}`} className="hover:underline decoration-sky-200">
                {doctor.name}
              </Link>
            </h3>
            {doctor.isVerified && (
              <BadgeCheck className="w-4.5 h-4.5 text-sky-500 shrink-0 mt-0.5" title="BMDC Verified" />
            )}
          </div>

          <p className="text-sm font-semibold text-sky-700 mb-0.5">{primarySpecialty}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{qualAbbrev}</p>
        </div>

        {/* Rating + stats */}
        <div className="flex items-center gap-3 py-2.5 border-y border-slate-100 my-2.5">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="text-xs text-slate-500">
            {formatExperience(doctor.experience)} exp.
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{area}</span>
          </div>
        </div>

        {/* Hospitals */}
        {doctor.hospitals.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex -space-x-2">
              {doctor.hospitals.slice(0, 2).map(h => (
                <div
                  key={h.id}
                  className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white overflow-hidden"
                  title={h.name}
                >
                  {h.logo && <Image src={h.logo} alt={h.name} width={20} height={20} className="object-cover" />}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500 truncate">
              {doctor.hospitals[0]?.name}
              {doctor.hospitals.length > 1 && ` +${doctor.hospitals.length - 1}`}
            </span>
          </div>
        )}

        {/* Fee + Book */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Consultation</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(doctor.consultationFee)}</p>
          </div>
          <Link
            href={`/doctors/${doctor.slug}`}
            className="btn btn-primary btn-sm rounded-xl flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}