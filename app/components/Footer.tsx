import React from 'react';
import { CreditCard } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 바자회 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4">LMTC 4기 단기선교 온라인 바자회</h3>
            <p className="text-slate-300 mb-2">여러분의 따뜻한 마음이 선교지에 큰 힘이 됩니다</p>
            <p className="text-slate-400 text-sm">성광교회 LMTC 4기</p>
          </div>
          
          {/* 입금 계좌 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              입금 계좌 안내
            </h3>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="font-semibold text-lg">토스뱅크 1000-2682-2721</p>
              <p className="text-slate-300">예금주: 신현숙</p>
              <p className="text-slate-400 text-sm mt-2">
                상품 신청 후 위 계좌로 입금해주시면 됩니다.
              </p>
            </div>
          </div>
        </div>
        
        {/* 하단 저작권 */}
        <div className="border-t border-slate-600 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 LMTC 4기 단기선교 온라인 바자회. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;