import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId: userId.toString(), productId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity } },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId: userId.toString(),
        productId,
        quantity,
      },
    });
  }

  async getUserCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId: userId.toString() },
      include: { product: true },
    });
  }

  async removeItem(userId: number, productId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId: userId.toString(), productId },
    });
  }

  async clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({ where: { userId: userId.toString() } });
  }
}
