import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, Loader2, Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// # PÁGINA DE LOGIN ADMIN
export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // # Verificar se é admin
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (roles?.some(r => r.role === "admin")) {
          navigate("/admin");
          return;
        }
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        // # Verificar se é admin
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        if (!roles?.some(r => r.role === "admin")) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão de administrador.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso.",
        });
        navigate("/admin");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* # EFEITOS DE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(43,74%,49%,0.15)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* # LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-gold mb-4">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">
            Área Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        {/* # FORMULÁRIO */}
        <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-elevated space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@goldblade.com"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <LogIn className="h-5 w-5 mr-2" />
            )}
            Entrar
          </Button>
        </form>

        {/* # VOLTAR AO SITE */}
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => navigate("/")}
        >
          <Scissors className="h-4 w-4 mr-2" />
          Voltar ao Site
        </Button>

        {/* # NOTA */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Primeiro acesso? Entre em contato com o suporte para criar sua conta de administrador.
        </p>
      </div>
    </div>
  );
}
