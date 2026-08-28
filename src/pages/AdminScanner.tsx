import { useCallback, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, ScanLine } from "lucide-react";
import QRScanner from "../components/QRScanner";
import { processarCheckin, type CheckinResult } from "../lib/checkin";

export default function AdminScanner() {
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const onRead = useCallback(async (token: string) => {
    setBusy(true);
    setResult(await processarCheckin(token));
    setBusy(false);
  }, []);

  return <main className="min-h-screen bg-[#171615] px-4 py-8 text-[#f3f1ea]"><div className="mx-auto max-w-xl"><div className="mb-6 flex items-center gap-3"><ScanLine className="text-[#c6ff4d]" /><div><p className="font-display text-lg font-bold uppercase">Scanner de acesso</p><p className="text-xs text-[#a6a196]">Aponte para o QR Code do piloto</p></div></div><QRScanner key={scanKey} onRead={onRead} />{busy && <p className="mt-4 text-center text-sm text-[#ffb627]">Validando acesso...</p>}{result && <div className={`mt-5 rounded-2xl border p-5 ${result.ok ? "border-[#c6ff4d]/50 bg-[#c6ff4d]/10" : "border-[#e42313]/60 bg-[#e42313]/10"}`}>{result.ok ? <CheckCircle2 className="mb-3 text-[#c6ff4d]" size={32} /> : <AlertTriangle className="mb-3 text-[#e42313]" size={32} />}<p className="font-display text-xl font-bold uppercase">{result.ok ? "Acesso liberado" : "Acesso negado"}</p><p className="mt-2 text-sm text-[#a6a196]">{result.message}</p>{result.piloto && <p className="mt-4 text-sm">{result.piloto.nome} · {result.piloto.veiculo} · {result.piloto.categoria}</p>}<button onClick={() => { setResult(null); setScanKey((key) => key + 1); }} className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-wider hover:bg-white/10"><RotateCcw size={14} /> Nova leitura</button></div>}</div></main>;
}
