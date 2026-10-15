'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Mail, Globe, Star, BadgeCheck, Ambulance,
  Building2, Clock, ChevronRight, ExternalLink,
  Bed, Calendar, Stethoscope, CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HospitalCard from '@/components/hospitals/HospitalCard';
import DepartmentDoctors from '@/components/hospitals/DepartmentDoctors'; 


import { cn } from '@/lib/utils';
import type { Hospital, HospitalDepartment } from '@/types';

// ============================================================
// FULL HOSPITAL DATABASE — keyed by slug
// ============================================================

const mkDept = (id: string, hid: string, name: string, nameBn: string, phone?: string) => ({
  id, hospitalId: hid, name, nameBn, phone, isActive: true, createdAt: '',
});

const DHAKA_DISTRICT = { id: 'd-001', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka-district', divisionId: 'div-001', createdAt: '', updatedAt: '' };
const CTG_DISTRICT   = { id: 'd-002', name: 'Chittagong', nameBn: 'চট্টগ্রাম', slug: 'chittagong-district', divisionId: 'div-002', createdAt: '', updatedAt: '' };
const SYL_DISTRICT   = { id: 'd-003', name: 'Sylhet', nameBn: 'সিলেট', slug: 'sylhet-district', divisionId: 'div-003', createdAt: '', updatedAt: '' };

const area = (id: string, name: string, nameBn: string, slug: string) => ({
  id, name, nameBn, slug, upazillaId: 'u-001', createdAt: '', updatedAt: '',
});

type HospitalDetail = Hospital & {
  amenities: string[];
  openingHours: { day: string; open: string; close: string; isOpen: boolean }[];
  googleMapsUrl?: string;
  addressBn?: string;
  altPhone?: string;
};

const ALL_HOSPITALS: Record<string, HospitalDetail> = {

  'square-hospital': {
    id: 'h-001', slug: 'square-hospital', type: 'Private',
    name: 'Square Hospital Ltd.', nameBn: 'স্কয়ার হাসপাতাল লিমিটেড',
    description: `Square Hospital Ltd. is one of the leading multispecialty tertiary-care hospitals in Bangladesh. Established in 2006, it is equipped with state-of-the-art medical technology and staffed by a team of highly qualified physicians, nurses, and support professionals.

The hospital offers a comprehensive range of inpatient and outpatient services including advanced cardiac care, neurosciences, oncology, orthopedics, gynecology, and pediatrics, supported by cutting-edge diagnostic imaging and modern ICU facilities.

Square Hospital is committed to delivering international-standard healthcare to the people of Bangladesh at an affordable cost, with 24/7 emergency services on its dedicated helpline 10616.`,
    phone: '10616', emergencyPhone: '10616', altPhone: '10616',
    email: 'info@squarehospital.com', website: 'https://www.squarehospital.com',
    address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka',
    addressBn: '১৮/এফ, বীর উত্তম কাজী নুরুজ্জামান সরাক, পশ্চিম পান্থপথ, ঢাকা',
    googleMapsUrl: 'https://maps.google.com/?q=Square+Hospital+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-007', 'Panthapath', 'পান্থপথ', 'panthapath'),
    bedCount: 350, establishedYear: 2006,
    isEmergency: true, isVerified: true, isFeatured: true, isActive: true,
    rating: 4.5, reviewCount: 1240, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d1-1','h-001','Cardiology','হৃদরোগ বিভাগ','10616-101'),
      mkDept('d1-2','h-001','Neurology','নিউরোলজি বিভাগ','10616-102'),
      mkDept('d1-3','h-001','Orthopedics','অর্থোপেডিক্স বিভাগ','10616-103'),
      mkDept('d1-4','h-001','Pediatrics','শিশু বিভাগ','10616-104'),
      mkDept('d1-5','h-001','Gynecology & Obstetrics','গাইনি বিভাগ','10616-105'),
      mkDept('d1-6','h-001','Oncology','ক্যান্সার বিভাগ','10616-106'),
      mkDept('d1-7','h-001','Gastroenterology','গ্যাস্ট্রো বিভাগ','10616-107'),
      mkDept('d1-8','h-001','Urology','ইউরোলজি বিভাগ','10616-108'),
      mkDept('d1-9','h-001','Dermatology','চর্মরোগ বিভাগ','10616-109'),
      mkDept('d1-10','h-001','Ophthalmology','চক্ষু বিভাগ','10616-110'),
      mkDept('d1-11','h-001','Psychiatry','মনোরোগ বিভাগ','10616-111'),
      mkDept('d1-12','h-001','ICU & CCU','আইসিইউ','10616'),
      mkDept('d1-13','h-001','Emergency','ইমার্জেন্সি','10616'),
    ],
    amenities: ['ICU & CCU','Blood Bank','MRI','CT Scan','Digital X-Ray','Cath Lab','Pharmacy','Ambulance Service','Parking','Free WiFi','Prayer Room','NICU'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '22:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '22:00', isOpen: true },
    ],
  },

  'united-hospital': {
    id: 'h-002', slug: 'united-hospital', type: 'Private',
    name: 'United Hospital Limited', nameBn: 'ইউনাইটেড হাসপাতাল লিমিটেড',
    description: `United Hospital Limited opened in August 2006 beside Gulshan Lake and is one of the largest private-sector healthcare facilities in Bangladesh. The hospital has a capacity of over 500 patients and 12 state-of-the-art operation theatres.

With more than 30 clinical sub-specialties, its Centres of Excellence include Cardiac, Cancer, Renal, Surgical, Neuroscience, Mother & Child Health, and Critical Care. The hospital is staffed by some of Bangladesh's most esteemed doctors across all disciplines.

United Hospital is committed to a comprehensive, one-stop healthcare solution, equipped with advanced technology including a 1.5T MRI, 128-slice CT, Cath Lab, and 60 haemodialysis units, with 24/7 emergency care available.`,
    phone: '10666', emergencyPhone: '10666', altPhone: '+880 1914 001234',
    email: 'info@uhlbd.com', website: 'https://www.uhlbd.com',
    address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
    addressBn: 'প্লট ১৫, রোড ৭১, গুলশান-২, ঢাকা-১২১২',
    googleMapsUrl: 'https://maps.google.com/?q=United+Hospital+Dhaka+Gulshan',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-001', 'Gulshan', 'গুলশান', 'gulshan'),
    bedCount: 500, establishedYear: 2006,
    isEmergency: true, isVerified: true, isFeatured: true, isActive: true,
    rating: 4.6, reviewCount: 1876, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d2-1','h-002','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d2-2','h-002','Oncology','ক্যান্সার বিভাগ'),
      mkDept('d2-3','h-002','Nephrology & Dialysis','নেফ্রোলজি ও ডায়ালাইসিস'),
      mkDept('d2-4','h-002','Neuroscience','নিউরোসায়েন্স'),
      mkDept('d2-5','h-002','Gastroenterology','গ্যাস্ট্রোএন্টারোলজি'),
      mkDept('d2-6','h-002','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d2-7','h-002','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d2-8','h-002','Pediatrics','শিশু বিভাগ'),
      mkDept('d2-9','h-002','ICU & CCU','আইসিইউ'),
      mkDept('d2-10','h-002','Emergency','ইমার্জেন্সি','10666'),
      mkDept('d2-11','h-002','Surgery','সার্জারি'),
      mkDept('d2-12','h-002','Mother & Child Health','মাতৃ ও শিশু স্বাস্থ্য'),
    ],
    amenities: ['ICU & CCU','NICU','Cath Lab','1.5T MRI','128-Slice CT','Blood Bank','60 Haemodialysis Units','12 Operation Theatres','24-Bed Emergency','Ambulance','Parking','Free WiFi'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '22:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '22:00', isOpen: true },
    ],
  },

  'evercare-hospital': {
    id: 'h-003', slug: 'evercare-hospital', type: 'Private',
    name: 'Evercare Hospital Dhaka', nameBn: 'এভারকেয়ার হাসপাতাল ঢাকা',
    description: `Evercare Hospital Dhaka is a 425-bed super-specialty tertiary care hospital and the first hospital in Bangladesh to receive JCI (Joint Commission International) accreditation — a distinction it has maintained for six consecutive terms.

Formerly known as Apollo Hospital Dhaka, it offers world-class care across oncology, cardiology, transplant surgery, neurosurgery, urology with a dedicated kidney transplant unit, and more. Its internationally trained medical team uses cutting-edge technology including bone marrow transplants, laparoscopic surgery, and knee replacements.

Located in Bashundhara Residential Area, Evercare's mission is to provide quaternary-level care so Bangladeshi patients no longer need to seek treatment abroad.`,
    phone: '10678', emergencyPhone: '10678',
    email: 'info@evercarebd.com', website: 'https://www.evercarebd.com',
    address: 'Plot 81, Block E, Bashundhara R/A, Vatara, Dhaka-1229',
    addressBn: 'প্লট ৮১, ব্লক ই, বসুন্ধরা আবাসিক এলাকা, ঢাকা-১২২৯',
    googleMapsUrl: 'https://maps.google.com/?q=Evercare+Hospital+Dhaka+Bashundhara',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-006', 'Bashundhara', 'বসুন্ধরা', 'bashundhara'),
    bedCount: 425, establishedYear: 2014,
    isEmergency: true, isVerified: true, isFeatured: true, isActive: true,
    rating: 4.7, reviewCount: 2103, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d3-1','h-003','Oncology & Cancer Care','ক্যান্সার বিভাগ'),
      mkDept('d3-2','h-003','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d3-3','h-003','Kidney Transplant & Urology','কিডনি ট্রান্সপ্লান্ট'),
      mkDept('d3-4','h-003','Neurosurgery','নিউরোসার্জারি'),
      mkDept('d3-5','h-003','Bone Marrow Transplant','বোন ম্যারো ট্রান্সপ্লান্ট'),
      mkDept('d3-6','h-003','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d3-7','h-003','General & Laparoscopic Surgery','ল্যাপারোস্কোপিক সার্জারি'),
      mkDept('d3-8','h-003','Internal Medicine','মেডিসিন বিভাগ'),
      mkDept('d3-9','h-003','ICU & Critical Care','আইসিইউ'),
      mkDept('d3-10','h-003','Emergency','ইমার্জেন্সি','10678'),
      mkDept('d3-11','h-003','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d3-12','h-003','Pediatrics','শিশু বিভাগ'),
    ],
    amenities: ['JCI Accredited (6 Terms)','Bone Marrow Transplant Unit','Kidney Transplant Unit','Lithotripsy Unit','Cath Lab','MRI','CT Scan','ICU & NICU','Ambulance','International Patients Unit','Blood Bank','Parking'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '22:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '22:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '22:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '22:00', isOpen: true },
    ],
  },

  'labaid-hospital': {
    id: 'h-004', slug: 'labaid-hospital', type: 'Private',
    name: 'Labaid Specialized Hospital', nameBn: 'ল্যাবএইড স্পেশালাইজড হাসপাতাল',
    description: `Labaid Specialized Hospital is one of the most trusted private hospitals in Dhaka, established in 1999. Located in Dhanmondi, it offers a full range of medical and surgical services with experienced specialists across multiple disciplines.

The hospital is particularly well-known for its Cath Lab for advanced cardiac interventions, MRI and CT imaging, and its highly qualified medical team. Its ICU and emergency department provide round-the-clock critical care to patients.

Labaid Group also operates a large network of diagnostic centres across Bangladesh, making it a comprehensive healthcare provider for millions of patients.`,
    phone: '10604', emergencyPhone: '10604',
    website: 'https://labaidgroup.com',
    address: 'House 1, Road 4, Dhanmondi, Dhaka-1205',
    addressBn: 'হাউস ১, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫',
    googleMapsUrl: 'https://maps.google.com/?q=Labaid+Specialized+Hospital+Dhanmondi',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-002', 'Dhanmondi', 'ধানমন্ডি', 'dhanmondi'),
    bedCount: 250, establishedYear: 1999,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 934, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d4-1','h-004','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d4-2','h-004','Neurology','নিউরোলজি বিভাগ'),
      mkDept('d4-3','h-004','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d4-4','h-004','Medicine','মেডিসিন'),
      mkDept('d4-5','h-004','Surgery','সার্জারি'),
      mkDept('d4-6','h-004','Gynecology','গাইনি বিভাগ'),
      mkDept('d4-7','h-004','ICU','আইসিইউ'),
      mkDept('d4-8','h-004','Emergency','ইমার্জেন্সি','10604'),
    ],
    amenities: ['Cath Lab','MRI','CT Scan','Blood Bank','ICU','Pharmacy','Ambulance','Parking','Prayer Room','Digital X-Ray'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '21:00', isOpen: true },
    ],
  },

  'ibn-sina-hospital': {
    id: 'h-005', slug: 'ibn-sina-hospital', type: 'Private',
    name: 'Ibn Sina Specialized Hospital', nameBn: 'ইবনে সিনা স্পেশালাইজড হাসপাতাল',
    description: `Ibn Sina Specialized Hospital, established in 1983, is one of Bangladesh's longest-serving private hospitals. Operated by the Ibn Sina Trust, it provides a wide range of medical and diagnostic services from its Dhanmondi location.

The hospital is known for its experienced physician panel, modern diagnostic lab, MRI and CT scan facilities, and affordable consultation fees compared to other private facilities. It covers general medicine, cardiology, dermatology, pediatrics, and orthopedics among many specialties.

Ibn Sina Trust also operates several branches and diagnostic centres across Dhaka, making it easily accessible to patients from across the city.`,
    phone: '10605', emergencyPhone: '10605',
    website: 'https://www.ibnsinatrust.com',
    address: 'House 48, Road 9/A, Dhanmondi, Dhaka-1209',
    addressBn: 'হাউস ৪৮, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯',
    googleMapsUrl: 'https://maps.google.com/?q=Ibn+Sina+Hospital+Dhanmondi',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-002', 'Dhanmondi', 'ধানমন্ডি', 'dhanmondi'),
    bedCount: 150, establishedYear: 1983,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 654, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d5-1','h-005','Medicine','মেডিসিন'),
      mkDept('d5-2','h-005','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d5-3','h-005','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d5-4','h-005','Dermatology','চর্মরোগ বিভাগ'),
      mkDept('d5-5','h-005','Pediatrics','শিশু বিভাগ'),
      mkDept('d5-6','h-005','Gynecology','গাইনি বিভাগ'),
      mkDept('d5-7','h-005','Emergency','ইমার্জেন্সি','10605'),
    ],
    amenities: ['Diagnostic Lab','MRI','CT Scan','Digital X-Ray','Ultrasound','Pharmacy','Ambulance','Parking'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '20:00', isOpen: true },
    ],
  },

  'birdem-hospital': {
    id: 'h-006', slug: 'birdem-hospital', type: 'Private',
    name: 'BIRDEM General Hospital', nameBn: 'বার্ডেম জেনারেল হাসপাতাল',
    description: `BIRDEM (Bangladesh Institute of Research and Rehabilitation in Diabetes, Endocrine and Metabolic Disorders) is a 650-bed multidisciplinary hospital of the Diabetic Association of Bangladesh, established in 1980 at Shahbagh, Dhaka.

It is one of the largest health complexes in Bangladesh, treating approximately 3,000 outpatients every day. While world-renowned for diabetes and endocrine care, BIRDEM also provides high-quality services in ophthalmology, ENT, urology, hepatobiliary surgery, orthopedics, plastic surgery, gynecology, and pediatrics.

BIRDEM Academy conducts 19 postgraduate courses under Dhaka University and BSMMU, cementing its role as both a premier clinical institution and a national centre for medical education and research.`,
    phone: '8616641', emergencyPhone: '8616641', altPhone: '9661551',
    website: 'https://www.birdembd.org',
    address: '122 Kazi Nazrul Islam Avenue, Shahbagh, Dhaka-1000',
    addressBn: '১২২ কাজী নজরুল ইসলাম এভিনিউ, শাহবাগ, ঢাকা-১০০০',
    googleMapsUrl: 'https://maps.google.com/?q=BIRDEM+Hospital+Shahbagh+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-009', 'Shahbagh', 'শাহবাগ', 'shahbagh'),
    bedCount: 650, establishedYear: 1980,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.5, reviewCount: 1100, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d6-1','h-006','Diabetes & Endocrinology','ডায়াবেটিস ও হরমোন বিভাগ'),
      mkDept('d6-2','h-006','Nephrology & Dialysis','নেফ্রোলজি'),
      mkDept('d6-3','h-006','Ophthalmology','চক্ষু বিভাগ'),
      mkDept('d6-4','h-006','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d6-5','h-006','Urology','ইউরোলজি'),
      mkDept('d6-6','h-006','Hepatobiliary Surgery','হেপাটোবিলিয়ারি সার্জারি'),
      mkDept('d6-7','h-006','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d6-8','h-006','Plastic Surgery','প্লাস্টিক সার্জারি'),
      mkDept('d6-9','h-006','ENT & Head-Neck Surgery','নাক-কান-গলা'),
      mkDept('d6-10','h-006','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d6-11','h-006','Pediatrics','শিশু বিভাগ'),
      mkDept('d6-12','h-006','Emergency','ইমার্জেন্সি'),
    ],
    amenities: ['Diabetic Foot Care Unit','MRI','CT Scan','Dialysis Centre','Blood Bank','ICU','Pharmacy','Ambulance','PICU','SCABU','Prayer Room','Parking'],
    openingHours: [
      { day: 'Saturday',  open: '07:30', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '07:30', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '07:30', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '07:30', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '07:30', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '07:30', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '09:00', close: '13:00', isOpen: true },
    ],
  },

  'bangladesh-specialized-hospital': {
    id: 'h-007', slug: 'bangladesh-specialized-hospital', type: 'Private',
    name: 'Bangladesh Specialized Hospital', nameBn: 'বাংলাদেশ স্পেশালাইজড হাসপাতাল',
    description: `Bangladesh Specialized Hospital, established in 2010, is a modern 300-bed private hospital located in Shyamoli, Mirpur Road, Dhaka. It provides a comprehensive range of specialist medical and surgical services.

The hospital is equipped with modern diagnostic facilities and a dedicated team of experienced consultants covering cardiology, neurology, orthopedics, medicine, surgery, gynecology, and more.

With 24/7 emergency services and a focus on patient-centred care, Bangladesh Specialized Hospital serves a large patient base from across Dhaka and the surrounding regions.`,
    phone: '09666700100', emergencyPhone: '09666700100',
    address: '21 Shyamoli, Mirpur Road, Dhaka',
    addressBn: '২১ শ্যামলী, মিরপুর রোড, ঢাকা',
    googleMapsUrl: 'https://maps.google.com/?q=Bangladesh+Specialized+Hospital+Shyamoli',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-010', 'Shyamoli', 'শ্যামলী', 'shyamoli'),
    bedCount: 300, establishedYear: 2010,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.2, reviewCount: 700, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d7-1','h-007','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d7-2','h-007','Neurology','নিউরোলজি'),
      mkDept('d7-3','h-007','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d7-4','h-007','Medicine','মেডিসিন'),
      mkDept('d7-5','h-007','Surgery','সার্জারি'),
      mkDept('d7-6','h-007','Gynecology','গাইনি বিভাগ'),
      mkDept('d7-7','h-007','ICU','আইসিইউ'),
      mkDept('d7-8','h-007','Emergency','ইমার্জেন্সি'),
    ],
    amenities: ['MRI','CT Scan','ICU','Blood Bank','Pharmacy','Ambulance','Parking','Digital X-Ray'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '20:00', isOpen: true },
    ],
  },

  'asgar-ali-hospital': {
    id: 'h-008', slug: 'asgar-ali-hospital', type: 'Private',
    name: 'Asgar Ali Hospital', nameBn: 'আসগর আলী হাসপাতাল',
    description: `Asgar Ali Hospital, established in 2013, is a modern 250-bed private hospital serving the Gandaria and Old Dhaka area. It provides high-quality medical and surgical services to a large patient population from South Dhaka.

The hospital is equipped with modern operation theatres, an ICU, diagnostic imaging, and a dedicated emergency department. It has built a strong reputation for accessible specialist care in a historically underserved part of the city.

With 24/7 emergency services on helpline 10602, Asgar Ali Hospital is a trusted healthcare destination for residents of Old Dhaka and the surrounding districts.`,
    phone: '10602', emergencyPhone: '10602',
    address: '111/1/A Distillery Road, Gandaria, Dhaka',
    addressBn: '১১১/১/এ ডিস্টিলারি রোড, গেন্ডারিয়া, ঢাকা',
    googleMapsUrl: 'https://maps.google.com/?q=Asgar+Ali+Hospital+Gandaria+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-011', 'Gandaria', 'গেন্ডারিয়া', 'gandaria'),
    bedCount: 250, establishedYear: 2013,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 520, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d8-1','h-008','Medicine','মেডিসিন'),
      mkDept('d8-2','h-008','Surgery','সার্জারি'),
      mkDept('d8-3','h-008','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d8-4','h-008','Gynecology','গাইনি বিভাগ'),
      mkDept('d8-5','h-008','Pediatrics','শিশু বিভাগ'),
      mkDept('d8-6','h-008','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d8-7','h-008','ICU','আইসিইউ'),
      mkDept('d8-8','h-008','Emergency','ইমার্জেন্সি','10602'),
    ],
    amenities: ['ICU','Operation Theatre','CT Scan','Digital X-Ray','Blood Bank','Pharmacy','Ambulance','Parking'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '20:00', isOpen: true },
    ],
  },

  'dhaka-medical-college-hospital': {
    id: 'h-009', slug: 'dhaka-medical-college-hospital', type: 'Government',
    name: 'Dhaka Medical College Hospital', nameBn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    description: `Dhaka Medical College Hospital (DMCH), established in 1946, is one of Bangladesh's oldest and largest government teaching hospitals with 2,300 beds. It is a national referral centre for trauma, burns, and complex medical conditions.

DMCH provides free or heavily subsidised care across all major specialties including emergency, surgery, medicine, orthopedics, gynecology, neurology, and cardiology. The hospital's burn unit is one of the most active in South Asia.

As both a teaching hospital and national trauma centre, DMCH handles over 5,000 outpatient visits daily, serving patients from all over Bangladesh who cannot afford private healthcare.`,
    phone: '02-55165088', emergencyPhone: '02-55165088',
    address: 'Secretariat Road, Bakshibazar, Dhaka-1000',
    addressBn: 'সেক্রেটারিয়েট রোড, বক্সিবাজার, ঢাকা-১০০০',
    googleMapsUrl: 'https://maps.google.com/?q=Dhaka+Medical+College+Hospital',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-008', 'Bakshibazar', 'বক্সিবাজার', 'bakshibazar'),
    bedCount: 2300, establishedYear: 1946,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 3.8, reviewCount: 1204, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d9-1','h-009','Emergency','ইমার্জেন্সি','02-55165088'),
      mkDept('d9-2','h-009','Medicine','মেডিসিন'),
      mkDept('d9-3','h-009','Surgery','সার্জারি'),
      mkDept('d9-4','h-009','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d9-5','h-009','Burn Unit','বার্ন ইউনিট'),
      mkDept('d9-6','h-009','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d9-7','h-009','Neurology','নিউরোলজি'),
      mkDept('d9-8','h-009','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d9-9','h-009','Pediatrics','শিশু বিভাগ'),
      mkDept('d9-10','h-009','Ophthalmology','চক্ষু বিভাগ'),
    ],
    amenities: ['National Trauma Centre','Burn Unit','ICU','Blood Bank','Government Services (Free/Subsidised)','Ambulance','Pharmacy','Teaching Hospital'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },

  'bsmmu': {
    id: 'h-010', slug: 'bsmmu', type: 'Government',
    name: 'Bangabandhu Sheikh Mujib Medical University', nameBn: 'বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়',
    description: `Bangabandhu Sheikh Mujib Medical University (BSMMU), established in 1998, is Bangladesh's premier postgraduate medical university and teaching hospital. Located at Shahbagh, Dhaka, it has 1,500 beds and provides specialist care across virtually all medical disciplines.

BSMMU is the leading institution for postgraduate medical education and research in Bangladesh, producing the country's top specialist doctors. Its clinical departments cover oncology, cardiology, nephrology, neurosurgery, hepatology, gastroenterology, and many other super-specialties.

As a government institution, BSMMU offers high-quality specialist services at heavily subsidised rates, making advanced care accessible to all income groups. The hospital also runs one of Bangladesh's most active organ transplant programmes.`,
    phone: '9661051', emergencyPhone: '9661051',
    website: 'https://bsmmu.edu.bd',
    address: 'Shahbagh, Dhaka-1000',
    addressBn: 'শাহবাগ, ঢাকা-১০০০',
    googleMapsUrl: 'https://maps.google.com/?q=BSMMU+Shahbagh+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-009', 'Shahbagh', 'শাহবাগ', 'shahbagh'),
    bedCount: 1500, establishedYear: 1998,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 980, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d10-1','h-010','Oncology','ক্যান্সার বিভাগ'),
      mkDept('d10-2','h-010','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d10-3','h-010','Nephrology','নেফ্রোলজি'),
      mkDept('d10-4','h-010','Neurosurgery','নিউরোসার্জারি'),
      mkDept('d10-5','h-010','Hepatology','হেপাটোলজি'),
      mkDept('d10-6','h-010','Gastroenterology','গ্যাস্ট্রোএন্টারোলজি'),
      mkDept('d10-7','h-010','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d10-8','h-010','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d10-9','h-010','Pediatrics','শিশু বিভাগ'),
      mkDept('d10-10','h-010','Organ Transplant','অঙ্গ প্রতিস্থাপন'),
    ],
    amenities: ['Postgraduate Medical University','Organ Transplant Unit','ICU','Blood Bank','MRI','CT Scan','Subsidised Government Services','Teaching Hospital','Research Institute','Pharmacy'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '20:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '20:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Friday',    open: '09:00', close: '14:00', isOpen: true },
    ],
  },

  'nicvd': {
    id: 'h-011', slug: 'nicvd', type: 'Government',
    name: 'National Institute of Cardiovascular Diseases', nameBn: 'জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল',
    description: `The National Institute of Cardiovascular Diseases (NICVD), established in 1978, is Bangladesh's national referral centre for heart disease with 800 beds. Located in Sher-e-Bangla Nagar, Dhaka, it is operated by the government and provides advanced cardiac care at subsidised rates.

NICVD specialises in coronary artery disease, cardiac surgery, interventional cardiology, electrophysiology, and paediatric cardiac care. The institute has multiple functioning Cath Labs, cardiac ICU, and performs hundreds of open-heart surgeries annually.

As the primary government cardiac hospital, NICVD plays a vital role in making life-saving cardiac interventions accessible to the millions of Bangladeshis who cannot afford private hospital rates.`,
    phone: '55067351', emergencyPhone: '55067351',
    address: 'Sher-e-Bangla Nagar, Dhaka-1207',
    addressBn: 'শেরে বাংলা নগর, ঢাকা-১২০৭',
    googleMapsUrl: 'https://maps.google.com/?q=NICVD+Dhaka+Sher-e-Bangla+Nagar',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-012', 'Sher-e-Bangla Nagar', 'শেরে বাংলা নগর', 'sher-e-bangla-nagar'),
    bedCount: 800, establishedYear: 1978,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.3, reviewCount: 640, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d11-1','h-011','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d11-2','h-011','Cardiac Surgery','কার্ডিয়াক সার্জারি'),
      mkDept('d11-3','h-011','Cath Lab & Interventional Cardiology','ক্যাথ ল্যাব'),
      mkDept('d11-4','h-011','Cardiac ICU','কার্ডিয়াক আইসিইউ'),
      mkDept('d11-5','h-011','Paediatric Cardiology','শিশু হৃদরোগ'),
      mkDept('d11-6','h-011','Emergency','ইমার্জেন্সি'),
    ],
    amenities: ['Multiple Cath Labs','Cardiac ICU','Open-Heart Surgery Unit','Blood Bank','Subsidised Government Services','Ambulance','Pharmacy','Echocardiography'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '20:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '20:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Friday',    open: '09:00', close: '13:00', isOpen: true },
    ],
  },

  'nins-hospital': {
    id: 'h-012', slug: 'nins-hospital', type: 'Government',
    name: 'National Institute of Neurosciences & Hospital', nameBn: 'জাতীয় নিউরোসায়েন্স ইনস্টিটিউট ও হাসপাতাল',
    description: `The National Institute of Neurosciences & Hospital (NINS), established in 2012, is Bangladesh's dedicated national centre for neurological care with 450 beds. Located in Agargaon, Dhaka, it is the primary government referral hospital for all neurological conditions.

NINS provides neurosurgery, clinical neurology, neurocritical care, and neuroradiology services. It handles complex cases including brain tumours, spinal cord injuries, epilepsy, stroke, and movement disorders.

As a government institution, NINS makes advanced neurosurgical care available at a fraction of private hospital costs, serving patients referred from across the country.`,
    phone: '55007515', emergencyPhone: '55007515',
    address: 'Agargaon, Dhaka-1207',
    addressBn: 'আগারগাঁও, ঢাকা-১২০৭',
    googleMapsUrl: 'https://maps.google.com/?q=NINS+Hospital+Agargaon+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-013', 'Agargaon', 'আগারগাঁও', 'agargaon'),
    bedCount: 450, establishedYear: 2012,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.4, reviewCount: 530, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d12-1','h-012','Neurology','নিউরোলজি'),
      mkDept('d12-2','h-012','Neurosurgery','নিউরোসার্জারি'),
      mkDept('d12-3','h-012','Neurocritical Care / ICU','নিউরোক্রিটিক্যাল কেয়ার'),
      mkDept('d12-4','h-012','Neuroradiology','নিউরোরেডিওলজি'),
      mkDept('d12-5','h-012','Epilepsy Unit','এপিলেপসি ইউনিট'),
      mkDept('d12-6','h-012','Emergency','ইমার্জেন্সি'),
    ],
    amenities: ['MRI','CT Scan','Neuro ICU','EEG Unit','Subsidised Government Services','Ambulance','Pharmacy','Blood Bank'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '20:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '20:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Friday',    open: '09:00', close: '13:00', isOpen: true },
    ],
  },

  'nicrh': {
    id: 'h-013', slug: 'nicrh', type: 'Government',
    name: 'National Institute of Cancer Research & Hospital', nameBn: 'জাতীয় ক্যান্সার গবেষণা ইনস্টিটিউট ও হাসপাতাল',
    description: `The National Institute of Cancer Research & Hospital (NICRH), established in 1968, is Bangladesh's premier government cancer treatment and research hospital with 300 beds. Located in Mohakhali, Dhaka, it is the national centre for oncology care.

NICRH provides oncology, radiotherapy, chemotherapy, and cancer surgery at heavily subsidised government rates, making cancer treatment accessible to low-income patients across the country.

The institute also conducts vital cancer research and epidemiological studies, contributing to the national understanding and management of cancer burden in Bangladesh.`,
    phone: '02-9124770',
    address: 'Mohakhali, Dhaka-1212',
    addressBn: 'মহাখালী, ঢাকা-১২১২',
    googleMapsUrl: 'https://maps.google.com/?q=NICRH+Mohakhali+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-014', 'Mohakhali', 'মহাখালী', 'mohakhali'),
    bedCount: 300, establishedYear: 1968,
    isEmergency: false, isVerified: true, isFeatured: false, isActive: true,
    rating: 3.9, reviewCount: 542, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d13-1','h-013','Oncology','ক্যান্সার বিভাগ'),
      mkDept('d13-2','h-013','Radiotherapy','রেডিওথেরাপি'),
      mkDept('d13-3','h-013','Chemotherapy','কেমোথেরাপি'),
      mkDept('d13-4','h-013','Cancer Surgery','ক্যান্সার সার্জারি'),
      mkDept('d13-5','h-013','Cancer Research','ক্যান্সার গবেষণা'),
    ],
    amenities: ['Radiotherapy Unit','Chemotherapy Unit','Subsidised Government Services','Blood Bank','Pharmacy','Research Laboratory'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '14:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '14:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '14:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '14:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '14:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '14:00', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '00:00', isOpen: false },
    ],
  },

  'burn-institute': {
    id: 'h-014', slug: 'burn-institute', type: 'Government',
    name: 'National Institute of Burn & Plastic Surgery', nameBn: 'জাতীয় বার্ন ও প্লাস্টিক সার্জারি ইনস্টিটিউট',
    description: `The National Institute of Burn & Plastic Surgery (NIBPS), opened on 4 July 2019, is Bangladesh's dedicated national hospital for burn treatment and plastic surgery with 500 beds. Located at Chankharpul, Dhaka, it was formerly known as Sheikh Hasina National Institute of Burn and Plastic Surgery.

NIBPS is the national referral centre for burn victims, providing advanced burn treatment, skin grafting, reconstructive surgery, and plastic surgery. The hospital was established to address the enormous burden of burn injuries in Bangladesh, particularly from fire accidents and acid attacks.

With 24/7 emergency burn care, modern ICUs, and a dedicated operating theatre complex, NIBPS has significantly improved survival rates and quality of care for burn patients across the country.`,
    phone: '55165001', emergencyPhone: '55165001',
    address: '63, AHM Kamruzzaman Sharani, Chankharpul, Dhaka',
    addressBn: '৬৩, এএইচএম কামরুজ্জামান শরণী, চানখারপুল, ঢাকা',
    googleMapsUrl: 'https://maps.google.com/?q=National+Institute+Burn+Plastic+Surgery+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-015', 'Chankharpul', 'চানখারপুল', 'chankharpul'),
    bedCount: 500, establishedYear: 2019,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.6, reviewCount: 450, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d14-1','h-014','Burn Unit','বার্ন ইউনিট'),
      mkDept('d14-2','h-014','Plastic Surgery','প্লাস্টিক সার্জারি'),
      mkDept('d14-3','h-014','Reconstructive Surgery','পুনর্গঠন সার্জারি'),
      mkDept('d14-4','h-014','ICU','আইসিইউ'),
      mkDept('d14-5','h-014','Emergency','ইমার্জেন্সি','55165001'),
    ],
    amenities: ['Dedicated Burn ICU','Skin Grafting Unit','Reconstructive OT','Blood Bank','Subsidised Government Services','Ambulance','Pharmacy'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },

  'kurmitola-general-hospital': {
    id: 'h-015', slug: 'kurmitola-general-hospital', type: 'Government',
    name: 'Kurmitola General Hospital', nameBn: 'কুর্মিটোলা জেনারেল হাসপাতাল',
    description: `Kurmitola General Hospital, established in 2012, is a government hospital in the Kurmitola area of North Dhaka with 275 beds. It provides general medical and surgical services to the large residential communities of Uttara, Kurmitola, and the surrounding northern Dhaka area.

The hospital offers 24/7 emergency care, outpatient consultations, and inpatient services across medicine, surgery, gynecology, and pediatrics at government-subsidised rates.

Kurmitola General Hospital gained significant public visibility during the COVID-19 pandemic when it served as one of Dhaka's primary COVID treatment centres.`,
    phone: '55062350', emergencyPhone: '55062350',
    address: 'Kurmitola, Dhaka-1229',
    addressBn: 'কুর্মিটোলা, ঢাকা-১২২৯',
    googleMapsUrl: 'https://maps.google.com/?q=Kurmitola+General+Hospital+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-016', 'Kurmitola', 'কুর্মিটোলা', 'kurmitola'),
    bedCount: 275, establishedYear: 2012,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.1, reviewCount: 390, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d15-1','h-015','Medicine','মেডিসিন'),
      mkDept('d15-2','h-015','Surgery','সার্জারি'),
      mkDept('d15-3','h-015','Gynecology','গাইনি বিভাগ'),
      mkDept('d15-4','h-015','Pediatrics','শিশু বিভাগ'),
      mkDept('d15-5','h-015','Emergency','ইমার্জেন্সি','55062350'),
    ],
    amenities: ['ICU','Blood Bank','Pharmacy','Subsidised Government Services','Ambulance','X-Ray','Pathology Lab'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },

  'cmh-dhaka': {
    id: 'h-016', slug: 'cmh-dhaka', type: 'Government',
    name: 'Combined Military Hospital Dhaka', nameBn: 'সম্মিলিত সামরিক হাসপাতাল ঢাকা',
    description: `Combined Military Hospital (CMH) Dhaka, established in 1979, is the largest and most advanced military hospital in Bangladesh with 1,000 beds. Located inside Dhaka Cantonment, it primarily serves Bangladesh Armed Forces personnel and their families.

CMH Dhaka is equipped with state-of-the-art medical technology and is staffed by highly trained military medical officers. It provides comprehensive care across all major specialties including cardiology, neurosurgery, orthopedics, oncology, and critical care.

The hospital maintains extremely high standards of care and cleanliness, and consistently receives among the highest patient satisfaction ratings of any hospital in Bangladesh.`,
    phone: '8711111', emergencyPhone: '8711111',
    address: 'Dhaka Cantonment, Dhaka-1206',
    addressBn: 'ঢাকা ক্যান্টনমেন্ট, ঢাকা-১২০৬',
    googleMapsUrl: 'https://maps.google.com/?q=CMH+Dhaka+Cantonment',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-017', 'Cantonment', 'ক্যান্টনমেন্ট', 'cantonment'),
    bedCount: 1000, establishedYear: 1979,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.7, reviewCount: 730, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d16-1','h-016','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d16-2','h-016','Neurosurgery','নিউরোসার্জারি'),
      mkDept('d16-3','h-016','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d16-4','h-016','Oncology','ক্যান্সার বিভাগ'),
      mkDept('d16-5','h-016','ICU & Critical Care','আইসিইউ'),
      mkDept('d16-6','h-016','Emergency','ইমার্জেন্সি'),
    ],
    amenities: ['Military-Grade Facilities','ICU','MRI','CT Scan','Blood Bank','Pharmacy','Ambulance','Specialist Panels'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },

  'popular-diagnostic': {
    id: 'h-017', slug: 'popular-diagnostic', type: 'Diagnostic',
    name: 'Popular Diagnostic Centre', nameBn: 'পপুলার ডায়াগনস্টিক সেন্টার',
    description: `Popular Diagnostic Centre, established in 1983, is one of the largest and most trusted diagnostic chains in Bangladesh, with its main centre in Dhanmondi, Dhaka. It offers comprehensive diagnostic and outpatient specialist consultation services.

Popular provides MRI, CT scan, digital X-ray, ultrasound, all pathology tests, and specialist consultations across cardiology, endocrinology, radiology, and many other fields. Its quality laboratory services follow international standards.

With dozens of branches across Bangladesh, Popular Diagnostic has become the go-to diagnostic chain for millions of patients seeking reliable, affordable test results and specialist consultations.`,
    phone: '09613787801',
    address: 'House 16, Road 2, Dhanmondi, Dhaka-1205',
    addressBn: 'হাউস ১৬, রোড ২, ধানমন্ডি, ঢাকা-১২০৫',
    googleMapsUrl: 'https://maps.google.com/?q=Popular+Diagnostic+Centre+Dhanmondi',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-002', 'Dhanmondi', 'ধানমন্ডি', 'dhanmondi'),
    bedCount: 0, establishedYear: 1983,
    isEmergency: false, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.2, reviewCount: 876, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d17-1','h-017','Pathology','প্যাথলজি'),
      mkDept('d17-2','h-017','Radiology & Imaging','রেডিওলজি'),
      mkDept('d17-3','h-017','Cardiology OPD','হৃদরোগ ওপিডি'),
      mkDept('d17-4','h-017','Endocrinology OPD','এন্ডোক্রিনোলজি ওপিডি'),
      mkDept('d17-5','h-017','Diagnostic Imaging','ডায়াগনস্টিক ইমেজিং'),
    ],
    amenities: ['MRI','CT Scan','Digital X-Ray','Ultrasound','Pathology Lab','Specialist OPD','Online Reports','50+ Branches Nationwide'],
    openingHours: [
      { day: 'Saturday',  open: '07:00', close: '21:00', isOpen: true },
      { day: 'Sunday',    open: '07:00', close: '21:00', isOpen: true },
      { day: 'Monday',    open: '07:00', close: '21:00', isOpen: true },
      { day: 'Tuesday',   open: '07:00', close: '21:00', isOpen: true },
      { day: 'Wednesday', open: '07:00', close: '21:00', isOpen: true },
      { day: 'Thursday',  open: '07:00', close: '21:00', isOpen: true },
      { day: 'Friday',    open: '08:00', close: '14:00', isOpen: true },
    ],
  },

  'praava-health': {
    id: 'h-018', slug: 'praava-health', type: 'Diagnostic',
    name: 'Praava Health', nameBn: 'প্রাভা হেলথ',
    description: `Praava Health, established in 2017, is a modern international-standard outpatient and diagnostic centre in Banani, Dhaka. It provides primary care, specialist consultations, and advanced diagnostics with a strong focus on patient experience and digital health.

Praava combines experienced Bangladeshi specialists with an internationally trained clinical team, offering services in primary care, women's health, paediatrics, cardiology, mental health, physiotherapy, and more. It is particularly well known for its preventive care packages and corporate health programmes.

With transparent pricing, minimal wait times, and a digital patient portal for records and appointments, Praava Health represents a new model of healthcare delivery in Bangladesh.`,
    phone: '10648',
    website: 'https://praavahealth.com',
    address: 'Banani, Dhaka-1213',
    addressBn: 'বনানী, ঢাকা-১২১৩',
    googleMapsUrl: 'https://maps.google.com/?q=Praava+Health+Banani+Dhaka',
    districtId: 'd-001', district: DHAKA_DISTRICT,
    area: area('a-018', 'Banani', 'বনানী', 'banani'),
    bedCount: 0, establishedYear: 2017,
    isEmergency: false, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.7, reviewCount: 1100, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d18-1','h-018','Primary Care','প্রাইমারি কেয়ার'),
      mkDept('d18-2','h-018','Women\'s Health','মহিলা স্বাস্থ্য'),
      mkDept('d18-3','h-018','Paediatrics','শিশু বিভাগ'),
      mkDept('d18-4','h-018','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d18-5','h-018','Mental Health','মানসিক স্বাস্থ্য'),
      mkDept('d18-6','h-018','Physiotherapy','ফিজিওথেরাপি'),
    ],
    amenities: ['Advanced Diagnostics','Digital Patient Portal','Preventive Health Packages','Corporate Health','Minimal Wait Times','Transparent Pricing','International Standards'],
    openingHours: [
      { day: 'Saturday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Sunday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Monday',    open: '08:00', close: '20:00', isOpen: true },
      { day: 'Tuesday',   open: '08:00', close: '20:00', isOpen: true },
      { day: 'Wednesday', open: '08:00', close: '20:00', isOpen: true },
      { day: 'Thursday',  open: '08:00', close: '20:00', isOpen: true },
      { day: 'Friday',    open: '10:00', close: '18:00', isOpen: true },
    ],
  },

  'cmch': {
    id: 'h-019', slug: 'cmch', type: 'Government',
    name: 'Chittagong Medical College Hospital', nameBn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল',
    description: `Chittagong Medical College Hospital (CMCH), established in 1957, is the main government teaching hospital in the Chittagong Division with 1,300 beds. It serves as the primary referral hospital for millions of patients across Chittagong and the surrounding southeastern districts.

CMCH provides comprehensive care across emergency, medicine, surgery, gynecology, pediatrics, orthopedics, and many other specialties at government-subsidised rates. As a teaching hospital, it is staffed by senior consultant specialists and postgraduate trainees.

The hospital is the busiest medical facility in Chittagong, handling thousands of outpatient visits and emergency cases daily.`,
    phone: '031-630335', emergencyPhone: '031-630335',
    address: 'Panchlaish, Chittagong',
    addressBn: 'পাঁচলাইশ, চট্টগ্রাম',
    googleMapsUrl: 'https://maps.google.com/?q=Chittagong+Medical+College+Hospital',
    districtId: 'd-002', district: CTG_DISTRICT,
    area: area('a-019', 'Panchlaish', 'পাঁচলাইশ', 'panchlaish'),
    bedCount: 1300, establishedYear: 1957,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.1, reviewCount: 600, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d19-1','h-019','Emergency','ইমার্জেন্সি','031-630335'),
      mkDept('d19-2','h-019','Medicine','মেডিসিন'),
      mkDept('d19-3','h-019','Surgery','সার্জারি'),
      mkDept('d19-4','h-019','Pediatrics','শিশু বিভাগ'),
      mkDept('d19-5','h-019','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d19-6','h-019','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d19-7','h-019','Cardiology','হৃদরোগ বিভাগ'),
      mkDept('d19-8','h-019','Neurology','নিউরোলজি'),
    ],
    amenities: ['Government Teaching Hospital','ICU','Blood Bank','Pharmacy','Subsidised Services','Ambulance','X-Ray','Pathology Lab'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },

  'osmani-medical': {
    id: 'h-020', slug: 'osmani-medical', type: 'Government',
    name: 'Sylhet MAG Osmani Medical College Hospital', nameBn: 'সিলেট এম এ জি ওসমানী মেডিকেল কলেজ হাসপাতাল',
    description: `Sylhet MAG Osmani Medical College Hospital, established in 1962, is the main government teaching hospital in Sylhet Division with 900 beds. Named after the legendary freedom fighter General Muhammad Ataul Gani Osmani, it serves as the primary referral hospital for millions across Sylhet, Sunamganj, Habiganj, and Moulvibazar districts.

The hospital provides comprehensive care across all major specialties including emergency, medicine, surgery, gynecology, pediatrics, orthopedics, and psychiatry at government-subsidised rates.

As the largest medical facility in the Sylhet region, Osmani Medical College Hospital plays a critical role in delivering healthcare to the large population of northeastern Bangladesh, including many NRBs returning from the UK for medical care.`,
    phone: '0821-713842', emergencyPhone: '0821-713842',
    address: 'Kajalshah, Sylhet-3100',
    addressBn: 'কাজলশাহ, সিলেট-৩১০০',
    googleMapsUrl: 'https://maps.google.com/?q=Osmani+Medical+College+Hospital+Sylhet',
    districtId: 'd-003', district: SYL_DISTRICT,
    area: area('a-020', 'Kajalshah', 'কাজলশাহ', 'kajalshah'),
    bedCount: 900, establishedYear: 1962,
    isEmergency: true, isVerified: true, isFeatured: false, isActive: true,
    rating: 4.0, reviewCount: 420, photos: [], createdAt: '', updatedAt: '',
    departments: [
      mkDept('d20-1','h-020','Emergency','ইমার্জেন্সি','0821-713842'),
      mkDept('d20-2','h-020','Medicine','মেডিসিন'),
      mkDept('d20-3','h-020','Surgery','সার্জারি'),
      mkDept('d20-4','h-020','Gynecology & Obstetrics','গাইনি বিভাগ'),
      mkDept('d20-5','h-020','Pediatrics','শিশু বিভাগ'),
      mkDept('d20-6','h-020','Orthopedics','অর্থোপেডিক্স'),
      mkDept('d20-7','h-020','Psychiatry','মনোরোগ বিভাগ'),
    ],
    amenities: ['Government Teaching Hospital','ICU','Blood Bank','Pharmacy','Subsidised Services','Ambulance','X-Ray','Pathology Lab'],
    openingHours: [
      { day: 'Saturday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Sunday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Monday',    open: '00:00', close: '23:59', isOpen: true },
      { day: 'Tuesday',   open: '00:00', close: '23:59', isOpen: true },
      { day: 'Wednesday', open: '00:00', close: '23:59', isOpen: true },
      { day: 'Thursday',  open: '00:00', close: '23:59', isOpen: true },
      { day: 'Friday',    open: '00:00', close: '23:59', isOpen: true },
    ],
  },
};

// ── Similar hospitals per slug ───────────────────────────────
const SIMILAR_MAP: Record<string, string[]> = {
  'square-hospital':                    ['united-hospital','evercare-hospital','labaid-hospital'],
  'united-hospital':                    ['square-hospital','evercare-hospital','labaid-hospital'],
  'evercare-hospital':                  ['square-hospital','united-hospital','labaid-hospital'],
  'labaid-hospital':                    ['square-hospital','ibn-sina-hospital','birdem-hospital'],
  'ibn-sina-hospital':                  ['labaid-hospital','birdem-hospital','bangladesh-specialized-hospital'],
  'birdem-hospital':                    ['square-hospital','labaid-hospital','ibn-sina-hospital'],
  'bangladesh-specialized-hospital':    ['labaid-hospital','ibn-sina-hospital','asgar-ali-hospital'],
  'asgar-ali-hospital':                 ['bangladesh-specialized-hospital','ibn-sina-hospital','labaid-hospital'],
  'dhaka-medical-college-hospital':     ['bsmmu','nicvd','nins-hospital'],
  'bsmmu':                              ['dhaka-medical-college-hospital','nicvd','nicrh'],
  'nicvd':                              ['bsmmu','dhaka-medical-college-hospital','nins-hospital'],
  'nins-hospital':                      ['bsmmu','nicvd','dhaka-medical-college-hospital'],
  'nicrh':                              ['bsmmu','burn-institute','dhaka-medical-college-hospital'],
  'burn-institute':                     ['dhaka-medical-college-hospital','nicrh','kurmitola-general-hospital'],
  'kurmitola-general-hospital':         ['dhaka-medical-college-hospital','bsmmu','cmh-dhaka'],
  'cmh-dhaka':                          ['bsmmu','dhaka-medical-college-hospital','nicvd'],
  'popular-diagnostic':                 ['praava-health','labaid-hospital','ibn-sina-hospital'],
  'praava-health':                      ['popular-diagnostic','labaid-hospital','square-hospital'],
  'cmch':                               ['osmani-medical','dhaka-medical-college-hospital','bsmmu'],
  'osmani-medical':                     ['cmch','dhaka-medical-college-hospital','bsmmu'],
};

// ── Static fake reviews (shared, fine for demo) ─────────────
const FAKE_REVIEWS = [
  { id: 'r-001', authorName: 'Rahim Uddin',    rating: 5, content: 'Excellent care and professional staff. The doctors are highly qualified and gave full attention to my condition.', date: '2 weeks ago',  isVerified: true  },
  { id: 'r-002', authorName: 'Fatema Begum',   rating: 4, content: 'Good hospital with modern equipment. Waiting time could be improved but overall a very positive experience.', date: '1 month ago',  isVerified: true  },
  { id: 'r-003', authorName: 'Kamal Hossain',  rating: 5, content: 'My mother had surgery here. The surgical team was exceptional and post-op care was thorough. Highly recommend.', date: '2 months ago', isVerified: false },
];

const RATING_BREAKDOWN = [
  { label: '5 stars', pct: 62 },
  { label: '4 stars', pct: 24 },
  { label: '3 stars', pct: 9  },
  { label: '2 stars', pct: 3  },
  { label: '1 star',  pct: 2  },
];

// ============================================================
// COMPONENT
// ============================================================

type Tab = 'overview' | 'departments' | 'reviews' | 'location';

interface Props { slug: string }

export default function HospitalDetailPage({ slug }: Props) {
  const hospital = ALL_HOSPITALS[slug];
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeDept, setActiveDept] = useState<HospitalDepartment | null>(null);


  if (!hospital) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
            <h2 className="font-bold text-slate-700 text-xl mb-2">Hospital not found</h2>
            <p className="text-slate-400 text-sm mb-6">We couldn't find a hospital with that name.</p>
            <Link href="/hospitals" className="btn btn-primary btn-sm">Browse Hospitals</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const similarSlugs = SIMILAR_MAP[slug] ?? [];
  const similarHospitals = similarSlugs.map(s => ALL_HOSPITALS[s]).filter(Boolean) as HospitalDetail[];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',    label: 'Overview' },
    { id: 'departments', label: `Departments (${hospital.departments?.length ?? 0})` },
    { id: 'reviews',     label: `Reviews (${hospital.reviewCount.toLocaleString()})` },
    { id: 'location',    label: 'Location' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* ── Hero Banner ── */}
        <div className="relative h-52 sm:h-64 bg-gradient-to-br from-sky-800 to-sky-900 overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-[0.06]" />
          {hospital.coverImage && (
            <Image src={hospital.coverImage} alt={hospital.name} fill className="object-cover opacity-30" unoptimized />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-20 sm:top-24 left-4 sm:left-8 flex items-center gap-2 text-white/60 text-xs">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/hospitals" className="hover:text-white transition-colors">Hospitals</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[180px]">{hospital.name}</span>
          </div>
        </div>

        {/* ── Profile Card ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row gap-5 items-start">

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
                {hospital.logo
                  ? <Image src={hospital.logo} alt={hospital.name} width={80} height={80} className="object-contain" unoptimized />
                  : <Building2 className="w-8 h-8 text-slate-400" strokeWidth={1.5} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-playfair font-bold text-xl sm:text-2xl text-slate-900 leading-tight">{hospital.name}</h1>
                  {hospital.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                  <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">{hospital.type}</span>
                </div>
                {hospital.nameBn && <p className="text-slate-400 text-sm mb-2">{hospital.nameBn}</p>}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                  {hospital.area && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {hospital.area.name}, {hospital.district?.name}
                    </span>
                  )}
                  {hospital.bedCount ? (
                    <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400" />{hospital.bedCount} beds</span>
                  ) : null}
                  {hospital.establishedYear && (
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" />Est. {hospital.establishedYear}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={cn('w-3.5 h-3.5', s <= Math.round(hospital.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{hospital.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-xs">({hospital.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                {hospital.isEmergency && (
                  <a href={`tel:${hospital.emergencyPhone}`}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors shadow-lg shadow-red-200">
                    <Ambulance className="w-4 h-4" />Emergency {hospital.emergencyPhone}
                  </a>
                )}
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`}
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors">
                    <Phone className="w-4 h-4" />Call {hospital.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex-1 min-w-max text-sm font-semibold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap',
                  activeTab === tab.id ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50')}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (<>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">About {hospital.name}</h2>
                <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                  {hospital.description?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Facilities & Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.amenities.map(a => (
                    <span key={a} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Opening Hours</h2>
                <div className="space-y-2.5">
                  {hospital.openingHours.map(h => (
                    <div key={h.day} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium w-24">{h.day}</span>
                      {h.isOpen
                        ? <span className="text-slate-700">{h.open === '00:00' && h.close === '23:59' ? '24 Hours' : `${h.open} – ${h.close}`}</span>
                        : <span className="text-red-500 font-medium">Closed</span>}
                    </div>
                  ))}
                  {hospital.isEmergency && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-red-600 text-sm font-semibold">
                      <Ambulance className="w-4 h-4" />Emergency services available 24/7
                    </div>
                  )}
                </div>
              </div>
            </>)}

            {/* DEPARTMENTS */}
            {activeTab === 'departments' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">
                  Departments <span className="text-slate-400 font-normal text-base">({hospital.departments?.length})</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {hospital.departments?.map(dept => (
                    <button key={dept.id} onClick={() => setActiveDept(dept)} className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 group hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-sky-700">{dept.name}</p>
                        {dept.nameBn && <p className="text-xs text-slate-400">{dept.nameBn}</p>}
                      </div>
                      {dept.phone && (
                        <a href={`tel:${dept.phone}`} className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3" />{dept.phone}
                        </a>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <div className="flex gap-8 items-center mb-6">
                    <div className="text-center">
                      <p className="font-playfair font-bold text-5xl text-slate-900">{hospital.rating.toFixed(1)}</p>
                      <div className="flex items-center gap-0.5 justify-center my-1.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={cn('w-4 h-4', s <= Math.round(hospital.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')} />
                        ))}
                      </div>
                      <p className="text-slate-500 text-xs">{hospital.reviewCount.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {RATING_BREAKDOWN.map(r => (
                        <div key={r.label} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 w-14 shrink-0">{r.label}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-slate-400 w-8 text-right">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {FAKE_REVIEWS.map(review => (
                  <div key={review.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
                          {review.authorName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{review.authorName}</p>
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={cn('w-3 h-3', s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')} />
                              ))}
                            </div>
                            {review.isVerified && <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* LOCATION */}
            {activeTab === 'location' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Location</h2>
                <div className="h-56 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Map view</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700">{hospital.address}</p>
                      {hospital.addressBn && <p className="text-xs text-slate-400 mt-0.5">{hospital.addressBn}</p>}
                    </div>
                  </div>
                  {hospital.googleMapsUrl && (
                    <a href={hospital.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />Open in Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center"><Phone className="w-4 h-4 text-sky-600" /></div>
                    {hospital.phone}
                  </a>
                )}
                {hospital.altPhone && hospital.altPhone !== hospital.phone && (
                  <a href={`tel:${hospital.altPhone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center"><Phone className="w-4 h-4 text-slate-400 group-hover:text-sky-600" /></div>
                    {hospital.altPhone}
                  </a>
                )}
                {hospital.email && (
                  <a href={`mailto:${hospital.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center"><Mail className="w-4 h-4 text-slate-400 group-hover:text-sky-600" /></div>
                    {hospital.email}
                  </a>
                )}
                {hospital.website && (
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center"><Globe className="w-4 h-4 text-slate-400 group-hover:text-sky-600" /></div>
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Type',        value: hospital.type },
                  { label: 'Total Beds',  value: hospital.bedCount ? `${hospital.bedCount} beds` : '—' },
                  { label: 'Established', value: hospital.establishedYear ? String(hospital.establishedYear) : '—' },
                  { label: 'Departments', value: `${hospital.departments?.length ?? 0} departments` },
                  { label: 'Emergency',   value: hospital.isEmergency ? '24/7 Available' : 'Not Available' },
                  { label: 'Status',      value: hospital.isVerified ? 'Verified' : 'Pending' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-5 text-white">
              <Stethoscope className="w-6 h-6 mb-3 text-sky-200" strokeWidth={1.5} />
              <h3 className="font-bold text-base mb-1">Find Doctors Here</h3>
              <p className="text-sky-100/80 text-xs mb-4">Browse specialists who consult at {hospital.name}.</p>
              <Link href={`/doctors?hospital=${hospital.slug}`}
                className="inline-flex items-center gap-2 bg-white text-sky-700 text-sm font-bold px-4 py-2.5 rounded-2xl hover:bg-sky-50 transition-colors w-full justify-center">
                View Doctors <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Similar Hospitals ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="font-playfair font-bold text-xl text-slate-900 mb-5">Similar Hospitals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarHospitals.map((h, i) => (
              <HospitalCard key={h.id} hospital={h} index={i} />
            ))}
            <Link href="/hospitals"
              className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-sky-300 hover:bg-sky-50 transition-all group">
              <Building2 className="w-8 h-8 text-slate-300 group-hover:text-sky-400 transition-colors" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-slate-500 group-hover:text-sky-600">View all hospitals</span>
            </Link>
          </div>
        </div>

      </main>
      <Footer />

      {activeDept && (
        <DepartmentDoctors
          department={activeDept}
          hospitalId={hospital.id}
          hospitalSlug={hospital.slug}
          hospitalName={hospital.name}
          onClose={() => setActiveDept(null)}
        />
      )}
    </>
  );
}