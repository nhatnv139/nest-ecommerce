// src/user/user.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from '../auth/auth.service';
import { TwoFactorService } from './two-factor.service';
import { 
  ValidationException, 
  ConflictException, 
  InternalServerException 
} from '../common/exceptions/custom.exceptions';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Enable2FADto, Verify2FADto, Disable2FADto } from './dto/two-factor.dto';
import { ConfigService } from '@nestjs/config';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async register(dto: UserRegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

    return { message: 'Registration successful' };
  }

  async login(dto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !(await user.comparePassword(dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
      };
    }

    return this.generateTokens(user);
  }

  async verifyTwoFactor(userId: number, dto: Verify2FADto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.twoFactorService.verifyTwoFactorCode(
      user,
      dto.code,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    return this.generateTokens(user);
  }

  async generateTwoFactor(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.twoFactorService.generateTwoFactorSecret(user);
  }

  async enableTwoFactor(userId: number, dto: Enable2FADto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.twoFactorService.enableTwoFactor(user, dto.code);
    return { message: '2FA enabled successfully' };
  }

  async disableTwoFactor(userId: number, dto: Disable2FADto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.twoFactorService.disableTwoFactor(user, dto.code);
    return { message: '2FA disabled successfully' };
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    // In a real application, you would blacklist the refresh token
    return { message: 'Logged out successfully' };
  }

  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
