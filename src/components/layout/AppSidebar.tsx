import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ChevronUp,
  FolderOpen,
  MessageSquare,
  BarChart3,
  UserCog,
  FileText,
  Award,
  Play,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin, isMentor, isStudent } = useUserRole();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const isActive = (path: string) => location.pathname === path;

  const studentLinks = [
    { href: "/app", label: "Início", icon: LayoutDashboard },
    { href: "/app/cursos", label: "Meus Cursos", icon: BookOpen },
    { href: "/app/trilhas", label: "Explorar Trilhas", icon: FolderOpen },
    { href: "/app/certificados", label: "Certificados", icon: Award },
    { href: "/app/comunidade", label: "Comunidade", icon: MessageSquare },
  ];

  const mentorLinks = [
    { href: "/mentor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mentor/cursos", label: "Meus Cursos", icon: BookOpen },
    { href: "/mentor/alunos", label: "Meus Alunos", icon: Users },
    { href: "/mentor/discussoes", label: "Discussões", icon: MessageSquare },
    { href: "/mentor/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/trilhas", label: "Trilhas", icon: FolderOpen },
    { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
    { href: "/admin/aulas", label: "Aulas", icon: Play },
    { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
    { href: "/admin/certificados", label: "Certificados", icon: GraduationCap },
    { href: "/admin/relatorios", label: "Relatórios", icon: FileText },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ];

  const initials = profile?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg okan-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">O</span>
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">
            Okan
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Student Section */}
        {isStudent && (
          <SidebarGroup>
            <SidebarGroupLabel>Aluna</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {studentLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={isActive(link.href)}>
                      <Link to={link.href}>
                        <link.icon size={18} />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Mentor Section */}
        {isMentor && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Mentor</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mentorLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild isActive={isActive(link.href)}>
                        <Link to={link.href}>
                          <link.icon size={18} />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild isActive={isActive(link.href)}>
                        <Link to={link.href}>
                          <link.icon size={18} />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium truncate max-w-[120px]">
                      {profile?.full_name || "Usuário"}
                    </span>
                    <span className="text-xs text-sidebar-foreground/70 truncate max-w-[120px]">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" size={16} />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link to="/app/perfil">
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut size={16} className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
