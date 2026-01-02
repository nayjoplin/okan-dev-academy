import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Award,
  Target
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

export default function MentorAnalytics() {
  const { data: courses } = useQuery({
    queryKey: ["analytics-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["analytics-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(title)
        `);
      if (error) throw error;
      return data;
    },
  });

  const { data: lessonProgress } = useQuery({
    queryKey: ["analytics-lesson-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: certificates } = useQuery({
    queryKey: ["analytics-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: tracks } = useQuery({
    queryKey: ["analytics-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("is_published", true);
      if (error) throw error;
      return data;
    },
  });

  // Calculate stats
  const totalStudents = new Set(enrollments?.map(e => e.user_id)).size;
  const totalEnrollments = enrollments?.length || 0;
  const completedEnrollments = enrollments?.filter(e => e.completed_at).length || 0;
  const completionRate = totalEnrollments > 0 
    ? Math.round((completedEnrollments / totalEnrollments) * 100) 
    : 0;

  const completedLessons = lessonProgress?.filter(lp => lp.is_completed).length || 0;
  const totalLessonProgress = lessonProgress?.length || 0;
  const lessonCompletionRate = totalLessonProgress > 0
    ? Math.round((completedLessons / totalLessonProgress) * 100)
    : 0;

  // Course enrollment data for chart
  const courseEnrollmentData = courses?.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
    matrículas: enrollments?.filter(e => e.course_id === course.id).length || 0,
    concluídos: enrollments?.filter(e => e.course_id === course.id && e.completed_at).length || 0,
  })) || [];

  // Lesson type distribution
  const lessonTypeData = [
    { name: "Vídeo", value: 60, color: "hsl(var(--primary))" },
    { name: "Texto", value: 25, color: "hsl(var(--muted-foreground))" },
    { name: "Prática", value: 10, color: "hsl(142 76% 36%)" },
    { name: "Quiz", value: 5, color: "hsl(38 92% 50%)" },
  ];

  // Weekly progress simulation
  const weeklyData = [
    { day: "Seg", aulas: 12 },
    { day: "Ter", aulas: 19 },
    { day: "Qua", aulas: 15 },
    { day: "Qui", aulas: 22 },
    { day: "Sex", aulas: 18 },
    { day: "Sáb", aulas: 8 },
    { day: "Dom", aulas: 5 },
  ];

  const isLoading = !courses || !enrollments || !lessonProgress;

  return (
    <AppLayout
      title="Analytics"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Analytics" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Métricas e análises da plataforma
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{totalStudents}</p>
                )}
                <p className="text-sm text-muted-foreground">Alunas ativas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{totalEnrollments}</p>
                )}
                <p className="text-sm text-muted-foreground">Matrículas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-okan-success/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-okan-success" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{completionRate}%</p>
                )}
                <p className="text-sm text-muted-foreground">Taxa conclusão</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-okan-warning/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-okan-warning" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{certificates?.length || 0}</p>
                )}
                <p className="text-sm text-muted-foreground">Certificados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollments by Course */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Matrículas por Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : courseEnrollmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={courseEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="matrículas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="concluídos" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Sem dados disponíveis
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Atividade Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aulas" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lesson Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Progresso das Aulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold">{lessonCompletionRate}%</p>
                  <p className="text-muted-foreground">das aulas concluídas</p>
                </div>
                <Progress value={lessonCompletionRate} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{completedLessons} concluídas</span>
                  <span>{totalLessonProgress} total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tipos de Aulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={lessonTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {lessonTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {lessonTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Resumo Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Trilhas ativas</span>
                  <span className="font-semibold">{tracks?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Cursos publicados</span>
                  <span className="font-semibold">{courses?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Média por aluna</span>
                  <span className="font-semibold">
                    {totalStudents > 0 
                      ? (totalEnrollments / totalStudents).toFixed(1) 
                      : 0} cursos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-okan-success/10 rounded-lg">
                  <span className="text-sm">Cursos concluídos</span>
                  <span className="font-semibold text-okan-success">
                    {completedEnrollments}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
