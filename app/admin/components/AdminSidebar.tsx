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
  MessageCircle,
  Mail,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/app/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Product Categories', href: '/admin/categories', icon: Settings },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Applications', href: '/admin/applications', icon: Target },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Gallery Categories', href: '/admin/gallery-categories', icon: Settings },
  { name: 'Vendors', href: '/admin/vendors', icon: Users },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageCircle },
  { name: 'Settings', href: '/admin/settings', icon: Mail },
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
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
            <LayoutDashboard className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin Panel</span>
            <span className="truncate text-xs text-muted-foreground">Divemix Website</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pages Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={pagesExpanded}
                onOpenChange={setPagesExpanded}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isPagesActive}
                      className="w-full justify-between"
                      tooltip="Pages Management"
                    >
                      <div className="flex items-center gap-2">
                        <FileText />
                        <span>Pages</span>
                      </div>
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {pagesNavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={item.href}>
                                <item.icon />
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
          <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-cyan-600 text-white">
            <Package className="size-3" />
          </div>
          <div className="grid flex-1 text-left text-xs leading-tight">
            <span className="truncate font-medium">DiveMix</span>
            <span className="truncate text-xs">Admin v1.0</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}