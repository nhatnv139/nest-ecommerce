import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}
  async create(createProductVariantDto: CreateProductVariantDto) {
    const product = this.productVariantRepository.create({
      ...createProductVariantDto,
      product: { id: createProductVariantDto.productId },
    });
    return await this.productVariantRepository.save(product);
  }

  async findAll(): Promise<ProductVariant[]> {
    return await this.productVariantRepository.find({
      relations: ['product'], // thêm nếu cần include product
    });
  }
  async findOne(id: number): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product'], // thêm nếu cần
    });
    if (!variant) {
      throw new NotFoundException(`ProductVariant with id ${id} not found`);
    }
    return variant;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto): Promise<ProductVariant> {
    const existing = await this.findOne(id);
    const updated = this.productVariantRepository.merge(existing, {
      ...updateProductVariantDto,
      product: updateProductVariantDto.productId ? { id: updateProductVariantDto.productId } : existing.product,
    });
    return await this.productVariantRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.productVariantRepository.remove(existing);
  }
}
