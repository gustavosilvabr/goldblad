import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// # BOTÃO FLUTUANTE DO WHATSAPP - PREMIUM
interface WhatsAppButtonProps {
  whatsapp?: string;
}

export function WhatsAppButton({ whatsapp = "5561992030064" }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* # PULSE RINGS */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.4, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.4, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />

      {/* # BOTÃO PRINCIPAL */}
      <div className="relative w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/40 group-hover:shadow-xl group-hover:shadow-[#25D366]/50 transition-shadow">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </motion.div>
      </div>

      {/* # TOOLTIP */}
      <motion.div
        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-card border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        initial={{ x: 10 }}
        whileHover={{ x: 0 }}
      >
        <p className="text-sm font-medium text-foreground">Fale conosco!</p>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-card border-r border-t border-border rotate-45" />
      </motion.div>
    </motion.a>
  );
}
