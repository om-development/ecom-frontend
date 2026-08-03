export interface Product {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  price: string | number;
  description: string;
  category: string;
  image?: string;
  thumbnail?: string;
  brand?: string;
  rating?: number;
  stock?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}
