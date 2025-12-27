import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/trilhas/CourseCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, BookOpen, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Track {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  duration: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  duration: string | null;
}

const TrackDetailPage = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackAndCourses = async () => {
      // Fetch track by slug
      const { data: trackData, error: trackError } = await supabase
        .from("tracks")
        .select("*")
        .eq("slug", trackId)
        .maybeSingle();

      if (trackError) {
        console.error("Error fetching track:", trackError);
        setLoading(false);
        return;
      }

      setTrack(trackData);

      if (trackData) {
        // Fetch courses for this track
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .eq("track_id", trackData.id)
          .order("order_index");

        if (coursesError) {
          console.error("Error fetching courses:", coursesError);
        } else {
          setCourses(coursesData || []);
        }
      }

      setLoading(false);
    };

    fetchTrackAndCourses();
  }, [trackId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="h-64 rounded-2xl mb-8" />
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Trilha não encontrada</h1>
            <Button asChild>
              <Link to="/trilhas">Voltar para trilhas</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalCourses = courses.length;
  const completedCourses = 0; // Will be dynamic when user progress is implemented
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/trilhas">
              <ArrowLeft size={16} />
              Voltar para trilhas
            </Link>
          </Button>

          {/* Track Header */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Trilha <span className="okan-gradient-text">{track.title}</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">{track.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{track.duration || "0h"} de conteúdo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={16} className="text-primary" />
                  <span>{totalCourses} cursos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-primary" />
                  <span>Certificado incluso</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Seu progresso na trilha</span>
                <span className="text-sm text-primary font-semibold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {completedCourses} de {totalCourses} cursos concluídos
              </p>
            </div>
          </div>

          {/* Courses List */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Cursos da trilha</h2>
            {courses.length === 0 ? (
              <p className="text-muted-foreground">Nenhum curso disponível nesta trilha ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.slug}
                    trackId={trackId || ""}
                    title={course.title}
                    description={course.description || ""}
                    modulesCount={0}
                    duration={course.duration || "0h"}
                    progress={0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          {courses.length > 0 && (
            <div className="bg-secondary/10 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Continue sua jornada!</h3>
              <p className="text-muted-foreground mb-4">
                Você está no caminho certo. Continue estudando e desbloqueie novos cursos.
              </p>
              <Button asChild>
                <Link to={`/trilhas/${trackId}/cursos/${courses[0].slug}`}>
                  Começar a estudar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackDetailPage;
