# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for a Korean church bazaar (성광교회 LMTC 4기 바자회) built with Vite and TypeScript. It's an e-commerce platform for church members to browse and purchase items during a church bazaar event.

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite 6** as the build tool and dev server
- **React Router DOM 7** for navigation (using HashRouter)
- **Tailwind CSS** for styling (no explicit config found, but classes are used)
- **Dexie** (IndexedDB wrapper) for local data persistence

### Key Dependencies
- `@google/genai` - Google Gemini AI integration
- `dexie` - IndexedDB database wrapper
- `react-router-dom` - Client-side routing

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local` (if it exists)
2. Set `GEMINI_API_KEY` in environment file for AI features
3. The Vite config exposes the Gemini API key as `process.env.GEMINI_API_KEY`

## Application Architecture

### Data Layer
- **Database**: Uses Dexie (IndexedDB) for client-side data persistence
- **Models**: `Product` and `Order` entities defined in `types.ts`
- **Seeding**: Initial products loaded from `constants.ts` via `seedDatabase()`

### Routing Structure
- `/` - Product listing page
- `/product/:id` - Product detail and ordering
- `/my-orders` - Customer order history
- `/admin` - Admin dashboard (login required)

### Key Components
- `ProductList` - Main product catalog
- `ProductDetail` - Product view with ordering functionality
- `AdminDashboard` - Admin interface for product and order management
- `AdminLogin` - Simple admin authentication
- `MyOrders` - Customer order tracking

### State Management
- React useState for local state
- Session storage for admin authentication
- Dexie database for persistent data

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

The application supports image upload for products with automatic thumbnail generation:
- Images are converted to base64 for storage
- Thumbnails are automatically created at 200x200px
- Uses HTML5 Canvas API for image processing

## Admin Features

- Product management (add/delete products)
- Order status management (payment and delivery status updates)
- Admin authentication required for access
- Loading states for async operations

## File Structure Highlights

```
/
├── App.tsx              # Main application component with routing
├── types.ts             # TypeScript type definitions
├── db.ts                # Dexie database configuration
├── constants.ts         # App constants and initial data
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── AddProduct.tsx
│   ├── ProductList.tsx
│   ├── ProductDetail.tsx
│   └── MyOrders.tsx
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Development Notes

- Uses HashRouter for client-side routing (suitable for static hosting)
- No server-side backend - all data stored locally in IndexedDB
- Images stored as base64 strings in the database
- Simple admin system without real authentication
- Responsive design with mobile-first approach