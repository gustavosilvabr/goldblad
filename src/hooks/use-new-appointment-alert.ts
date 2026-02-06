import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// # HOOK PARA ALERTAR SOBRE NOVOS AGENDAMENTOS
export function useNewAppointmentAlert() {
  const [hasNewAppointment, setHasNewAppointment] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSeenIdRef = useRef<string | null>(null);

  // # LIMPAR ALERTA
  const clearAlert = useCallback(() => {
    setHasNewAppointment(false);
    setNewAppointmentData(null);
  }, []);

  // # TOCAR SOM DE NOTIFICAÇÃO (usando Web Audio API para compatibilidade)
  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio notification not supported");
    }
  }, []);

  // # SOLICITAR PERMISSÃO PARA NOTIFICAÇÃO DO NAVEGADOR
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  // # ENVIAR NOTIFICAÇÃO DO NAVEGADOR (FUNCIONA NO CELULAR)
  const sendBrowserNotification = useCallback((clientName: string, time: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Novo Agendamento! 📅", {
        body: `${clientName} agendou para ${time}`,
        icon: "/favicon.ico",
        tag: "new-appointment",
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Fechar após 10 segundos
      setTimeout(() => notification.close(), 10000);
    }
  }, []);

  useEffect(() => {
    // Pedir permissão de notificação ao montar
    requestNotificationPermission();

    // # SUBSCRIÇÃO REALTIME PARA NOVOS AGENDAMENTOS
    const channel = supabase
      .channel("new-appointments-alert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload) => {
          const newAppointment = payload.new;
          
          // Evitar duplicatas
          if (lastSeenIdRef.current === newAppointment.id) return;
          lastSeenIdRef.current = newAppointment.id;

          setHasNewAppointment(true);
          setNewAppointmentData(newAppointment);
          
          // Tocar som
          playNotificationSound();
          
          // Enviar notificação do navegador (funciona no celular)
          sendBrowserNotification(
            newAppointment.client_name,
            newAppointment.appointment_time?.slice(0, 5) || ""
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playNotificationSound, requestNotificationPermission, sendBrowserNotification]);

  return {
    hasNewAppointment,
    newAppointmentData,
    clearAlert,
  };
}
