import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Generate2FAResponseDto } from './dto/two-factor.dto';

interface SpeakeasySecret {
  base32: string;
  otpauth_url: string;
}

@Injectable()
export class TwoFactorService {
  private speakeasy: any;
  private QRCode: any;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.initializeDependencies();
  }

  private async initializeDependencies() {
    this.speakeasy = await import('speakeasy');
    this.QRCode = await import('qrcode');
  }

  async generateTwoFactorSecret(user: User): Promise<Generate2FAResponseDto> {
    await this.initializeDependencies();

    const secret = this.speakeasy.generateSecret({
      name: `YourApp:${user.email}`,
    }) as SpeakeasySecret;

    if (!secret.base32 || !secret.otpauth_url) {
      throw new Error('Failed to generate 2FA secret');
    }

    const recoveryCodes = this.generateRecoveryCodes();

    await this.userRepository.update(user.id, {
      twoFactorSecret: secret.base32,
      twoFactorRecoveryCodes: recoveryCodes,
    });

    const qrCode = await this.QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
      recoveryCodes,
    };
  }

  async verifyTwoFactorCode(user: User, code: string): Promise<boolean> {
    if (!user.twoFactorSecret) {
      throw new UnauthorizedException('2FA is not enabled for this user');
    }

    try {
      const result = await this.speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
      });
      return result;
    } catch (error) {
      return false;
    }
  }

  async verifyRecoveryCode(user: User, code: string): Promise<boolean> {
    if (!user.twoFactorRecoveryCodes) {
      return false;
    }

    const recoveryCodes = user.twoFactorRecoveryCodes;
    const index = recoveryCodes.indexOf(code);

    if (index === -1) {
      return false;
    }

    // Remove used recovery code
    recoveryCodes.splice(index, 1);
    await this.userRepository.update(user.id, {
      twoFactorRecoveryCodes: recoveryCodes,
    });

    return true;
  }

  async enableTwoFactor(user: User, code: string): Promise<void> {
    const isValid = await this.verifyTwoFactorCode(user, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.userRepository.update(user.id, {
      isTwoFactorEnabled: true,
    });
  }

  async disableTwoFactor(user: User, code: string): Promise<void> {
    const isValid = await this.verifyTwoFactorCode(user, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.userRepository.update(user.id, {
      isTwoFactorEnabled: false,
      twoFactorSecret: '',
      twoFactorRecoveryCodes: [],
    });
  }

  private generateRecoveryCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      codes.push(this.generateRecoveryCode());
    }
    return codes;
  }

  private generateRecoveryCode(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
} 