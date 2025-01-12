import { createBrowserRouter } from "react-router-dom";
import MarketingKit from "@/pages/MarketingKit";
import Login from "@/pages/Login";
import Partnerships from "@/pages/Partnerships";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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