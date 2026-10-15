'use client';

// apps/web/src/app/dashboard/page.tsx
// Swastha BD - Patient Personal Dashboard

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Heart,
  User as UserIcon,
  Settings,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Star,
  Building2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Phone,
  RotateCw,
  Trash2,
  Loader2,
  Sparkles,
  ExternalLink,
  Save,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  getPatientStatsApi,
  getSavedDoctorsApi,
  unsaveDoctorApi,
  updatePatientProfileApi,
  PatientStats,
} from '@/lib/auth';

type DashboardTab = 'overview' | 'appointments' | 'saved' | 'profile';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = (searchParams.get('tab') as DashboardTab) || 'overview';

  const { user, token, isLoading: authLoading, isAuthenticated, openAuthModal, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && ['overview', 'appointments', 'saved', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: DashboardTab) => {
    setActiveTab(newTab);
    router.replace(`/dashboard?tab=${newTab}`, { scroll: false });
  };

  // Dashboard Data States
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [savedDoctors, setSavedDoctors] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: '',
    nameBn: '',
    phone: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '',
    preferredLanguage: 'en',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Load patient overview stats
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    setStatsLoading(true);
    getPatientStatsApi(token)
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error('Failed to load patient stats', err);
      })
      .finally(() => {
        setStatsLoading(false);
      });
  }, [token, isAuthenticated]);

  // Load saved doctors when switching to saved tab or on initial mount
  useEffect(() => {
    if (!token || !isAuthenticated) return;
    if (activeTab === 'saved' || activeTab === 'overview') {
      setSavedLoading(true);
      getSavedDoctorsApi(token)
        .then((docs) => {
          setSavedDoctors(docs);
        })
        .catch((err) => {
          console.error('Failed to load saved doctors', err);
        })
        .finally(() => {
          setSavedLoading(false);
        });
    }
  }, [token, isAuthenticated, activeTab]);

  // Populate profile form from user
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        nameBn: user.nameBn || '',
        phone: user.phone || '',
        gender: (user.gender as any) || 'MALE',
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split('T')[0]
          : '',
        preferredLanguage: user.preferredLanguage || 'en',
      });
    }
  }, [user]);

  // Remove saved doctor
  const handleRemoveSavedDoctor = async (doctorId: string) => {
    if (!token) return;
    setRemovingId(doctorId);
    try {
      await unsaveDoctorApi(doctorId, token);
      setSavedDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      if (stats) {
        setStats({ ...stats, savedDoctorsCount: Math.max(0, stats.savedDoctorsCount - 1) });
      }
    } catch (err) {
      console.error('Failed to remove saved doctor', err);
    } finally {
      setRemovingId(null);
    }
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setProfileSaving(true);
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      const updated = await updatePatientProfileApi(
        {
          name: profileForm.name.trim() || undefined,
          nameBn: profileForm.nameBn.trim() || undefined,
          phone: profileForm.phone.trim() || undefined,
          gender: profileForm.gender,
          dateOfBirth: profileForm.dateOfBirth || undefined,
          preferredLanguage: profileForm.preferredLanguage,
        },
        token
      );

      updateUser(updated);
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Failed to update profile information');
    } finally {
      setProfileSaving(false);
    }
  };

  // Unauthenticated or Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="w-9 h-9 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading your health dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4 text-teal-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Your Personal Dashboard</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Please sign in to track your medical consultations, view saved specialists, and manage your patient profile.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-teal-600/20 transition-all"
              >
                Sign In to Dashboard
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-all"
              >
                Create New Patient Account
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Top Header Greeting ── */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-inner shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PT'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                      Patient Portal
                    </span>
                    {user?.emailVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-200 bg-white/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Welcome back, {user?.name} 👋
                  </h1>
                  <p className="text-xs text-teal-100/80 mt-1 flex items-center gap-2">
                    <span>{user?.email}</span>
                    {user?.phone && <span>• {user.phone}</span>}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 transition-all shadow-md shadow-black/5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  Find Doctors
                </Link>
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-teal-600/70 hover:bg-teal-600 text-white border border-teal-400/30 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  My Appointments
                </Link>
              </div>
            </div>
          </div>

          {/* ── Navigation Tabs ── */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleTabChange('overview')}
              className={
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ' +
                (activeTab === 'overview'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white')
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => handleTabChange('appointments')}
              className={
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ' +
                (activeTab === 'appointments'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white')
              }
            >
              <Calendar className="w-3.5 h-3.5" />
              Appointments
              {stats?.upcomingAppointments ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-800/40 text-teal-100 font-semibold">
                  {stats.upcomingAppointments}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => handleTabChange('saved')}
              className={
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ' +
                (activeTab === 'saved'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white')
              }
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Saved Doctors
              {stats?.savedDoctorsCount ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-700 font-semibold">
                  {stats.savedDoctorsCount}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => handleTabChange('profile')}
              className={
                'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ' +
                (activeTab === 'profile'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white')
              }
            >
              <Settings className="w-3.5 h-3.5" />
              Profile Settings
            </button>
          </div>

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Visits</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1">
                      {statsLoading ? '...' : stats?.upcomingAppointments ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Visits</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
                      {statsLoading ? '...' : stats?.completedAppointments ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Saved Specialists</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
                      {statsLoading ? '...' : stats?.savedDoctorsCount ?? savedDoctors.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
                      {statsLoading ? '...' : stats?.totalAppointments ?? 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Next Scheduled Appointment Spotlight */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Next Scheduled Consultation</h2>
                      <p className="text-[11px] text-slate-500">Your upcoming appointment details</p>
                    </div>
                  </div>
                  <Link
                    href="/appointments"
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline"
                  >
                    View All
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {stats?.nextAppointment ? (
                  <div className="bg-gradient-to-r from-teal-50/70 via-slate-50 to-white rounded-2xl border border-teal-100/80 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <Image
                          src={
                            stats.nextAppointment.doctor?.photo ||
                            `https://api.dicebear.com/8.x/avataaars/svg?seed=${stats.nextAppointment.doctor?.slug}`
                          }
                          alt={stats.nextAppointment.doctor?.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                            {stats.nextAppointment.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            Ref #{stats.nextAppointment.appointmentNumber}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                          {stats.nextAppointment.doctor?.title} {stats.nextAppointment.doctor?.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {stats.nextAppointment.doctor?.specialties?.[0]?.specialty?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {stats.nextAppointment.chamber?.name || stats.nextAppointment.hospital?.name || 'In-Person Chamber'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs text-center min-w-[130px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment Date</p>
                        <p className="text-xs font-bold text-teal-800 mt-0.5">
                          {new Date(stats.nextAppointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                          {stats.nextAppointment.slotTime}
                        </p>
                      </div>

                      <Link
                        href="/appointments"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-sm"
                      >
                        Manage Booking
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">No Upcoming Appointments</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 mb-4">
                      Book an in-person or online consultation with Bangladesh's verified healthcare doctors.
                    </p>
                    <Link
                      href="/doctors"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Find a Doctor Now
                    </Link>
                  </div>
                )}
              </div>

              {/* Saved Doctors Quick Carousel / Grid */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Saved Medical Specialists</h2>
                      <p className="text-[11px] text-slate-500">Quick access to doctors you have bookmarked</p>
                    </div>
                  </div>
                  {savedDoctors.length > 0 && (
                    <button
                      onClick={() => handleTabChange('saved')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline"
                    >
                      View All ({savedDoctors.length})
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {savedLoading ? (
                  <div className="py-8 flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  </div>
                ) : savedDoctors.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-slate-100">
                    <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No doctors bookmarked yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                      Save your preferred doctors by clicking the bookmark icon on their profiles for quick booking.
                    </p>
                    <Link
                      href="/doctors"
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
                    >
                      Browse Doctor Directory <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedDoctors.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            <Image
                              src={doc.photo || `https://api.dicebear.com/8.x/avataaars/svg?seed=${doc.slug}`}
                              alt={doc.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {doc.title} {doc.name}
                            </h4>
                            <p className="text-[11px] text-teal-700 font-medium truncate">
                              {doc.specialties?.[0]?.specialty?.name || 'Specialist'}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="font-semibold">{Number(doc.rating || 5.0).toFixed(1)}</span>
                              <span>({doc.reviewCount || 0})</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-800">
                            ৳{doc.consultationFee}
                          </span>
                          <Link
                            href={`/doctors/${doc.slug}`}
                            className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            Book Visit
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: APPOINTMENTS ── */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto text-teal-600">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  Full Appointments Manager
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Manage all your upcoming visits, expired consultations, and past medical history with real-time slot checking and instant rescheduling.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/appointments"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
                  >
                    Open Appointments Portal
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/doctors"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Book New Visit
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: SAVED DOCTORS ── */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Saved Medical Specialists</h2>
                  <p className="text-xs text-slate-500">Doctors you have bookmarked for quick consultation</p>
                </div>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors border border-teal-200"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Explore Directory
                </Link>
              </div>

              {savedLoading ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                  <Loader2 className="w-7 h-7 animate-spin text-teal-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Loading your saved doctors...</p>
                </div>
              ) : savedDoctors.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-500">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">No Saved Doctors Found</h3>
                  <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
                    When you bookmark specialists on their profile pages, they will appear here so you can re-book them in seconds.
                  </p>
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Browse Bangladesh Doctors
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                              <Image
                                src={doc.photo || `https://api.dicebear.com/8.x/avataaars/svg?seed=${doc.slug}`}
                                alt={doc.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {doc.title} {doc.name}
                              </h4>
                              <p className="text-xs text-teal-700 font-semibold mt-0.5">
                                {doc.specialties?.[0]?.specialty?.name || 'Medical Specialist'}
                              </p>
                              {doc.specialties?.[0]?.specialty?.nameBn && (
                                <p className="text-[11px] text-slate-400">
                                  {doc.specialties[0].specialty.nameBn}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveSavedDoctor(doc.id)}
                            disabled={removingId === doc.id}
                            title="Remove bookmark"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            {removingId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Location & Experience */}
                        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                          {doc.district?.name && (
                            <p className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{doc.district.name}</span>
                            </p>
                          )}
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{doc.experience || 5}+ Years Experience</span>
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-0.5">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold">{Number(doc.rating || 5.0).toFixed(1)}</span>
                            <span className="text-slate-400">({doc.reviewCount || 0} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium">Consultation Fee</p>
                          <p className="text-xs font-extrabold text-teal-800">৳{doc.consultationFee}</p>
                        </div>

                        <Link
                          href={`/doctors/${doc.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          Book Visit
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: PROFILE SETTINGS ── */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-base">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal Patient Profile</h2>
                  <p className="text-xs text-slate-500">Update your contact information and consultation preferences</p>
                </div>
              </div>

              {profileSuccessMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {profileSuccessMsg}
                </div>
              )}

              {profileErrorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {profileErrorMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name (English) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Bengali Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name (Bangla / বাংলা)
                    </label>
                    <input
                      type="text"
                      value={profileForm.nameBn}
                      onChange={(e) => setProfileForm({ ...profileForm, nameBn: e.target.value })}
                      placeholder="e.g. তানভীর হোসেন"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Email (Read-Only) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address (Account ID)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number (Bangladesh)
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="e.g. 01712345678"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
                        })
                      }
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Communication Language
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="prefLang"
                        value="en"
                        checked={profileForm.preferredLanguage === 'en'}
                        onChange={() => setProfileForm({ ...profileForm, preferredLanguage: 'en' })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      English
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="prefLang"
                        value="bn"
                        checked={profileForm.preferredLanguage === 'bn'}
                        onChange={() => setProfileForm({ ...profileForm, preferredLanguage: 'bn' })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      বাংলা (Bangla)
                    </label>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-700">Account Type: {user?.role}</p>
                    <p className="text-[11px] mt-0.5">
                      Member since{' '}
                      {user ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Status
                  </span>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
