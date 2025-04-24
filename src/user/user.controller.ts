import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { UserRegisterDto } from './dto/user-register.dto';
  import { UserLoginDto } from './dto/user-login.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('register')
    async register(@Body() dto: UserRegisterDto) {
      
      return this.userService.register(dto);
    }
  
    @Post('login')
    async login(@Body() dto: UserLoginDto) {
      return this.userService.login(dto);
    }
  
    @Post('logout')
    async logout() {
      return this.userService.logout();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return req.user;
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getAllUsers(@Query() paginationDto: PaginationDto) {
      const { page, limit } = paginationDto;
      return this.userService.findAll(page, limit);
    }

    

  }