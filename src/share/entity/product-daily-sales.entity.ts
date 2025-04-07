import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/product/product.entity';

@Entity()
export class ProductDailySales {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  totalQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalRevenue: number;

  @Column({ type: 'date' })
  reportDate: Date;

  @ManyToOne(() => Product, (product) => product)
  product: Product;
}
