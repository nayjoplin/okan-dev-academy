import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Clock, 
  Trophy, 
  BookOpen,
  ArrowRight,
  Calendar,
  Target
} from "lucide-react";

// Dados mockados da área da aluna
const studentData = {
  name: "Maria",
  currentTrack: {
    id: "frontend",
    title: "Front-end",
    progress: 42,
    currentCourse: "JavaScript do Zero ao Avançado",
    nextLesson: "Escopo e closure",
  },
  stats: {
    hoursStudied: 48,
    coursesCompleted: 2,
    certificatesEarned: 1,
    streak: 7,
  },
  recentActivity: [
    { id: "1", title: "Arrow functions", type: "lesson", date: "Hoje" },
    { id: "2", title: "Prova de consolidação - Variáveis", type: "quiz", date: "Ontem" },
    { id: "3", title: "Exercícios práticos", type: "practice", date: "2 dias atrás" },
  ],
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Olá, <span className="okan-gradient-text">{studentData.name}</span>! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue sua jornada de aprendizado. Você está indo muito bem!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Progress */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Trilha atual</h2>
                    <Badge variant="outline" className="border-primary text-primary">
                      {studentData.currentTrack.title}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progresso geral</span>
                        <span className="text-sm font-semibold text-primary">
                          {studentData.currentTrack.progress}%
                        </span>
                      </div>
                      <Progress value={studentData.currentTrack.progress} className="h-3" />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Curso atual</p>
                      <p className="font-medium">{studentData.currentTrack.currentCourse}</p>
                    </div>

                    <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Próxima lição</p>
                        <p className="font-medium">{studentData.currentTrack.nextLesson}</p>
                      </div>
                      <Button asChild>
                        <Link to="/trilhas/frontend/cursos/javascript">
                          Continuar
                          <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{studentData.stats.hoursStudied}h</p>
                    <p className="text-xs text-muted-foreground">Horas estudadas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{studentData.stats.coursesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Cursos concluídos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <GraduationCap size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{studentData.stats.certificatesEarned}</p>
                    <p className="text-xs text-muted-foreground">Certificados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy size={24} className="text-okan-warm mx-auto mb-2" />
                    <p className="text-2xl font-bold">{studentData.stats.streak}</p>
                    <p className="text-xs text-muted-foreground">Dias seguidos</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Atividade recente</h2>
                  <div className="space-y-3">
                    {studentData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            {activity.type === "lesson" && <BookOpen size={14} />}
                            {activity.type === "quiz" && <Target size={14} />}
                            {activity.type === "practice" && <Calendar size={14} />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{activity.type}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Ações rápidas</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/trilhas">
                        <BookOpen size={16} />
                        Ver todas as trilhas
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/certificados">
                        <GraduationCap size={16} />
                        Meus certificados
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/perfil">
                        <Target size={16} />
                        Editar perfil
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card className="okan-gradient text-primary-foreground">
                <CardContent className="p-6">
                  <Trophy size={32} className="mb-4" />
                  <h3 className="font-semibold mb-2">Continue assim!</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Você está estudando há {studentData.stats.streak} dias seguidos. 
                    Mantenha o ritmo e alcance seus objetivos!
                  </p>
                </CardContent>
              </Card>

              {/* Community */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Comunidade Okan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conecte-se com outras alunas, tire dúvidas e compartilhe conquistas.
                  </p>
                  <Button variant="secondary" className="w-full">
                    Acessar comunidade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
