import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { Admin } from './admin.entity';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';

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
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  // quản lý admin

  @UseGuards(JwtAdminAuthGuard)
  @Get('admin-list')
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('admin-detail/:id') 
  async getAdminById(@Param('id') id: string) {
    return this.adminService.findById(Number(id));
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('admin-create')
  async createAdmin(@Req() req: any, @Body() data: CreateAdminDto) {
    return this.adminService.create(req, data);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Put('admin-update/:id')
  async updateAdmin(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: UpdateAdminDto,
  ) {
    return this.adminService.update(req, Number(id), data);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Delete('admin-delete/:id')
  async deleteAdmin(@Request() req, @Param('id') id: string) {
    return this.adminService.delete(req, Number(id));
  }
}
