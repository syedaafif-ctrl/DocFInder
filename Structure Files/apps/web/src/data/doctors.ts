// apps/web/src/data/doctors.ts
// DocFinder BD — Static & Fake Data
// Compatible with: HeroSection.tsx, DoctorCard.tsx, page.tsx
// All exports are fully typed against @/types

import type {
  Doctor,
  StaticSpecialty,
  StaticDistrict,
  StaticStat,
  District,
  Area,
} from '@/types';

// ============================================================
// SHARED BASE TIMESTAMPS  (keeps fake data DRY)
// ============================================================

const TS = '2024-01-01T00:00:00Z';
const TS_U = '2024-06-01T00:00:00Z';
const TS_A = '2024-01-15T00:00:00Z';

// ============================================================
// SPECIALTIES
// Used by: HeroSection (quick-specialty grid), search filters
// Shape:  { id, name, nameBn, slug, icon }
// ============================================================

export const SPECIALTIES: StaticSpecialty[] = [
  { id: 'sp-001', name: 'Cardiology',              nameBn: 'হৃদরোগ বিশেষজ্ঞ',         slug: 'cardiology',        icon: '❤️'  },
  { id: 'sp-002', name: 'Neurology',               nameBn: 'নিউরোলজি',               slug: 'neurology',         icon: '🧠'  },
  { id: 'sp-003', name: 'Gastroenterology',        nameBn: 'গ্যাস্ট্রোএন্টারোলজি',   slug: 'gastroenterology',  icon: '🫁'  },
  { id: 'sp-004', name: 'Endocrinology',           nameBn: 'হরমোন বিশেষজ্ঞ',         slug: 'endocrinology',     icon: '⚗️'  },
  { id: 'sp-005', name: 'Pulmonology',             nameBn: 'বক্ষব্যাধি বিশেষজ্ঞ',    slug: 'pulmonology',       icon: '🫀'  },
  { id: 'sp-006', name: 'Nephrology',              nameBn: 'কিডনি বিশেষজ্ঞ',         slug: 'nephrology',        icon: '🫘'  },
  { id: 'sp-007', name: 'Dermatology',             nameBn: 'চর্মরোগ বিশেষজ্ঞ',       slug: 'dermatology',       icon: '🩺'  },
  { id: 'sp-008', name: 'Rheumatology',            nameBn: 'বাতরোগ বিশেষজ্ঞ',        slug: 'rheumatology',      icon: '🦴'  },
  { id: 'sp-009', name: 'General Surgery',         nameBn: 'সাধারণ সার্জারি',        slug: 'general-surgery',   icon: '🔬'  },
  { id: 'sp-010', name: 'Orthopedics',             nameBn: 'হাড় বিশেষজ্ঞ',          slug: 'orthopedics',       icon: '🦿'  },
  { id: 'sp-011', name: 'Neurosurgery',            nameBn: 'নিউরোসার্জারি',          slug: 'neurosurgery',      icon: '🧬'  },
  { id: 'sp-012', name: 'Urology',                 nameBn: 'ইউরোলজি',               slug: 'urology',           icon: '💧'  },
  { id: 'sp-013', name: 'Pediatrics',              nameBn: 'শিশু বিশেষজ্ঞ',         slug: 'pediatrics',        icon: '👶'  },
  { id: 'sp-014', name: 'Neonatology',             nameBn: 'নবজাতক বিশেষজ্ঞ',        slug: 'neonatology',       icon: '🍼'  },
  { id: 'sp-015', name: 'Gynecology & Obstetrics', nameBn: 'গাইনি বিশেষজ্ঞ',         slug: 'gynecology',        icon: '🤱'  },
  { id: 'sp-016', name: 'Ophthalmology',           nameBn: 'চক্ষু বিশেষজ্ঞ',         slug: 'ophthalmology',     icon: '👁️' },
  { id: 'sp-017', name: 'Dentistry',               nameBn: 'দন্ত বিশেষজ্ঞ',         slug: 'dentistry',         icon: '🦷'  },
  { id: 'sp-018', name: 'Psychiatry',              nameBn: 'মনোরোগ বিশেষজ্ঞ',        slug: 'psychiatry',        icon: '💬'  },
  { id: 'sp-019', name: 'ENT',                     nameBn: 'নাক কান গলা বিশেষজ্ঞ',  slug: 'ent',               icon: '👂'  },
  { id: 'sp-020', name: 'Oncology',                nameBn: 'ক্যান্সার বিশেষজ্ঞ',     slug: 'oncology',          icon: '🎗️' },
  { id: 'sp-021', name: 'Hematology',              nameBn: 'রক্তরোগ বিশেষজ্ঞ',       slug: 'hematology',        icon: '🩸'  },
  { id: 'sp-022', name: 'Physiotherapy',           nameBn: 'ফিজিওথেরাপি',            slug: 'physiotherapy',     icon: '🏋️' },
];

// ============================================================
// DISTRICTS
// Used by: HeroSection district dropdown (needs id, name, slug)
// Full 64 Bangladesh districts
// ============================================================

export const DISTRICTS: StaticDistrict[] = [
  // Dhaka Division
  { id: 'dst-001', name: 'Dhaka',         nameBn: 'ঢাকা',         slug: 'dhaka-district'         },
  { id: 'dst-002', name: 'Gazipur',       nameBn: 'গাজীপুর',      slug: 'gazipur'       },
  { id: 'dst-003', name: 'Narayanganj',   nameBn: 'নারায়ণগঞ্জ',  slug: 'narayanganj'   },
  { id: 'dst-004', name: 'Narsingdi',     nameBn: 'নরসিংদী',      slug: 'narsingdi'     },
  { id: 'dst-005', name: 'Manikganj',     nameBn: 'মানিকগঞ্জ',    slug: 'manikganj'     },
  { id: 'dst-006', name: 'Munshiganj',    nameBn: 'মুন্সিগঞ্জ',   slug: 'munshiganj'    },
  { id: 'dst-007', name: 'Rajbari',       nameBn: 'রাজবাড়ী',     slug: 'rajbari'       },
  { id: 'dst-008', name: 'Madaripur',     nameBn: 'মাদারীপুর',    slug: 'madaripur'     },
  { id: 'dst-009', name: 'Shariatpur',    nameBn: 'শরীয়তপুর',    slug: 'shariatpur'    },
  { id: 'dst-010', name: 'Gopalganj',     nameBn: 'গোপালগঞ্জ',    slug: 'gopalganj'     },
  { id: 'dst-011', name: 'Faridpur',      nameBn: 'ফরিদপুর',      slug: 'faridpur'      },
  { id: 'dst-012', name: 'Kishoreganj',   nameBn: 'কিশোরগঞ্জ',    slug: 'kishoreganj'   },
  { id: 'dst-013', name: 'Tangail',       nameBn: 'টাঙ্গাইল',     slug: 'tangail'       },
  // Chittagong Division
  { id: 'dst-014', name: 'Chittagong',    nameBn: 'চট্টগ্রাম',    slug: 'chittagong-district'    },
  { id: 'dst-015', name: "Cox's Bazar",   nameBn: 'কক্সবাজার',    slug: 'coxs-bazar'    },
  { id: 'dst-016', name: 'Rangamati',     nameBn: 'রাঙামাটি',     slug: 'rangamati'     },
  { id: 'dst-017', name: 'Bandarban',     nameBn: 'বান্দরবান',    slug: 'bandarban'     },
  { id: 'dst-018', name: 'Khagrachhari',  nameBn: 'খাগড়াছড়ি',  slug: 'khagrachhari'  },
  { id: 'dst-019', name: 'Feni',          nameBn: 'ফেনী',         slug: 'feni'          },
  { id: 'dst-020', name: 'Comilla',       nameBn: 'কুমিল্লা',     slug: 'comilla'       },
  { id: 'dst-021', name: 'Brahmanbaria',  nameBn: 'ব্রাহ্মণবাড়িয়া', slug: 'brahmanbaria' },
  { id: 'dst-022', name: 'Chandpur',      nameBn: 'চাঁদপুর',      slug: 'chandpur'      },
  { id: 'dst-023', name: 'Lakshmipur',    nameBn: 'লক্ষ্মীপুর',   slug: 'lakshmipur'    },
  { id: 'dst-024', name: 'Noakhali',      nameBn: 'নোয়াখালী',     slug: 'noakhali'      },
  // Sylhet Division
  { id: 'dst-025', name: 'Sylhet',        nameBn: 'সিলেট',        slug: 'sylhet'        },
  { id: 'dst-026', name: 'Moulvibazar',   nameBn: 'মৌলভীবাজার',   slug: 'moulvibazar'   },
  { id: 'dst-027', name: 'Habiganj',      nameBn: 'হবিগঞ্জ',      slug: 'habiganj'      },
  { id: 'dst-028', name: 'Sunamganj',     nameBn: 'সুনামগঞ্জ',    slug: 'sunamganj'     },
  // Rajshahi Division
  { id: 'dst-029', name: 'Rajshahi',      nameBn: 'রাজশাহী',      slug: 'rajshahi'      },
  { id: 'dst-030', name: 'Natore',        nameBn: 'নাটোর',        slug: 'natore'        },
  { id: 'dst-031', name: 'Naogaon',       nameBn: 'নওগাঁ',        slug: 'naogaon'       },
  { id: 'dst-032', name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', slug: 'chapainawabganj' },
  { id: 'dst-033', name: 'Bogura',        nameBn: 'বগুড়া',        slug: 'bogura'        },
  { id: 'dst-034', name: 'Joypurhat',     nameBn: 'জয়পুরহাট',    slug: 'joypurhat'     },
  { id: 'dst-035', name: 'Sirajganj',     nameBn: 'সিরাজগঞ্জ',    slug: 'sirajganj'     },
  { id: 'dst-036', name: 'Pabna',         nameBn: 'পাবনা',        slug: 'pabna'         },
  // Khulna Division
  { id: 'dst-037', name: 'Khulna',        nameBn: 'খুলনা',        slug: 'khulna'        },
  { id: 'dst-038', name: 'Bagerhat',      nameBn: 'বাগেরহাট',     slug: 'bagerhat'      },
  { id: 'dst-039', name: 'Satkhira',      nameBn: 'সাতক্ষীরা',    slug: 'satkhira'      },
  { id: 'dst-040', name: 'Jessore',       nameBn: 'যশোর',         slug: 'jessore'       },
  { id: 'dst-041', name: 'Narail',        nameBn: 'নড়াইল',       slug: 'narail'        },
  { id: 'dst-042', name: 'Magura',        nameBn: 'মাগুরা',       slug: 'magura'        },
  { id: 'dst-043', name: 'Jhenaidah',     nameBn: 'ঝিনাইদহ',      slug: 'jhenaidah'     },
  { id: 'dst-044', name: 'Kushtia',       nameBn: 'কুষ্টিয়া',    slug: 'kushtia'       },
  { id: 'dst-045', name: 'Chuadanga',     nameBn: 'চুয়াডাঙ্গা',  slug: 'chuadanga'     },
  { id: 'dst-046', name: 'Meherpur',      nameBn: 'মেহেরপুর',     slug: 'meherpur'      },
  // Barisal Division
  { id: 'dst-047', name: 'Barisal',       nameBn: 'বরিশাল',       slug: 'barisal'       },
  { id: 'dst-048', name: 'Bhola',         nameBn: 'ভোলা',         slug: 'bhola'         },
  { id: 'dst-049', name: 'Patuakhali',    nameBn: 'পটুয়াখালী',   slug: 'patuakhali'    },
  { id: 'dst-050', name: 'Pirojpur',      nameBn: 'পিরোজপুর',     slug: 'pirojpur'      },
  { id: 'dst-051', name: 'Jhalokati',     nameBn: 'ঝালকাঠি',     slug: 'jhalokati'     },
  { id: 'dst-052', name: 'Barguna',       nameBn: 'বরগুনা',       slug: 'barguna'       },
  // Rangpur Division
  { id: 'dst-053', name: 'Rangpur',       nameBn: 'রংপুর',        slug: 'rangpur'       },
  { id: 'dst-054', name: 'Dinajpur',      nameBn: 'দিনাজপুর',     slug: 'dinajpur'      },
  { id: 'dst-055', name: 'Kurigram',      nameBn: 'কুড়িগ্রাম',   slug: 'kurigram'      },
  { id: 'dst-056', name: 'Gaibandha',     nameBn: 'গাইবান্ধা',    slug: 'gaibandha'     },
  { id: 'dst-057', name: 'Nilphamari',    nameBn: 'নীলফামারী',    slug: 'nilphamari'    },
  { id: 'dst-058', name: 'Lalmonirhat',   nameBn: 'লালমনিরহাট',   slug: 'lalmonirhat'   },
  { id: 'dst-059', name: 'Thakurgaon',    nameBn: 'ঠাকুরগাঁও',   slug: 'thakurgaon'    },
  { id: 'dst-060', name: 'Panchagarh',    nameBn: 'পঞ্চগড়',      slug: 'panchagarh'    },
  // Mymensingh Division
  { id: 'dst-061', name: 'Mymensingh',    nameBn: 'ময়মনসিংহ',    slug: 'mymensingh'    },
  { id: 'dst-062', name: 'Jamalpur',      nameBn: 'জামালপুর',     slug: 'jamalpur'      },
  { id: 'dst-063', name: 'Sherpur',       nameBn: 'শেরপুর',       slug: 'sherpur'       },
  { id: 'dst-064', name: 'Netrokona',     nameBn: 'নেত্রকোণা',    slug: 'netrokona'     },
];

// ============================================================
// STATS
// Used by: page.tsx, any stats display
// ============================================================

export const STATS: StaticStat[] = [
  { label: 'Verified Doctors',  value: '12,400+' },
  { label: 'Hospitals',         value: '850+'    },
  { label: 'Patients Helped',   value: '9.8L+'   },
  { label: 'Districts Covered', value: '64'      },
];

// ============================================================
// SHARED LOCATION HELPERS
// (reused across fakeDoctors to avoid duplication)
// ============================================================

const DHAKA_DISTRICT: District = {
  id: 'd-001',
  name: 'Dhaka',
  nameBn: 'ঢাকা',
  slug: 'dhaka-district',
  divisionId: 'div-001',
  createdAt: TS,
  updatedAt: TS,
};

const CHITTAGONG_DISTRICT: District = {
  id: 'd-002',
  name: 'Chittagong',
  nameBn: 'চট্টগ্রাম',
  slug: 'chittagong-district',
  divisionId: 'div-002',
  createdAt: TS,
  updatedAt: TS,
};

const AREAS: Record<string, Area> = {
  dhanmondi: {
    id: 'area-001', name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi',
    upazillaId: 'u-001', latitude: 23.7461, longitude: 90.3742, createdAt: TS, updatedAt: TS,
  },
  gulshan: {
    id: 'area-002', name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan',
    upazillaId: 'u-001', latitude: 23.7808, longitude: 90.4146, createdAt: TS, updatedAt: TS,
  },
  mirpur: {
    id: 'area-003', name: 'Mirpur', nameBn: 'মিরপুর', slug: 'mirpur',
    upazillaId: 'u-001', latitude: 23.8223, longitude: 90.3654, createdAt: TS, updatedAt: TS,
  },
  uttara: {
    id: 'area-004', name: 'Uttara', nameBn: 'উত্তরা', slug: 'uttara',
    upazillaId: 'u-001', latitude: 23.8759, longitude: 90.3795, createdAt: TS, updatedAt: TS,
  },
  mohammadpur: {
    id: 'area-005', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর', slug: 'mohammadpur',
    upazillaId: 'u-001', latitude: 23.7635, longitude: 90.3594, createdAt: TS, updatedAt: TS,
  },
  banani: {
    id: 'area-006', name: 'Banani', nameBn: 'বনানী', slug: 'banani',
    upazillaId: 'u-001', latitude: 23.7938, longitude: 90.4033, createdAt: TS, updatedAt: TS,
  },
  bashundhara: {
    id: 'area-007', name: 'Bashundhara', nameBn: 'বসুন্ধরা', slug: 'bashundhara',
    upazillaId: 'u-001', latitude: 23.8108, longitude: 90.4261, createdAt: TS, updatedAt: TS,
  },
  farmgate: {
    id: 'area-008', name: 'Farmgate', nameBn: 'ফার্মগেট', slug: 'farmgate',
    upazillaId: 'u-001', latitude: 23.7582, longitude: 90.3903, createdAt: TS, updatedAt: TS,
  },
  ctg_nasirabad: {
    id: 'area-009', name: 'Nasirabad', nameBn: 'নাসিরাবাদ', slug: 'nasirabad',
    upazillaId: 'u-002', latitude: 22.3709, longitude: 91.8272, createdAt: TS, updatedAt: TS,
  },
};

// ============================================================
// FAKE DOCTORS ARRAY
// 8 realistic Bangladesh doctors — production-quality fake data
// ============================================================

export const fakeDoctors: Doctor[] = [
  // ──────────────────────────────────────────────────────────
  // 1. Prof. Aminul Islam — Cardiology (Featured, Sponsored)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-001',
    userId: 'usr-001',
    slug: 'dr-aminul-islam',
    name: 'Dr. Aminul Islam',
    nameBn: 'ডাঃ আমিনুল ইসলাম',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=aminul&backgroundColor=b6e3f4&clothingColor=3c4f5c',
    bmdcNumber: 'A-12345',
    bmdcVerified: true,
    about: 'Professor Dr. Aminul Islam is a renowned interventional cardiologist with 18 years of experience. He specializes in coronary artery disease, heart failure management, and cardiac catheterization. He has performed over 3,000 angioplasty procedures and is affiliated with Square Hospital and BSMMU.',
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
    metaTitle: 'Prof. Dr. Aminul Islam - Cardiologist in Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Prof. Dr. Aminul Islam, Cardiologist at Square Hospital Dhaka. 18 years experience. Fee: ৳1,500.',
    specialties: [
      {
        id: 'ds-001', doctorId: 'doc-001', specialtyId: 'sp-001', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-001', name: 'Cardiology', nameBn: 'হৃদরোগ বিশেষজ্ঞ', slug: 'cardiology', categoryId: 'cat-001', isFeatured: true, doctorCount: 340, sortOrder: 1, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-001', doctorId: 'doc-001', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 2000, sortOrder: 0, createdAt: TS },
      { id: 'q-002', doctorId: 'doc-001', degree: 'MD (Cardiology)', institution: 'BSMMU', country: 'Bangladesh', year: 2005, sortOrder: 1, createdAt: TS },
      { id: 'q-003', doctorId: 'doc-001', degree: 'FRCP', institution: 'Royal College of Physicians, London', country: 'UK', year: 2010, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-001', doctorId: 'doc-001',
        name: 'Square Hospital — Cardiology OPD',
        address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
        areaId: 'area-008', area: AREAS.farmgate,
        phone: '01711111111',
        latitude: 23.7543, longitude: 90.3901,
        googleMapsUrl: 'https://maps.google.com/?q=Square+Hospital+Dhaka',
        isMain: true,
        appointmentFee: 1500,
        schedules: [
          { id: 'sc-001-sat', chamberId: 'ch-001', day: 'SATURDAY',  startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-sun', chamberId: 'ch-001', day: 'SUNDAY',    startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-mon', chamberId: 'ch-001', day: 'MONDAY',    startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-tue', chamberId: 'ch-001', day: 'TUESDAY',   startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-wed', chamberId: 'ch-001', day: 'WEDNESDAY', startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-thu', chamberId: 'ch-001', day: 'THURSDAY',  startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-001-fri', chamberId: 'ch-001', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-001', doctorId: 'doc-001', hospitalId: 'hosp-001',
        hospital: { id: 'hosp-001', name: 'Square Hospital Ltd.', slug: 'square-hospital', logo: undefined, type: 'Private' },
        designation: 'Consultant Cardiologist', department: 'Cardiology',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: TS_A,
  },

  // ──────────────────────────────────────────────────────────
  // 2. Dr. Nasrin Akter — Gynecology & Obstetrics (Featured)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-002',
    userId: 'usr-002',
    slug: 'dr-nasrin-akter',
    name: 'Dr. Nasrin Akter',
    nameBn: 'ডাঃ নাসরিন আক্তার',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=nasrin&backgroundColor=ffd5dc&clothingColor=ff7eb3',
    bmdcNumber: 'A-23456',
    bmdcVerified: true,
    about: 'Dr. Nasrin Akter is a highly experienced gynecologist and obstetrician who has delivered over 5,000 babies and specializes in high-risk pregnancy management, laparoscopic gynecological surgery, and infertility treatment. She consults at Square Hospital and her own chamber in Dhanmondi.',
    experience: 15,
    consultationFee: 1200,
    followUpFee: 700,
    telemedicineFee: 900,
    phone: '01722222222',
    whatsapp: '01722222222',
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
    metaTitle: 'Dr. Nasrin Akter - Gynecologist in Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Dr. Nasrin Akter, Gynecologist in Dhanmondi, Dhaka. 15 years experience. Fee: ৳1,200.',
    specialties: [
      {
        id: 'ds-002', doctorId: 'doc-002', specialtyId: 'sp-015', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-015', name: 'Gynecology & Obstetrics', nameBn: 'গাইনি বিশেষজ্ঞ', slug: 'gynecology', categoryId: 'cat-004', isFeatured: true, doctorCount: 280, sortOrder: 1, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-004', doctorId: 'doc-002', degree: 'MBBS', institution: 'Chittagong Medical College', country: 'Bangladesh', year: 2003, sortOrder: 0, createdAt: TS },
      { id: 'q-005', doctorId: 'doc-002', degree: 'FCPS (Gynecology & Obs.)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2009, sortOrder: 1, createdAt: TS },
      { id: 'q-006', doctorId: 'doc-002', degree: 'MS (Gynecology)', institution: 'BSMMU', country: 'Bangladesh', year: 2012, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-002', doctorId: 'doc-002',
        name: "Dr. Nasrin's Women's Health Centre",
        address: 'House 12, Road 4/A, Dhanmondi, Dhaka-1205',
        areaId: 'area-001', area: AREAS.dhanmondi,
        phone: '01722222222',
        latitude: 23.7461, longitude: 90.3742,
        isMain: true,
        appointmentFee: 1200,
        schedules: [
          { id: 'sc-002-sat', chamberId: 'ch-002', day: 'SATURDAY',  startTime: '09:00', endTime: '13:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sc-002-sun', chamberId: 'ch-002', day: 'SUNDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-002-mon', chamberId: 'ch-002', day: 'MONDAY',    startTime: '09:00', endTime: '13:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sc-002-tue', chamberId: 'ch-002', day: 'TUESDAY',   startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-002-wed', chamberId: 'ch-002', day: 'WEDNESDAY', startTime: '09:00', endTime: '13:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sc-002-thu', chamberId: 'ch-002', day: 'THURSDAY',  startTime: '09:00', endTime: '13:00', slotDuration: 20, maxPatients: 15, isClosed: false },
          { id: 'sc-002-fri', chamberId: 'ch-002', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-002', doctorId: 'doc-002', hospitalId: 'hosp-001',
        hospital: { id: 'hosp-001', name: 'Square Hospital Ltd.', slug: 'square-hospital', logo: undefined, type: 'Private' },
        designation: 'Senior Consultant Gynecologist', department: 'Gynecology',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: TS_A,
  },

  // ──────────────────────────────────────────────────────────
  // 3. Assoc. Prof. Abdul Rashid — Pediatrics (Featured)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-003',
    userId: 'usr-003',
    slug: 'dr-abdul-rashid',
    name: 'Dr. Abdul Rashid',
    nameBn: 'ডাঃ আব্দুল রশিদ',
    title: 'Assoc. Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rashid&backgroundColor=c0aede&clothingColor=5d7a9e',
    bmdcNumber: 'A-34567',
    bmdcVerified: true,
    about: 'Associate Professor Dr. Abdul Rashid is a pediatric specialist with 22 years of experience treating children from newborns to adolescents. He subspecializes in neonatology, childhood asthma, and pediatric infectious diseases. He is associated with United Hospital, Gulshan.',
    experience: 22,
    consultationFee: 1000,
    followUpFee: 600,
    telemedicineFee: 700,
    phone: '01733333333',
    whatsapp: '01733333333',
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
    metaTitle: 'Assoc. Prof. Dr. Abdul Rashid - Pediatrician in Gulshan, Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Assoc. Prof. Dr. Abdul Rashid, Pediatrician at United Hospital Dhaka. 22 years experience. Fee: ৳1,000.',
    specialties: [
      {
        id: 'ds-003', doctorId: 'doc-003', specialtyId: 'sp-013', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-013', name: 'Pediatrics', nameBn: 'শিশু বিশেষজ্ঞ', slug: 'pediatrics', categoryId: 'cat-003', isFeatured: true, doctorCount: 420, sortOrder: 1, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-007', doctorId: 'doc-003', degree: 'MBBS', institution: 'Rajshahi Medical College', country: 'Bangladesh', year: 1998, sortOrder: 0, createdAt: TS },
      { id: 'q-008', doctorId: 'doc-003', degree: 'DCH', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2003, sortOrder: 1, createdAt: TS },
      { id: 'q-009', doctorId: 'doc-003', degree: 'FCPS (Pediatrics)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2007, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-003', doctorId: 'doc-003',
        name: 'United Hospital — Pediatrics OPD',
        address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
        areaId: 'area-002', area: AREAS.gulshan,
        phone: '10666',
        latitude: 23.7936, longitude: 90.4148,
        googleMapsUrl: 'https://maps.google.com/?q=United+Hospital+Dhaka',
        isMain: true,
        appointmentFee: 1000,
        schedules: [
          { id: 'sc-003-sat', chamberId: 'ch-003', day: 'SATURDAY',  startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sc-003-sun', chamberId: 'ch-003', day: 'SUNDAY',    startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sc-003-mon', chamberId: 'ch-003', day: 'MONDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-003-tue', chamberId: 'ch-003', day: 'TUESDAY',   startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sc-003-wed', chamberId: 'ch-003', day: 'WEDNESDAY', startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-003-thu', chamberId: 'ch-003', day: 'THURSDAY',  startTime: '10:00', endTime: '17:00', slotDuration: 15, maxPatients: 25, isClosed: false },
          { id: 'sc-003-fri', chamberId: 'ch-003', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-003', doctorId: 'doc-003', hospitalId: 'hosp-002',
        hospital: { id: 'hosp-002', name: 'United Hospital Limited', slug: 'united-hospital', logo: undefined, type: 'Private' },
        designation: 'Associate Professor & Consultant', department: 'Pediatrics',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: TS_A,
  },

  // ──────────────────────────────────────────────────────────
  // 4. Prof. Mahmudur Rahman — Orthopedics (Featured, Sponsored)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-004',
    userId: 'usr-004',
    slug: 'dr-mahmudur-rahman',
    name: 'Dr. Mahmudur Rahman',
    nameBn: 'ডাঃ মাহমুদুর রহমান',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=mahmud&backgroundColor=d1f4d0&clothingColor=2e7d32',
    bmdcNumber: 'A-45678',
    bmdcVerified: true,
    about: 'Professor Dr. Mahmudur Rahman is a leading orthopedic surgeon specializing in joint replacement surgery (hip & knee), sports injuries, and complex spine disorders. He has 20 years of experience and has performed over 2,500 joint replacement surgeries. He is affiliated with Evercare Hospital Dhaka.',
    experience: 20,
    consultationFee: 2000,
    followUpFee: 1000,
    telemedicineFee: 1500,
    phone: '01744444444',
    whatsapp: '01744444444',
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
    metaTitle: 'Prof. Dr. Mahmudur Rahman - Orthopedic Surgeon in Bashundhara, Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Prof. Dr. Mahmudur Rahman, Orthopedic Surgeon at Evercare Hospital Dhaka. 20 years experience. Fee: ৳2,000.',
    specialties: [
      {
        id: 'ds-004', doctorId: 'doc-004', specialtyId: 'sp-010', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-010', name: 'Orthopedics', nameBn: 'হাড় বিশেষজ্ঞ', slug: 'orthopedics', categoryId: 'cat-002', isFeatured: true, doctorCount: 190, sortOrder: 2, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-010', doctorId: 'doc-004', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 1999, sortOrder: 0, createdAt: TS },
      { id: 'q-011', doctorId: 'doc-004', degree: 'MS (Orthopedics)', institution: 'BSMMU', country: 'Bangladesh', year: 2005, sortOrder: 1, createdAt: TS },
      { id: 'q-012', doctorId: 'doc-004', degree: 'FRCS (Orthopedics)', institution: 'Royal College of Surgeons, Edinburgh', country: 'UK', year: 2010, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-004', doctorId: 'doc-004',
        name: 'Evercare Hospital — Orthopedics OPD',
        address: 'Plot 81, Block E, Bashundhara R/A, Dhaka-1229',
        areaId: 'area-007', area: AREAS.bashundhara,
        phone: '10678',
        latitude: 23.8145, longitude: 90.4267,
        googleMapsUrl: 'https://maps.google.com/?q=Evercare+Hospital+Dhaka',
        isMain: true,
        appointmentFee: 2000,
        schedules: [
          { id: 'sc-004-sat', chamberId: 'ch-004', day: 'SATURDAY',  startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sc-004-sun', chamberId: 'ch-004', day: 'SUNDAY',    startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sc-004-mon', chamberId: 'ch-004', day: 'MONDAY',    startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sc-004-tue', chamberId: 'ch-004', day: 'TUESDAY',   startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-004-wed', chamberId: 'ch-004', day: 'WEDNESDAY', startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sc-004-thu', chamberId: 'ch-004', day: 'THURSDAY',  startTime: '09:00', endTime: '14:00', slotDuration: 20, maxPatients: 18, isClosed: false },
          { id: 'sc-004-fri', chamberId: 'ch-004', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-004', doctorId: 'doc-004', hospitalId: 'hosp-003',
        hospital: { id: 'hosp-003', name: 'Evercare Hospital Dhaka', slug: 'evercare-hospital', logo: undefined, type: 'Private' },
        designation: 'Head of Orthopedics', department: 'Orthopedics & Trauma',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: TS_A,
  },

  // ──────────────────────────────────────────────────────────
  // 5. Dr. Shirina Sultana — Ophthalmology
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-005',
    userId: 'usr-005',
    slug: 'dr-shirina-sultana',
    name: 'Dr. Shirina Sultana',
    nameBn: 'ডাঃ শিরিনা সুলতানা',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=shirina&backgroundColor=fde68a&clothingColor=d97706',
    bmdcNumber: 'A-56789',
    bmdcVerified: true,
    about: 'Dr. Shirina Sultana is an ophthalmologist with 12 years of expertise in phacoemulsification cataract surgery, glaucoma management, retinal diseases, and laser vision correction (LASIK). She practices at Square Hospital and her private eye clinic in Mohammadpur.',
    experience: 12,
    consultationFee: 800,
    followUpFee: 500,
    telemedicineFee: 600,
    phone: '01755555555',
    whatsapp: '01755555555',
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
    metaTitle: 'Dr. Shirina Sultana - Eye Specialist in Mohammadpur, Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Dr. Shirina Sultana, Ophthalmologist in Mohammadpur, Dhaka. 12 years experience. Fee: ৳800.',
    specialties: [
      {
        id: 'ds-005', doctorId: 'doc-005', specialtyId: 'sp-016', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-016', name: 'Ophthalmology', nameBn: 'চক্ষু বিশেষজ্ঞ', slug: 'ophthalmology', categoryId: 'cat-006', isFeatured: true, doctorCount: 160, sortOrder: 1, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-013', doctorId: 'doc-005', degree: 'MBBS', institution: 'Sir Salimullah Medical College', country: 'Bangladesh', year: 2006, sortOrder: 0, createdAt: TS },
      { id: 'q-014', doctorId: 'doc-005', degree: 'DO', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2011, sortOrder: 1, createdAt: TS },
      { id: 'q-015', doctorId: 'doc-005', degree: 'FCPS (Ophthalmology)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2015, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-005', doctorId: 'doc-005',
        name: "Dr. Shirina's Eye Care Clinic",
        address: 'House 22, Road 9, Mohammadpur, Dhaka-1207',
        areaId: 'area-005', area: AREAS.mohammadpur,
        phone: '01755555555',
        latitude: 23.7635, longitude: 90.3594,
        isMain: true,
        appointmentFee: 800,
        schedules: [
          { id: 'sc-005-sat', chamberId: 'ch-005', day: 'SATURDAY',  startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-005-sun', chamberId: 'ch-005', day: 'SUNDAY',    startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-005-mon', chamberId: 'ch-005', day: 'MONDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-005-tue', chamberId: 'ch-005', day: 'TUESDAY',   startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-005-wed', chamberId: 'ch-005', day: 'WEDNESDAY', startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-005-thu', chamberId: 'ch-005', day: 'THURSDAY',  startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-005-fri', chamberId: 'ch-005', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-005', doctorId: 'doc-005', hospitalId: 'hosp-001',
        hospital: { id: 'hosp-001', name: 'Square Hospital Ltd.', slug: 'square-hospital', logo: undefined, type: 'Private' },
        designation: 'Consultant Ophthalmologist', department: 'Ophthalmology',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: '2024-01-20T00:00:00Z',
  },

  // ──────────────────────────────────────────────────────────
  // 6. Prof. Abul Kalam Azad — Neurology (Featured, Sponsored)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-006',
    userId: 'usr-006',
    slug: 'dr-abul-kalam-azad',
    name: 'Dr. Abul Kalam Azad',
    nameBn: 'ডাঃ আবুল কালাম আজাদ',
    title: 'Prof.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=azad&backgroundColor=dbeafe&clothingColor=1d4ed8',
    bmdcNumber: 'A-67890',
    bmdcVerified: true,
    about: "Professor Dr. Abul Kalam Azad is one of Bangladesh's most prominent neurologists with 25 years of clinical experience. He specializes in stroke management, refractory epilepsy, Parkinson's disease, multiple sclerosis, and neuromuscular disorders. He consults at United Hospital and BSMMU.",
    experience: 25,
    consultationFee: 2500,
    followUpFee: 1200,
    telemedicineFee: 1800,
    phone: '01766666666',
    whatsapp: '01766666666',
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
    metaTitle: 'Prof. Dr. Abul Kalam Azad - Neurologist in Gulshan, Dhaka | DocFinder BD',
    metaDescription: 'Book appointment with Prof. Dr. Abul Kalam Azad, Neurologist at United Hospital Dhaka. 25 years experience. Fee: ৳2,500.',
    specialties: [
      {
        id: 'ds-006', doctorId: 'doc-006', specialtyId: 'sp-002', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-002', name: 'Neurology', nameBn: 'নিউরোলজি', slug: 'neurology', categoryId: 'cat-001', isFeatured: true, doctorCount: 210, sortOrder: 2, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-016', doctorId: 'doc-006', degree: 'MBBS', institution: 'Dhaka Medical College', country: 'Bangladesh', year: 1996, sortOrder: 0, createdAt: TS },
      { id: 'q-017', doctorId: 'doc-006', degree: 'MD (Neurology)', institution: 'BSMMU', country: 'Bangladesh', year: 2002, sortOrder: 1, createdAt: TS },
      { id: 'q-018', doctorId: 'doc-006', degree: 'MRCP (Neurology)', institution: 'Royal College of Physicians, UK', country: 'UK', year: 2007, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-006', doctorId: 'doc-006',
        name: 'United Hospital — Neurology OPD',
        address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
        areaId: 'area-002', area: AREAS.gulshan,
        phone: '10666',
        latitude: 23.7936, longitude: 90.4148,
        isMain: true,
        appointmentFee: 2500,
        schedules: [
          { id: 'sc-006-sat', chamberId: 'ch-006', day: 'SATURDAY',  startTime: '11:00', endTime: '15:00', slotDuration: 20, maxPatients: 12, isClosed: false },
          { id: 'sc-006-sun', chamberId: 'ch-006', day: 'SUNDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-006-mon', chamberId: 'ch-006', day: 'MONDAY',    startTime: '11:00', endTime: '15:00', slotDuration: 20, maxPatients: 12, isClosed: false },
          { id: 'sc-006-tue', chamberId: 'ch-006', day: 'TUESDAY',   startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-006-wed', chamberId: 'ch-006', day: 'WEDNESDAY', startTime: '11:00', endTime: '15:00', slotDuration: 20, maxPatients: 12, isClosed: false },
          { id: 'sc-006-thu', chamberId: 'ch-006', day: 'THURSDAY',  startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
          { id: 'sc-006-fri', chamberId: 'ch-006', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 20, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-006', doctorId: 'doc-006', hospitalId: 'hosp-002',
        hospital: { id: 'hosp-002', name: 'United Hospital Limited', slug: 'united-hospital', logo: undefined, type: 'Private' },
        designation: 'Professor & Head of Neurology', department: 'Neurology',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: TS_A,
  },

  // ──────────────────────────────────────────────────────────
  // 7. Dr. Roksana Begum — Endocrinology (Diabetes & Hormones)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-007',
    userId: 'usr-007',
    slug: 'dr-roksana-begum',
    name: 'Dr. Roksana Begum',
    nameBn: 'ডাঃ রোকসানা বেগম',
    title: 'Dr.',
    gender: 'FEMALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=roksana&backgroundColor=ede9fe&clothingColor=7c3aed',
    bmdcNumber: 'A-78901',
    bmdcVerified: true,
    about: 'Dr. Roksana Begum is an endocrinologist and diabetologist with 14 years of clinical experience. She specializes in Type 1 & Type 2 diabetes management, thyroid nodules and cancer, PCOS, adrenal disorders, and pituitary diseases. She practices at Dhanmondi and consults at Square Hospital.',
    experience: 14,
    consultationFee: 1200,
    followUpFee: 700,
    telemedicineFee: 900,
    phone: '01777777777',
    whatsapp: '01777777777',
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
    metaTitle: 'Dr. Roksana Begum - Diabetes & Hormone Specialist in Dhanmondi | DocFinder BD',
    metaDescription: 'Book appointment with Dr. Roksana Begum, Endocrinologist in Dhanmondi, Dhaka. 14 years experience. Fee: ৳1,200.',
    specialties: [
      {
        id: 'ds-007', doctorId: 'doc-007', specialtyId: 'sp-004', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-004', name: 'Endocrinology', nameBn: 'হরমোন বিশেষজ্ঞ', slug: 'endocrinology', categoryId: 'cat-001', isFeatured: false, doctorCount: 140, sortOrder: 4, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-019', doctorId: 'doc-007', degree: 'MBBS', institution: 'Mymensingh Medical College', country: 'Bangladesh', year: 2005, sortOrder: 0, createdAt: TS },
      { id: 'q-020', doctorId: 'doc-007', degree: 'MD (Endocrinology)', institution: 'BSMMU', country: 'Bangladesh', year: 2012, sortOrder: 1, createdAt: TS },
      { id: 'q-021', doctorId: 'doc-007', degree: 'CCD (Diabetes)', institution: 'Research Society for Study of Diabetes in India', country: 'India', year: 2014, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-007', doctorId: 'doc-007',
        name: "Dr. Roksana's Diabetes & Hormone Care",
        address: 'House 5/A, Road 2, Dhanmondi, Dhaka-1205',
        areaId: 'area-001', area: AREAS.dhanmondi,
        phone: '01777777777',
        latitude: 23.7461, longitude: 90.3742,
        isMain: true,
        appointmentFee: 1200,
        schedules: [
          { id: 'sc-007-sat', chamberId: 'ch-007', day: 'SATURDAY',  startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-007-sun', chamberId: 'ch-007', day: 'SUNDAY',    startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-007-mon', chamberId: 'ch-007', day: 'MONDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-007-tue', chamberId: 'ch-007', day: 'TUESDAY',   startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-007-wed', chamberId: 'ch-007', day: 'WEDNESDAY', startTime: '10:00', endTime: '14:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-007-thu', chamberId: 'ch-007', day: 'THURSDAY',  startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-007-fri', chamberId: 'ch-007', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-007', doctorId: 'doc-007', hospitalId: 'hosp-001',
        hospital: { id: 'hosp-001', name: 'Square Hospital Ltd.', slug: 'square-hospital', logo: undefined, type: 'Private' },
        designation: 'Consultant Endocrinologist', department: 'Medicine & Endocrinology',
        isActive: true, createdAt: TS,
      },
    ],
    district: DHAKA_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: '2024-01-22T00:00:00Z',
  },

  // ──────────────────────────────────────────────────────────
  // 8. Dr. Zahirul Hossain — Dermatology (Chittagong)
  // ──────────────────────────────────────────────────────────
  {
    id: 'doc-008',
    userId: 'usr-008',
    slug: 'dr-zahirul-hossain',
    name: 'Dr. Zahirul Hossain',
    nameBn: 'ডাঃ জাহিরুল হোসেন',
    title: 'Dr.',
    gender: 'MALE',
    photo: 'https://api.dicebear.com/8.x/avataaars/svg?seed=zahir&backgroundColor=d1fae5&clothingColor=065f46',
    bmdcNumber: 'A-89012',
    bmdcVerified: true,
    about: 'Dr. Zahirul Hossain is a dermatologist and venereologist based in Chittagong with 16 years of experience. He specializes in acne management, psoriasis, eczema, vitiligo, hair loss disorders, and cosmetic dermatology including PRP therapy, chemical peels, and laser treatments.',
    experience: 16,
    consultationFee: 900,
    followUpFee: 500,
    telemedicineFee: 700,
    phone: '01788888888',
    whatsapp: '01788888888',
    languages: ['bn', 'en'],
    isAvailableOnline: true,
    isFeatured: false,
    isVerified: true,
    rating: 4.5,
    reviewCount: 76,
    totalAppointments: 1900,
    profileViews: 7200,
    searchAppearances: 3800,
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    metaTitle: 'Dr. Zahirul Hossain - Dermatologist in Chittagong | DocFinder BD',
    metaDescription: 'Book appointment with Dr. Zahirul Hossain, Dermatologist in Nasirabad, Chittagong. 16 years experience. Fee: ৳900.',
    specialties: [
      {
        id: 'ds-008', doctorId: 'doc-008', specialtyId: 'sp-007', isPrimary: true, createdAt: TS,
        specialty: { id: 'sp-007', name: 'Dermatology', nameBn: 'চর্মরোগ বিশেষজ্ঞ', slug: 'dermatology', categoryId: 'cat-001', isFeatured: true, doctorCount: 175, sortOrder: 7, createdAt: TS, updatedAt: TS },
      },
    ],
    qualifications: [
      { id: 'q-022', doctorId: 'doc-008', degree: 'MBBS', institution: 'Chittagong Medical College', country: 'Bangladesh', year: 2003, sortOrder: 0, createdAt: TS },
      { id: 'q-023', doctorId: 'doc-008', degree: 'DDV', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2008, sortOrder: 1, createdAt: TS },
      { id: 'q-024', doctorId: 'doc-008', degree: 'FCPS (Dermatology)', institution: 'BCPS Bangladesh', country: 'Bangladesh', year: 2012, sortOrder: 2, createdAt: TS },
    ],
    chambers: [
      {
        id: 'ch-008', doctorId: 'doc-008',
        name: "Dr. Zahir's Skin & Aesthetic Centre",
        address: '45 Zakir Hossain Road, Nasirabad, Chittagong-4209',
        areaId: 'area-009', area: AREAS.ctg_nasirabad,
        phone: '01788888888',
        latitude: 22.3709, longitude: 91.8272,
        isMain: true,
        appointmentFee: 900,
        schedules: [
          { id: 'sc-008-sat', chamberId: 'ch-008', day: 'SATURDAY',  startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-008-sun', chamberId: 'ch-008', day: 'SUNDAY',    startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-008-mon', chamberId: 'ch-008', day: 'MONDAY',    startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-008-tue', chamberId: 'ch-008', day: 'TUESDAY',   startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
          { id: 'sc-008-wed', chamberId: 'ch-008', day: 'WEDNESDAY', startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-008-thu', chamberId: 'ch-008', day: 'THURSDAY',  startTime: '10:00', endTime: '15:00', slotDuration: 15, maxPatients: 20, isClosed: false },
          { id: 'sc-008-fri', chamberId: 'ch-008', day: 'FRIDAY',    startTime: '00:00', endTime: '00:00', slotDuration: 15, maxPatients: 0,  isClosed: true  },
        ],
        createdAt: TS, updatedAt: TS,
      },
    ],
    hospitals: [
      {
        id: 'dh-008', doctorId: 'doc-008', hospitalId: 'hosp-004',
        hospital: { id: 'hosp-004', name: 'Chittagong Medical College Hospital', slug: 'cmch', logo: undefined, type: 'Government' },
        designation: 'Associate Consultant Dermatologist', department: 'Dermatology & Venereology',
        isActive: true, createdAt: TS,
      },
    ],
    district: CHITTAGONG_DISTRICT,
    createdAt: TS, updatedAt: TS_U, approvedAt: '2024-01-25T00:00:00Z',
  },
];

// ============================================================
// DERIVED CONVENIENCE EXPORTS
// ============================================================

/** Featured doctors only (isFeatured === true) */
export const featuredDoctors: Doctor[] = fakeDoctors.filter((d) => d.isFeatured);

/** Sponsored doctors (have a sponsoredRank), sorted by rank */
export const sponsoredDoctors: Doctor[] = fakeDoctors
  .filter((d) => d.sponsoredRank != null)
  .sort((a, b) => (a.sponsoredRank ?? 99) - (b.sponsoredRank ?? 99));

/** Lookup map for O(1) doctor access by id */
export const doctorById: Record<string, Doctor> = Object.fromEntries(
  fakeDoctors.map((d) => [d.id, d])
);

/** Lookup map for O(1) doctor access by slug */
export const doctorBySlug: Record<string, Doctor> = Object.fromEntries(
  fakeDoctors.map((d) => [d.slug, d])
);