'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Clock, BadgeCheck, ChevronRight, Phone,
  Video, Zap, Calendar, MessageCircle, MapPin, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Doctor, Chamber } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DoctorHospitalCardProps {
  doctor: Doctor;
  /** The specific chamber at this hospital — schedule shown is ONLY for this hospital */
  chamber: Chamber;
  hospitalName: string;
  departmentName: string;
  onBook?: (doctor: Doctor, chamber: Chamber) => void;
  index?: number;
}

// ─── Day map ─────────────────────────────────────────────────────────────────
const DAY_DISPLAY: Record<string, string> = {
  SATURDAY: 'Sat', SUNDAY: 'Sun', MONDAY: 'Mon',
  TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri',
};

const BD_DAY_ORDER = ['SATURDAY','SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'];

function formatTime12(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

// ============================================================
// DOCTOR HOSPITAL CARD
// ============================================================
export default function DoctorHospitalCard({
  doctor, chamber, hospitalName, departmentName, onBook, index = 0,
}: DoctorHospitalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const primary  = doctor.specialties.find(s => s.isPrimary) ?? doctor.specialties[0];
  const qualStr  = doctor.qualifications.slice(0, 3).map(q => q.degree).join(', ');
  const fee      = chamber.appointmentFee ?? doctor.consultationFee;

  // Hospital-specific schedule only
  const activeDays = BD_DAY_ORDER
    .map(day => chamber.schedules.find(s => s.day === day && !s.isClosed))
    .filter(Boolean) as NonNullable<typeof chamber.schedules[0]>[];

  const nextAvailable = activeDays[0];

  return (
    <div
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent for sponsored */}
      {doctor.sponsoredRank && (
        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
      )}

      <div className="p-5">
        {/* ── Doctor header ── */}
        <div className="flex gap-4">
          {/* Avatar */}
          <Link href={`/doctors/${doctor.slug}`} className="relative shrink-0 block">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100 border-2 border-white shadow-md">
              <Image
                src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
                alt={doctor.name} width={80} height={80}
                className="w-full h-full object-cover" unoptimized
              />
            </div>
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center border-2 border-white shadow-sm">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {doctor.sponsoredRank && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      <Zap className="w-2 h-2" /> Featured
                    </span>
                  )}
                  {doctor.isAvailableOnline && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online Available
                    </span>
                  )}
                </div>

                <Link href={`/doctors/${doctor.slug}`} className="block">
                  <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-sky-700 transition-colors">
                    {doctor.title} {doctor.name}
                  </h3>
                </Link>
                <p className="text-sky-600 text-xs font-semibold mt-0.5">{primary?.specialty.name}</p>
                <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{qualStr}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({doctor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {doctor.experience} yrs exp
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {doctor.totalAppointments.toLocaleString()}+ appts
              </div>
            </div>
          </div>
        </div>

        {/* ── Hospital schedule (THIS hospital only) ── */}
        <div className="mt-4 bg-sky-50 rounded-2xl p-3.5 border border-sky-100">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Schedule at {hospitalName}
            </p>
            {activeDays.length > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {activeDays.length} day{activeDays.length > 1 ? 's' : ''}/week
              </span>
            )}
          </div>

          {activeDays.length === 0 ? (
            <p className="text-xs text-slate-400">No schedule available at this location</p>
          ) : (
            <div className="space-y-2">
              {activeDays.map(sched => (
                <div key={sched.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-800 w-8">{DAY_DISPLAY[sched.day]}</span>
                    <span className="text-xs text-slate-600">
                      {formatTime12(sched.startTime)} – {formatTime12(sched.endTime)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {Math.floor((
                      (parseInt(sched.endTime.split(':')[0]) * 60 + parseInt(sched.endTime.split(':')[1])) -
                      (parseInt(sched.startTime.split(':')[0]) * 60 + parseInt(sched.startTime.split(':')[1]))
                    ) / sched.slotDuration)} slots
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Next available */}
          {nextAvailable && (
            <div className="mt-2.5 pt-2.5 border-t border-sky-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-700 font-medium">
                Next available: {DAY_DISPLAY[nextAvailable.day]} · {formatTime12(nextAvailable.startTime)}
              </span>
            </div>
          )}
        </div>

        {/* ── About (expandable) ── */}
        {doctor.about && (
          <div className="mt-3">
            <p className={cn('text-xs text-slate-500 leading-relaxed', !expanded && 'line-clamp-2')}>
              {doctor.about}
            </p>
            {doctor.about.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-sky-600 font-medium hover:text-sky-700 mt-0.5"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* ── Fee + Actions ── */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Consultation Fee</p>
            <p className="font-black text-slate-900 text-lg">৳{fee.toLocaleString()}</p>
            {doctor.followUpFee && (
              <p className="text-[10px] text-slate-400">Follow-up: ৳{doctor.followUpFee.toLocaleString()}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            {doctor.whatsapp && (
              <a
                href={`https://wa.me/880${doctor.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Hello Dr. ${doctor.name}, I would like to book an appointment at ${hospitalName}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="WhatsApp"
                onClick={e => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}

            {/* View profile */}
            <Link
              href={`/doctors/${doctor.slug}`}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="View full profile"
              onClick={e => e.stopPropagation()}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Book Now — navigates to doctor profile */}
            <Link
              href={`/doctors/${doctor.slug}`}
              className={cn(
                'inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all',
                'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200 hover:shadow-xl hover:-translate-y-0.5'
              )}
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}