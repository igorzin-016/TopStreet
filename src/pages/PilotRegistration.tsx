import { FormEvent, useState } from "react";

type PilotFormData = {
  fullName: string;
  cpf: string;
  cnh: string;
  vehicleModel: string;
  plate: string;
  federationNumber: string;
  termsAccepted: boolean;
};

const initialFormData: PilotFormData = {
  fullName: "",
  cpf: "",
  cnh: "",
  vehicleModel: "",
  plate: "",
  federationNumber: "",
  termsAccepted: false,
};

function formatCpf(value: string) {
  const numbersOnly = value.replace(/\D/g, "").slice(0, 11);

  return numbersOnly
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export default function PilotRegistration() {
  const [formData, setFormData] = useState<PilotFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof PilotFormData>(
    field: K,
    value: PilotFormData[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Dados do piloto:", formData);
    setSubmitted(true);
  }

  const inputClassName =
    "w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-zinc-950 shadow-lg shadow-emerald-400/20">
              EC
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-white">
                Easy<span className="text-emerald-400">Crow</span>
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Motorsport access
              </p>
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Inscrição do piloto
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Garanta seu acesso à pista.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
            Preencha seus dados para iniciar o credenciamento do evento.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-zinc-200">Nome completo</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" placeholder="Digite seu nome completo" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} required className={inputClassName} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="cpf" className="mb-2 block text-sm font-semibold text-zinc-200">CPF</label>
                <input id="cpf" name="cpf" type="text" inputMode="numeric" placeholder="000.000.000-00" value={formData.cpf} onChange={(event) => updateField("cpf", formatCpf(event.target.value))} required className={inputClassName} />
              </div>
              <div>
                <label htmlFor="cnh" className="mb-2 block text-sm font-semibold text-zinc-200">CNH</label>
                <input id="cnh" name="cnh" type="text" placeholder="Número da CNH" value={formData.cnh} onChange={(event) => updateField("cnh", event.target.value)} required className={inputClassName} />
              </div>
            </div>

            <div>
              <label htmlFor="vehicleModel" className="mb-2 block text-sm font-semibold text-zinc-200">Veículo / modelo</label>
              <input id="vehicleModel" name="vehicleModel" type="text" placeholder="Ex.: Honda Civic Si" value={formData.vehicleModel} onChange={(event) => updateField("vehicleModel", event.target.value)} required className={inputClassName} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="plate" className="mb-2 block text-sm font-semibold text-zinc-200">Placa</label>
                <input id="plate" name="plate" type="text" placeholder="ABC1D23" value={formData.plate} onChange={(event) => updateField("plate", formatPlate(event.target.value))} required className={`${inputClassName} uppercase`} />
              </div>
              <div>
                <label htmlFor="federationNumber" className="mb-2 block text-sm font-semibold text-zinc-200">Número da Federação <span className="text-emerald-400">*</span></label>
                <input id="federationNumber" name="federationNumber" type="text" placeholder="Número obrigatório" value={formData.federationNumber} onChange={(event) => updateField("federationNumber", event.target.value)} required className={`${inputClassName} border-emerald-400/40`} />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/40">
              <input type="checkbox" checked={formData.termsAccepted} onChange={(event) => updateField("termsAccepted", event.target.checked)} required className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-400" />
              <span className="text-sm leading-5 text-zinc-400">
                Declaro que li e aceito o <button type="button" className="font-semibold text-emerald-400 underline underline-offset-2">Regulamento de Prova</button> e os Termos de Responsabilidade.
              </span>
            </label>

            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-5 py-4 text-sm font-black uppercase tracking-wide text-zinc-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[0.99]">
              Avançar para pagamento <span aria-hidden="true">→</span>
            </button>

            {submitted && (
              <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-center text-sm text-emerald-300">
                Formulário preenchido. A integração com o pagamento será feita na próxima etapa.
              </p>
            )}
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-zinc-600">Seus dados são utilizados exclusivamente para o credenciamento do evento.</p>
      </div>
    </main>
  );
}
