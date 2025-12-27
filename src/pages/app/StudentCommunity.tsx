import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

export default function StudentCommunity() {
  return (
    <AppLayout
      title="Comunidade"
      breadcrumbs={[
        { label: "Início", href: "/app" },
        { label: "Comunidade" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Comunidade</h1>
          <p className="text-muted-foreground mt-1">
            Conecte-se com outras alunas
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Em breve!</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Estamos preparando um espaço incrível para você se conectar com
              outras alunas, trocar experiências e crescer juntas.
            </p>
            <Button className="mt-6" disabled>
              <MessageSquare className="h-4 w-4 mr-2" />
              Acessar comunidade
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
