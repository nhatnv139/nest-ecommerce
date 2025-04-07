import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn, 
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { Category } from 'src/category/category.entity';
  import { ProductVariant } from 'src/product-variant/product-variant.entity';
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

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];
  
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
      dailySales: any;
  }