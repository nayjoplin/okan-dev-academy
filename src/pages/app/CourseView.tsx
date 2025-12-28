import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  FileText,
  Code,
  ClipboardCheck,
  Clock,
  BookOpen,
} from "lucide-react";

const lessonTypeIcons: Record<string, React.ReactNode> = {
  video: <Play size={14} />,
  text: <FileText size={14} />,
  practice: <Code size={14} />,
  quiz: <ClipboardCheck size={14} />,
};

const lessonTypeLabels: Record<string, string> = {
  video: "Vídeo",
  text: "Leitura",
  practice: "Prática",
  quiz: "Quiz",
};

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch course
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course-view", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`*, tracks:track_id (id, title, slug)`)
        .eq("slug", courseId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch enrollment
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", course?.id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", course?.id)
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!course?.id && !!user?.id,
  });

  // Fetch modules with lessons
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["course-modules-view", course?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`*, lessons (*)`)
        .eq("course_id", course?.id)
        .order("order_index")
        .order("order_index", { referencedTable: "lessons" });
      if (error) throw error;
      return data;
    },
    enabled: !!course?.id,
  });

  // Fetch lesson progress
  const allLessons = modules?.flatMap((m) => m.lessons) || [];
  const { data: allProgress } = useQuery({
    queryKey: ["course-progress", course?.id, user?.id],
    queryFn: async () => {
      const lessonIds = allLessons.map((l) => l.id);
      if (lessonIds.length === 0) return [];
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .in("lesson_id", lessonIds)
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: allLessons.length > 0 && !!user?.id,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("enrollments").insert({
        course_id: course?.id,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      queryClient.invalidateQueries({ queryKey: ["all-enrollments"] });
      toast.success("Inscrição realizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao realizar inscrição");
    },
  });

  const isLessonCompleted = (id: string) =>
    allProgress?.some((p) => p.lesson_id === id && p.is_completed) || false;

  const completedCount = allProgress?.filter((p) => p.is_completed).length || 0;
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find next incomplete lesson
  const nextLesson = allLessons.find((l) => !isLessonCompleted(l.id));

  if (courseLoading) {
    return (
      <AppLayout title="Carregando...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!course) {
    return (
      <AppLayout title="Curso não encontrado">
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mt-4">Curso não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/app/cursos">Voltar aos cursos</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={course.title}
      breadcrumbs={[
        { label: "Meus Cursos", href: "/app/cursos" },
        { label: course.title },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <div>
            {enrollment ? (
              <Badge variant="outline" className="mb-4">
                Inscrito
              </Badge>
            ) : (
              <Badge variant="secondary" className="mb-4">
                Não inscrito
              </Badge>
            )}
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          {/* Progress (if enrolled) */}
          {enrollment && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Seu progresso</span>
                  <span className="text-primary font-semibold">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-3 mb-4" />

                {nextLesson && (
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Próxima lição</p>
                      <p className="font-medium">{nextLesson.title}</p>
                    </div>
                    <Button asChild>
                      <Link to={`/app/cursos/${courseId}/aula/${nextLesson.id}`}>
                        Continuar
                        <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enroll Button (if not enrolled) */}
          {!enrollment && user && (
            <Card className="okan-gradient text-primary-foreground">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Comece a estudar agora</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Inscreva-se gratuitamente e tenha acesso a todo o conteúdo
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => enrollMutation.mutate()}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? "Inscrevendo..." : "Inscrever-se"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Modules */}
          {modulesLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Módulos do curso</h2>

              {modules?.map((module, moduleIndex) => {
                const moduleLessons = module.lessons || [];
                const moduleCompleted = moduleLessons.every((l: any) => isLessonCompleted(l.id));
                const moduleInProgress = moduleLessons.some((l: any) => isLessonCompleted(l.id)) && !moduleCompleted;

                return (
                  <Card key={module.id}>
                    <CardContent className="p-0">
                      {/* Module Header */}
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              moduleCompleted
                                ? "bg-green-500 text-white"
                                : moduleInProgress
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {moduleCompleted ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <span className="text-sm font-bold">{moduleIndex + 1}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {moduleLessons.length} lições
                            </p>
                          </div>
                        </div>

                        {moduleCompleted && (
                          <Badge className="bg-green-500 text-white">Concluído</Badge>
                        )}
                        {moduleInProgress && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Em andamento
                          </Badge>
                        )}
                      </div>

                      {/* Lessons List */}
                      <div className="divide-y">
                        {moduleLessons.map((lesson: any) => {
                          const completed = isLessonCompleted(lesson.id);
                          const canAccess = enrollment;

                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-4 ${
                                canAccess ? "hover:bg-muted/50 transition-colors" : "opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {completed ? (
                                  <CheckCircle2 size={18} className="text-green-500" />
                                ) : canAccess ? (
                                  <Circle size={18} className="text-muted-foreground" />
                                ) : (
                                  <Lock size={18} className="text-muted-foreground" />
                                )}
                                <div>
                                  <p className={`font-medium ${completed ? "text-muted-foreground" : ""}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      {lessonTypeIcons[lesson.lesson_type]}
                                      {lessonTypeLabels[lesson.lesson_type]}
                                    </span>
                                    {lesson.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {lesson.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {canAccess && (
                                <Button size="sm" variant="ghost" asChild>
                                  <Link to={`/app/cursos/${courseId}/aula/${lesson.id}`}>
                                    <Play size={14} />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Informações do curso</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trilha</span>
                    <span className="font-medium">{course.tracks?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Módulos</span>
                    <span className="font-medium">{modules?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lições</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-medium">{course.duration || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificado</span>
                    <span className="font-medium text-primary">Incluso</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!enrollment && !user && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Faça login para se inscrever</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie sua conta gratuita e comece a estudar
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/login">Entrar / Cadastrar</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
