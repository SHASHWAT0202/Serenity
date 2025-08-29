
import { useEffect, useState } from 'react';
import { Menu, X, Heart, MessageCircle, BookOpen, LogOut, Settings, User as UserIcon, FileText, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        if (!mounted) return;
        setAvatarUrl(null);
        setFullName(null);
        setIsAdmin(false);
        return;
      }
  const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, role')
        .eq('id', user.id)
        .maybeSingle();
      if (!mounted) return;
  const profile = (data as { avatar_url: string | null; full_name: string | null; role: string | null } | null);
  setAvatarUrl(profile?.avatar_url || null);
  setFullName(profile?.full_name || null);
  setIsAdmin((profile?.role || '') === 'admin');
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-[2147483647] bg-white/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border-b border-white/20 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] pointer-events-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-serenity-500 to-lavender-500 rounded-full flex items-center justify-center animate-breathing">
              <span className="text-white text-xl">🧘</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Serenity</h1>
              <p className="text-xs text-serenity-600">Your Mental Wellness Sanctuary</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <button onClick={() => scrollToSection('ai-therapist')} className="text-serenity-700 hover:text-serenity-900 transition-colors flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>AI Therapist</span>
              </button>
            )}
            <button onClick={() => scrollToSection('inspiring-stories')} className="text-serenity-700 hover:text-serenity-900 transition-colors">Stories</button>
            <button onClick={() => scrollToSection('motivational-quotes')} className="text-serenity-700 hover:text-serenity-900 transition-colors">Quotes</button>
            <button onClick={() => scrollToSection('mood-music')} className="text-serenity-700 hover:text-serenity-900 transition-colors">Music Therapy</button>
            <button onClick={() => scrollToSection('wellness-tools')} className="text-serenity-700 hover:text-serenity-900 transition-colors">Tools</button>
            <button onClick={() => scrollToSection('ebooks')} className="text-serenity-700 hover:text-serenity-900 transition-colors flex items-center gap-1"><BookOpen size={16} /> E-Books</button>
            <button onClick={() => scrollToSection('blogs')} className="text-serenity-700 hover:text-serenity-900 transition-colors">Blogs</button>
            {user && <Link to="/journal" className="text-serenity-700 hover:text-serenity-900 transition-colors">Journal</Link>}
            <button onClick={() => scrollToSection('about')} className="text-serenity-700 hover:text-serenity-900 transition-colors">About</button>
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <Link to="/auth" className="text-sm text-serenity-700 hover:text-serenity-900">Sign in</Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/70 transition-all">
                    <Avatar>
                      <AvatarImage src={avatarUrl || undefined} alt={fullName || 'User'} />
                      <AvatarFallback>{(fullName || user.email || 'U').slice(0,1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm max-w-[140px] truncate">{fullName || user.email}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <DropdownMenuLabel>Signed in as<br />{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer"><UserIcon className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/journal')} className="cursor-pointer"><FileText className="mr-2 h-4 w-4" /> Journal</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/appointments')} className="cursor-pointer"><Calendar className="mr-2 h-4 w-4" /> Appointments</DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer"><Settings className="mr-2 h-4 w-4" /> Admin</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }} className="cursor-pointer text-red-600"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs opacity-70">Plot 8, 11 Techzone 2, Greater Noida</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="tel:+919794177498" className="text-xs">+91 97941 77498</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="mailto:codigomaestro07@gmail.com" className="text-xs">codigomaestro07@gmail.com</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-serenity-700 hover:text-serenity-900 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

          {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {user && (
                <button onClick={() => scrollToSection('ai-therapist')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>AI Therapist</span>
                </button>
              )}
                <button onClick={() => scrollToSection('inspiring-stories')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left">
                  Stories
                </button>
                <button onClick={() => scrollToSection('motivational-quotes')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left">
                  Quotes
                </button>
              <button onClick={() => scrollToSection('mood-music')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left">
                Music Therapy
              </button>
              <button onClick={() => scrollToSection('wellness-tools')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left">Tools</button>
                  <button onClick={() => scrollToSection('ebooks')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left flex items-center gap-2"><BookOpen size={16} /> E-Books</button>
                  {user && <Link to="/journal" onClick={() => setIsMenuOpen(false)} className="text-serenity-700 hover:text-serenity-900 transition-colors">Journal</Link>}
                  {user ? (
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-serenity-700 hover:text-serenity-900 transition-colors">Profile</Link>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-serenity-700 hover:text-serenity-900 transition-colors">Sign in</Link>
                  )}
                  {user && isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-serenity-700 hover:text-serenity-900 transition-colors">Admin</Link>}
              <button onClick={() => scrollToSection('about')} className="text-serenity-700 hover:text-serenity-900 transition-colors text-left">
                About Us
              </button>
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 flex items-center space-x-2 w-fit">
                <Heart size={16} />
                <span className="text-sm font-medium">Crisis Support</span>
              </button>
                  {user && (
                    <button onClick={async () => { await signOut(); setIsMenuOpen(false); }} className="text-left text-red-600 flex items-center gap-2">
                      <LogOut size={16} /> Sign out
                    </button>
                  )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
