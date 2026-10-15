'use client';

// apps/web/src/app/admin/page.tsx
// Swastha BD - Super Admin Dashboard & Operations Console

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Loader2,
  Stethoscope,
  Building,
  UserCheck,
  Ban,
  ArrowUpRight,
  Home,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getAdminStatsApi,
  getAdminDoctorsApi,
  updateDoctorStatusApi,
  updateDoctorVerificationApi,
  toggleDoctorFeaturedApi,
  getAdminHospitalsApi,
  toggleHospitalFeaturedApi,
  toggleHospitalVerifiedApi,
  getAdminAppointmentsApi,
  getAdminUsersApi,
  updateUserStatusApi,
  getAdminReviewsApi,
  updateReviewStatusApi,
  AdminStats,
} from '@/lib/admin';

type AdminTab = 'overview' | 'doctors' | 'hospitals' | 'appointments' | 'users' | 'reviews';

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = (searchParams.get('tab') as AdminTab) || 'overview';

  const { user, token, isLoading: authLoading, isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(tabParam);

  useEffect(() => {
    if (tabParam && ['overview', 'doctors', 'hospitals', 'appointments', 'users', 'reviews'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: AdminTab) => {
    setActiveTab(newTab);
    router.replace(`/admin?tab=${newTab}`, { scroll: false });
  };

  // ─── State Management ─────────────────────────────────────────
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Doctors
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsTotal, setDoctorsTotal] = useState(0);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Hospitals
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [hospitalsTotal, setHospitalsTotal] = useState(0);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');

  // Appointments
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsTotal, setAppointmentsTotal] = useState(0);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('');

  // Users
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // ─── Data Loaders ─────────────────────────────────────────────
  const loadStats = () => {
    if (!token) return;
    setStatsLoading(true);
    getAdminStatsApi(token)
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load admin stats', err))
      .finally(() => setStatsLoading(false));
  };

  const loadDoctors = () => {
    if (!token) return;
    setDoctorsLoading(true);
    getAdminDoctorsApi(token, {
      search: doctorSearch || undefined,
      status: doctorStatusFilter || undefined,
      limit: 20,
    })
      .then((res) => {
        setDoctors(res.data);
        setDoctorsTotal(res.total);
      })
      .catch((err) => console.error('Failed to load doctors', err))
      .finally(() => setDoctorsLoading(false));
  };

  const loadHospitals = () => {
    if (!token) return;
    setHospitalsLoading(true);
    getAdminHospitalsApi(token, {
      search: hospitalSearch || undefined,
      limit: 20,
    })
      .then((res) => {
        setHospitals(res.data);
        setHospitalsTotal(res.total);
      })
      .catch((err) => console.error('Failed to load hospitals', err))
      .finally(() => setHospitalsLoading(false));
  };

  const loadAppointments = () => {
    if (!token) return;
    setAppointmentsLoading(true);
    getAdminAppointmentsApi(token, {
      search: appointmentSearch || undefined,
      status: appointmentStatusFilter || undefined,
      limit: 20,
    })
      .then((res) => {
        setAppointments(res.data);
        setAppointmentsTotal(res.total);
      })
      .catch((err) => console.error('Failed to load appointments', err))
      .finally(() => setAppointmentsLoading(false));
  };

  const loadUsers = () => {
    if (!token) return;
    setUsersLoading(true);
    getAdminUsersApi(token, {
      search: userSearch || undefined,
      role: userRoleFilter || undefined,
      limit: 20,
    })
      .then((res) => {
        setUsersList(res.data);
        setUsersTotal(res.total);
      })
      .catch((err) => console.error('Failed to load users', err))
      .finally(() => setUsersLoading(false));
  };

  const loadReviews = () => {
    if (!token) return;
    setReviewsLoading(true);
    getAdminReviewsApi(token, { limit: 20 })
      .then((res) => {
        setReviews(res.data);
        setReviewsTotal(res.total);
      })
      .catch((err) => console.error('Failed to load reviews', err))
      .finally(() => setReviewsLoading(false));
  };

  // Trigger loads based on active tab
  useEffect(() => {
    if (!token || user?.role !== 'SUPER_ADMIN') return;
    if (activeTab === 'overview') loadStats();
    if (activeTab === 'doctors') loadDoctors();
    if (activeTab === 'hospitals') loadHospitals();
    if (activeTab === 'appointments') loadAppointments();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'reviews') loadReviews();
  }, [token, activeTab, user?.role]);

  // Debounced filter triggers
  useEffect(() => {
    if (activeTab === 'doctors' && token) {
      const timer = setTimeout(() => loadDoctors(), 300);
      return () => clearTimeout(timer);
    }
  }, [doctorSearch, doctorStatusFilter]);

  useEffect(() => {
    if (activeTab === 'hospitals' && token) {
      const timer = setTimeout(() => loadHospitals(), 300);
      return () => clearTimeout(timer);
    }
  }, [hospitalSearch]);

  useEffect(() => {
    if (activeTab === 'appointments' && token) {
      const timer = setTimeout(() => loadAppointments(), 300);
      return () => clearTimeout(timer);
    }
  }, [appointmentSearch, appointmentStatusFilter]);

  useEffect(() => {
    if (activeTab === 'users' && token) {
      const timer = setTimeout(() => loadUsers(), 300);
      return () => clearTimeout(timer);
    }
  }, [userSearch, userRoleFilter]);

  // ─── Actions ──────────────────────────────────────────────────
  const handleApproveDoctor = async (doctorId: string) => {
    if (!token) return;
    setActionInProgress(doctorId);
    try {
      await updateDoctorStatusApi(doctorId, 'ACTIVE', token);
      await updateDoctorVerificationApi(doctorId, 'VERIFIED', true, token);
      loadDoctors();
      loadStats();
    } catch (err) {
      console.error('Failed to approve doctor', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleDoctorFeatured = async (doctorId: string) => {
    if (!token) return;
    setActionInProgress(doctorId);
    try {
      await toggleDoctorFeaturedApi(doctorId, token);
      loadDoctors();
    } catch (err) {
      console.error('Failed to toggle featured doctor', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleDoctorStatus = async (doctorId: string, currentStatus: string) => {
    if (!token) return;
    setActionInProgress(doctorId);
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await updateDoctorStatusApi(doctorId, nextStatus, token);
      loadDoctors();
    } catch (err) {
      console.error('Failed to update doctor status', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleHospitalFeatured = async (hospitalId: string) => {
    if (!token) return;
    setActionInProgress(hospitalId);
    try {
      await toggleHospitalFeaturedApi(hospitalId, token);
      loadHospitals();
    } catch (err) {
      console.error('Failed to toggle featured hospital', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleHospitalVerified = async (hospitalId: string) => {
    if (!token) return;
    setActionInProgress(hospitalId);
    try {
      await toggleHospitalVerifiedApi(hospitalId, token);
      loadHospitals();
    } catch (err) {
      console.error('Failed to toggle verified hospital', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    if (!token) return;
    setActionInProgress(userId);
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await updateUserStatusApi(userId, nextStatus, token);
      loadUsers();
    } catch (err) {
      console.error('Failed to update user status', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleModerateReview = async (reviewId: string, status: string) => {
    if (!token) return;
    setActionInProgress(reviewId);
    try {
      await updateReviewStatusApi(reviewId, status, token);
      loadReviews();
    } catch (err) {
      console.error('Failed to moderate review', err);
    } finally {
      setActionInProgress(null);
    }
  };

  // ─── Guard Check ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400 mb-3" />
        <p className="text-xs font-semibold text-slate-400">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center text-white shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            This area is restricted to Swastha BD Super Administrators. Please sign in with an administrative account to manage platform doctors, verification workflows, and global appointments.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs shadow-lg transition-all"
            >
              Sign In as Super Admin
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-600 transition-all"
            >
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Authenticated Admin Shell ────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-teal-500/20">
              S
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Doc<span className="text-teal-400">Finder</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Portal</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              SA
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-300">
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
              Management Modules
            </p>

            <button
              onClick={() => handleTabChange('overview')}
              className={
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'overview'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview & Analytics
            </button>

            <button
              onClick={() => handleTabChange('doctors')}
              className={
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'doctors'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="w-4 h-4" />
                Doctors & Verification
              </div>
              {stats?.doctors.pending ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold">
                  {stats.doctors.pending}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => handleTabChange('hospitals')}
              className={
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'hospitals'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <Building2 className="w-4 h-4" />
              Hospitals & Clinics
            </button>

            <button
              onClick={() => handleTabChange('appointments')}
              className={
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'appointments'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <Calendar className="w-4 h-4" />
              Global Appointments
            </button>

            <button
              onClick={() => handleTabChange('users')}
              className={
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'users'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <Users className="w-4 h-4" />
              User Accounts
            </button>

            <button
              onClick={() => handleTabChange('reviews')}
              className={
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ' +
                (activeTab === 'reviews'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }
            >
              <MessageSquare className="w-4 h-4" />
              Review Moderation
            </button>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DB Connected
              </span>
              <span className="font-mono text-slate-500">v1.0</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Platform Health & Metrics</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time operational overview across doctors, appointments, and facilities
                  </p>
                </div>
                <button
                  onClick={loadStats}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors w-fit"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Metrics
                </button>
              </div>

              {/* 5 KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Doctors</span>
                    <Stethoscope className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    {statsLoading ? '...' : stats?.doctors.total ?? 0}
                  </p>
                  <p className="text-[11px] text-teal-400 mt-1">
                    {stats?.doctors.active ?? 0} Active • {stats?.doctors.pending ?? 0} Pending
                  </p>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Hospitals</span>
                    <Building2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    {statsLoading ? '...' : stats?.hospitals.total ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Specialized & General Clinics</p>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    {statsLoading ? '...' : stats?.appointments.total ?? 0}
                  </p>
                  <p className="text-[11px] text-amber-400 mt-1">
                    {stats?.appointments.pending ?? 0} Pending Visit
                  </p>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Registered Users</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    {statsLoading ? '...' : stats?.users.total ?? 0}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    {stats?.users.patients ?? 0} Verified Patients
                  </p>
                </div>
              </div>

              {/* Pending Approval Alert Queue (if any) */}
              {stats?.pendingDoctorQueue && stats.pendingDoctorQueue.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-amber-300">
                      Doctor Verification Queue ({stats.pendingDoctorQueue.length} pending review)
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats.pendingDoctorQueue.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{doc.name}</p>
                          <p className="text-[11px] text-slate-400">BMDC: {doc.bmdcNumber || 'Unspecified'}</p>
                        </div>
                        <button
                          onClick={() => handleApproveDoctor(doc.id)}
                          disabled={actionInProgress === doc.id}
                          className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors"
                        >
                          {actionInProgress === doc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Platform Appointments */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Recent Global Appointments</h3>
                  <button
                    onClick={() => handleTabChange('appointments')}
                    className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Reference</th>
                        <th className="pb-3 font-semibold">Patient</th>
                        <th className="pb-3 font-semibold">Doctor</th>
                        <th className="pb-3 font-semibold">Slot Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {stats?.recentAppointments?.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-mono font-bold text-slate-300">
                            {appt.appointmentNumber}
                          </td>
                          <td className="py-3 text-white font-medium">
                            {appt.patientName}
                          </td>
                          <td className="py-3 text-slate-300">
                            {appt.doctor?.title} {appt.doctor?.name}
                          </td>
                          <td className="py-3 text-slate-400">
                            {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at {appt.slotTime}
                          </td>
                          <td className="py-3">
                            <span
                              className={
                                'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
                                (appt.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : appt.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-800 text-slate-400')
                              }
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-slate-200">
                            ৳{appt.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: DOCTORS & VERIFICATION ── */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Doctors Directory & Verification</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total: {doctorsTotal} medical specialists registered
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      placeholder="Search doctor or BMDC..."
                      className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all w-56"
                    />
                  </div>

                  <select
                    value={doctorStatusFilter}
                    onChange={(e) => setDoctorStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {doctorsLoading ? (
                <div className="p-16 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                          <th className="p-4 font-semibold">Doctor</th>
                          <th className="p-4 font-semibold">Specialty</th>
                          <th className="p-4 font-semibold">BMDC #</th>
                          <th className="p-4 font-semibold">District</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Verified</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {doctors.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                                  <Image
                                    src={doc.photo || `https://api.dicebear.com/8.x/avataaars/svg?seed=${doc.slug}`}
                                    alt={doc.name}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div>
                                  <Link
                                    href={`/doctors/${doc.slug}`}
                                    target="_blank"
                                    className="font-bold text-white hover:text-teal-400 transition-colors flex items-center gap-1"
                                  >
                                    {doc.title} {doc.name}
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </Link>
                                  <p className="text-[11px] text-slate-400">{doc.user?.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 text-slate-300">
                              {doc.specialties?.[0]?.specialty?.name || 'General'}
                            </td>

                            <td className="p-4 font-mono text-slate-300">
                              {doc.bmdcNumber || 'N/A'}
                            </td>

                            <td className="p-4 text-slate-400">
                              {doc.district?.name || 'Bangladesh'}
                            </td>

                            <td className="p-4">
                              <span
                                className={
                                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold ' +
                                  (doc.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : doc.status === 'PENDING_APPROVAL'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20')
                                }
                              >
                                {doc.status}
                              </span>
                            </td>

                            <td className="p-4">
                              {doc.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-teal-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">Unverified</span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Toggle Featured */}
                                <button
                                  onClick={() => handleToggleDoctorFeatured(doc.id)}
                                  disabled={actionInProgress === doc.id}
                                  title={doc.isFeatured ? 'Remove Featured' : 'Feature Doctor'}
                                  className={
                                    'p-1.5 rounded-lg border transition-all ' +
                                    (doc.isFeatured
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white')
                                  }
                                >
                                  <Star className={'w-3.5 h-3.5 ' + (doc.isFeatured ? 'fill-amber-400' : '')} />
                                </button>

                                {/* Approve if pending */}
                                {doc.status === 'PENDING_APPROVAL' && (
                                  <button
                                    onClick={() => handleApproveDoctor(doc.id)}
                                    disabled={actionInProgress === doc.id}
                                    className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition-colors"
                                  >
                                    Approve
                                  </button>
                                )}

                                {/* Suspend / Activate */}
                                <button
                                  onClick={() => handleToggleDoctorStatus(doc.id, doc.status)}
                                  disabled={actionInProgress === doc.id}
                                  className={
                                    'px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors ' +
                                    (doc.status === 'ACTIVE'
                                      ? 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                                      : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10')
                                  }
                                >
                                  {doc.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: HOSPITALS & FACILITIES ── */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Hospitals & Clinical Facilities</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total: {hospitalsTotal} partner hospitals and medical centers
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    placeholder="Search hospital name or address..."
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all w-64"
                  />
                </div>
              </div>

              {hospitalsLoading ? (
                <div className="p-16 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                          <th className="p-4 font-semibold">Hospital</th>
                          <th className="p-4 font-semibold">Type</th>
                          <th className="p-4 font-semibold">District</th>
                          <th className="p-4 font-semibold">Beds</th>
                          <th className="p-4 font-semibold">Emergency</th>
                          <th className="p-4 font-semibold text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {hospitals.map((hosp) => (
                          <tr key={hosp.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 font-bold text-white">
                              <Link
                                href={`/hospitals/${hosp.slug}`}
                                target="_blank"
                                className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                              >
                                {hosp.name}
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </Link>
                              <p className="text-[11px] text-slate-400 font-normal">{hosp.address}</p>
                            </td>

                            <td className="p-4 text-slate-300">
                              {hosp.type || 'SPECIALIZED'}
                            </td>

                            <td className="p-4 text-slate-400">
                              {hosp.district?.name || 'Dhaka'}
                            </td>

                            <td className="p-4 text-slate-300">
                              {hosp.totalBeds || 0} Beds (ICU: {hosp.icuBeds || 0})
                            </td>

                            <td className="p-4">
                              {hosp.hasEmergency ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  24/7 Active
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">Regular</span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleHospitalVerified(hosp.id)}
                                  disabled={actionInProgress === hosp.id}
                                  className={
                                    'px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ' +
                                    (hosp.isVerified
                                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white')
                                  }
                                >
                                  {hosp.isVerified ? 'Verified' : 'Verify'}
                                </button>

                                <button
                                  onClick={() => handleToggleHospitalFeatured(hosp.id)}
                                  disabled={actionInProgress === hosp.id}
                                  className={
                                    'p-1.5 rounded-lg border transition-all ' +
                                    (hosp.isFeatured
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white')
                                  }
                                >
                                  <Star className={'w-3.5 h-3.5 ' + (hosp.isFeatured ? 'fill-amber-400' : '')} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: APPOINTMENTS ── */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Global Appointments Monitor</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total: {appointmentsTotal} patient consultations recorded
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={appointmentSearch}
                      onChange={(e) => setAppointmentSearch(e.target.value)}
                      placeholder="Ref #, patient name, phone..."
                      className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all w-60"
                    />
                  </div>

                  <select
                    value={appointmentStatusFilter}
                    onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {appointmentsLoading ? (
                <div className="p-16 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                          <th className="p-4 font-semibold">Ref #</th>
                          <th className="p-4 font-semibold">Patient</th>
                          <th className="p-4 font-semibold">Doctor</th>
                          <th className="p-4 font-semibold">Appointment Date</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 font-mono font-bold text-teal-400">
                              {appt.appointmentNumber}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-white">{appt.patientName}</p>
                              <p className="text-[11px] text-slate-400">{appt.patientPhone}</p>
                            </td>
                            <td className="p-4 text-slate-300">
                              {appt.doctor?.title} {appt.doctor?.name}
                            </td>
                            <td className="p-4 text-slate-400">
                              {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              ({appt.slotTime})
                            </td>
                            <td className="p-4">
                              <span
                                className={
                                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold ' +
                                  (appt.status === 'CONFIRMED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : appt.status === 'PENDING'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-slate-800 text-slate-400')
                                }
                              >
                                {appt.status}
                              </span>
                            </td>
                            <td className="p-4 text-right font-bold text-slate-200">
                              ৳{appt.totalAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 5: USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Registered User Accounts</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total: {usersTotal} patient and practitioner accounts
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search email, name, phone..."
                      className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all w-60"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">All Roles</option>
                    <option value="PATIENT">Patient</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              {usersLoading ? (
                <div className="p-16 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                          <th className="p-4 font-semibold">User</th>
                          <th className="p-4 font-semibold">Phone</th>
                          <th className="p-4 font-semibold">Role</th>
                          <th className="p-4 font-semibold">Bookings</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-[11px] text-slate-400">{u.email}</p>
                            </td>
                            <td className="p-4 text-slate-400 font-mono">
                              {u.phone || 'N/A'}
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 text-slate-300">
                              {u._count?.appointments || 0} visits
                            </td>
                            <td className="p-4">
                              <span
                                className={
                                  'text-[10px] font-bold px-2 py-0.5 rounded-full ' +
                                  (u.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20')
                                }
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {u.role !== 'SUPER_ADMIN' && (
                                <button
                                  onClick={() => handleToggleUserStatus(u.id, u.status)}
                                  disabled={actionInProgress === u.id}
                                  className={
                                    'px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ' +
                                    (u.status === 'ACTIVE'
                                      ? 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                                      : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10')
                                  }
                                >
                                  {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 6: REVIEWS MODERATION ── */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Review Moderation Console</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total: {reviewsTotal} patient reviews across doctors and clinics
                </p>
              </div>

              {reviewsLoading ? (
                <div className="p-16 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">No Patient Reviews Pending Moderation</p>
                  <p className="text-xs text-slate-500 mt-1">
                    New reviews left by patients after completing visits will appear here for verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={
                                  'w-3.5 h-3.5 ' +
                                  (i < Math.round(rev.overallRating) ? 'fill-amber-400' : 'text-slate-700')
                                }
                              />
                            ))}
                          </div>
                          <span className="font-bold text-xs text-white">{rev.author?.name}</span>
                          <span className="text-[11px] text-slate-500">• For {rev.doctor?.name}</span>
                        </div>
                        <p className="text-xs text-slate-300">{rev.content}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleModerateReview(rev.id, 'APPROVED')}
                          disabled={actionInProgress === rev.id}
                          className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerateReview(rev.id, 'REJECTED')}
                          disabled={actionInProgress === rev.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/20 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
