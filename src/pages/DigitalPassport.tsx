import { QRCodeSVG } from "qrcode.react";
import { CarFront, ShieldCheck } from "lucide-react";

export default function DigitalPassport() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "demo-token";
  return <main className="flex min-h-screen items-center justify-center bg-[#171615] px-4 py-8 text-[#f3f1ea]"><section className="w-full max-w-md rounded-3xl border border-[#4a473f] bg-[#201f1d] p-6 text-center shadow-2xl"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c6ff4d] text-[#171615]"><CarFront /></div><p className="text-xs uppercase tracking-[0.3em] text-[#a6a196]">Top Street · Passaporte Digital</p><h1 className="font-display mt-3 text-3xl font-bold uppercase">Aguardando vistoria</h1><div className="mx-auto my-8 flex w-fit rounded-2xl bg-white p-4"><QRCodeSVG value={token} size={210} /></div><div className="space-y-2 text-left text-sm text-[#a6a196]"><p><strong className="text-[#f3f1ea]">Piloto:</strong> Nome do piloto</p><p><strong className="text-[#f3f1ea]">Veículo:</strong> Veículo cadastrado</p><p><strong className="text-[#f3f1ea]">Categoria:</strong> No Prep · 201 metros</p></div><p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#c6ff4d]"><ShieldCheck size={15} /> Apresente este QR Code na entrada</p></section></main>;
}
