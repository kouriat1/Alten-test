import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Request() req,
    @Body() body: { productId: number; quantity?: number }
  ) {
    return this.cartService.addToCart(req.user.userId, body.productId, body.quantity || 1);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  @Delete('remove/:productId')
  removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, Number(productId));
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
