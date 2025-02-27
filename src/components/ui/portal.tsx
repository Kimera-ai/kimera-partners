
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, Server, Users, Megaphone, DollarSign } from "lucide-react";
import { useState } from "react";

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`${
        isActive ? "text-white" : "text-gray-300"
      } hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5`}
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
  const navigate = useNavigate();
  const { session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex flex-1 items-center justify-end">
            <div className="flex items-center gap-8 mr-8">
              <NavLink href="/partner-program">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Partner Program</span>
                </div>
              </NavLink>
              <NavLink href="/marketing-kit">
                <div className="flex items-center gap-1">
                  <Megaphone className="h-4 w-4" />
                  <span>Marketing Kit</span>
                </div>
              </NavLink>
              <NavLink href="/pricing">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </div>
              </NavLink>
              <NavLink href="/api">
                <div className="flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span>API</span>
                </div>
              </NavLink>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-300">
                    {session.user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    className="border-white/20 hover:bg-white/20 text-white px-6"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/20 text-white px-6"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="flex flex-col space-y-2 py-4">
              <NavLink href="/partner-program" onClick={closeMobileMenu}>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Partner Program</span>
                </div>
              </NavLink>
              <NavLink href="/marketing-kit" onClick={closeMobileMenu}>
                <div className="flex items-center gap-1">
                  <Megaphone className="h-4 w-4" />
                  <span>Marketing Kit</span>
                </div>
              </NavLink>
              <NavLink href="/pricing" onClick={closeMobileMenu}>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </div>
              </NavLink>
              <NavLink href="/api" onClick={closeMobileMenu}>
                <div className="flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span>API</span>
                </div>
              </NavLink>
              
              <div className="pt-4 border-t border-white/10 mt-4">
                {session ? (
                  <>
                    <div className="px-4 py-2">
                      <span className="text-sm text-gray-300">
                        {session.user.email}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:bg-white/20 text-white"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 hover:bg-white/20 text-white"
                    onClick={() => {
                      navigate('/login');
                      closeMobileMenu();
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
