export enum RoleType {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  USER = 3,
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.ADMIN })
  role: RoleType;
}
