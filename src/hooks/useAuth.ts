import { useEffect, useState, useMemo } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (
    nome: string,
    telefone: string,
    email: string,
    password: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Deriva admin do user_metadata.role (ajuste se você usar profiles/claims no JWT)
  const computeIsAdmin = (u: User | null) => {
    const role =
      (u?.user_metadata?.role as string | undefined) ??
      (u?.app_metadata?.role as string | undefined);
    return role === "admin";
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setIsAdmin(computeIsAdmin(data.session?.user ?? null));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      setIsAdmin(computeIsAdmin(sess?.user ?? null));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    nome: string,
    telefone: string,
    email: string,
    password: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome, telefone } },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    // 1) Desloga no Supabase
    const { error } = await supabase.auth.signOut();
    // 2) Limpa imediatamente o estado da UI (independente do listener)
    setUser(null);
    setSession(null);
    setIsAdmin(false);

    // 3) (Opcional, defensivo) limpa chaves locais se você mudou a storageKey do client
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") || k.includes("supabase"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}

    if (error) {
      // Propaga erro para o caller tratar (toast, etc.)
      throw error;
    }
  };

  return useMemo(
    () => ({
      user,
      session,
      loading,
      isAdmin,
      signUp,
      signIn,
      signOut,
    }),
    [user, session, loading, isAdmin]
  );
};

export default useAuth;
