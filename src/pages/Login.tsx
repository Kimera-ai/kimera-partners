import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authStyles } from "@/components/auth/authStyles";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { Session } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSession = (session: Session | null) => {
    if (session) {
      navigate("/partner-program");
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
  };

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
                },
              },
            },
            className: {
              container: "!text-white",
              label: "!text-white",
              button: "!text-white",
              anchor: "!text-white",
            },
          }}
          providers={["google"]}
          onSession={handleSession}
        />
      </AuthContainer>
    </div>
  );
};

export default Login;