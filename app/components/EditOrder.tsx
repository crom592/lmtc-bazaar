import React, { useState } from 'react';
import type { OrderWithProduct } from '../../types';

interface EditOrderProps {
  order: OrderWithProduct;
  updateOrder: (orderData: {
    quantity: number;
    deliveryAddress: string;
    customerName: string;
    customerPhone: string;
  }) => Promise<void>;
  onCancel: () => void;
  showLoading: (show: boolean, message?: string) => void;
}

const EditOrder: React.FC<EditOrderProps> = ({ order, updateOrder, onCancel, showLoading }) => {
  const [quantity, setQuantity] = useState(order.quantity);
  const [deliveryAddress, setDeliveryAddress] = useState(order.deliveryAddress || '');
  const [customerName, setCustomerName] = useState(order.customerName);
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOrder({
      quantity,
      deliveryAddress,
      customerName,
      customerPhone,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPhone = e.target.value.replace(/[^0-9]/g, '');
    let formattedPhone = '';

    if (rawPhone.length > 0) {
      formattedPhone = rawPhone.substring(0, 3);
    }
    if (rawPhone.length > 3) {
      formattedPhone += '-' + rawPhone.substring(3, 7);
    }
    if (rawPhone.length > 7) {
      formattedPhone += '-' + rawPhone.substring(7, 11);
    }

    setCustomerPhone(formattedPhone);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-bold text-gray-900 mb-4">주문 수정</h3>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={order.product.images?.[0]?.thumbnailUrl || order.product.images?.[0]?.imageUrl || '/placeholder-image.png'}
                alt={order.product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="font-semibold">{order.product.name}</p>
                <p className="text-sm text-gray-500">{order.product.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                수량
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                신청자 이름
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                연락처
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={customerPhone}
                onChange={handlePhoneChange}
                maxLength={13}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="010-1234-5678"
                required
              />
            </div>

            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                배송 주소
              </label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="배송 받으실 주소를 입력해주세요"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                수정 완료
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;