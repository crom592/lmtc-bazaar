import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaymentStatus, DeliveryStatus } from '@prisma/client'

// PATCH /api/orders/[id] - 주문 상태 업데이트 및 수정
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()
    const { paymentStatus, deliveryStatus, quantity, deliveryAddress, customerName, customerPhone } = body

    const updateData: any = {}

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus as PaymentStatus
    }

    if (deliveryStatus) {
      updateData.deliveryStatus = deliveryStatus as DeliveryStatus
    }

    if (quantity !== undefined) {
      updateData.quantity = parseInt(quantity)
    }

    // deliveryAddress 필드가 스키마에 있는지 확인하고 조건부로 추가
    if (deliveryAddress !== undefined) {
      try {
        // deliveryAddress 필드가 있는지 테스트
        await prisma.order.findFirst({
          select: { deliveryAddress: true },
          take: 0
        })
        // 성공하면 deliveryAddress 필드가 존재함
        updateData.deliveryAddress = deliveryAddress
      } catch (schemaError) {
        console.warn('deliveryAddress 필드가 스키마에 없음, 업데이트에서 제외함')
      }
    }

    if (customerName) {
      updateData.customerName = customerName
    }

    if (customerPhone) {
      updateData.customerPhone = customerPhone
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(order)
  } catch (error) {
    console.error('주문 업데이트 오류:', error)
    return NextResponse.json(
      { error: '주문 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - 주문 취소/삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params

    await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json({ message: '주문이 성공적으로 취소되었습니다.' })
  } catch (error) {
    console.error('주문 삭제 오류:', error)
    return NextResponse.json(
      { error: '주문 취소에 실패했습니다.' },
      { status: 500 }
    )
  }
}