import { createBrowserRouter, Navigate } from "react-router-dom"
import MarketingKit from "@/pages/MarketingKit"
import Login from "@/pages/Login"
import PartnerProgram from "@/pages/PartnerProgram"
import Dashboard from "@/pages/Dashboard"
import Pricing from "@/pages/Pricing"
import ThankYou from "@/pages/ThankYou"
import Themes from "@/pages/Themes"
import { useSession } from "@/hooks/useSession"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useSession()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/partner-program" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/partner-program",
    element: (
      <ProtectedRoute>
        <PartnerProgram />
      </ProtectedRoute>
    ),
  },
  {
    path: "/marketing-kit",
    element: (
      <ProtectedRoute>
        <MarketingKit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/marketing-kit/themes",
    element: (
      <ProtectedRoute>
        <Themes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pricing",
    element: (
      <ProtectedRoute>
        <Pricing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/thank-you",
    element: (
      <ProtectedRoute>
        <ThankYou />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
])