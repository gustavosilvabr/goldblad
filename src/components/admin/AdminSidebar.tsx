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
      {/* # HEADER FIXO COM BOTÃO MOBILE */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 lg:hidden flex items-center px-4">
        <button
          onClick={onToggle}
          className="p-2 bg-secondary border border-border rounded-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2 ml-4">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-display text-lg text-gradient-gold uppercase tracking-wider">
            Admin
          </span>
        </div>
      </header>

      {/* # OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* # SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
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

        {/* # MENU */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* # AÇÕES DO RODAPÉ */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          {/* # IR PARA O SITE */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/")}
          >
            <Scissors className="h-5 w-5 mr-3" />
            Ver Site
          </Button>
          
          {/* # LOGOUT */}
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
