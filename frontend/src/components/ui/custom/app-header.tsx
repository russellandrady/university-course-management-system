import { Home, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useTokenStore } from "@/store/tokenStore";

interface AppHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  children: ReactNode;
}

export function AppHeader({
  isDarkMode,
  toggleDarkMode,
  children,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username); // Access username from Zustand store

  const handleSignOut = () => {
    const userType = useUserStore.getState().userType; // Get userType before clearing
    useTokenStore.getState().clearToken();
    useUserStore.getState().clearUser();
    if (userType === "admin") {
      navigate("/admin/sign-in");
    } else {
      navigate("/student/sign-in");
    }
    toast.success("Signed out successfully.");
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-3">
          <div className="flex items-center gap-2">
            {/* <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" /> */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Avatar>
                    <AvatarImage
                      src="/mainLogo.svg"
                      alt="home"
                      className={isDarkMode ? "filter invert" : ""}
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <BreadcrumbLink href="#">
                    Greenfield University
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <button
              className="p-2 rounded-full border bg-muted hover:bg-muted/80 flex items-center justify-center"
              onClick={() => navigate("/")}
              aria-label="Go Home"
            >
              <Home className="h-5 w-5" />
            </button>
            {username && (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full border bg-muted hover:bg-muted/80 flex items-center justify-center"
                aria-label="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            {/* Light/Dark Mode Toggle */}
            <button
              className="p-2 rounded-full border bg-muted hover:bg-muted/80 flex items-center justify-center"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
