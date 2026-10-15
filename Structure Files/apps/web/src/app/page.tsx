// apps/web/src/app/page.tsx
// DocFinder BD — Homepage
// Next.js 15 App Router | Production-grade

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Shield,
  Stethoscope,
  Building2,
  Users,
  ChevronRight,
  BadgeCheck,
  Zap,
  Heart,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import type { Doctor } from '@/types';
import { ALL_DOCTORS } from '@/lib/mockData';

// ============================================================
// METADATA
// ============================================================

export const metadata: Metadata = {
  title: 'DocFinder BD — Find Verified Doctors in Bangladesh',
  description:
    'Bangladesh\'s #1 doctor discovery platform. Search 12,400+ verified specialists across 64 districts. Book appointments instantly in Bengali or English.',
  keywords: ['doctor', 'Bangladesh', 'healthcare', 'appointment', 'specialist', 'BMDC', 'Dhaka'],
  openGraph: {
    title: 'DocFinder BD — Find Verified Doctors in Bangladesh',
    description: 'Find and book top doctors near you across all 64 districts of Bangladesh.',
    type: 'website',
    locale: 'en_BD',
  },
};

// ============================================================
// FAKE DOCTOR DATA
// ============================================================
const FAKE_DOCTORS = ALL_DOCTORS;

/*const FAKE_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    userId: 'usr-001',
    slug: 'dr-aminul-islam-001',
    name: 'Dr. Aminul Islam',
    nameBn: 'ডাঃ আমিনুল ইসলাম',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=aminul',
    bmdcNumber: 'A-12345',
    bmdcVerified: true,
    about:
      'Professor Dr. Aminul Islam is a renowned cardiologist with 18 years of experience specializing in interventional cardiology and heart failure management.',
    experience: 18,
    consultationFee: 1500,
    followUpFee: 800,
    telemedicineFee: 1000,
    phone: '01711111111',
    whatsapp: '01711111111',
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 312,
    totalAppointments: 4820,
    profileViews: 18400,
    searchAppearances: 9200,
    sponsoredRank: 1,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-001',
        doctorId: 'doc-001',
        specialtyId: 'sp-001',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-001',
          name: 'Cardiology',
          nameBn: 'হৃদরোগ বিশেষজ্ঞ',
          slug: 'cardiology',
          categoryId: 'cat-001',
          isFeatured: true,
          doctorCount: 340,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-001', doctorId: 'doc-001', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 2000, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-002', doctorId: 'doc-001', degree: 'MD (Cardiology)', institution: 'BSMMU', country: 'Bangladesh', year: 2005, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-003', doctorId: 'doc-001', degree: 'FRCP', institution: 'Royal College, UK', country: 'UK', year: 2010, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-001',
        doctorId: 'doc-001',
        name: "Prof. Aminul's Chamber",
        address: 'Farmgate, Dhaka-1215',
        isMain: true,
        appointmentFee: 1500,
        schedules: [
          { id: 'sch-001', chamberId: 'ch-001', day: 'SATURDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-002', chamberId: 'ch-001', day: 'SUNDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-003', chamberId: 'ch-001', day: 'MONDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-004', chamberId: 'ch-001', day: 'TUESDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-005', chamberId: 'ch-001', day: 'WEDNESDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-006', chamberId: 'ch-001', day: 'THURSDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
        ],
        area: { id: 'area-008', name: 'Farmgate', nameBn: 'ফার্মগেট', slug: 'farmgate', upazillaId: 'u-001', latitude: 23.7582, longitude: 90.3903, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'doc-002',
    userId: 'usr-002',
    slug: 'dr-nasrin-akter-002',
    name: 'Dr. Nasrin Akter',
    nameBn: 'ডাঃ নাসরিন আক্তার',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=nasrin&backgroundColor=b6e3f4',
    bmdcNumber: 'A-23456',
    bmdcVerified: true,
    about:
      'Dr. Nasrin Akter is a highly experienced gynecologist and obstetrician who has delivered over 5,000 babies and specializes in high-risk pregnancy management.',
    experience: 15,
    consultationFee: 1200,
    followUpFee: 700,
    languages: ['bn', 'en'],
    isAvailableOnline: false,
    isFeatured: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 198,
    totalAppointments: 3210,
    profileViews: 12300,
    searchAppearances: 6700,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-002',
        doctorId: 'doc-002',
        specialtyId: 'sp-015',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-015',
          name: 'Gynecology & Obstetrics',
          nameBn: 'গাইনি বিশেষজ্ঞ',
          slug: 'gynecology',
          categoryId: 'cat-004',
          isFeatured: true,
          doctorCount: 280,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-004', doctorId: 'doc-002', degree: 'MBBS', institution: 'Chittagong Medical College', country: 'Bangladesh', year: 2003, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-005', doctorId: 'doc-002', degree: 'FCPS (Gynecology)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2009, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-006', doctorId: 'doc-002', degree: 'MS (Gynecology)', institution: 'BSMMU', country: 'Bangladesh', year: 2012, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-002',
        doctorId: 'doc-002',
        name: "Dr. Nasrin's Chamber",
        address: 'Dhanmondi, Dhaka-1205',
        isMain: true,
        appointmentFee: 1200,
        schedules: [
          { id: 'sch-007', chamberId: 'ch-002', day: 'SATURDAY', startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sch-008', chamberId: 'ch-002', day: 'MONDAY', startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sch-009', chamberId: 'ch-002', day: 'WEDNESDAY', startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sch-010', chamberId: 'ch-002', day: 'THURSDAY', startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 15, isClosed: false },
        ],
        area: { id: 'area-001', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', latitude: 23.7461, longitude: 90.3742, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'doc-003',
    userId: 'usr-003',
    slug: 'dr-abdul-rashid-003',
    name: 'Dr. Abdul Rashid',
    nameBn: 'ডাঃ আব্দুল রশিদ',
    title: 'Assoc. Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rashid&backgroundColor=c0aede',
    bmdcNumber: 'A-34567',
    bmdcVerified: true,
    about:
      'Associate Professor Dr. Abdul Rashid is a pediatric specialist with 22 years of experience treating children from newborns to adolescents.',
    experience: 22,
    consultationFee: 1000,
    followUpFee: 600,
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 145,
    totalAppointments: 5600,
    profileViews: 9800,
    searchAppearances: 5400,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-003',
        doctorId: 'doc-003',
        specialtyId: 'sp-013',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-013',
          name: 'Pediatrics',
          nameBn: 'শিশু বিশেষজ্ঞ',
          slug: 'pediatrics',
          categoryId: 'cat-003',
          isFeatured: true,
          doctorCount: 420,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-007', doctorId: 'doc-003', degree: 'MBBS', institution: 'Rajshahi Medical College', country: 'Bangladesh', year: 1998, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-008', doctorId: 'doc-003', degree: 'DCH', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2003, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-009', doctorId: 'doc-003', degree: 'FCPS (Pediatrics)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2007, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-003',
        doctorId: 'doc-003',
        name: "Assoc. Prof. Rashid's Chamber",
        address: 'Gulshan-2, Dhaka-1212',
        isMain: true,
        appointmentFee: 1000,
        schedules: [
          { id: 'sch-011', chamberId: 'ch-003', day: 'SATURDAY', startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sch-012', chamberId: 'ch-003', day: 'SUNDAY', startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sch-013', chamberId: 'ch-003', day: 'TUESDAY', startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sch-014', chamberId: 'ch-003', day: 'THURSDAY', startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
        ],
        area: { id: 'area-002', name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan', upazillaId: 'u-001', latitude: 23.7808, longitude: 90.4146, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'doc-004',
    userId: 'usr-004',
    slug: 'dr-mahmudur-rahman-004',
    name: 'Dr. Mahmudur Rahman',
    nameBn: 'ডাঃ মাহমুদুর রহমান',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=mahmud&backgroundColor=ffd5dc',
    bmdcNumber: 'A-45678',
    bmdcVerified: true,
    about:
      'Professor Dr. Mahmudur Rahman is a leading orthopedic surgeon specializing in joint replacement, sports injuries, and spine disorders with 20 years of experience.',
    experience: 20,
    consultationFee: 2000,
    followUpFee: 1000,
    telemedicineFee: 1500,
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 223,
    totalAppointments: 3900,
    profileViews: 15600,
    searchAppearances: 8200,
    sponsoredRank: 2,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-004',
        doctorId: 'doc-004',
        specialtyId: 'sp-009',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-009',
          name: 'Orthopedics',
          nameBn: 'হাড় বিশেষজ্ঞ',
          slug: 'orthopedics',
          categoryId: 'cat-002',
          isFeatured: true,
          doctorCount: 190,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-010', doctorId: 'doc-004', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 1999, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-011', doctorId: 'doc-004', degree: 'MS (Orthopedics)', institution: 'BSMMU', country: 'Bangladesh', year: 2005, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-012', doctorId: 'doc-004', degree: 'FRCS', institution: 'Royal College of Surgeons, UK', country: 'UK', year: 2010, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-004',
        doctorId: 'doc-004',
        name: "Prof. Mahmud's Chamber",
        address: 'Bashundhara R/A, Dhaka-1229',
        isMain: true,
        appointmentFee: 2000,
        schedules: [
          { id: 'sch-015', chamberId: 'ch-004', day: 'SATURDAY', startTime: '09:00', endTime: '15:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sch-016', chamberId: 'ch-004', day: 'SUNDAY', startTime: '09:00', endTime: '15:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sch-017', chamberId: 'ch-004', day: 'MONDAY', startTime: '09:00', endTime: '15:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sch-018', chamberId: 'ch-004', day: 'WEDNESDAY', startTime: '09:00', endTime: '15:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sch-019', chamberId: 'ch-004', day: 'THURSDAY', startTime: '09:00', endTime: '15:00', slotDuration: 20, maxPatients: 18, isClosed: false },
        ],
        area: { id: 'area-007', name: 'Bashundhara', nameBn: 'বসুন্ধরা', slug: 'bashundhara', upazillaId: 'u-001', latitude: 23.8108, longitude: 90.4261, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'doc-005',
    userId: 'usr-005',
    slug: 'dr-shirina-sultana-005',
    name: 'Dr. Shirina Sultana',
    nameBn: 'ডাঃ শিরিনা সুলতানা',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=shirina&backgroundColor=d1f4d0',
    bmdcNumber: 'A-56789',
    bmdcVerified: true,
    about:
      'Dr. Shirina Sultana is an eye specialist with expertise in cataract surgery, glaucoma management, and refractive surgery with 12 years of practice.',
    experience: 12,
    consultationFee: 800,
    followUpFee: 500,
    languages: ['bn', 'en'],
    isAvailableOnline: false,
    isFeatured: false,
    isVerified: true,
    rating: 4.6,
    reviewCount: 88,
    totalAppointments: 2100,
    profileViews: 6700,
    searchAppearances: 3400,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-005',
        doctorId: 'doc-005',
        specialtyId: 'sp-016',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-016',
          name: 'Ophthalmology',
          nameBn: 'চক্ষু বিশেষজ্ঞ',
          slug: 'ophthalmology',
          categoryId: 'cat-006',
          isFeatured: true,
          doctorCount: 160,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-013', doctorId: 'doc-005', degree: 'MBBS', institution: 'Sir Salimullah Medical College', country: 'Bangladesh', year: 2006, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-014', doctorId: 'doc-005', degree: 'DO', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2011, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-015', doctorId: 'doc-005', degree: 'FCPS (Ophthalmology)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2015, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-005',
        doctorId: 'doc-005',
        name: "Dr. Shirina's Eye Care",
        address: 'Mohammadpur, Dhaka-1207',
        isMain: true,
        appointmentFee: 800,
        schedules: [
          { id: 'sch-020', chamberId: 'ch-005', day: 'SUNDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-021', chamberId: 'ch-005', day: 'TUESDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-022', chamberId: 'ch-005', day: 'THURSDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-023', chamberId: 'ch-005', day: 'SATURDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
        ],
        area: { id: 'area-005', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর', slug: 'mohammadpur', upazillaId: 'u-001', latitude: 23.7635, longitude: 90.3594, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'doc-006',
    userId: 'usr-006',
    slug: 'dr-abul-kalam-azad-006',
    name: 'Dr. Abul Kalam Azad',
    nameBn: 'ডাঃ আবুল কালাম আজাদ',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=azad&backgroundColor=f5d0c5',
    bmdcNumber: 'A-67890',
    bmdcVerified: true,
    about:
      "Professor Dr. Abul Kalam Azad is one of Bangladesh's most prominent neurologists with 25 years of experience treating stroke, epilepsy, and movement disorders.",
    experience: 25,
    consultationFee: 2500,
    followUpFee: 1200,
    telemedicineFee: 1800,
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 387,
    totalAppointments: 6800,
    profileViews: 24500,
    searchAppearances: 12100,
    sponsoredRank: 3,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-006',
        doctorId: 'doc-006',
        specialtyId: 'sp-002',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-002',
          name: 'Neurology',
          nameBn: 'নিউরোলজি',
          slug: 'neurology',
          categoryId: 'cat-001',
          isFeatured: true,
          doctorCount: 210,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-016', doctorId: 'doc-006', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 1996, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-017', doctorId: 'doc-006', degree: 'MD (Neurology)', institution: 'BSMMU', country: 'Bangladesh', year: 2002, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-018', doctorId: 'doc-006', degree: 'MRCP (Neurology)', institution: 'Royal College, UK', country: 'UK', year: 2007, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-006',
        doctorId: 'doc-006',
        name: "Prof. Azad's Neuro Clinic",
        address: 'Gulshan-2, Dhaka-1212',
        isMain: true,
        appointmentFee: 2500,
        schedules: [
          { id: 'sch-024', chamberId: 'ch-006', day: 'SATURDAY', startTime: '11:00', endTime: '16:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sch-025', chamberId: 'ch-006', day: 'MONDAY', startTime: '11:00', endTime: '16:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sch-026', chamberId: 'ch-006', day: 'WEDNESDAY', startTime: '11:00', endTime: '16:00', slotDuration: 20, maxPatients: 15, isClosed: false },
        ],
        area: { id: 'area-002', name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan', upazillaId: 'u-001', latitude: 23.7808, longitude: 90.4146, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'doc-007',
    userId: 'usr-007',
    slug: 'dr-roksana-begum-007',
    name: 'Dr. Roksana Begum',
    nameBn: 'ডাঃ রোকসানা বেগম',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=roksana&backgroundColor=e8d5ff',
    bmdcNumber: 'A-78901',
    bmdcVerified: true,
    about:
      'Dr. Roksana Begum specializes in diabetes, thyroid disorders, and hormonal imbalances with 14 years of clinical experience at top Dhaka hospitals.',
    experience: 14,
    consultationFee: 1200,
    followUpFee: 700,
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: false,
    isVerified: true,
    rating: 4.7,
    reviewCount: 112,
    totalAppointments: 2800,
    profileViews: 8900,
    searchAppearances: 4500,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-007',
        doctorId: 'doc-007',
        specialtyId: 'sp-004',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-004',
          name: 'Endocrinology',
          nameBn: 'হরমোন বিশেষজ্ঞ',
          slug: 'endocrinology',
          categoryId: 'cat-001',
          isFeatured: false,
          doctorCount: 140,
          sortOrder: 4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-019', doctorId: 'doc-007', degree: 'MBBS', institution: 'Mymensingh Medical College', country: 'Bangladesh', year: 2005, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-020', doctorId: 'doc-007', degree: 'MD (Endocrinology)', institution: 'BSMMU', country: 'Bangladesh', year: 2012, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-007',
        doctorId: 'doc-007',
        name: "Dr. Roksana's Diabetes & Hormone Care",
        address: 'Dhanmondi, Dhaka-1205',
        isMain: true,
        appointmentFee: 1200,
        schedules: [
          { id: 'sch-027', chamberId: 'ch-007', day: 'SATURDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-028', chamberId: 'ch-007', day: 'SUNDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-029', chamberId: 'ch-007', day: 'TUESDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-030', chamberId: 'ch-007', day: 'WEDNESDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
        ],
        area: { id: 'area-001', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', latitude: 23.7461, longitude: 90.3742, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: 'doc-008',
    userId: 'usr-008',
    slug: 'dr-zahirul-hossain-008',
    name: 'Dr. Zahirul Hossain',
    nameBn: 'ডাঃ জাহিরুল হোসেন',
    title: 'Dr.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=zahir&backgroundColor=c5f2d4',
    bmdcNumber: 'A-89012',
    bmdcVerified: true,
    about:
      'Dr. Zahirul Hossain is a dermatologist and venereologist specializing in skin diseases, cosmetic dermatology, and laser treatments with 16 years experience.',
    experience: 16,
    consultationFee: 900,
    followUpFee: 500,
    languages: ['bn', 'en'],
    isAvailableOnline: false,
    isFeatured: false,
    isVerified: true,
    rating: 4.5,
    reviewCount: 76,
    totalAppointments: 1900,
    profileViews: 7200,
    searchAppearances: 3800,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    specialties: [
      {
        id: 'ds-008',
        doctorId: 'doc-008',
        specialtyId: 'sp-007',
        isPrimary: true,
        createdAt: '2024-01-01T00:00:00Z',
        specialty: {
          id: 'sp-007',
          name: 'Dermatology',
          nameBn: 'চর্মরোগ বিশেষজ্ঞ',
          slug: 'dermatology',
          categoryId: 'cat-001',
          isFeatured: true,
          doctorCount: 175,
          sortOrder: 7,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ],
    qualifications: [
      { id: 'q-021', doctorId: 'doc-008', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 2003, sortOrder: 0, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-022', doctorId: 'doc-008', degree: 'DDV', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2008, sortOrder: 1, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'q-023', doctorId: 'doc-008', degree: 'FCPS (Dermatology)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2012, sortOrder: 2, createdAt: '2024-01-01T00:00:00Z' },
    ],
    chambers: [
      {
        id: 'ch-008',
        doctorId: 'doc-008',
        name: "Dr. Zahir's Skin Care",
        address: 'Dhanmondi, Dhaka-1205',
        isMain: true,
        appointmentFee: 900,
        schedules: [
          { id: 'sch-031', chamberId: 'ch-008', day: 'SATURDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-032', chamberId: 'ch-008', day: 'MONDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-033', chamberId: 'ch-008', day: 'WEDNESDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sch-034', chamberId: 'ch-008', day: 'THURSDAY', startTime: '10:00', endTime: '16:00', slotDuration: 15, maxPatients: 20, isClosed: false },
        ],
        area: { id: 'area-001', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', latitude: 23.7461, longitude: 90.3742, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    approvedAt: '2024-01-25T00:00:00Z',
  },
];*/

// ============================================================
// SUB-COMPONENTS
// ============================================================

// ---- DoctorCard (inline, self-contained) ----
function DoctorCard({ doctor, index = 0 }: { doctor: Doctor; index?: number }) {
  const primarySpecialty = doctor.specialties.find((s) => s.isPrimary) ?? doctor.specialties[0];
  const mainChamber = doctor.chambers.find((c) => c.isMain) ?? doctor.chambers[0];
  const qualStr = doctor.qualifications.slice(0, 3).map((q) => q.degree).join(', ');

  const availableDays = mainChamber?.schedules
    ?.filter((s) => !s.isClosed)
    .map((s) => s.day.slice(0, 3))
    .slice(0, 4) ?? [];

  return (
    <div
      className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Sponsored badge */}
      {doctor.sponsoredRank && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Zap className="w-2.5 h-2.5" />
            Featured
          </span>
        </div>
      )}

      {/* Online badge */}
      {doctor.isAvailableOnline && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Online
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Doctor info */}
        <div className="flex gap-4 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md">
              <Image
                src={doctor.photo ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${doctor.id}`}
                alt={doctor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            {/* Verified tick */}
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shadow-sm border-2 border-white">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Name & specialty */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate group-hover:text-sky-700 transition-colors">
              {doctor.title ? `${doctor.title} ` : ''}{doctor.name}
            </h3>
            {primarySpecialty && (
              <p className="text-sky-600 text-xs font-semibold mt-0.5 truncate">
                {primarySpecialty.specialty.name}
              </p>
            )}
            {qualStr && (
              <p className="text-slate-500 text-xs mt-0.5 truncate">{qualStr}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">({doctor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {doctor.experience} yrs exp
          </div>
          {mainChamber?.area && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {mainChamber.area.name}, {doctor.district?.name}
            </div>
          )}
          {availableDays.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {availableDays.join(', ')}
            </div>
          )}
        </div>

        {/* Fee + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Fee</p>
            <p className="font-bold text-slate-900 text-sm">৳{doctor.consultationFee.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            {doctor.whatsapp && (
              <a
                href={`https://wa.me/880${doctor.whatsapp.replace(/\D/g, '')}?text=I%20want%20to%20book%20an%20appointment`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <Link
              href={`/doctors/${doctor.slug}`}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              Book Now
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Section Header ----
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        {eyebrow && (
          <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-2">{eyebrow}</p>
        )}
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold text-sm shrink-0 group"
        >
          {action.label}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// ---- How It Works ----
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Search Doctors',
    desc: 'Search by specialty, location, or doctor name. Filter by fee, experience, and availability.',
    color: 'bg-sky-50 border-sky-200',
    accent: 'text-sky-600',
  },
  {
    step: '02',
    icon: '📋',
    title: 'View Profiles',
    desc: 'Check verified credentials, read patient reviews, and compare consultation fees.',
    color: 'bg-emerald-50 border-emerald-200',
    accent: 'text-emerald-600',
  },
  {
    step: '03',
    icon: '📅',
    title: 'Book Appointment',
    desc: 'Choose your preferred time slot and book instantly — online or at the chamber.',
    color: 'bg-violet-50 border-violet-200',
    accent: 'text-violet-600',
  },
  {
    step: '04',
    icon: '✅',
    title: 'Get Quality Care',
    desc: 'Visit the doctor and receive quality healthcare. Pay securely via bKash, Nagad, or card.',
    color: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-600',
  },
];

// ---- Specialty Pills ----
const SPECIALTY_PILLS = [
  { name: 'Cardiologist', slug: 'cardiology', icon: '❤️' },
  { name: 'Neurologist', slug: 'neurology', icon: '🧠' },
  { name: 'Gynecologist', slug: 'gynecology', icon: '🤱' },
  { name: 'Pediatrician', slug: 'pediatrics', icon: '👶' },
  { name: 'Orthopedic', slug: 'orthopedics', icon: '🦴' },
  { name: 'Dermatologist', slug: 'dermatology', icon: '🩺' },
  { name: 'Eye Specialist', slug: 'ophthalmology', icon: '👁️' },
  { name: 'Dentist', slug: 'dentistry', icon: '🦷' },
  { name: 'Psychiatrist', slug: 'psychiatry', icon: '💬' },
  { name: 'Endocrinologist', slug: 'endocrinology', icon: '⚗️' },
];

// ---- Trust Metrics ----
const TRUST_METRICS = [
  { value: '12,400+', label: 'Verified Doctors', icon: Stethoscope, color: 'text-sky-500' },
  { value: '850+', label: 'Hospitals Listed', icon: Building2, color: 'text-emerald-500' },
  { value: '9.8L+', label: 'Patients Helped', icon: Users, color: 'text-violet-500' },
  { value: '64', label: 'Districts Covered', icon: MapPin, color: 'text-amber-500' },
];

// ---- Why Choose DocFinder BD ----
const WHY_FEATURES = [
  {
    icon: Shield,
    title: 'BMDC Verified Doctors',
    desc: 'Every doctor is verified against the Bangladesh Medical and Dental Council registry before listing.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: Star,
    title: 'Real Patient Reviews',
    desc: 'Appointment-verified reviews you can trust — only patients who actually visited can rate.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Book appointments in under 60 seconds. Get real-time slot availability without calling.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Heart,
    title: 'Bengali & English',
    desc: 'Full support in both Bangla and English — because your health shouldn\'t have a language barrier.',
    color: 'bg-rose-100 text-rose-600',
  },
];

// ============================================================
// HOMEPAGE
// ============================================================

export default function HomePage() {
  const featuredDoctors = FAKE_DOCTORS.filter((d) => d.isFeatured);
  const allDoctors = FAKE_DOCTORS;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Trust Metrics Bar ── */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {TRUST_METRICS.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0', metric.color)}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{metric.value}</p>
                    <p className="text-slate-500 text-xs">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Browse by Specialty ── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Find by Specialty"
              title={<>Browse by <span className="text-sky-600">Medical Specialty</span></>}
              subtitle="Search from 48 specialties and find the right specialist for your health concern."
              action={{ label: 'View all specialties', href: '/specialties' }}
            />
            <div className="flex flex-wrap gap-3">
              {SPECIALTY_PILLS.map((spec) => (
                <Link
                  key={spec.slug}
                  href={`/doctors?specialty=${spec.slug}`}
                  className="inline-flex items-center gap-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all hover:shadow-md"
                >
                  <span className="text-lg leading-none">{spec.icon}</span>
                  {spec.name}
                </Link>
              ))}
              <Link
                href="/specialties"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors"
              >
                All Specialties
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Doctors ── */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Top Specialists"
              title={<>Featured <span className="text-sky-600">Doctors</span></>}
              subtitle="Hand-picked, BMDC-verified specialists with the highest patient ratings."
              action={{ label: 'View all doctors', href: '/doctors' }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featuredDoctors.map((doctor, i) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Simple Process"
              title={<>How <span className="text-sky-600">DocFinder BD</span> Works</>}
              subtitle="Find and book a doctor in 4 simple steps — no phone calls, no waiting."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((step, i) => (
                <div
                  key={step.step}
                  className={cn(
                    'relative p-6 rounded-3xl border-2 transition-all hover:shadow-lg hover:-translate-y-1',
                    step.color
                  )}
                >
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-slate-300 z-10" />
                  )}
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <div className={cn('text-xs font-black mb-1 tracking-widest', step.accent)}>{step.step}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Doctors Grid ── */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="All Specialists"
              title={<>Recently Added <span className="text-sky-600">Doctors</span></>}
              subtitle="New verified specialists joining DocFinder BD every week."
              action={{ label: 'Search all doctors', href: '/doctors' }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allDoctors.map((doctor, i) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={i} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg shadow-sky-200"
              >
                See All 12,400+ Doctors
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text side */}
              <div>
                <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-3">Why DocFinder BD?</p>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5">
                  Bangladesh's Most Trusted
                  <br />
                  <span className="text-sky-600">Healthcare Platform</span>
                </h2>
                <p className="text-slate-500 text-base mb-8">
                  We built DocFinder BD because finding a good doctor in Bangladesh shouldn't be hard.
                  Every feature is designed with patients first.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {WHY_FEATURES.map((feat) => (
                    <div key={feat.title} className="flex gap-4">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', feat.color)}>
                        <feat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">{feat.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold text-sm group"
                  >
                    Learn more about us
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Stats card side */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Average Wait Time', value: '< 15 min', sub: 'For slot booking', color: 'bg-sky-600', textColor: 'text-white' },
                  { label: 'Patient Satisfaction', value: '97.4%', sub: 'Based on reviews', color: 'bg-emerald-50', textColor: 'text-slate-900' },
                  { label: 'Daily Appointments', value: '4,200+', sub: 'Booked every day', color: 'bg-amber-50', textColor: 'text-slate-900' },
                  { label: 'BMDC Verified', value: '100%', sub: 'Of listed doctors', color: 'bg-violet-600', textColor: 'text-white' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn('p-6 rounded-3xl', stat.color, stat.textColor)}
                  >
                    <p className={cn('text-3xl font-black mb-1', stat.textColor)}>{stat.value}</p>
                    <p className={cn('font-semibold text-sm mb-0.5', stat.textColor)}>{stat.label}</p>
                    <p className={cn('text-xs opacity-70', stat.textColor)}>{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Doctor CTA Banner ── */}
        <section className="relative py-16 sm:py-20 bg-slate-900 bg-gradient-to-br from-brand-900 via-sky-900 to-teal-900 overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
              <Stethoscope className="w-4 h-4 text-sky-300" />
              <span className="text-white text-sm font-semibold">For Healthcare Professionals</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Are You a Doctor?
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300">
                List Your Practice Free
              </span>
            </h2>
            <p className="text-sky-100 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal">
              Join 12,400+ doctors on Bangladesh's largest healthcare discovery platform. 
              Get new patients, manage appointments, and grow your practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/for-doctors"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:text-sky-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-sky-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Join as a Doctor — Free
              </Link>
              <Link
                href="/for-hospitals"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-5 h-5 text-sky-200" />
                List Your Hospital
              </Link>
            </div>
            <p className="mt-5 text-sky-200/80 text-xs font-medium">
              No credit card required · Setup in under 10 minutes · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
