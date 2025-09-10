import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
    isAdmin: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout }) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-blue-500">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
          <Image
            src="/church-logo.png"
            alt="LMTC4기 선교 바자회"
            width={120}
            height={60}
            className="h-12 w-auto sm:h-14 lg:h-16"
          />
        </Link>
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" asChild className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold">
            <Link href="/" className="flex items-center gap-2">
              <Home size={18} />
              홈
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold">
            <Link href="/?page=my-orders" className="flex items-center gap-2">
              <ShoppingBag size={18} />
              신청내역
            </Link>
          </Button>
          {isAdmin ? (
            <Button variant="outline" onClick={onLogout} className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2">
              <LogOut size={18} />
              로그아웃
            </Button>
          ) : (
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              <Link href="/?page=admin" className="flex items-center gap-2">
                <Settings size={18} />
                관리자
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;