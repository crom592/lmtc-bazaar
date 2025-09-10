import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../../constants';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
    <div className="container mx-auto px-4 py-6">
       <div className="text-center mb-12">
         <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-4">
           LMTC 4기 단기선교 온라인 바자회
         </h1>
         <p className="text-xl text-slate-600 font-medium">여러분의 따뜻한 마음이 선교지에 큰 힘이 됩니다 ❤️</p>
       </div>

      <Card className="mb-12 bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="flex flex-wrap gap-6 justify-center p-8">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3 border">
            <Label htmlFor="category-filter" className="font-semibold text-slate-700">🏷️ 카테고리:</Label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">전체</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3 border">
            <Label htmlFor="price-filter" className="font-semibold text-slate-700">💰 가격:</Label>
            <select
              id="price-filter"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">모든 가격</option>
              <option value="under50k">5만원 미만</option>
              <option value="over50k">5만원 이상</option>
            </select>
          </div>
        </CardContent>
      </Card>

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