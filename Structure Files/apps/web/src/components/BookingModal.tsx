'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  User,
  Phone,
  CalendarCheck,
} from 'lucide-react';
import { getDoctorSlotsApi, bookAppointmentApi } from '@/lib/auth';

interface BookingModalProps {
  doctor: {
    id: string;
    name: string;
    title?: string | null;
    consultationFee: number;
    chambers?: Array<{
      id: string;
      name: string;
      address: string;
      appointmentFee?: number;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: any) => void;
}

export default function BookingModal({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();

  const chambers = doctor.chambers || [];
  const [selectedChamberId, setSelectedChamberId] = useState<string>(
    chambers[0]?.id || ''
  );

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowStr());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsData, setSlotsData] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [symptoms, setSymptoms] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (!patientName) setPatientName(user.name || '');
      if (!patientPhone && user.phone) setPatientPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen || !doctor.id || !date) return;
    let active = true;
    setLoadingSlots(true);
    setSelectedSlot('');
    setError(null);

    getDoctorSlotsApi(doctor.id, date, selectedChamberId || undefined)
      .then((data) => {
        if (active) setSlotsData(data);
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Could not load slots');
          setSlotsData(null);
        }
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, doctor.id, date, selectedChamberId]);

  if (!isOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated || !token) {
      openAuthModal('login');
      return;
    }

    if (!selectedSlot) {
      setError('Please select an available time slot');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookAppointmentApi(
        {
          doctorId: doctor.id,
          chamberId: selectedChamberId || undefined,
          appointmentDate: date,
          slotTime: selectedSlot,
          patientName,
          patientPhone,
          patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
          patientGender,
          symptoms: symptoms || undefined,
        },
        token
      );

      setBookedAppointment(res);
      if (onSuccess) onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Failed to complete appointment booking');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedChamber = chambers.find((c) => c.id === selectedChamberId) || chambers[0];
  const fee = selectedChamber?.appointmentFee || doctor.consultationFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">Book Appointment</h3>
            <p className="text-xs text-emerald-100">
              {doctor.title ? doctor.title + ' ' : ''}{doctor.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {bookedAppointment ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-xl mb-1">Appointment Requested!</h4>
              <p className="text-xs text-slate-500 mb-6">
                Your appointment number is{' '}
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {bookedAppointment.appointmentNumber}
                </span>
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-semibold text-slate-800">{date} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient</span>
                  <span className="font-semibold text-slate-800">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chamber</span>
                  <span className="font-semibold text-slate-800">{selectedChamber?.name || 'Main Chamber'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-teal-700">৳{fee} (Pay at clinic)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/appointments"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl text-center shadow-sm"
                >
                  View My Appointments
                </a>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {chambers.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Select Chamber</label>
                  <select
                    value={selectedChamberId}
                    onChange={(e) => setSelectedChamberId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {chambers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700">Available Time Slots</label>
                  {slotsData?.day && (
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      {slotsData.day}
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    Checking slot availability...
                  </div>
                ) : !slotsData?.available ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    {slotsData?.reason || 'Doctor is not available on this date. Please pick another day.'}
                  </div>
                ) : slotsData.slots.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs text-center">
                    No slots configured for this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                    {slotsData.slots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      const isBooked = slot.isBooked;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={
                            'py-2 text-xs font-semibold rounded-xl border transition-all ' +
                            (isBooked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50')
                          }
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-900">Patient Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Patient's name"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+88017..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Symptoms / Reason (Optional)</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Back pain, headache"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-teal-800 font-semibold">Consultation Fee</p>
                  <p className="text-[10px] text-teal-600">Payable at clinic on visit</p>
                </div>
                <span className="text-sm font-black text-teal-900">৳{fee}</span>
              </div>

              {!isAuthenticated && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                  You are not signed in. Clicking confirm will prompt you to sign in or register in 1 step!
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !slotsData?.available}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CalendarCheck className="w-4 h-4" />
                )}
                Confirm Appointment Slot
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
