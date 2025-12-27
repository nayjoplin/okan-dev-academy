import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MentorDiscussions() {
  return (
    <AppLayout
      title="Discussões"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Discussões" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Discussões</h1>
          <p className="text-muted-foreground mt-1">
            Responda dúvidas e interaja com suas alunas
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma discussão</h3>
            <p className="text-muted-foreground mt-2">
              As discussões dos seus cursos aparecerão aqui
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
