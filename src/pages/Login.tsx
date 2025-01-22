import { useEffect } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { AuthBackground } from "@/components/auth/AuthBackground"
import { AuthContainer } from "@/components/auth/AuthContainer"
import { authStyles } from "@/components/auth/authStyles"

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      console.log("Initial session check...")
      const { data: { session } } = await supabase.auth.getSession()
      console.log("Initial session result:", session)
      if (session) {
        console.log("Valid session found, redirecting to dashboard")
        navigate("/dashboard", { replace: true })
      }
    }
    
    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      if (session && event === "SIGNED_IN") {
        console.log("User signed in, redirecting to dashboard")
        navigate("/dashboard", { replace: true })
      }
    })

    return () => {
      console.log("Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="relative">
      <AuthBackground />
      <AuthContainer>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: authStyles,
            variables: {
              default: {
                colors: {
                  brand: "#FF2B6E",
                  brandAccent: "#FF068B",
                },
              },
            },
          }}
          providers={["google"]}
          redirectTo={window.location.origin + "/auth/callback"}
        />
      </AuthContainer>
    </div>
  )
}

export default Login