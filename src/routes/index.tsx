import { createBrowserRouter, Navigate } from "react-router-dom";
import MarketingKit from "@/pages/MarketingKit";
import Login from "@/pages/Login";
import PartnerProgram from "@/pages/PartnerProgram";
import Dashboard from "@/pages/Dashboard";
import { useSession } from "@/hooks/useSession";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Temporarily bypass authentication check for development
  return <>{children}</>;
  
  // Original authentication logic (commented out for now)
  /*
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
  */
};

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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);