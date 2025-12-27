import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function MentorCourses() {
  return (
    <AppLayout
      title="Meus Cursos"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Meus Cursos" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os cursos que você leciona
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum curso atribuído
            </h3>
            <p className="text-muted-foreground mt-2">
              Entre em contato com o administrador para ser atribuído a cursos
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
