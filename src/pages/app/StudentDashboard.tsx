import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Clock,
  Trophy,
  GraduationCap,
  ArrowRight,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses:course_id (
            id,
            title,
            slug,
            thumbnail_url,
            duration,
            tracks:track_id (
              slug
            )
          )
        `)
        .eq("user_id", user?.id)
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ["student-stats", user?.id],
    queryFn: async () => {
      const [enrollmentsCount, certificatesCount, lessonsCompleted] = await Promise.all([
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
        supabase.from("certificates").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
        supabase.from("lesson_progress").select("*", { count: "exact", head: true }).eq("user_id", user?.id).eq("is_completed", true),
      ]);
      return {
        enrollments: enrollmentsCount.count || 0,
        certificates: certificatesCount.count || 0,
        lessonsCompleted: lessonsCompleted.count || 0,
      };
    },
    enabled: !!user?.id,
  });

  const { data: tracks } = useQuery({
    queryKey: ["featured-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("order_index")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] || "Aluna";

  return (
    <AppLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Início" }]}
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          {profileLoading ? (
            <Skeleton className="h-9 w-64 mb-2" />
          ) : (
            <h1 className="text-3xl font-bold">
              Olá, <span className="okan-gradient-text">{firstName}</span>! 👋
            </h1>
          )}
          <p className="text-muted-foreground mt-1">
            Continue sua jornada de aprendizado
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.enrollments || 0}</p>
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.lessonsCompleted || 0}</p>
                <p className="text-sm text-muted-foreground">Aulas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.certificates || 0}</p>
                <p className="text-sm text-muted-foreground">Certificados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-okan-warm/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-okan-warm" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Dias seguidos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Continuar aprendendo</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/app/cursos">
                      Ver todos
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment: any) => (
                      <Link
                        key={enrollment.id}
                        to={`/trilhas/${enrollment.courses?.tracks?.slug}/cursos/${enrollment.courses?.slug}`}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                          {enrollment.courses?.thumbnail_url ? (
                            <img
                              src={enrollment.courses.thumbnail_url}
                              alt={enrollment.courses.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {enrollment.courses?.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {enrollment.courses?.duration || "N/A"}
                          </div>
                          <Progress value={0} className="mt-2 h-1" />
                        </div>
                        <Button size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      Você ainda não está inscrito em nenhum curso
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/app/trilhas">Explorar trilhas</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trilhas em destaque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tracks?.map((track: any) => (
                  <Link
                    key={track.id}
                    to={`/app/trilhas`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
                    >
                      {track.icon || "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {track.duration || "N/A"}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Motivation */}
            <Card className="okan-gradient text-primary-foreground">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Continue assim!</h3>
                <p className="text-sm text-primary-foreground/80">
                  Cada passo conta na sua jornada. Você está construindo um
                  futuro incrível!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
