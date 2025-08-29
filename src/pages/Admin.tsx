import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Shield,
  Users,
  BookOpen,
  Calendar,
  Stethoscope,
  TrendingUp,
  Download,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  Copy,
  Trash2,
  Check,
  X,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Activity,
  Star,
  Phone,
  MessageCircle,
  Clock,
  Award
} from "lucide-react";

type AdminCreds = {
  id: string;
  email: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at?: string;
};

type JournalRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [journals, setJournals] = useState<JournalRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const { toast } = useToast();
  // Doctors
  type DoctorRow = {
    id: string;
    name: string;
    specialty: string | null;
    experience: string | null;
    rating: number | null;
    reviews: number | null;
    languages: string[] | null;
    availability: string | null;
    price: string | null;
    image_url: string | null;
    bio: string | null;
    whatsapp: string | null;
    phone: string | null;
    is_active: boolean | null;
  };
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [apptSearch, setApptSearch] = useState("");
  type AppointmentRow = {
    id: string;
    user_id: string;
    doctor_id: string;
    connection_type: 'video'|'audio'|'chat';
    slot_start: string;
    status: 'pending'|'approved'|'declined'|'completed';
    created_at: string;
  };
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<DoctorRow>>({ is_active: true, rating: 5, reviews: 0, availability: 'Available Today' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const signInAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Check if this user has admin role
    const { data: role } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();
    if ((role as any)?.role === "admin") {
      setAuthorized(true);
    } else {
      setError("Not authorized");
    }
  };

  useEffect(() => {
    // If already signed-in and has admin role, auto-authorize
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id;
      if (!uid) return;
      const { data: role } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .single();
      if ((role as any)?.role === "admin") setAuthorized(true);
    });
  }, []);

  useEffect(() => {
    if (!authorized) return;
    const load = async () => {
      setLoading(true);
      const { data: p, error: pe } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, bio, created_at");
      if (pe) toast({ title: "Load error", description: pe.message, variant: "destructive" as any });
      setProfiles((p as any) ?? []);
      const { data: j, error: je } = await supabase
        .from("journal_entries")
        .select("id, user_id, title, content, created_at")
        .order("created_at", { ascending: false });
      if (je) toast({ title: "Load error", description: je.message, variant: "destructive" as any });
      setJournals((j as any) ?? []);
      const { data: d, error: de } = await supabase
        .from('doctors')
        .select('id, name, specialty, experience, rating, reviews, languages, availability, price, image_url, bio, whatsapp, phone, is_active')
        .order('name', { ascending: true });
      if (de) toast({ title: 'Load error', description: de.message, variant: 'destructive' as any });
      setDoctors((d as any) ?? []);
      const { data: a, error: ae } = await supabase
        .from('appointments')
        .select('id, user_id, doctor_id, connection_type, slot_start, status, created_at')
        .order('created_at', { ascending: false });
      if (ae) toast({ title: 'Load error', description: ae.message, variant: 'destructive' as any });
      setAppointments((a as any) ?? []);
      setLoading(false);
    };
    load();
  }, [authorized]);

  const stats = useMemo(() => {
    const totalUsers = profiles.length;
    const totalJournals = journals.length;
    // last 7 days
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newUsers7d = profiles.filter((p) => (p.created_at ? new Date(p.created_at).getTime() : 0) >= cutoff).length;
    const newJournals7d = journals.filter((j) => new Date(j.created_at).getTime() >= cutoff).length;
    return { totalUsers, totalJournals, newUsers7d, newJournals7d };
  }, [profiles, journals]);

  const series = useMemo(() => {
    // build last 14 days counts per day for users and journals
    const days: { date: string; users: number; journals: number }[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, users: 0, journals: 0 });
    }
    const byDate = new Map(days.map((d) => [d.date, d]));
    profiles.forEach((p) => {
      if (!p.created_at) return;
      const key = p.created_at.slice(0, 10);
      const rec = byDate.get(key);
      if (rec) rec.users += 1;
    });
    journals.forEach((j) => {
      const key = j.created_at.slice(0, 10);
      const rec = byDate.get(key);
      if (rec) rec.journals += 1;
    });
    return Array.from(byDate.values());
  }, [profiles, journals]);

  const journalsByUser = useMemo(() => {
    const map = new Map<string, number>();
    journals.forEach((j) => map.set(j.user_id, (map.get(j.user_id) || 0) + 1));
    return map;
  }, [journals]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) =>
      (p.full_name || "").toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [profiles, userSearch]);

  const filteredJournals = useMemo(() => {
    const q = journalSearch.trim().toLowerCase();
    if (!q) return journals;
    return journals.filter(
      (j) => j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q) || j.user_id.toLowerCase().includes(q)
    );
  }, [journals, journalSearch]);

  const filteredAppointments = useMemo(() => {
    const q = apptSearch.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) =>
      a.user_id.toLowerCase().includes(q) || a.doctor_id.toLowerCase().includes(q) || a.status.toLowerCase().includes(q)
    );
  }, [appointments, apptSearch]);

  const exportCSV = useCallback((rows: any[], headers: string[], filename: string) => {
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const deleteJournal = useCallback(async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message + " (add admin delete policy)", variant: "destructive" as any });
      return;
    }
    setJournals((prev) => prev.filter((j) => j.id !== id));
    toast({ title: "Entry deleted" });
  }, [toast]);

  const approveAppt = useCallback(async (id: string) => {
    const { error } = await supabase.from('appointments').update({ status: 'approved' }).eq('id', id);
    if (error) return toast({ title: 'Approve failed', description: error.message, variant: 'destructive' as any });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
  }, [toast]);

  const declineAppt = useCallback(async (id: string) => {
    const { error } = await supabase.from('appointments').update({ status: 'declined' }).eq('id', id);
    if (error) return toast({ title: 'Decline failed', description: error.message, variant: 'destructive' as any });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'declined' } : a));
  }, [toast]);

  const saveDoctor = useCallback(async () => {
    if (!newDoctor.name) return toast({ title: 'Doctor name required', variant: 'destructive' as any });
    const payload: any = {
      name: newDoctor.name,
      specialty: newDoctor.specialty ?? null,
      experience: newDoctor.experience ?? null,
      rating: newDoctor.rating ?? 5,
      reviews: newDoctor.reviews ?? 0,
      languages: (typeof newDoctor.languages === 'string' ? (newDoctor.languages as unknown as string) : '') || '',
      availability: newDoctor.availability ?? 'Available Today',
      price: newDoctor.price ?? null,
      image_url: newDoctor.image_url ?? null,
      bio: newDoctor.bio ?? null,
      whatsapp: newDoctor.whatsapp ?? null,
      phone: newDoctor.phone ?? null,
      is_active: newDoctor.is_active ?? true,
    };
    // Convert languages comma-string -> array on the fly in SQL using string_to_array if needed
    const { data, error } = await supabase.rpc('upsert_doctor', { p_doctor: payload });
    if (error) {
      // Fallback to direct insert if RPC not installed
      const { data: d2, error: e2 } = await supabase.from('doctors').insert({
        ...payload,
        languages: (payload.languages ? (payload.languages as string).split(',').map((s) => s.trim()).filter(Boolean) : [])
      }).select('*').single();
      if (e2) return toast({ title: 'Save failed', description: e2.message, variant: 'destructive' as any });
      setDoctors((prev) => [...prev, d2 as any]);
      setNewDoctor({ is_active: true, rating: 5, reviews: 0, availability: 'Available Today' });
      toast({ title: 'Doctor added' });
      return;
    }
    // If RPC success, reload
    toast({ title: 'Doctor saved' });
  }, [newDoctor, toast]);

  const toggleDoctorActive = useCallback(async (id: string, next: boolean) => {
    const { error } = await supabase.from('doctors').update({ is_active: next }).eq('id', id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' as any });
    setDoctors((prev) => prev.map((d) => d.id === id ? { ...d, is_active: next } : d));
  }, [toast]);

  const uploadDoctorImage = useCallback(async (file: File) => {
    try {
      setUploadingImage(true);
      const ext = file.name.split('.').pop();
      const path = `doctors/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('doctorimages')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('doctorimages').getPublicUrl(path);
      setNewDoctor((d) => ({ ...d, image_url: data.publicUrl }));
      toast({ title: 'Image uploaded' });
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' as any });
    } finally {
      setUploadingImage(false);
    }
  }, [toast]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Admin Portal</h1>
            <p className="text-gray-600 mt-2">Secure access to dashboard</p>
          </div>
          
          <form onSubmit={signInAdmin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Admin email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 transition-all duration-200"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm animate-shake">
                {error}
              </div>
            )}
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105" 
              type="submit"
            >
              <Shield className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-pink-300 rounded-full animate-ping animation-delay-3000"></div>
      </div>

      <section className="relative z-10 p-4 pt-24">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-down">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive system management and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="rounded-xl border-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Users</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in animation-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Journals</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalJournals.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in animation-delay-400">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">7d</div>
              </div>
              <div className="text-sm text-gray-600 font-medium">New Users</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{stats.newUsers7d.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in animation-delay-600">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">7d</div>
              </div>
              <div className="text-sm text-gray-600 font-medium">New Journals</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{stats.newJournals7d.toLocaleString()}</div>
            </div>
          </div>

          <div className="animate-slide-up">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-2 shadow-xl">
                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200">
                  <Activity className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="journals" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Journals
                </TabsTrigger>
                <TabsTrigger value="appointments" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="doctors" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Doctors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scale-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Analytics Overview</h3>
                      <p className="text-gray-600 text-sm">Activity trends over the last 14 days</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorJournals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} width={40} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="journals" stroke="#3b82f6" strokeWidth={3} fill="url(#colorJournals)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => exportCSV(filteredUsers, ["id","full_name","avatar_url","bio","created_at"], "users.csv")}
                      className="rounded-xl border-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search users by name or ID" 
                      value={userSearch} 
                      onChange={(e) => setUserSearch(e.target.value)} 
                      className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredUsers.map((p, index) => (
                      <div 
                        key={p.id} 
                        className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-gray-100 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative">
                          <img 
                            src={p.avatar_url ?? "https://placehold.co/48x48"} 
                            alt="avatar" 
                            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-gray-900 truncate">{p.full_name || "Unnamed User"}</span>
                            <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              <BookOpen className="h-3 w-3" />
                              {journalsByUser.get(p.id) || 0} entries
                            </div>
                          </div>
                          <div className="text-xs font-mono text-gray-500 mb-2 truncate">{p.id}</div>
                          {p.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{p.bio}</p>
                          )}
                          {p.created_at && (
                            <div className="text-xs text-gray-400 mt-2">
                              Joined {new Date(p.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No users match your search criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="journals" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Journal Entries</h3>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => exportCSV(filteredJournals, ["id","user_id","title","content","created_at"], "journals.csv")}
                      className="rounded-xl border-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search journals by title, content, or user ID" 
                      value={journalSearch} 
                      onChange={(e) => setJournalSearch(e.target.value)} 
                      className="pl-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredJournals.map((j, index) => (
                      <div 
                        key={j.id} 
                        className="bg-white/60 rounded-2xl border border-gray-100 p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Users className="h-3 w-3" />
                              <span className="font-mono truncate">{j.user_id}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{new Date(j.created_at).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-1">{j.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(j.content)}
                              className="rounded-xl hover:scale-105 transition-all duration-200"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteJournal(j.id)}
                              className="rounded-xl hover:scale-105 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{j.content}</p>
                        </div>
                      </div>
                    ))}
                    {filteredJournals.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No journal entries match your search criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scale-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Appointment Management</h3>
                  </div>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search by user, doctor, or status" 
                      value={apptSearch} 
                      onChange={(e) => setApptSearch(e.target.value)} 
                      className="pl-12 border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredAppointments.map((a, index) => (
                      <div 
                        key={a.id} 
                        className="bg-white/60 rounded-2xl border border-gray-100 p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                a.status === 'approved' ? 'bg-green-100 text-green-700' :
                                a.status === 'declined' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {a.connection_type === 'video' && <Eye className="h-3 w-3" />}
                                {a.connection_type === 'audio' && <Phone className="h-3 w-3" />}
                                {a.connection_type === 'chat' && <MessageCircle className="h-3 w-3" />}
                                {a.connection_type}
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Appointment Time:</span>
                                <div className="text-gray-600 mt-1">
                                  {new Date(a.slot_start).toLocaleDateString()} at {new Date(a.slot_start).toLocaleTimeString()}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Participants:</span>
                                <div className="text-gray-600 mt-1 space-y-1">
                                  <div className="font-mono text-xs">Doctor: {a.doctor_id}</div>
                                  <div className="font-mono text-xs">User: {a.user_id}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {a.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                onClick={() => approveAppt(a.id)}
                                className="bg-green-500 hover:bg-green-600 text-white rounded-xl hover:scale-105 transition-all duration-200"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => declineAppt(a.id)}
                                className="rounded-xl hover:scale-105 transition-all duration-200"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No appointments found</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="doctors" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-scale-in">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Doctor Management</h3>
                  </div>
                  
                  {/* Add Doctor Form */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8 border border-teal-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add New Doctor
                    </h4>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <Input 
                        placeholder="Doctor Name *" 
                        value={newDoctor.name || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, name: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Specialty" 
                        value={newDoctor.specialty || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, specialty: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Experience (e.g., 10 years)" 
                        value={newDoctor.experience || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, experience: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Price (e.g., $120/session)" 
                        value={newDoctor.price || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, price: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Languages (comma separated)" 
                        value={(newDoctor.languages as any) || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, languages: e.target.value as any }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="WhatsApp (e.g., 15551234567)" 
                        value={newDoctor.whatsapp || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, whatsapp: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Phone (e.g., +1-555-123-4567)" 
                        value={newDoctor.phone || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, phone: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <Input 
                        placeholder="Bio" 
                        value={newDoctor.bio || ''} 
                        onChange={(e) => setNewDoctor((d) => ({ ...d, bio: e.target.value }))} 
                        className="border-2 border-gray-200 focus:border-teal-500 rounded-xl"
                      />
                      <div>
                        <Select 
                          value={newDoctor.availability as string || ''} 
                          onValueChange={(val) => setNewDoctor((d) => ({ ...d, availability: val }))}
                        >
                          <SelectTrigger className="border-2 border-gray-200 focus:border-teal-500 rounded-xl">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available Now">Available Now</SelectItem>
                            <SelectItem value="Available Today">Available Today</SelectItem>
                            <SelectItem value="Available Tomorrow">Available Tomorrow</SelectItem>
                            <SelectItem value="Busy">Busy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <img 
                          src={newDoctor.image_url || 'https://placehold.co/64x64'} 
                          alt="Doctor avatar" 
                          className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" 
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 bg-teal-500 rounded-full">
                          <Upload className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <input 
                          ref={fileRef} 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => { 
                            const f = e.target.files?.[0]; 
                            if (f) uploadDoctorImage(f); 
                          }} 
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileRef.current?.click()} 
                          disabled={uploadingImage}
                          className="rounded-xl hover:scale-105 transition-all duration-200"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={saveDoctor}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Save Doctor
                    </Button>
                  </div>
                  
                  {/* Doctors List */}
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {doctors.map((d, index) => (
                      <div 
                        key={d.id} 
                        className="bg-white/60 rounded-2xl border border-gray-100 p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="relative">
                              <img 
                                src={d.image_url || 'https://placehold.co/64x64'} 
                                alt="Doctor avatar" 
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" 
                              />
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                d.is_active ? 'bg-green-400' : 'bg-gray-400'
                              }`}></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">{d.name}</h4>
                                {d.rating && (
                                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                    <Star className="h-3 w-3 fill-current" />
                                    {d.rating}
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                                {d.specialty && (
                                  <div className="text-gray-600">
                                    <span className="font-medium">Specialty:</span> {d.specialty}
                                  </div>
                                )}
                                {d.experience && (
                                  <div className="text-gray-600">
                                    <span className="font-medium">Experience:</span> {d.experience}
                                  </div>
                                )}
                                {d.availability && (
                                  <div className="text-gray-600">
                                    <span className="font-medium">Status:</span> {d.availability}
                                  </div>
                                )}
                                {d.price && (
                                  <div className="text-gray-600">
                                    <span className="font-medium">Price:</span> {d.price}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs">
                                {d.phone && (
                                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    Phone
                                  </div>
                                )}
                                {d.whatsapp && (
                                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    WhatsApp
                                  </div>
                                )}
                                {d.reviews && d.reviews > 0 && (
                                  <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    {d.reviews} reviews
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleDoctorActive(d.id, !d.is_active)}
                              className="rounded-xl hover:scale-105 transition-all duration-200"
                            >
                              {d.is_active ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                              {d.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={async () => { 
                                const { error } = await supabase.from('doctors').delete().eq('id', d.id); 
                                if (error) { 
                                  toast({ title: 'Delete failed', description: error.message, variant: 'destructive' as any }); 
                                } else { 
                                  setDoctors((prev) => prev.filter((x) => x.id !== d.id)); 
                                  toast({ title: 'Doctor deleted' }); 
                                } 
                              }}
                              className="rounded-xl hover:scale-105 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {doctors.length === 0 && (
                      <div className="text-center py-12">
                        <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No doctors added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminPage;