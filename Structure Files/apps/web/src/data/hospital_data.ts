// hospital_data.ts
// Shared mock data: hospitals ↔ departments ↔ doctors ↔ chambers (hospital-specific schedules)

export type DayOfWeek = 'SAT' | 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';

export interface ChamberSchedule {
  day: DayOfWeek;
  startTime: string; // "10:00"
  endTime: string;   // "14:00"
  slotDurationMins: number;
}

export interface DoctorChamber {
  id: string;
  hospitalId: string;
  hospitalName: string;
  address: string;
  schedules: ChamberSchedule[];
  fee: number;
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  title: string;
  photo: string;
  gender: 'MALE' | 'FEMALE';
  specialtyName: string;
  departmentId: string;   // which dept they belong to in this hospital
  qualifications: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  bmdcNumber: string;
  isVerified: boolean;
  isFeatured: boolean;
  slug: string;
  about: string;
  languages: string[];
  chambers: DoctorChamber[]; // all chambers across all hospitals
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  nameBn: string;
  icon: string;
  doctorCount: number;
  headDoctor?: string;
  phone?: string;
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  type: 'Private' | 'Government' | 'Diagnostic' | 'Clinic';
  description: string;
  phone: string;
  altPhone?: string;
  email?: string;
  website?: string;
  address: string;
  addressBn: string;
  area: string;
  district: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  isEmergency: boolean;
  emergencyPhone?: string;
  bedCount: number;
  establishedYear: number;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  logo?: string;
  coverImage?: string;
  amenities: string[];
}

// ============================================================
// HOSPITALS
// ============================================================

export const HOSPITALS: Hospital[] = [
  {
    id: 'h-001',
    name: 'Square Hospital Ltd.',
    nameBn: 'স্কয়ার হাসপাতাল লিমিটেড',
    slug: 'square-hospital',
    type: 'Private',
    description: `Square Hospital Ltd. is one of the leading multispecialty tertiary-care hospitals in Bangladesh. Established in 2006, it is equipped with state-of-the-art medical technology and staffed by a team of highly qualified physicians, nurses, and support professionals.\n\nThe hospital offers a comprehensive range of inpatient and outpatient services including advanced diagnostic imaging, surgical procedures, intensive care, and specialized consultations across more than 20 departments.\n\nSquare Hospital is committed to delivering international-standard healthcare services to the people of Bangladesh at an affordable cost.`,
    phone: '10616',
    altPhone: '02-8159457',
    email: 'info@squarehospital.com',
    website: 'https://www.squarehospital.com',
    address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
    addressBn: '১৮/এফ, বীর উত্তম কাজী নুরুজ্জামান সরাক, পশ্চিম পান্থপথ, ঢাকা-১২০৫',
    area: 'Panthapath',
    district: 'Dhaka',
    latitude: 23.7543,
    longitude: 90.3901,
    googleMapsUrl: 'https://maps.google.com/?q=Square+Hospital+Dhaka',
    isEmergency: true,
    emergencyPhone: '10616',
    bedCount: 350,
    establishedYear: 2006,
    isVerified: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 1240,
    amenities: ['ICU & CCU', 'Blood Bank', 'Pharmacy', 'Canteen', 'Free WiFi', 'Ambulance Service', 'Parking', 'Prayer Room', 'ATM', 'CCTV Security', 'Wheelchair Access', 'International Patients Unit'],
  },
  {
    id: 'h-002',
    name: 'United Hospital Limited',
    nameBn: 'ইউনাইটেড হাসপাতাল লিমিটেড',
    slug: 'united-hospital',
    type: 'Private',
    description: `United Hospital Limited is a 500-bed tertiary care hospital in Gulshan, Dhaka. It offers comprehensive healthcare services with internationally trained specialists and cutting-edge equipment.`,
    phone: '10666',
    email: 'info@uhlbd.com',
    website: 'https://www.uhlbd.com',
    address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
    addressBn: 'প্লট ১৫, রোড ৭১, গুলশান-২, ঢাকা-১২১২',
    area: 'Gulshan',
    district: 'Dhaka',
    latitude: 23.7936,
    longitude: 90.4148,
    isEmergency: true,
    emergencyPhone: '10666',
    bedCount: 500,
    establishedYear: 2006,
    isVerified: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 1876,
    amenities: ['ICU', 'Oncology Centre', 'Pharmacy', 'Free WiFi', 'Ambulance', 'Parking', 'ATM'],
  },
];

// ============================================================
// DEPARTMENTS  (per hospital)
// ============================================================

export const DEPARTMENTS: Department[] = [
  // Square Hospital
  { id: 'dep-sq-cardio',   hospitalId: 'h-001', name: 'Cardiology',              nameBn: 'হৃদরোগ বিভাগ',           icon: '❤️',  doctorCount: 4, headDoctor: 'Prof. Aminul Islam',    phone: '10616-101', description: 'Complete cardiac care — diagnostics, interventional cardiology, heart failure management, and cardiac surgery.' },
  { id: 'dep-sq-neuro',    hospitalId: 'h-001', name: 'Neurology',               nameBn: 'নিউরোলজি বিভাগ',         icon: '🧠',  doctorCount: 3, headDoctor: 'Prof. Abul Kalam Azad', phone: '10616-102', description: 'Diagnosis and treatment of stroke, epilepsy, Parkinson\'s disease, and other neurological conditions.' },
  { id: 'dep-sq-ortho',    hospitalId: 'h-001', name: 'Orthopedics',             nameBn: 'অর্থোপেডিক্স বিভাগ',    icon: '🦴',  doctorCount: 3, headDoctor: 'Prof. Mahmudur Rahman', phone: '10616-103', description: 'Joint replacement, spine surgery, sports injuries, trauma, and musculoskeletal disorders.' },
  { id: 'dep-sq-peds',     hospitalId: 'h-001', name: 'Pediatrics',              nameBn: 'শিশু বিভাগ',              icon: '👶',  doctorCount: 2, headDoctor: 'Dr. Abdul Rashid',      phone: '10616-104', description: 'Comprehensive child healthcare from newborns to adolescents, including NICU and paediatric surgery.' },
  { id: 'dep-sq-gynae',    hospitalId: 'h-001', name: 'Gynecology & Obstetrics', nameBn: 'গাইনি ও প্রসূতি বিভাগ', icon: '🤱',  doctorCount: 3, headDoctor: 'Dr. Nasrin Akter',      phone: '10616-105', description: 'Antenatal care, high-risk pregnancy, laparoscopic surgery, and comprehensive women\'s health.' },
  { id: 'dep-sq-endo',     hospitalId: 'h-001', name: 'Endocrinology',           nameBn: 'হরমোন ও ডায়াবেটিস',     icon: '🩸',  doctorCount: 2, headDoctor: 'Dr. Roksana Begum',     phone: '10616-106', description: 'Diabetes management, thyroid disorders, hormonal imbalances, and metabolic diseases.' },
  { id: 'dep-sq-derm',     hospitalId: 'h-001', name: 'Dermatology',             nameBn: 'চর্মরোগ বিভাগ',          icon: '🧴',  doctorCount: 2, headDoctor: 'Dr. Zahirul Hossain',   phone: '10616-107', description: 'Skin diseases, cosmetic dermatology, laser treatments, and venereology.' },
  { id: 'dep-sq-eye',      hospitalId: 'h-001', name: 'Ophthalmology',           nameBn: 'চক্ষু বিভাগ',            icon: '👁️', doctorCount: 2, headDoctor: 'Dr. Shirina Sultana',   phone: '10616-108', description: 'Cataract surgery, glaucoma management, retinal diseases, and refractive surgery.' },
  { id: 'dep-sq-onco',     hospitalId: 'h-001', name: 'Oncology',                nameBn: 'ক্যান্সার বিভাগ',        icon: '🎗️', doctorCount: 2, phone: '10616-109', description: 'Cancer diagnosis, chemotherapy, immunotherapy, and palliative care.' },
  { id: 'dep-sq-gastro',   hospitalId: 'h-001', name: 'Gastroenterology',        nameBn: 'গ্যাস্ট্রো বিভাগ',       icon: '🫁',  doctorCount: 2, phone: '10616-110', description: 'Digestive system diseases, endoscopy, liver disease, and hepatobiliary conditions.' },
  { id: 'dep-sq-emergency',hospitalId: 'h-001', name: 'Emergency',               nameBn: 'ইমার্জেন্সি বিভাগ',     icon: '🚨',  doctorCount: 6, phone: '10616',      description: '24/7 emergency trauma care, resuscitation, and critical care.' },
  { id: 'dep-sq-psych',    hospitalId: 'h-001', name: 'Psychiatry',              nameBn: 'মনোরোগ বিভাগ',          icon: '🧩',  doctorCount: 2, phone: '10616-112', description: 'Mental health assessment, therapy, psychopharmacology, and substance use disorders.' },

  // United Hospital
  { id: 'dep-uh-cardio',   hospitalId: 'h-002', name: 'Cardiology',              nameBn: 'হৃদরোগ বিভাগ',          icon: '❤️',  doctorCount: 3, phone: '10666-101', description: 'Advanced cardiac diagnostics and interventional procedures.' },
  { id: 'dep-uh-onco',     hospitalId: 'h-002', name: 'Oncology',                nameBn: 'ক্যান্সার বিভাগ',       icon: '🎗️', doctorCount: 4, phone: '10666-102', description: 'Comprehensive cancer treatment including chemotherapy, radiotherapy, and bone marrow transplant.' },
  { id: 'dep-uh-nephro',   hospitalId: 'h-002', name: 'Nephrology',              nameBn: 'কিডনি বিভাগ',           icon: '🫘',  doctorCount: 2, phone: '10666-103', description: 'Kidney disease management, dialysis, and transplant coordination.' },
];

// ============================================================
// DOCTORS  (with multi-hospital chambers)
// ============================================================

export const DOCTORS: Doctor[] = [
  // ── CARDIOLOGY ──
  {
    id: 'doc-001',
    name: 'Dr. Aminul Islam',
    nameBn: 'ডাঃ আমিনুল ইসলাম',
    title: 'Prof.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=aminul&backgroundColor=b6e3f4',
    gender: 'MALE',
    specialtyName: 'Cardiologist',
    departmentId: 'dep-sq-cardio',
    qualifications: ['MBBS (DMC)', 'MD Cardiology (BSMMU)', 'FRCP (UK)'],
    experience: 18,
    rating: 4.9,
    reviewCount: 312,
    bmdcNumber: 'A-12345',
    isVerified: true,
    isFeatured: true,
    slug: 'dr-aminul-islam',
    about: 'Professor Dr. Aminul Islam is a renowned interventional cardiologist with 18 years of experience specialising in coronary artery disease, heart failure, and complex PCI procedures.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-001',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1500,
        schedules: [
          { day: 'SAT', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
          { day: 'MON', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
          { day: 'WED', startTime: '16:00', endTime: '20:00', slotDurationMins: 15 },
        ],
      },
      {
        id: 'ch-001b',
        hospitalId: 'h-002',
        hospitalName: 'United Hospital Ltd.',
        address: 'Gulshan-2, Dhaka',
        fee: 1800,
        schedules: [
          { day: 'SUN', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
          { day: 'TUE', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
        ],
      },
    ],
  },
  {
    id: 'doc-002',
    name: 'Dr. Rafiqul Hasan',
    nameBn: 'ডাঃ রফিকুল হাসান',
    title: 'Assoc. Prof.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rafiq&backgroundColor=c0aede',
    gender: 'MALE',
    specialtyName: 'Cardiologist',
    departmentId: 'dep-sq-cardio',
    qualifications: ['MBBS (CMMC)', 'MD Cardiology (BSMMU)', 'FCPS'],
    experience: 14,
    rating: 4.7,
    reviewCount: 198,
    bmdcNumber: 'A-22345',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-rafiqul-hasan',
    about: 'Specialises in echocardiography, valvular heart disease, and preventive cardiology with 14 years of clinical practice.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-002',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1200,
        schedules: [
          { day: 'SUN', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
          { day: 'TUE', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
          { day: 'THU', startTime: '15:00', endTime: '19:00', slotDurationMins: 15 },
        ],
      },
    ],
  },

  // ── NEUROLOGY ──
  {
    id: 'doc-003',
    name: 'Dr. Abul Kalam Azad',
    nameBn: 'ডাঃ আবুল কালাম আজাদ',
    title: 'Prof.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=azad&backgroundColor=d1f5d3',
    gender: 'MALE',
    specialtyName: 'Neurologist',
    departmentId: 'dep-sq-neuro',
    qualifications: ['MBBS (DMC)', 'MD Neurology (BSMMU)', 'MRCP (UK)'],
    experience: 25,
    rating: 4.9,
    reviewCount: 445,
    bmdcNumber: 'A-67890',
    isVerified: true,
    isFeatured: true,
    slug: 'dr-abul-kalam-azad',
    about: "One of Bangladesh's most senior neurologists, specialising in stroke, epilepsy, Parkinson's disease, and movement disorders.",
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-003',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 2500,
        schedules: [
          { day: 'SAT', startTime: '15:00', endTime: '19:00', slotDurationMins: 20 },
          { day: 'WED', startTime: '10:00', endTime: '14:00', slotDurationMins: 20 },
        ],
      },
    ],
  },
  {
    id: 'doc-004',
    name: 'Dr. Marium Chowdhury',
    nameBn: 'ডাঃ মেরিয়াম চৌধুরী',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=marium&backgroundColor=ffd5b8',
    gender: 'FEMALE',
    specialtyName: 'Neurologist',
    departmentId: 'dep-sq-neuro',
    qualifications: ['MBBS (SMMC)', 'FCPS Neurology', 'Dip. Stroke Medicine (UK)'],
    experience: 11,
    rating: 4.6,
    reviewCount: 167,
    bmdcNumber: 'B-34521',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-marium-chowdhury',
    about: 'Specialises in stroke rehabilitation, dementia, headache disorders, and paediatric neurology.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-004',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1000,
        schedules: [
          { day: 'MON', startTime: '14:00', endTime: '18:00', slotDurationMins: 15 },
          { day: 'THU', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
        ],
      },
    ],
  },

  // ── ORTHOPEDICS ──
  {
    id: 'doc-005',
    name: 'Dr. Mahmudur Rahman',
    nameBn: 'ডাঃ মাহমুদুর রহমান',
    title: 'Prof.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=mahmud&backgroundColor=b6e3f4',
    gender: 'MALE',
    specialtyName: 'Orthopedic Surgeon',
    departmentId: 'dep-sq-ortho',
    qualifications: ['MBBS (DMC)', 'MS Orthopedics (BSMMU)', 'FRCS (UK)'],
    experience: 20,
    rating: 4.8,
    reviewCount: 389,
    bmdcNumber: 'A-45678',
    isVerified: true,
    isFeatured: true,
    slug: 'dr-mahmudur-rahman',
    about: 'Leading orthopedic surgeon specialising in joint replacement (hip & knee), spine disorders, and sports injuries.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-005',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 2000,
        schedules: [
          { day: 'SAT', startTime: '09:00', endTime: '13:00', slotDurationMins: 20 },
          { day: 'TUE', startTime: '15:00', endTime: '19:00', slotDurationMins: 20 },
          { day: 'THU', startTime: '09:00', endTime: '13:00', slotDurationMins: 20 },
        ],
      },
    ],
  },

  // ── PEDIATRICS ──
  {
    id: 'doc-006',
    name: 'Dr. Abdul Rashid',
    nameBn: 'ডাঃ আব্দুল রশিদ',
    title: 'Assoc. Prof.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rashid&backgroundColor=d1f5d3',
    gender: 'MALE',
    specialtyName: 'Pediatrician',
    departmentId: 'dep-sq-peds',
    qualifications: ['MBBS (RMC)', 'DCH (BCPS)', 'FCPS Pediatrics'],
    experience: 22,
    rating: 4.8,
    reviewCount: 521,
    bmdcNumber: 'A-34567',
    isVerified: true,
    isFeatured: true,
    slug: 'dr-abdul-rashid',
    about: 'Paediatric specialist with 22 years of experience treating children from newborns to adolescents. Expertise in neonatal care and childhood infections.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-006',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1000,
        schedules: [
          { day: 'SUN', startTime: '10:00', endTime: '14:00', slotDurationMins: 10 },
          { day: 'MON', startTime: '10:00', endTime: '14:00', slotDurationMins: 10 },
          { day: 'WED', startTime: '10:00', endTime: '14:00', slotDurationMins: 10 },
          { day: 'SAT', startTime: '16:00', endTime: '20:00', slotDurationMins: 10 },
        ],
      },
    ],
  },

  // ── GYNECOLOGY ──
  {
    id: 'doc-007',
    name: 'Dr. Nasrin Akter',
    nameBn: 'ডাঃ নাসরিন আক্তার',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=nasrin&backgroundColor=ffd5b8',
    gender: 'FEMALE',
    specialtyName: 'Gynecologist & Obstetrician',
    departmentId: 'dep-sq-gynae',
    qualifications: ['MBBS (CMC)', 'FCPS Gynecology', 'MS (BSMMU)'],
    experience: 15,
    rating: 4.9,
    reviewCount: 634,
    bmdcNumber: 'A-23456',
    isVerified: true,
    isFeatured: true,
    slug: 'dr-nasrin-akter',
    about: 'Highly experienced gynaecologist and obstetrician who has delivered over 5,000 babies. Specialises in high-risk pregnancy and laparoscopic surgery.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-007',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1200,
        schedules: [
          { day: 'SAT', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
          { day: 'MON', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
          { day: 'WED', startTime: '15:00', endTime: '19:00', slotDurationMins: 15 },
          { day: 'THU', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
        ],
      },
    ],
  },
  {
    id: 'doc-008',
    name: 'Dr. Kohinur Begum',
    nameBn: 'ডাঃ কোহিনূর বেগম',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=kohinur&backgroundColor=c0aede',
    gender: 'FEMALE',
    specialtyName: 'Gynecologist',
    departmentId: 'dep-sq-gynae',
    qualifications: ['MBBS (SMMC)', 'FCPS Gynecology'],
    experience: 10,
    rating: 4.6,
    reviewCount: 211,
    bmdcNumber: 'B-55432',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-kohinur-begum',
    about: 'Specialises in infertility management, endoscopic surgery, and menstrual disorders.',
    languages: ['Bengali'],
    chambers: [
      {
        id: 'ch-008',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 800,
        schedules: [
          { day: 'SUN', startTime: '15:00', endTime: '19:00', slotDurationMins: 15 },
          { day: 'TUE', startTime: '15:00', endTime: '19:00', slotDurationMins: 15 },
        ],
      },
    ],
  },

  // ── ENDOCRINOLOGY ──
  {
    id: 'doc-009',
    name: 'Dr. Roksana Begum',
    nameBn: 'ডাঃ রোকসানা বেগম',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=roksana&backgroundColor=ffd5b8',
    gender: 'FEMALE',
    specialtyName: 'Endocrinologist',
    departmentId: 'dep-sq-endo',
    qualifications: ['MBBS (MMC)', 'MD Endocrinology (BSMMU)'],
    experience: 14,
    rating: 4.7,
    reviewCount: 278,
    bmdcNumber: 'A-78901',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-roksana-begum',
    about: 'Specialises in diabetes, thyroid disorders, obesity management, and hormonal imbalances with 14 years of clinical experience.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-009',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 1200,
        schedules: [
          { day: 'SUN', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
          { day: 'WED', startTime: '09:00', endTime: '13:00', slotDurationMins: 15 },
          { day: 'FRI', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
        ],
      },
    ],
  },

  // ── DERMATOLOGY ──
  {
    id: 'doc-010',
    name: 'Dr. Zahirul Hossain',
    nameBn: 'ডাঃ জাহিরুল হোসেন',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=zahir&backgroundColor=b6e3f4',
    gender: 'MALE',
    specialtyName: 'Dermatologist',
    departmentId: 'dep-sq-derm',
    qualifications: ['MBBS (DMC)', 'DDV (BCPS)', 'FCPS Dermatology'],
    experience: 16,
    rating: 4.7,
    reviewCount: 334,
    bmdcNumber: 'A-89012',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-zahirul-hossain',
    about: 'Dermatologist and venereologist specialising in chronic skin diseases, cosmetic dermatology, and laser treatments.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-010',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 900,
        schedules: [
          { day: 'MON', startTime: '16:00', endTime: '20:00', slotDurationMins: 15 },
          { day: 'THU', startTime: '16:00', endTime: '20:00', slotDurationMins: 15 },
          { day: 'SAT', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
        ],
      },
    ],
  },

  // ── OPHTHALMOLOGY ──
  {
    id: 'doc-011',
    name: 'Dr. Shirina Sultana',
    nameBn: 'ডাঃ শিরিনা সুলতানা',
    title: 'Dr.',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=shirina&backgroundColor=c0aede',
    gender: 'FEMALE',
    specialtyName: 'Ophthalmologist',
    departmentId: 'dep-sq-eye',
    qualifications: ['MBBS (SSMC)', 'DO (BCPS)', 'FCPS Ophthalmology'],
    experience: 12,
    rating: 4.8,
    reviewCount: 267,
    bmdcNumber: 'A-56789',
    isVerified: true,
    isFeatured: false,
    slug: 'dr-shirina-sultana',
    about: 'Eye specialist with expertise in cataract surgery, glaucoma management, retinal diseases, and refractive surgery including LASIK.',
    languages: ['Bengali', 'English'],
    chambers: [
      {
        id: 'ch-011',
        hospitalId: 'h-001',
        hospitalName: 'Square Hospital Ltd.',
        address: '18/F, Panthapath, Dhaka',
        fee: 800,
        schedules: [
          { day: 'SUN', startTime: '14:00', endTime: '18:00', slotDurationMins: 15 },
          { day: 'TUE', startTime: '10:00', endTime: '14:00', slotDurationMins: 15 },
          { day: 'SAT', startTime: '14:00', endTime: '18:00', slotDurationMins: 15 },
        ],
      },
    ],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Get all departments for a hospital */
export function getDepartmentsByHospital(hospitalId: string): Department[] {
  return DEPARTMENTS.filter((d) => d.hospitalId === hospitalId);
}

/** Get all doctors in a department at a specific hospital */
export function getDoctorsByDepartment(departmentId: string): Doctor[] {
  return DOCTORS.filter((d) => d.departmentId === departmentId);
}

/** Get a doctor's chamber at a specific hospital */
export function getDoctorChamberAtHospital(doctor: Doctor, hospitalId: string): DoctorChamber | undefined {
  return doctor.chambers.find((c) => c.hospitalId === hospitalId);
}

/** Get a hospital by slug */
export function getHospitalBySlug(slug: string): Hospital | undefined {
  return HOSPITALS.find((h) => h.slug === slug);
}

/** Get a department by id */
export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.id === id);
}

/** Generate time slot strings for a schedule on a specific date */
export function generateSlots(schedule: ChamberSchedule): string[] {
  const slots: string[] = [];
  const [sh, sm] = schedule.startTime.split(':').map(Number);
  const [eh, em] = schedule.endTime.split(':').map(Number);
  let current = sh * 60 + sm;
  const end = eh * 60 + em;
  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    current += schedule.slotDurationMins;
  }
  return slots;
}

/** Format slot time to 12-hour */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/** Get schedule days label */
export function formatScheduleDays(schedules: ChamberSchedule[]): string {
  const dayOrder: DayOfWeek[] = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
  return sorted.map((s) => s.day).join(', ');
}

export const DAY_FULL: Record<DayOfWeek, string> = {
  SAT: 'Saturday', SUN: 'Sunday', MON: 'Monday',
  TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday',
};