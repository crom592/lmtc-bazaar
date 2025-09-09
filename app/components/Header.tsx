import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    isAdmin: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout }) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-blue-500">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
          💒 LMTC4기 선교 바자회
        </Link>
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" asChild className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold">
            <Link href="/">🏠 홈</Link>
          </Button>
          <Button variant="ghost" asChild className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold">
            <Link href="/?page=my-orders">📋 신청내역</Link>
          </Button>
          {isAdmin ? (
            <Button variant="outline" onClick={onLogout} className="border-red-300 text-red-600 hover:bg-red-50">
              🚪 로그아웃
            </Button>
          ) : (
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold">
              <Link href="/?page=admin">⚙️ 관리자</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;