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
      navigate("/marketing-kit");
    }
  }, [session, navigate]);

  return (
    <div className="fixed inset-0 min-h-screen bg-[#100919] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-card relative z-50">
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
                  inputBackground: '#1A1F2C',
                  inputText: 'white',
                  inputPlaceholder: '#4A5568',
                  inputBorder: '#2D3748',
                  inputBorderHover: '#4A5568',
                  inputBorderFocus: '#FF2B6E',
                },
                space: {
                  inputPadding: '12px',
                  buttonPadding: '12px',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '6px',
                  buttonBorderRadius: '6px',
                  inputBorderRadius: '6px',
                },
              },
            },
            style: {
              container: {
                position: 'relative',
                zIndex: 100
              },
              input: {
                backgroundColor: '#1A1F2C',
                color: 'white',
                border: '1px solid #2D3748',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 100
              },
              button: {
                backgroundColor: '#FF2B6E',
                color: 'white',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 100
              },
              anchor: {
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 100
              }
            },
          }}
          providers={[]}
          theme="dark"
        />
      </Card>
    </div>
  );
};

export default Login;