
import { Product } from './types';

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Gadgets', 'Health'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smart Ultra Watch v2',
    category: 'Electronics',
    price: 4500,
    description: 'High-performance smartwatch with health tracking and OLED display.',
    rating: 4.8,
    stock: 12,
    image: 'https://picsum.photos/seed/watch/400/400'
  },
  {
    id: '2',
    name: 'Pro Noise Cancelling Buds',
    category: 'Gadgets',
    price: 3200,
    description: 'Superior audio quality with active noise cancellation and long battery life.',
    rating: 4.5,
    stock: 25,
    image: 'https://picsum.photos/seed/buds/400/400'
  },
  {
    id: '3',
    name: 'Minimalist Leather Wallet',
    category: 'Fashion',
    price: 1500,
    description: 'Genuine leather, slim profile wallet for modern lifestyles.',
    rating: 4.2,
    stock: 50,
    image: 'https://picsum.photos/seed/wallet/400/400'
  },
  {
    id: '4',
    name: 'Smart RGB Desk Lamp',
    category: 'Home',
    price: 2800,
    description: 'Voice controlled desk lamp with millions of colors and adjustable brightness.',
    rating: 4.7,
    stock: 8,
    image: 'https://picsum.photos/seed/lamp/400/400'
  },
  {
    id: '5',
    name: 'Ergonomic Mechanical Keyboard',
    category: 'Electronics',
    price: 6500,
    description: 'Tactile switches with customizable RGB backlighting and premium build.',
    rating: 4.9,
    stock: 5,
    image: 'https://picsum.photos/seed/keyboard/400/400'
  },
  {
    id: '6',
    name: 'Oversized Cotton Hoodie',
    category: 'Fashion',
    price: 1800,
    description: 'Premium heavyweight cotton hoodie for maximum comfort and style.',
    rating: 4.4,
    stock: 30,
    image: 'https://picsum.photos/seed/hoodie/400/400'
  },
  {
    id: '7',
    name: 'Smart Fitness Ring',
    category: 'Health',
    price: 12000,
    description: 'Discreet and accurate health monitoring ring for sleep and activity.',
    rating: 4.6,
    stock: 10,
    image: 'https://picsum.photos/seed/ring/400/400'
  },
  {
    id: '8',
    name: 'Portable Espresso Maker',
    category: 'Gadgets',
    price: 4200,
    description: 'Enjoy high-quality coffee anywhere with this manual portable maker.',
    rating: 4.3,
    stock: 15,
    image: 'https://picsum.photos/seed/coffee/400/400'
  }
];
