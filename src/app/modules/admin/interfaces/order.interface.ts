export interface Order {
  id: string;
  customer: string;
  customerEmail?: string;
  total: number;
  status: 'Pendiente' | 'Completado' | 'Cancelado' | 'En proceso';
  date: string;
  userId?: string;
  items?: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  colorId?: string;
}

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}