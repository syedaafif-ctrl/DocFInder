import { UserRole, UserStatus } from '@prisma/client';

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  nameBn?: string | null;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
