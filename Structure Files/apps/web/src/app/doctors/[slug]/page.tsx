'use client';

// apps/web/src/app/doctors/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, MapPin, Clock, Phone, MessageCircle, BadgeCheck,
  Calendar, ChevronRight, ArrowLeft, Zap, Globe,
  GraduationCap, Award, Building2, CheckCircle2, Video,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/BookingModal';
import { MOCK_DOCTORS, MOCK_DOCTOR_DETAIL } from '@/lib/mockData';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Day ordering for Bangladesh week ─────────────────────────
const DAY_ORDER = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAY_SHORT: Record<string, string> = {
  SATURDAY: 'Sat', SUNDAY: 'Sun', MONDAY: 'Mon',
  TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri',
};

// ─── Helper: rating label ─────────────────────────────────────
function getRatingLabel(r: number) {
  if (r >= 4.8) return 'Excellent';
  if (r >= 4.5) return 'Very Good';
  if (r >= 4.0) return 'Good';
  return 'Average';
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({ title, icon: Icon, children }: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="flex items-center gap-2 font-bold text-slate-900 text-base mb-4">
        {Icon && <Icon className="w-4 h-4 text-sky-500" />}
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function DoctorProfilePage({ params }: PageProps) {
  const { slug } = use(params);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeBookingChamber, setActiveBookingChamber] = useState<any>(null);

  // Try detail first, fall back to list item
  const detail = MOCK_DOCTOR_DETAIL[slug];
  const listItem = MOCK_DOCTORS.find((d) => d.slug === slug);
  const initialDoc = detail ?? listItem;

  const [doc, setDoc] = useState<any>(initialDoc);

  useEffect(() => {
    let active = true;
    fetch(`http://localhost:4000/api/v1/doctors/${slug}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((apiData) => {
        if (active && apiData) {
          setDoc((prev: any) => ({
            ...(prev || {}),
            ...apiData,
            chambers: apiData.chambers && apiData.chambers.length > 0 ? apiData.chambers : prev?.chambers,
            specialties: apiData.specialties && apiData.specialties.length > 0 ? apiData.specialties : prev?.specialties,
            qualifications: apiData.qualifications && apiData.qualifications.length > 0 ? apiData.qualifications : prev?.qualifications,
          }));
        }
      })
      .catch(() => {
        // Fallback silently to mock doc
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!doc) notFound();

  const primarySpecialty = doc.specialties?.find((s: any) => s.isPrimary) ?? doc.specialties?.[0];
  const mainChamber = doc.chambers?.find((c: any) => c.isMain) ?? doc.chambers?.[0];

  // Available days from schedule
  const availableDays = mainChamber?.schedules
    ? DAY_ORDER.filter((day) =>
        mainChamber.schedules!.some((s: any) => s.day === day && !s.isClosed)
      )
    : [];

  const qualStr = doc.qualifications
    ?.slice(0, 4)
    .map((q: any) => ('degree' in q ? q.degree : (q as any).degree))
    .join(', ');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-16">

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/doctors" className="hover:text-sky-600 transition-colors">Find Doctors</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-medium truncate">{doc.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Back button */}
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to doctors
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── LEFT: Main content ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Profile hero card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-sky-500 to-emerald-400" />

                <div className="p-6">
                  <div className="flex gap-5">
                    {/* Photo */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                        <Image
                          src={doc.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doc.id}`}
                          alt={doc.name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      {doc.isVerified && (
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shadow border-2 border-white">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <h1 className="font-bold text-slate-900 text-xl sm:text-2xl leading-tight">
                          {doc.title} {doc.name}
                        </h1>
                        {(doc as any).sponsoredRank && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            <Zap className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>

                      {primarySpecialty && (
                        <p className="text-sky-600 font-semibold text-sm mb-1">
                          {primarySpecialty.specialty.name}
                          {primarySpecialty.specialty.nameBn && (
                            <span className="text-slate-400 font-normal ml-2">({primarySpecialty.specialty.nameBn})</span>
                          )}
                        </p>
                      )}

                      {qualStr && (
                        <p className="text-slate-500 text-sm mb-3">{qualStr}</p>
                      )}

                      {/* Stats row */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-800">{doc.rating.toFixed(1)}</span>
                          <span className="text-slate-400 text-sm">({doc.reviewCount} reviews)</span>
                          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            {getRatingLabel(doc.rating)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {doc.experience} years experience
                        </div>
                        {doc.isAvailableOnline && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                            <Video className="w-3 h-3" /> Online Consultation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {(mainChamber || doc.district) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {mainChamber?.area?.name && `${mainChamber.area.name}, `}
                        {doc.district?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* About */}
              {(doc as any).about && (
                <Section title="About" icon={GraduationCap}>
                  <p className="text-slate-600 text-sm leading-relaxed">{(doc as any).about}</p>
                </Section>
              )}

              {/* Qualifications */}
              {doc.qualifications && doc.qualifications.length > 0 && (
                <Section title="Education & Qualifications" icon={GraduationCap}>
                  <div className="flex flex-col gap-3">
                    {doc.qualifications.map((q: any, i: number) => {
                      const degree = (q as any).degree;
                      const institution = (q as any).institution;
                      const year = (q as any).year;
                      const country = (q as any).country;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-4 h-4 text-sky-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{degree}</p>
                            <p className="text-slate-500 text-xs">{institution}{country && country !== 'Bangladesh' ? `, ${country}` : ''}{year ? ` • ${year}` : ''}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Practice Locations & Schedules */}
              {doc.chambers && doc.chambers.length > 0 && (
                <Section title="Practice Locations & Schedules" icon={Calendar}>
                  <div className="flex flex-col gap-6 divide-y divide-slate-100">
                    {doc.chambers.map((chamber: any, idx: number) => {
                      const cDays = chamber.schedules
                        ? DAY_ORDER.filter((day) =>
                            chamber.schedules!.some((s: any) => s.day === day && !s.isClosed)
                          )
                        : [];
                      const cFee = chamber.appointmentFee || doc.consultationFee;

                      return (
                        <div key={chamber.id || idx} className={cn("flex flex-col gap-3", idx > 0 && "pt-5")}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-slate-900 text-sm">{chamber.hospital?.name || chamber.name}</p>
                                  {chamber.hospital && (
                                    <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-semibold border border-sky-100">
                                      {chamber.name}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  {chamber.address}
                                </p>
                                {chamber.department?.name && (
                                  <p className="text-slate-500 text-xs mt-0.5">
                                    Department: <span className="font-medium text-slate-700">{chamber.department.name}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setActiveBookingChamber(chamber);
                                setBookingModalOpen(true);
                              }}
                              className="shrink-0 px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition-colors border border-teal-200"
                            >
                              Book Here
                            </button>
                          </div>

                          {/* Available days */}
                          {cDays.length > 0 && (
                            <div className="mt-1">
                              <div className="flex flex-wrap gap-1.5">
                                {DAY_ORDER.map((day) => {
                                  const schedule = chamber.schedules?.find((s: any) => s.day === day);
                                  const isOpen = schedule && !schedule.isClosed;
                                  return (
                                    <div
                                      key={day}
                                      className={cn(
                                        'flex flex-col items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border',
                                        isOpen
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                          : 'bg-slate-50 text-slate-300 border-slate-100'
                                      )}
                                    >
                                      <span>{DAY_SHORT[day]}</span>
                                      {isOpen && schedule && (
                                        <span className="text-[9px] text-emerald-600">
                                          {schedule.startTime}–{schedule.endTime}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Fee */}
                          <div className="flex items-center justify-between bg-slate-50/70 rounded-xl px-3 py-2 text-xs">
                            <span className="text-slate-600">Location Consultation Fee</span>
                            <span className="font-bold text-slate-900">৳{cFee.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Hospitals */}
              {(doc as any).hospitals && (doc as any).hospitals.length > 0 && (
                <Section title="Affiliated Hospitals" icon={Building2}>
                  <div className="flex flex-col gap-3">
                    {(doc as any).hospitals.map((h: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-sky-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{h.hospital?.name}</p>
                          {h.designation && (
                            <p className="text-slate-500 text-xs">{h.designation}{h.department ? ` • ${h.department}` : ''}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Awards */}
              {(doc as any).awards && (doc as any).awards.length > 0 && (
                <Section title="Awards & Recognition" icon={Award}>
                  <div className="flex flex-col gap-3">
                    {(doc as any).awards.map((a: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{a.title}</p>
                          <p className="text-slate-500 text-xs">{a.organization} • {a.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* ── RIGHT: Booking sidebar ── */}
            <div className="flex flex-col gap-5">

              {/* Booking card — sticky */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
                <div className="h-1.5 bg-gradient-to-r from-sky-500 to-emerald-400" />
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base mb-4">Book Appointment</h3>

                  {/* Fee breakdown */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Consultation Fee</span>
                      <span className="font-semibold text-slate-900">৳{doc.consultationFee.toLocaleString()}</span>
                    </div>
                    {(doc as any).followUpFee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Follow-up Fee</span>
                        <span className="font-semibold text-slate-900">৳{(doc as any).followUpFee.toLocaleString()}</span>
                      </div>
                    )}
                    {doc.isAvailableOnline && (doc as any).telemedicineFee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Telemedicine Fee</span>
                        <span className="font-semibold text-slate-900">৳{(doc as any).telemedicineFee.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-md shadow-teal-600/20"
                    >
                      <Calendar className="w-4 h-4" />
                      Book In-Person Visit
                    </button>

                    {doc.isAvailableOnline && (
                      <button className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-emerald-200">
                        <Video className="w-4 h-4" />
                        Book Video Consultation
                      </button>
                    )}

                    {(doc as any).whatsapp && (
                      <a
                        href={`https://wa.me/880${String((doc as any).whatsapp).replace(/\D/g, '')}?text=I%20want%20to%20book%20an%20appointment%20with%20${encodeURIComponent(doc.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold py-3 rounded-xl transition-colors text-sm border border-[#25D366]/30"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}

                    {(doc as any).phone && (
                      <a
                        href={`tel:${(doc as any).phone}`}
                        className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-slate-200"
                      >
                        <Phone className="w-4 h-4" />
                        Call Doctor
                      </a>
                    )}
                  </div>

                  {/* Trust badges */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    {doc.isVerified && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        BMDC Verified Doctor
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      {doc.totalAppointments.toLocaleString()}+ appointments completed
                    </div>
                    {doc.languages && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        Speaks: {doc.languages.map((l: string) => l === 'bn' ? 'Bengali' : 'English').join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick stats card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Doctor Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Experience', value: `${doc.experience} yrs` },
                    { label: 'Rating', value: doc.rating.toFixed(1) + ' ★' },
                    { label: 'Reviews', value: doc.reviewCount.toLocaleString() },
                    { label: 'Appointments', value: doc.totalAppointments.toLocaleString() + '+' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="font-bold text-slate-900 text-lg">{stat.value}</p>
                      <p className="text-slate-500 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BookingModal
        doctor={doc as any}
        hospital={activeBookingChamber?.hospital || null}
        department={activeBookingChamber?.department || null}
        initialChamberId={activeBookingChamber?.id || undefined}
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setActiveBookingChamber(null);
        }}
      />
      <Footer />
    </>
  );
}