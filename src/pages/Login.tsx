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
    const handleSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          // Clear any invalid session data
          await supabase.auth.signOut();
          return;
        }

        if (session) {
          navigate("/partner-program");
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        // Clear any invalid session data
        await supabase.auth.signOut();
      }
    };

    handleSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/partner-program");
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token was refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <AuthBackground />
      <AuthContainer>
        <div className="flex flex-col items-center space-y-8 w-full">
          <img 
            src="https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/stuff/Partners%20logo.png?t=2025-01-15T17%3A24%3A57.611Z"
            alt="Partners Logo"
            className="w-48 md:w-64 h-auto animate-fade-in"
          />
          <div className="min-w-[400px] min-h-[339px]">
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
                  container: "supabase-auth-ui_ui-container w-full c-jTXIoq c-jTXIoq-bsgKCL-direction-vertical c-jTXIoq-bXHFxK-gap-large",
                  label: "!text-white !text-left block mb-2 text-base",
                  button: "!bg-primary hover:!bg-primary-hover !text-white w-full h-12 text-base",
                  anchor: "!text-white",
                  divider: "!bg-white/20",
                  message: "!text-red-500 !bg-black/50 !p-3 !rounded-md !mb-4",
                  input: "supabase-auth-ui_ui-input !bg-transparent !border !border-white/20 !text-white !rounded-md !px-4 !py-3 focus:!border-primary hover:!border-primary/80 transition-colors w-full text-base h-12",
                },
              }}
              view="sign_in"
              providers={[]}
              showLinks={true}
            />
          </div>
        </div>
      </AuthContainer>
    </div>
  );
};

export default Login;