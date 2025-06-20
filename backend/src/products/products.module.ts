import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [PrismaModule], 
  controllers:[ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
