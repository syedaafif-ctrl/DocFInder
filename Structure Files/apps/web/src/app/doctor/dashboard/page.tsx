'use client';

// apps/web/src/app/doctor/dashboard/page.tsx
// Swastha BD - Doctor Portal & Multi-Chamber Practice Console

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Phone,
  User as UserIcon,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  X,
  Loader2,
  RotateCw,
  FileText,
  Sparkles,
  ShieldAlert,
  Home,
  MessageSquare,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  getDoctorStatsApi,
  getDoctorChambersApi,
  getDoctorAppointmentsApi,
  confirmDoctorAppointmentApi,
  cancelDoctorAppointmentApi,
  completeDoctorAppointmentApi,
  DoctorStats,
  DoctorChamber,
  DoctorAppointment,
} from '@/lib/doctor';

type QueueFilter = 'pending' | 'today' | 'upcoming' | 'completed' | 'all';

function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, token, isLoading: authLoading, isAuthenticated, openAuthModal } = useAuth();

  // Selected chamber filter (empty string means All Chambers)
  const [selectedChamberId, setSelectedChamberId] = useState<string>('');
  const [activeQueueFilter, setActiveQueueFilter] = useState<QueueFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [chambers, setChambers] = useState<DoctorChamber[]>([]);
  const [chambersLoading, setChambersLoading] = useState(true);

  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [appointmentsTotal, setAppointmentsTotal] = useState(0);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  // Action states & modals
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeTargetId, setCompleteTargetId] = useState<string | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');

  // Feedback banner
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // ─── Data Loaders ─────────────────────────────────────────────
  const loadStatsAndChambers = async () => {
    if (!token) return;
    setStatsLoading(true);
    setChambersLoading(true);

    try {
      const [statsData, chambersData] = await Promise.all([
        getDoctorStatsApi(token),
        getDoctorChambersApi(token),
      ]);
      setStats(statsData);
      setChambers(chambersData);
    } catch (err) {
      console.error('Failed to load doctor stats or chambers', err);
    } finally {
      setStatsLoading(false);
      setChambersLoading(false);
    }
  };

  const loadAppointments = async () => {
    if (!token) return;
    setAppointmentsLoading(true);

    try {
      let statusParam: string | undefined = undefined;
      let dateScopeParam: string | undefined = undefined;

      if (activeQueueFilter === 'pending') {
        statusParam = 'PENDING';
      } else if (activeQueueFilter === 'today') {
        dateScopeParam = 'today';
      } else if (activeQueueFilter === 'upcoming') {
        dateScopeParam = 'upcoming';
      } else if (activeQueueFilter === 'completed') {
        statusParam = 'COMPLETED';
      }

      const res = await getDoctorAppointmentsApi(token, {
        chamberId: selectedChamberId || undefined,
        status: statusParam,
        dateScope: dateScopeParam,
        search: searchQuery || undefined,
        limit: 30,
      });

      setAppointments(res.data);
      setAppointmentsTotal(res.total);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || (user?.role !== 'DOCTOR' && user?.role !== 'SUPER_ADMIN')) return;
    loadStatsAndChambers();
  }, [token, user?.role]);

  useEffect(() => {
    if (!token || (user?.role !== 'DOCTOR' && user?.role !== 'SUPER_ADMIN')) return;
    loadAppointments();
  }, [token, selectedChamberId, activeQueueFilter, searchQuery]);

  // ─── Actions ──────────────────────────────────────────────────
  const handleConfirm = async (id: string) => {
    if (!token) return;
    setActionLoadingId(id);
    try {
      await confirmDoctorAppointmentApi(id, token);
      showFeedback('success', 'Appointment confirmed successfully!');
      loadAppointments();
      loadStatsAndChambers();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to confirm appointment');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !declineTargetId) return;

    setActionLoadingId(declineTargetId);
    try {
      await cancelDoctorAppointmentApi(declineTargetId, declineReason || 'Cancelled by doctor', token);
      showFeedback('success', 'Appointment declined and slot released.');
      setDeclineModalOpen(false);
      setDeclineTargetId(null);
      setDeclineReason('');
      loadAppointments();
      loadStatsAndChambers();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to cancel appointment');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !completeTargetId) return;

    setActionLoadingId(completeTargetId);
    try {
      await completeDoctorAppointmentApi(completeTargetId, consultationNotes || undefined, token);
      showFeedback('success', 'Consultation marked as completed!');
      setCompleteModalOpen(false);
      setCompleteTargetId(null);
      setConsultationNotes('');
      loadAppointments();
      loadStatsAndChambers();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to complete appointment');
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─── Guard Check ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
        <p className="text-xs font-semibold text-slate-500">Accessing Doctor Practice Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'DOCTOR' && user?.role !== 'SUPER_ADMIN')) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4 text-teal-600">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Doctor Practice Portal</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This console is reserved for verified doctors to manage chamber schedules, accept incoming patient booking requests, and conduct clinical visits.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-teal-600/20 transition-all"
              >
                Sign In with Doctor Credentials
              </button>
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Active chamber label
  const selectedChamber = chambers.find((c) => c.id === selectedChamberId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Feedback alert banner */}
          {feedbackMsg && (
            <div
              className={
                'mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ' +
                (feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800')
              }
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              {feedbackMsg.text}
            </div>
          )}

          {/* ── Top Hero: Doctor Profile & Multi-Chamber Selector ── */}
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-950/15 mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Doctor Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shrink-0 shadow-inner">
                  {stats?.doctor?.photo ? (
                    <Image
                      src={stats.doctor.photo}
                      alt={stats.doctor.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-teal-200">
                      DR
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                      Doctor Console
                    </span>
                    <span className="text-[11px] text-teal-200 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {chambers.length} Practice Chambers
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {stats?.doctor?.title} {stats?.doctor?.name || user?.name}
                  </h1>
                  <p className="text-xs text-teal-100/80 mt-0.5 flex items-center gap-3">
                    <span>{user?.email}</span>
                    {stats?.doctor?.slug && (
                      <Link
                        href={`/doctors/${stats.doctor.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-teal-300 hover:text-white underline text-[11px]"
                      >
                        Public Profile <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </p>
                </div>
              </div>

              {/* Chamber Switcher Filter */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 min-w-[280px]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-teal-200 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Practice Chamber Location
                </label>
                <select
                  value={selectedChamberId}
                  onChange={(e) => setSelectedChamberId(e.target.value)}
                  className="w-full bg-slate-900/90 text-white border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  <option value="">All Practice Chambers ({chambers.length})</option>
                  {chambers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.hospital?.name ? `${c.hospital.name} - ` : ''}
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedChamber && (
                  <p className="text-[11px] text-teal-100/80 mt-1.5 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-300 shrink-0" />
                    {selectedChamber.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── 4 KPI Metric Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Queue</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1">
                  {statsLoading ? '...' : stats?.metrics.todayPatients ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for today</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div
              onClick={() => setActiveQueueFilter('pending')}
              className={
                'rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ' +
                (activeQueueFilter === 'pending'
                  ? 'bg-amber-500/10 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-100 hover:border-amber-200')
              }
            >
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Approvals</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
                  {statsLoading ? '...' : stats?.metrics.pendingApprovals ?? 0}
                </p>
                <p className="text-[11px] text-amber-700/80 mt-0.5">Awaiting your confirmation</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Confirmed</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
                  {statsLoading ? '...' : stats?.metrics.confirmedUpcoming ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Future booked visits</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Visits</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
                  {statsLoading ? '...' : stats?.metrics.completedConsultations ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {stats?.metrics.totalBookings ?? 0} total lifetime
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ── Main Appointment Management Area ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveQueueFilter('pending')}
                  className={
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ' +
                    (activeQueueFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Pending Requests</span>
                  {stats?.metrics.pendingApprovals ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-extrabold">
                      {stats.metrics.pendingApprovals}
                    </span>
                  ) : null}
                </button>

                <button
                  onClick={() => setActiveQueueFilter('today')}
                  className={
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ' +
                    (activeQueueFilter === 'today'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Today's Queue</span>
                </button>

                <button
                  onClick={() => setActiveQueueFilter('upcoming')}
                  className={
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ' +
                    (activeQueueFilter === 'upcoming'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming</span>
                </button>

                <button
                  onClick={() => setActiveQueueFilter('completed')}
                  className={
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ' +
                    (activeQueueFilter === 'completed'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </button>

                <button
                  onClick={() => setActiveQueueFilter('all')}
                  className={
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ' +
                    (activeQueueFilter === 'all'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }
                >
                  <span>All Visits</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Patient name, phone, serial..."
                  className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* List / Table of Appointments */}
            {appointmentsLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading patient schedule...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/70 rounded-2xl border border-slate-100">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  {activeQueueFilter === 'pending'
                    ? 'All Caught Up! No Pending Requests'
                    : 'No Consultations Found'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {activeQueueFilter === 'pending'
                    ? 'Any new booking requests from patients will appear here for your confirmation.'
                    : 'No appointments match the selected chamber or status filter.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => {
                  const isPending = appt.status === 'PENDING';
                  const isConfirmed = appt.status === 'CONFIRMED';
                  const isCompleted = appt.status === 'COMPLETED';

                  return (
                    <div
                      key={appt.id}
                      className={
                        'p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ' +
                        (isPending
                          ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
                          : 'bg-white border-slate-100 hover:border-teal-200 hover:shadow-sm')
                      }
                    >
                      {/* Left: Patient Info & Slot */}
                      <div className="flex items-start gap-4">
                        <div
                          className={
                            'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ' +
                            (isPending
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : isConfirmed
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200')
                          }
                        >
                          {appt.slotTime}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              #{appt.appointmentNumber}
                            </span>
                            <span
                              className={
                                'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
                                (appt.status === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : appt.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : appt.status === 'COMPLETED'
                                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200')
                              }
                            >
                              {appt.status}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                            {appt.patientName}
                            {appt.patientAge ? <span className="text-xs font-normal text-slate-500 ml-1.5">({appt.patientAge} yrs, {appt.patientGender})</span> : null}
                          </h3>

                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {appt.patientPhone}
                            </span>
                            <span className="flex items-center gap-1 text-teal-800 font-medium">
                              <Building2 className="w-3 h-3 text-teal-600" />
                              {appt.chamber?.name || 'Main Chamber'}
                            </span>
                          </div>

                          {appt.symptoms && (
                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <span className="font-semibold text-slate-700">Reason / Symptoms:</span>{' '}
                              {appt.symptoms}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Doctor Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end shrink-0">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleConfirm(appt.id)}
                              disabled={actionLoadingId === appt.id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
                            >
                              {actionLoadingId === appt.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Confirm Visit
                            </button>

                            <button
                              onClick={() => {
                                setDeclineTargetId(appt.id);
                                setDeclineModalOpen(true);
                              }}
                              disabled={actionLoadingId === appt.id}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </>
                        )}

                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => {
                                setCompleteTargetId(appt.id);
                                setCompleteModalOpen(true);
                              }}
                              disabled={actionLoadingId === appt.id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mark Completed
                            </button>

                            <button
                              onClick={() => {
                                setDeclineTargetId(appt.id);
                                setDeclineModalOpen(true);
                              }}
                              disabled={actionLoadingId === appt.id}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {isCompleted && (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Consultation Finished
                            </span>
                            {appt.consultationNotes && (
                              <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
                                Notes: {appt.consultationNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ── Decline / Cancel Modal ── */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Decline Appointment Request</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Please state why this appointment is being cancelled (e.g. emergency surgery, chamber closed, doctor unavailable).
            </p>
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <textarea
                required
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeclineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId !== null}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  {actionLoadingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Complete Visit Modal ── */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Complete Consultation</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Add optional consultation notes or prescription advice for the patient record.
            </p>
            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Consultation notes, diagnosed condition, advice..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId !== null}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  {actionLoadingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Mark Completed'}
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

export default function DoctorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <DoctorDashboardContent />
    </Suspense>
  );
}
