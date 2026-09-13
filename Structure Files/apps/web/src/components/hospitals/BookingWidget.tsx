'use client';

import React from 'react';
import BookingModal from '@/components/BookingModal';

export default function BookingWidget(props: any) {
  return (
    <BookingModal
      doctor={props.doctor}
      hospital={props.hospitalName ? { id: props.chamber?.hospitalId || '', name: props.hospitalName } : null}
      initialChamberId={props.chamber?.id}
      isOpen={true}
      onClose={props.onClose}
    />
  );
}

// ─── Legacy stub kept for backward compatibility ──────────────────────────────
type Step = 'slot' | 'details' | 'confirm' | 'success';

const DAYS_SHORT: DayOfWeek[] = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

function getNextNDates(n: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 1; dates.length < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function getDayOfWeek(date: Date): DayOfWeek {
  const map: DayOfWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return map[date.getDay()];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getScheduleForDate(chamber: DoctorChamber, date: Date): ChamberSchedule | undefined {
  const dow = getDayOfWeek(date);
  return chamber.schedules.find((s) => s.day === dow);
}

// Fake already-booked slots (simulate some taken)
const FAKE_BOOKED: Record<string, string[]> = {};

export default function BookingWidget({ doctor, chamber, hospitalName, onClose }: BookingWidgetProps) {
  const next14 = useMemo(() => getNextNDates(14), []);

  const availableDates = useMemo(
    () => next14.filter((d) => getScheduleForDate(chamber, d) !== undefined),
    [next14, chamber]
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(availableDates[0] ?? null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('slot');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    patientGender: '',
    symptoms: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schedule = selectedDate ? getScheduleForDate(chamber, selectedDate) : undefined;

  const slots = useMemo(() => {
    if (!schedule) return [];
    const all = generateSlots(schedule);
    const dateKey = selectedDate?.toISOString().slice(0, 10) ?? '';
    const booked = FAKE_BOOKED[dateKey] ?? [];
    // Fake: mark ~20% booked
    return all.map((s, i) => ({ time: s, booked: booked.includes(s) || (i % 7 === 0 && i > 0) }));
  }, [schedule, selectedDate]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Name is required';
    if (!form.patientPhone.trim()) e.patientPhone = 'Phone is required';
    else if (!/^(\+880|880|0)[1-9]\d{8,9}$/.test(form.patientPhone.replace(/\s/g, ''))) e.patientPhone = 'Enter a valid Bangladesh phone number';
    if (!form.patientAge || +form.patientAge < 1 || +form.patientAge > 120) e.patientAge = 'Enter a valid age';
    if (!form.patientGender) e.patientGender = 'Select gender';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('success');
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-start gap-3 shrink-0">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-12 h-12 rounded-2xl bg-slate-100 object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-tight">
              {doctor.title} {doctor.name}
            </p>
            <p className="text-xs text-sky-600 font-medium">{doctor.specialtyName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{hospitalName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400">Consultation fee</p>
            <p className="font-bold text-emerald-600">৳{(chamber.fee ?? doctor.consultationFee ?? 0).toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        {step !== 'success' && (
          <div className="px-5 py-3 border-b border-slate-50 shrink-0">
            <div className="flex items-center gap-2">
              {(['slot', 'details', 'confirm'] as Step[]).map((s, i) => {
                const labels = ['Choose Slot', 'Your Details', 'Confirm'];
                const idx = ['slot', 'details', 'confirm'].indexOf(step);
                const isPast = i < idx;
                const isCurrent = s === step;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                      isCurrent ? 'bg-sky-600 text-white' :
                      isPast ? 'bg-emerald-500 text-white' :
                      'bg-slate-100 text-slate-400'
                    )}>
                      {isPast ? '✓' : i + 1}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-sky-700' : isPast ? 'text-emerald-600' : 'text-slate-400'
                    )}>{labels[i]}</span>
                    {i < 2 && <div className="w-6 h-px bg-slate-200" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* ── STEP 1: Choose Slot ── */}
          {step === 'slot' && (
            <div className="p-5 space-y-5">
              {/* Date selector */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Select Date
                </p>
                {availableDates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    No available dates in the next 2 weeks.
                  </div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {availableDates.map((date) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const dow = getDayOfWeek(date);
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                          className={cn(
                            'shrink-0 flex flex-col items-center px-3 py-2.5 rounded-2xl border-2 transition-all min-w-[60px]',
                            isSelected
                              ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200'
                              : 'border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                          )}
                        >
                          <span className="text-[10px] font-semibold uppercase">{dow}</span>
                          <span className="font-bold text-lg leading-tight">{date.getDate()}</span>
                          <span className="text-[10px]">{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Slot grid */}
              {selectedDate && schedule && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Available Slots — {formatDate(selectedDate)}
                    <span className="ml-auto text-slate-400 normal-case font-normal">
                      {slots.filter((s) => !s.booked).length} available
                    </span>
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(({ time, booked }) => (
                      <button
                        key={time}
                        disabled={booked}
                        onClick={() => setSelectedSlot(time)}
                        className={cn(
                          'py-2.5 px-1 rounded-xl text-xs font-semibold border-2 transition-all',
                          booked
                            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                            : selectedSlot === time
                              ? 'border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-200'
                              : 'border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                        )}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-600 inline-block" /> Selected</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block" /> Booked</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-slate-200 inline-block" /> Available</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Patient Details ── */}
          {step === 'details' && (
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 mb-1">
                Appointment: <span className="font-semibold text-slate-800">{selectedDate && formatDate(selectedDate)}</span> at <span className="font-semibold text-slate-800">{selectedSlot && formatTime(selectedSlot)}</span>
              </p>

              {[
                { key: 'patientName', label: 'Full Name', type: 'text', placeholder: 'Patient\'s full name', icon: User },
                { key: 'patientPhone', label: 'Phone Number', type: 'tel', placeholder: '01XXXXXXXXX', icon: Phone },
              ].map(({ key, label, type, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className={cn(
                        'w-full pl-10 pr-4 py-3 rounded-2xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition',
                        errors[key] ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
                      )}
                    />
                  </div>
                  {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Age</label>
                  <input
                    type="number"
                    min={1} max={120}
                    placeholder="Age"
                    value={form.patientAge}
                    onChange={(e) => setForm((p) => ({ ...p, patientAge: e.target.value }))}
                    className={cn(
                      'w-full px-4 py-3 rounded-2xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition',
                      errors.patientAge ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
                    )}
                  />
                  {errors.patientAge && <p className="text-xs text-red-500 mt-1">{errors.patientAge}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Gender</label>
                  <select
                    value={form.patientGender}
                    onChange={(e) => setForm((p) => ({ ...p, patientGender: e.target.value }))}
                    className={cn(
                      'w-full px-4 py-3 rounded-2xl border text-sm text-slate-700 focus:outline-none focus:ring-2 transition bg-white',
                      errors.patientGender ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-200'
                    )}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.patientGender && <p className="text-xs text-red-500 mt-1">{errors.patientGender}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Symptoms / Reason (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your symptoms or reason for visit…"
                  value={form.symptoms}
                  onChange={(e) => setForm((p) => ({ ...p, symptoms: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none transition"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 'confirm' && (
            <div className="p-5">
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Appointment Summary</h3>
                {[
                  ['Doctor', `${doctor.title} ${doctor.name}`],
                  ['Specialty', doctor.specialtyName],
                  ['Hospital', hospitalName],
                  ['Date', selectedDate ? formatDate(selectedDate) : ''],
                  ['Time', selectedSlot ? formatTime(selectedSlot) : ''],
                  ['Patient', form.patientName],
                  ['Phone', form.patientPhone],
                  ['Age / Gender', `${form.patientAge} yrs · ${form.patientGender}`],
                  ['Consultation Fee', `৳${chamber.fee.toLocaleString()}`],
                  ['Platform Fee', '৳75'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-800">Total</span>
                  <span className="text-emerald-600 text-base">৳{(chamber.fee + 75).toLocaleString()}</span>
                </div>
              </div>
              {form.symptoms && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
                  <span className="font-semibold">Symptoms:</span> {form.symptoms}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-3 text-center">
                Payment will be collected at the hospital. You'll receive an SMS confirmation.
              </p>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-playfair font-bold text-xl text-slate-900 mb-2">Appointment Booked!</h3>
              <p className="text-slate-500 text-sm mb-5">
                Your appointment with <strong>{doctor.title} {doctor.name}</strong> has been confirmed for{' '}
                <strong>{selectedDate && formatDate(selectedDate)}</strong> at{' '}
                <strong>{selectedSlot && formatTime(selectedSlot)}</strong>.
              </p>
              <div className="bg-slate-50 rounded-2xl px-4 py-3 text-xs text-slate-500 mb-5">
                A confirmation SMS will be sent to <strong className="text-slate-700">{form.patientPhone}</strong>.<br />
                Please arrive 15 minutes early with a valid ID.
              </div>
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-xs text-slate-400">Get well soon!</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'success' && (
          <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
            {step !== 'slot' && (
              <button
                onClick={() => setStep(step === 'confirm' ? 'details' : 'slot')}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={() => {
                if (step === 'slot') {
                  if (!selectedDate || !selectedSlot) return;
                  setStep('details');
                } else if (step === 'details') {
                  const e = validate();
                  if (Object.keys(e).length) { setErrors(e); return; }
                  setErrors({});
                  setStep('confirm');
                } else if (step === 'confirm') {
                  handleSubmit();
                }
              }}
              disabled={
                (step === 'slot' && (!selectedDate || !selectedSlot)) ||
                submitting
              }
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all',
                'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
              )}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</>
              ) : step === 'slot' ? (
                'Continue to Details'
              ) : step === 'details' ? (
                'Review Appointment'
              ) : (
                'Confirm & Book'
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="px-5 pb-5 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}