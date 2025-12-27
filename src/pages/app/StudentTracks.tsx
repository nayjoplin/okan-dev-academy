import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function StudentTracks() {
  const { data: tracks, isLoading } = useQuery({
    queryKey: ["all-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: coursesCounts } = useQuery({
    queryKey: ["courses-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("track_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((course) => {
        counts[course.track_id] = (counts[course.track_id] || 0) + 1;
      });
      return counts;
    },
  });

  return (
    <AppLayout
      title="Explorar Trilhas"
      breadcrumbs={[
        { label: "Início", href: "/app" },
        { label: "Explorar Trilhas" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Explorar Trilhas</h1>
          <p className="text-muted-foreground mt-1">
            Escolha uma trilha e comece sua jornada
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks?.map((track: any) => (
              <Card
                key={track.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
                  >
                    {track.icon || "📚"}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{track.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {track.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {coursesCounts?.[track.id] || 0} cursos
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {track.duration || "N/A"}
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/trilhas/${track.slug}`}>
                      Explorar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
