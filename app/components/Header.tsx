import React from 'react';
import Link from 'next/link';

interface HeaderProps {
    isAdmin: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition">
          💒 LMTC4기 선교 바자회
        </Link>
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-orange-600 transition">홈</Link>
          <Link href="/?page=my-orders" className="hover:text-orange-600 transition">신청내역 확인</Link>
          {isAdmin ? (
            <button onClick={onLogout} className="hover:text-orange-600 transition">로그아웃</button>
          ) : (
            <Link href="/?page=admin" className="hover:text-orange-600 transition">관리자</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;