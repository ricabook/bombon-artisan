// src/routes/GuestRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Evita qualquer flicker/redirect durante bootstrap
  if (loading) {
    return <div style={{ padding: 24 }}>Carregando…</div>;
  }

  // Se já logado, mandar para dashboard
  if (user) {
    console.debug("[GuestRoute] usuário logado -> /dashboard", { from: location.pathname });
    return <Navigate to="/dashboard" replace />;
  }

  console.debug("[GuestRoute] convidado liberado", { from: location.pathname });
  return <>{children}</>;
}
