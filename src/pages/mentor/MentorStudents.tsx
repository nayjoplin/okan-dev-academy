import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function MentorStudents() {
  return (
    <AppLayout
      title="Meus Alunos"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Meus Alunos" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o progresso das suas alunas
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma aluna ainda</h3>
            <p className="text-muted-foreground mt-2">
              Quando alunas se inscreverem nos seus cursos, aparecerão aqui
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
