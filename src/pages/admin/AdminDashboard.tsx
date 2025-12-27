import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderOpen, GraduationCap, TrendingUp, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [tracks, courses, users, enrollments, certificates] = await Promise.all([
        supabase.from("tracks").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ]);
      return {
        tracks: tracks.count || 0,
        courses: courses.count || 0,
        users: users.count || 0,
        enrollments: enrollments.count || 0,
        certificates: certificates.count || 0,
      };
    },
  });

  return (
    <AppLayout title="Admin Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Visão geral da plataforma</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats?.tracks || 0}</p>
              <p className="text-sm text-muted-foreground">Trilhas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats?.courses || 0}</p>
              <p className="text-sm text-muted-foreground">Cursos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats?.users || 0}</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserPlus className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats?.enrollments || 0}</p>
              <p className="text-sm text-muted-foreground">Inscrições</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{stats?.certificates || 0}</p>
              <p className="text-sm text-muted-foreground">Certificados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Atividade recente</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma atividade recente</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Novos usuários</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum usuário recente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
