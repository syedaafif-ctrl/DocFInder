'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  X, Calendar, Clock, User, Phone, ChevronLeft, ChevronRight,
  CheckCircle2, BadgeCheck, MessageCircle, Loader2, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Doctor, Chamber, ChamberSchedule } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingWidgetProps {
  doctor: Doctor;
  chamber: Chamber;           // hospital-specific chamber
  hospitalName: string;
  onClose: () => void;
}

type Step = 'date' | 'slot' | 'details' | 'confirm' | 'success';

// ─── Constants ────────────────────────────────────────────────────────────────
const BD_DAYS: Record<string, number> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// Simulated already-booked slots (in real app, fetch from API)
const BOOKED_SLOTS: Record<string, string[]> = {
  '2025-01-04': ['10:00','10:15','11:00'],
  '2025-01-05': ['09:00','09:30','10:00','14:00'],
};

function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur < endMin) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    cur += duration;
  }
  return slots;
}

function formatTime12(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({
  schedules, selected, onSelect,
}: {
  schedules: ChamberSchedule[];
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const availableDayNums = new Set(
    schedules.filter(s => !s.isClosed).map(s => BD_DAYS[s.day])
  );

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 0).getDate();
  const firstDayOfWeek = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  }

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth()-1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 1));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="font-semibold text-slate-900 text-sm">
          {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_SHORT.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const isPast    = date < today;
          const isAvail   = availableDayNums.has(date.getDay());
          const isSel     = selected && toDateKey(date) === toDateKey(selected);
          const isToday   = toDateKey(date) === toDateKey(today);
          const disabled  = isPast || !isAvail;

          return (
            <button
              key={toDateKey(date)}
              disabled={disabled}
              onClick={() => !disabled && onSelect(date)}
              className={cn(
                'relative flex items-center justify-center h-8 w-full rounded-lg text-xs font-medium transition-all',
                disabled  && 'text-slate-200 cursor-not-allowed',
                !disabled && !isSel && 'text-slate-700 hover:bg-sky-50 hover:text-sky-700',
                isAvail && !isPast && !isSel && 'text-sky-700 bg-sky-50/50',
                isSel     && 'bg-sky-600 text-white shadow-md shadow-sky-200',
                isToday && !isSel && 'ring-2 ring-sky-300 ring-inset',
              )}
            >
              {date.getDate()}
              {isAvail && !isPast && !isSel && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span className="text-[10px] text-slate-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-600" />
          <span className="text-[10px] text-slate-500">Selected</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slot Grid ────────────────────────────────────────────────────────────────
function SlotGrid({
  date, schedule, slotDuration, selectedSlot, onSelect,
}: {
  date: Date;
  schedule: ChamberSchedule;
  slotDuration: number;
  selectedSlot: string | null;
  onSelect: (s: string) => void;
}) {
  const dateKey = toDateKey(date);
  const booked  = BOOKED_SLOTS[dateKey] ?? [];
  const slots   = generateSlots(schedule.startTime, schedule.endTime, slotDuration);

  const morning   = slots.filter(s => parseInt(s) < 12);
  const afternoon = slots.filter(s => parseInt(s) >= 12 && parseInt(s) < 17);
  const evening   = slots.filter(s => parseInt(s) >= 17);

  const SlotSection = ({ title, items }: { title: string; items: string[] }) => {
    if (!items.length) return null;
    return (
      <div className="mb-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <div className="flex flex-wrap gap-2">
          {items.map(slot => {
            const isBooked = booked.includes(slot);
            const isSel    = selectedSlot === slot;
            return (
              <button
                key={slot}
                disabled={isBooked}
                onClick={() => !isBooked && onSelect(slot)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                  isBooked && 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through',
                  !isBooked && !isSel && 'bg-white border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50',
                  isSel && 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-200',
                )}
              >
                {formatTime12(slot)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const available = slots.filter(s => !booked.includes(s)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-700">
          {date.toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full',
          available > 5 ? 'bg-emerald-50 text-emerald-600' : available > 0 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
        )}>
          {available} slots left
        </span>
      </div>
      <SlotSection title="Morning"   items={morning} />
      <SlotSection title="Afternoon" items={afternoon} />
      <SlotSection title="Evening"   items={evening} />
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'date', label: 'Date' },
    { id: 'slot', label: 'Time' },
    { id: 'details', label: 'Details' },
    { id: 'confirm', label: 'Confirm' },
  ];
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all',
            i < idx  && 'bg-sky-600 text-white',
            i === idx && 'bg-sky-600 text-white ring-4 ring-sky-100',
            i > idx  && 'bg-slate-100 text-slate-400',
          )}>
            {i < idx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className={cn('text-[10px] font-medium mt-1 absolute -bottom-5',
              i <= idx ? 'text-sky-700' : 'text-slate-400'
            )} style={{ position: 'static' }}>{/* label below */}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('flex-1 h-0.5 mx-1 transition-all', i < idx ? 'bg-sky-600' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN BOOKING WIDGET
// ============================================================
export default function BookingWidget({ doctor, chamber, hospitalName, onClose }: BookingWidgetProps) {
  const [step, setStep]             = useState<Step>('date');
  const [selectedDate, setDate]     = useState<Date | null>(null);
  const [selectedSlot, setSlot]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [form, setForm]             = useState({
    patientName: '', phone: '', age: '', gender: '', symptoms: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primary   = doctor.specialties.find(s => s.isPrimary) ?? doctor.specialties[0];
  const qualStr   = doctor.qualifications.slice(0,3).map(q => q.degree).join(', ');
  const fee       = chamber.appointmentFee ?? doctor.consultationFee;

  // Get the schedule for the selected date
  const daySchedule = useMemo(() => {
    if (!selectedDate) return null;
    const dayName = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][selectedDate.getDay()];
    return chamber.schedules.find(s => s.day === dayName && !s.isClosed) ?? null;
  }, [selectedDate, chamber]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required';
    if (!form.phone.trim())       e.phone = 'Phone number is required';
    else if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = 'Enter a valid BD phone number';
    if (!form.age)                e.age = 'Age is required';
    if (!form.gender)             e.gender = 'Please select gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBook = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/20 shrink-0">
            <Image
              src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
              alt={doctor.name} width={48} height={48}
              className="w-full h-full object-cover" unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">
              {doctor.title} {doctor.name}
            </p>
            <p className="text-sky-200 text-xs truncate">{primary?.specialty.name} · {hospitalName}</p>
            <p className="text-sky-100/80 text-xs">Fee: <span className="font-bold text-white">৳{fee.toLocaleString()}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step bar */}
        {step !== 'success' && (
          <div className="px-5 pt-4 pb-2 shrink-0 border-b border-slate-100">
            <StepBar current={step} />
          </div>
        )}

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── STEP: Date ── */}
          {step === 'date' && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Select Appointment Date</p>
              <MiniCalendar
                schedules={chamber.schedules}
                selected={selectedDate}
                onSelect={(d) => { setDate(d); setSlot(null); }}
              />
              {chamber.schedules.filter(s => !s.isClosed).length > 0 && (
                <div className="mt-4 bg-sky-50 rounded-2xl p-3">
                  <p className="text-xs font-semibold text-sky-700 mb-2">Available days at {hospitalName}:</p>
                  <div className="flex flex-wrap gap-2">
                    {chamber.schedules.filter(s => !s.isClosed).map(s => (
                      <span key={s.day} className="text-xs bg-white text-sky-700 font-semibold px-2.5 py-1 rounded-full border border-sky-200">
                        {s.day.charAt(0) + s.day.slice(1).toLowerCase()} · {s.startTime}–{s.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP: Slot ── */}
          {step === 'slot' && selectedDate && daySchedule && (
            <SlotGrid
              date={selectedDate}
              schedule={daySchedule}
              slotDuration={chamber.schedules.find(s => !s.isClosed)?.slotDuration ?? 15}
              selectedSlot={selectedSlot}
              onSelect={setSlot}
            />
          )}

          {/* ── STEP: Details ── */}
          {step === 'details' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Patient Information</p>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={form.patientName}
                    onChange={e => setForm(f => ({...f, patientName: e.target.value}))}
                    placeholder="Patient's full name"
                    className={cn('w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all',
                      errors.patientName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white')}
                  />
                </div>
                {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={form.phone} type="tel"
                    onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    placeholder="01XXXXXXXXX"
                    className={cn('w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all',
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white')}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Age *</label>
                  <input
                    value={form.age} type="number" min="1" max="120"
                    onChange={e => setForm(f => ({...f, age: e.target.value}))}
                    placeholder="Age"
                    className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all',
                      errors.age ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white')}
                  />
                  {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm(f => ({...f, gender: e.target.value}))}
                    className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all bg-white',
                      errors.gender ? 'border-red-300 bg-red-50' : 'border-slate-200')}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Symptoms / Reason <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  value={form.symptoms} rows={3}
                  onChange={e => setForm(f => ({...f, symptoms: e.target.value}))}
                  placeholder="Briefly describe your symptoms or reason for visit…"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP: Confirm ── */}
          {step === 'confirm' && selectedDate && selectedSlot && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Review Your Appointment</p>

              {/* Summary card */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <Image
                    src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
                    alt={doctor.name} width={44} height={44}
                    className="w-11 h-11 rounded-xl object-cover" unoptimized
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{doctor.title} {doctor.name}</p>
                    <p className="text-xs text-sky-600 font-medium">{primary?.specialty.name}</p>
                    <p className="text-xs text-slate-500">{qualStr}</p>
                  </div>
                </div>

                {[
                  { label: 'Hospital',    value: hospitalName },
                  { label: 'Department',  value: primary?.specialty.name ?? '' },
                  { label: 'Date',        value: selectedDate.toLocaleDateString('en-BD', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
                  { label: 'Time',        value: formatTime12(selectedSlot) },
                  { label: 'Patient',     value: form.patientName },
                  { label: 'Phone',       value: form.phone },
                  { label: 'Age',         value: `${form.age} years` },
                  { label: 'Gender',      value: form.gender },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}

                {form.symptoms && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Symptoms</p>
                    <p className="text-sm text-slate-700">{form.symptoms}</p>
                  </div>
                )}
              </div>

              {/* Fee */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-600 font-medium">Consultation Fee</p>
                  <p className="text-2xl font-black text-sky-700">৳{fee.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Platform Fee</p>
                  <p className="text-sm font-bold text-slate-700">৳{Math.round(fee * 0.05).toLocaleString()}</p>
                  <p className="text-xs text-sky-600 font-semibold mt-1">Pay at hospital</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Please arrive 15 minutes early. Bring your previous medical reports if any. Payment is made at the hospital counter.</p>
              </div>
            </div>
          )}

          {/* ── STEP: Success ── */}
          {step === 'success' && selectedDate && selectedSlot && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-xl mb-1">Appointment Confirmed!</h3>
              <p className="text-slate-500 text-sm mb-5">Your appointment has been booked successfully.</p>

              <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5 mb-5">
                <p className="font-bold text-slate-900 text-sm">{doctor.title} {doctor.name}</p>
                <p className="text-xs text-sky-600">{hospitalName} · {primary?.specialty.name}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  {selectedDate.toLocaleDateString('en-BD', { weekday:'long', day:'numeric', month:'long' })}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Clock className="w-4 h-4 text-sky-500" />
                  {formatTime12(selectedSlot)}
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4">Appointment ID: <span className="font-bold text-slate-600">SBD-{Date.now().toString().slice(-8)}</span></p>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/880${doctor.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(`Hello, I have booked an appointment with ${doctor.title} ${doctor.name} on ${selectedDate.toLocaleDateString('en-BD')} at ${formatTime12(selectedSlot)}. Appointment ID: SBD-${Date.now().toString().slice(-8)}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm py-3 rounded-2xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Doctor
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-2xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== 'success' && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
            <div className="flex gap-3">
              {step !== 'date' && (
                <button
                  onClick={() => {
                    if (step === 'slot')    setStep('date');
                    if (step === 'details') setStep('slot');
                    if (step === 'confirm') setStep('details');
                  }}
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 'date') {
                    if (selectedDate && daySchedule) setStep('slot');
                  } else if (step === 'slot') {
                    if (selectedSlot) setStep('details');
                  } else if (step === 'details') {
                    if (validate()) setStep('confirm');
                  } else if (step === 'confirm') {
                    handleBook();
                  }
                }}
                disabled={
                  loading ||
                  (step === 'date' && (!selectedDate || !daySchedule)) ||
                  (step === 'slot' && !selectedSlot)
                }
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all',
                  'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                )}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>
                ) : step === 'confirm' ? (
                  <><CheckCircle2 className="w-4 h-4" /> Confirm Booking</>
                ) : (
                  <>Next <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}