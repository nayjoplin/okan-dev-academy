import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleRoute } from "@/components/RoleRoute";

// Public pages
import Index from "./pages/Index";
import Trilhas from "./pages/Trilhas";
import TrackDetail from "./pages/TrackDetail";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Sobre from "./pages/Sobre";
import Inscricao from "./pages/Inscricao";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/app/StudentDashboard";
import StudentCourses from "./pages/app/StudentCourses";
import StudentTracks from "./pages/app/StudentTracks";
import StudentCertificates from "./pages/app/StudentCertificates";
import StudentCommunity from "./pages/app/StudentCommunity";
import CourseView from "./pages/app/CourseView";
import LessonPlayer from "./pages/app/LessonPlayer";

// Mentor pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorCourses from "./pages/mentor/MentorCourses";
import MentorStudents from "./pages/mentor/MentorStudents";
import MentorDiscussions from "./pages/mentor/MentorDiscussions";
import MentorAnalytics from "./pages/mentor/MentorAnalytics";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTracks from "./pages/admin/AdminTracks";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminModules from "./pages/admin/AdminModules";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/trilhas" element={<Trilhas />} />
            <Route path="/trilhas/:trackId" element={<TrackDetail />} />
            <Route path="/trilhas/:trackId/cursos/:courseId" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/inscricao" element={<Inscricao />} />
            
            {/* Redirect old dashboard */}
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />

            {/* Student Routes */}
            <Route path="/app" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><StudentDashboard /></RoleRoute>} />
            <Route path="/app/cursos" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><StudentCourses /></RoleRoute>} />
            <Route path="/app/cursos/:courseId" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><CourseView /></RoleRoute>} />
            <Route path="/app/cursos/:courseId/aula/:lessonId" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><LessonPlayer /></RoleRoute>} />
            <Route path="/app/trilhas" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><StudentTracks /></RoleRoute>} />
            <Route path="/app/certificados" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><StudentCertificates /></RoleRoute>} />
            <Route path="/app/comunidade" element={<RoleRoute allowedRoles={["student", "mentor", "admin"]}><StudentCommunity /></RoleRoute>} />

            {/* Mentor Routes */}
            <Route path="/mentor" element={<RoleRoute allowedRoles={["mentor", "admin"]}><MentorDashboard /></RoleRoute>} />
            <Route path="/mentor/cursos" element={<RoleRoute allowedRoles={["mentor", "admin"]}><MentorCourses /></RoleRoute>} />
            <Route path="/mentor/alunos" element={<RoleRoute allowedRoles={["mentor", "admin"]}><MentorStudents /></RoleRoute>} />
            <Route path="/mentor/discussoes" element={<RoleRoute allowedRoles={["mentor", "admin"]}><MentorDiscussions /></RoleRoute>} />
            <Route path="/mentor/analytics" element={<RoleRoute allowedRoles={["mentor", "admin"]}><MentorAnalytics /></RoleRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/trilhas" element={<RoleRoute allowedRoles={["admin"]}><AdminTracks /></RoleRoute>} />
            <Route path="/admin/cursos" element={<RoleRoute allowedRoles={["admin"]}><AdminCourses /></RoleRoute>} />
            <Route path="/admin/cursos/:courseId/modulos" element={<RoleRoute allowedRoles={["admin"]}><AdminModules /></RoleRoute>} />
            <Route path="/admin/modulos/:moduleId/aulas" element={<RoleRoute allowedRoles={["admin"]}><AdminLessons /></RoleRoute>} />
            <Route path="/admin/usuarios" element={<RoleRoute allowedRoles={["admin"]}><AdminUsers /></RoleRoute>} />
            <Route path="/admin/aulas" element={<RoleRoute allowedRoles={["admin"]}><AdminPlaceholder title="Aulas" description="Gerencie aulas pelo menu de cursos" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Aulas" }]} /></RoleRoute>} />
            <Route path="/admin/certificados" element={<RoleRoute allowedRoles={["admin"]}><AdminPlaceholder title="Certificados" description="Gerencie os certificados" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Certificados" }]} /></RoleRoute>} />
            <Route path="/admin/relatorios" element={<RoleRoute allowedRoles={["admin"]}><AdminPlaceholder title="Relatórios" description="Visualize relatórios" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Relatórios" }]} /></RoleRoute>} />
            <Route path="/admin/configuracoes" element={<RoleRoute allowedRoles={["admin"]}><AdminPlaceholder title="Configurações" description="Configure a plataforma" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Configurações" }]} /></RoleRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
