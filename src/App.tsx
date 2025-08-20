import React from "react";
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

/** Rota protegida (user/admin) */
const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/** Hero (Lightbox) da página inicial */
const HomeHero: React.FC = () => {
  return (
    <section
      className="relative w-full flex items-center justify-center text-center"
      style={{
        height: "80vh",
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Camada para contraste */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-4xl px-6">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Crie seu Bombom by La Vie Pâtisserie
        </h1>

        <p className="text-white text-lg md:text-xl leading-relaxed">
          Seja bem vindo(a) à primeira plataforma online de criação de bombons
          artesanais. Aqui você escolhe todas as opções do seu bombom, gera uma
          foto através de Inteligência Artificial e envia para nossa confeitaria
          começar a produção.
          <br />
          <br />
          A criação de bombons e geração de imagens são gratuitos. Se você
          decidir enviar para produção, nossa equipe entrará em contato através
          do seu WhatsApp para concluir o pagamento e dar início ao processo. Se
          tiver qualquer dúvida, fale conosco por e-mail{" "}
          <strong>contato@laviepatisserie.com.br</strong> ou por WhatsApp:{" "}
          <strong>(19) 9-9659-4881</strong>.
        </p>
      </div>
    </section>
  );
};

/** Conteúdo que precisa do Router (para usar useLocation) */
const RouterContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Exibe o Hero apenas na home */}
      {location.pathname === "/" && <HomeHero />}

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

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toasts globais */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
