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
    // Only check session once on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session check error:", error)
        return
      }
      if (session?.user) {
        navigate("/dashboard", { replace: true })
      }
    }
    
    checkSession()

    // Only listen for sign in events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        navigate("/dashboard", { replace: true })
      }
    })

    return () => subscription.unsubscribe()
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