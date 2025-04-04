import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  findAll(): Category[] | PromiseLike<Category[]> {
     return this.categoryRepository.find();
  }
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}


  async createCategory(name: string, slug: string, description: string, adminId: number) {
    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
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

  async updateCategory(id: number,slug: string,  name: string, description: string, adminId: number) {
    await this.categoryRepository.update(id, {
      slug,
      name,
      description,
      updatedBy: { id: adminId },
    });
    const updatedCategory = await this.categoryRepository.findOneBy( { id });
    
    return updatedCategory
  }

  async deleteCategory(id: number) {
    return await this.categoryRepository.delete(id);
  }
}