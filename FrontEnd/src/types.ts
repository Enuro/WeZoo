export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  isPromo?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}