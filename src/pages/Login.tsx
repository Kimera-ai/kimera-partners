import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/partner-program");
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <AuthBackground />
      <AuthContainer>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#FF2B6E",
                  brandAccent: "#FF068B",
                  inputText: "white",
                  inputBackground: "transparent",
                  inputBorder: "white",
                  inputBorderHover: "#FF2B6E",
                  inputBorderFocus: "#FF068B",
                },
              },
            },
            className: {
              container: "!text-white w-full",
              label: "!text-white",
              button: "!text-white w-full",
              anchor: "!text-white",
              divider: "!bg-white/20",
              message: "!text-white",
              input: "w-full",
            },
          }}
          view="sign_in"
        />
      </AuthContainer>
    </div>
  );
};

export default Login;