
import { Navigation } from "@/components/ui/portal";
import Footer from "./Footer";

interface BaseLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const BaseLayout = ({ children, fullWidth = false }: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#100919] text-gray-300 flex flex-col">
      <Navigation />
      <main className={`${fullWidth ? 'w-full p-0 m-0' : 'container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} flex-grow`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
