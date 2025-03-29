import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { AdminService } from './admin.service';
  import { AdminRegisterDto } from './dto/admin-register.dto';
  import { AdminLoginDto } from './dto/admin-login.dto';
  import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { Admin } from './admin.entity';
  
  @Controller('admin')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    @Post('register')
    async register(@Body() dto: AdminRegisterDto) {
      
      return this.adminService.register(dto);
    }
  
    @Post('login')
    async login(@Body() dto: AdminLoginDto) {
      return this.adminService.login(dto);
    }
  
    @Post('logout')
    async logout() {
      return this.adminService.logout();
    }
  
    @UseGuards(JwtAdminAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return req.admin;
    }
    
    @UseGuards(JwtAdminAuthGuard)
    @Get('admin')
    async getAllAdmins(): Promise<Admin[]> {
      return this.adminService.findAll();
    }
  }