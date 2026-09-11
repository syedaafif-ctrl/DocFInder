// ============================================================
// DocHub BD — App Constants
// ============================================================

export const APP_NAME = 'DocHub BD';
export const APP_TAGLINE = "Bangladesh's Premier Doctor Discovery Platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dochubbd.com';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ─── Navigation ───────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Find Doctors', href: '/doctors' },
  { label: 'Hospitals', href: '/hospitals' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Health Blog', href: '/blog' },
] as const;

// ─── Specialties (with emoji icons) ──────────────────────
export const SPECIALTIES = [
  { id: 'cardiology',      name: 'Cardiology',             nameBn: 'হৃদরোগ বিশেষজ্ঞ',     slug: 'cardiology',      icon: '🫀', count: 340 },
  { id: 'neurology',       name: 'Neurology',              nameBn: 'নিউরোলজি',               slug: 'neurology',       icon: '🧠', count: 210 },
  { id: 'gynecology',      name: 'Gynecology',             nameBn: 'গাইনি বিশেষজ্ঞ',        slug: 'gynecology',      icon: '🤱', count: 280 },
  { id: 'pediatrics',      name: 'Pediatrics',             nameBn: 'শিশু বিশেষজ্ঞ',          slug: 'pediatrics',      icon: '👶', count: 420 },
  { id: 'orthopedics',     name: 'Orthopedics',            nameBn: 'হাড় বিশেষজ্ঞ',           slug: 'orthopedics',     icon: '🦴', count: 190 },
  { id: 'dermatology',     name: 'Dermatology',            nameBn: 'চর্মরোগ বিশেষজ্ঞ',       slug: 'dermatology',     icon: '🩺', count: 175 },
  { id: 'ophthalmology',   name: 'Ophthalmology',          nameBn: 'চক্ষু বিশেষজ্ঞ',          slug: 'ophthalmology',   icon: '👁️', count: 160 },
  { id: 'dentistry',       name: 'Dentistry',              nameBn: 'দন্ত বিশেষজ্ঞ',            slug: 'dentistry',       icon: '🦷', count: 310 },
  { id: 'psychiatry',      name: 'Psychiatry',             nameBn: 'মনোরোগ বিশেষজ্ঞ',        slug: 'psychiatry',      icon: '💬', count: 130 },
  { id: 'endocrinology',   name: 'Endocrinology',          nameBn: 'হরমোন বিশেষজ্ঞ',         slug: 'endocrinology',   icon: '⚗️',  count: 140 },
  { id: 'gastroenterology',name: 'Gastroenterology',       nameBn: 'গ্যাস্ট্রোএন্টারোলজি',  slug: 'gastroenterology',icon: '🫁', count: 120 },
  { id: 'nephrology',      name: 'Nephrology',             nameBn: 'কিডনি বিশেষজ্ঞ',          slug: 'nephrology',      icon: '🫘', count: 110 },
  { id: 'pulmonology',     name: 'Pulmonology',            nameBn: 'বক্ষব্যাধি বিশেষজ্ঞ',    slug: 'pulmonology',     icon: '🫧', count: 100 },
  { id: 'general-surgery', name: 'General Surgery',        nameBn: 'সাধারণ সার্জারি',         slug: 'general-surgery', icon: '🏥', count: 250 },
  { id: 'urology',         name: 'Urology',                nameBn: 'ইউরোলজি',                slug: 'urology',         icon: '💊', count: 95  },
  { id: 'oncology',        name: 'Oncology',               nameBn: 'ক্যান্সার বিশেষজ্ঞ',     slug: 'oncology',        icon: '🔬', count: 85  },
] as const;

// ─── Districts ─────────────────────────────────────────────
export const DISTRICTS = [
  { id: 'dhaka',       name: 'Dhaka',       nameBn: 'ঢাকা',        slug: 'dhaka'       },
  { id: 'chittagong',  name: 'Chittagong',  nameBn: 'চট্টগ্রাম',   slug: 'chittagong'  },
  { id: 'sylhet',      name: 'Sylhet',      nameBn: 'সিলেট',       slug: 'sylhet'      },
  { id: 'rajshahi',    name: 'Rajshahi',    nameBn: 'রাজশাহী',     slug: 'rajshahi'    },
  { id: 'khulna',      name: 'Khulna',      nameBn: 'খুলনা',       slug: 'khulna'      },
  { id: 'barisal',     name: 'Barisal',     nameBn: 'বরিশাল',      slug: 'barisal'     },
  { id: 'rangpur',     name: 'Rangpur',     nameBn: 'রংপুর',       slug: 'rangpur'     },
  { id: 'mymensingh',  name: 'Mymensingh',  nameBn: 'ময়মনসিংহ',   slug: 'mymensingh'  },
  { id: 'comilla',     name: 'Comilla',     nameBn: 'কুমিল্লা',    slug: 'comilla'     },
  { id: 'gazipur',     name: 'Gazipur',     nameBn: 'গাজীপুর',     slug: 'gazipur'     },
  { id: 'narayanganj', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ',  slug: 'narayanganj' },
  { id: 'bogra',       name: 'Bogra',       nameBn: 'বগুড়া',       slug: 'bogra'       },
] as const;

// ─── Sort options ──────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Best Match'      },
  { value: 'rating',      label: 'Highest Rated'   },
  { value: 'experience',  label: 'Most Experienced' },
  { value: 'fee_low',     label: 'Fee: Low to High' },
  { value: 'fee_high',    label: 'Fee: High to Low' },
  { value: 'popular',     label: 'Most Popular'     },
  { value: 'newest',      label: 'Newly Added'      },
] as const;

// ─── Gender options ────────────────────────────────────────
export const GENDER_OPTIONS = [
  { value: '',       label: 'Any Gender' },
  { value: 'MALE',   label: 'Male Doctors' },
  { value: 'FEMALE', label: 'Female Doctors' },
] as const;

// ─── Fee ranges ────────────────────────────────────────────
export const FEE_RANGES = [
  { label: 'Any fee',        min: 0,    max: undefined },
  { label: 'Under ৳500',     min: 0,    max: 500       },
  { label: '৳500 – ৳1,000',  min: 500,  max: 1000      },
  { label: '৳1,000 – ৳2,000',min: 1000, max: 2000      },
  { label: 'Above ৳2,000',   min: 2000, max: undefined },
] as const;

// ─── Platform stats ────────────────────────────────────────
export const PLATFORM_STATS = [
  { value: '12,400+', label: 'Verified Doctors'  },
  { value: '850+',    label: 'Partner Hospitals' },
  { value: '9.8L+',   label: 'Patients Helped'  },
  { value: '64',      label: 'Districts Covered' },
] as const;