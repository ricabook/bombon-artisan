// src/pages/MinhaConta.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

export default function MinhaConta() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const tryLogin = async () => {
    setBusy(true);
    setMsg(null);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setMsg(error.message || "Erro ao entrar");
    else setMsg("Login OK");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>

      <div className="mb-3 text-sm opacity-80">
        Status: {loading ? "carregando auth…" : user ? "logado" : "convidado"}
      </div>

      {!user && (
        <>
          <div className="space-y-3">
            <Input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={tryLogin} disabled={busy}>
              {busy ? "Entrando…" : "Entrar"}
            </Button>
          </div>
          {msg && <p className="mt-3 text-sm">{msg}</p>}
        </>
      )}

      {user && (
        <p className="mt-4">
          Você já está logado como <b>{user.email}</b>.
        </p>
      )}
    </div>
  );
}
