import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Auth from "./pages/Auth";
import AllProjects from "./pages/AllProjects";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// 21st.dev toolbar - only for development
// import { TwentyFirstToolbar } from "@21st-extension/toolbar-react";
// import { ReactPlugin } from "@21st-extension/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* 21st.dev toolbar - only for development */}
        {/* <TwentyFirstToolbar 
          config={{
            plugins: [ReactPlugin]
          }}
        /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/all-projects" element={<AllProjects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
