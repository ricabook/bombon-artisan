import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AuthDialog from "./AuthDialog";
import useAuth from "@/hooks/useAuth";

// 🔽 novos imports para o menu hamburger
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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

  // Tema: padrão "light"
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "dark" | "light") || "light";
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
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* LOGO + link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="La Vie Pâtisserie"
              className="h-12 sm:h-16 md:h-20 w-auto"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* NAV existente (inalterada) */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {user && (
            <Link
              to="/dashboard"
              className="hidden sm:block text-xs sm:text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
            >
              Meus Bombons
            </Link>
          )}

          {user && (
            <Link
              to="/minha-conta"
              className="hidden sm:block text-xs sm:text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
            >
              Minha Conta
            </Link>
          )}

          {user && isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:block text-xs sm:text-sm font-medium text-foreground/80 dark:text-white/90 hover:underline"
            >
              Admin
            </Link>
          )}

          {/* Toggle tema (como estava) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold
                       bg-foreground text-background
                       dark:bg-darkButton dark:text-darkBg
                       hover:brightness-95 transition"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="hidden sm:inline">{theme === "dark" ? "Claro" : "Escuro"}</span>
          </button>

          {/* Área de autenticação (como estava) */}
          {!user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenAuth("login")}
                className="text-foreground dark:text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                Entrar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleOpenAuth("register")}
                className="bg-primary text-primary-foreground dark:bg-darkButton dark:text-darkBg text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden xs:inline">Criar conta</span>
                <span className="xs:hidden">Criar conta</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden md:block text-xs sm:text-sm text-foreground/80 dark:text-white/80 max-w-24 sm:max-w-none truncate">
                Olá, {user?.user_metadata?.nome || user?.email || "usuário"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-foreground dark:text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                Sair
              </Button>
            </div>
          )}

          {/* 🔽 NOVO: botão hamburger (apenas mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden ml-1"
                aria-label="Abrir menu"
                title="Abrir menu"
              >
                <span className="text-lg leading-none">☰</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                {/* Mesmos links da topbar, respeitando as mesmas condições */}
                {user && (
                  <SheetClose asChild>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-muted"
                    >
                      Meus Bombons
                    </Link>
                  </SheetClose>
                )}

                {user && (
                  <SheetClose asChild>
                    <Link
                      to="/minha-conta"
                      className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-muted"
                    >
                      Minha Conta
                    </Link>
                  </SheetClose>
                )}

                {user && isAdmin && (
                  <SheetClose asChild>
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-muted"
                    >
                      Admin
                    </Link>
                  </SheetClose>
                )}

                <hr className="my-3" />

                {/* Alternar tema (mesma função) */}
                <Button
                  onClick={toggleTheme}
                  variant="secondary"
                  className="justify-start"
                >
                  Alternar para tema {theme === "dark" ? "claro" : "escuro"}
                </Button>

                {/* Autenticação no menu (mesmas ações) */}
                {!user ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleOpenAuth("login")}
                      >
                        Entrar
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="default"
                        className="justify-start"
                        onClick={() => handleOpenAuth("register")}
                      >
                        Criar conta
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={handleSignOut}
                    >
                      Sair
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
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
