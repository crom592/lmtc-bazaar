import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/products/[id] - 상품 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: '상품이 삭제되었습니다.' })
  } catch (error) {
    console.error('상품 삭제 오류:', error)
    return NextResponse.json(
      { error: '상품 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}