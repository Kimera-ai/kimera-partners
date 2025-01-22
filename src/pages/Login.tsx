import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AuthBackground } from "@/components/auth/AuthBackground"
import { AuthContainer } from "@/components/auth/AuthContainer"
import { authStyles } from "@/components/auth/authStyles"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        navigate("/dashboard", { replace: true })
      } else if (event === "SIGNED_OUT") {
        navigate("/login", { replace: true })
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Account updated",
          description: "Your account has been updated."
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  return (
    <div className="relative">
      <AuthBackground />
      <AuthContainer>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              ...authStyles,
              label: {
                ...authStyles.label,
                color: '#FFFFFF',
              },
              message: {
                ...authStyles.message,
                color: '#FFFFFF',
              },
              anchor: {
                ...authStyles.anchor,
                color: '#FFFFFF',
              },
            },
            variables: {
              default: {
                colors: {
                  brand: "#FF2B6E",
                  brandAccent: "#FF068B",
                  inputText: "#FFFFFF",
                },
              },
            },
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </AuthContainer>
    </div>
  )
}

export default Login