import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '../../types';
import Modal from './Modal';

interface ProductDetailProps {
  products: Product[];
  productId: string;
  addOrder: (order: {
    productId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
  }) => Promise<void>;
  showLoading: (show: boolean, message?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, productId, addOrder, showLoading }) => {
  const router = useRouter();
  const product = products.find(p => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return <div className="text-center py-10">상품을 찾을 수 없습니다.</div>;
  }
  
  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    const nameRegex = /^[가-힣a-zA-Z\s]{2,}$/; // At least 2 characters, Hangul, English, spaces
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!customerName.trim() || !nameRegex.test(customerName.trim())) {
      newErrors.name = '올바른 이름을 입력해주세요 (2자 이상, 한글/영문).';
    }

    if (!customerPhone.trim() || !phoneRegex.test(customerPhone.trim())) {
      newErrors.phone = '올바른 휴대폰 번호 형식(010-1234-5678)으로 입력해주세요.';
    }

    if (customerEmail.trim() && !emailRegex.test(customerEmail.trim())) {
      newErrors.email = '올바른 이메일 형식으로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showLoading(true, '신청 내역을 처리 중입니다...');
      try {
        await addOrder({ 
          productId: product.id, 
          quantity, 
          customerName, 
          customerPhone, 
          customerEmail: customerEmail || undefined,
          customerAddress: customerAddress || undefined
        });
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
    router.push('/?page=my-orders');
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
          {product.images && product.images.length > 0 ? (
            <div>
              {/* 메인 이미지 */}
              <div className="relative">
                <img 
                  src={product.images[selectedImageIndex]?.imageUrl} 
                  alt={`${product.name} - 이미지 ${selectedImageIndex + 1}`} 
                  className="w-full h-96 object-cover" 
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images!.length - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ❮
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev < product.images!.length - 1 ? prev + 1 : 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ❯
                    </button>
                  </>
                )}
              </div>
              
              {/* 썸네일 이미지들 */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === index 
                          ? 'border-orange-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image.thumbnailUrl || image.imageUrl} 
                        alt={`썸네일 ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">이미지 없음</span>
            </div>
          )}
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
                 <div className="mb-4">
                    <label htmlFor="customerPhone" className="block text-gray-700 font-semibold mb-2">연락처 <span className="text-red-500">*</span></label>
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
                
                <div className="mb-4">
                    <label htmlFor="customerEmail" className="block text-gray-700 font-semibold mb-2">이메일 <span className="text-gray-500 text-sm">(선택사항)</span></label>
                    <input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                        placeholder="example@email.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby="email-error"
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="customerAddress" className="block text-gray-700 font-semibold mb-2">
                        배송 주소 <span className="text-gray-500 text-sm">(선택사항)</span>
                    </label>
                    <textarea
                        id="customerAddress"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="이 주문의 배송받을 주소를 입력해주세요&#10;예: 경기도 구리시 인창동 123-45 아파트 101동 203호"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                        💡 여러 주문 시 각각 다른 배송지로 받으실 수 있습니다.
                    </p>
                </div>

                {/* 입금 계좌 정보 */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">💳 입금 계좌 안내</h3>
                    <div className="text-blue-700">
                        <p className="font-medium">토스뱅크 1000-2682-2721</p>
                        <p className="text-sm">예금주: 신현숙</p>
                        <p className="text-xs text-blue-600 mt-1">신청 후 위 계좌로 입금해주시면 됩니다.</p>
                    </div>
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