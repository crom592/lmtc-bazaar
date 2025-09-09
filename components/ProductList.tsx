import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../constants';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');

  useEffect(() => {
    let tempProducts = [...products];

    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }

    if (selectedPrice === 'under50k') {
      tempProducts = tempProducts.filter(p => p.price < 50000);
    } else if (selectedPrice === 'over50k') {
      tempProducts = tempProducts.filter(p => p.price >= 50000);
    }

    setFilteredProducts(tempProducts);
  }, [products, selectedCategory, selectedPrice]);


  return (
    <div className="container mx-auto px-6 py-8">
       <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">LMTC 4기 선교여행 온라인 바자회</h1>
       <p className="text-center text-gray-600 mb-8">여러분의 따뜻한 마음이 선교지에 큰 힘이 됩니다.</p>

      <div className="flex flex-wrap gap-4 justify-center mb-8 bg-white p-4 rounded-lg shadow">
         <div className="flex items-center space-x-2">
           <label htmlFor="category-filter" className="font-semibold text-gray-700">카테고리:</label>
           <select
             id="category-filter"
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             className="border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
           >
             <option value="all">전체</option>
             {CATEGORIES.map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
         </div>
         <div className="flex items-center space-x-2">
           <label htmlFor="price-filter" className="font-semibold text-gray-700">가격:</label>
           <select
             id="price-filter"
             value={selectedPrice}
             onChange={(e) => setSelectedPrice(e.target.value)}
             className="border-gray-300 rounded-md shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
           >
             <option value="all">모든 가격</option>
             <option value="under50k">5만원 미만</option>
             <option value="over50k">5만원 이상</option>
           </select>
         </div>
       </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <p className="text-center text-gray-500 text-lg py-10">해당 조건에 맞는 상품이 없습니다.</p>
      )}
    </div>
  );
};

export default ProductList;