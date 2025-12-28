import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Code,
  ClipboardCheck,
  Clock,
  StickyNote,
  BookOpen,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export default function LessonPlayer() {
  const { trackId, courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course-detail", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          tracks:track_id (id, title, slug)
        `)
        .eq("slug", courseId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch modules with lessons
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["course-modules", course?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`
          *,
          lessons (*)
        `)
        .eq("course_id", course?.id)
        .order("order_index")
        .order("order_index", { referencedTable: "lessons" });
      if (error) throw error;
      return data;
    },
    enabled: !!course?.id,
  });

  // Get all lessons in order
  const allLessons = modules?.flatMap((m) => m.lessons) || [];
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex];
  const prevLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  // Fetch lesson progress
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson-progress", lessonId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId && !!user?.id,
  });

  // Fetch user notes for this lesson
  const { data: lessonNotes } = useQuery({
    queryKey: ["lesson-notes", lessonId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId && !!user?.id,
  });

  useEffect(() => {
    if (lessonNotes?.content) {
      setNotes(lessonNotes.content);
    } else {
      setNotes("");
    }
  }, [lessonNotes]);

  // Mark lesson as complete
  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (lessonProgress) {
        const { error } = await supabase
          .from("lesson_progress")
          .update({
            is_completed: true,
            progress_percent: 100,
            completed_at: new Date().toISOString(),
          })
          .eq("id", lessonProgress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lesson_progress").insert({
          lesson_id: lessonId!,
          user_id: user?.id!,
          is_completed: true,
          progress_percent: 100,
          completed_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["all-lesson-progress"] });
      toast.success("Aula concluída!");
    },
  });

  // Save notes
  const saveNotesMutation = useMutation({
    mutationFn: async (content: string) => {
      if (lessonNotes) {
        const { error } = await supabase
          .from("lesson_notes")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", lessonNotes.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lesson_notes").insert({
          lesson_id: lessonId!,
          user_id: user?.id!,
          content,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-notes"] });
      toast.success("Anotações salvas!");
    },
  });

  // Fetch all progress for this course
  const { data: allProgress } = useQuery({
    queryKey: ["all-lesson-progress", course?.id, user?.id],
    queryFn: async () => {
      const lessonIds = allLessons.map((l) => l.id);
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

  const isLessonCompleted = (id: string) =>
    allProgress?.some((p) => p.lesson_id === id && p.is_completed) || false;

  const completedCount = allProgress?.filter((p) => p.is_completed).length || 0;
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/app/cursos/${courseId}/aula/${nextLesson.id}`);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/app/cursos/${courseId}/aula/${prevLesson.id}`);
    }
  };

  if (courseLoading || modulesLoading) {
    return (
      <AppLayout title="Carregando...">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!currentLesson) {
    return (
      <AppLayout title="Aula não encontrada">
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mt-4">Aula não encontrada</h2>
          <Button asChild className="mt-4">
            <Link to={`/trilhas/${trackId}/cursos/${courseId}`}>
              Voltar ao curso
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const LessonSidebar = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Conteúdo do curso</h3>
        <span className="text-sm text-muted-foreground">
          {progressPercent}% concluído
        </span>
      </div>
      <Progress value={progressPercent} className="h-2 mb-4" />

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {modules?.map((module, moduleIndex) => (
            <div key={module.id}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Módulo {moduleIndex + 1}: {module.title}
              </h4>
              <div className="space-y-1">
                {module.lessons?.map((lesson: any) => (
                  <Link
                    key={lesson.id}
                    to={`/app/cursos/${courseId}/aula/${lesson.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                      lesson.id === lessonId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle2 size={16} className={lesson.id === lessonId ? "" : "text-green-500"} />
                    ) : (
                      <Circle size={16} />
                    )}
                    <span className="truncate flex-1">{lesson.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <AppLayout
      title={currentLesson.title}
      breadcrumbs={[
        { label: "Meus Cursos", href: "/app/cursos" },
        { label: course?.title || "", href: `/trilhas/${trackId}/cursos/${courseId}` },
        { label: currentLesson.title },
      ]}
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navegação</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <LessonSidebar />
                  </div>
                </SheetContent>
              </Sheet>
              <Badge variant="outline" className="gap-1">
                {lessonTypeIcons[currentLesson.lesson_type]}
                {lessonTypeLabels[currentLesson.lesson_type]}
              </Badge>
              {currentLesson.duration && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock size={14} />
                  {currentLesson.duration}
                </span>
              )}
            </div>
            {lessonProgress?.is_completed ? (
              <Badge className="bg-green-500 text-white">
                <CheckCircle2 size={14} className="mr-1" />
                Concluída
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => markCompleteMutation.mutate()}
                disabled={markCompleteMutation.isPending}
              >
                <CheckCircle2 size={14} className="mr-1" />
                Marcar como concluída
              </Button>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-6">{currentLesson.title}</h1>

          {/* Video Player or Content */}
          <div className="mb-6">
            {currentLesson.lesson_type === "video" && currentLesson.video_url ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={currentLesson.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: currentLesson.content || "<p>Conteúdo não disponível.</p>",
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tabs for Notes and Transcript */}
          <Tabs defaultValue="notes" className="mb-6">
            <TabsList>
              <TabsTrigger value="notes" className="gap-2">
                <StickyNote size={14} />
                Anotações
              </TabsTrigger>
              {currentLesson.video_transcript && (
                <TabsTrigger value="transcript" className="gap-2">
                  <FileText size={14} />
                  Transcrição
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    placeholder="Escreva suas anotações aqui..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[150px] mb-3"
                  />
                  <Button
                    size="sm"
                    onClick={() => saveNotesMutation.mutate(notes)}
                    disabled={saveNotesMutation.isPending}
                  >
                    Salvar anotações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            {currentLesson.video_transcript && (
              <TabsContent value="transcript" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {currentLesson.video_transcript}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevLesson}
              disabled={!prevLesson}
            >
              <ArrowLeft size={16} className="mr-2" />
              Anterior
            </Button>
            <Button onClick={handleNextLesson} disabled={!nextLesson}>
              Próxima
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <Card>
            <CardContent className="p-4">
              <LessonSidebar />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
