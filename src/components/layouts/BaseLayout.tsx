import { Navigation } from "@/components/ui/portal";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#100919] text-gray-300">
      <Navigation />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;