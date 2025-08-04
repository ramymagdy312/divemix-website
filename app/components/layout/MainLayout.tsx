import { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import FloatingWhatsApp from "../FloatingWhatsApp";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default MainLayout;