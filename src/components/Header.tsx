import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="text-xl font-display hover:opacity-60 transition-opacity">
          Arjun's Gallery
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link to="/blog" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
            Blog
          </Link>
          <Link to="/about" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
            About
          </Link>
          {user && (
            <Link to="/admin" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
              Admin
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:opacity-60"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:opacity-60"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
