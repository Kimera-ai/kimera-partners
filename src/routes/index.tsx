import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import SalesKit from "@/pages/SalesKit";
import MarketingKit from "@/pages/MarketingKit";
import Login from "@/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/sales-kit",
    element: <SalesKit />,
  },
  {
    path: "/marketing-kit",
    element: <MarketingKit />,
  },
]);