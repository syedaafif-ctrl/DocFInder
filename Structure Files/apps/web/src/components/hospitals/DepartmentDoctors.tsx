'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Stethoscope, Users, Phone, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import type { Doctor, Chamber, HospitalDepartment } from '@/types';
import { getDoctorsByHospitalAndDepartment } from '@/lib/mockData';
import DoctorHospitalCard from '@/components/hospitals/DoctorHospitalCard';
import { cn } from '@/lib/utils';

interface DepartmentDoctorsProps {
  department: HospitalDepartment;
  hospitalId: string;
  hospitalName: string;
  onClose: () => void;
}

type SortOption = 'rating' | 'experience' | 'fee_low' | 'fee_high';

export default function DepartmentDoctors({
  department,
  hospitalId,
  hospitalName,
  onClose,
}: DepartmentDoctorsProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('rating');
  const panelRef = useRef<HTMLDivElement>(null);

  // Get doctors from mock data
  const allDoctors = getDoctorsByHospitalAndDepartment(hospitalId, department.name);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = allDoctors
    .filter((doctor) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialties.some((s) => s.specialty.name.toLowerCase().includes(q)) ||
        doctor.qualifications.some((qk) => qk.degree.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'experience') return b.experience - a.experience;
      if (sort === 'fee_low') return a.consultationFee - b.consultationFee;
      if (sort === 'fee_high') return b.consultationFee - a.consultationFee;
      return 0;
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 z-40 w-full sm:max-w-xl bg-slate-50 shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-5 py-4 shrink-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl shrink-0">
              🏥
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-lg leading-tight">{department.name}</h2>
              {department.nameBn && (
                <p className="text-slate-400 text-xs">{department.nameBn}</p>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
                </span>
                {department.phone && (
                  <a
                    href={`tel:${department.phone}`}
                    className="flex items-center gap-1 hover:text-sky-600 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {department.phone}
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search + sort */}
        <div className="bg-white border-b border-slate-100 px-5 py-3 shrink-0 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, qualification…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-slate-50"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-slate-50 appearance-none"
            >
              <option value="rating">Top Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="fee_low">Fee: Low first</option>
              <option value="fee_high">Fee: High first</option>
            </select>
          </div>
        </div>

        {/* Doctors list */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-slate-600 mb-1">No doctors found</p>
              <p className="text-slate-400 text-sm">No doctors listed for this department yet.</p>
            </div>
          ) : (
            filtered.map((doctor) => {
              const chamber = doctor.chambers?.[0];
              if (!chamber) return null;
              const chamberWithSchedules: Chamber = {
                ...chamber,
                schedules: chamber.schedules && chamber.schedules.length > 0 ? chamber.schedules : [
                  { id: 'sch-001', chamberId: chamber.id, day: 'SATURDAY',  startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
                  { id: 'sch-002', chamberId: chamber.id, day: 'MONDAY',    startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
                  { id: 'sch-003', chamberId: chamber.id, day: 'WEDNESDAY', startTime: '16:00', endTime: '20:00', slotDuration: 15, maxPatients: 20, isClosed: false },
                  { id: 'sch-004', chamberId: chamber.id, day: 'THURSDAY',  startTime: '16:00', endTime: '20:00', slotDuration: 15, maxPatients: 20, isClosed: false },
                ],
              };
              return (
                <DoctorHospitalCard
                  key={doctor.id}
                  doctor={doctor}
                  chamber={chamberWithSchedules}
                  hospitalName={hospitalName}
                  departmentName={department.name}
                />
              );
            })
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
}