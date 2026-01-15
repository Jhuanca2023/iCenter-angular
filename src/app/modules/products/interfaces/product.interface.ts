export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  stock?: number;
  brand?: string;
  tags?: string[];
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
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
