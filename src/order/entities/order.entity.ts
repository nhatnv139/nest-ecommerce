import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ShippingOrder } from 'src/shipping/entities/shipping-order.entity/shipping-order.entity';
import { PaymentTransaction } from 'src/payment/payment.entity/payment-transaction.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ name: 'status', default: 'pending' })
  status: string;

  @Column({ name: 'paymentMethod', nullable: true })
  paymentMethod: string;

  @Column({ name: 'totalAmount', nullable: true })
  totalAmount: Number;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => ShippingOrder, (ShippingOrder) => ShippingOrder.orderId, {
    cascade: true,
  })
  ShippingOrder: ShippingOrder;

  @OneToOne(() => PaymentTransaction, (payment) => payment.orderId, {
    cascade: true,
  })
  payment: PaymentTransaction;
}
