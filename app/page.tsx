'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Product, OrderWithProduct, PaymentStatus, DeliveryStatus } from '../types'

import Header from './components/Header'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import MyOrders from './components/MyOrders'
import LoadingSpinner from './components/LoadingSpinner'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 'home'
  const productId = searchParams.get('id')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isAdmin') === 'true'
    }
    return false
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingMessage, setLoadingMessage] = useState<string>('데이터를 불러오는 중...')

  // API 호출 함수들
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('상품 조회 실패')
      return await response.json()
    } catch (error) {
      console.error('상품 조회 오류:', error)
      throw error
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('주문 조회 실패')
      return await response.json()
    } catch (error) {
      console.error('주문 조회 오류:', error)
      throw error
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          fetchProducts(),
          fetchOrders()
        ])
        setProducts(productsData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to load data:", error)
        setLoadingMessage("데이터 로딩에 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const showLoading = (show: boolean, message: string = '처리 중...') => {
    setIsLoading(show)
    if (show) {
      setLoadingMessage(message)
    }
  }

  const handleLogin = () => {
    setIsAdmin(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isAdmin', 'true')
    }
    router.push('/?page=admin')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('isAdmin')
    }
    router.push('/')
  }

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      
      if (!response.ok) throw new Error('상품 추가 실패')
      
      const newProduct = await response.json()
      setProducts(prev => [newProduct, ...prev])
      alert("상품이 성공적으로 추가되었습니다.")
    } catch (error) {
      console.error('상품 추가 오류:', error)
      alert('상품 추가 중 오류가 발생했습니다.')
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('상품 삭제 실패')
      
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (error) {
      console.error('상품 삭제 오류:', error)
      alert('상품 삭제 중 오류가 발생했습니다.')
    }
  }

  const addOrder = async (orderData: {
    productId: string
    quantity: number
    customerName: string
    customerPhone: string
    customerEmail?: string
    customerAddress?: string
  }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      
      if (!response.ok) throw new Error('주문 생성 실패')
      
      const newOrder = await response.json()
      setOrders(prev => [newOrder, ...prev])
    } catch (error) {
      console.error('주문 생성 오류:', error)
      throw error
    }
  }

  const updateOrderStatus = async (
    orderId: string,
    statusType: 'payment' | 'delivery',
    newStatus: PaymentStatus | DeliveryStatus
  ) => {
    try {
      const updateData = statusType === 'payment' 
        ? { paymentStatus: newStatus === '결제 완료' ? 'COMPLETED' : 'PENDING' }
        : { deliveryStatus: newStatus === '배송 완료' ? 'COMPLETED' : 'PREPARING' }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      
      if (!response.ok) throw new Error('주문 상태 업데이트 실패')
      
      const updatedOrder = await response.json()
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
      alert('주문 상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'product':
        if (!productId) return <ProductList products={products} />
        return (
          <ProductDetail 
            products={products} 
            productId={productId}
            addOrder={addOrder} 
            showLoading={showLoading} 
          />
        )
      case 'my-orders':
        return <MyOrders orders={orders} />
      case 'admin':
        return isAdmin ? (
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
      default:
        return <ProductList products={products} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center" aria-modal="true" role="dialog">
          <LoadingSpinner message={loadingMessage} />
        </div>
      )}
      <Header isAdmin={isAdmin} onLogout={handleLogout} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 구리 성광교회 LMTC 4기. All rights reserved.</p>
      </footer>
    </div>
  )
}