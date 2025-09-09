import React, { useState } from 'react';
import type { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProductImage {
  imageUrl: string;
  thumbnailUrl: string;
}

interface AddProductProps {
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'> & { images?: ProductImage[] }) => Promise<void>;
  showLoading: (show: boolean, message?: string) => void;
}

const compressImage = (dataUrl: string, maxWidth = 800, maxHeight = 600, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });
};

const createThumbnail = (dataUrl: string, width = 200, height = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6)); // Lower quality for thumbnail
    };
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });
};

const AddProduct: React.FC<AddProductProps> = ({ addProduct, showLoading }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0] || '');
  const [images, setImages] = useState<{ file: File; dataUrl: string; thumbnailUrl?: string }[]>([]);
  
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).slice(0, 3 - images.length); // 최대 3개까지
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImages(prev => [...prev, { file, dataUrl: result }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input value to allow re-selecting the same files
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !category) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    
    if (images.length === 0) {
      alert('최소 1개의 상품 이미지를 등록해주세요.');
      return;
    }

    showLoading(true, '상품 정보를 처리 중입니다...');
    try {
        const processedImages = await Promise.all(
          images.map(async (image) => {
            const compressedImageUrl = await compressImage(image.dataUrl);
            const thumbnailUrl = await createThumbnail(compressedImageUrl);
            return {
              imageUrl: compressedImageUrl,
              thumbnailUrl,
            };
          })
        );

        const newProduct = {
          name,
          price: parseInt(price, 10),
          description,
          category,
          images: processedImages,
        };

        await addProduct(newProduct);

        // 폼 초기화
        setName('');
        setPrice('');
        setDescription('');
        setCategory(CATEGORIES[0] || '');
        setImages([]);
        setError('');
    } catch (err) {
        console.error("Error during product submission:", err);
        setError("상품 추가 중 오류가 발생했습니다.");
    } finally {
        showLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 상품 추가</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <Label htmlFor="name">상품명</Label>
            <Input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="상품명을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="price">가격</Label>
            <Input 
              id="price"
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="가격을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="category">카테고리</Label>
            <select 
              id="category"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">상품 설명</Label>
            <Textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="h-24"
              placeholder="상품 설명을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="images">
              상품 이미지 ({images.length}/3)
            </Label>
            <Input 
              id="images"
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleImageChange} 
              className="file:text-foreground file:border-0 file:bg-secondary file:text-sm file:font-medium hover:file:bg-secondary/80"
              disabled={images.length >= 3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              최대 3장까지 업로드 가능합니다.
            </p>
          </div>
          
          {/* 이미지 미리보기 */}
          {images.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">이미지 미리보기</label>
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.dataUrl} 
                      alt={`상품 이미지 ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br-lg">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={handleSubmit} 
            className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition"
            disabled={images.length === 0}
          >
            상품 추가
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">상품 등록 안내</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 상품 이미지는 최대 3장까지 등록 가능합니다</li>
              <li>• 첫 번째 이미지가 대표 이미지로 사용됩니다</li>
              <li>• 이미지는 자동으로 썸네일이 생성됩니다</li>
              <li>• 모든 필드를 정확히 입력해주세요</li>
            </ul>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddProduct;