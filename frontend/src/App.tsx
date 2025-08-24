import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppHeader } from "@/components/ui/custom/app-header";
import { useUserStore } from "./store/userStore";
import { ApiError } from "./types/auth/ApiError";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "An unexpected error occurred";
        toast.error(errorMessage)

        console.error("API Error:", apiError);
      },
    },
  },
});

function App() {
  const isDarkMode = useUserStore((state) => state.modeDark); // Retrieve modeDark from Zustand store

  const toggleDarkMode = () => {
    useUserStore.getState().toggleMode();
    document.documentElement.classList.toggle("dark");
  };
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppHeader isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <Outlet />
      </AppHeader>
    </QueryClientProvider>
  );
}

export default App;
