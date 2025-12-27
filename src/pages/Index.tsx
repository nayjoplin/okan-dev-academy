import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Users, Target, Award, Code, Database, Smartphone, BarChart3, Palette } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackCard from "@/components/trilhas/TrackCard";
import StatsCard from "@/components/ui/stats-card";
import heroBanner from "@/assets/hero-banner.jpg";

const tracks = [
  {
    id: "frontend",
    title: "Front-end",
    description: "Domine HTML, CSS, JavaScript e React para criar interfaces incríveis e acessíveis.",
    icon: <Code size={28} />,
    coursesCount: 8,
    duration: "3 meses",
    studentsCount: 450,
    color: "coral" as const,
  },
  {
    id: "backend",
    title: "Back-end",
    description: "Aprenda Node.js, APIs REST, bancos de dados e arquitetura de sistemas.",
    icon: <Database size={28} />,
    coursesCount: 7,
    duration: "3 meses",
    studentsCount: 320,
    color: "purple" as const,
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Desenvolva aplicativos para Android e iOS com React Native e Flutter.",
    icon: <Smartphone size={28} />,
    coursesCount: 6,
    duration: "3 meses",
    studentsCount: 180,
    color: "warm" as const,
  },
  {
    id: "dados",
    title: "Dados",
    description: "Análise de dados, Python, SQL e visualização para tomada de decisões.",
    icon: <BarChart3 size={28} />,
    coursesCount: 6,
    duration: "3 meses",
    studentsCount: 210,
    color: "coral" as const,
  },
  {
    id: "ux-design",
    title: "UX & Design",
    description: "Design de interfaces, pesquisa com usuários e prototipagem com Figma.",
    icon: <Palette size={28} />,
    coursesCount: 5,
    duration: "2 meses",
    studentsCount: 290,
    color: "purple" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Award size={16} />
              Programa de formação em tecnologia
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Transforme seu futuro com{" "}
              <span className="text-primary">tecnologia</span>
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              O Okan | dev studies é uma plataforma educacional focada em construir caminhos reais de aprendizado e transformação social para pessoas negras.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/inscricao">
                  Comece sua jornada
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/trilhas">
                  Explorar trilhas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              value="1.400+"
              label="Alunas formadas"
              icon={<GraduationCap size={24} />}
            />
            <StatsCard
              value="5"
              label="Trilhas de formação"
              icon={<Target size={24} />}
            />
            <StatsCard
              value="32"
              label="Cursos disponíveis"
              icon={<Code size={24} />}
            />
            <StatsCard
              value="89%"
              label="Taxa de conclusão"
              icon={<Users size={24} />}
            />
          </div>
        </div>
      </section>

      {/* Trilhas Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trilhas de <span className="okan-gradient-text">Formação</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Cada trilha representa uma formação completa, organizada em níveis de Fundamentos, Prática e Consolidação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackCard key={track.id} {...track} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/trilhas">
                Ver todas as trilhas
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Metodologia Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossa <span className="okan-gradient-text">metodologia</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                A metodologia do Okan prioriza aprendizado real. Não há avanço sem consolidação. O erro é tratado como parte do processo e não como falha.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Conteúdo estruturado</h3>
                    <p className="text-muted-foreground text-sm">
                      Cada módulo segue o padrão: conteúdo teórico, prática guiada e prova de consolidação.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Progressão linear</h3>
                    <p className="text-muted-foreground text-sm">
                      Avance de forma estruturada, garantindo que cada conceito seja consolidado antes do próximo.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Certificação reconhecida</h3>
                    <p className="text-muted-foreground text-sm">
                      Ao concluir cada trilha, você recebe um certificado que comprova sua formação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12">
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10" />
                    <div>
                      <p className="font-semibold">Maria Silva</p>
                      <p className="text-sm text-muted-foreground">Desenvolvedora Front-end</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "O Okan mudou minha vida. A metodologia estruturada me deu confiança para aprender no meu ritmo e hoje trabalho como desenvolvedora em uma grande empresa."
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 okan-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronta para começar sua jornada?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Inscreva-se agora e participe do nosso desafio de seleção de 48 horas. É sua chance de dar o primeiro passo rumo à transformação.
          </p>
          <Button variant="hero-outline" size="xl" asChild>
            <Link to="/inscricao">
              Inscreva-se gratuitamente
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
