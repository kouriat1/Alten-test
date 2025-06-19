import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  internalReference: string;

  @ApiProperty()
  shellId: number;

  @ApiProperty({ enum: ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'] })
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
