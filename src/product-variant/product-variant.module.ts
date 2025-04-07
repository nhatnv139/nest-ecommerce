import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
})
export class ProductVariantModule {}
