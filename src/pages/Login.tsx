import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      navigate("/partner-program");
    }
  }, [session, navigate]);

  // Listen for auth state changes to handle errors
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#100919] p-4">
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome to Kimera Partners</h1>
          <p className="text-gray-400 mt-2">Sign in to access your partner account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-100/10 rounded-md">
            {error}
          </div>
        )}

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
              button: {
                cursor: 'pointer',
                position: 'relative',
                zIndex: 50
              },
              input: {
                cursor: 'text',
                position: 'relative',
                zIndex: 50
              },
              anchor: {
                cursor: 'pointer',
                position: 'relative',
                zIndex: 50
              },
              container: {
                position: 'relative',
                zIndex: 50
              }
            },
          }}
          providers={[]}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email *',
                password_label: 'Password *',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password'
              },
              sign_up: {
                email_label: 'Email *',
                password_label: 'Password *',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password'
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Login;