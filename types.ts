
import { Product as PrismaProduct, ProductImage as PrismaProductImage, Order as PrismaOrder, Customer as PrismaCustomer, PaymentStatus as PrismaPaymentStatus, DeliveryStatus as PrismaDeliveryStatus } from '@prisma/client'

export interface ProductImage extends PrismaProductImage {}

export interface Product extends PrismaProduct {
  images?: ProductImage[];
}

export interface Customer extends PrismaCustomer {}

export interface OrderWithProduct extends PrismaOrder {
  product: Product;
  customer?: Customer;
}

export type PaymentStatus = '결제 대기중' | '결제 완료';
export type DeliveryStatus = '배송 준비중' | '배송 완료';

// Status mapping helpers
export const PaymentStatusMap = {
  '결제 대기중': 'PENDING' as PrismaPaymentStatus,
  '결제 완료': 'COMPLETED' as PrismaPaymentStatus,
}

export const PaymentStatusReverseMap = {
  'PENDING': '결제 대기중' as PaymentStatus,
  'COMPLETED': '결제 완료' as PaymentStatus,
}

export const DeliveryStatusMap = {
  '배송 준비중': 'PREPARING' as PrismaDeliveryStatus,
  '배송 완료': 'COMPLETED' as PrismaDeliveryStatus,
}

export const DeliveryStatusReverseMap = {
  'PREPARING': '배송 준비중' as DeliveryStatus,
  'COMPLETED': '배송 완료' as DeliveryStatus,
}