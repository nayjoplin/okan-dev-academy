import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackCard from "@/components/trilhas/TrackCard";
import { Code, Database, Smartphone, BarChart3, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ReactNode> = {
  code: <Code size={28} />,
  database: <Database size={28} />,
  smartphone: <Smartphone size={28} />,
  chart: <BarChart3 size={28} />,
  palette: <Palette size={28} />,
};

interface Track {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  duration: string | null;
  color: string;
  icon: string | null;
}

const TrilhasPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("order_index");

      if (error) {
        console.error("Error fetching tracks:", error);
      } else {
        setTracks(data || []);
      }
      setLoading(false);
    };

    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Trilhas de <span className="okan-gradient-text">Formação</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Escolha sua trilha e comece sua jornada de aprendizado. Cada trilha foi cuidadosamente estruturada para garantir sua evolução.
            </p>
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))
            ) : (
              tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.slug}
                  title={track.title}
                  description={track.description || ""}
                  icon={iconMap[track.icon || "code"] || <Code size={28} />}
                  coursesCount={0}
                  duration={track.duration || ""}
                  studentsCount={0}
                  color={track.color as "coral" | "purple" | "warm"}
                />
              ))
            )}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-muted/50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Como funcionam as trilhas?</h2>
              <p className="text-muted-foreground mb-6">
                Cada trilha é organizada em três níveis: Fundamentos, Prática/Mercado e Consolidação/Qualidade. 
                Você avança de forma estruturada, garantindo que cada conceito seja dominado antes de passar para o próximo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4 border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-1">Fundamentos</h3>
                  <p className="text-sm text-muted-foreground">Base sólida para começar</p>
                </div>
                <div className="bg-card rounded-xl p-4 border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-1">Prática</h3>
                  <p className="text-sm text-muted-foreground">Projetos reais do mercado</p>
                </div>
                <div className="bg-card rounded-xl p-4 border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-1">Consolidação</h3>
                  <p className="text-sm text-muted-foreground">Qualidade e excelência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrilhasPage;
