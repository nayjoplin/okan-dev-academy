import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/trilhas/CourseCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, BookOpen, Award, Users } from "lucide-react";

// Dados mockados para exemplo
const trackData = {
  frontend: {
    title: "Front-end",
    description: "Domine HTML, CSS, JavaScript e React para criar interfaces incríveis e acessíveis.",
    totalHours: "120h",
    courses: [
      {
        id: "html-css",
        title: "HTML & CSS Fundamentals",
        description: "Aprenda as bases da web com HTML semântico e CSS moderno.",
        modulesCount: 8,
        duration: "15h",
        progress: 100,
        isCompleted: true,
      },
      {
        id: "javascript",
        title: "JavaScript do Zero ao Avançado",
        description: "Domine a linguagem mais usada na web, desde variáveis até async/await.",
        modulesCount: 12,
        duration: "25h",
        progress: 65,
      },
      {
        id: "react",
        title: "React: Construindo Interfaces",
        description: "Crie aplicações modernas com React, hooks e gerenciamento de estado.",
        modulesCount: 10,
        duration: "20h",
        progress: 0,
      },
      {
        id: "typescript",
        title: "TypeScript para React",
        description: "Adicione tipagem ao seu código e aumente a qualidade do seu desenvolvimento.",
        modulesCount: 6,
        duration: "12h",
        isLocked: true,
      },
      {
        id: "tailwind",
        title: "Tailwind CSS na Prática",
        description: "Estilize suas aplicações de forma rápida e consistente com Tailwind.",
        modulesCount: 5,
        duration: "10h",
        isLocked: true,
      },
    ],
  },
};

const TrackDetailPage = () => {
  const { trackId } = useParams();
  const track = trackData[trackId as keyof typeof trackData] || trackData.frontend;
  
  const completedCourses = track.courses.filter(c => c.isCompleted).length;
  const totalCourses = track.courses.length;
  const overallProgress = Math.round((completedCourses / totalCourses) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/trilhas">
              <ArrowLeft size={16} />
              Voltar para trilhas
            </Link>
          </Button>

          {/* Track Header */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Trilha <span className="okan-gradient-text">{track.title}</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">{track.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{track.totalHours} de conteúdo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={16} className="text-primary" />
                  <span>{totalCourses} cursos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-primary" />
                  <span>Certificado incluso</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Seu progresso na trilha</span>
                <span className="text-sm text-primary font-semibold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {completedCourses} de {totalCourses} cursos concluídos
              </p>
            </div>
          </div>

          {/* Courses List */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Cursos da trilha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {track.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  trackId={trackId || "frontend"}
                  {...course}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-secondary/10 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Continue sua jornada!</h3>
            <p className="text-muted-foreground mb-4">
              Você está no caminho certo. Continue estudando e desbloqueie novos cursos.
            </p>
            <Button asChild>
              <Link to={`/trilhas/${trackId}/cursos/javascript`}>
                Continuar estudando
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackDetailPage;
