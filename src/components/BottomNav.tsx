import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, BookOpen, FileText, User, Calendar } from "lucide-react";

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md rounded-full shadow-lg px-2 py-1.5 border flex items-center gap-1">
      <Link
        to="/"
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100 ${isActive("/") ? "bg-gray-100" : ""}`}
        title="Home"
      >
        <Home className="h-4 w-4" /> Home
      </Link>
      <a
        href="/#ebooks"
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100"
        title="E-Books"
      >
        <BookOpen className="h-4 w-4" /> E-Books
      </a>
      <a
        href="/#blogs"
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100"
        title="Blogs"
      >
        <FileText className="h-4 w-4" /> Blogs
      </a>
      {user && (
        <Link
          to="/journal"
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100 ${isActive("/journal") ? "bg-gray-100" : ""}`}
          title="Journal"
        >
          <FileText className="h-4 w-4" /> Journal
        </Link>
      )}
      {user && (
        <Link
          to="/appointments"
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100 ${isActive("/appointments") ? "bg-gray-100" : ""}`}
          title="Appointments"
        >
          <Calendar className="h-4 w-4" /> Appointments
        </Link>
      )}
      {user && (
        <Link
          to="/profile"
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-full hover:bg-gray-100 ${isActive("/profile") ? "bg-gray-100" : ""}`}
          title="Profile"
        >
          <User className="h-4 w-4" /> Profile
        </Link>
      )}
    </nav>
  );
};

export default BottomNav;



