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
    console.log("Checking session...")
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session check result:", session)
      if (session) {
        console.log("Session found, navigating to dashboard")
        navigate("/dashboard")
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session)
      if (session) {
        console.log("New session detected, navigating to dashboard")
        navigate("/dashboard")
      }
    })

    return () => {
      console.log("Cleaning up subscription")
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