// src/products/dto/create-product.dto.ts
import { 
    IsString, 
    IsNumber, 
    IsUrl, 
    IsOptional, 
    IsPositive 
  } from 'class-validator';
  
  export class CreateProductDto {
    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsNumber()
    @IsPositive()
    price: number;
  
    @IsNumber()
    @IsPositive()
    stock: number;
  
    @IsNumber()
    categoryId: number;
  
    @IsUrl()
    @IsOptional()
    imageUrl?: string;
  }
  
