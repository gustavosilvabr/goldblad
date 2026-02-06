import { MapPin, Clock, Phone, Instagram, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// # SEÇÃO DE LOCALIZAÇÃO COM MAPA MELHORADO
interface LocationProps {
  address?: string;
  phone?: string;
  instagram?: string;
  openingHours?: string;
  gpsLat?: number;
  gpsLng?: number;
}

export function Location({
  address = "Localizada na rua de baixo do Goiás Forte",
  phone = "(61) 99203-0064",
  instagram = "@gold_blad_barbearia",
  openingHours = "Seg-Dom: 09h às 20h",
  gpsLat,
  gpsLng,
}: LocationProps) {
  // # URL do mapa usando coordenadas ou endereço
  const hasCoordinates = gpsLat && gpsLng && gpsLat !== 0 && gpsLng !== 0;
  
  const mapEmbedUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${gpsLat},${gpsLng}&zoom=16`
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=16`;

  // # URL para abrir no Google Maps app/web
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${gpsLat},${gpsLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="localizacao" className="py-16 md:py-24 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-card" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Localização
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gradient-gold mb-3">
            Onde Estamos
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {address}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* # INFORMAÇÕES */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-border">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                <p className="text-muted-foreground text-sm">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-border">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Horário</h3>
                <p className="text-muted-foreground text-sm">{openingHours}</p>
                <p className="text-xs text-muted-foreground mt-1">Segunda a Domingo</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-border">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                <a
                  href={`tel:${phone?.replace(/\D/g, "")}`}
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-border">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Instagram className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
                <a
                  href={`https://instagram.com/${instagram?.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  {instagram}
                </a>
              </div>
            </div>

            {/* # BOTÃO DE NAVEGAÇÃO */}
            <Button
              variant="hero"
              className="w-full"
              onClick={() => window.open(mapsUrl, "_blank")}
            >
              <Navigation className="h-5 w-5 mr-2" />
              Abrir no Google Maps
            </Button>
          </div>

          {/* # MAPA COM OVERLAY PREMIUM */}
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 h-[350px] md:h-full min-h-[350px] bg-secondary group shadow-xl shadow-primary/5">
            {/* Mapa */}
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(80%) contrast(1.1) brightness(0.9)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da barbearia"
              className="w-full h-full"
            />
            
            {/* Overlay com gradiente premium */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Label GOLDBLAD */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 border border-primary/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-lg">G</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gradient-gold text-lg">GOLDBLAD</h4>
                    <p className="text-muted-foreground text-xs truncate">Rua de baixo do Goiás Forte</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Borda brilhante no hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-300 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
