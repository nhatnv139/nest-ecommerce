import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  // Tạo đơn giao hàng thủ công (nếu không qua momo webhook)
  @Post('create')
  async createShipping(@Body() body: { orderId: number }) {
    const result = await this.shippingService.createShipping(body.orderId);
    return {
      message: 'Shipping order created',
      data: result,
    };
  }
}
