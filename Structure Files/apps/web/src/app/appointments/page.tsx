// src/app/appointments/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Stethoscope, LogIn } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'My Appointments | DocFinder BD',
  description: 'View and manage your doctor appointments.',
};

export default function AppointmentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 mb-1">My Appointments</h1>
            <p className="text-slate-500 text-sm">Track and manage all your doctor appointments</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
            {['Upcoming', 'Completed', 'Cancelled'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Empty state — user needs to log in */}
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-sky-500" />
            </div>
            <h2 className="font-bold text-slate-900 text-xl mb-2">No appointments yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Sign in to view your appointments, or find a doctor and book your first appointment now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
                Find a Doctor
              </Link>
            </div>
          </div>

          {/* How it works mini section */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Find a Doctor', desc: 'Search by specialty, location, or name' },
              { icon: '📅', title: 'Book a Slot', desc: 'Choose your preferred date and time' },
              { icon: '✅', title: 'Get Care', desc: 'Visit in-person or consult online' },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{step.title}</h3>
                <p className="text-slate-500 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}