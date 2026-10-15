// apps/web/src/types/index.ts
// DocFinder BD — Production-grade TypeScript interfaces
// Fully synced with Prisma schema & existing components

// ============================================================
// ENUMS
// ============================================================

export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN' | 'CONTENT_MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type DoctorStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
export type AppointmentType = 'IN_PERSON' | 'TELEMEDICINE' | 'HOME_VISIT';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PaymentMethod = 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'PREMIUM' | 'ENTERPRISE';
export type DayOfWeek = 'SATURDAY' | 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

// ============================================================
// LOCATION
// ============================================================

export interface Division {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  divisionId?: string;
  division?: Division;
  createdAt?: string;
  updatedAt?: string;
}

export interface Upazilla {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  districtId: string;
  district?: District;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  nameBn?: string;
  slug?: string;
  upazillaId?: string;
  upazilla?: Upazilla;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// SPECIALTY
// ============================================================

export interface SpecialtyCategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  categoryId?: string;
  category?: SpecialtyCategory;
  description?: string;
  icon?: string;
  isFeatured?: boolean;
  doctorCount?: number;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorSpecialty {
  id?: string;
  doctorId?: string;
  specialtyId?: string;
  specialty: Specialty;
  isPrimary?: boolean;
  createdAt?: string;
}

// ============================================================
// QUALIFICATION
// ============================================================

export interface Qualification {
  id?: string;
  doctorId?: string;
  degree: string;
  institution?: string;
  country?: string;
  year?: number;
  sortOrder?: number;
  createdAt?: string;
}

// ============================================================
// CHAMBER & SCHEDULE
// ============================================================

export interface ChamberSchedule {
  id: string;
  chamberId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxPatients: number;
  isClosed: boolean;
  notes?: string;
}

export interface Chamber {
  id: string;
  doctorId?: string;
  name: string;
  nameBn?: string;
  address: string;
  addressBn?: string;
  areaId?: string;
  area?: Area;
  phone?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  isMain: boolean;
  appointmentFee?: number;
  schedules: ChamberSchedule[];
  hospitalId?: string;
  hospital?: {
    id: string;
    name: string;
    slug?: string;
  };
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// HOSPITAL
// ============================================================

export interface HospitalDepartment {
  id: string;
  hospitalId: string;
  name: string;
  nameBn?: string;
  headDoctor?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  type: string;
  description?: string;
  descriptionBn?: string;
  logo?: string;
  coverImage?: string;
  photos: string[];
  phone: string;
  altPhone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  address: string;
  addressBn?: string;
  areaId?: string;
  area?: Area;
  districtId: string;
  district?: District;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  isEmergency: boolean;
  emergencyPhone?: string;
  bedCount?: number;
  establishedYear?: number;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  departments?: HospitalDepartment[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorHospital {
  id: string;
  doctorId?: string;
  hospitalId: string;
  hospital: Pick<Hospital, 'id' | 'name' | 'slug' | 'type'> & { logo?: string };
  designation?: string;
  department?: string;
  isActive: boolean;
  joinedAt?: string;
  createdAt?: string;
}

// ============================================================
// REVIEW
// ============================================================

export interface Review {
  id: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  doctorId?: string;
  hospitalId?: string;
  appointmentId?: string;
  overallRating: number;
  waitTimeRating?: number;
  behaviorRating?: number;
  knowledgeRating?: number;
  title?: string;
  content: string;
  isAnonymous: boolean;
  status: ReviewStatus;
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DOCTOR
// ============================================================

export interface DoctorAward {
  id: string;
  doctorId?: string;
  title: string;
  organization: string;
  year: number;
  createdAt?: string;
}

export interface DoctorPublication {
  id: string;
  doctorId?: string;
  title: string;
  journal?: string;
  year: number;
  url?: string;
  createdAt?: string;
}

export interface DoctorMembership {
  id: string;
  doctorId?: string;
  organization: string;
  membershipId?: string;
  year?: number;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  userId?: string;
  slug: string;
  name: string;
  nameBn?: string;
  title?: string;
  gender: Gender;
  photo?: string;
  coverImage?: string;
  bmdcNumber?: string;
  bmdcVerified: boolean;
  bmdcExpiryDate?: string;
  about?: string;
  aboutBn?: string;
  experience: number;
  consultationFee: number;
  followUpFee?: number;
  telemedicineFee?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  languages?: string[];
  districtId?: string;
  district?: District;
  status?: DoctorStatus;
  verificationStatus?: VerificationStatus;
  isAvailableOnline: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  totalAppointments: number;
  profileViews?: number;
  searchAppearances?: number;
  sponsoredRank?: number;
  metaTitle?: string;
  metaDescription?: string;
  // Relations
  specialties: DoctorSpecialty[];
  qualifications: Qualification[];
  chambers: Chamber[];
  hospitals?: DoctorHospital[];
  awards?: DoctorAward[];
  publications?: DoctorPublication[];
  memberships?: DoctorMembership[];
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
}

export type DoctorListItem = Doctor;

// ============================================================
// APPOINTMENT
// ============================================================

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  doctorId: string;
  doctor?: Pick<Doctor, 'id' | 'name' | 'photo' | 'slug' | 'specialties'>;
  chamberId?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  appointmentDate: string;
  slotTime: string;
  symptoms?: string;
  notes?: string;
  consultationNotes?: string;
  prescriptionUrl?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: Gender;
  consultationFee: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  reminderSent: boolean;
  cancelledAt?: string;
  cancelReason?: string;
  completedAt?: string;
  rescheduledFrom?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// USER
// ============================================================

export interface User {
  id: string;
  clerkId?: string;
  email: string;
  phone?: string;
  name: string;
  nameBn?: string;
  avatar?: string;
  gender?: Gender;
  dateOfBirth?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredLanguage: string;
  doctor?: Doctor;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// ============================================================
// API RESPONSE WRAPPERS
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface SearchDoctorsParams {
  query?: string;
  specialtyId?: string;
  specialtySlug?: string;
  districtId?: string;
  districtSlug?: string;
  areaId?: string;
  gender?: Gender;
  minFee?: number;
  maxFee?: number;
  minExperience?: number;
  maxExperience?: number;
  language?: string;
  isAvailableOnline?: boolean;
  isFeatured?: boolean;
  sortBy?: 'relevance' | 'rating' | 'experience' | 'fee_low' | 'fee_high' | 'popular' | 'newest';
  page?: number;
  limit?: number;
}

export type SearchFilters = SearchDoctorsParams;

export interface DoctorSearchResponse {
  doctors: DoctorListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SlotResponse {
  date: string;
  slots: { time: string; booked: boolean }[];
}

// ============================================================
// STATIC DATA SHAPES (used in /data/doctors.ts)
// ============================================================

export interface StaticSpecialty {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
}

export interface StaticDistrict {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
}

export interface StaticStat {
  label: string;
  value: string;
}

// ============================================================
// SLOT
// ============================================================

export interface TimeSlot {
  time: string;
  available: boolean;
  isBooked: boolean;
}

export interface AvailableSlotsResponse {
  available: boolean;
  date: string;
  chamberId: string;
  totalSlots: number;
  availableSlots: number;
  slots: TimeSlot[];
}

// ============================================================
// BLOG
// ============================================================

export interface BlogCategory {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  categoryId?: string;
  category?: BlogCategory;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
