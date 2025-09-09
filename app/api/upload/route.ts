import { NextRequest, NextResponse } from 'next/server'

// POST /api/upload - 이미지 업로드 (Base64)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      return NextResponse.json(
        { error: '이미지와 파일명이 필요합니다.' },
        { status: 400 }
      )
    }

    // Base64 이미지를 그대로 저장 (실제 프로덕션에서는 클라우드 스토리지 사용 권장)
    const imageUrl = `data:image/jpeg;base64,${image}`
    
    // 썸네일 생성 (클라이언트에서 처리하거나 여기서 Sharp 등을 사용)
    const thumbnailUrl = imageUrl // 간단히 같은 이미지 사용

    return NextResponse.json({
      imageUrl,
      thumbnailUrl,
    })
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}