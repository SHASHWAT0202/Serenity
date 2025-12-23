import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, BookOpen, FileText, User, Calendar } from "lucide-react";

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md rounded-full shadow-lg px-1 sm:px-2 py-1 sm:py-1.5 border flex items-center gap-0.5 sm:gap-1 max-w-[95vw] overflow-x-auto scrollbar-hide">
      <Link
        to="/"
        className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap ${isActive("/") ? "bg-gray-100" : ""}`}
        title="Home"
      >
        <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">Home</span>
      </Link>
      <a
        href="/#ebooks"
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap"
        title="E-Books"
      >
        <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">E-Books</span>
      </a>
      <a
        href="/#blogs"
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap"
        title="Blogs"
      >
        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">Blogs</span>
      </a>
      {user && (
        <Link
          to="/journal"
          className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap ${isActive("/journal") ? "bg-gray-100" : ""}`}
          title="Journal"
        >
          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">Journal</span>
        </Link>
      )}
      {user && (
        <Link
          to="/appointments"
          className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap ${isActive("/appointments") ? "bg-gray-100" : ""}`}
          title="Appointments"
        >
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">Appts</span>
        </Link>
      )}
      {user && (
        <Link
          to="/profile"
          className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full hover:bg-gray-100 whitespace-nowrap ${isActive("/profile") ? "bg-gray-100" : ""}`}
          title="Profile"
        >
          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="hidden xs:inline">Profile</span>
        </Link>
      )}
    </nav>
  );
};

export default BottomNav;



