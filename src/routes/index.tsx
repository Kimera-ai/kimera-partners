import { createBrowserRouter } from "react-router-dom";
import SalesKit from "@/pages/SalesKit";
import MarketingKit from "@/pages/MarketingKit";
import Login from "@/pages/Login";
import Partnerships from "@/pages/Partnerships";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sales-kit",
    element: <SalesKit />,
  },
  {
    path: "/marketing-kit",
    element: <MarketingKit />,
  },
  {
    path: "/partnerships",
    element: <Partnerships />,
  },
]);