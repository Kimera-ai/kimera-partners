import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarMenu } from "@/components/ui/sidebar";
import { Home, LayoutDashboard, Users, BookOpen, Palette, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Partnerships", icon: Users, path: "/partnerships" },
  { title: "Sales Kit", icon: BookOpen, path: "/sales-kit" },
  { title: "Marketing", icon: Palette, path: "/marketing" },
  { title: "Support", icon: MessageSquare, path: "/support" },
];

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#100919]">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white">Kimera</h1>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={location.pathname === item.path ? "bg-primary/10 text-primary" : ""}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;