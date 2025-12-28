import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Plus, Pencil, Trash2, BookOpen, Layers } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  thumbnail_url: string | null;
  track_id: string;
  is_published: boolean;
  order_index: number;
  tracks?: { title: string };
}

interface CourseForm {
  title: string;
  slug: string;
  description: string;
  duration: string;
  thumbnail_url: string;
  track_id: string;
  is_published: boolean;
}

const defaultForm: CourseForm = {
  title: "",
  slug: "",
  description: "",
  duration: "",
  thumbnail_url: "",
  track_id: "",
  is_published: false,
};

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(defaultForm);

  const { data: tracks } = useQuery({
    queryKey: ["admin-tracks-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("id, title")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, tracks:track_id (title)")
        .order("order_index");
      if (error) throw error;
      return data as Course[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CourseForm) => {
      const { error } = await supabase.from("courses").insert({
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        duration: data.duration || null,
        thumbnail_url: data.thumbnail_url || null,
        track_id: data.track_id,
        is_published: data.is_published,
        order_index: (courses?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso criado com sucesso!");
      setDialogOpen(false);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao criar curso: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CourseForm }) => {
      const { error } = await supabase
        .from("courses")
        .update({
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          duration: data.duration || null,
          thumbnail_url: data.thumbnail_url || null,
          track_id: data.track_id,
          is_published: data.is_published,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso atualizado com sucesso!");
      setDialogOpen(false);
      setEditingCourse(null);
      setForm(defaultForm);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar curso: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir curso: " + error.message);
    },
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      duration: course.duration || "",
      thumbnail_url: course.thumbnail_url || "",
      track_id: course.track_id,
      is_published: course.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.track_id) {
      toast.error("Selecione uma trilha");
      return;
    }
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <AppLayout
      title="Cursos"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Cursos" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cursos</h1>
            <p className="text-muted-foreground">Gerencie os cursos</p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingCourse(null);
                setForm(defaultForm);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Novo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "Editar Curso" : "Novo Curso"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="track_id">Trilha</Label>
                  <Select
                    value={form.track_id}
                    onValueChange={(value) =>
                      setForm({ ...form, track_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma trilha" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks?.map((track) => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <Input
                      id="duration"
                      placeholder="Ex: 10h"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
                    <Input
                      id="thumbnail_url"
                      value={form.thumbnail_url}
                      onChange={(e) =>
                        setForm({ ...form, thumbnail_url: e.target.value })
                      }
                    />
                  </div>
                </div>
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
                    {editingCourse ? "Salvar" : "Criar"}
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
        ) : courses && courses.length > 0 ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.tracks?.title}
                    </TableCell>
                    <TableCell>{course.duration || "-"}</TableCell>
                    <TableCell>
                      {course.is_published ? (
                        <Badge className="bg-green-500">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/admin/cursos/${course.id}/modulos`}>
                            <Layers size={14} />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(course)}
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
                              <AlertDialogTitle>Excluir curso?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Todos os módulos
                                e aulas associados também serão excluídos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(course.id)}
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
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum curso</h3>
              <p className="text-muted-foreground mt-2">
                Crie seu primeiro curso para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
