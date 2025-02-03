export interface Product {
  id: string;
  name: string;
  price: number | string;
  category: string;
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  location: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
}