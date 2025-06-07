import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAdminStrategy } from './jwt.admin.strategy';
import { jwtConstants, jwtAdminConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([RefreshToken]),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 5,
    }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || jwtConstants.secret,
        signOptions: { expiresIn: '15m' }, // Access token expires in 15 minutes
      }),
    }),
  ],
  providers: [JwtStrategy, JwtAdminStrategy],
  exports: [JwtModule],
})
export class AuthModule {}