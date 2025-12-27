import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Play, FolderOpen } from "lucide-react";

export default function StudentCourses() {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["all-enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses:course_id (
            id,
            title,
            slug,
            description,
            thumbnail_url,
            duration,
            tracks:track_id (
              slug,
              title
            )
          )
        `)
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <AppLayout
      title="Meus Cursos"
      breadcrumbs={[
        { label: "Início", href: "/app" },
        { label: "Meus Cursos" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu progresso e continue aprendendo
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrollments && enrollments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => (
              <Card key={enrollment.id} className="overflow-hidden">
                <div className="h-40 bg-muted flex items-center justify-center">
                  {enrollment.courses?.thumbnail_url ? (
                    <img
                      src={enrollment.courses.thumbnail_url}
                      alt={enrollment.courses.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {enrollment.courses?.tracks?.title}
                  </p>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {enrollment.courses?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    {enrollment.courses?.duration || "N/A"}
                  </div>
                  <Progress value={0} className="h-1 mb-3" />
                  <Button className="w-full" asChild>
                    <Link
                      to={`/trilhas/${enrollment.courses?.tracks?.slug}/cursos/${enrollment.courses?.slug}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continuar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum curso inscrito
              </h3>
              <p className="text-muted-foreground mt-2">
                Explore nossas trilhas e comece sua jornada de aprendizado
              </p>
              <Button className="mt-6" asChild>
                <Link to="/app/trilhas">Explorar trilhas</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
