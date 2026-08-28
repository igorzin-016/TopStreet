import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace("/admin/inscricoes");
    });
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError("E-mail ou senha inválidos.");
    else window.location.href = "/admin/inscricoes";
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#171615] px-4 text-[#f3f1ea]"><form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-[#4a473f] bg-[#201f1d] p-6"><LockKeyhole className="mb-5 text-[#c6ff4d]" /><h1 className="font-display text-2xl font-bold uppercase">Área restrita</h1><p className="mt-2 text-sm text-[#a6a196]">Acesso exclusivo da organização.</p><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="mt-6 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#c6ff4d]" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#c6ff4d]" />{error && <p className="mt-3 text-sm text-[#ff6b5d]">{error}</p>}<button className="mt-5 w-full rounded-full bg-[#c6ff4d] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#171615]">Entrar</button></form></main>;
}
