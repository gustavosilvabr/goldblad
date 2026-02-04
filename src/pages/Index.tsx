import { useEffect, useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Team } from "@/components/landing/Team";
import { Gallery } from "@/components/landing/Gallery";
import { Subscriptions } from "@/components/landing/Subscriptions";
import { Reviews } from "@/components/landing/Reviews";
import { BookingForm } from "@/components/landing/BookingForm";
import { Location } from "@/components/landing/Location";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

// # PÁGINA PRINCIPAL DA BARBEARIA
const Index = () => {
  const [settings, setSettings] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // # Buscar configurações
        const { data: settingsData } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        // # Buscar barbeiros ativos
        const { data: barbersData } = await supabase
          .from("barbers")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        // # Buscar serviços ativos
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        // # Buscar galeria ativa
        const { data: galleryData } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        // # Buscar avaliações visíveis
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*")
          .eq("is_visible", true)
          .order("created_at", { ascending: false });

        if (settingsData) setSettings(settingsData);
        if (barbersData) setBarbers(barbersData);
        if (servicesData) setServices(servicesData);
        if (galleryData) setGallery(galleryData);
        if (reviewsData) setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // # USAR DADOS DO BANCO OU DEFAULTS
  const whatsapp = settings?.whatsapp || "5561992030064";
  const businessName = settings?.business_name || "Gold Blade";

  return (
    <div className="min-h-screen bg-background">
      <Header 
        businessName={businessName}
        logoUrl={settings?.logo_url}
        whatsapp={whatsapp}
        logoSize={settings?.logo_size || "medium"}
        logoSizeCustom={settings?.logo_size_custom}
      />
      
      <main>
        <Hero 
          businessName={businessName}
          tagline="Estilo e precisão em cada corte"
        />
        
        <Services services={services.length > 0 ? services : undefined} />
        
        <Team barbers={barbers.length > 0 ? barbers : undefined} />
        
        <Gallery items={gallery.length > 0 ? gallery.map(g => ({
          id: g.id,
          image_url: g.image_url,
          title: g.title,
          is_video: g.is_video
        })) : undefined} />

        <Subscriptions whatsapp={whatsapp} />
        
        <Reviews reviews={reviews.length > 0 ? reviews : undefined} />
        
        <BookingForm 
          barbers={barbers.length > 0 ? barbers : undefined}
          services={services.filter(s => !s.is_additional).length > 0 ? services : undefined}
          whatsapp={whatsapp}
          openingHour={settings?.opening_hour || "09:00"}
          closingHour={settings?.closing_hour || "20:00"}
        />
        
        <Location 
          address={settings?.address}
          phone={settings?.phone}
          instagram={settings?.instagram}
          openingHours={`${settings?.opening_hour || "09:00"} às ${settings?.closing_hour || "20:00"}`}
          gpsLat={settings?.gps_lat}
          gpsLng={settings?.gps_lng}
        />
      </main>

      <Footer 
        businessName={businessName}
        phone={settings?.phone}
        email={settings?.email}
        instagram={settings?.instagram}
        address={settings?.address}
      />

      <WhatsAppButton whatsapp={whatsapp} />
    </div>
  );
};

export default Index;
