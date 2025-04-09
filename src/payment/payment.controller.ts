// src/payment/payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrdersService } from '../order/order.service';
import { ShippingService } from '../shipping/shipping.service';

@Controller('momo')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private orderService: OrdersService,
    private shippingService: ShippingService,
  ) {}

  @Post('webhook')
  async momoWebhook(@Body() body: { orderId: number }) {
    await this.paymentService.confirmPayment(body.orderId);
    await this.orderService.updateStatus(body.orderId, 'PAID');
    const shipping = await this.shippingService.createShipping(body.orderId);
    return { message: 'Payment and shipping processed', trackingCode: shipping.trackingCode };
  }
}