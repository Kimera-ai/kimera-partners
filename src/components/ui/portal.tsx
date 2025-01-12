import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`${
        isActive ? "text-white" : "text-gray-300"
      } hover:text-white px-3 py-2 text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  );
};

export const Navigation = () => {
  return (
    <nav className="border-b border-white/10 bg-[#100919]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Kimera AI
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/partnerships">Partnerships</NavLink>
              <NavLink href="/marketing-kit">Marketing Kit</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-white/20 hover:bg-white/20 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};