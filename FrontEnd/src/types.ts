export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  isPromo?: boolean;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}