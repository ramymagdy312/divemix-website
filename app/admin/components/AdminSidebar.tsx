"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Settings,
  Wrench,
  Target,
  Image,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Settings },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Applications', href: '/admin/applications', icon: Target },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Gallery Categories', href: '/admin/gallery-categories', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
];

const pagesNavigation = [
  { name: 'Products Page', href: '/admin/products-page', icon: Package },
  { name: 'Services Page', href: '/admin/services-page', icon: Wrench },
  { name: 'Applications Page', href: '/admin/applications-page', icon: Target },
  { name: 'About Page', href: '/admin/about', icon: FileText },
  { name: 'Contact Page', href: '/admin/contact', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pagesExpanded, setPagesExpanded] = useState(false);

  // Check if any pages route is active
  const isPagesActive = pagesNavigation.some(item => pathname === item.href);

  // Auto-expand if any pages route is active
  useEffect(() => {
    if (isPagesActive) {
      setPagesExpanded(true);
    }
  }, [isPagesActive]);

  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-8">
        <div className="px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md mb-2 transition-colors ${
                  isActive
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-cyan-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
          
          {/* Pages Section */}
          <div className="mb-2">
            <button
              onClick={() => setPagesExpanded(!pagesExpanded)}
              className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isPagesActive
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileText
                className={`mr-3 h-5 w-5 ${
                  isPagesActive ? 'text-cyan-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              <span className="flex-1 text-left">Pages</span>
              {pagesExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            {pagesExpanded && (
              <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                {pagesNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-cyan-50 text-cyan-600 font-medium'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <item.icon
                        className={`mr-2 h-4 w-4 ${
                          isActive ? 'text-cyan-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}