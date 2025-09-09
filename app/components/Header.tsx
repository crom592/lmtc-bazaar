import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    isAdmin: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout }) => {
  return (
    <header className="bg-card shadow-md sticky top-0 z-40 border-b">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition">
          💒 LMTC4기 선교 바자회
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">홈</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/?page=my-orders">신청내역 확인</Link>
          </Button>
          {isAdmin ? (
            <Button variant="outline" onClick={onLogout}>로그아웃</Button>
          ) : (
            <Button variant="default" asChild>
              <Link href="/?page=admin">관리자</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;