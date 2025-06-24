import { Product } from "../products/Product";

export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product; 
}