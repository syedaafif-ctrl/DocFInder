'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Stethoscope, Search, Menu, X, Phone, LogIn, UserPlus,
  Building2, Calendar, BookOpen, ChevronDown, LogOut,
  LayoutDashboard, Heart, Settings, User, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';


const NAV = [
  { href: '/doctors',      label: 'Find Doctors',  icon: Stethoscope },
  { href: '/hospitals',    label: 'Hospitals',      icon: Building2  },
  { href: '/appointments', label: 'Appointments',   icon: Calendar   },
  { href: '/blog',         label: 'Health Blog',    icon: BookOpen   },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isHome = false;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    const setIsScrolled = (v: boolean) => setScrolled(v);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const solid = scrolled || !isHome;

  const navCls = [
    'fixed top-0 inset-x-0 z-50 transition-all duration-300',
    solid
      ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm'
      : 'bg-transparent',
  ].join(' ');

  const linkCls = (active: boolean) => [
    'flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-150',
    solid
      ? active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      : active ? 'bg-white/15 text-white'      : 'text-white/85 hover:text-white hover:bg-white/10',
  ].join(' ');

  return (
    <>
      <nav className={navCls}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
                <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="font-display text-xl font-bold"
                style={{ fontFamily: 'DM Serif Display, serif', color: solid ? '#0f172a' : 'white' }}
              >
                Doc<span style={{ color: '#0f766e' }}>Finder</span>
                <span style={{ color: solid ? '#94a3b8' : 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400 }}> BD</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 ml-4">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={linkCls(pathname.startsWith(href))}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Emergency */}
              <a
                href="tel:999"
                className={[
                  'hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                  solid
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20',
                ].join(' ')}
              >
                <Phone className="w-3 h-3" />
                Emergency 999
              </a>

              {/* Search */}
              <Link
                href="/doctors"
                className={[
                  'p-2 rounded-xl transition-all',
                  solid ? 'text-slate-500 hover:bg-slate-100' : 'text-white/80 hover:bg-white/15',
                ].join(' ')}
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </Link>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className={[
                      'hidden sm:flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl border transition-all',
                      solid
                        ? 'text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        : 'text-white border-white/25 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>

                  <button
                    onClick={() => openAuthModal('register')}
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:block text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          {user?.role}
                        </span>
                      </div>
                      <div className="py-1">
                        {user?.role === 'SUPER_ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50/80 hover:bg-amber-100 transition-colors border-b border-amber-100/60 mb-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            Admin Console
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                          Dashboard
                        </Link>
                        <Link
                          href="/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          My Appointments
                        </Link>
                        <Link
                          href="/dashboard?tab=saved"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Saved Doctors
                        </Link>
                        <Link
                          href="/dashboard?tab=profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          Profile Settings
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={[
                  'lg:hidden p-2 rounded-xl transition-all',
                  solid ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/15',
                ].join(' ')}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col animate-slide-right" style={{ animation: 'slideRight 0.25s ease forwards' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem' }}>
                  Doc<span style={{ color: '#0f766e' }}>Finder</span>
                </span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname.startsWith(href) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className={['w-8 h-8 rounded-lg flex items-center justify-center',
                    pathname.startsWith(href) ? 'bg-brand-100' : 'bg-slate-100',
                  ].join(' ')}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register Free
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  {user?.role === 'SUPER_ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Super Admin Console
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-1.5 py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors border border-slate-100"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/appointments"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors border border-slate-100"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Appointments
                    </Link>
                    <Link
                      href="/dashboard?tab=saved"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors border border-slate-100"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Saved
                    </Link>
                    <Link
                      href="/dashboard?tab=profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors border border-slate-100"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Profile
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
              <a href="tel:999" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                <Phone className="w-4 h-4" />Emergency: Call 999
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
