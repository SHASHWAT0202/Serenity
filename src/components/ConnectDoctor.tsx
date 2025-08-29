import { useEffect, useMemo, useState } from 'react';
import { Video, Phone, MessageCircle, Calendar, Star, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

type Doctor = {
  id: string;
  name: string;
  specialty: string | null;
  experience: string | null;
  rating: number | null;
  reviews: number | null;
  languages: string[] | null;
  availability: 'Available Now' | 'Available Today' | 'Available Tomorrow' | 'Busy' | null;
  price: string | null;
  image_url: string | null;
  bio: string | null;
  whatsapp: string | null;
  phone: string | null;
  is_active: boolean | null;
};

const ConnectDoctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [connectionType, setConnectionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [isConnecting, setIsConnecting] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoadingDoctors(true);
    supabase
      .from('doctors')
      .select('id, name, specialty, experience, rating, reviews, languages, availability, price, image_url, bio, whatsapp, phone, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setDoctors([]);
        } else {
          setDoctors((data as Doctor[]) || []);
        }
        setLoadingDoctors(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getAvailabilityColor = (availability: string | null) => {
    switch (availability) {
      case 'Available Now': return 'text-green-600 bg-green-100';
      case 'Available Today': return 'text-serenity-600 bg-serenity-100';
      case 'Available Tomorrow': return 'text-orange-600 bg-orange-100';
      case 'Busy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const upcomingSlots = useMemo(() => {
    const slots: { iso: string; label: string }[] = [];
    const hours = [10, 14, 18];
    const now = new Date();
    for (let d = 0; d < 7; d++) {
      const day = new Date(now);
      day.setDate(now.getDate() + d);
      hours.forEach((h) => {
        const slot = new Date(day);
        slot.setHours(h, 0, 0, 0);
        if (slot.getTime() > now.getTime()) {
          slots.push({
            iso: slot.toISOString(),
            label: `${slot.toLocaleDateString()} ${slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          });
        }
      });
    }
    return slots;
  }, []);

  const bookAppointment = async () => {
    if (!user) {
      toast({ title: 'Please sign in to book', variant: 'destructive' as any });
      return;
    }
    if (!selectedDoctor || !selectedSlot) {
      toast({ title: 'Select a slot and doctor' });
      return;
    }
    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      doctor_id: selectedDoctor.id,
      connection_type: connectionType,
      slot_start: selectedSlot,
      status: 'pending',
    });
    if (error) {
      toast({ title: 'Booking failed', description: error.message, variant: 'destructive' as any });
      return;
    }
    toast({ title: 'Session requested', description: 'You will be notified once approved.' });
    setSelectedSlot(null);
  };

  const handleConnect = async () => {
    if (!selectedDoctor) return;
    if (!selectedSlot) {
      toast({ title: 'Pick a time slot to continue', variant: 'destructive' as any });
      return;
    }
    setIsConnecting(true);
    // Create a quick Jitsi room url
    const base = 'https://meet.jit.si';
    const room = `Serenity-${selectedDoctor.id}-${Date.now()}`;
    const url = `${base}/${room}`;
    // Optionally record the appointment as connecting now
    if (user) {
      await supabase.from('appointments').insert({
        user_id: user.id,
        doctor_id: selectedDoctor.id,
        connection_type: connectionType,
        slot_start: selectedSlot,
        status: 'approved',
      });
    }
    setTimeout(() => {
      setIsConnecting(false);
      setRoomUrl(url);
      setCallOpen(true);
    }, 600);
  };

  const connectionOptions = [
    { type: 'video', label: 'Video Call', icon: <Video size={20} />, description: 'Face-to-face video session' },
    { type: 'audio', label: 'Voice Call', icon: <Phone size={20} />, description: 'Audio-only session' },
    { type: 'chat', label: 'Text Chat', icon: <MessageCircle size={20} />, description: 'Real-time messaging' }
  ];

  return (
    <section id="connect-doctor" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <Video className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">Connect with Licensed Professionals</h2>
          <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
            Connect with verified mental health professionals for personalized support. All sessions are confidential and secure.
          </p>
        </div>

        {selectedDoctor ? (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
              >
                ← Back to Doctors
              </button>
            </div>

            <div className="therapeutic-card p-8">
              {/* Doctor Profile */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                <img 
                  src={selectedDoctor.image_url || 'https://placehold.co/128'} 
                  alt={selectedDoctor.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedDoctor.name}</h3>
                  <p className="text-lg text-serenity-600 font-medium mb-2">{selectedDoctor.specialty}</p>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500" size={16} fill="currentColor" />
                      <span className="font-medium">{selectedDoctor.rating}</span>
                      <span className="text-gray-500">({selectedDoctor.reviews} reviews)</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{selectedDoctor.experience}</span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(selectedDoctor.availability)}`}>
                      {selectedDoctor.availability}
                    </span>
                    <span className="text-lg font-semibold text-purple-600">{selectedDoctor.price}</span>
                  </div>
                  <p className="text-gray-600">{selectedDoctor.bio}</p>
                </div>
              </div>

              {/* Connection Options */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Choose Connection Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {connectionOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setConnectionType(option.type as 'video' | 'audio' | 'chat')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        connectionType === option.type
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        connectionType === option.type ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.icon}
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">{option.label}</h5>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking */}
              <div className="text-center space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Pick a time</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-48 overflow-auto">
                    {upcomingSlots.map((s) => (
                      <button
                        key={s.iso}
                        onClick={() => setSelectedSlot(s.iso)}
                        className={`text-sm px-3 py-2 rounded-md border ${selectedSlot === s.iso ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
                    <button onClick={bookAppointment} className="bg-serenity-600 text-white px-6 py-2 rounded-full font-medium hover:opacity-90">Request Booking</button>
                    <button
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Connecting…</span>
                        </>
                      ) : (
                        <>
                          {connectionType === 'video' && <Video size={18} />}
                          {connectionType === 'audio' && <Phone size={18} />}
                          {connectionType === 'chat' && <MessageCircle size={18} />}
                          <span>Connect Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Available Now Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Available Now</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.filter(doc => doc.availability === 'Available Now').map((doctor) => (
                  <div key={doctor.id} className="therapeutic-card p-6 hover:scale-105 transition-all duration-300">
                    <div className="text-center mb-4">
                      <img 
                        src={doctor.image_url || 'https://placehold.co/80'} 
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 shadow-lg"
                      />
                      <h4 className="text-lg font-semibold text-gray-800">{doctor.name}</h4>
                      <p className="text-serenity-600 font-medium">{doctor.specialty}</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-500" size={14} fill="currentColor" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-xs text-gray-500">({doctor.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-600">{doctor.experience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                          {doctor.availability}
                        </span>
                        <span className="font-semibold text-purple-600">{doctor.price}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>

                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Connect Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Doctors */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">All Professionals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.filter(doc => doc.availability !== 'Available Now').map((doctor) => (
                  <div key={doctor.id} className="therapeutic-card p-6 hover:scale-105 transition-all duration-300">
                    <div className="text-center mb-4">
                      <img 
                        src={doctor.image_url || 'https://placehold.co/80'} 
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 shadow-lg"
                      />
                      <h4 className="text-lg font-semibold text-gray-800">{doctor.name}</h4>
                      <p className="text-serenity-600 font-medium">{doctor.specialty}</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-500" size={14} fill="currentColor" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-xs text-gray-500">({doctor.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-600">{doctor.experience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                          {doctor.availability}
                        </span>
                        <span className="font-semibold text-purple-600">{doctor.price}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>

                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`w-full py-2 px-4 rounded-full font-medium transition-all duration-300 ${
                        doctor.availability === 'Busy'
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      }`}
                      disabled={doctor.availability === 'Busy'}
                    >
                      {doctor.availability === 'Busy' ? 'Schedule Later' : 'View Profile'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video/Audio Call Modal (Jitsi quick-start) */}
        <Dialog open={callOpen} onOpenChange={setCallOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Live {connectionType === 'video' ? 'Video' : connectionType === 'audio' ? 'Audio' : 'Chat'} Session</DialogTitle>
            </DialogHeader>
            {roomUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={roomUrl}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full rounded-md border"
                  title="Session"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  If the embed is blocked, <a className="underline" href={roomUrl} target="_blank" rel="noreferrer">open in a new tab</a>.
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Preparing room…</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Privacy & Security Notice */}
        <div className="mt-12 therapeutic-card p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="text-pink-500" size={24} />
            <h4 className="text-xl font-bold text-gray-800">Your Privacy & Security</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <p><strong>Secure Sessions:</strong> Your communication is private end-to-end.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🛡️</div>
              <p><strong>Safe Platform:</strong> We never share your personal details with third parties.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🏥</div>
              <p><strong>Verified Professionals:</strong> All therapists are verified.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectDoctor;
