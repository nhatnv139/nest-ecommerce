import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShippingOrder } from './entities/shipping-order.entity/shipping-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingOrder])],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
