'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, AlertCircle, Loader2, Stethoscope, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-6 text-white text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl leading-tight">
              Doc<span className="text-emerald-200">Finder</span> BD
            </h1>
          </Link>
          <p className="text-xs text-emerald-100">Create your account</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Account Type</label>
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

            <p className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-teal-600 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
