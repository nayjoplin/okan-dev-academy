import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trilhas from "./pages/Trilhas";
import TrackDetail from "./pages/TrackDetail";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";
import Inscricao from "./pages/Inscricao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/trilhas/:trackId" element={<TrackDetail />} />
          <Route path="/trilhas/:trackId/cursos/:courseId" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/inscricao" element={<Inscricao />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
