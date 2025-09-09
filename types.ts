
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
}

export type PaymentStatus = '결제 대기중' | '결제 완료';
export type DeliveryStatus = '배송 준비중' | '배송 완료';

export interface Order {
  id: string;
  product: Product;
  quantity: number;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
}