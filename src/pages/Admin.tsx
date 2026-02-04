import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminBarbers } from "@/components/admin/AdminBarbers";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminAppointments } from "@/components/admin/AdminAppointments";
import { AdminClients } from "@/components/admin/AdminClients";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { Loader2 } from "lucide-react";

// # PÁGINA DO PAINEL ADMIN
export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      // # Verificar se é admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdminRole = roles?.some(r => r.role === "admin");
      
      if (!hasAdminRole) {
        navigate("/admin/login");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "settings":
        return <AdminSettings />;
      case "barbers":
        return <AdminBarbers />;
      case "services":
        return <AdminServices />;
      case "appointments":
        return <AdminAppointments />;
      case "clients":
        return <AdminClients />;
      case "gallery":
        return <AdminGallery />;
      case "reviews":
        return <AdminReviews />;
      case "financial":
        return <AdminFinancial />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
