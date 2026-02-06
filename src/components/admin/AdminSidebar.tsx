import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Scissors, 
  Calendar, 
  UserCheck, 
  Image, 
  Star,
  LogOut,
  Menu,
  X,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// # SIDEBAR DO ADMIN
interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Agendamentos", icon: Calendar },
  { id: "clients", label: "Clientes", icon: UserCheck },
  { id: "financial", label: "Financeiro", icon: DollarSign },
  { id: "barbers", label: "Equipe", icon: Users },
  { id: "services", label: "Serviços", icon: Scissors },
  { id: "gallery", label: "Galeria", icon: Image },
  { id: "reviews", label: "Avaliações", icon: Star },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onToggle 
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <>
      {/* # HEADER FIXO COM BOTÃO MOBILE - Maior para fácil acesso */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 lg:hidden flex items-center justify-between px-4">
        <button
          onClick={onToggle}
          className="p-3 bg-secondary border border-border rounded-xl active:scale-95 transition-transform"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-display text-lg text-gradient-gold uppercase tracking-wider">
            Admin
          </span>
        </div>
        {/* Botão rápido para ver site no mobile */}
        <button
          onClick={() => window.open("/", "_blank")}
          className="p-3 bg-secondary border border-border rounded-xl active:scale-95 transition-transform"
          title="Ver Site"
        >
          <ExternalLink className="h-5 w-5 text-primary" />
        </button>
      </header>

      {/* # OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* # SIDEBAR - Otimizada para mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 sm:w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto`}
      >
        {/* # LOGO */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-display text-lg text-gradient-gold uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        {/* # MENU - Botões maiores para toque mobile */}
        <nav className="p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 sm:py-3 rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* # AÇÕES DO RODAPÉ - Botões maiores para mobile */}
        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-border space-y-2 bg-card">
          {/* # IR PARA O SITE */}
          <Button
            variant="outline"
            className="w-full justify-start py-5 sm:py-4 text-sm"
            onClick={() => {
              window.open("/", "_blank");
            }}
          >
            <ExternalLink className="h-5 w-5 mr-3 flex-shrink-0" />
            Ver Site
          </Button>
          
          {/* # LOGOUT */}
          <Button
            variant="ghost"
            className="w-full justify-start py-5 sm:py-4 text-sm text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
