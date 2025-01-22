import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="text-lg font-bold">Home</a>
            <a href="/partner-program" className="text-lg font-bold">Partner Program</a>
            <a href="/marketing-kit" className="text-lg font-bold">Marketing Kit</a>
            <a href="/dashboard" className="text-lg font-bold">Dashboard</a>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/20 text-white"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/20 text-white"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default BaseLayout;
