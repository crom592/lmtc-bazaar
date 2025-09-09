import Dexie, { type Table } from 'dexie';
import type { Product, Order } from './types';
import { INITIAL_PRODUCTS } from './constants';

// Fix: Refactored Dexie setup to a functional approach to resolve an issue
// where the 'version' method was not found on the class instance.
export const db = new Dexie('BazaarDB') as Dexie & {
  products: Table<Product>;
  orders: Table<Order>;
};

db.version(2).stores({
  products: 'id, category, price', // Primary key and indexes
  // Added 'orderDate' to the indexes to allow sorting by order date.
  orders: 'id, customerName, customerPhone, paymentStatus, deliveryStatus, orderDate', 
});


export const seedDatabase = async () => {
  const productCount = await db.products.count();
  if (productCount === 0) {
    console.log("Seeding database with initial products...");
    try {
      await db.products.bulkAdd(INITIAL_PRODUCTS);
      console.log("Database seeded successfully.");
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  }
};
