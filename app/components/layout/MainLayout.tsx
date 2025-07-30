import { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;