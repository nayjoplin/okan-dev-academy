import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Target, Users, Award, BookOpen } from "lucide-react";

const SobrePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre o <span className="okan-gradient-text">Okan</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Uma plataforma educacional de cursos em tecnologia, concebida para funcionar com foco explícito em aprendizado real, permanência e impacto social mensurável.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground mb-6">
                  O Okan | dev studies atende prioritariamente pessoas negras, especialmente mulheres, oriundas de comunidades, periferias e contextos de vulnerabilidade social.
                </p>
                <p className="text-muted-foreground">
                  Toda a arquitetura do produto, decisões pedagógicas e técnicas existem para garantir que o curso seja o produto central e que o aprendizado aconteça de forma estruturada e sustentável.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center">
                <Heart size={120} className="text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Target size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Aprendizado Real</h3>
                  <p className="text-sm text-muted-foreground">
                    Não há avanço sem consolidação. Priorizamos o entendimento profundo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
                    <Users size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Inclusão</h3>
                  <p className="text-sm text-muted-foreground">
                    Focamos em pessoas negras e mulheres, quebrando barreiras estruturais.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-okan-warm/10 text-okan-warm flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Estrutura</h3>
                  <p className="text-sm text-muted-foreground">
                    Metodologia clara e previsível que reduz ansiedade e aumenta resultados.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-okan-success/10 text-okan-success flex items-center justify-center mx-auto mb-4">
                    <Award size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Impacto</h3>
                  <p className="text-sm text-muted-foreground">
                    Transformação social mensurável através de dados e acompanhamento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 okan-gradient">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Faça parte dessa transformação
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Inscreva-se no programa e comece sua jornada de aprendizado hoje mesmo.
            </p>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/inscricao">
                Inscreva-se agora
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobrePage;
