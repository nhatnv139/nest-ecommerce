import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ name: 'status' , default: 'pending' })
  status: string;

  @Column({  name: 'paymentMethod' , nullable: true })
  paymentMethod: string;

  @Column({  name: 'totalAmount', nullable: true })
  totalAmount: Number;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}