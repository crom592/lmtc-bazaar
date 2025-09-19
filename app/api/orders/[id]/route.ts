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

    if (deliveryAddress !== undefined) {
      updateData.deliveryAddress = deliveryAddress
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