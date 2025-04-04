

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Admin, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Admin, { nullable: true })  // Liên kết với Admin
  @JoinColumn({ name: 'createdBy' })  // Đặt tên cột là createdBy
  createdBy: Admin;

  @ManyToOne(() => Admin, { nullable: true })  
  @JoinColumn({ name: 'updatedBy' })  
  updatedBy: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}