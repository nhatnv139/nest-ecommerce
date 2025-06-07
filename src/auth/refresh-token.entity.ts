import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Admin } from '../admin/admin.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  adminId: number;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Admin, { nullable: true })
  admin: Admin;
} 