// src/products/products.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(id: number): string {
    return `product:${id}`;
  }

  private getListCacheKey(): string {
    return 'products:list';
  }

  private getCategoryProductsCacheKey(categoryId: number): string {
    return `category:${categoryId}:products`;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    
    // Invalidate caches
    await this.cacheManager.del(this.getListCacheKey());
    if (savedProduct.category?.id) {
      await this.cacheManager.del(this.getCategoryProductsCacheKey(savedProduct.category.id));
    }
    
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    const cacheKey = this.getListCacheKey();
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productRepository.find({
      relations: ['category'],
    });

    await this.cacheManager.set(cacheKey, products);
    return products;
  }

  async findOne(id: number): Promise<Product | null> {
    const cacheKey = this.getCacheKey(id);
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (product) {
      await this.cacheManager.set(cacheKey, product);
    }

    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    const cacheKey = this.getCategoryProductsCacheKey(categoryId);
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });

    await this.cacheManager.set(cacheKey, products);
    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const oldProduct = await this.findOne(id);
    if (!oldProduct) return null;

    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOne(id);
    
    // Invalidate caches
    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.del(this.getListCacheKey());
    if (oldProduct.category?.id) {
      await this.cacheManager.del(this.getCategoryProductsCacheKey(oldProduct.category.id));
    }
    if (updatedProduct?.category?.id && updatedProduct.category.id !== oldProduct.category?.id) {
      await this.cacheManager.del(this.getCategoryProductsCacheKey(updatedProduct.category.id));
    }
    
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    if (!product) return;

    await this.productRepository.delete(id);
    
    // Invalidate caches
    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.del(this.getListCacheKey());
    if (product.category?.id) {
      await this.cacheManager.del(this.getCategoryProductsCacheKey(product.category.id));
    }
  }
}