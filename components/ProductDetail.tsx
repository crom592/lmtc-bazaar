import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product, Order } from '../types';
import Modal from './Modal';

interface ProductDetailProps {
  products: Product[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'paymentStatus' | 'deliveryStatus'>) => Promise<void>;
  showLoading: (show: boolean, message?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addOrder, showLoading }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!product) {
    return <div className="text-center py-10">상품을 찾을 수 없습니다.</div>;
  }
  
  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};
    const nameRegex = /^[가-힣a-zA-Z\s]{2,}$/; // At least 2 characters, Hangul, English, spaces
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    if (!customerName.trim() || !nameRegex.test(customerName.trim())) {
      newErrors.name = '올바른 이름을 입력해주세요 (2자 이상, 한글/영문).';
    }

    if (!customerPhone.trim() || !phoneRegex.test(customerPhone.trim())) {
      newErrors.phone = '올바른 휴대폰 번호 형식(010-1234-5678)으로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showLoading(true, '신청 내역을 처리 중입니다...');
      try {
        await addOrder({ product, quantity, customerName, customerPhone });
        setIsModalOpen(true);
      } catch (error) {
        console.error("Order submission failed:", error);
        alert("신청에 실패했습니다. 다시 시도해주세요.");
      } finally {
        showLoading(false);
      }
    }
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
  
  const closeModalAndNavigate = () => {
    setIsModalOpen(false);
    navigate('/my-orders');
  };

  return (
    <div className="container mx-auto px-6 py-12">
       <Modal isOpen={isModalOpen} onClose={closeModalAndNavigate} title="신청 완료">
        <p className="text-gray-700 mb-4">상품 신청이 성공적으로 완료되었습니다.</p>
        <button onClick={closeModalAndNavigate} className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition">
          신청내역 확인하기
        </button>
      </Modal>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
        <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-bold text-orange-600 my-4">{product.price.toLocaleString()}원</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <form onSubmit={handleOrderSubmit} noValidate>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">수량</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                 <div className="mb-4">
                    <label htmlFor="customerName" className="block text-gray-700 font-semibold mb-2">신청자 이름</label>
                    <input
                        id="customerName"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                        placeholder="홍길동"
                        required
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby="name-error"
                    />
                    {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                 <div className="mb-6">
                    <label htmlFor="customerPhone" className="block text-gray-700 font-semibold mb-2">연락처</label>
                    <input
                        id="customerPhone"
                        type="tel"
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        maxLength={13}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                        placeholder="010-1234-5678"
                        required
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby="phone-error"
                    />
                     {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-300 text-lg">
                    신청하기
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;