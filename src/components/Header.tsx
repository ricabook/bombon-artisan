import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AuthDialog from "./AuthDialog";
import useAuth from "@/hooks/useAuth";

type AuthMode = "login" | "register";

const THEME_KEY = "theme"; // "dark" | "light"

function applyThemeClass(theme: "dark" | "light") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

const Header: React.FC = () => {
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  // Toggle Dark/Light
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark";
    setTheme(saved);
    applyThemeClass(saved);
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    applyThemeClass(next);
  };

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Você saiu da sua conta." });
  };

  return (
    <header className="w-full border-b border-border/30 bg-background/70 dark:bg-darkBg/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* LOGO + link (restaurado) */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            {/* Ajuste o arquivo conforme seu /public (png/svg) */}
            <img
              src="/logo.png"
              alt="La Vie Pâtisserie"
              className="h-20 w-auto"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
          >
            Início
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
            >
              Dashboard
            </Link>
          )}

          {user && isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
            >
              Admin
            </Link>
          )}

          {/* Toggle SEM condicional (aparece sempre) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                       bg-foreground text-background
                       dark:bg-darkButton dark:text-darkBg
                       hover:brightness-95 transition"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* Área de autenticação */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleOpenAuth("login")}
                className="text-foreground dark:text-white"
              >
                Entrar
              </Button>
              <Button
                variant="default"
                onClick={() => handleOpenAuth("register")}
                className="bg-primary text-primary-foreground dark:bg-darkButton dark:text-darkBg"
              >
                Criar conta
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/80 dark:text-white/80">
                Olá, {user?.user_metadata?.nome || user?.email || "usuário"}
              </span>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-foreground dark:text-white"
              >
                Sair
              </Button>
            </div>
          )}
        </nav>
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        mode={authMode}
      />
    </header>
  );
};

export default Header;
