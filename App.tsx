import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { Product, Order, PaymentStatus, DeliveryStatus } from './types';
import { db, seedDatabase } from './db';

import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MyOrders from './components/MyOrders';
import LoadingSpinner from './components/LoadingSpinner';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const AppContent: React.FC = () => {
    const navigate = useNavigate();
    useScrollToTop();

    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        return sessionStorage.getItem('isAdmin') === 'true';
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingMessage, setLoadingMessage] = useState<string>('데이터를 불러오는 중...');

    useEffect(() => {
        const loadData = async () => {
            try {
                await seedDatabase();
                const allProducts = await db.products.reverse().toArray();
                const allOrders = await db.orders.orderBy('orderDate').reverse().toArray();
                setProducts(allProducts);
                setOrders(allOrders);
            } catch (error) {
                console.error("Failed to load data from DB:", error);
                setLoadingMessage("데이터 로딩에 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const showLoading = (show: boolean, message: string = '처리 중...') => {
        setIsLoading(show);
        if (show) {
            setLoadingMessage(message);
        }
    };

    const handleLogin = () => {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin');
    };

    const handleLogout = () => {
        setIsAdmin(false);
        sessionStorage.removeItem('isAdmin');
        navigate('/');
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...product,
            id: `prod-${new Date().getTime()}`
        };
        await db.products.add(newProduct);
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        alert("상품이 성공적으로 추가되었습니다.");
    };
    
    const deleteProduct = async (productId: string) => {
        await db.products.delete(productId);
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    };

    const addOrder = async (order: Omit<Order, 'id' | 'orderDate' | 'paymentStatus' | 'deliveryStatus'>) => {
        const newOrder: Order = {
            ...order,
            id: `order-${new Date().getTime()}`,
            orderDate: new Date().toISOString(),
            paymentStatus: '결제 대기중',
            deliveryStatus: '배송 준비중'
        };
        await db.orders.add(newOrder);
        setOrders(prevOrders => [newOrder, ...prevOrders]);
    };
    
    const updateOrderStatus = async (
        orderId: string,
        statusType: 'payment' | 'delivery',
        newStatus: PaymentStatus | DeliveryStatus
    ) => {
        // Fix: Use type assertions to narrow down `newStatus` type. This resolves type errors
        // where the `PaymentStatus | DeliveryStatus` union was incompatible with the specific
        // `paymentStatus` or `deliveryStatus` properties required by Dexie and React state.
        const updateData = statusType === 'payment'
            ? { paymentStatus: newStatus as PaymentStatus }
            : { deliveryStatus: newStatus as DeliveryStatus };

        await db.orders.update(orderId, updateData);
        setOrders(prevOrders => prevOrders.map(o => 
            o.id === orderId ? { ...o, ...updateData } : o
        ));
    };

    return (
        <div className="flex flex-col min-h-screen">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center" aria-modal="true" role="dialog">
                    <LoadingSpinner message={loadingMessage} />
                </div>
            )}
            <Header isAdmin={isAdmin} onLogout={handleLogout} />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<ProductList products={products} />} />
                    <Route path="/product/:id" element={<ProductDetail products={products} addOrder={addOrder} showLoading={showLoading} />} />
                    <Route path="/my-orders" element={<MyOrders orders={orders} />} />
                    <Route
                        path="/admin"
                        element={
                            isAdmin ? (
                                <AdminDashboard 
                                    products={products} 
                                    orders={orders}
                                    addProduct={addProduct} 
                                    deleteProduct={deleteProduct} 
                                    updateOrderStatus={updateOrderStatus}
                                    showLoading={showLoading} 
                                />
                            ) : (
                                <AdminLogin onLoginSuccess={handleLogin} />
                            )
                        }
                    />
                </Routes>
            </main>
            <footer className="bg-gray-800 text-white text-center p-4">
                <p>&copy; 2024 구리 성광교회 LMTC 4기. All rights reserved.</p>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
