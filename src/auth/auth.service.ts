import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token expires in 7 days

    await this.refreshTokenRepository.save({
      token: refreshToken,
      expiresAt,
      userId: payload.userId,
      adminId: payload.adminId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user', 'admin'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      id: token.userId || token.adminId,
      email: token.user?.email || token.admin?.email,
      role: token.admin ? 'admin' : 'user',
    };

    const newAccessToken = this.jwtService.sign(payload);
    return { accessToken: newAccessToken };
  }

  async revokeRefreshToken(token: string) {
    await this.refreshTokenRepository.delete({ token });
  }
} 