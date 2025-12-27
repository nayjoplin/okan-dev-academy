import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function MentorAnalytics() {
  return (
    <AppLayout
      title="Analytics"
      breadcrumbs={[
        { label: "Dashboard", href: "/mentor" },
        { label: "Analytics" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Métricas e análises dos seus cursos
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Em breve!</h3>
            <p className="text-muted-foreground mt-2">
              Estamos preparando análises detalhadas para você
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
