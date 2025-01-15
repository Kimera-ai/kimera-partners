import { createBrowserRouter, Navigate } from "react-router-dom";
import MarketingKit from "@/pages/MarketingKit";
import Login from "@/pages/Login";
import Partnerships from "@/pages/Partnerships";
import Dashboard from "@/pages/Dashboard";
import { useSession } from "@/hooks/useSession";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/partnerships" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/partnerships",
    element: (
      <ProtectedRoute>
        <Partnerships />
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