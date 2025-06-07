import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query,
    Headers,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { UserRegisterDto } from './dto/user-register.dto';
  import { UserLoginDto } from './dto/user-login.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Enable2FADto, Verify2FADto, Disable2FADto } from './dto/two-factor.dto';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('user')
@UseGuards(ThrottlerGuard)
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

  @Post('verify-2fa')
  async verifyTwoFactor(
    @Body() dto: Verify2FADto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.verifyTwoFactor(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generateTwoFactor(@Request() req: RequestWithUser) {
    return this.userService.generateTwoFactor(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enableTwoFactor(
    @Request() req: RequestWithUser,
    @Body() dto: Enable2FADto,
  ) {
    return this.userService.enableTwoFactor(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disableTwoFactor(
    @Request() req: RequestWithUser,
    @Body() dto: Disable2FADto,
  ) {
    return this.userService.disableTwoFactor(req.user.userId, dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('refresh-token') refreshToken: string) {
    return this.userService.logout(refreshToken);
  }

  @Post('refresh-token')
  async refreshToken(@Headers('refresh-token') refreshToken: string) {
    return this.userService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.userService.findAll(page, limit);
  }
}