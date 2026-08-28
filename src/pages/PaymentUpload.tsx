import { useRef, useState } from "react";
import { Check, Copy, FileUp, Loader2, Upload } from "lucide-react";
import { supabase } from "../lib/supabase";

const PIX_KEY = "0001";

export default function PaymentUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("topstreet_resume_token");
  const protocol = localStorage.getItem("topstreet_protocol") ?? "-";

  async function copyPix() {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function sendProof() {
    if (!token || !file) return setMessage("Selecione o comprovante antes de enviar.");
    setBusy(true); setMessage("");
    const form = new FormData();
    form.append("token", token); form.append("file", file);
    const { data, error } = await supabase.functions.invoke("upload-proof", { body: form });
    setBusy(false);
    if (error || !data?.ok) return setMessage(data?.message ?? "Não foi possível enviar o comprovante.");
    setMessage("Comprovante enviado. A organização fará a conferência do pagamento.");
  }

  return <main className="min-h-screen bg-[#171615] px-4 py-8 text-[#f3f1ea]"><section className="mx-auto max-w-lg rounded-3xl border border-[#3a3836] bg-[#201f1d] p-6 sm:p-8"><p className="text-xs uppercase tracking-[0.25em] text-[#a6a196]">Top Street · Pagamento</p><h1 className="mt-3 font-display text-2xl font-bold uppercase">Finalize sua inscrição</h1><p className="mt-2 text-sm text-[#a6a196]">Protocolo: <span className="text-[#f3f1ea]">{protocol}</span></p><div className="mt-7 rounded-2xl border border-[#c6ff4d]/30 bg-[#c6ff4d]/5 p-5"><p className="text-xs uppercase tracking-widest text-[#a6a196]">Chave PIX</p><div className="mt-2 flex items-center justify-between gap-3"><strong className="font-mono text-xl text-[#c6ff4d]">{PIX_KEY}</strong><button onClick={copyPix} className="inline-flex items-center gap-2 rounded-full border border-[#c6ff4d]/40 px-3 py-2 text-xs uppercase text-[#c6ff4d]">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copiada" : "Copiar"}</button></div></div><div className="mt-6 rounded-2xl border border-dashed border-[#4a473f] p-5"><FileUp className="text-[#c6ff4d]" size={22} /><h2 className="mt-3 font-semibold">Comprovante de pagamento</h2><p className="mt-1 text-xs text-[#a6a196]">JPG, PNG, WEBP ou PDF · máximo de 5 MB</p><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="sr-only" /><button onClick={() => fileRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase hover:bg-white/10"><Upload size={15} /> {file ? file.name : "Escolher arquivo"}</button></div>{message && <p className="mt-4 rounded-xl border border-[#c6ff4d]/30 bg-[#c6ff4d]/5 p-3 text-sm text-[#c6ff4d]">{message}</p>}<button onClick={sendProof} disabled={busy || !file || !token} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#e42313] px-4 py-3.5 text-sm font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}Enviar comprovante</button>{!token && <p className="mt-4 text-center text-xs text-[#ffb627]">Sessão de inscrição não encontrada neste aparelho.</p>}</section></main>;
}
