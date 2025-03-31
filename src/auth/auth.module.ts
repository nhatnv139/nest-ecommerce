import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAdminStrategy } from './jwt.admin.strategy';
import { jwtConstants, jwtAdminConstants } from './constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || jwtConstants.secret, // Default là User secret
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtAdminStrategy],
  exports: [JwtModule],
})
export class AuthModule {}