import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/products/[id] - 상품 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()

    const { name, price, description, category, images } = body

    if (!name || !price || !description || !category) {
      return NextResponse.json(
        { error: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 기존 이미지 삭제
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    // 새 이미지 추가
    const imageData = images?.map((img: any, index: number) => ({
      productId: id,
      imageUrl: img.imageUrl,
      thumbnailUrl: img.thumbnailUrl,
      order: index + 1,
    })) || []

    if (imageData.length > 0) {
      await prisma.productImage.createMany({
        data: imageData,
      })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseInt(price),
        description,
        category,
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('상품 수정 오류:', error)
    return NextResponse.json(
      { error: '상품 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

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