import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Listens for appointment status changes for the signed-in user
 * and shows a toast when an appointment is approved or declined.
 */
const AppointmentsWatcher = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`appointments-user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          const appt = payload.new as {
            id: string;
            status: string;
            connection_type?: string | null;
            slot_start?: string | null;
          };
          if (!appt) return;
          if (appt.status === 'approved') {
            toast({
              title: 'Appointment approved',
              description: `Your ${appt.connection_type ?? 'session'} on ${appt.slot_start ? new Date(appt.slot_start).toLocaleString() : 'scheduled time'} is confirmed.`,
            });
          } else if (appt.status === 'declined') {
            toast({
              title: 'Appointment declined',
              description: 'Please pick another time or doctor.',
              variant: 'destructive' as any,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return null;
};

export default AppointmentsWatcher;


