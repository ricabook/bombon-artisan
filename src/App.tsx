import React, { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import useAuth from "./hooks/useAuth";

const queryClient = new QueryClient();

const THEME_KEY = "theme";
function ensureDefaultDarkTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (!saved) {
    localStorage.setItem(THEME_KEY, "dark");
    document.documentElement.classList.add("dark");
  } else if (saved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const HomeHeroLightbox: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = original;
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Informações iniciais"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />

      <div
        className="relative mx-4 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
        >
          ×
        </button>

        <div className="relative z-10 p-6 sm:p-10 text-center">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Crie seu Bombom by La Vie Pâtisserie
          </h1>

          <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed">
            Seja bem vindo(a) à primeira plataforma online de criação de bombons
            artesanais. Aqui você escolhe todas as opções do seu bombom, gera
            uma foto através de Inteligência Artificial e envia para nossa
            confeitaria começar a produção.
            <br />
            <br />
            A criação de bombons e geração de imagens são gratuitos. Se você
            decidir enviar para produção, nossa equipe entrará em contato
            através do seu WhatsApp para concluir o pagamento e dar início ao
            processo. Se tiver qualquer dúvida, fale conosco por e-mail{" "}
            <strong>contato@laviepatisserie.com.br</strong> ou por WhatsApp:{" "}
            <strong>(19) 9-9659-4881</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

const RouterContent: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [showLightbox, setShowLightbox] = useState<boolean>(isHome);

  useEffect(() => {
    setShowLightbox(location.pathname === "/");
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-darkBg dark:text-white">
      {/* Garantia extra: deixa o body roxo no modo escuro (evita “marrom” herdado de tokens) */}
      <style>{`.dark body { background-color: #380E8F !important; }`}</style>

      <Header />

      {isHome && (
        <HomeHeroLightbox open={showLightbox} onClose={() => setShowLightbox(false)} />
      )}

      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    ensureDefaultDarkTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <RouterContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
