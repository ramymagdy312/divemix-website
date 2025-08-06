"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';

const routeNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/services': 'Services',
  '/admin/applications': 'Applications',
  '/admin/gallery': 'Gallery',
  '/admin/gallery-categories': 'Gallery Categories',
  '/admin/vendors': 'Vendors',
  '/admin/contact-messages': 'Contact Messages',
  '/admin/settings': 'Settings',
  '/admin/users': 'Users',
  '/admin/products-page': 'Products Page',
  '/admin/services-page': 'Services Page',
  '/admin/applications-page': 'Applications Page',
  '/admin/about': 'About Page',
  '/admin/contact': 'Contact Page',
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];
  
  // Always start with Admin
  breadcrumbItems.push({
    href: '/admin',
    label: 'Admin',
    isLast: pathname === '/admin'
  });
  
  // Build breadcrumb path
  let currentPath = '';
  for (let i = 1; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    const fullPath = `/admin${currentPath}`;
    const isLast = i === pathSegments.length - 1;
    
    breadcrumbItems.push({
      href: fullPath,
      label: routeNames[fullPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1),
      isLast
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}