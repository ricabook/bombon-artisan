import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // ou spinner

  // Se já logado, manda para o dashboard (ou home)
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
