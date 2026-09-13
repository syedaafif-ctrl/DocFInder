// packages/db/prisma/seed.ts
// Complete Bangladesh healthcare seed data

import { PrismaClient, Gender, DoctorStatus, VerificationStatus, SubscriptionPlan, SubscriptionStatus, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Swastha BD database...');

  // ============================================================
  // DIVISIONS
  // ============================================================
  const divisions = await Promise.all([
    prisma.division.upsert({
      where: { slug: 'dhaka' },
      update: {},
      create: { name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka' },
    }),
    prisma.division.upsert({
      where: { slug: 'chittagong' },
      update: {},
      create: { name: 'Chittagong', nameBn: 'চট্টগ্রাম', slug: 'chittagong' },
    }),
    prisma.division.upsert({
      where: { slug: 'sylhet' },
      update: {},
      create: { name: 'Sylhet', nameBn: 'সিলেট', slug: 'sylhet' },
    }),
    prisma.division.upsert({
      where: { slug: 'rajshahi' },
      update: {},
      create: { name: 'Rajshahi', nameBn: 'রাজশাহী', slug: 'rajshahi' },
    }),
    prisma.division.upsert({
      where: { slug: 'khulna' },
      update: {},
      create: { name: 'Khulna', nameBn: 'খুলনা', slug: 'khulna' },
    }),
    prisma.division.upsert({
      where: { slug: 'barisal' },
      update: {},
      create: { name: 'Barisal', nameBn: 'বরিশাল', slug: 'barisal' },
    }),
    prisma.division.upsert({
      where: { slug: 'rangpur' },
      update: {},
      create: { name: 'Rangpur', nameBn: 'রংপুর', slug: 'rangpur' },
    }),
    prisma.division.upsert({
      where: { slug: 'mymensingh' },
      update: {},
      create: { name: 'Mymensingh', nameBn: 'ময়মনসিংহ', slug: 'mymensingh' },
    }),
  ]);

  console.log('✅ Divisions seeded');

  // ============================================================
  // DISTRICTS
  // ============================================================
  const dhakaDistrict = await prisma.district.upsert({
    where: { slug: 'dhaka-district' },
    update: {},
    create: {
      name: 'Dhaka',
      nameBn: 'ঢাকা',
      slug: 'dhaka-district',
      divisionId: divisions[0].id,
    },
  });

  const chittagongDistrict = await prisma.district.upsert({
    where: { slug: 'chittagong-district' },
    update: {},
    create: {
      name: 'Chittagong',
      nameBn: 'চট্টগ্রাম',
      slug: 'chittagong-district',
      divisionId: divisions[1].id,
    },
  });

  const sylhetDistrict = await prisma.district.upsert({
    where: { slug: 'sylhet-district' },
    update: {},
    create: {
      name: 'Sylhet',
      nameBn: 'সিলেট',
      slug: 'sylhet-district',
      divisionId: divisions[2].id,
    },
  });

  const rajshahiDistrict = await prisma.district.upsert({
    where: { slug: 'rajshahi-district' },
    update: {},
    create: {
      name: 'Rajshahi',
      nameBn: 'রাজশাহী',
      slug: 'rajshahi-district',
      divisionId: divisions[3].id,
    },
  });

  console.log('✅ Districts seeded');

  // ============================================================
  // UPAZILLAS
  // ============================================================
  const dhakaCity = await prisma.upazilla.upsert({
    where: { slug: 'dhaka-city' },
    update: {},
    create: {
      name: 'Dhaka City',
      nameBn: 'ঢাকা সিটি',
      slug: 'dhaka-city',
      districtId: dhakaDistrict.id,
    },
  });

  const chittagongCity = await prisma.upazilla.upsert({
    where: { slug: 'chittagong-city' },
    update: {},
    create: {
      name: 'Chittagong City',
      nameBn: 'চট্টগ্রাম সিটি',
      slug: 'chittagong-city',
      districtId: chittagongDistrict.id,
    },
  });

  console.log('✅ Upazillas seeded');

  // ============================================================
  // AREAS
  // ============================================================
  const areas = await Promise.all([
    prisma.area.upsert({
      where: { slug: 'dhanmondi' },
      update: {},
      create: { name: 'Dhanmondi', nameBn: 'ধানমন্ডি', slug: 'dhanmondi', upazillaId: dhakaCity.id, latitude: 23.7461, longitude: 90.3742 },
    }),
    prisma.area.upsert({
      where: { slug: 'gulshan' },
      update: {},
      create: { name: 'Gulshan', nameBn: 'গুলশান', slug: 'gulshan', upazillaId: dhakaCity.id, latitude: 23.7808, longitude: 90.4146 },
    }),
    prisma.area.upsert({
      where: { slug: 'mirpur' },
      update: {},
      create: { name: 'Mirpur', nameBn: 'মিরপুর', slug: 'mirpur', upazillaId: dhakaCity.id, latitude: 23.8223, longitude: 90.3654 },
    }),
    prisma.area.upsert({
      where: { slug: 'uttara' },
      update: {},
      create: { name: 'Uttara', nameBn: 'উত্তরা', slug: 'uttara', upazillaId: dhakaCity.id, latitude: 23.8759, longitude: 90.3795 },
    }),
    prisma.area.upsert({
      where: { slug: 'mohammadpur' },
      update: {},
      create: { name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর', slug: 'mohammadpur', upazillaId: dhakaCity.id, latitude: 23.7635, longitude: 90.3594 },
    }),
    prisma.area.upsert({
      where: { slug: 'banani' },
      update: {},
      create: { name: 'Banani', nameBn: 'বনানী', slug: 'banani', upazillaId: dhakaCity.id, latitude: 23.7938, longitude: 90.4033 },
    }),
    prisma.area.upsert({
      where: { slug: 'bashundhara' },
      update: {},
      create: { name: 'Bashundhara', nameBn: 'বসুন্ধরা', slug: 'bashundhara', upazillaId: dhakaCity.id, latitude: 23.8108, longitude: 90.4261 },
    }),
    prisma.area.upsert({
      where: { slug: 'farmgate' },
      update: {},
      create: { name: 'Farmgate', nameBn: 'ফার্মগেট', slug: 'farmgate', upazillaId: dhakaCity.id, latitude: 23.7582, longitude: 90.3903 },
    }),
    // NEW: Rupnagar, Mirpur-2 (for Ibn Sina Mirpur)
    prisma.area.upsert({
      where: { slug: 'rupnagar-mirpur' },
      update: {},
      create: { name: 'Rupnagar, Mirpur-2', nameBn: 'রূপনগর, মিরপুর-২', slug: 'rupnagar-mirpur', upazillaId: dhakaCity.id, latitude: 23.8067, longitude: 90.3601 },
    }),
    // NEW: Panchlaish, Chittagong (for Ibn Sina Chattogram)
    prisma.area.upsert({
      where: { slug: 'panchlaish-chittagong' },
      update: {},
      create: { name: 'Panchlaish', nameBn: 'পাঁচলাইশ', slug: 'panchlaish-chittagong', upazillaId: chittagongCity.id, latitude: 22.3650, longitude: 91.8120 },
    }),
  ]);

  // Aliases for clarity
  const rupnagarArea = areas[8];      // Rupnagar, Mirpur-2
  const panchlaishArea = areas[9];    // Panchlaish, Chittagong

  console.log('✅ Areas seeded');

  // ============================================================
  // SPECIALTY CATEGORIES
  // ============================================================
  const categories = await Promise.all([
    prisma.specialtyCategory.upsert({
      where: { slug: 'medicine' },
      update: {},
      create: { name: 'Medicine', nameBn: 'মেডিসিন', slug: 'medicine', icon: '🩺', sortOrder: 1 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'surgery' },
      update: {},
      create: { name: 'Surgery', nameBn: 'সার্জারি', slug: 'surgery', icon: '🏥', sortOrder: 2 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'child-health' },
      update: {},
      create: { name: 'Child Health', nameBn: 'শিশু স্বাস্থ্য', slug: 'child-health', icon: '👶', sortOrder: 3 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'womens-health' },
      update: {},
      create: { name: "Women's Health", nameBn: 'নারী স্বাস্থ্য', slug: 'womens-health', icon: '👩', sortOrder: 4 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'dental' },
      update: {},
      create: { name: 'Dental', nameBn: 'দাঁতের চিকিৎসা', slug: 'dental', icon: '🦷', sortOrder: 5 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'eye' },
      update: {},
      create: { name: 'Eye', nameBn: 'চোখের চিকিৎসা', slug: 'eye', icon: '👁️', sortOrder: 6 },
    }),
    prisma.specialtyCategory.upsert({
      where: { slug: 'mental-health' },
      update: {},
      create: { name: 'Mental Health', nameBn: 'মানসিক স্বাস্থ্য', slug: 'mental-health', icon: '🧠', sortOrder: 7 },
    }),
    // NEW category for heart/diabetes crossover
    prisma.specialtyCategory.upsert({
      where: { slug: 'cardiology-category' },
      update: {},
      create: { name: 'Cardiology', nameBn: 'হৃদরোগ', slug: 'cardiology-category', icon: '❤️', sortOrder: 8 },
    }),
  ]);

  // ============================================================
  // SPECIALTIES
  // ============================================================
  const specialties = await Promise.all([
    // Medicine
    prisma.specialty.upsert({ where: { slug: 'cardiology' }, update: {}, create: { name: 'Cardiology', nameBn: 'হৃদরোগ বিশেষজ্ঞ', slug: 'cardiology', categoryId: categories[0].id, isFeatured: true, sortOrder: 1 } }),
    prisma.specialty.upsert({ where: { slug: 'neurology' }, update: {}, create: { name: 'Neurology', nameBn: 'নিউরোলজি', slug: 'neurology', categoryId: categories[0].id, isFeatured: true, sortOrder: 2 } }),
    prisma.specialty.upsert({ where: { slug: 'gastroenterology' }, update: {}, create: { name: 'Gastroenterology', nameBn: 'গ্যাস্ট্রোএন্টারোলজি', slug: 'gastroenterology', categoryId: categories[0].id, sortOrder: 3 } }),
    prisma.specialty.upsert({ where: { slug: 'endocrinology' }, update: {}, create: { name: 'Endocrinology', nameBn: 'হরমোন বিশেষজ্ঞ', slug: 'endocrinology', categoryId: categories[0].id, sortOrder: 4 } }),
    prisma.specialty.upsert({ where: { slug: 'pulmonology' }, update: {}, create: { name: 'Pulmonology', nameBn: 'বক্ষব্যাধি বিশেষজ্ঞ', slug: 'pulmonology', categoryId: categories[0].id, sortOrder: 5 } }),
    prisma.specialty.upsert({ where: { slug: 'nephrology' }, update: {}, create: { name: 'Nephrology', nameBn: 'কিডনি বিশেষজ্ঞ', slug: 'nephrology', categoryId: categories[0].id, sortOrder: 6 } }),
    prisma.specialty.upsert({ where: { slug: 'dermatology' }, update: {}, create: { name: 'Dermatology', nameBn: 'চর্মরোগ বিশেষজ্ঞ', slug: 'dermatology', categoryId: categories[0].id, isFeatured: true, sortOrder: 7 } }),
    prisma.specialty.upsert({ where: { slug: 'rheumatology' }, update: {}, create: { name: 'Rheumatology', nameBn: 'বাতরোগ বিশেষজ্ঞ', slug: 'rheumatology', categoryId: categories[0].id, sortOrder: 8 } }),
    // Surgery
    prisma.specialty.upsert({ where: { slug: 'general-surgery' }, update: {}, create: { name: 'General Surgery', nameBn: 'সাধারণ সার্জারি', slug: 'general-surgery', categoryId: categories[1].id, isFeatured: true, sortOrder: 1 } }),
    prisma.specialty.upsert({ where: { slug: 'orthopedics' }, update: {}, create: { name: 'Orthopedics', nameBn: 'হাড় বিশেষজ্ঞ', slug: 'orthopedics', categoryId: categories[1].id, isFeatured: true, sortOrder: 2 } }),
    prisma.specialty.upsert({ where: { slug: 'neurosurgery' }, update: {}, create: { name: 'Neurosurgery', nameBn: 'নিউরোসার্জারি', slug: 'neurosurgery', categoryId: categories[1].id, sortOrder: 3 } }),
    prisma.specialty.upsert({ where: { slug: 'urology' }, update: {}, create: { name: 'Urology', nameBn: 'ইউরোলজি', slug: 'urology', categoryId: categories[1].id, sortOrder: 4 } }),
    // Children
    prisma.specialty.upsert({ where: { slug: 'pediatrics' }, update: {}, create: { name: 'Pediatrics', nameBn: 'শিশু বিশেষজ্ঞ', slug: 'pediatrics', categoryId: categories[2].id, isFeatured: true, sortOrder: 1 } }),
    prisma.specialty.upsert({ where: { slug: 'neonatology' }, update: {}, create: { name: 'Neonatology', nameBn: 'নবজাতক বিশেষজ্ঞ', slug: 'neonatology', categoryId: categories[2].id, sortOrder: 2 } }),
    // Women
    prisma.specialty.upsert({ where: { slug: 'gynecology' }, update: {}, create: { name: 'Gynecology & Obstetrics', nameBn: 'গাইনি বিশেষজ্ঞ', slug: 'gynecology', categoryId: categories[3].id, isFeatured: true, sortOrder: 1 } }),
    // Dental
    prisma.specialty.upsert({ where: { slug: 'dentistry' }, update: {}, create: { name: 'Dentistry', nameBn: 'দন্ত বিশেষজ্ঞ', slug: 'dentistry', categoryId: categories[4].id, isFeatured: true, sortOrder: 1 } }),
    // Eye
    prisma.specialty.upsert({ where: { slug: 'ophthalmology' }, update: {}, create: { name: 'Ophthalmology', nameBn: 'চক্ষু বিশেষজ্ঞ', slug: 'ophthalmology', categoryId: categories[5].id, isFeatured: true, sortOrder: 1 } }),
    // Mental Health
    prisma.specialty.upsert({ where: { slug: 'psychiatry' }, update: {}, create: { name: 'Psychiatry', nameBn: 'মনোরোগ বিশেষজ্ঞ', slug: 'psychiatry', categoryId: categories[6].id, isFeatured: true, sortOrder: 1 } }),
    // NEW specialties for Ibn Sina doctors
    prisma.specialty.upsert({ where: { slug: 'internal-medicine' }, update: {}, create: { name: 'Internal Medicine', nameBn: 'ইন্টার্নাল মেডিসিন', slug: 'internal-medicine', categoryId: categories[0].id, isFeatured: false, sortOrder: 9 } }),
    prisma.specialty.upsert({ where: { slug: 'family-medicine' }, update: {}, create: { name: 'Family Medicine', nameBn: 'ফ্যামিলি মেডিসিন', slug: 'family-medicine', categoryId: categories[0].id, isFeatured: false, sortOrder: 10 } }),
    prisma.specialty.upsert({ where: { slug: 'cardiac-diabetes' }, update: {}, create: { name: 'Cardiac & Diabetes', nameBn: 'হার্ট ও ডায়াবেটিস বিশেষজ্ঞ', slug: 'cardiac-diabetes', categoryId: categories[7].id, isFeatured: false, sortOrder: 1 } }),
    prisma.specialty.upsert({ where: { slug: 'pediatric-surgery' }, update: {}, create: { name: 'Pediatric & Laparoscopic Surgery', nameBn: 'শিশু ও ল্যাপারোস্কোপিক সার্জারি', slug: 'pediatric-surgery', categoryId: categories[1].id, isFeatured: false, sortOrder: 5 } }),
    prisma.specialty.upsert({ where: { slug: 'neuro-medicine' }, update: {}, create: { name: 'Neuro Medicine', nameBn: 'নিউরো মেডিসিন', slug: 'neuro-medicine', categoryId: categories[0].id, isFeatured: false, sortOrder: 11 } }),
  ]);

  console.log('✅ Specialties seeded');

  // Specialty index map for easy reference
  // 0=Cardiology, 1=Neurology, 2=Gastro, 3=Endo, 4=Pulmo, 5=Nephro, 6=Derma, 7=Rheuma
  // 8=GenSurg, 9=Ortho, 10=NeuroSurg, 11=Urology
  // 12=Pediatrics, 13=Neonatology
  // 14=Gynecology
  // 15=Dentistry
  // 16=Ophthalmology
  // 17=Psychiatry
  // 18=InternalMedicine, 19=FamilyMedicine, 20=CardiacDiabetes, 21=PediatricSurgery, 22=NeuroMedicine

  // ============================================================
  // HOSPITALS
  // ============================================================
  const squareHospital = await prisma.hospital.upsert({
    where: { slug: 'square-hospital' },
    update: {},
    create: {
      name: 'Square Hospital Ltd.',
      nameBn: 'স্কয়ার হাসপাতাল',
      slug: 'square-hospital',
      type: 'Private',
      description: 'Square Hospital Ltd. is one of the leading multispecialty hospitals in Bangladesh. Equipped with state-of-the-art medical technology and a team of highly qualified physicians.',
      phone: '01713383744',
      email: 'info@squarehospital.com',
      website: 'https://www.squarehospital.com',
      address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
      addressBn: '১৮/এফ, বীর উত্তম কাজী নুরুজ্জামান সরাক, পশ্চিম পান্থপথ, ঢাকা',
      districtId: dhakaDistrict.id,
      areaId: areas[7].id,
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
    },
  });

  const unitedHospital = await prisma.hospital.upsert({
    where: { slug: 'united-hospital' },
    update: {},
    create: {
      name: 'United Hospital Limited',
      nameBn: 'ইউনাইটেড হাসপাতাল',
      slug: 'united-hospital',
      type: 'Private',
      description: 'United Hospital Limited is a 500-bed tertiary care hospital in Gulshan, Dhaka. It offers comprehensive healthcare services with internationally trained specialists.',
      phone: '10666',
      email: 'info@uhlbd.com',
      website: 'https://www.uhlbd.com',
      address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
      addressBn: 'প্লট ১৫, রোড ৭১, গুলশান-২, ঢাকা-১২১২',
      districtId: dhakaDistrict.id,
      areaId: areas[1].id,
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
    },
  });

  const everCareHospital = await prisma.hospital.upsert({
    where: { slug: 'evercare-hospital' },
    update: {},
    create: {
      name: 'Evercare Hospital Dhaka',
      nameBn: 'এভারকেয়ার হাসপাতাল',
      slug: 'evercare-hospital',
      type: 'Private',
      description: 'Evercare Hospital Dhaka is a JCI-accredited multispecialty hospital providing world-class healthcare services.',
      phone: '10678',
      email: 'info@evercarebd.com',
      address: 'Plot 81, Block E, Bashundhara R/A, Dhaka-1229',
      addressBn: 'প্লট ৮১, ব্লক ই, বসুন্ধরা আবাসিক এলাকা, ঢাকা',
      districtId: dhakaDistrict.id,
      areaId: areas[6].id,
      latitude: 23.8145,
      longitude: 90.4267,
      isEmergency: true,
      emergencyPhone: '10678',
      bedCount: 400,
      establishedYear: 2014,
      isVerified: true,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 2103,
    },
  });

  const popularDiagnostic = await prisma.hospital.upsert({
    where: { slug: 'popular-diagnostic' },
    update: {},
    create: {
      name: 'Popular Diagnostic Centre',
      nameBn: 'পপুলার ডায়াগনস্টিক সেন্টার',
      slug: 'popular-diagnostic',
      type: 'Diagnostic',
      description: 'Popular Diagnostic Centre is one of the largest diagnostic chains in Bangladesh with branches across the country.',
      phone: '01713383000',
      address: 'House 16, Road 2, Dhanmondi, Dhaka-1205',
      addressBn: 'হাউস ১৬, রোড ২, ধানমন্ডি, ঢাকা-১২০৫',
      districtId: dhakaDistrict.id,
      areaId: areas[0].id,
      latitude: 23.7461,
      longitude: 90.3742,
      isEmergency: false,
      bedCount: 0,
      establishedYear: 1983,
      isVerified: true,
      isFeatured: false,
      rating: 4.2,
      reviewCount: 876,
    },
  });

  // NEW: Ibn Sina Diagnostic & Consultation Center — Mirpur branch
  const ibnSinaMirpur = await prisma.hospital.upsert({
    where: { slug: 'ibn-sina-mirpur' },
    update: {},
    create: {
      name: 'Ibn Sina Diagnostic & Consultation Center, Mirpur',
      nameBn: 'ইবনে সিনা ডায়াগনস্টিক ও কনসালটেশন সেন্টার, মিরপুর',
      slug: 'ibn-sina-mirpur',
      type: 'Diagnostic',
      description: 'Ibn Sina Diagnostic & Consultation Center Mirpur branch provides diagnostic and specialist consultation services with a wide panel of experienced physicians.',
      phone: '09610009627',
      altPhone: '01886610122',
      address: 'House#11, Haji Road, Avenue 3, Rupnagar, Mirpur-2, Dhaka-1216',
      addressBn: 'হাউস#১১, হাজী রোড, অ্যাভিনিউ ৩, রূপনগর, মিরপুর-২, ঢাকা-১২১৬',
      districtId: dhakaDistrict.id,
      areaId: rupnagarArea.id,
      latitude: 23.8067,
      longitude: 90.3601,
      isEmergency: false,
      bedCount: 0,
      establishedYear: 1983,
      isVerified: true,
      isFeatured: false,
      rating: 4.3,
      reviewCount: 540,
    },
  });

  // NEW: Ibn Sina Diagnostic & Consultation Center — Chattogram branch
  const ibnSinaChittagong = await prisma.hospital.upsert({
    where: { slug: 'ibn-sina-chittagong' },
    update: {},
    create: {
      name: 'Ibn Sina Diagnostic & Consultation Center, Chattogram',
      nameBn: 'ইবনে সিনা ডায়াগনস্টিক ও কনসালটেশন সেন্টার, চট্টগ্রাম',
      slug: 'ibn-sina-chittagong',
      type: 'Diagnostic',
      description: 'Ibn Sina Diagnostic & Consultation Center Chattogram branch offers specialist consultations and diagnostic services in Panchlaish, Chittagong.',
      phone: '09610009622',
      altPhone: '01886610116',
      address: 'H#12/A, Road#02, Katalganj R/A, Panchlaish, Chattogram',
      addressBn: 'হাউস#১২/এ, রোড#০২, কাতালগঞ্জ আর/এ, পাঁচলাইশ, চট্টগ্রাম',
      districtId: chittagongDistrict.id,
      areaId: panchlaishArea.id,
      latitude: 22.3650,
      longitude: 91.8120,
      isEmergency: false,
      bedCount: 0,
      establishedYear: 1983,
      isVerified: true,
      isFeatured: false,
      rating: 4.3,
      reviewCount: 480,
    },
  });

  console.log('✅ Hospitals seeded');

  // ============================================================
  // HOSPITAL DEPARTMENTS
  // ============================================================
  await prisma.hospitalDepartment.createMany({
    skipDuplicates: true,
    data: [
      { hospitalId: squareHospital.id, name: 'Cardiology', nameBn: 'হৃদরোগ বিভাগ' },
      { hospitalId: squareHospital.id, name: 'Neurology', nameBn: 'নিউরোলজি বিভাগ' },
      { hospitalId: squareHospital.id, name: 'Orthopedics', nameBn: 'অর্থোপেডিক্স বিভাগ' },
      { hospitalId: squareHospital.id, name: 'Pediatrics', nameBn: 'শিশু বিভাগ' },
      { hospitalId: squareHospital.id, name: 'Gynecology', nameBn: 'গাইনি বিভাগ' },
      { hospitalId: squareHospital.id, name: 'Emergency', nameBn: 'ইমার্জেন্সি বিভাগ' },
      { hospitalId: unitedHospital.id, name: 'Cardiology', nameBn: 'হৃদরোগ বিভাগ' },
      { hospitalId: unitedHospital.id, name: 'Oncology', nameBn: 'ক্যান্সার বিভাগ' },
      { hospitalId: unitedHospital.id, name: 'Nephrology', nameBn: 'কিডনি বিভাগ' },
      { hospitalId: unitedHospital.id, name: 'ICU', nameBn: 'আইসিইউ' },
      // Evercare departments
      { hospitalId: everCareHospital.id, name: 'Cardiology', nameBn: 'হৃদরোগ বিভাগ' },
      // Ibn Sina Mirpur departments
      { hospitalId: ibnSinaMirpur.id, name: 'Medicine', nameBn: 'মেডিসিন বিভাগ' },
      { hospitalId: ibnSinaMirpur.id, name: 'Cardiology', nameBn: 'হৃদরোগ বিভাগ' },
      { hospitalId: ibnSinaMirpur.id, name: 'Neurology', nameBn: 'নিউরোলজি বিভাগ' },
      { hospitalId: ibnSinaMirpur.id, name: 'Gynaecology & Obstetrics', nameBn: 'গাইনি বিভাগ' },
      { hospitalId: ibnSinaMirpur.id, name: 'Pediatric Surgery', nameBn: 'শিশু সার্জারি বিভাগ' },
      // Ibn Sina Chattogram departments
      { hospitalId: ibnSinaChittagong.id, name: 'Medicine', nameBn: 'মেডিসিন বিভাগ' },
      { hospitalId: ibnSinaChittagong.id, name: 'Neurology', nameBn: 'নিউরোলজি বিভাগ' },
    ],
  });

  // ============================================================
  // HOSPITAL OPENING HOURS
  // ============================================================
  const days: DayOfWeek[] = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (const hospital of [squareHospital, unitedHospital, everCareHospital]) {
    for (const day of days) {
      await prisma.hospitalOpeningHour.upsert({
        where: { hospitalId_day: { hospitalId: hospital.id, day } },
        update: {},
        create: {
          hospitalId: hospital.id,
          day,
          openTime: '08:00',
          closeTime: '22:00',
          isClosed: false,
        },
      });
    }
  }

  // Ibn Sina branches open 7 days
  for (const hospital of [ibnSinaMirpur, ibnSinaChittagong]) {
    for (const day of days) {
      await prisma.hospitalOpeningHour.upsert({
        where: { hospitalId_day: { hospitalId: hospital.id, day } },
        update: {},
        create: {
          hospitalId: hospital.id,
          day,
          openTime: '09:00',
          closeTime: '21:00',
          isClosed: false,
        },
      });
    }
  }

  console.log('✅ Hospital hours seeded');

  // ============================================================
  // ADMIN USER
  // ============================================================
  await prisma.user.deleteMany({
  where: {
    OR: [
      { email: 'admin@swasthabd.com' },
      { phone: '+8801700000001' }
    ]
  }
});

const adminUser = await prisma.user.create({
  data: {
    email: 'admin@swasthabd.com',
    name: 'Super Admin',
    phone: '+8801700000001',
    password: await bcrypt.hash('Admin@123456', 10),
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
    phoneVerified: true,
  },
});

  console.log('✅ Admin user seeded');

  // ============================================================
  // DOCTORS — original 8
  // ============================================================
  const doctorData = [
    {
      email: 'dr.aminul@swasthabd.com',
      name: 'Dr. Aminul Islam',
      nameBn: 'ডাঃ আমিনুল ইসলাম',
      gender: Gender.MALE,
      specialty: specialties[0], // Cardiology
      hospital: squareHospital,
      area: areas[7], // Farmgate
      district: dhakaDistrict,
      bmdcNumber: 'A-12345',
      experience: 18,
      fee: 1500,
      phone: '01711111111',
      title: 'Prof.',
      about: 'Professor Dr. Aminul Islam is a renowned cardiologist with 18 years of experience. He specializes in interventional cardiology, coronary artery disease, and heart failure management.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 2000 },
        { degree: 'MD (Cardiology)', institution: 'BSMMU', year: 2005 },
        { degree: 'FRCP', institution: 'Royal College of Physicians, UK', year: 2010 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Farmgate, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.nasrin@swasthabd.com',
      name: 'Dr. Nasrin Akter',
      nameBn: 'ডাঃ নাসরিন আক্তার',
      gender: Gender.FEMALE,
      specialty: specialties[14], // Gynecology
      hospital: squareHospital,
      area: areas[0], // Dhanmondi
      district: dhakaDistrict,
      bmdcNumber: 'A-23456',
      experience: 15,
      fee: 1200,
      phone: '01722222222',
      title: 'Dr.',
      about: 'Dr. Nasrin Akter is a highly experienced gynecologist and obstetrician. She has delivered over 5000 babies and specializes in high-risk pregnancy management.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: 2003 },
        { degree: 'FCPS (Gynecology)', institution: 'BCPS Bangladesh', year: 2009 },
        { degree: 'MS (Gynecology)', institution: 'BSMMU', year: 2012 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Dhanmondi, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.rashid@swasthabd.com',
      name: 'Dr. Abdul Rashid',
      nameBn: 'ডাঃ আব্দুল রশিদ',
      gender: Gender.MALE,
      specialty: specialties[12], // Pediatrics
      hospital: unitedHospital,
      area: areas[1], // Gulshan
      district: dhakaDistrict,
      bmdcNumber: 'A-34567',
      experience: 22,
      fee: 1000,
      phone: '01733333333',
      title: 'Assoc. Prof.',
      about: 'Associate Professor Dr. Abdul Rashid is a pediatric specialist with 22 years of experience treating children from newborns to adolescents.',
      qualifications: [
        { degree: 'MBBS', institution: 'Rajshahi Medical College', year: 1998 },
        { degree: 'DCH', institution: 'BCPS Bangladesh', year: 2003 },
        { degree: 'FCPS (Pediatrics)', institution: 'BCPS Bangladesh', year: 2007 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Gulshan, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.mahmud@swasthabd.com',
      name: 'Dr. Mahmudur Rahman',
      nameBn: 'ডাঃ মাহমুদুর রহমান',
      gender: Gender.MALE,
      specialty: specialties[9], // Orthopedics
      hospital: everCareHospital,
      area: areas[6], // Bashundhara
      district: dhakaDistrict,
      bmdcNumber: 'A-45678',
      experience: 20,
      fee: 2000,
      phone: '01744444444',
      title: 'Prof.',
      about: 'Professor Dr. Mahmudur Rahman is a leading orthopedic surgeon specializing in joint replacement surgery, sports injuries, and spine disorders.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 1999 },
        { degree: 'MS (Orthopedics)', institution: 'BSMMU', year: 2005 },
        { degree: 'FRCS', institution: 'Royal College of Surgeons, UK', year: 2010 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Bashundhara, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.sultana@swasthabd.com',
      name: 'Dr. Shirina Sultana',
      nameBn: 'ডাঃ শিরিনা সুলতানা',
      gender: Gender.FEMALE,
      specialty: specialties[16], // Ophthalmology
      hospital: squareHospital,
      area: areas[4], // Mohammadpur
      district: dhakaDistrict,
      bmdcNumber: 'A-56789',
      experience: 12,
      fee: 800,
      phone: '01755555555',
      title: 'Dr.',
      about: 'Dr. Shirina Sultana is an eye specialist with expertise in cataract surgery, glaucoma management, and refractive surgery.',
      qualifications: [
        { degree: 'MBBS', institution: 'Sir Salimullah Medical College', year: 2006 },
        { degree: 'DO', institution: 'BCPS Bangladesh', year: 2011 },
        { degree: 'FCPS (Ophthalmology)', institution: 'BCPS Bangladesh', year: 2015 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Mohammadpur, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.karim@swasthabd.com',
      name: 'Dr. Abul Kalam Azad',
      nameBn: 'ডাঃ আবুল কালাম আজাদ',
      gender: Gender.MALE,
      specialty: specialties[1], // Neurology
      hospital: unitedHospital,
      area: areas[1], // Gulshan
      district: dhakaDistrict,
      bmdcNumber: 'A-67890',
      experience: 25,
      fee: 2500,
      phone: '01766666666',
      title: 'Prof.',
      about: "Professor Dr. Abul Kalam Azad is one of Bangladesh's most prominent neurologists with 25 years of experience in treating stroke, epilepsy, and movement disorders.",
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 1996 },
        { degree: 'MD (Neurology)', institution: 'BSMMU', year: 2002 },
        { degree: 'MRCP (Neurology)', institution: 'Royal College, UK', year: 2007 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Gulshan, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.begum@swasthabd.com',
      name: 'Dr. Roksana Begum',
      nameBn: 'ডাঃ রোকসানা বেগম',
      gender: Gender.FEMALE,
      specialty: specialties[3], // Endocrinology
      hospital: squareHospital,
      area: areas[0], // Dhanmondi
      district: dhakaDistrict,
      bmdcNumber: 'A-78901',
      experience: 14,
      fee: 1200,
      phone: '01777777777',
      title: 'Dr.',
      about: 'Dr. Roksana Begum specializes in diabetes, thyroid disorders, and hormonal imbalances with 14 years of clinical experience.',
      qualifications: [
        { degree: 'MBBS', institution: 'Mymensingh Medical College', year: 2005 },
        { degree: 'MD (Endocrinology)', institution: 'BSMMU', year: 2012 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Dhanmondi, Dhaka',
      chamberName: undefined as string | undefined,
    },
    {
      email: 'dr.hossain@swasthabd.com',
      name: 'Dr. Zahirul Hossain',
      nameBn: 'ডাঃ জাহিরুল হোসেন',
      gender: Gender.MALE,
      specialty: specialties[6], // Dermatology
      hospital: popularDiagnostic,
      area: areas[0], // Dhanmondi
      district: dhakaDistrict,
      bmdcNumber: 'A-89012',
      experience: 16,
      fee: 900,
      phone: '01788888888',
      title: 'Dr.',
      about: 'Dr. Zahirul Hossain is a dermatologist and venereologist specializing in skin diseases, cosmetic dermatology, and laser treatments.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 2003 },
        { degree: 'DDV', institution: 'BCPS Bangladesh', year: 2008 },
        { degree: 'FCPS (Dermatology)', institution: 'BCPS Bangladesh', year: 2012 },
      ],
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '10:00',
      scheduleEnd: '16:00',
      chamberAddress: 'Dhanmondi, Dhaka',
      chamberName: undefined as string | undefined,
    },
  ];

  // ============================================================
  // DOCTORS — Ibn Sina (10 new doctors)
  // ============================================================
  //
  // Schedule helpers
  // Chattogram doctors: scheduleStart/End reflect chamber times parsed from raw data.
  // For days with multiple entries (Sat/Tue/Wed vs other days) we use the most common window
  // and note the variation in the `about` field. Prisma ChamberSchedule is unique per day,
  // so one time-window per day is inserted; edge cases are documented.
  //
  const ibnSinaDoctors = [
    // ── Chattogram branch ──────────────────────────────────────────────
    {
      email: 'dr.habib.hassan@swasthabd.com',
      name: 'Prof. Dr. Muhammad Habib Hassan',
      nameBn: 'প্রফেসর ডাঃ মুহাম্মদ হাবিব হাসান',
      gender: Gender.MALE,
      specialty: specialties[18], // Internal Medicine
      hospital: ibnSinaChittagong,
      area: panchlaishArea,
      district: chittagongDistrict,
      bmdcNumber: 'CTG-10001',
      experience: 20,
      fee: 800,
      phone: '01886610117',
      title: 'Prof.',
      about: 'Professor Dr. Muhammad Habib Hassan holds MBBS, BCS (Health), FCPS (Medicine) and MD (Internal Medicine). He is a Professor at Chattogram Medical College Hospital (Medicine Department). Chamber at Ibn Sina Chattogram, 4th Floor, Room 501. Available Fridays 9:30 AM – 12:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chattogram Medical College', year: 2000 },
        { degree: 'BCS (Health)', institution: 'Government of Bangladesh', year: 2002 },
        { degree: 'FCPS (Medicine)', institution: 'BCPS Bangladesh', year: 2007 },
        { degree: 'MD (Internal Medicine)', institution: 'BSMMU', year: 2012 },
      ],
      // Only available on Friday
      scheduleDays: ['FRIDAY'] as DayOfWeek[],
      scheduleStart: '09:30',
      scheduleEnd: '12:00',
      chamberAddress: '4th Floor, Room 501 — Ibn Sina Diagnostic & Consultation Center, Panchlaish, Chattogram',
      chamberName: 'Ibn Sina Chattogram — Room 501 (4th Floor)',
    },
    {
      email: 'dr.salahuddin.ctg@swasthabd.com',
      name: 'Prof. Dr. Muhammad Salahuddin',
      nameBn: 'প্রফেসর ডাঃ মুহাম্মদ সালাহউদ্দিন',
      gender: Gender.MALE,
      specialty: specialties[5], // Nephrology (MD Nephrology)
      hospital: ibnSinaChittagong,
      area: panchlaishArea,
      district: chittagongDistrict,
      bmdcNumber: 'CTG-10002',
      experience: 22,
      fee: 800,
      phone: '01886610118',
      title: 'Prof.',
      about: 'Professor Dr. Muhammad Salahuddin holds MBBS, FCPS (Medicine) and MD (Nephrology). He is a Professor at Cox\'s Bazar Medical College (Medicine Department). Chamber at Ibn Sina Chattogram, 4th Floor, Room 507. Available Saturday, Tuesday, Wednesday 7:00 PM – 9:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: 1998 },
        { degree: 'FCPS (Medicine)', institution: 'BCPS Bangladesh', year: 2004 },
        { degree: 'MD (Nephrology)', institution: 'BSMMU', year: 2009 },
      ],
      // Available Sat, Tue, Wed
      scheduleDays: ['SATURDAY', 'TUESDAY', 'WEDNESDAY'] as DayOfWeek[],
      scheduleStart: '19:00',
      scheduleEnd: '21:00',
      chamberAddress: '4th Floor, Room 507 — Ibn Sina Diagnostic & Consultation Center, Panchlaish, Chattogram',
      chamberName: 'Ibn Sina Chattogram — Room 507 (4th Floor)',
    },
    {
      email: 'dr.kawser.shouaibe@swasthabd.com',
      name: 'Dr. Md. Kawser Uddin Shouaibe',
      nameBn: 'ডাঃ মোঃ কাউসার উদ্দিন শোয়াইবে',
      gender: Gender.MALE,
      specialty: specialties[18], // Internal Medicine
      hospital: ibnSinaChittagong,
      area: panchlaishArea,
      district: chittagongDistrict,
      bmdcNumber: 'CTG-10003',
      experience: 14,
      fee: 600,
      phone: '01886610119',
      title: 'Assoc. Prof.',
      about: 'Dr. Md. Kawser Uddin Shouaibe holds MBBS, FCPS (Medicine). He is an Associate Professor in Medicine. Chamber at Ibn Sina Chattogram, 4th Floor, Room 507. Available Sundays and Fridays 7:30 PM – 9:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: 2005 },
        { degree: 'FCPS (Medicine)', institution: 'BCPS Bangladesh', year: 2012 },
      ],
      // Available Sunday & Friday only (off: Sat, Mon, Tue, Wed, Thu)
      scheduleDays: ['SUNDAY', 'FRIDAY'] as DayOfWeek[],
      scheduleStart: '19:30',
      scheduleEnd: '21:00',
      chamberAddress: '4th Floor, Room 507 — Ibn Sina Diagnostic & Consultation Center, Panchlaish, Chattogram',
      chamberName: 'Ibn Sina Chattogram — Room 507 (4th Floor)',
    },
    {
      email: 'dr.atiquel.chowdhury@swasthabd.com',
      name: 'Prof. Dr. Md. Atiquel Islam Chowdhury',
      nameBn: 'প্রফেসর ডাঃ মোঃ আতিকুল ইসলাম চৌধুরী',
      gender: Gender.MALE,
      specialty: specialties[18], // Internal Medicine / Medicine
      hospital: ibnSinaChittagong,
      area: panchlaishArea,
      district: chittagongDistrict,
      bmdcNumber: 'CTG-10004',
      experience: 25,
      fee: 1000,
      phone: '01886610120',
      title: 'Prof.',
      about: 'Professor Dr. Md. Atiquel Islam Chowdhury holds MBBS, MCPS, FCPS (Medicine) and MRCP (UK). He is Professor & Head of the Department of Medicine at Southern Medical College & Hospital. Chamber at Ibn Sina Chattogram, 3rd Floor, Room 401. Available Saturday through Thursday 3:45 PM – 6:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: 1994 },
        { degree: 'MCPS', institution: 'BCPS Bangladesh', year: 1999 },
        { degree: 'FCPS (Medicine)', institution: 'BCPS Bangladesh', year: 2003 },
        { degree: 'MRCP (UK)', institution: 'Royal College of Physicians, UK', year: 2007 },
      ],
      // Available Sat–Thu (off Friday)
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '15:45',
      scheduleEnd: '18:00',
      chamberAddress: '3rd Floor, Room 401 — Ibn Sina Diagnostic & Consultation Center, Panchlaish, Chattogram',
      chamberName: 'Ibn Sina Chattogram — Room 401 (3rd Floor)',
    },
    {
      email: 'dr.salah.uddin.ctg.neuro@swasthabd.com',
      name: 'Dr. Mohammad Salah Uddin',
      nameBn: 'ডাঃ মোহাম্মদ সালাহ উদ্দিন',
      gender: Gender.MALE,
      specialty: specialties[22], // Neuro Medicine
      hospital: ibnSinaChittagong,
      area: panchlaishArea,
      district: chittagongDistrict,
      bmdcNumber: 'CTG-10005',
      experience: 15,
      fee: 700,
      phone: '01886610121',
      title: 'Assoc. Prof.',
      about: 'Dr. Mohammad Salah Uddin holds MBBS and MD (Neurology) from BSMMU. He is an Associate Professor in the Department of Neurology/Neuro Medicine at Chittagong Medical College & Hospital. Chamber at Ibn Sina Chattogram, 1st Floor, Room 210. Available Sunday through Thursday 1:00 PM – 2:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: 2004 },
        { degree: 'MD (Neurology)', institution: 'BSMMU', year: 2012 },
      ],
      // Available Sun–Thu (off Sat & Fri)
      scheduleDays: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '13:00',
      scheduleEnd: '14:00',
      chamberAddress: '1st Floor, Room 210 — Ibn Sina Diagnostic & Consultation Center, Panchlaish, Chattogram',
      chamberName: 'Ibn Sina Chattogram — Room 210 (1st Floor)',
    },

    // ── Mirpur branch ──────────────────────────────────────────────────
    {
      email: 'dr.ak.mohammad.ali@swasthabd.com',
      name: 'Dr. A. K. Mohammad Ali',
      nameBn: 'ডাঃ এ. কে. মোহাম্মদ আলী',
      gender: Gender.MALE,
      specialty: specialties[19], // Family Medicine
      hospital: ibnSinaMirpur,
      area: rupnagarArea,
      district: dhakaDistrict,
      bmdcNumber: 'MRP-10001',
      experience: 18,
      fee: 600,
      phone: '09610009622',
      title: 'Dr.',
      about: 'Dr. A. K. Mohammad Ali holds MBBS (DMC), DIH (NIPSOM), FMD (USTC) and CEU (BSU). He is a Family Medicine Specialist and Consultant at Ibn Sina Diagnostic & Consultation Center, Mirpur. Chamber at 3rd Floor, Room 404. Available Sunday through Thursday 11:00 AM – 1:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 2000 },
        { degree: 'DIH', institution: 'NIPSOM', year: 2004 },
        { degree: 'FMD', institution: 'USTC', year: 2007 },
        { degree: 'CEU', institution: 'BSU', year: 2010 },
      ],
      // Available Sun–Thu (off Sat & Fri)
      scheduleDays: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '11:00',
      scheduleEnd: '13:00',
      chamberAddress: '3rd Floor, Room 404 — Ibn Sina Diagnostic & Consultation Center, Rupnagar, Mirpur-2, Dhaka-1216',
      chamberName: 'Ibn Sina Mirpur — Room 404 (3rd Floor)',
    },
    {
      email: 'dr.wahiduzzaman@swasthabd.com',
      name: 'Dr. Md. Wahiduzzaman',
      nameBn: 'ডাঃ মোঃ ওয়াহিদুজ্জামান',
      gender: Gender.MALE,
      specialty: specialties[20], // Cardiac & Diabetes
      hospital: ibnSinaMirpur,
      area: rupnagarArea,
      district: dhakaDistrict,
      bmdcNumber: 'MRP-10002',
      experience: 20,
      fee: 800,
      phone: '09610009623',
      title: 'Dr.',
      about: 'Dr. Md. Wahiduzzaman holds MBBS, D-Card and PhD-Fellow (Diabetes, Germany). He is a Cardiac & Diabetes Specialist and Consultant at NHN (Bangladesh Diabetes Society). Chamber at Ibn Sina Mirpur, 2nd Floor, Room 304. Available Saturday through Thursday 7:00 PM – 9:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 1999 },
        { degree: 'D-Card', institution: 'BCPS Bangladesh', year: 2005 },
        { degree: 'PhD Fellow (Diabetes)', institution: 'University, Germany', year: 2010 },
      ],
      // Available Sat–Thu (off Fri & Govt holidays noted in about)
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '19:00',
      scheduleEnd: '21:00',
      chamberAddress: '2nd Floor, Room 304 — Ibn Sina Diagnostic & Consultation Center, Rupnagar, Mirpur-2, Dhaka-1216',
      chamberName: 'Ibn Sina Mirpur — Room 304 (2nd Floor)',
    },
    {
      email: 'dr.momen.khan@swasthabd.com',
      name: 'Prof. Dr. M. A. Momen Khan',
      nameBn: 'প্রফেসর ডাঃ এম. এ. মোমেন খান',
      gender: Gender.MALE,
      specialty: specialties[1], // Neurology
      hospital: ibnSinaMirpur,
      area: rupnagarArea,
      district: dhakaDistrict,
      bmdcNumber: 'MRP-10003',
      experience: 25,
      fee: 1000,
      phone: '09610009624',
      title: 'Prof.',
      about: 'Professor Dr. M. A. Momen Khan holds MBBS and MD (Neurology) from BSMMU. He is a Fellow in Neuro-Intervention & Stroke and Professor at Shaheed Suhrawardy Medical College & Hospital. Chamber at Ibn Sina Mirpur, 3rd Floor, Room 415. Available Saturday through Wednesday 5:30 PM – 7:30 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 1994 },
        { degree: 'MD (Neurology)', institution: 'BSMMU', year: 2002 },
      ],
      // Available Sat–Wed (off Thu, Fri)
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY'] as DayOfWeek[],
      scheduleStart: '17:30',
      scheduleEnd: '19:30',
      chamberAddress: '3rd Floor, Room 415 — Ibn Sina Diagnostic & Consultation Center, Rupnagar, Mirpur-2, Dhaka-1216',
      chamberName: 'Ibn Sina Mirpur — Room 415 (3rd Floor)',
    },
    {
      email: 'dr.mahbuba.banu@swasthabd.com',
      name: 'Prof. Dr. Mahbuba Akhter Banu',
      nameBn: 'প্রফেসর ডাঃ মাহবুবা আক্তার বানু',
      gender: Gender.FEMALE,
      specialty: specialties[14], // Gynecology & Obstetrics
      hospital: ibnSinaMirpur,
      area: rupnagarArea,
      district: dhakaDistrict,
      bmdcNumber: 'MRP-10004',
      experience: 28,
      fee: 1000,
      phone: '09610009625',
      title: 'Prof.',
      about: 'Professor Dr. Mahbuba Akhter Banu holds MBBS, MCPS, DGO and FCPS (Obs & Gynaecology). She is a Professor at Sir Salimullah Medical College, Mitford Hospital. Chamber at Ibn Sina Mirpur, 5th Floor (New Building), Room 601. Available Sunday, Tuesday and Thursday 5:00 PM – 8:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Sir Salimullah Medical College', year: 1991 },
        { degree: 'MCPS', institution: 'BCPS Bangladesh', year: 1996 },
        { degree: 'DGO', institution: 'BCPS Bangladesh', year: 1998 },
        { degree: 'FCPS (Obs & Gynaecology)', institution: 'BCPS Bangladesh', year: 2003 },
      ],
      // Available Sun, Tue, Thu
      scheduleDays: ['SUNDAY', 'TUESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '17:00',
      scheduleEnd: '20:00',
      chamberAddress: '5th Floor (New Building), Room 601 — Ibn Sina Diagnostic & Consultation Center, Rupnagar, Mirpur-2, Dhaka-1216',
      chamberName: 'Ibn Sina Mirpur — Room 601 (5th Floor, New Building)',
    },
    {
      email: 'dr.hasanuzzaman@swasthabd.com',
      name: 'Dr. Md. Hasanuzzaman',
      nameBn: 'ডাঃ মোঃ হাসানুজ্জামান',
      gender: Gender.MALE,
      specialty: specialties[21], // Pediatric & Laparoscopic Surgery
      hospital: ibnSinaMirpur,
      area: rupnagarArea,
      district: dhakaDistrict,
      bmdcNumber: 'MRP-10005',
      experience: 18,
      fee: 900,
      phone: '09610009626',
      title: 'Assoc. Prof.',
      about: 'Dr. Md. Hasanuzzaman holds MBBS, BCS (Health), MS (Paediatric Surgery) and FACS (USA). He is an Associate Professor at Dhaka Medical College & Hospital (Department of Pediatric Surgery). Chamber at Ibn Sina Mirpur, 4th Floor, Room 509. Available Saturday through Thursday 5:00 PM – 6:00 PM.',
      qualifications: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: 2001 },
        { degree: 'BCS (Health)', institution: 'Government of Bangladesh', year: 2003 },
        { degree: 'MS (Paediatric Surgery)', institution: 'BSMMU', year: 2009 },
        { degree: 'FACS', institution: 'American College of Surgeons, USA', year: 2014 },
      ],
      // Available Sat–Thu (off Fri & Govt holidays noted in about)
      scheduleDays: ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'] as DayOfWeek[],
      scheduleStart: '17:00',
      scheduleEnd: '18:00',
      chamberAddress: '4th Floor, Room 509 — Ibn Sina Diagnostic & Consultation Center, Rupnagar, Mirpur-2, Dhaka-1216',
      chamberName: 'Ibn Sina Mirpur — Room 509 (4th Floor)',
    },
  ];

  // Combine all doctors into one loop
  const allDoctors = [...doctorData, ...ibnSinaDoctors];

  for (const data of allDoctors) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        phone: `+880${data.phone.replace(/^0/, '')}`,
        role: 'DOCTOR',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
        gender: data.gender,
      },
    });

    const slug = data.name
      .toLowerCase()
      .replace(/prof\.\s*(dr\.)?|dr\.|assoc\.\s*prof\./gi, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        slug: `dr-${slug}-${user.id.slice(-6)}`,
        name: data.name,
        nameBn: data.nameBn,
        title: data.title,
        gender: data.gender,
        photo: `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.email}`,
        bmdcNumber: data.bmdcNumber,
        bmdcVerified: true,
        about: data.about,
        experience: data.experience,
        consultationFee: data.fee,
        phone: data.phone,
        whatsapp: data.phone,
        languages: ['bn', 'en'],
        districtId: data.district.id,
        status: DoctorStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
        isVerified: true,
        isFeatured: data.experience >= 20,
        rating: 4.0 + Math.random() * 0.9,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        totalAppointments: Math.floor(Math.random() * 2000) + 500,
        metaTitle: `${data.name} - ${data.specialty.name} Specialist | Swastha BD`,
        metaDescription: `Book appointment with ${data.name}, ${data.specialty.name} specialist. ${data.experience} years experience. Consultation fee: ৳${data.fee}`,
      },
    });

    // Link specialty
    await prisma.doctorSpecialty.upsert({
      where: { doctorId_specialtyId: { doctorId: doctor.id, specialtyId: data.specialty.id } },
      update: {},
      create: { doctorId: doctor.id, specialtyId: data.specialty.id, isPrimary: true },
    });

    // Create qualifications
    for (const qual of data.qualifications) {
      await prisma.doctorQualification.create({
        data: { doctorId: doctor.id, ...qual },
      });
    }

    // Link chamber to hospital and department
    const hospitalDepts = await prisma.hospitalDepartment.findMany({ where: { hospitalId: data.hospital.id } });
    const matchedDept = hospitalDepts.find(d => 
      d.name.toLowerCase().includes(data.specialty.name.toLowerCase()) ||
      data.specialty.name.toLowerCase().includes(d.name.toLowerCase())
    ) || hospitalDepts[0];

    // Create chamber
    const chamber = await prisma.doctorChamber.create({
      data: {
        doctorId: doctor.id,
        name: data.chamberName ?? `${data.name}'s Chamber`,
        address: data.chamberAddress,
        areaId: data.area.id,
        phone: data.phone,
        latitude: data.area.latitude,
        longitude: data.area.longitude,
        isMain: true,
        appointmentFee: data.fee,
        hospitalId: data.hospital.id,
        departmentId: matchedDept?.id || null,
      },
    });

    // Create schedules
    for (const day of data.scheduleDays) {
      await prisma.chamberSchedule.upsert({
        where: { chamberId_day: { chamberId: chamber.id, day } },
        update: {},
        create: {
          chamberId: chamber.id,
          day,
          startTime: data.scheduleStart,
          endTime: data.scheduleEnd,
          slotDuration: 15,
          maxPatients: 20,
        },
      });
    }

    // Link to hospital
    await prisma.doctorHospital.upsert({
      where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: data.hospital.id } },
      update: {},
      create: {
        doctorId: doctor.id,
        hospitalId: data.hospital.id,
        isActive: true,
      },
    });

    // Extra hospital chambers for Dr. Aminul Islam
    if (data.email === 'dr.aminul@swasthabd.com') {
      // 2. Evercare Hospital Dhaka
      const evercareDept = await prisma.hospitalDepartment.findFirst({
        where: { hospitalId: everCareHospital.id, name: 'Cardiology' }
      });
      const evercareChamber = await prisma.doctorChamber.create({
        data: {
          doctorId: doctor.id,
          name: 'Evercare Hospital Dhaka — Room 302',
          nameBn: 'এভারকেয়ার হাসপাতাল - রুম ৩০২',
          address: 'Plot 81, Block E, Bashundhara R/A, Dhaka-1229',
          areaId: everCareHospital.areaId,
          phone: '10678',
          latitude: everCareHospital.latitude,
          longitude: everCareHospital.longitude,
          isMain: false,
          appointmentFee: 2000,
          hospitalId: everCareHospital.id,
          departmentId: evercareDept?.id || null,
        },
      });
      for (const day of ['SUNDAY', 'WEDNESDAY'] as DayOfWeek[]) {
        await prisma.chamberSchedule.create({
          data: {
            chamberId: evercareChamber.id,
            day,
            startTime: '17:00',
            endTime: '20:00',
            slotDuration: 15,
            maxPatients: 15,
          },
        });
      }
      await prisma.doctorHospital.upsert({
        where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: everCareHospital.id } },
        update: { isActive: true, designation: 'Senior Visiting Consultant', department: 'Cardiology' },
        create: {
          doctorId: doctor.id,
          hospitalId: everCareHospital.id,
          isActive: true,
          designation: 'Senior Visiting Consultant',
          department: 'Cardiology',
        },
      });

      // 3. United Hospital Limited
      const unitedDept = await prisma.hospitalDepartment.findFirst({
        where: { hospitalId: unitedHospital.id, name: 'Cardiology' }
      });
      const unitedChamber = await prisma.doctorChamber.create({
        data: {
          doctorId: doctor.id,
          name: 'United Hospital Limited — Cardiology Suite',
          nameBn: 'ইউনাইটেড হাসপাতাল - কার্ডিওলজি সুইট',
          address: 'Plot 15, Road 71, Gulshan-2, Dhaka-1212',
          areaId: unitedHospital.areaId,
          phone: '10666',
          latitude: unitedHospital.latitude,
          longitude: unitedHospital.longitude,
          isMain: false,
          appointmentFee: 1800,
          hospitalId: unitedHospital.id,
          departmentId: unitedDept?.id || null,
        },
      });
      for (const day of ['MONDAY', 'THURSDAY'] as DayOfWeek[]) {
        await prisma.chamberSchedule.create({
          data: {
            chamberId: unitedChamber.id,
            day,
            startTime: '18:00',
            endTime: '21:00',
            slotDuration: 15,
            maxPatients: 15,
          },
        });
      }
      await prisma.doctorHospital.upsert({
        where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: unitedHospital.id } },
        update: { isActive: true, designation: 'Visiting Specialist', department: 'Cardiology' },
        create: {
          doctorId: doctor.id,
          hospitalId: unitedHospital.id,
          isActive: true,
          designation: 'Visiting Specialist',
          department: 'Cardiology',
        },
      });
    }

    // Add PREMIUM subscription for experienced/featured doctors
    if (data.experience >= 20) {
      await prisma.subscription.create({
        data: {
          doctorId: doctor.id,
          plan: SubscriptionPlan.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          price: 5000,
          features: {
            sponsoredSearch: true,
            featuredProfile: true,
            maxPhotos: 20,
            analytics: true,
            prioritySupport: true,
          },
        },
      });
    }
  }

  console.log('✅ Doctors seeded');

  // ============================================================
  // BLOG CATEGORIES & POSTS
  // ============================================================
  const healthCategory = await prisma.blogCategory.upsert({
    where: { slug: 'health-tips' },
    update: {},
    create: { name: 'Health Tips', nameBn: 'স্বাস্থ্য টিপস', slug: 'health-tips' },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'diabetes-prevention-bangladesh' },
    update: {},
    create: {
      title: '10 Ways to Prevent Diabetes in Bangladesh',
      titleBn: 'বাংলাদেশে ডায়াবেটিস প্রতিরোধের ১০টি উপায়',
      slug: 'diabetes-prevention-bangladesh',
      excerpt: 'With rising diabetes rates in Bangladesh, here are proven strategies to prevent and manage this condition.',
      content: `# 10 Ways to Prevent Diabetes in Bangladesh\n\nDiabetes is a growing health concern in Bangladesh, affecting millions of people. Here are evidence-based strategies to reduce your risk...\n\n## 1. Maintain a Healthy Weight\nExcess body weight is the leading risk factor for Type 2 diabetes...\n\n## 2. Exercise Regularly\nAt least 30 minutes of moderate exercise per day significantly reduces diabetes risk...`,
      authorId: adminUser.id,
      categoryId: healthCategory.id,
      tags: ['diabetes', 'prevention', 'health', 'bangladesh'],
      status: 'PUBLISHED',
      views: 1243,
      publishedAt: new Date(),
      metaTitle: '10 Ways to Prevent Diabetes in Bangladesh | Swastha BD',
      metaDescription: 'Learn 10 proven strategies to prevent diabetes in Bangladesh. Expert advice from top endocrinologists.',
    },
  });

  // ============================================================
  // SYSTEM CONFIG
  // ============================================================
  await prisma.systemConfig.upsert({
    where: { key: 'platform_name' },
    update: {},
    create: { key: 'platform_name', value: { en: 'Swastha BD', bn: 'স্বাস্থ্য বিডি' }, group: 'general', isPublic: true },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'booking_commission_percent' },
    update: {},
    create: { key: 'booking_commission_percent', value: 10, group: 'payments' },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'subscription_plans' },
    update: {},
    create: {
      key: 'subscription_plans',
      value: {
        FREE: { price: 0, features: { maxChambers: 1, analytics: false, sponsoredSearch: false } },
        BASIC: { price: 1500, features: { maxChambers: 2, analytics: true, sponsoredSearch: false } },
        PROFESSIONAL: { price: 3000, features: { maxChambers: 5, analytics: true, sponsoredSearch: true } },
        PREMIUM: { price: 5000, features: { maxChambers: 10, analytics: true, sponsoredSearch: true, prioritySupport: true } },
        ENTERPRISE: { price: 10000, features: { maxChambers: -1, analytics: true, sponsoredSearch: true, prioritySupport: true, customBranding: true } },
      },
      group: 'subscriptions',
      isPublic: true,
    },
  });

  console.log('✅ System config seeded');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 8 Divisions');
  console.log('   - 4 Districts (Dhaka, Chittagong, Sylhet, Rajshahi)');
  console.log('   - 2 Upazillas (Dhaka City, Chittagong City)');
  console.log('   - 10 Areas (8 Dhaka + Rupnagar + Panchlaish)');
  console.log('   - 8 Specialty Categories');
  console.log('   - 23 Specialties');
  console.log('   - 6 Hospitals (Square, United, Evercare, Popular, Ibn Sina Mirpur, Ibn Sina Chattogram)');
  console.log('   - 18 Doctors (8 original + 5 Ibn Sina Chattogram + 5 Ibn Sina Mirpur)');
  console.log('   - System Configuration');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });