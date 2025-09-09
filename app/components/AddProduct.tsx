import React, { useState } from 'react';
import type { Product } from '../../types';
import { CATEGORIES } from '../../constants';

interface ProductImage {
  imageUrl: string;
  thumbnailUrl: string;
}

interface AddProductProps {
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'> & { images?: ProductImage[] }) => Promise<void>;
  showLoading: (show: boolean, message?: string) => void;
}

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
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // Use JPEG for smaller file size
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
            const thumbnailUrl = await createThumbnail(image.dataUrl);
            return {
              imageUrl: image.dataUrl,
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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">새 상품 추가</h2>
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상품명</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="상품명을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">가격</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="가격을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상품 설명</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg h-24 focus:outline-none focus:border-orange-500"
              placeholder="상품 설명을 입력하세요"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              상품 이미지 ({images.length}/3)
            </label>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleImageChange} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              disabled={images.length >= 3}
            />
            <p className="text-sm text-gray-500 mt-1">
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
    </div>
  );
};

export default AddProduct;