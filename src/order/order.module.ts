import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, ProductVariant])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}