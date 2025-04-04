import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn, 
    JoinColumn
  } from 'typeorm';
  import { Category } from 'src/category/category.entity';
  
  @Entity("product")
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @Column()
    stock: number;
  
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;
  
    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;
  
    @Column({ default: 'active' })
    status: string; // active/inactive
  
    @Column({ name: 'approval_status', default: 'pending' })
    approvalStatus: string; // pending/approved/rejected
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }