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

    // deliveryAddress 필드가 없는 기존 데이터를 위한 호환성 처리
    const ordersWithDeliveryAddress = orders.map(order => {
      const orderObj = { ...order }

      // deliveryAddress 필드가 존재하지 않으면 null로 설정
      if (!orderObj.hasOwnProperty('deliveryAddress')) {
        orderObj.deliveryAddress = null
      }

      return orderObj
    })

    return NextResponse.json(ordersWithDeliveryAddress)
  } catch (error) {
    console.error('주문 조회 오류:', error)

    // 데이터베이스 연결 오류 체크
    if (error.message?.includes('Environment variable not found: DATABASE_URL')) {
      return NextResponse.json(
        { error: '데이터베이스 설정이 필요합니다. .env.local 파일에 DATABASE_URL을 설정해주세요.' },
        { status: 500 }
      )
    }

    // 스키마 오류 체크
    if (error.message?.includes('Unknown column') || error.message?.includes('deliveryAddress')) {
      return NextResponse.json(
        { error: '데이터베이스 스키마를 업데이트해주세요. npx prisma db push 명령을 실행하세요.' },
        { status: 500 }
      )
    }

    console.error('Error details:', error.message)
    return NextResponse.json(
      { error: '주문을 불러오는데 실패했습니다.', details: error.message },
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

    // deliveryAddress 필드가 스키마에 있는지 확인하고 조건부로 추가
    const orderData = {
      productId,
      customerId: customer.id,
      quantity: parseInt(quantity),
      customerName, // 호환성을 위해 유지
      customerPhone, // 호환성을 위해 유지
    }

    // deliveryAddress 필드가 스키마에 있다면 추가
    try {
      // deliveryAddress 필드가 있는지 테스트
      await prisma.order.findFirst({
        select: { deliveryAddress: true },
        take: 0
      })
      // 성공하면 deliveryAddress 필드가 존재함
      orderData.deliveryAddress = customerAddress
    } catch (schemaError) {
      console.warn('deliveryAddress 필드가 스키마에 없음, 제외함')
    }

    const order = await prisma.order.create({
      data: orderData,
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