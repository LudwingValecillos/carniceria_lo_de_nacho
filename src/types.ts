export interface Product {
  id: string;
  name: string;
  price: number | string;  // This is the source of the problem!
  category: string;
  image: string;
  description?: string;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  location: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
}