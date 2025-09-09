import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreImages() {
  console.log('이미지 데이터 복원 시작...')

  // 임시 테이블에서 이미지 데이터 조회 및 새 구조로 이동
  const tempImages = await prisma.$queryRaw<Array<{
    product_id: string
    image_url: string
    thumbnail_url: string | null
  }>>`SELECT product_id, image_url, thumbnail_url FROM temp_product_images`

  console.log(`${tempImages.length}개 이미지를 복원합니다.`)

  for (const image of tempImages) {
    await prisma.productImage.create({
      data: {
        productId: image.product_id,
        imageUrl: image.image_url,
        thumbnailUrl: image.thumbnail_url,
        order: 1, // 첫 번째 이미지로 설정
      }
    })
    console.log(`상품 ${image.product_id}의 이미지 복원 완료`)
  }

  // 임시 테이블 정리
  await prisma.$executeRaw`DROP TABLE IF EXISTS temp_product_images`
  
  console.log('이미지 데이터 복원 완료!')
}

restoreImages()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })