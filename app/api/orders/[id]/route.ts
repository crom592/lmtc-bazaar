import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaymentStatus, DeliveryStatus } from '@prisma/client'

// PATCH /api/orders/[id] - 주문 상태 업데이트
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()
    const { paymentStatus, deliveryStatus } = body

    const updateData: any = {}
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus as PaymentStatus
    }
    
    if (deliveryStatus) {
      updateData.deliveryStatus = deliveryStatus as DeliveryStatus
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('주문 업데이트 오류:', error)
    return NextResponse.json(
      { error: '주문 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}