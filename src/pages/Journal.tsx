import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Smile, BookOpen, Calendar, Save, Heart, Sparkles, Sun, Moon, Wind, Flower } from "lucide-react";

type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const JournalPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const EMOJIS = useMemo(() => [
    "😊","😌","😢","😡","😴","🤗","✨","💪","🧘","🌿","🌞","🌧️","❤️","🧠","🔥","🌊",
    "🌸","🦋","🌈","💎","🕯️","🍃","☁️","⭐","🌺","🌙","💫","🌱"
  ], []);

  const MOOD_COLORS = {
    happy: "from-yellow-100 via-orange-50 to-pink-100",
    calm: "from-blue-50 via-cyan-50 to-teal-50",
    thoughtful: "from-purple-50 via-indigo-50 to-blue-50",
    peaceful: "from-green-50 via-emerald-50 to-teal-50"
  };

  const loadEntries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, user_id, title, content, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load entries", description: (error as Error).message, variant: "destructive" as any });
    }
    setEntries((data as any) ?? []);
  };

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addEntry = async () => {
    if (!user || !content.trim()) return;
    setLoading(true);
    const effectiveTitle = title.trim() || (content.trim().split(/\n+/)[0].slice(0, 80) + (content.trim().length > 80 ? "…" : ""));
    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: effectiveTitle,
      content: content.trim(),
    });
    if (error) {
      toast({ title: "Save failed", description: (error as Error).message, variant: "destructive" as any });
      setLoading(false);
      return;
    }
    setTitle("");
    setContent("");
    setIsWriting(false);
    await loadEntries();
    setLoading(false);
    toast({ 
      title: "✨ Entry saved successfully", 
      description: "Your thoughts have been safely recorded"
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsWriting(e.target.value.length > 0);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      setEmojiPickerOpen(false);
      // Focus and set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 10);
    } else {
      setContent(c => c + emoji);
      setEmojiPickerOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="mb-4">
            <BookOpen className="h-16 w-16 text-blue-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Your Journal</h2>
          <p className="text-gray-600">Please sign in to access your private thoughts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Flower className="h-8 w-8 text-pink-200 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sun className="h-6 w-6 text-yellow-200 opacity-40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <Wind className="h-7 w-7 text-blue-200 opacity-50" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed">
          <Sparkles className="h-5 w-5 text-purple-200 opacity-60" />
        </div>
      </div>

      <section className="relative z-10 p-4 pt-24">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Wellness Journal
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A safe space for your thoughts, feelings, and reflections. Express yourself freely and track your mental wellness journey.
            </p>
          </div>

          {/* Writing Area */}
          <div className="mb-8 animate-slide-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className={`bg-gradient-to-r ${isWriting ? MOOD_COLORS.thoughtful : MOOD_COLORS.calm} px-8 py-6 transition-all duration-500`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/60 rounded-full">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">New Entry</h2>
                    {isWriting && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 animate-fade-in">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                        Writing...
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 bg-white/40 px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3 space-y-4">
                    <div className="relative">
                      <Input
                        placeholder="Title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-medium border-2 border-gray-100 focus:border-blue-300 transition-colors duration-200 rounded-2xl px-4 py-3"
                      />
                      <div className="text-xs text-gray-500 mt-1">You can leave this blank; we’ll generate a title from your entry.</div>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        ref={contentRef}
                        className="w-full border-2 border-gray-100 focus:border-blue-300 rounded-2xl p-4 min-h-[200px] resize-none bg-white/50 backdrop-blur-sm transition-all duration-200 focus:shadow-lg text-gray-700 leading-relaxed placeholder:text-gray-400"
                        placeholder="Pour your heart out... Let your thoughts flow freely. Remember, this is your safe space. ✨"
                        value={content}
                        onChange={handleContentChange}
                        style={{ lineHeight: '1.8' }}
                      />
                      
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-30 pointer-events-auto">
                        <div className="relative">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                            className="rounded-full hover:scale-105 transition-transform duration-200 bg-white/80 border-gray-200"
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                          
                          {emojiPickerOpen && (
                      <div className="absolute bottom-12 right-0 bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-2xl z-20 animate-scale-in w-80">
                              <div className="text-sm font-medium text-gray-600 mb-3">Express your mood</div>
                              <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                                {EMOJIS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    className="text-2xl p-2 hover:bg-gray-50 rounded-lg hover:scale-110 transition-all duration-150"
                                    onClick={() => insertEmoji(emoji)}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          type="button" 
                          onClick={() => { setEmojiPickerOpen(false); addEntry(); }} 
                          disabled={loading || !content.trim()}
                          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Saving..." : "Save Entry"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Wellness Prompts */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-800">Wellness Prompts</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        "One thing I'm grateful for today is...",
                        "Right now I feel... because...",
                        "To be kinder to myself, I will...",
                        "Something that brought me peace was...",
                        "A lesson I learned today is...",
                        "I'm proud of myself for..."
                      ].map((prompt, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-colors duration-200 cursor-pointer group"
                          onClick={() => {
                            if (!content) {
                              setContent(prompt + " ");
                              contentRef.current?.focus();
                            }
                          }}
                        >
                          <p className="text-gray-700 group-hover:text-gray-900">{prompt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="space-y-6">
            {entries.length > 0 && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Journey</h2>
                <p className="text-gray-600">Reflecting on your thoughts and growth</p>
              </div>
            )}
            
            {entries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-r ${MOOD_COLORS.peaceful} px-8 py-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{entry.title}</h3>
                    <div className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
                      {entry.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {entries.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="mb-6">
                  <Moon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your journal awaits</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start your wellness journey by writing your first entry. Every thought matters, every feeling is valid.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JournalPage;