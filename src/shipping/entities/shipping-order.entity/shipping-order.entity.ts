import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}