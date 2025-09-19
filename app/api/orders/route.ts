import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders - 모든 주문 조회
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' }
            }
          }
        },
        customer: true,
      },
      orderBy: { orderDate: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('주문 조회 오류:', error)
    return NextResponse.json(
      { error: '주문을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST /api/orders - 새 주문 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity, customerName, customerPhone, customerEmail, customerAddress } = body

    // 유효성 검사
    if (!productId || !quantity || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: '존재하지 않는 상품입니다.' },
        { status: 404 }
      )
    }

    // 고객 정보 확인 및 생성/업데이트
    let customer = await prisma.customer.findUnique({
      where: { phone: customerPhone }
    })

    if (customer) {
      // 기존 고객 정보 업데이트
      customer = await prisma.customer.update({
        where: { phone: customerPhone },
        data: {
          name: customerName,
          email: customerEmail || customer.email,
          address: customerAddress || customer.address,
        }
      })
    } else {
      // 새 고객 생성
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: customerAddress,
        }
      })
    }

    const order = await prisma.order.create({
      data: {
        productId,
        customerId: customer.id,
        quantity: parseInt(quantity),
        customerName, // 호환성을 위해 유지
        customerPhone, // 호환성을 위해 유지
        deliveryAddress: customerAddress, // 배송 주소 저장
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { order: 'asc' }
            }
          }
        },
        customer: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('주문 생성 오류:', error)
    return NextResponse.json(
      { error: '주문 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}