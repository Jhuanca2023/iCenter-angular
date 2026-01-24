export interface Product {
  id?: string;
  name: string;
  description: string;
  brand_id: string;
  brand?: string;
  price: number;
  sale_price?: number;
  on_sale?: boolean;
  stock: number;
  weight: string;
  status: string;
  visible: boolean;
  featured?: boolean;
  recommended?: boolean;
  categories?: string[];
  category_names?: string[];
  colors?: ProductColor[];
  image?: string;
  specifications?: { key: string; value: string }[];
  created_at?: string;
  updated_at?: string;
  rating?: number;
  reviews?: number;
}

export interface ClientProduct {
  id: string;
  name: string;
  category: string;
  category_names: string[];
  price: number;
  originalPrice?: number;
  salePrice?: number;
  onSale?: boolean;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  stock?: number;
  brand?: string;
}

export interface ProductColor {
  id?: string;
  name: string;
  hex: string;
  images: string[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  inStock?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilters;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: ClientProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';

export interface ProductRatingSummary {
  productId: string;
  average: number;
  count: number;
  userRating?: number;
}

export interface ProductColorResponse {
  id: string;
  name: string;
  hex: string;
  product_color_images: { image_url: string; order_index: number }[];
}

export interface ProductCategoryResponse {
  category_id: string;
  categories: { name: string }[] | { name: string } | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}
