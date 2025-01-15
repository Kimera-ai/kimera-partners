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

export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      {description && (
        <p className="text-gray-400">{description}</p>
      )}
    </div>
  );
};

export const Navigation = () => {
  return (
    <nav className="border-b border-white/10 bg-[#100919]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/stuff/Partners%20logo.png?t=2025-01-15T17%3A24%3A57.611Z" 
                alt="Kimera AI Logo" 
                className="h-8"
              />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/partner-program">Partner Program</NavLink>
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