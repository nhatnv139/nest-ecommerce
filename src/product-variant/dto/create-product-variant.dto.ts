// export class CreateProductVariantDto {}
import { 
    IsString, 
    IsNumber, 
    IsUrl, 
    IsOptional, 
    IsPositive 
  } from 'class-validator';
  
  export class CreateProductVariantDto {
    @IsString()
    color: string;
  
    @IsString()
    size?: string;

    @IsString()
    @IsOptional()
    mass?: string;
  
    @IsNumber()
    @IsPositive()
    price: number;
  
    @IsNumber()
    @IsPositive()
    stock: number;
  
    @IsNumber()
    productId: number;
  
    // @IsUrl()
    // @IsOptional()
    // imageUrl?: string;
  }
  
