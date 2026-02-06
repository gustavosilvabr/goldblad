import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// # SEÇÃO DA GALERIA OTIMIZADA - Animações reduzidas para mobile
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
      {/* # BACKGROUND ESTÁTICO */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(43,74%,49%,0.1)_0%,_transparent_50%)]" />

      {/* # DECORAÇÃO ESTÁTICA */}
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border border-primary/10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* # TÍTULO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            Galeria
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-gold mb-4">
            Nossos Trabalhos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Confira alguns dos nossos melhores cortes e transformações
          </p>
        </motion.div>

        {/* # GRID DE FOTOS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image_url}
                alt={item.title || `Galeria ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* # OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* # ÍCONE DE VÍDEO */}
              {item.is_video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-gold">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}
              
              {/* # TÍTULO */}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm md:text-base">{item.title}</p>
                </div>
              )}

              {/* # BORDA DOURADA */}
              <div className="absolute inset-0 border-2 border-primary rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* # LIGHTBOX */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* # FECHAR */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all z-20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* # NAVEGAÇÃO */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all z-20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all z-20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* # IMAGEM */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={items[selectedIndex].image_url}
              alt={items[selectedIndex].title || ""}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* # TÍTULO */}
            {items[selectedIndex].title && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-lg font-medium bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm">
                {items[selectedIndex].title}
              </div>
            )}

            {/* # INDICADORES */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
