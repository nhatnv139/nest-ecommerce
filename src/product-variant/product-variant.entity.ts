import { Entity, PrimaryGeneratedColumn, ManyToOne,Column, JoinColumn } from 'typeorm';
  import { Product } from 'src/product/product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column()
  mass : string;

  
  @Column()
  stock : number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
