import { Admin } from 'src/admin/admin.entity';
import { Product } from 'src/product/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: Admin;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
