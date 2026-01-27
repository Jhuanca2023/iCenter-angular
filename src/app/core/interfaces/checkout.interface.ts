export type ShippingType = 'normal' | 'express';

export interface ShippingAddress {
  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

export interface CheckoutCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: ShippingAddress;
  shippingType: ShippingType;
}

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
}

export interface CheckoutInitResponse {
  orderId: string;
  clientSecret: string;
  expiresAt: string;
  totals: CheckoutTotals;
}
