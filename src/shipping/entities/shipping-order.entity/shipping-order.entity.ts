import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('shipping_orders')
export class ShippingOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  shippingMethod: string;

  @Column()
  trackingCode: string;

  @Column()
  shippingStatus: string; // PROCESSING, DELIVERED, FAILED

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Order, (order) => order.ShippingOrder)
  @JoinColumn()
  order: Order;
}
