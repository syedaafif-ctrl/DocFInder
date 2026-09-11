import Link from 'next/link';
import {
  Stethoscope, Phone, Mail, MapPin, Facebook, Youtube,
  Twitter, Instagram, ArrowRight, Heart, Shield, Award
} from 'lucide-react';

const FOOTER_LINKS = {
  'Find Care': [
    { label: 'Cardiologists', href: '/doctors?specialty=cardiology' },
    { label: 'Neurologists', href: '/doctors?specialty=neurology' },
    { label: 'Gynecologists', href: '/doctors?specialty=gynecology' },
    { label: 'Pediatricians', href: '/doctors?specialty=pediatrics' },
    { label: 'Orthopedic Surgeons', href: '/doctors?specialty=orthopedics' },
    { label: 'Dermatologists', href: '/doctors?specialty=dermatology' },
    { label: 'All Specialties', href: '/specialties' },
  ],
  'Locations': [
    { label: 'Doctors in Dhaka', href: '/doctors?district=dhaka' },
    { label: 'Doctors in Chittagong', href: '/doctors?district=chittagong' },
    { label: 'Doctors in Sylhet', href: '/doctors?district=sylhet' },
    { label: 'Doctors in Rajshahi', href: '/doctors?district=rajshahi' },
    { label: 'Doctors in Khulna', href: '/doctors?district=khulna' },
    { label: 'Telemedicine', href: '/doctors?online=true' },
  ],
  'Hospitals': [
    { label: 'Square Hospital', href: '/hospitals/square-hospital' },
    { label: 'United Hospital', href: '/hospitals/united-hospital' },
    { label: 'Evercare Hospital', href: '/hospitals/evercare-hospital' },
    { label: 'Government Hospitals', href: '/hospitals?type=government' },
    { label: 'Diagnostic Centers', href: '/hospitals?type=diagnostic' },
    { label: 'All Hospitals', href: '/hospitals' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'For Doctors', href: '/for-doctors' },
    { label: 'For Hospitals', href: '/for-hospitals' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/docfinderbd', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@docfinderbd', label: 'YouTube' },
  { icon: Twitter, href: 'https://twitter.com/docfinderbd', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/docfinderbd', label: 'Instagram' },
];

const TRUST_BADGES = [
  { icon: Shield, label: 'BMDC Verified', desc: 'All doctors verified' },
  { icon: Award, label: 'SSL Secured', desc: 'Your data is safe' },
  { icon: Heart, label: '9.8L+ Patients', desc: 'Trust us with care' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">

      {/* ── CTA Band ── */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white mb-1">
                List Your Practice on DocFinder BD
              </h3>
              <p className="text-sky-100 text-sm">
                Reach thousands of patients. Manage appointments easily.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/for-doctors"
                className="flex items-center gap-2 bg-white text-sky-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
              >
                Join as Doctor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/for-hospitals"
                className="flex items-center gap-2 bg-sky-500/20 border border-sky-300/40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-sky-500/30 transition-colors"
              >
                Add Hospital
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-playfair font-bold text-xl">
                Doc<span className="text-sky-400">Finder</span>
                <span className="text-slate-400 text-sm font-normal ml-0.5"> BD</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Bangladesh's #1 healthcare discovery platform. Find verified doctors, book appointments, and get quality care near you.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 mb-6">
              <a href="tel:09616400400" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-sky-400 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-sky-900 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                09616 400 400
              </a>
              <a href="mailto:support@docfinderbd.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-sky-400 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-sky-900 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                support@docfinderbd.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>House 42, Road 11, Dhanmondi, Dhaka-1209, Bangladesh</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-700 hover:text-white transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{badge.label}</p>
                    <p className="text-xs text-slate-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* App download badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.41.75 3.24.8 1.24-.24 2.43-.94 3.76-.84 1.58.13 2.76.76 3.54 1.95-3.25 1.94-2.48 6.25.49 7.4-.57 1.56-1.3 3.11-3.03 3.57zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div>
                  <p className="text-xs text-slate-400 leading-none">Download on</p>
                  <p className="text-xs font-semibold text-white">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M3.18 23.76c.35.2.75.22 1.12.08l12.6-7.28-2.55-2.55-11.17 9.75zM.47 1.67C.18 1.97 0 2.43 0 3.04v17.92c0 .61.18 1.07.47 1.37l.07.07 10.03-10.04v-.24L.54 1.6l-.07.07zM19.96 10.26L16.9 8.49l-2.82 2.82 2.82 2.82 3.06-1.77c.87-.5.87-1.32 0-1.82l.0-.08zM4.3.16L16.9 7.44l-2.82 2.82L4.3.16z"/>
                </svg>
                <div>
                  <p className="text-xs text-slate-400 leading-none">Get it on</p>
                  <p className="text-xs font-semibold text-white">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} DocFinder BD. All rights reserved. Built with{' '}
            <Heart className="inline w-3 h-3 text-red-400 fill-current" /> in Bangladesh.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <Link key={label} href={`/${label.toLowerCase().replace(/ /g, '-')}`} className="text-xs text-slate-500 hover:text-sky-400 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
