import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateImages() {
  console.log('기존 이미지 데이터 마이그레이션 시작...')

  // 기존 상품들의 이미지 데이터 조회
  const products = await prisma.$queryRaw<Array<{
    id: string
    imageUrl: string | null
    thumbnailUrl: string | null
  }>>`SELECT id, "imageUrl", "thumbnailUrl" FROM products WHERE "imageUrl" IS NOT NULL`

  console.log(`${products.length}개 상품의 이미지를 마이그레이션합니다.`)

  // 임시로 이미지 데이터를 별도 테이블에 저장
  for (const product of products) {
    if (product.imageUrl) {
      await prisma.$executeRaw`
        INSERT INTO temp_product_images (product_id, image_url, thumbnail_url, "order")
        VALUES (${product.id}, ${product.imageUrl}, ${product.thumbnailUrl}, 1)
        ON CONFLICT DO NOTHING
      `
      console.log(`상품 ${product.id}의 이미지 백업 완료`)
    }
  }

  console.log('이미지 마이그레이션 완료!')
}

// 임시 테이블 생성
async function createTempTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS temp_product_images (
      id SERIAL PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      "order" INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

async function main() {
  await createTempTable()
  await migrateImages()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })