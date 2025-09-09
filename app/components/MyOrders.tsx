import React, { useState } from 'react';
import type { OrderWithProduct, PaymentStatus, DeliveryStatus, PaymentStatusReverseMap, DeliveryStatusReverseMap } from '../../types';

interface MyOrdersProps {
  orders: OrderWithProduct[];
}

const StatusBadge: React.FC<{ status: PaymentStatus | DeliveryStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    let colorClasses = "";
    switch (status) {
        case '결제 대기중': colorClasses = 'bg-yellow-100 text-yellow-800'; break;
        case '결제 완료': colorClasses = 'bg-green-100 text-green-800'; break;
        case '배송 준비중': colorClasses = 'bg-blue-100 text-blue-800'; break;
        case '배송 완료': colorClasses = 'bg-gray-200 text-gray-800'; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

const MyOrders: React.FC<MyOrdersProps> = ({ orders }) => {
  const getKoreanStatus = (status: string, type: 'payment' | 'delivery') => {
    if (type === 'payment') {
      return status === 'COMPLETED' ? '결제 완료' : '결제 대기중';
    } else {
      return status === 'COMPLETED' ? '배송 완료' : '배송 준비중';
    }
  };
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPhone = e.target.value.replace(/[^0-9]/g, '');
    let formattedPhone = '';

    if (rawPhone.length > 0) formattedPhone = rawPhone.substring(0, 3);
    if (rawPhone.length > 3) formattedPhone += '-' + rawPhone.substring(3, 7);
    if (rawPhone.length > 7) formattedPhone += '-' + rawPhone.substring(7, 11);
    
    setCustomerPhone(formattedPhone);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSearched(true);
    
    if (!customerName.trim() || !customerPhone.trim()) {
        setError('신청자 이름과 연락처를 모두 입력해주세요.');
        setFilteredOrders([]);
        return;
    }

    const cleanPhone = (phone: string) => phone.replace(/-/g, '');
    const searchPhone = cleanPhone(customerPhone);
    
    const results = orders.filter(
      order =>
        order.customerName === customerName.trim() &&
        cleanPhone(order.customerPhone) === searchPhone
    );
    setFilteredOrders(results);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">신청내역 확인</h2>
      <p className="text-center text-gray-600 mb-6 text-lg">신청하신 분의 성함과 연락처를 정확히 입력해주세요.</p>
      
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <label htmlFor="searchName" className="block text-gray-700 font-semibold mb-2 text-lg">신청자 이름</label>
            <input
              id="searchName"
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="예) 홍길동"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            />
          </div>
           <div className="mb-6">
            <label htmlFor="searchPhone" className="block text-gray-700 font-semibold mb-2 text-lg">연락처</label>
            <input
              id="searchPhone"
              type="tel"
              value={customerPhone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition text-xl">
            내 신청내역 조회하기
          </button>
        </form>
      </div>

      {searched && (
        <div className="max-w-2xl mx-auto mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">조회 결과</h3>
          {filteredOrders.length > 0 ? (
            <ul className="space-y-6">
              {filteredOrders.map(order => (
                <li key={order.id} className="bg-white p-6 border rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <img src={order.product.thumbnailUrl || order.product.imageUrl} alt={order.product.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-xl text-gray-800">{order.product.name}</p>
                    <p className="text-gray-700 text-lg mt-1">수량: {order.quantity}개</p>
                    <p className="text-gray-700 text-lg">총 금액: <span className="font-semibold">{(order.product.price * order.quantity).toLocaleString()}원</span></p>
                    <p className="text-sm text-gray-500 mt-2">신청일: {new Date(order.orderDate).toLocaleString('ko-KR')}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end space-y-2 self-stretch sm:self-center">
                      <StatusBadge status={getKoreanStatus(order.paymentStatus, 'payment') as PaymentStatus} />
                      <StatusBadge status={getKoreanStatus(order.deliveryStatus, 'delivery') as DeliveryStatus} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 bg-gray-50 p-8 rounded-lg text-lg">조회된 신청내역이 없습니다. 입력하신 정보를 다시 확인해주세요.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;