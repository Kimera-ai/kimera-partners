import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const Login = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate("/partnerships");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-[#100919] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome to Kimera Partners</h1>
          <p className="text-gray-400 mt-2">Sign in to access your partner account</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF2B6E',
                  brandAccent: '#FF068B',
                },
              },
            },
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;