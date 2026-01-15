export interface Order {
  id: number;
  customer: string;
  customerEmail?: string;
  total: number;
  status: 'Pendiente' | 'Completado' | 'Cancelado' | 'En Proceso';
  date: string;
  items?: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}