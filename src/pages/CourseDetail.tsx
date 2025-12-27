import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Circle, 
  Lock,
  FileText,
  Code,
  ClipboardCheck,
  Clock
} from "lucide-react";

// Dados mockados
const courseData = {
  id: "javascript",
  title: "JavaScript do Zero ao Avançado",
  description: "Domine a linguagem mais usada na web, desde variáveis até async/await.",
  progress: 65,
  modules: [
    {
      id: "intro",
      title: "Introdução ao JavaScript",
      status: "completed",
      lessons: [
        { id: "1", title: "O que é JavaScript?", type: "video", duration: "10min", completed: true },
        { id: "2", title: "Configurando o ambiente", type: "video", duration: "15min", completed: true },
        { id: "3", title: "Seu primeiro código", type: "practice", duration: "20min", completed: true },
        { id: "4", title: "Prova de consolidação", type: "quiz", duration: "10min", completed: true },
      ],
    },
    {
      id: "variaveis",
      title: "Variáveis e Tipos de Dados",
      status: "completed",
      lessons: [
        { id: "5", title: "let, const e var", type: "video", duration: "12min", completed: true },
        { id: "6", title: "Tipos primitivos", type: "video", duration: "18min", completed: true },
        { id: "7", title: "Exercícios práticos", type: "practice", duration: "25min", completed: true },
        { id: "8", title: "Prova de consolidação", type: "quiz", duration: "10min", completed: true },
      ],
    },
    {
      id: "funcoes",
      title: "Funções e Escopo",
      status: "in-progress",
      lessons: [
        { id: "9", title: "Declarando funções", type: "video", duration: "15min", completed: true },
        { id: "10", title: "Arrow functions", type: "video", duration: "12min", completed: true },
        { id: "11", title: "Escopo e closure", type: "video", duration: "20min", completed: false },
        { id: "12", title: "Projeto prático", type: "practice", duration: "30min", completed: false },
        { id: "13", title: "Prova de consolidação", type: "quiz", duration: "10min", completed: false },
      ],
    },
    {
      id: "arrays",
      title: "Arrays e Objetos",
      status: "locked",
      lessons: [
        { id: "14", title: "Trabalhando com Arrays", type: "video", duration: "18min", completed: false },
        { id: "15", title: "Métodos de Array", type: "video", duration: "22min", completed: false },
        { id: "16", title: "Objetos em JavaScript", type: "video", duration: "15min", completed: false },
        { id: "17", title: "Projeto prático", type: "practice", duration: "30min", completed: false },
        { id: "18", title: "Prova de consolidação", type: "quiz", duration: "10min", completed: false },
      ],
    },
  ],
};

const lessonTypeIcons = {
  video: <Play size={14} />,
  practice: <Code size={14} />,
  quiz: <ClipboardCheck size={14} />,
  reading: <FileText size={14} />,
};

const lessonTypeLabels = {
  video: "Vídeo",
  practice: "Prática",
  quiz: "Prova",
  reading: "Leitura",
};

const CourseDetailPage = () => {
  const { trackId, courseId } = useParams();
  const course = courseData;
  
  // Encontrar a próxima lição não completada
  const currentModule = course.modules.find(m => m.status === "in-progress");
  const currentLesson = currentModule?.lessons.find(l => !l.completed);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to={`/trilhas/${trackId}`}>
              <ArrowLeft size={16} />
              Voltar para trilha
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-8">
                <Badge variant="outline" className="mb-4">
                  Em andamento
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              {/* Progress */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Seu progresso</span>
                    <span className="text-primary font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3 mb-4" />
                  
                  {currentLesson && (
                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Próxima lição</p>
                        <p className="font-medium">{currentLesson.title}</p>
                      </div>
                      <Button asChild>
                        <Link to={`/trilhas/${trackId}/cursos/${courseId}/aula/${currentLesson.id}`}>
                          Continuar
                          <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modules */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Módulos do curso</h2>
                
                {course.modules.map((module, moduleIndex) => (
                  <Card 
                    key={module.id} 
                    className={`${module.status === "locked" ? "opacity-60" : ""}`}
                  >
                    <CardContent className="p-0">
                      {/* Module Header */}
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            module.status === "completed" 
                              ? "bg-okan-success text-primary-foreground" 
                              : module.status === "in-progress"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {module.status === "completed" ? (
                              <CheckCircle2 size={16} />
                            ) : module.status === "locked" ? (
                              <Lock size={14} />
                            ) : (
                              <span className="text-sm font-bold">{moduleIndex + 1}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} lições
                            </p>
                          </div>
                        </div>
                        
                        {module.status === "completed" && (
                          <Badge className="bg-okan-success text-primary-foreground">Concluído</Badge>
                        )}
                        {module.status === "in-progress" && (
                          <Badge variant="outline" className="border-primary text-primary">Em andamento</Badge>
                        )}
                      </div>

                      {/* Lessons List */}
                      {module.status !== "locked" && (
                        <div className="divide-y divide-border">
                          {module.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              to={lesson.completed || module.status !== "locked" 
                                ? `/trilhas/${trackId}/cursos/${courseId}/aula/${lesson.id}`
                                : "#"
                              }
                              className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                                !lesson.completed && module.status === "locked" ? "pointer-events-none" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle2 size={18} className="text-okan-success" />
                                ) : (
                                  <Circle size={18} className="text-muted-foreground" />
                                )}
                                <div>
                                  <p className={`font-medium ${lesson.completed ? "text-muted-foreground" : ""}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      {lessonTypeIcons[lesson.type as keyof typeof lessonTypeIcons]}
                                      {lessonTypeLabels[lesson.type as keyof typeof lessonTypeLabels]}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {lesson.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {!lesson.completed && module.status === "in-progress" && (
                                <Button size="sm" variant="ghost">
                                  <Play size={14} />
                                </Button>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informações do curso</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Módulos</span>
                        <span className="font-medium">{course.modules.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lições</span>
                        <span className="font-medium">
                          {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duração total</span>
                        <span className="font-medium">25h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certificado</span>
                        <span className="font-medium text-primary">Incluso</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="okan-gradient text-primary-foreground">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
                    <p className="text-sm text-primary-foreground/80 mb-4">
                      Nossa comunidade está pronta para te apoiar em sua jornada.
                    </p>
                    <Button variant="hero-outline" size="sm" className="w-full">
                      Acessar comunidade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
