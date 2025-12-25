
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  rating: number;
  stock: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Home' | 'Gadgets' | 'Health';
