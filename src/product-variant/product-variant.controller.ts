import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { JwtAdminAuthGuard } from 'src/auth/jwt-admin-auth.guard';

@Controller('admin/product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}
  @UseGuards(JwtAdminAuthGuard)
  @Post()
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.create(createProductVariantDto);
  }
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  findAll() {
    return this.productVariantService.findAll();
  }
  @UseGuards(JwtAdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(+id);
  }
  @UseGuards(JwtAdminAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(+id, updateProductVariantDto);
  }
  @UseGuards(JwtAdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantService.remove(+id);
  }
}
