import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface AdminPlaceholderProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function AdminPlaceholder({ title, description, breadcrumbs }: AdminPlaceholderProps) {
  return (
    <AppLayout title={title} breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <Construction className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Em construção</h3>
            <p className="text-muted-foreground mt-2">Esta funcionalidade será implementada em breve</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
