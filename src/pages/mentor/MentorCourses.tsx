import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, Clock, Layers, CheckCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MentorCourses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["mentor-all-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          track:tracks(title, color),
          modules(id)
        `)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["mentor-course-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id");
      if (error) throw error;
      return data;
    },
  });

  const getEnrollmentCount = (courseId: string) => {
    return enrollments?.filter(e => e.course_id === courseId).length || 0;
  };

  return (
    <AppLayout
      title="Meus Cursos"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Cursos" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cursos da Plataforma</h1>
            <p className="text-muted-foreground mt-1">
              Visualize todos os cursos e acompanhe as matrículas
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-2 bg-primary" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {(course as any).track?.title || "Sem trilha"}
                      </Badge>
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                    </div>
                    {course.is_published ? (
                      <Badge variant="outline" className="text-okan-success border-okan-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Rascunho
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description || "Sem descrição"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      {(course as any).modules?.length || 0} módulos
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {getEnrollmentCount(course.id)} alunas
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {course.slug}
                    </div>
                  </div>

                  <Link to={`/app/course/${course.slug}`}>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Curso
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum curso cadastrado</h3>
              <p className="text-muted-foreground mt-2">
                Os cursos serão exibidos aqui quando forem criados pelo administrador
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
