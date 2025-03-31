import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtAdminConstants } from './constants';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy,'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAdminConstants.secret,
    });
  }

  async validate(payload: any) {
    
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
