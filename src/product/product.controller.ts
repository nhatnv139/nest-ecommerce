// src/products/products.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    Put,
    UseGuards
  } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/entities/role.enum';
  
  @Controller('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createProductDto: CreateProductDto) {
      return this.productService.create(createProductDto);
    }
    @Get()
    findAll() {
      return this.productService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.productService.findOne(+id);
    }
    @Get('category/:categoryId')
    findByCategory(@Param('categoryId') categoryId: string) {
      return this.productService.findByCategory(+categoryId);
    }
    @Patch(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productService.update(+id, updateProductDto);
    }
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
      return this.productService.remove(+id);
    }
  }