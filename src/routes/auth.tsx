import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin login — Salento Flow" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Account creato");
        navigate({ to: "/admin" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6">
        <Link to="/" className="text-xs text-muted-foreground">← Torna alla guida</Link>
        <h1 className="mt-3 text-2xl font-medium">Admin</h1>
        <p className="text-sm text-muted-foreground">Accedi per modificare i contenuti.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="email" required placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <input type="password" required minLength={6} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" />
          <button type="submit" disabled={loading}
            className="w-full rounded-2xl py-3 text-sm font-medium disabled:opacity-60"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            {loading ? "…" : mode === "signin" ? "Accedi" : "Crea account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-muted-foreground underline">
          {mode === "signin" ? "Prima volta? Crea un account admin" : "Hai già un account? Accedi"}
        </button>
      </div>
    </div>
  );
}
