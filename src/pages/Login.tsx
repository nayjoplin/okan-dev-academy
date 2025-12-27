import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de autenticação
    console.log({ email, password, name, isLogin });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-xl okan-gradient flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-xl">O</span>
                  </div>
                  <h1 className="text-2xl font-bold">
                    {isLogin ? "Bem-vinda de volta!" : "Crie sua conta"}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {isLogin 
                      ? "Entre para continuar sua jornada de aprendizado" 
                      : "Junte-se a nós e transforme seu futuro"
                    }
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm font-normal">
                          Lembrar de mim
                        </Label>
                      </div>
                      <Link to="/recuperar-senha" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        Concordo com os{" "}
                        <Link to="/termos" className="text-primary hover:underline">
                          Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link to="/privacidade" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
                      </Label>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    {isLogin ? "Entrar" : "Criar conta"}
                    <ArrowRight size={16} />
                  </Button>
                </form>

                {/* Toggle */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary hover:underline font-medium"
                    >
                      {isLogin ? "Cadastre-se" : "Faça login"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
