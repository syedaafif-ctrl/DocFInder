'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Calendar,
  Clock,
  Stethoscope,
  LogIn,
  AlertCircle,
  Loader2,
  XCircle,
  CheckCircle2,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import { getMyAppointmentsApi, cancelAppointmentApi } from '@/lib/auth';

const TABS = ['UPCOMING', 'COMPLETED', 'CANCELLED'] as const;

export default function AppointmentsPage() {
  const { user, token, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const fetchAppointments = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let queryStatus: string | undefined;
      if (activeTab === 'UPCOMING') queryStatus = 'PENDING';
      else if (activeTab === 'COMPLETED') queryStatus = 'COMPLETED';
      else if (activeTab === 'CANCELLED') queryStatus = 'CANCELLED';

      const res = await getMyAppointmentsApi(token, queryStatus);
      setAppointments(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (!authLoading) {
      fetchAppointments();
    }
  }, [authLoading, fetchAppointments]);

  const handleCancelAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !cancellingId) return;

    setCancelLoading(true);
    try {
      await cancelAppointmentApi(cancellingId, cancelReason || 'Patient request', token);
      setCancellingId(null);
      setCancelReason('');
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-1">
                My Appointments
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Track appointments, scheduled chamber visits, and consultation details.
              </p>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/20 w-fit"
            >
              <Stethoscope className="w-4 h-4" />
              Find & Book Doctor
            </Link>
          </div>

          {!authLoading && !isAuthenticated ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4 border border-teal-100">
                <Calendar className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="font-display font-bold text-slate-900 text-xl mb-2">
                Sign in to view your appointments
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                Access your scheduled consultations, doctor timings, and medical records in one secure dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-teal-600/20"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-1 bg-slate-200/60 p-1.5 rounded-2xl w-fit mb-6 border border-slate-200/60">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      'px-4 py-2 text-xs font-bold rounded-xl transition-all ' +
                      (activeTab === tab
                        ? 'bg-white text-teal-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900')
                    }
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
                  <p className="text-xs text-slate-500">Loading your appointments...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <CalendarCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">
                    No {activeTab.toLowerCase()} appointments
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
                    {activeTab === 'UPCOMING'
                      ? 'You have no scheduled upcoming visits. Search 12,400+ verified doctors across Bangladesh.'
                      : 'You have no ' + activeTab.toLowerCase() + ' appointments recorded.'}
                  </p>
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Book an appointment now <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => {
                    const formattedDate = new Date(appt.appointmentDate).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    );

                    const isUpcoming = appt.status === 'PENDING' || appt.status === 'CONFIRMED';

                    return (
                      <div
                        key={appt.id}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 shrink-0">
                              <Stethoscope className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {appt.doctor?.title ? appt.doctor.title + ' ' : ''}
                                  {appt.doctor?.name}
                                </h3>
                              </div>
                              <p className="text-xs text-teal-600 font-medium">
                                {appt.doctor?.specialties?.[0]?.specialty?.name || 'Specialist'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            {getStatusBadge(appt.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Appointment No.</span>
                            <span className="font-mono font-bold text-slate-800">
                              {appt.appointmentNumber}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Date & Time</span>
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-teal-600" />
                              {formattedDate} at {appt.slotTime}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Patient</span>
                            <span className="font-semibold text-slate-800">
                              {appt.patientName}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Fee</span>
                            <span className="font-bold text-teal-700">
                              ৳{appt.consultationFee}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-[11px] text-slate-500">
                            {appt.symptoms && (
                              <p className="truncate max-w-xs sm:max-w-md">
                                <span className="font-medium text-slate-700">Reason:</span>{' '}
                                {appt.symptoms}
                              </p>
                            )}
                            {appt.cancelReason && (
                              <p className="text-rose-600 truncate">
                                Cancel reason: {appt.cancelReason}
                              </p>
                            )}
                          </div>

                          {isUpcoming && (
                            <button
                              onClick={() => {
                                setCancellingId(appt.id);
                                setCancelReason('');
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors border border-rose-200"
                            >
                              Cancel Visit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {cancellingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base mb-1">Cancel Appointment?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please tell us why you are cancelling this appointment.
            </p>

            <form onSubmit={handleCancelAppointment} className="space-y-4">
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation"
                required
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
                <button
                  type="button"
                  onClick={() => setCancellingId(null)}
                  className="py-2.5 px-4 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Keep Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
