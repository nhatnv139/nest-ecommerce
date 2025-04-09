import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { OrdersModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShippingModule } from './shipping.module';
import { PaymentModule } from './payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    AdminModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    ProductVariantModule,
    OrdersModule,
    ShippingModule,
    PaymentModule,
  ],
})
export class AppModule {}