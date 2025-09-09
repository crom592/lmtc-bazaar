import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - 모든 상품 조회
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('상품 조회 오류:', error)
    return NextResponse.json(
      { error: '상품을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST /api/products - 새 상품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, description, category, images } = body

    // 유효성 검사
    if (!name || !price || !description || !category) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 이미지 개수 제한 (최대 3개)
    if (images && images.length > 3) {
      return NextResponse.json(
        { error: '이미지는 최대 3개까지만 등록할 수 있습니다.' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
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

    // 이미지가 있으면 생성
    if (images && images.length > 0) {
      await Promise.all(
        images.map((image: any, index: number) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: image.imageUrl,
              thumbnailUrl: image.thumbnailUrl,
              order: index + 1,
            }
          })
        )
      )

      // 이미지 포함해서 다시 조회
      const productWithImages = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          images: {
            orderBy: { order: 'asc' }
          }
        }
      })

      return NextResponse.json(productWithImages, { status: 201 })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('상품 생성 오류:', error)
    return NextResponse.json(
      { error: '상품 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}