import { MessageCircle } from "lucide-react";

// # BOTÃO FLUTUANTE DO WHATSAPP
interface WhatsAppButtonProps {
  whatsapp?: string;
}

export function WhatsAppButton({ whatsapp = "5561992030064" }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse-gold"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-white" />
    </a>
  );
}
