import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  IdCard,
  Phone,
  Car,
  Hash,
  Flag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { FormField, SelectField } from "../components/FormField";
import { ProgressSteps } from "../components/ProgressSteps";
import { RegistrationSuccess } from "../components/RegistrationSuccess";
import {
  submitPilotRegistration,
  RegistrationError,
} from "../lib/registration";
import {
  maskCPF,
  maskWhatsApp,
  maskCarNumber,
  validateRegistrationForm,
  hasErrors,
} from "../lib/validation";
import {
  CATEGORY_OPTIONS,
  EMPTY_REGISTRATION_FORM,
  PilotRegistrationForm,
  RegistrationFieldErrors,
  RegistrationResult,
} from "../types/registration";

const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const APP_VERSION = "v0.1.1";

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */
function Header({ onBack }: { onBack: () => void }) {
  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={{ borderColor: "#3A3836", background: "rgba(23,22,21,0.92)", backdropFilter: "blur(10px)" }}
    >
      <div className="max-w-[900px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#A6A196] hover:text-[#F3F1EA] transition-colors"
        >
          <ArrowLeft size={16} />
          <span
            className="uppercase text-sm font-bold tracking-wide text-[#F3F1EA]"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Top <span style={{ color: "#E42313" }}>Street</span>
          </span>
        </button>
        <span
          className="text-[10px] sm:text-xs uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border"
          style={{ color: "#A6A196", borderColor: "#3A3836" }}
        >
          Etapa 1 de 2
        </span>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function PilotRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PilotRegistrationForm>(
    EMPTY_REGISTRATION_FORM
  );
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  function updateField<K extends keyof PilotRegistrationForm>(
    key: K,
    value: PilotRegistrationForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateRegistrationForm(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await submitPilotRegistration(form);
      if (response.resumeToken) {
        localStorage.setItem("topstreet_resume_token", response.resumeToken);
        localStorage.setItem("topstreet_protocol", response.protocol);
      }
      setResult(response);
    } catch (err) {
      setSubmitError(
        err instanceof RegistrationError
          ? err.message
          : "NÃ£o foi possÃ­vel enviar sua inscriÃ§Ã£o agora. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#171615" }}>
      <Header onBack={() => navigate("/")} />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <ProgressSteps current={result ? 2 : 0} />
        </div>

        {result ? (
          <RegistrationSuccess
            result={result}
            onContinue={() => navigate("/pagamento")}
          />
        ) : (
          <>
            <div className="mb-8">
              <span
                className="inline-block text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border mb-4"
                style={{ color: "#FFB627", borderColor: "rgba(255,182,39,0.3)" }}
              >
                Top Street Â· TarumÃ£ Â· 26/09/2026
              </span>
              <h1
                className="text-2xl sm:text-3xl font-bold uppercase text-[#F3F1EA]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Cadastro do piloto
              </h1>
              <p className="text-sm text-[#A6A196] mt-2">
                Preencha seus dados para gerar seu passaporte digital do
                evento.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border p-5 sm:p-8"
              style={{ borderColor: "#3A3836", background: "#201F1D" }}
            >
              <div className="flex flex-col gap-5">
                <FormField
                  id="fullName"
                  label="Nome completo"
                  icon={User}
                  required
                  placeholder="Ex: JoÃ£o da Silva"
                  autoComplete="name"
                  value={form.fullName}
                  error={errors.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    id="cpf"
                    label="CPF"
                    icon={IdCard}
                    required
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.cpf}
                    error={errors.cpf}
                    onChange={(e) => updateField("cpf", maskCPF(e.target.value))}
                  />
                  <FormField
                    id="whatsapp"
                    label="WhatsApp"
                    icon={Phone}
                    required
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.whatsapp}
                    error={errors.whatsapp}
                    onChange={(e) =>
                      updateField("whatsapp", maskWhatsApp(e.target.value))
                    }
                  />
                </div>

                <FormField
                  id="vehicle"
                  label="VeÃ­culo / modelo"
                  icon={Car}
                  required
                  placeholder="Ex: Chevrolet Opala 6cc"
                  autoComplete="off"
                  value={form.vehicle}
                  error={errors.vehicle}
                  onChange={(e) => updateField("vehicle", e.target.value)}
                />

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    id="carNumber"
                    label="NÃºmero do carro"
                    icon={Hash}
                    required
                    placeholder="Ex: 07"
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.carNumber}
                    error={errors.carNumber}
                    onChange={(e) =>
                      updateField("carNumber", maskCarNumber(e.target.value))
                    }
                  />
                  <SelectField
                    id="category"
                    label="Categoria"
                    icon={Flag}
                    required
                    placeholder="Selecione a categoria"
                    options={CATEGORY_OPTIONS}
                    value={form.category}
                    error={errors.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value as PilotRegistrationForm["category"]
                      )
                    }
                  />
                </div>

                {/* Aceite dos termos */}
                <label
                  htmlFor="acceptedTerms"
                  className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer"
                  style={{
                    borderColor: errors.acceptedTerms ? "#E42313" : "#3A3836",
                  }}
                >
                  <input
                    id="acceptedTerms"
                    type="checkbox"
                    checked={form.acceptedTerms}
                    aria-invalid={!!errors.acceptedTerms}
                    aria-describedby={
                      errors.acceptedTerms ? "acceptedTerms-error" : undefined
                    }
                    onChange={(e) =>
                      updateField("acceptedTerms", e.target.checked)
                    }
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#E42313]"
                  />
                  <span className="text-sm text-[#A6A196] leading-relaxed">
                    Declaro que li e aceito o{" "}
                    <a
                      href="/regulamento"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: "#FFB627" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Regulamento de Prova
                    </a>{" "}
                    e os Termos de Responsabilidade.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <span
                    id="acceptedTerms-error"
                    role="alert"
                    className="text-xs -mt-3"
                    style={{ color: "#E42313" }}
                  >
                    {errors.acceptedTerms}
                  </span>
                )}

                {/* Card de seguranÃ§a */}
                <div
                  className="flex items-start gap-3 rounded-lg border p-4"
                  style={{ borderColor: "#3A3836", background: "#171615" }}
                >
                  <ShieldCheck size={18} color="#6E6A60" className="mt-0.5 shrink-0" />
                  <p className="text-xs text-[#6E6A60] leading-relaxed">
                    Seus dados serÃ£o utilizados exclusivamente para inscriÃ§Ã£o,
                    credenciamento e controle de acesso ao evento.
                  </p>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="text-sm rounded-lg border px-4 py-3"
                    style={{ borderColor: "#E42313", color: "#E42313", background: "rgba(228,35,19,0.08)" }}
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-4 text-sm font-bold uppercase tracking-wide text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: "#E42313", fontFamily: FONT_DISPLAY }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Gerar passaporte digital <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
      <span className="fixed bottom-2 right-3 z-20 font-mono text-[9px] tracking-wider text-[#6e6a60]" title="Versão publicada do front-end">
        {APP_VERSION}
      </span>
    </div>
  );
}
