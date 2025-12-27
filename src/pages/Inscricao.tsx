import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Clock, Award, Users } from "lucide-react";

const InscricaoPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    track: "",
    experience: "",
    motivation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Enviar inscrição
      console.log("Inscrição enviada:", formData);
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {step < 3 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Info Section */}
              <div className="lg:sticky lg:top-24">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Inscreva-se no <span className="okan-gradient-text">Okan</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  Dê o primeiro passo para transformar seu futuro. O processo seletivo começa com um desafio de 48 horas.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Desafio de 48 horas</h3>
                      <p className="text-sm text-muted-foreground">
                        Participe de uma experiência formativa introdutória com atividades práticas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Certificado de participação</h3>
                      <p className="text-sm text-muted-foreground">
                        Todas as participantes recebem certificado, independente do resultado.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">3 meses de formação</h3>
                      <p className="text-sm text-muted-foreground">
                        Alunas aprovadas têm acesso ao programa completo de formação.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {step > 1 ? <CheckCircle2 size={16} /> : "1"}
                  </div>
                  <div className={`flex-1 h-1 rounded ${step > 1 ? "bg-primary" : "bg-muted"}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {step > 2 ? <CheckCircle2 size={16} /> : "2"}
                  </div>
                </div>
              </div>

              {/* Form */}
              <Card className="border-2">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Dados pessoais</h2>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo *</Label>
                          <Input
                            id="name"
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">WhatsApp *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          Continuar
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Sobre você</h2>
                        
                        <div className="space-y-2">
                          <Label htmlFor="track">Qual trilha você quer seguir? *</Label>
                          <Select
                            value={formData.track}
                            onValueChange={(value) => setFormData({ ...formData, track: value })}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma trilha" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="frontend">Front-end</SelectItem>
                              <SelectItem value="backend">Back-end</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                              <SelectItem value="dados">Dados</SelectItem>
                              <SelectItem value="ux-design">UX & Design</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Qual sua experiência com tecnologia? *</Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => setFormData({ ...formData, experience: value })}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma experiência</SelectItem>
                              <SelectItem value="beginner">Já estudei um pouco por conta própria</SelectItem>
                              <SelectItem value="intermediate">Fiz alguns cursos online</SelectItem>
                              <SelectItem value="advanced">Tenho experiência prática</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" required />
                          <Label htmlFor="terms" className="text-sm font-normal">
                            Declaro que li e concordo com os{" "}
                            <Link to="/termos" className="text-primary hover:underline">
                              Termos de Uso
                            </Link>{" "}
                            e{" "}
                            <Link to="/privacidade" className="text-primary hover:underline">
                              Política de Privacidade
                            </Link>
                          </Label>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setStep(1)}
                            className="flex-1"
                          >
                            Voltar
                          </Button>
                          <Button type="submit" className="flex-1" size="lg">
                            Enviar inscrição
                            <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Success State */
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="w-20 h-20 rounded-full bg-okan-success/10 text-okan-success flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-bold mb-4">Inscrição enviada!</h1>
              <p className="text-muted-foreground mb-8">
                Recebemos sua inscrição com sucesso. Em breve você receberá um e-mail com as instruções para participar do desafio de 48 horas.
              </p>
              <Button asChild>
                <Link to="/">
                  Voltar ao início
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InscricaoPage;
