import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function StudentCertificates() {
  const { user } = useAuth();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          courses:course_id (
            title
          ),
          tracks:track_id (
            title
          )
        `)
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <AppLayout
      title="Certificados"
      breadcrumbs={[
        { label: "Início", href: "/app" },
        { label: "Certificados" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Certificados</h1>
          <p className="text-muted-foreground mt-1">
            Seus certificados de conclusão
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-5 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert: any) => (
              <Card key={cert.id} className="overflow-hidden">
                <div className="h-32 okan-gradient flex items-center justify-center">
                  <Award className="h-16 w-16 text-primary-foreground" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    {cert.courses?.title || cert.tracks?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(cert.issued_at), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Nº {cert.certificate_number}
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Award className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum certificado ainda
              </h3>
              <p className="text-muted-foreground mt-2">
                Complete cursos para receber seus certificados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
