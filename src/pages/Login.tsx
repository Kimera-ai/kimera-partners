import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const Login = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      navigate("/partner-program");
    }
  }, [session, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#100919] opacity-95 pointer-events-none" />
      
      <Card className="relative w-full max-w-md p-8 bg-card z-50">
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
                '&:hover': {
                  opacity: 0.8,
                },
              },
              input: {
                cursor: 'text',
                '&:hover': {
                  borderColor: '#4A5568',
                },
                '&:focus': {
                  borderColor: '#FF2B6E',
                  outline: 'none',
                },
              },
              anchor: {
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              },
              container: {
                position: 'relative',
              }
            },
          }}
          providers={[]}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                email_input_placeholder: 'Enter your email address',
                password_input_placeholder: 'Enter your password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in'
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a Password',
                email_input_placeholder: 'Enter your email address',
                password_input_placeholder: 'Create a password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up ...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Don't have an account? Sign up"
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Login;