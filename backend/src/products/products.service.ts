import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  private transformProduct(product: any) {
    if (!product) {
      return null;
    }
    if (typeof product.id === 'bigint') {
      return {
        ...product,
        id: product.id.toString(),
      };
    }
    return product;
  }

  async findAll() {
  const products = await this.prisma.product.findMany();
    return products.map(product => this.transformProduct(product));
  }


  async findOne(id: number | bigint | string) {
    const productId = typeof id === 'string' ? Number(id) : typeof id === 'bigint' ? Number(id) : id;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    return this.transformProduct(product);
    
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...dto,
        code: `PROD-${Date.now()}`,
        image: '',
        quantity: 0,
        internalReference: `INT-${Date.now()}`,
        shellId: 0,
        inventoryStatus: 'INSTOCK',
        rating: 0,
      },
    });
  }

  async update(id: number | string, data: any) {
  const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
  const updatedProduct = await this.prisma.product.update({
    where: { id: parsedId },
    data
  });
  return this.transformProduct(updatedProduct);
}

async remove(id: number | string) {
  const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
  const deletedProduct = await this.prisma.product.delete({
    where: { id: parsedId }
  });
  return this.transformProduct(deletedProduct);
}

}
