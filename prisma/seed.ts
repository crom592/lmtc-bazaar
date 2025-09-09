import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const INITIAL_PRODUCTS = [
  {
    name: "프리미엄 과일 바구니",
    price: 55000,
    description: "제철을 맞은 신선하고 당도 높은 과일들로만 엄선하여 구성한 프리미엄 과일 바구니입니다. 소중한 분들께 감사의 마음을 전하세요.",
    imageUrl: "https://picsum.photos/seed/fruitbasket/600/600",
    thumbnailUrl: "https://picsum.photos/seed/fruitbasket/200/200",
    category: "과일/채소",
  },
  {
    name: "고급 한과 선물세트",
    price: 48000,
    description: "장인의 손길로 정성껏 만든 전통 한과 세트입니다. 남녀노소 모두가 즐길 수 있는 건강하고 맛있는 간식입니다.",
    imageUrl: "https://picsum.photos/seed/koreansnack/600/600",
    thumbnailUrl: "https://picsum.photos/seed/koreansnack/200/200",
    category: "가공/수제식품",
  },
  {
    name: "수제 햄 선물세트",
    price: 62000,
    description: "엄선된 국내산 돼지고기로 만든 풍미 가득한 수제 햄 세트. 특별한 날 식탁을 더욱 풍성하게 만들어 줍니다.",
    imageUrl: "https://picsum.photos/seed/hamset/600/600",
    thumbnailUrl: "https://picsum.photos/seed/hamset/200/200",
    category: "가공/수제식품",
  },
  {
    name: "유기농 버섯 모음",
    price: 35000,
    description: "자연의 향을 그대로 담은 유기농 버섯 모음입니다. 다양한 요리에 활용하여 건강과 맛을 동시에 챙길 수 있습니다.",
    imageUrl: "https://picsum.photos/seed/mushroom/600/600",
    thumbnailUrl: "https://picsum.photos/seed/mushroom/200/200",
    category: "과일/채소",
  },
]

async function main() {
  console.log('데이터베이스 시드 시작...')
  
  // 기존 데이터 확인
  const existingProducts = await prisma.product.count()
  
  if (existingProducts === 0) {
    // 초기 상품 데이터 생성
    for (const productData of INITIAL_PRODUCTS) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
        },
      })
      
      // 상품 이미지 생성
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: productData.imageUrl,
          thumbnailUrl: productData.thumbnailUrl,
          order: 1,
        }
      })
    }
    console.log(`${INITIAL_PRODUCTS.length}개의 상품과 이미지가 생성되었습니다.`)
  } else {
    console.log('이미 상품 데이터가 존재합니다.')
  }
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