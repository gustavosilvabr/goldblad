import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// # SEÇÃO DA GALERIA
interface GalleryItem {
  id: string;
  image_url: string;
  title?: string;
  is_video?: boolean;
}

interface GalleryProps {
  items?: GalleryItem[];
}

const defaultItems: GalleryItem[] = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600", title: "Corte Moderno" },
  { id: "2", image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600", title: "Degradê Perfeito" },
  { id: "3", image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600", title: "Barba Alinhada" },
  { id: "4", image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600", title: "Estilo Clássico" },
  { id: "5", image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600", title: "Ambiente Premium" },
  { id: "6", image_url: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600", title: "Detalhes" },
];

export function Gallery({ items = defaultItems }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <section id="galeria" className="py-20 md:py-32 relative overflow-hidden">
      {/* # BACKGROUND */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(43,74%,49%,0.08)_0%,_transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Galeria
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Nossos Trabalhos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Confira alguns dos nossos melhores cortes e transformações
          </p>
        </div>

        {/* # GRID DE FOTOS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image_url}
                alt={item.title || `Galeria ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* # OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* # TÍTULO */}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm md:text-base">{item.title}</p>
                </div>
              )}

              {/* # BORDA DOURADA NO HOVER */}
              <div className="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* # LIGHTBOX */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          {/* # FECHAR */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {/* # NAVEGAÇÃO */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          {/* # IMAGEM */}
          <img
            src={items[selectedIndex].image_url}
            alt={items[selectedIndex].title || ""}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />

          {/* # TÍTULO */}
          {items[selectedIndex].title && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg font-medium">
              {items[selectedIndex].title}
            </div>
          )}

          {/* # INDICADORES */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? "bg-primary" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
