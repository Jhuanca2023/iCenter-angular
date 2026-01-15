export interface Marca {
  id: number;
  name: string;
  description: string;
  logo: string;
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