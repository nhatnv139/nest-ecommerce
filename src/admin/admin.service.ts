
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Admin, RoleType } from './admin.entity';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';

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
    
    const payload = { id: Admin.id, email: Admin.email, role: Admin.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Đăng xuất thành công' };
  }

  // async findById(id: number): Promise<Admin | null> {
  //   return this.adminRepository.findOneBy({ id });
  // }
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

   // Lấy chi tiết admin theo ID
   async findById(id: number): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneBy({ id });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }
  private async checkSuperAdminPrivileges(@Req() req: any): Promise<void> {
    
    const adminId = req 

    if (!adminId) {
      throw new UnauthorizedException('Invalid token or missing admin ID');
    }

    const admin = await this.adminRepository.findOneBy({ id: adminId });
    

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    if (admin.role !== RoleType.SUPER_ADMIN) {
      throw new UnauthorizedException('Only SUPER_ADMIN can perform this action');
    }
  }

  private async validateEmailUniqueness(email: string, excludeId?: number): Promise<void> {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email },
    });

    if (existingAdmin && existingAdmin.id !== excludeId) {
      throw new ConflictException('Email is already registered');
    }
  }


  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }


  async create(req: any,data: CreateAdminDto ): Promise<Admin> {
    console.log(3333,req.user.role);
    const adminId = req.user.role
    
    await this.checkSuperAdminPrivileges(adminId);
  if(adminId == RoleType.SUPER_ADMIN ){
    await this.validateEmailUniqueness(data.email);
    const hashedPassword = await this.hashPassword(data.password);
    const newAdmin = this.adminRepository.create({
      ...data,
      password: hashedPassword,
    });
  
    console.log(433432312,newAdmin);
    
    return this.adminRepository.save(newAdmin);
  }else{
    throw new BadRequestException('bạn ko có quyền tạo admin mới');
  }
  
  }

  async update(req: any,id: number, data: UpdateAdminDto): Promise<Admin> {
    await this.checkSuperAdminPrivileges(req.user.role);

    const existingAdmin = await this.adminRepository.findOneBy({ id });

    if (!existingAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

if(req.user.role == RoleType.SUPER_ADMIN ){
  
  await this.adminRepository.update(id, data);
  
  const updatedAdmin = await this.adminRepository.findOneBy({ id });
  if (!updatedAdmin) {
    throw new NotFoundException(`Admin with ID ${id} was deleted or not found`);
  }
  
  return updatedAdmin;
}
else{

  throw new BadRequestException('Cannot assign SUPER_ADMIN role');
}
  }
  async delete(req: any,id: number): Promise<void> {
    await this.checkSuperAdminPrivileges(req.user.role);
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}
