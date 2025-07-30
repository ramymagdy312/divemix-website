"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Settings,
  Wrench,
  Target,
  Image,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'الفئات', href: '/admin/categories', icon: Settings },
  { name: 'الخدمات', href: '/admin/services', icon: Wrench },
  { name: 'التطبيقات', href: '/admin/applications', icon: Target },
  { name: 'معرض الصور', href: '/admin/gallery', icon: Image },
  { name: 'المستخدمين', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

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
        </div>
      </nav>
    </div>
  );
}