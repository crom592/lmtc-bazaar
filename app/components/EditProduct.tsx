import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EditProductProps {
  product: Product;
  updateProduct: (productId: string, product: {
    name: string
    price: number
    description: string
    category: string
    images: Array<{ imageUrl: string; thumbnailUrl: string }>
  }) => Promise<void>;
  onCancel: () => void;
  showLoading: (show: boolean, message?: string) => void;
}

interface ImageInput {
  imageUrl: string;
  thumbnailUrl: string;
}

const EditProduct: React.FC<EditProductProps> = ({ product, updateProduct, onCancel, showLoading }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [images, setImages] = useState<ImageInput[]>(product.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, { 
        imageUrl: newImageUrl.trim(), 
        thumbnailUrl: newImageUrl.trim()
      }]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }
    
    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      alert('상품 설명을 입력해주세요.');
      return;
    }

    if (images.length === 0) {
      alert('최소 1개의 이미지를 추가해주세요.');
      return;
    }

    try {
      showLoading(true, '상품을 수정하고 있습니다...');
      await updateProduct(product.id, {
        name: name.trim(),
        price: priceNum,
        description: description.trim(),
        category,
        images
      });
      onCancel();
    } catch (error) {
      console.error('상품 수정 오류:', error);
      alert('상품 수정 중 오류가 발생했습니다.');
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">상품 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">상품명 *</Label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">가격 (원) *</Label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">카테고리 *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">상품 설명 *</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">상품 이미지 *</Label>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Button type="button" onClick={handleAddImage} className="bg-green-600 hover:bg-green-700">
                    추가
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.imageUrl}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.png';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                수정 완료
              </Button>
              <Button type="button" onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-700">
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;