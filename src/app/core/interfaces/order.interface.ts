export interface Order {
  id: string;
  orderNumber?: string;
  customer: string;
  customerEmail?: string;
  total: number;
  status: 'Pendiente' | 'Completado' | 'Cancelado' | 'En proceso' | 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado';
  date: string;
  userId?: string;
  items?: OrderItem[];
  shippingInfo?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
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