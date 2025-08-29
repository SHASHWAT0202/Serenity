import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Appointment = {
  id: string;
  user_id: string;
  doctor_id: string;
  connection_type: string | null;
  slot_start: string | null;
  status: "pending" | "approved" | "declined" | "cancelled" | string;
  created_at: string;
};

type DoctorLite = {
  id: string;
  name: string;
  specialty: string | null;
  image_url: string | null;
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [doctorMap, setDoctorMap] = useState<Record<string, DoctorLite>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select("id, user_id, doctor_id, connection_type, slot_start, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Failed to load appointments", description: error.message, variant: "destructive" as any });
        setLoading(false);
        return;
      }
      const appts = (data as Appointment[]) ?? [];
      setAppointments(appts);
      // Fetch doctors for display names/images
      const ids = Array.from(new Set(appts.map(a => a.doctor_id))).filter(Boolean);
      if (ids.length) {
        const { data: docs } = await supabase
          .from("doctors")
          .select("id, name, specialty, image_url")
          .in("id", ids);
        const map: Record<string, DoctorLite> = {};
        (docs as DoctorLite[] || []).forEach(d => { map[d.id] = d; });
        setDoctorMap(map);
      } else {
        setDoctorMap({});
      }
      setLoading(false);
    };
    load();
  }, [user, toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter(a => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      const d = doctorMap[a.doctor_id];
      const hay = [
        a.connection_type || "",
        a.status,
        d?.name || "",
        d?.specialty || "",
        new Date(a.slot_start || a.created_at).toLocaleString(),
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [appointments, statusFilter, query, doctorMap]);

  if (!user) return <div className="p-6">Please sign in</div>;

  return (
    <section className="min-h-screen p-4 pt-24">
      <div className="container mx-auto max-w-5xl">
        <div className="therapeutic-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">My Appointments</h1>
              <p className="text-sm text-muted-foreground">View your session requests and their current status</p>
            </div>
            <div className="flex items-center gap-3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search (doctor, status, type)" className="w-56" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!loading && filtered.map((a) => {
            const d = doctorMap[a.doctor_id];
            return (
              <div key={a.id} className="therapeutic-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={d?.image_url || 'https://placehold.co/48'} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-medium">{d?.name || a.doctor_id}</div>
                    <div className="text-xs text-muted-foreground">{d?.specialty || 'Doctor'}</div>
                  </div>
                </div>
                <div className="hidden md:block text-sm text-muted-foreground">
                  {new Date(a.slot_start || a.created_at).toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded-full border">
                    {a.connection_type || 'session'}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.status === 'approved' ? 'bg-green-100 text-green-700' :
                    a.status === 'declined' ? 'bg-red-100 text-red-700' :
                    a.status === 'cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">No appointments found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppointmentsPage;


