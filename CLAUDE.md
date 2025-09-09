# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application for a Korean church bazaar (성광교회 LMTC 4기 바자회) built with TypeScript, PostgreSQL, and Prisma. It's an e-commerce platform for church members to browse and purchase items during a church bazaar event.

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **PostgreSQL** with Prisma ORM for data persistence

### Backend
- **Next.js API Routes** for server-side functionality
- **Prisma ORM** for database operations
- **PostgreSQL** (Neon) for production database

### Key Dependencies
- `@google/genai` - Google Gemini AI integration (future use)
- `@prisma/client` - Prisma ORM client
- `tailwindcss` - Utility-first CSS framework

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed initial data
```

## Environment Setup

1. Create `.env.local` file with the following variables:
   ```
   DATABASE_URL=postgresql://...
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_STACK_PROJECT_ID=...
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
   STACK_SECRET_SERVER_KEY=...
   ```
2. Run database migrations: `npm run db:push`
3. Seed initial data: `npm run db:seed`

## Application Architecture

### Data Layer
- **Database**: PostgreSQL with Prisma ORM
- **Models**: `Product` and `Order` entities defined in `prisma/schema.prisma`
- **Seeding**: Initial products loaded via `prisma/seed.ts`
- **API**: RESTful API routes in `app/api/` directory

### Routing Structure
- `/?page=home` - Product listing page (default)
- `/?page=product&id=xxx` - Product detail and ordering
- `/?page=my-orders` - Customer order history
- `/?page=admin` - Admin dashboard (login required)

### API Endpoints
- `GET/POST /api/products` - Product CRUD operations
- `DELETE /api/products/[id]` - Delete specific product
- `GET/POST /api/orders` - Order CRUD operations
- `PATCH /api/orders/[id]` - Update order status
- `POST /api/upload` - Image upload (Base64)

### Key Components
- `ProductList` - Main product catalog
- `ProductDetail` - Product view with ordering functionality
- `AdminDashboard` - Admin interface for product and order management
- `AdminLogin` - Simple admin authentication
- `MyOrders` - Customer order tracking

### State Management
- React useState for local state
- Session storage for admin authentication
- PostgreSQL database for persistent data
- Server-side API calls for data fetching

### Authentication
- Simple admin system using hardcoded credentials in `constants.ts`
- Admin credentials: ID: "admin", Password: "1004"
- Session-based authentication using sessionStorage

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string; // Categories: ['과일/채소', '가공/수제식품']
}
```

### Order
```typescript
interface Order {
  id: string;
  product: Product;
  quantity: number;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  paymentStatus: '결제 대기중' | '결제 완료';
  deliveryStatus: '배송 준비중' | '배송 완료';
}
```

## Korean Language Context

- All UI text is in Korean
- Target audience is Korean church members
- Payment and delivery statuses use Korean terms
- Church context: "구리 성광교회 LMTC 4기" (Guri Sungkwang Church LMTC 4th class)

## Image Handling

The application supports image upload for products:
- Images are uploaded as Base64 data via API
- Stored directly in the database as Base64 strings
- Automatic thumbnail generation using HTML5 Canvas API
- API endpoint: `POST /api/upload`

**Note**: For production, consider using cloud storage (AWS S3, Cloudinary) instead of Base64 storage for better performance.

## Admin Features

- Product management (add/delete products)
- Order status management (payment and delivery status updates)
- Admin authentication required for access
- Loading states for async operations

## File Structure Highlights

```
/
├── app/                 # Next.js App Router directory
│   ├── api/            # API routes
│   │   ├── products/   # Product API endpoints
│   │   ├── orders/     # Order API endpoints
│   │   └── upload/     # Image upload endpoint
│   ├── components/     # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AddProduct.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   └── MyOrders.tsx
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── lib/                # Utility libraries
│   └── prisma.ts       # Prisma client configuration
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding script
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
├── next.config.js      # Next.js configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Development Notes

- Uses Next.js App Router for server-side rendering and routing
- Full-stack application with API routes and PostgreSQL database
- Images stored as Base64 strings in PostgreSQL (consider cloud storage for production)
- Simple admin system with session-based authentication
- Responsive design with mobile-first approach
- Status mapping between Korean UI and English database enums

## Database Schema

- **Product**: id, name, price, description, imageUrl, thumbnailUrl, category, timestamps
- **Order**: id, productId, quantity, customerName, customerPhone, paymentStatus, deliveryStatus, timestamps
- **Enums**: PaymentStatus (PENDING, COMPLETED), DeliveryStatus (PREPARING, COMPLETED)

## Deployment Considerations

- Set up environment variables in production
- Configure PostgreSQL connection string
- Consider using cloud storage for images (AWS S3, Cloudinary)
- Set up proper authentication for admin functions
- Enable SSL for database connections in production