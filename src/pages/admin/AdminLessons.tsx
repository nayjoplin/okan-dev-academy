import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Play, FileText, Code, ClipboardCheck, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type LessonType = Database["public"]["Enums"]["lesson_type"];

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  video_transcript: string | null;
  duration: string | null;
  lesson_type: LessonType;
  order_index: number;
  is_published: boolean;
  module_id: string;
}

interface LessonForm {
  title: string;
  content: string;
  video_url: string;
  video_transcript: string;
  duration: string;
  lesson_type: LessonType;
  is_published: boolean;
}

const defaultForm: LessonForm = {
  title: "",
  content: "",
  video_url: "",
  video_transcript: "",
  duration: "",
  lesson_type: "video",
  is_published: true,
};

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

export default function AdminLessons() {
  const { moduleId } = useParams();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [form, setForm] = useState<LessonForm>(defaultForm);

  const { data: module } = useQuery({
    queryKey: ["admin-module", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, courses:course_id (id, title)")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["admin-lessons", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", moduleId)
        .order("order_index");
      if (error) throw error;
      return data as Lesson[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: LessonForm) => {
      const { error } = await supabase.from("lessons").insert({
        title: data.title,
        content: data.content || null,
        video_url: data.video_url || null,
        video_transcript: data.video_transcript || null,
        duration: data.duration || null,
        lesson_type: data.lesson_type,
        is_published: data.is_published,
        module_id: moduleId,
        order_index: (lessons?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula criada com sucesso!");
      setDialogOpen(false);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao criar aula: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LessonForm }) => {
      const { error } = await supabase
        .from("lessons")
        .update({
          title: data.title,
          content: data.content || null,
          video_url: data.video_url || null,
          video_transcript: data.video_transcript || null,
          duration: data.duration || null,
          lesson_type: data.lesson_type,
          is_published: data.is_published,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula atualizada com sucesso!");
      setDialogOpen(false);
      setEditingLesson(null);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar aula: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir aula: " + error.message);
    },
  });

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title,
      content: lesson.content || "",
      video_url: lesson.video_url || "",
      video_transcript: lesson.video_transcript || "",
      duration: lesson.duration || "",
      lesson_type: lesson.lesson_type,
      is_published: lesson.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <AppLayout
      title={`Aulas - ${module?.title || ""}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Cursos", href: "/admin/cursos" },
        {
          label: module?.courses?.title || "Curso",
          href: `/admin/cursos/${module?.courses?.id}/modulos`,
        },
        { label: module?.title || "Módulo" },
        { label: "Aulas" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/cursos/${module?.courses?.id}/modulos`}>
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Aulas</h1>
              <p className="text-muted-foreground">{module?.title}</p>
            </div>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingLesson(null);
                setForm(defaultForm);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Nova Aula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLesson ? "Editar Aula" : "Nova Aula"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lesson_type">Tipo</Label>
                    <Select
                      value={form.lesson_type}
                      onValueChange={(value: LessonType) =>
                        setForm({ ...form, lesson_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="text">Leitura</SelectItem>
                        <SelectItem value="practice">Prática</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    placeholder="Ex: 15min"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                  />
                </div>

                {form.lesson_type === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL do Vídeo (embed)</Label>
                    <Input
                      id="video_url"
                      placeholder="https://www.youtube.com/embed/..."
                      value={form.video_url}
                      onChange={(e) =>
                        setForm({ ...form, video_url: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo (HTML)</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows={6}
                    placeholder="<p>Conteúdo da aula...</p>"
                  />
                </div>

                {form.lesson_type === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="video_transcript">Transcrição</Label>
                    <Textarea
                      id="video_transcript"
                      value={form.video_transcript}
                      onChange={(e) =>
                        setForm({ ...form, video_transcript: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_published"
                    checked={form.is_published}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, is_published: checked })
                    }
                  />
                  <Label htmlFor="is_published">Publicado</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingLesson ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : lessons && lessons.length > 0 ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson, index) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {lessonTypeIcons[lesson.lesson_type]}
                        {lessonTypeLabels[lesson.lesson_type]}
                      </div>
                    </TableCell>
                    <TableCell>{lesson.duration || "-"}</TableCell>
                    <TableCell>
                      {lesson.is_published ? (
                        <Badge className="bg-green-500">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lesson)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir aula?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(lesson.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Play className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma aula</h3>
              <p className="text-muted-foreground mt-2">
                Crie sua primeira aula para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
