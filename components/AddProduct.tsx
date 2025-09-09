import React, { useState } from 'react';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';

interface AddProductProps {
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [originalImageDataUrl, setOriginalImageDataUrl] = useState<string>('');
  
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        setImageBase64(base64String);
        setOriginalImageDataUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !category) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    
    if (!originalImageDataUrl) {
      alert('상품 이미지를 등록해주세요.');
      return;
    }

    showLoading(true, '상품 정보를 처리 중입니다...');
    try {
        const finalThumbnailUrl = await createThumbnail(originalImageDataUrl);

        const newProduct: Omit<Product, 'id'> = {
          name,
          price: parseInt(price, 10),
          description,
          imageUrl: originalImageDataUrl,
          thumbnailUrl: finalThumbnailUrl,
          category,
        };

        await addProduct(newProduct);

        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setCategory(CATEGORIES[0] || '');
        setImageFile(null);
        setImageBase64('');
        setOriginalImageDataUrl('');
    } catch (err) {
        console.error("Error during product submission:", err);
        setError("상품 추가 중 오류가 발생했습니다.");
    } finally {
        showLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">새 상품 추가</h3>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상품명</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">가격</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
           <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상품 설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg h-24"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상품 이미지</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
          </div>
           {originalImageDataUrl && <img src={originalImageDataUrl} alt="업로드된 이미지" className="w-32 h-32 object-cover rounded-lg mt-2"/>}
          
          <button onClick={handleSubmit} className="mt-4 w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition">
            상품 추가
          </button>
        </div>

        <div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
