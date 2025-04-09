import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import { User } from '../user/user.entity';
import * as dotenv from 'dotenv';
import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { ProductVariant } from 'src/product-variant/product-variant.entity';
import { ProductDailySales } from 'src/share/entity/product-daily-sales.entity';
import { ShippingOrder } from 'src/shipping/entities/shipping-order.entity/shipping-order.entity';
import { PaymentTransaction } from 'src/payment/payment.entity/payment-transaction.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'nemchua',
  database: process.env.DB_NAME || 'store',
  entities: [
    Admin,
    User,
    Category,
    Product,
    ProductVariant,
    Order,
    OrderItem,
    ProductDailySales,
    ShippingOrder,
    PaymentTransaction,
  ],
  synchronize: true,
};
