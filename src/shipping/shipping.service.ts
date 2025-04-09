import { Injectable } from '@nestjs/common';
import { ShippingOrder } from './entities/shipping-order.entity/shipping-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingOrder)
    private shipRepo: Repository<ShippingOrder>,
  ) {}

  async createShipping(orderId: number) {
    const trackingCode = 'GHTK-' + Math.floor(Math.random() * 999999);

    const shipping = this.shipRepo.create({
      orderId,
      shippingMethod: 'GHTK',
      trackingCode,
      shippingStatus: 'PROCESSING',
    });

    return this.shipRepo.save(shipping);
  }
}
