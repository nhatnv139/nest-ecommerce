import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Admin } from '../admin/admin.entity';
import { User } from '../user/user.entity';
import * as dotenv from 'dotenv';
import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'nemchua',
  database: process.env.DB_NAME || 'store',
  entities: [Admin, User, Category,Product],
  synchronize: true,
};
