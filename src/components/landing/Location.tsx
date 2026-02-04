import { MapPin, Clock, Phone, Instagram } from "lucide-react";

// # SEÇÃO DE LOCALIZAÇÃO
interface LocationProps {
  address?: string;
  phone?: string;
  instagram?: string;
  openingHours?: string;
  gpsLat?: number;
  gpsLng?: number;
}

export function Location({
  address = "Rua das Tesouras, 123 - Brasília, DF",
  phone = "(61) 99203-0064",
  instagram = "@gold_blad_barbearia",
  openingHours = "Seg-Dom: 09h às 20h",
  gpsLat = -15.7942,
  gpsLng = -47.8822,
}: LocationProps) {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.0!2d${gpsLng}!3d${gpsLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzM5LjEiUyA0N8KwNTInNTUuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890`;

  return (
    <section id="localizacao" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-card" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Localização
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Onde Estamos
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* # INFORMAÇÕES */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Horário de Funcionamento</h3>
                <p className="text-muted-foreground">{openingHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                <p className="text-muted-foreground">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {instagram}
                </a>
              </div>
            </div>
          </div>

          {/* # MAPA */}
          <div className="rounded-2xl overflow-hidden border border-border h-[300px] md:h-full min-h-[300px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da barbearia"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
