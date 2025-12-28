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
import { Skeleton } from "@/components/ui/skeleton";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Layers, Play, ArrowLeft } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  course_id: string;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  lesson_type: string;
  duration: string | null;
  order_index: number;
}

interface ModuleForm {
  title: string;
  description: string;
}

const defaultForm: ModuleForm = {
  title: "",
  description: "",
};

export default function AdminModules() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [form, setForm] = useState<ModuleForm>(defaultForm);

  const { data: course } = useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin-modules", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, lessons (*)")
        .eq("course_id", courseId)
        .order("order_index")
        .order("order_index", { referencedTable: "lessons" });
      if (error) throw error;
      return data as Module[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ModuleForm) => {
      const { error } = await supabase.from("modules").insert({
        title: data.title,
        description: data.description || null,
        course_id: courseId,
        order_index: (modules?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo criado com sucesso!");
      setDialogOpen(false);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao criar módulo: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ModuleForm }) => {
      const { error } = await supabase
        .from("modules")
        .update({
          title: data.title,
          description: data.description || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo atualizado com sucesso!");
      setDialogOpen(false);
      setEditingModule(null);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar módulo: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast.success("Módulo excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir módulo: " + error.message);
    },
  });

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setForm({
      title: module.title,
      description: module.description || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule) {
      updateMutation.mutate({ id: editingModule.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const lessonTypeLabels: Record<string, string> = {
    video: "Vídeo",
    text: "Leitura",
    practice: "Prática",
    quiz: "Quiz",
  };

  return (
    <AppLayout
      title={`Módulos - ${course?.title || ""}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Cursos", href: "/admin/cursos" },
        { label: course?.title || "Curso" },
        { label: "Módulos" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/cursos">
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Módulos</h1>
              <p className="text-muted-foreground">{course?.title}</p>
            </div>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingModule(null);
                setForm(defaultForm);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Novo Módulo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingModule ? "Editar Módulo" : "Novo Módulo"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                  />
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
                    {editingModule ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : modules && modules.length > 0 ? (
          <Accordion type="multiple" className="space-y-4">
            {modules.map((module, index) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">{module.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons?.length || 0} aulas
                      </p>
                    </div>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(module)}
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
                            <AlertDialogTitle>Excluir módulo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Todas as aulas
                              associadas também serão excluídas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(module.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Aulas</span>
                      <Button size="sm" asChild>
                        <Link to={`/admin/modulos/${module.id}/aulas`}>
                          <Plus size={14} className="mr-2" />
                          Nova Aula
                        </Link>
                      </Button>
                    </div>
                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {lessonIndex + 1}.
                              </span>
                              <div>
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {lessonTypeLabels[lesson.lesson_type] ||
                                    lesson.lesson_type}
                                  {lesson.duration && ` • ${lesson.duration}`}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/admin/modulos/${module.id}/aulas`}>
                                <Pencil size={14} />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma aula neste módulo
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Layers className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum módulo</h3>
              <p className="text-muted-foreground mt-2">
                Crie seu primeiro módulo para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
