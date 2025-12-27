import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackCard from "@/components/trilhas/TrackCard";
import { Code, Database, Smartphone, BarChart3, Palette } from "lucide-react";

const tracks = [
  {
    id: "frontend",
    title: "Front-end",
    description: "Domine HTML, CSS, JavaScript e React para criar interfaces incríveis e acessíveis. Aprenda as melhores práticas de desenvolvimento web moderno.",
    icon: <Code size={28} />,
    coursesCount: 8,
    duration: "3 meses",
    studentsCount: 450,
    color: "coral" as const,
  },
  {
    id: "backend",
    title: "Back-end",
    description: "Aprenda Node.js, APIs REST, bancos de dados e arquitetura de sistemas. Construa aplicações robustas e escaláveis.",
    icon: <Database size={28} />,
    coursesCount: 7,
    duration: "3 meses",
    studentsCount: 320,
    color: "purple" as const,
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Desenvolva aplicativos para Android e iOS com React Native e Flutter. Crie experiências mobile incríveis.",
    icon: <Smartphone size={28} />,
    coursesCount: 6,
    duration: "3 meses",
    studentsCount: 180,
    color: "warm" as const,
  },
  {
    id: "dados",
    title: "Dados",
    description: "Análise de dados, Python, SQL e visualização para tomada de decisões. Transforme dados em insights valiosos.",
    icon: <BarChart3 size={28} />,
    coursesCount: 6,
    duration: "3 meses",
    studentsCount: 210,
    color: "coral" as const,
  },
  {
    id: "ux-design",
    title: "UX & Design",
    description: "Design de interfaces, pesquisa com usuários e prototipagem com Figma. Crie produtos centrados no usuário.",
    icon: <Palette size={28} />,
    coursesCount: 5,
    duration: "2 meses",
    studentsCount: 290,
    color: "purple" as const,
  },
];

const TrilhasPage = () => {
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
            {tracks.map((track) => (
              <TrackCard key={track.id} {...track} />
            ))}
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
