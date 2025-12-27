import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, 
  Clock, 
  Trophy, 
  BookOpen,
  ArrowRight,
  Calendar,
  Target,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { user, signOut } = useAuth();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user enrollments count
  const { data: enrollmentsCount } = useQuery({
    queryKey: ["enrollments-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch user certificates count
  const { data: certificatesCount } = useQuery({
    queryKey: ["certificates-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch recent lesson progress
  const { data: recentProgress } = useQuery({
    queryKey: ["recent-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select(`
          *,
          lessons:lesson_id (
            title,
            lesson_type
          )
        `)
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch available tracks
  const { data: tracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("order_index")
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await signOut();
    toast.success("Até logo!");
  };

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Aluna";
  const currentTrack = tracks?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              {profileLoading ? (
                <Skeleton className="h-9 w-48 mb-2" />
              ) : (
                <h1 className="text-3xl font-bold mb-2">
                  Olá, <span className="okan-gradient-text">{firstName}</span>! 👋
                </h1>
              )}
              <p className="text-muted-foreground">
                Continue sua jornada de aprendizado. Você está indo muito bem!
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} />
              Sair
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Progress */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Comece sua jornada</h2>
                    {currentTrack && (
                      <Badge variant="outline" className="border-primary text-primary">
                        {currentTrack.title}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    {currentTrack ? (
                      <>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Trilha recomendada</p>
                          <p className="font-medium">{currentTrack.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{currentTrack.description}</p>
                        </div>

                        <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Pronta para começar?</p>
                            <p className="font-medium">Explore as trilhas disponíveis</p>
                          </div>
                          <Button asChild>
                            <Link to={`/trilhas/${currentTrack.slug}`}>
                              Explorar
                              <ArrowRight size={16} />
                            </Link>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhuma trilha disponível no momento.</p>
                        <Button asChild variant="outline">
                          <Link to="/trilhas">Ver trilhas</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">0h</p>
                    <p className="text-xs text-muted-foreground">Horas estudadas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{enrollmentsCount || 0}</p>
                    <p className="text-xs text-muted-foreground">Cursos inscritos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <GraduationCap size={24} className="text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{certificatesCount || 0}</p>
                    <p className="text-xs text-muted-foreground">Certificados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy size={24} className="text-okan-warm mx-auto mb-2" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Dias seguidos</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Atividade recente</h2>
                  {recentProgress && recentProgress.length > 0 ? (
                    <div className="space-y-3">
                      {recentProgress.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                              {activity.lessons?.lesson_type === "video" && <BookOpen size={14} />}
                              {activity.lessons?.lesson_type === "quiz" && <Target size={14} />}
                              {activity.lessons?.lesson_type === "text" && <BookOpen size={14} />}
                              {activity.lessons?.lesson_type === "practice" && <Calendar size={14} />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{activity.lessons?.title || "Lição"}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {activity.is_completed ? "Concluído" : `${activity.progress_percent}% concluído`}
                              </p>
                            </div>
                          </div>
                          <Badge variant={activity.is_completed ? "default" : "secondary"}>
                            {activity.is_completed ? "✓" : `${activity.progress_percent}%`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Nenhuma atividade recente.</p>
                      <p className="text-sm">Comece a estudar para ver seu progresso aqui!</p>
                    </div>
                  )}
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
                  <h3 className="font-semibold mb-2">Bem-vinda à Okan!</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Sua jornada de aprendizado começa agora. 
                    Explore as trilhas e transforme seu futuro!
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
