import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import SalesKit from "@/pages/SalesKit";
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
]);