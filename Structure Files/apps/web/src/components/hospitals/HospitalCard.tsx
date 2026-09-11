'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Star, BadgeCheck, Zap, Heart,
  Building2, Clock, Users, ChevronRight, Ambulance
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Hospital } from '@/types';

interface HospitalCardProps {
  hospital: Hospital;
  index?: number;
  compact?: boolean;
}

const HOSPITAL_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Private:    { bg: 'bg-sky-50',     text: 'text-sky-700',    label: 'Private' },
  Government: { bg: 'bg-emerald-50', text: 'text-emerald-700',label: 'Govt.' },
  Diagnostic: { bg: 'bg-violet-50',  text: 'text-violet-700', label: 'Diagnostic' },
  Clinic:     { bg: 'bg-amber-50',   text: 'text-amber-700',  label: 'Clinic' },
};

export default function HospitalCard({ hospital, index = 0, compact = false }: HospitalCardProps) {
  const typeStyle = HOSPITAL_TYPE_STYLES[hospital.type] ?? HOSPITAL_TYPE_STYLES.Private;

  return (
    <div
      className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Emergency badge */}
      {hospital.isEmergency && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Ambulance className="w-2.5 h-2.5" />
            24/7 Emergency
          </span>
        </div>
      )}

      {/* Featured badge */}
      {hospital.isFeatured && !hospital.isEmergency && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Zap className="w-2.5 h-2.5" />
            Featured
          </span>
        </div>
      )}

      {/* Cover image / placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {hospital.coverImage ? (
          <Image
            src={hospital.coverImage}
            alt={hospital.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-slate-300" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Logo */}
        {hospital.logo && (
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white shadow-md overflow-hidden border border-white/80">
            <Image src={hospital.logo} alt={`${hospital.name} logo`} width={40} height={40} className="object-contain" unoptimized />
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Name + type */}
        <div className="flex items-start gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-sky-700 transition-colors">
              {hospital.name}
            </h3>
          </div>
          <span className={cn('shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full', typeStyle.bg, typeStyle.text)}>
            {typeStyle.label}
          </span>
        </div>

        {/* Verified + rating */}
        <div className="flex items-center gap-2 mb-2">
          {hospital.isVerified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </span>
          )}
          {hospital.isVerified && hospital.rating > 0 && <span className="text-slate-300 text-xs">·</span>}
          {hospital.rating > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-600">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800">{hospital.rating.toFixed(1)}</span>
              <span className="text-slate-400">({hospital.reviewCount})</span>
            </span>
          )}
        </div>

        {/* Location */}
        {hospital.area || hospital.district ? (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {hospital.area?.name ? `${hospital.area.name}, ` : ''}
              {hospital.district?.name ?? ''}
            </span>
          </div>
        ) : null}

        {!compact && (
          <>
            {/* Stats row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              {hospital.bedCount ? (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Heart className="w-3 h-3 text-slate-400" />
                  {hospital.bedCount} beds
                </div>
              ) : null}
              {hospital.departments && hospital.departments.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3 h-3 text-slate-400" />
                  {hospital.departments.length} departments
                </div>
              )}
              {hospital.establishedYear && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Est. {hospital.establishedYear}
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {hospital.phone ? (
            <a
              href={`tel:${hospital.phone}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" />
              {hospital.phone}
            </a>
          ) : (
            <span />
          )}
          <Link
            href={`/hospitals/${hospital.slug}`}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}