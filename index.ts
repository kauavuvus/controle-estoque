export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  variations: ProductVariation[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  color: string;
  size: 'P' | 'M' | 'G' | 'GG' | 'G1' | 'G2' | 'G3';
  quantity: number;
}