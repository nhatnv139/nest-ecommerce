
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
import { Admin, RoleType } from './admin.entity';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AdminRegisterDto): Promise<Admin> {

    try {
      // Check for missing fields
      if (!dto.email || !dto.password || !dto.name || !dto.role) {
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
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: dto.email },
      });
      if (existingAdmin) {
        throw new ConflictException('Email is already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Create new Admin
      const newAdmin = this.adminRepository.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: RoleType.SUPER_ADMIN,
      });
      return await this.adminRepository.save(newAdmin);
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

  async login(dto: AdminLoginDto): Promise<{ accessToken: string }> {
    const Admin = await this.adminRepository.findOneBy({ email: dto.email });
    if (!Admin || !(await bcrypt.compare(dto.password, Admin.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const payload = { id: Admin.id, email: Admin.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Đăng xuất thành công' };
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminRepository.findOneBy({ id });
  }
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }
}
