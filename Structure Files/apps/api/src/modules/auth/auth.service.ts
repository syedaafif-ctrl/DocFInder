import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse, SafeUser } from './interfaces/auth-response.interface';
import { UserRole, UserStatus, User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, phone, role = UserRole.PATIENT } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email address already exists');
    }

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: phone.trim() },
      });
      if (existingPhone) {
        throw new ConflictException('A user with this phone number already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
        role,
        status: UserStatus.ACTIVE,
      },
    });

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshSecret =
        this.configService.get<string>('jwt.refreshSecret') ||
        process.env.JWT_REFRESH_SECRET ||
        'swastha-bd-refresh-secret';

      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException('User is not authorized or account is suspended');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string): Promise<SafeUser & { doctor?: any }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor: {
          select: {
            id: true,
            slug: true,
            title: true,
            isVerified: true,
            verificationStatus: true,
            status: true,
            bmdcNumber: true,
            bmdcVerified: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  private generateTokens(user: { id: string; email: string; role: UserRole }): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const secret =
      this.configService.get<string>('jwt.secret') ||
      process.env.JWT_SECRET ||
      'swastha-bd-secret';
    const expiresIn =
      this.configService.get<string>('jwt.expiresIn') ||
      process.env.JWT_EXPIRES_IN ||
      '15m';

    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      process.env.JWT_REFRESH_SECRET ||
      'swastha-bd-refresh-secret';
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ||
      process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
