// src/user/user.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: UserRegisterDto): Promise<User> {
    try {
      // Check for missing fields
      if (!dto.email || !dto.password || !dto.name) {
        throw new BadRequestException(
          'Missing required fields: email, password, name',
        );
      }

      // Validate email format manually (if needed in addition to DTO validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        throw new BadRequestException('Invalid email format');
      }

      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email is already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Create new user
      const newUser = this.userRepository.create({
        ...dto,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error during registration:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Registration failed due to unexpected error',
      );
    }
  }

  async login(dto: UserLoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Đăng xuất thành công' };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
