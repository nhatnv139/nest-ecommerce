import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './payment.entity/payment-transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ShippingModule } from 'src/shipping/shipping.module';
import { OrdersModule } from 'src/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction]),
    forwardRef(() => OrdersModule), // ✅
    ShippingModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
