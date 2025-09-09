import React, { useState, useMemo } from 'react';
import type { Product, OrderWithProduct, PaymentStatus, DeliveryStatus } from '../../types';
import AddProduct from './AddProduct';

interface AdminDashboardProps {
  products: Product[];
  orders: OrderWithProduct[];
  addProduct: (product: {
    name: string
    price: number
    description: string
    category: string
    images: Array<{ imageUrl: string; thumbnailUrl: string }>
  }) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, statusType: 'payment' | 'delivery', newStatus: PaymentStatus | DeliveryStatus) => Promise<void>;
  showLoading: (show: boolean, message?: string) => void;
}

const StatusBadge: React.FC<{ status: PaymentStatus | DeliveryStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    let colorClasses = "";
    switch (status) {
        case '결제 대기중': colorClasses = 'bg-yellow-100 text-yellow-800'; break;
        case '결제 완료': colorClasses = 'bg-green-100 text-green-800'; break;
        case '배송 준비중': colorClasses = 'bg-blue-100 text-blue-800'; break;
        case '배송 완료': colorClasses = 'bg-gray-100 text-gray-800'; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, addProduct, deleteProduct, updateOrderStatus, showLoading }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  const getKoreanStatus = (status: string, type: 'payment' | 'delivery') => {
    if (type === 'payment') {
      return status === 'COMPLETED' ? '결제 완료' : '결제 대기중';
    } else {
      return status === 'COMPLETED' ? '배송 완료' : '배송 준비중';
    }
  };

  const getEnglishStatus = (status: string, type: 'payment' | 'delivery') => {
    if (type === 'payment') {
      return status === '결제 완료' ? 'COMPLETED' : 'PENDING';
    } else {
      return status === '배송 완료' ? 'COMPLETED' : 'PREPARING';
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`'${productName}' 상품을 정말 삭제하시겠습니까?`)) {
      showLoading(true, '상품을 삭제하고 있습니다...');
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('상품 삭제 중 오류가 발생했습니다.');
      } finally {
        showLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (orderId: string, statusType: 'payment' | 'delivery', newStatus: PaymentStatus | DeliveryStatus) => {
    const typeText = statusType === 'payment' ? '결제' : '배송';
    if(window.confirm(`이 주문의 ${typeText} 상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) {
       showLoading(true, '주문 상태를 업데이트하고 있습니다...');
       try {
        const englishStatus = getEnglishStatus(newStatus, statusType);
        await updateOrderStatus(orderId, statusType, englishStatus as PaymentStatus | DeliveryStatus);
       } catch (error) {
        console.error('Failed to update order status:', error);
        alert('주문 상태 업데이트 중 오류가 발생했습니다.');
       } finally {
        showLoading(false);
       }
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orderSearchTerm.trim()) {
        return orders;
    }
    return orders.filter(order => 
        order.customerName.includes(orderSearchTerm) || 
        order.customerPhone.includes(orderSearchTerm) ||
        order.product.name.includes(orderSearchTerm)
    );
  }, [orders, orderSearchTerm]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">관리자 대시보드</h2>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            주문 관리
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'products' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            상품 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' && (
        <div>
            <div className="mb-10">
                <AddProduct addProduct={addProduct} showLoading={showLoading} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">등록된 상품 목록</h3>
                <div className="bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                    {products.map(product => (
                    <li key={product.id} className="p-4 flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4 flex-1">
                        <img src={product.images?.[0]?.thumbnailUrl || product.images?.[0]?.imageUrl || '/placeholder-image.png'} alt={product.name} className="w-16 h-16 object-cover rounded-md"/>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
                        </div>
                        </div>
                        <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                            {product.category}
                        </span>
                        <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            aria-label={`'${product.name}' 상품 삭제`}
                        >
                            삭제
                        </button>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">전체 주문 관리 ({filteredOrders.length}건)</h3>
            <div className="mb-4">
                <input
                    type="text"
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    placeholder="신청자명, 연락처, 상품명으로 검색..."
                    className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">주문정보</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">신청자</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">결제 상태</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">배송 상태</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img className="h-12 w-12 rounded-md object-cover" src={order.product.images?.[0]?.thumbnailUrl || order.product.images?.[0]?.imageUrl || '/placeholder-image.png'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-base font-medium text-gray-900">{order.product.name}</div>
                                            <div className="text-sm text-gray-500">{order.quantity}개 / {(order.product.price * order.quantity).toLocaleString()}원</div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(order.orderDate).toLocaleString('ko-KR')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                                    <div>{order.customerName}</div>
                                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={getKoreanStatus(order.paymentStatus, 'payment') as PaymentStatus} />
                                    {order.paymentStatus === 'PENDING' && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'payment', '결제 완료')} className="mt-2 ml-1 text-xs bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded">
                                            결제 완료 처리
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={getKoreanStatus(order.deliveryStatus, 'delivery') as DeliveryStatus} />
                                    {order.deliveryStatus === 'PREPARING' && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'delivery', '배송 완료')} className="mt-2 ml-1 text-xs bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">
                                            배송 완료 처리
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredOrders.length === 0 && (
                <p className="text-center text-gray-500 py-10">해당 조건의 주문이 없습니다.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;