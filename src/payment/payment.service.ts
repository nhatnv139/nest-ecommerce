import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentTransaction } from './payment.entity/payment-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private paymentRepo: Repository<PaymentTransaction>,
  ) {}

  async createTransaction(orderId: number, method: string, amount: number) {
    const transaction = this.paymentRepo.create({
      orderId,
      paymentMethod: method,
      amount,
      transactionStatus: 'PENDING',
    });
    return this.paymentRepo.save(transaction);
  }

  async confirmPayment(orderId: number) {
    const transactionId = 'FAKE-MOMO-' + Date.now();
    return this.paymentRepo.update(
      { orderId },
      {
        transactionStatus: 'PAID',
        transactionId,
      },
    );
  }

  async findByOrder(orderId: number) {
    return this.paymentRepo.findOne({ where: { orderId } });
  }
}