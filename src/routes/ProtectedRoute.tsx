import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto o auth inicializa, não redirecione ainda
  if (loading) return null; // ou um spinner

  // Sem usuário? manda para a página de login
  if (!user) {
    return <Navigate to="/minha-conta" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
