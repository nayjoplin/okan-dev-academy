import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MentorDashboard() {
  const { user } = useAuth();

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

  // Fetch all courses (mentors can see all)
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["mentor-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          track:tracks(title)
        `)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  // Fetch all enrollments
  const { data: enrollments } = useQuery({
    queryKey: ["mentor-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(title),
          profile:profiles!enrollments_user_id_fkey(full_name)
        `)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent discussions
  const { data: discussions } = useQuery({
    queryKey: ["mentor-discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          *,
          course:courses(title),
          profile:profiles!discussions_user_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Fetch lesson progress for analytics
  const { data: lessonProgress } = useQuery({
    queryKey: ["mentor-lesson-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] || "Mentor";
  const totalCourses = courses?.length || 0;
  const totalStudents = new Set(enrollments?.map(e => e.user_id)).size;
  const totalDiscussions = discussions?.length || 0;
  
  const completedLessons = lessonProgress?.filter(lp => lp.is_completed).length || 0;
  const totalProgress = lessonProgress?.length || 0;
  const completionRate = totalProgress > 0 ? Math.round((completedLessons / totalProgress) * 100) : 0;

  const recentEnrollments = enrollments?.slice(0, 5) || [];

  return (
    <AppLayout
      title="Dashboard do Mentor"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Olá, <span className="okan-gradient-text">{firstName}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o progresso das suas alunas
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
                {coursesLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold">{totalCourses}</p>
                )}
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">Alunas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDiscussions}</p>
                <p className="text-sm text-muted-foreground">Discussões</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-okan-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-okan-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa conclusão</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Discussions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discussões recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {discussions && discussions.length > 0 ? (
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                        {(discussion as any).profile?.full_name?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{discussion.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {(discussion as any).profile?.full_name} • {(discussion as any).course?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma discussão ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Matrículas recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                        {(enrollment as any).profile?.full_name?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {(enrollment as any).profile?.full_name || "Aluna"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(enrollment as any).course?.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(enrollment.enrolled_at), { addSuffix: true, locale: ptBR })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma matrícula ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Courses Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cursos da plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses && courses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.slice(0, 6).map((course) => {
                  const courseEnrollments = enrollments?.filter(e => e.course_id === course.id).length || 0;
                  return (
                    <div key={course.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant="secondary">{course.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {(course as any).track?.title}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {courseEnrollments} alunas
                        </span>
                        {course.is_published && (
                          <Badge variant="outline" className="text-okan-success border-okan-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Publicado
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum curso cadastrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
