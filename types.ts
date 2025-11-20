
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'top' | 'bottom' | 'fullbody' | 'accessory' | 'kit';
  description: string;
  sizes: string[];
  colors: string[];
  brand: 'Kaine' | 'Dingdang' | 'Hagarradinhos';
  material: string;
  care: string;
  occasion: string;
  isKit?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
}

export interface UserProfile {
  uid: string;
  isAdmin: boolean;
  email?: string;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: 'Pendente' | 'Enviado' | 'Entregue' | 'Cancelado';
  date: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  author: string;
}

export enum ViewState {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN',
  MIX_MATCH = 'MIX_MATCH',
  GEMINI_TOOLS = 'GEMINI_TOOLS',
  COLLECTIONS = 'COLLECTIONS',
  WISHLIST = 'WISHLIST'
}