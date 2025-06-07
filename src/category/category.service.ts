import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(id: number): string {
    return `category:${id}`;
  }

  private getListCacheKey(): string {
    return 'categories:list';
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    await this.cacheManager.del(this.getListCacheKey());
    return savedCategory;
  }

  async findAll(): Promise<Category[]> {
    const cacheKey = this.getListCacheKey();
    const cachedCategories = await this.cacheManager.get<Category[]>(cacheKey);

    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.categoryRepository.find({
      relations: ['products'],
    });

    await this.cacheManager.set(cacheKey, categories);
    return categories;
  }

  async findOne(id: number): Promise<Category | null> {
    const cacheKey = this.getCacheKey(id);
    const cachedCategory = await this.cacheManager.get<Category>(cacheKey);

    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (category) {
      await this.cacheManager.set(cacheKey, category);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.findOne(id);
    
    // Invalidate caches
    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.del(this.getListCacheKey());
    
    return updatedCategory;
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
    
    // Invalidate caches
    await this.cacheManager.del(this.getCacheKey(id));
    await this.cacheManager.del(this.getListCacheKey());
  }

  async createCategory(name: string, slug: string, description: string, adminId: number): Promise<Category> {
    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await this.categoryRepository.findOne({ 
      where: { slug },
    });
    if (existingCategory) {
      throw new Error('Slug already exists. Please choose another slug.');
    }
  
    const category = this.categoryRepository.create({
      name,
      slug,
      description,
      createdBy: { id: adminId },
    });
    return await this.categoryRepository.save(category);
  }

  async updateCategory(id: number, slug: string, name: string, description: string, adminId: number): Promise<Category | null> {
    await this.categoryRepository.update(id, {
      slug,
      name,
      description,
      updatedBy: { id: adminId },
    });
    return await this.categoryRepository.findOneBy({ id });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}