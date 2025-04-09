import { Injectable, NotFoundException } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { Order } from './entities/order.entity';
 import { OrderItem } from './entities/order-item.entity';
 import { CreateOrderDto } from './dto/create-order.dto';
 import { ProductVariant } from '../product-variant/product-variant.entity';
import { PaymentService } from 'src/payment/payment.service';
 
 @Injectable()
 export class OrdersService {
   constructor(
     @InjectRepository(Order) private orderRepo: Repository<Order>,
     @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
     @InjectRepository(ProductVariant)
     private variantRepo: Repository<ProductVariant>,
     private readonly paymentService: PaymentService,
   ) {}
 
   async create(dto: CreateOrderDto, id: any) {
     const order = this.orderRepo.create({
       userId: id,
       status: 'pending',
       paymentMethod: dto.paymentMethod,
       totalAmount: 0,
     });
     const savedOrder = await this.orderRepo.save(order);
 
     let totalAmount = 0;
 
     for (const item of dto.items) {
       const variant = await this.variantRepo.findOne({
         where: { id: item.productVariantId },
       });
       if (!variant || variant.stock < item.quantity) {
         throw new NotFoundException(
           `ProductVariant ${item.productVariantId} unavailable`,
         );
       }
 
       await this.variantRepo.update(variant.id, {
         stock: variant.stock - item.quantity,
       });
 
       const orderItem = this.orderItemRepo.create({
         order: savedOrder,
         productId: item.productId,
         productVariantId: item.productVariantId,
         quantity: item.quantity,
         price: item.price,
       });
       await this.orderItemRepo.save(orderItem);
 
       totalAmount += item.quantity * item.price;
     }
 
     await this.orderRepo.update(savedOrder.id, {
       totalAmount: totalAmount,
     });
 
     await this.paymentService.createTransaction(
        savedOrder.id,
        dto.paymentMethod,
        totalAmount,
      );
      
      const payUrl = `http://localhost:3000/momo/fake-pay?orderId=${savedOrder.id}`;
      
      return {
        order: await this.findOne(savedOrder.id),
        payUrl,
      };
   }
 
   findAll(userId?: number) {
     if (userId) {
       return this.orderRepo.find({ where: { userId }, relations: ['items'] });
     }
     return this.orderRepo.find({ relations: ['items'] });
   }
 
   async findOne(id: number) {
     const order = await this.orderRepo.findOne({
       where: { id },
       relations: ['items'],
     });
     if (!order) throw new NotFoundException(`Order ${id} not found`);
     return order;
   }
 
   async updateStatus(id: number, status: string) {
    return this.orderRepo.update(id, { status });
   }
 
   async remove(id: number) {
     const order = await this.findOne(id);
     return this.orderRepo.remove(order);
   }
 }