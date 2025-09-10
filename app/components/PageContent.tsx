'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Product, OrderWithProduct, PaymentStatus, DeliveryStatus } from '../../types'

import Header from './Header'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import MyOrders from './MyOrders'
import LoadingSpinner from './LoadingSpinner'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 'home'
  const productId = searchParams.get('id')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('')

  const showLoading = (show: boolean, message: string = '') => {
    setIsLoading(show)
    setLoadingMessage(message)
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('상품 로딩 실패:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('주문 로딩 실패:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      showLoading(true, '데이터를 로딩하고 있습니다...')
      await Promise.all([fetchProducts(), fetchOrders()])
      showLoading(false)
    }
    loadData()
  }, [])

  const addProduct = async (productData: {
    name: string
    price: number
    description: string
    category: string
    images: Array<{ imageUrl: string; thumbnailUrl: string }>
  }) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) throw new Error('상품 추가 실패')

      const newProduct = await response.json()
      setProducts(prev => [newProduct, ...prev])
    } catch (error) {
      console.error('상품 추가 오류:', error)
      throw error
    }
  }

  const updateProduct = async (productId: string, productData: {
    name: string
    price: number
    description: string
    category: string
    images: Array<{ imageUrl: string; thumbnailUrl: string }>
  }) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) throw new Error('상품 수정 실패')

      const updatedProduct = await response.json()
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p))
    } catch (error) {
      console.error('상품 수정 오류:', error)
      throw error
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
      throw error
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
        ? { paymentStatus: newStatus }
        : { deliveryStatus: newStatus }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) throw new Error('주문 상태 업데이트 실패')

      const updatedOrder = await response.json()
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      )
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
      throw error
    }
  }

  const handleAdminLogin = () => {
    setIsAdmin(true)
    router.push('/?page=admin-dashboard')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    router.push('/')
  }

  const renderPage = () => {
    if (page === 'admin') {
      return isAdmin ? (
        <AdminDashboard
          products={products}
          orders={orders}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          updateOrderStatus={updateOrderStatus}
          showLoading={showLoading}
        />
      ) : (
        <AdminLogin onLoginSuccess={handleAdminLogin} />
      )
    }

    if (page === 'admin-dashboard' && isAdmin) {
      return (
        <AdminDashboard
          products={products}
          orders={orders}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          updateOrderStatus={updateOrderStatus}
          showLoading={showLoading}
        />
      )
    }

    if (page === 'product' && productId) {
      return (
        <ProductDetail
          products={products}
          productId={productId}
          addOrder={addOrder}
          showLoading={showLoading}
        />
      )
    }

    if (page === 'my-orders') {
      return <MyOrders orders={orders} />
    }

    return <ProductList products={products} />
  }

  return (
    <div className="min-h-screen">
      <Header isAdmin={isAdmin} onLogout={handleLogout} />
      <div className="bg-gray-50 min-h-screen">
        {renderPage()}
      </div>
      {isLoading && <LoadingSpinner message={loadingMessage} />}
    </div>
  )
}