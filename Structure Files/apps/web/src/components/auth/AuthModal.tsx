'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { X, LogIn, UserPlus, AlertCircle, Loader2, Stethoscope, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const router = useRouter();
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      if (email === 'admin@swasthabd.com') {
        router.push('/admin');
      } else if (email.startsWith('dr.') || email.includes('doctor')) {
        router.push('/doctor/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        phone: phone || undefined,
        role,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@swasthabd.com');
    setPassword('Admin@123456');
    setError(null);
  };

  const fillDemoDoctor = () => {
    setEmail('dr.aminul@swasthabd.com');
    setPassword('Doctor@123456');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">
                  Doc<span className="text-emerald-200">Finder</span> BD
                </h3>
                <p className="text-xs text-emerald-100">Healthcare Discovery Platform</p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-teal-900/40 p-1 rounded-xl mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setError(null);
                openAuthModal('login');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authModalTab === 'login'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                openAuthModal('register');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authModalTab === 'register'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {authModalTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In
              </button>

              {/* Demo helper */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fillDemoDoctor}
                    className="text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    Demo Doctor
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Demo Admin
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  No account? <span className="text-teal-600 font-medium">Register</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Aminul Islam or Tanvir Ahmed"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+88017..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Register As</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('PATIENT')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      role === 'PATIENT'
                        ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DOCTOR')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      role === 'DOCTOR'
                        ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Doctor
                  </button>
                </div>
                {role === 'DOCTOR' && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Doctor accounts require administrative review. Upon registering, your application will be reviewed by an administrator before practice chambers and patient appointments are activated.
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Create Account
              </button>

              <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-teal-600 font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
