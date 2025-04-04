import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product } from './product.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule, // Đảm bảo đã import CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}