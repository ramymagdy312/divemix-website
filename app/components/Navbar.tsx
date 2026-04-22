"use client";

import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./common/Logo";

export interface NavbarItem {
  id?: string;
  label?: string;
  name?: string;
  href?: string;
  path?: string;
  is_external?: boolean;
}

interface NavbarProps {
  items?: NavbarItem[];
  logoUrl?: string;
  logoAlt?: string;
}

const fallbackItems: NavbarItem[] = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "Applications", path: "/applications" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
  { name: "About", path: "/about" },
];

const Navbar = ({ items, logoUrl, logoAlt }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = useMemo(
    () =>
      (items && items.length > 0 ? items : fallbackItems).map((item) => ({
        name: item.label || item.name || "Untitled",
        path: item.href || item.path || "/",
        isExternal: item.is_external || false,
      })),
    [items]
  );

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-cyan-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <div className="flex items-center">
            <Logo src={logoUrl} alt={logoAlt} />
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={`${item.name}-${item.path}`}
                  href={item.path}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noreferrer noopener" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? "bg-cyan-700 text-white border-b-2 border-cyan-300"
                      : "hover:bg-cyan-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-cyan-800"
              type="button"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={`${item.name}-${item.path}-mobile`}
                href={item.path}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noreferrer noopener" : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-cyan-700 text-white border-l-4 border-cyan-300"
                    : "hover:bg-cyan-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
