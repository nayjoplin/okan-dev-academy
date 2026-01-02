import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Users, BookOpen, Clock, Search, CheckCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

export default function MentorStudents() {
  const [search, setSearch] = useState("");

  // Fetch all enrollments with student and course info
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["mentor-students-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(id, title, slug),
          profile:profiles!enrollments_user_id_fkey(full_name, avatar_url)
        `)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch lesson progress
  const { data: lessonProgress } = useQuery({
    queryKey: ["mentor-students-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Group enrollments by student
  const studentMap = new Map<string, { 
    userId: string; 
    name: string; 
    avatar: string | null;
    courses: Array<{ id: string; title: string; enrolledAt: string; completedAt: string | null }>;
  }>();

  enrollments?.forEach((enrollment) => {
    const userId = enrollment.user_id;
    const profile = enrollment as any;
    
    if (!studentMap.has(userId)) {
      studentMap.set(userId, {
        userId,
        name: profile.profile?.full_name || "Aluna",
        avatar: profile.profile?.avatar_url,
        courses: [],
      });
    }
    
    studentMap.get(userId)!.courses.push({
      id: enrollment.course_id,
      title: profile.course?.title || "Curso",
      enrolledAt: enrollment.enrolled_at,
      completedAt: enrollment.completed_at,
    });
  });

  const students = Array.from(studentMap.values());
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentProgress = (userId: string) => {
    const userProgress = lessonProgress?.filter(lp => lp.user_id === userId) || [];
    const completed = userProgress.filter(lp => lp.is_completed).length;
    const total = userProgress.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <AppLayout
      title="Alunas"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Alunas" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Alunas da Plataforma</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o progresso de {students.length} alunas matriculadas
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Total alunas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrollments?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Matrículas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-okan-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-okan-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {enrollments?.filter(e => e.completed_at).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-okan-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-okan-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.length > 0 
                    ? Math.round(students.reduce((acc, s) => acc + getStudentProgress(s.userId), 0) / students.length)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Progresso médio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const progress = getStudentProgress(student.userId);
              return (
                <Card key={student.userId}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                        {student.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <Badge variant={progress === 100 ? "default" : "secondary"}>
                            {progress}% concluído
                          </Badge>
                        </div>
                        
                        <Progress value={progress} className="h-2 mb-4" />
                        
                        <div className="flex flex-wrap gap-2">
                          {student.courses.map((course) => (
                            <Badge 
                              key={course.id} 
                              variant={course.completedAt ? "default" : "outline"}
                              className="flex items-center gap-1"
                            >
                              {course.completedAt && <CheckCircle className="h-3 w-3" />}
                              {course.title}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Última matrícula: {formatDistanceToNow(
                            new Date(student.courses[0]?.enrolledAt || new Date()), 
                            { addSuffix: true, locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {search ? "Nenhuma aluna encontrada" : "Nenhuma aluna matriculada"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {search 
                  ? "Tente buscar por outro nome" 
                  : "Quando alunas se matricularem, aparecerão aqui"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
