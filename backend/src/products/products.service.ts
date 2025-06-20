import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

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

  async create(data: any) {
        const createdProduct = await this.prisma.product.create({ data });
        return this.transformProduct(createdProduct);

  }

  async update(id: number | bigint | string, data: any) {
    const updatedProduct = await this.prisma.product.update({
       where: { id: typeof id === 'string' ? BigInt(id) : id },
      data
    });
    return this.transformProduct(updatedProduct);

  }

  async remove(id: number | bigint | string) {
   const deletedProduct = await this.prisma.product.delete({
      where: { id: typeof id === 'string' ? BigInt(id) : id } 
    });
    return this.transformProduct(deletedProduct);

  }
}
