import { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import FloatingWhatsApp from "../FloatingWhatsApp";
import { getContactPageData, getFooter, getNav, getSettings } from "@/app/lib/content";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const [navItems, footerContent, settings, contactPage] = await Promise.all([
    getNav(),
    getFooter(),
    getSettings(),
    getContactPageData(),
  ]);

  const footerBranches = ((contactPage?.branches || []) as any[]).filter(
    (branch) => branch?.show_in_footer === true
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar items={navItems} logoUrl={settings.logo_url} logoAlt={settings.logo_alt} />
      <main className="flex-grow page-content">{children}</main>
      <Footer
        footerContent={footerContent}
        settings={settings}
        branches={footerBranches}
        logoUrl={settings.logo_url}
        logoAlt={settings.logo_alt}
      />
      <FloatingWhatsApp />
    </div>
  );
};

export default MainLayout;
