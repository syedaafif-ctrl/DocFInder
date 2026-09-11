'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, Building2, Filter, X, ChevronDown,
  SlidersHorizontal, Ambulance, BadgeCheck, Star, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HospitalCard from '@/components/hospitals/HospitalCard';
import { cn } from '@/lib/utils';
import type { Hospital } from '@/types';

// ============================================================
// HOSPITAL DATA
// ============================================================

const FAKE_HOSPITALS: Hospital[] = [
  // ── Private ──────────────────────────────────────────────
  {
    id: 'h-001',
    name: 'Square Hospital Ltd.',
    nameBn: 'স্কয়ার হাসপাতাল লিমিটেড',
    slug: 'square-hospital',
    type: 'Private',
    description: 'Square Hospital Ltd. is one of the leading multispecialty hospitals in Bangladesh, equipped with state-of-the-art medical technology and highly qualified physicians.',
    phone: '10616',
    emergencyPhone: '10616',
    email: 'info@squarehospital.com',
    website: 'https://www.squarehospital.com',
    address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-007', name: 'Panthapath', nameBn: 'পান্থপথ', slug: 'panthapath', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 350, establishedYear: 2006,
    isVerified: true, isFeatured: true, isActive: true,
    rating: 4.5, reviewCount: 1240, photos: [],
    departments: [
      { id: 'dep-001', hospitalId: 'h-001', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-002', hospitalId: 'h-001', name: 'Neurology', isActive: true, createdAt: '' },
      { id: 'dep-003', hospitalId: 'h-001', name: 'Orthopedics', isActive: true, createdAt: '' },
      { id: 'dep-004', hospitalId: 'h-001', name: 'Pediatrics', isActive: true, createdAt: '' },
      { id: 'dep-005', hospitalId: 'h-001', name: 'Gynecology', isActive: true, createdAt: '' },
      { id: 'dep-006', hospitalId: 'h-001', name: 'Oncology', isActive: true, createdAt: '' },
      { id: 'dep-007', hospitalId: 'h-001', name: 'ICU', isActive: true, createdAt: '' },
      { id: 'dep-008', hospitalId: 'h-001', name: 'Emergency', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-002',
    name: 'United Hospital Limited',
    nameBn: 'ইউনাইটেড হাসপাতাল লিমিটেড',
    slug: 'united-hospital',
    type: 'Private',
    description: 'United Hospital Limited is a 500-bed tertiary care hospital in Gulshan, Dhaka, offering comprehensive healthcare with internationally trained specialists.',
    phone: '10666',
    emergencyPhone: '10666',
    email: 'info@uhlbd.com',
    website: 'https://www.uhlbd.com',
    address: 'Plot 15, Road 71, Gulshan-2, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-001', name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 500, establishedYear: 2006,
    isVerified: true, isFeatured: true, isActive: true,
    rating: 4.6, reviewCount: 1876, photos: [],
    departments: [
      { id: 'dep-009', hospitalId: 'h-002', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-010', hospitalId: 'h-002', name: 'Oncology', isActive: true, createdAt: '' },
      { id: 'dep-011', hospitalId: 'h-002', name: 'Nephrology', isActive: true, createdAt: '' },
      { id: 'dep-012', hospitalId: 'h-002', name: 'Neurology', isActive: true, createdAt: '' },
      { id: 'dep-013', hospitalId: 'h-002', name: 'ICU', isActive: true, createdAt: '' },
      { id: 'dep-014', hospitalId: 'h-002', name: 'Emergency', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-003',
    name: 'Evercare Hospital Dhaka',
    nameBn: 'এভারকেয়ার হাসপাতাল ঢাকা',
    slug: 'evercare-hospital',
    type: 'Private',
    description: 'Evercare Hospital Dhaka is a JCI-accredited multispecialty hospital providing world-class healthcare with the latest medical technology.',
    phone: '10678',
    emergencyPhone: '10678',
    email: 'info@evercarebd.com',
    website: 'https://www.evercarebd.com',
    address: 'Plot 81, Block E, Bashundhara R/A, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-006', name: 'Bashundhara', nameBn: 'বসুন্ধরা', slug: 'bashundhara', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 425, establishedYear: 2014,
    isVerified: true, isFeatured: true, isActive: true,
    rating: 4.7, reviewCount: 2103, photos: [],
    departments: [
      { id: 'dep-015', hospitalId: 'h-003', name: 'Oncology', isActive: true, createdAt: '' },
      { id: 'dep-016', hospitalId: 'h-003', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-017', hospitalId: 'h-003', name: 'Transplant', isActive: true, createdAt: '' },
      { id: 'dep-018', hospitalId: 'h-003', name: 'Neurology', isActive: true, createdAt: '' },
      { id: 'dep-019', hospitalId: 'h-003', name: 'ICU', isActive: true, createdAt: '' },
      { id: 'dep-020', hospitalId: 'h-003', name: 'Emergency', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-004',
    name: 'Labaid Specialized Hospital',
    nameBn: 'ল্যাবএইড স্পেশালাইজড হাসপাতাল',
    slug: 'labaid-hospital',
    type: 'Private',
    description: 'Labaid Specialized Hospital provides quality healthcare services with experienced specialists and a Cath Lab for advanced cardiac interventions.',
    phone: '10604',
    emergencyPhone: '10604',
    website: 'https://labaidgroup.com',
    address: 'House 1, Road 4, Dhanmondi, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-002', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 250, establishedYear: 1999,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 934, photos: [],
    departments: [
      { id: 'dep-021', hospitalId: 'h-004', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-022', hospitalId: 'h-004', name: 'Neurology', isActive: true, createdAt: '' },
      { id: 'dep-023', hospitalId: 'h-004', name: 'Orthopedics', isActive: true, createdAt: '' },
      { id: 'dep-024', hospitalId: 'h-004', name: 'ICU', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-005',
    name: 'Ibn Sina Specialized Hospital',
    nameBn: 'ইবনে সিনা স্পেশালাইজড হাসপাতাল',
    slug: 'ibn-sina-hospital',
    type: 'Private',
    description: 'Ibn Sina Specialized Hospital offers a wide range of medical services with modern diagnostic equipment and experienced physicians.',
    phone: '10605',
    emergencyPhone: '10605',
    website: 'https://www.ibnsinatrust.com',
    address: 'House 48, Road 9/A, Dhanmondi, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-002', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 150, establishedYear: 1983,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 654, photos: [],
    departments: [
      { id: 'dep-025', hospitalId: 'h-005', name: 'Medicine', isActive: true, createdAt: '' },
      { id: 'dep-026', hospitalId: 'h-005', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-027', hospitalId: 'h-005', name: 'Orthopedics', isActive: true, createdAt: '' },
      { id: 'dep-028', hospitalId: 'h-005', name: 'Dermatology', isActive: true, createdAt: '' },
      { id: 'dep-029', hospitalId: 'h-005', name: 'Pediatrics', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-006',
    name: 'BIRDEM General Hospital',
    nameBn: 'বার্ডেম জেনারেল হাসপাতাল',
    slug: 'birdem-hospital',
    type: 'Private',
    description: 'BIRDEM General Hospital is a leading diabetes and endocrine disease specialist hospital, also offering comprehensive general and specialized medical care.',
    phone: '8616641',
    emergencyPhone: '8616641',
    website: 'https://www.birdembd.org',
    address: '122 Kazi Nazrul Islam Ave, Shahbagh, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-009', name: 'Shahbagh', nameBn: 'শাহবাগ', slug: 'shahbagh', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 650, establishedYear: 1980,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.5, reviewCount: 1100, photos: [],
    departments: [
      { id: 'dep-030', hospitalId: 'h-006', name: 'Endocrinology', isActive: true, createdAt: '' },
      { id: 'dep-031', hospitalId: 'h-006', name: 'Diabetes', isActive: true, createdAt: '' },
      { id: 'dep-032', hospitalId: 'h-006', name: 'Nephrology', isActive: true, createdAt: '' },
      { id: 'dep-033', hospitalId: 'h-006', name: 'Cardiology', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-007',
    name: 'Bangladesh Specialized Hospital',
    nameBn: 'বাংলাদেশ স্পেশালাইজড হাসপাতাল',
    slug: 'bangladesh-specialized-hospital',
    type: 'Private',
    description: 'Bangladesh Specialized Hospital provides a comprehensive range of specialist medical services with a focus on patient care and modern treatment methods.',
    phone: '09666700100',
    emergencyPhone: '09666700100',
    address: '21 Shyamoli, Mirpur Road, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-010', name: 'Shyamoli', nameBn: 'শ্যামলী', slug: 'shyamoli', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 300, establishedYear: 2010,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.2, reviewCount: 700, photos: [],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-008',
    name: 'Asgar Ali Hospital',
    nameBn: 'আসগর আলী হাসপাতাল',
    slug: 'asgar-ali-hospital',
    type: 'Private',
    description: 'Asgar Ali Hospital is a modern private hospital in Old Dhaka offering a wide range of medical and surgical services with experienced consultants.',
    phone: '10602',
    emergencyPhone: '10602',
    address: '111/1/A Distillery Road, Gandaria, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-011', name: 'Gandaria', nameBn: 'গেন্ডারিয়া', slug: 'gandaria', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 250, establishedYear: 2013,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 520, photos: [],
    createdAt: '', updatedAt: '',
  },

  // ── Government ────────────────────────────────────────────
  {
    id: 'h-009',
    name: 'Dhaka Medical College Hospital',
    nameBn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    slug: 'dhaka-medical-college-hospital',
    type: 'Government',
    description: 'Dhaka Medical College Hospital is one of Bangladesh\'s largest and oldest government teaching hospitals, providing free or subsidised care to thousands daily.',
    phone: '02-55165088',
    emergencyPhone: '02-55165088',
    address: 'Secretariat Road, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-008', name: 'Bakshibazar', nameBn: 'বক্সিবাজার', slug: 'bakshibazar', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 2300, establishedYear: 1946,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 3.8, reviewCount: 1204, photos: [],
    departments: [
      { id: 'dep-034', hospitalId: 'h-009', name: 'Emergency', isActive: true, createdAt: '' },
      { id: 'dep-035', hospitalId: 'h-009', name: 'Medicine', isActive: true, createdAt: '' },
      { id: 'dep-036', hospitalId: 'h-009', name: 'Surgery', isActive: true, createdAt: '' },
      { id: 'dep-037', hospitalId: 'h-009', name: 'Orthopedics', isActive: true, createdAt: '' },
      { id: 'dep-038', hospitalId: 'h-009', name: 'Burn Unit', isActive: true, createdAt: '' },
      { id: 'dep-039', hospitalId: 'h-009', name: 'Cardiology', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-010',
    name: 'Bangabandhu Sheikh Mujib Medical University',
    nameBn: 'বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়',
    slug: 'bsmmu',
    type: 'Government',
    description: 'BSMMU is Bangladesh\'s premier postgraduate medical university and hospital, providing specialist care across virtually all medical disciplines.',
    phone: '9661051',
    emergencyPhone: '9661051',
    website: 'https://bsmmu.edu.bd',
    address: 'Shahbagh, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-009', name: 'Shahbagh', nameBn: 'শাহবাগ', slug: 'shahbagh', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 1500, establishedYear: 1998,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 980, photos: [],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-011',
    name: 'National Institute of Cardiovascular Diseases',
    nameBn: 'জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল',
    slug: 'nicvd',
    type: 'Government',
    description: 'NICVD is the national referral centre for cardiovascular diseases in Bangladesh, offering advanced cardiac surgery and intervention at subsidised rates.',
    phone: '55067351',
    emergencyPhone: '55067351',
    address: 'Sher-e-Bangla Nagar, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-012', name: 'Sher-e-Bangla Nagar', nameBn: 'শেরে বাংলা নগর', slug: 'sher-e-bangla-nagar', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 800, establishedYear: 1978,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 640, photos: [],
    departments: [
      { id: 'dep-040', hospitalId: 'h-011', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-041', hospitalId: 'h-011', name: 'Cardiac Surgery', isActive: true, createdAt: '' },
      { id: 'dep-042', hospitalId: 'h-011', name: 'Cath Lab', isActive: true, createdAt: '' },
      { id: 'dep-043', hospitalId: 'h-011', name: 'ICU', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-012',
    name: 'National Institute of Neurosciences & Hospital',
    nameBn: 'জাতীয় নিউরোসায়েন্স ইনস্টিটিউট ও হাসপাতাল',
    slug: 'nins-hospital',
    type: 'Government',
    description: 'NINS is the national centre for neurological care in Bangladesh, providing neurosurgery, neurology, and neurocritical care to patients nationwide.',
    phone: '55007515',
    emergencyPhone: '55007515',
    address: 'Agargaon, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-013', name: 'Agargaon', nameBn: 'আগারগাঁও', slug: 'agargaon', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 450, establishedYear: 2012,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 530, photos: [],
    departments: [
      { id: 'dep-044', hospitalId: 'h-012', name: 'Neurology', isActive: true, createdAt: '' },
      { id: 'dep-045', hospitalId: 'h-012', name: 'Neurosurgery', isActive: true, createdAt: '' },
      { id: 'dep-046', hospitalId: 'h-012', name: 'Neurocritical Care', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-013',
    name: 'National Institute of Cancer Research & Hospital',
    nameBn: 'জাতীয় ক্যান্সার গবেষণা ইনস্টিটিউট ও হাসপাতাল',
    slug: 'nicrh',
    type: 'Government',
    description: 'NICRH is the premier government cancer treatment and research hospital in Bangladesh, providing oncology services at subsidised rates.',
    phone: '02-9124770',
    address: 'Mohakhali, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-014', name: 'Mohakhali', nameBn: 'মহাখালী', slug: 'mohakhali', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: false, bedCount: 300, establishedYear: 1968,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 3.9, reviewCount: 542, photos: [],
    departments: [
      { id: 'dep-047', hospitalId: 'h-013', name: 'Oncology', isActive: true, createdAt: '' },
      { id: 'dep-048', hospitalId: 'h-013', name: 'Radiotherapy', isActive: true, createdAt: '' },
      { id: 'dep-049', hospitalId: 'h-013', name: 'Chemotherapy', isActive: true, createdAt: '' },
      { id: 'dep-050', hospitalId: 'h-013', name: 'Cancer Surgery', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-014',
    name: 'Sheikh Hasina National Institute of Burn & Plastic Surgery',
    nameBn: 'শেখ হাসিনা জাতীয় বার্ন ও প্লাস্টিক সার্জারি ইনস্টিটিউট',
    slug: 'burn-institute',
    type: 'Government',
    description: 'The national dedicated burn and plastic surgery centre in Bangladesh, providing specialised burn treatment, reconstructive, and plastic surgery services.',
    phone: '55165001',
    emergencyPhone: '55165001',
    address: 'Chankharpul, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-015', name: 'Chankharpul', nameBn: 'চানখারপুল', slug: 'chankharpul', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 500, establishedYear: 2019,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.6, reviewCount: 450, photos: [],
    departments: [
      { id: 'dep-051', hospitalId: 'h-014', name: 'Burn Unit', isActive: true, createdAt: '' },
      { id: 'dep-052', hospitalId: 'h-014', name: 'Plastic Surgery', isActive: true, createdAt: '' },
      { id: 'dep-053', hospitalId: 'h-014', name: 'Reconstructive Surgery', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-015',
    name: 'Kurmitola General Hospital',
    nameBn: 'কুর্মিটোলা জেনারেল হাসপাতাল',
    slug: 'kurmitola-general-hospital',
    type: 'Government',
    description: 'Kurmitola General Hospital is a government hospital in North Dhaka providing general medical and surgical services to the surrounding communities.',
    phone: '55062350',
    emergencyPhone: '55062350',
    address: 'Kurmitola, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-016', name: 'Kurmitola', nameBn: 'কুর্মিটোলা', slug: 'kurmitola', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 275, establishedYear: 2012,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.1, reviewCount: 390, photos: [],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-016',
    name: 'Combined Military Hospital Dhaka',
    nameBn: 'সম্মিলিত সামরিক হাসপাতাল ঢাকা',
    slug: 'cmh-dhaka',
    type: 'Government',
    description: 'CMH Dhaka is the largest military hospital in Bangladesh, primarily serving armed forces personnel and their families with high-standard medical care.',
    phone: '8711111',
    emergencyPhone: '8711111',
    address: 'Dhaka Cantonment, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-017', name: 'Cantonment', nameBn: 'ক্যান্টনমেন্ট', slug: 'cantonment', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 1000, establishedYear: 1979,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.7, reviewCount: 730, photos: [],
    createdAt: '', updatedAt: '',
  },

  // ── Diagnostic ────────────────────────────────────────────
  {
    id: 'h-017',
    name: 'Popular Diagnostic Centre',
    nameBn: 'পপুলার ডায়াগনস্টিক সেন্টার',
    slug: 'popular-diagnostic',
    type: 'Diagnostic',
    description: 'Popular Diagnostic Centre is one of the largest diagnostic chains in Bangladesh with branches across the country, offering MRI, CT, pathology, and outpatient consultations.',
    phone: '09613787801',
    address: 'House 16, Road 2, Dhanmondi, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-002', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: false, bedCount: 0, establishedYear: 1983,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.2, reviewCount: 876, photos: [],
    departments: [
      { id: 'dep-054', hospitalId: 'h-017', name: 'Pathology', isActive: true, createdAt: '' },
      { id: 'dep-055', hospitalId: 'h-017', name: 'Radiology', isActive: true, createdAt: '' },
      { id: 'dep-056', hospitalId: 'h-017', name: 'Cardiology', isActive: true, createdAt: '' },
      { id: 'dep-057', hospitalId: 'h-017', name: 'Diagnostic Imaging', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-018',
    name: 'Praava Health',
    nameBn: 'প্রাভা হেলথ',
    slug: 'praava-health',
    type: 'Diagnostic',
    description: 'Praava Health is a modern outpatient and diagnostic centre offering international-standard primary care, specialist consultations, and advanced diagnostics.',
    phone: '10648',
    website: 'https://praavahealth.com',
    address: 'Banani, Dhaka',
    districtId: 'd-001',
    district: { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' },
    area: { id: 'a-018', name: 'Banani', nameBn: 'বনানী', slug: 'banani', upazillaId: 'u-001', createdAt: '', updatedAt: '' },
    isEmergency: false, bedCount: 0, establishedYear: 2017,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.7, reviewCount: 1100, photos: [],
    createdAt: '', updatedAt: '',
  },

  // ── Outside Dhaka ─────────────────────────────────────────
  {
    id: 'h-019',
    name: 'Chittagong Medical College Hospital',
    nameBn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল',
    slug: 'cmch',
    type: 'Government',
    description: 'Chittagong Medical College Hospital is the main government teaching hospital in Chittagong, providing comprehensive medical care to patients across the Chittagong Division.',
    phone: '031-630335',
    emergencyPhone: '031-630335',
    address: 'Panchlaish, Chittagong',
    districtId: 'd-002',
    district: { id: 'd-002', name: 'Chittagong', nameBn: 'চট্টগ্রাম', slug: 'chittagong-district', divisionId: 'div-002', createdAt: '', updatedAt: '' },
    area: { id: 'a-019', name: 'Panchlaish', nameBn: 'পাঁচলাইশ', slug: 'panchlaish', upazillaId: 'u-002', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 1300, establishedYear: 1957,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.1, reviewCount: 600, photos: [],
    departments: [
      { id: 'dep-058', hospitalId: 'h-019', name: 'Emergency', isActive: true, createdAt: '' },
      { id: 'dep-059', hospitalId: 'h-019', name: 'Medicine', isActive: true, createdAt: '' },
      { id: 'dep-060', hospitalId: 'h-019', name: 'Surgery', isActive: true, createdAt: '' },
      { id: 'dep-061', hospitalId: 'h-019', name: 'Pediatrics', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
  {
    id: 'h-020',
    name: 'Sylhet MAG Osmani Medical College Hospital',
    nameBn: 'সিলেট এম এ জি ওসমানী মেডিকেল কলেজ হাসপাতাল',
    slug: 'osmani-medical',
    type: 'Government',
    description: 'MAG Osmani Medical College Hospital is the main government teaching hospital in Sylhet Division, serving millions of patients across the region.',
    phone: '0821-713842',
    emergencyPhone: '0821-713842',
    address: 'Kajalshah, Sylhet',
    districtId: 'd-003',
    district: { id: 'd-003', name: 'Sylhet', nameBn: 'সিলেট', slug: 'sylhet-district', divisionId: 'div-003', createdAt: '', updatedAt: '' },
    area: { id: 'a-020', name: 'Kajalshah', nameBn: 'কাজলশাহ', slug: 'kajalshah', upazillaId: 'u-003', createdAt: '', updatedAt: '' },
    isEmergency: true, bedCount: 900, establishedYear: 1962,
    isVerified: true, isFeatured: false, isActive: true,
    rating: 4.0, reviewCount: 420, photos: [],
    departments: [
      { id: 'dep-062', hospitalId: 'h-020', name: 'Emergency', isActive: true, createdAt: '' },
      { id: 'dep-063', hospitalId: 'h-020', name: 'Medicine', isActive: true, createdAt: '' },
      { id: 'dep-064', hospitalId: 'h-020', name: 'Surgery', isActive: true, createdAt: '' },
      { id: 'dep-065', hospitalId: 'h-020', name: 'Gynecology', isActive: true, createdAt: '' },
    ],
    createdAt: '', updatedAt: '',
  },
];

const DISTRICTS = [
  { id: 'd-001', name: 'Dhaka', slug: 'dhaka-district' },
  { id: 'd-002', name: 'Chittagong', slug: 'chittagong-district' },
  { id: 'd-003', name: 'Sylhet', slug: 'sylhet-district' },
  { id: 'd-004', name: 'Rajshahi', slug: 'rajshahi-district' },
  { id: 'd-005', name: 'Khulna', slug: 'khulna-district' },
];

const HOSPITAL_TYPES = ['Private', 'Government', 'Diagnostic', 'Clinic'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'beds', label: 'Most Beds' },
  { value: 'newest', label: 'Newest' },
];

const STATS = [
  { value: '850+', label: 'Hospitals Listed', icon: Building2, color: 'text-sky-500' },
  { value: '64', label: 'Districts Covered', icon: MapPin, color: 'text-emerald-500' },
  { value: '24/7', label: 'Emergency Services', icon: Ambulance, color: 'text-red-500' },
  { value: '100%', label: 'Verified Listings', icon: BadgeCheck, color: 'text-violet-500' },
];

export default function HospitalsPage() {
  const [query, setQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedDistrict('');
    setSelectedTypes([]);
    setEmergencyOnly(false);
    setVerifiedOnly(false);
    setSortBy('featured');
  };

  const activeFilterCount = [
    selectedDistrict,
    ...selectedTypes,
    emergencyOnly ? 'emergency' : '',
    verifiedOnly ? 'verified' : '',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = [...FAKE_HOSPITALS];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          h.area?.name.toLowerCase().includes(q) ||
          h.district?.name.toLowerCase().includes(q)
      );
    }
    if (selectedDistrict) result = result.filter((h) => h.districtId === selectedDistrict);
    if (selectedTypes.length > 0) result = result.filter((h) => selectedTypes.includes(h.type));
    if (emergencyOnly) result = result.filter((h) => h.isEmergency);
    if (verifiedOnly) result = result.filter((h) => h.isVerified);

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'beds') return (b.bedCount ?? 0) - (a.bedCount ?? 0);
      if (sortBy === 'newest') return (b.establishedYear ?? 0) - (a.establishedYear ?? 0);
      if (b.isFeatured !== a.isFeatured) return b.isFeatured ? 1 : -1;
      if (b.isEmergency !== a.isEmergency) return b.isEmergency ? 1 : -1;
      return b.rating - a.rating;
    });

    return result;
  }, [query, selectedDistrict, selectedTypes, emergencyOnly, verifiedOnly, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-emerald-900 pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-[0.07]" />
          <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sky-300/70 text-xs mb-5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Hospitals</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Find Hospitals & <span className="text-sky-300">Diagnostic Centres</span>
              </h1>
              <p className="text-sky-100/80 text-base mb-8">
                Browse 850+ verified hospitals, clinics, and diagnostic centres across 64 districts.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Hospital name, area, or district…"
                    className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-slate-800 text-sm placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-lg',
                    showFilters
                      ? 'bg-white text-sky-700'
                      : 'bg-white/15 border border-white/25 text-white hover:bg-white/25'
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className={cn('w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base leading-tight">{stat.value}</p>
                    <p className="text-sky-200/60 text-xs">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <section className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
              <div className="flex flex-wrap gap-6 items-start">
                <div className="min-w-[160px]">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                  >
                    <option value="">All Districts</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {HOSPITAL_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={cn(
                          'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                          selectedTypes.includes(type)
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Quick Filters</label>
                  <div className="flex gap-3">
                    {[
                      { label: '24/7 Emergency', value: emergencyOnly, set: setEmergencyOnly },
                      { label: 'Verified Only', value: verifiedOnly, set: setVerifiedOnly },
                    ].map(({ label, value, set }) => (
                      <button
                        key={label}
                        onClick={() => set(!value)}
                        className={cn(
                          'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                          value
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="text-xs text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Results ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <p className="text-slate-600 text-sm">
              Showing <span className="font-bold text-slate-900">{filtered.length}</span> hospitals
              {query && <span> for "<span className="text-sky-600">{query}</span>"</span>}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-bold text-slate-700 text-lg mb-2">No hospitals found</h3>
              <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="btn btn-primary btn-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((hospital, i) => (
                <HospitalCard key={hospital.id} hospital={hospital} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-sky-600 to-sky-700 py-12 mx-4 sm:mx-6 mb-10 rounded-3xl max-w-7xl lg:mx-auto">
          <div className="px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white mb-1">Are you a hospital administrator?</h3>
              <p className="text-sky-100/80 text-sm">List your hospital on DocFinder BD and reach thousands of patients.</p>
            </div>
            <Link
              href="/for-hospitals"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-6 py-3 rounded-2xl hover:bg-sky-50 transition-colors"
            >
              Add Your Hospital <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}