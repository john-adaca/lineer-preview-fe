'use client';

import { usePathname } from 'next/navigation';
import { Bell, Settings, Search, ArrowLeft } from 'lucide-react';

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/contacts': 'Contacts',
    '/companies': 'Companies',
    '/lists': 'Lists',
    '/campaigns': 'Campaigns',
    '/tasks': 'Tasks',
    '/inbox': 'Inbox',
  };
  return titles[pathname] || 'Home';
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200 z-10">
      {/* Left side - Back arrow and title */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-4">
        {/* Search icon */}
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        {/* Notifications icon */}
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        {/* Settings icon */}
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        {/* User profile */}
        <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-sm hover:bg-red-600 transition-colors">
          J
        </button>
      </div>
    </div>
  );
}
