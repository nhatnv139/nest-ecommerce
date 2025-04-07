export class CreateOrderDto {
    userId: number;
    paymentMethod: string;
    items: {
      productId: number;
      productVariantId: number;
      quantity: number;
      price: number;
    }[];
  }