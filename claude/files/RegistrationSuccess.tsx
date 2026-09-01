import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { CATEGORY_LABELS, RegistrationResult } from "../types/registration";

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171615] px-3 py-2.5 text-left">
      <div className="text-[10px] uppercase tracking-widest text-[#6E6A60] font-mono">
        {label}
      </div>
      <div className="text-sm text-[#F3F1EA] mt-0.5 truncate">{value}</div>
    </div>
  );
}

interface RegistrationSuccessProps {
  result: RegistrationResult;
  onContinue: () => void;
}

export function RegistrationSuccess({
  result,
  onContinue,
}: RegistrationSuccessProps) {
  return (
    <div
      className="rounded-xl border p-6 sm:p-8 text-center"
      style={{ borderColor: "rgba(198,255,77,0.3)", background: "#201F1D" }}
    >
      <div
        className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: "rgba(198,255,77,0.1)" }}
      >
        <CheckCircle2 size={24} color="#C6FF4D" />
      </div>

      <h2
        className="text-xl font-bold uppercase text-[#F3F1EA]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Cadastro recebido
      </h2>
      <p className="text-sm text-[#A6A196] mt-2 leading-relaxed">
        Seu passaporte digital será liberado após a confirmação da
        organização.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryItem label="Piloto" value={result.fullName} />
        <SummaryItem label="Veículo" value={result.vehicle} />
        <SummaryItem
          label="Categoria"
          value={CATEGORY_LABELS[result.category]}
        />
      </div>

      <div
        className="mt-4 rounded-lg border border-dashed py-3 font-mono text-xs text-[#A6A196]"
        style={{ borderColor: "#3A3836" }}
      >
        Protocolo{" "}
        <span className="text-[#F3F1EA] font-semibold">{result.protocol}</span>
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-widest text-[#6E6A60]">
        Estado de demonstração · QR Code será gerado após aprovação do
        backend
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold uppercase tracking-wide text-[#171615] transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: "#C6FF4D", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Continuar <ArrowRight size={16} />
      </button>
    </div>
  );
}
