import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAdminAuthGuard } from 'src/auth/jwt-admin-auth.guard';
import { Category } from './category.entity';

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(JwtAdminAuthGuard)
  @Get('')
  async getAllCategory(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
  // ✅ API: Tạo danh mục
  @Post()
  @UseGuards(JwtAdminAuthGuard)
  async createCategory(@Body() body, @Request() req) {
    return this.categoryService.createCategory(
      body.name,
      body.slug,
      body.description,
      req.user.id,
    );
  }

  // ✅ API: Cập nhật danh mục
  @Put(':id')
  @UseGuards(JwtAdminAuthGuard)
  async updateCategory(@Param('id') id: number, @Body() body, @Request() req) {
    return this.categoryService.updateCategory(
      id,
      body.slug,
      body.name,
      body.description,
      req.user.id,
    );
  }

  // ✅ API: Xóa danh mục
  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
