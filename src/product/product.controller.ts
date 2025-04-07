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
  import { ProductsService } from './product.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAdminAuthGuard } from 'src/auth/jwt-admin-auth.guard';
  
  @Controller('admin/product')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
     @UseGuards(JwtAdminAuthGuard)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
    }
    @UseGuards(JwtAdminAuthGuard)
    @Get()
    findAll() {
      return this.productsService.findAll();
    }
    @UseGuards(JwtAdminAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.productsService.findOne(+id);
    }
    @UseGuards(JwtAdminAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productsService.update(+id, updateProductDto);
    }
    @UseGuards(JwtAdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.productsService.remove(+id);
    }
  }