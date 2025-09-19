<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fxom56xOSgwLWFhcQfniO3Mxjjs6LI_F

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env.local` and set the required variables:
   ```bash
   cp .env.example .env.local
   ```

   **Required:**
   - `DATABASE_URL`: PostgreSQL database connection string

   **Optional:**
   - `GEMINI_API_KEY`: Gemini API key for AI features
   - `NEXT_PUBLIC_STACK_PROJECT_ID`, `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `STACK_SECRET_SERVER_KEY`: Stack Auth configuration

3. Setup database:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database (creates tables)
   npx prisma db push

   # Seed initial data (optional)
   npm run db:seed
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Troubleshooting

**주문이 관리자 대시보드에 표시되지 않는 경우:**
1. `.env.local` 파일에 `DATABASE_URL`이 올바르게 설정되어 있는지 확인
2. 데이터베이스 스키마가 최신인지 확인: `npx prisma db push`
3. 개발 서버 재시작: `npm run dev`
