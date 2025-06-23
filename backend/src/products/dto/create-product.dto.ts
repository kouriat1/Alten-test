import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {



  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;
  id: any;
}
