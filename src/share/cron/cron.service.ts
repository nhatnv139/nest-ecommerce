import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { ProductDailySales } from 'src/share/entity/product-daily-sales.entity';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(ProductDailySales)
    private productSalesRepo: Repository<ProductDailySales>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Chạy lúc 00:00 mỗi ngày
  async calculateDailySales() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    this.logger.log(`Calculating daily sales from ${startOfDay} to ${endOfDay}`);

    const sales = await this.orderItemRepo
      .createQueryBuilder('item')
      .select('item.productId', 'productId')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item.quantity * item.price)', 'totalRevenue')
      .innerJoin('item.order', 'order')
      .where('order.createdAt BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .groupBy('item.productId')
      .getRawMany();

    for (const sale of sales) {
      await this.productSalesRepo.save({
        productId: sale.productId,
        totalQuantity: sale.totalQuantity,
        totalRevenue: sale.totalRevenue,
        reportDate: new Date(startOfDay),
      });
    }

    this.logger.log(`✅ Daily sales calculation done`);
  }

  async getTop10BestSellingProducts(date: Date) {
    return this.productSalesRepo.find({
      where: { reportDate: date },
      order: { totalQuantity: 'DESC' },
      take: 10,
      relations: ['product'], // Nếu bạn có quan hệ với bảng sản phẩm
    });
  }
}
