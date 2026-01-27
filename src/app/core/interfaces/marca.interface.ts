export interface Marca {
  id: string;
  name: string;
  description?: string;
  categories: string[];
  visible: boolean;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarcaFilters {
  category?: string;
  search?: string;
  visible?: boolean;
}