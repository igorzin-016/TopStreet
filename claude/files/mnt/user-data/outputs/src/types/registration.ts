export type PilotCategory =
  | "no-prep-201"
  | "arrancada"
  | "track-day"
  | "outra";

export const CATEGORY_LABELS: Record<PilotCategory, string> = {
  "no-prep-201": "No Prep 201 metros",
  arrancada: "Arrancada",
  "track-day": "Track Day",
  outra: "Outra categoria",
};

export const CATEGORY_OPTIONS: { value: PilotCategory; label: string }[] = (
  Object.keys(CATEGORY_LABELS) as PilotCategory[]
).map((value) => ({ value, label: CATEGORY_LABELS[value] }));

export interface PilotRegistrationForm {
  fullName: string;
  cpf: string;
  whatsapp: string;
  vehicle: string;
  carNumber: string;
  category: PilotCategory | "";
  acceptedTerms: boolean;
}

export const EMPTY_REGISTRATION_FORM: PilotRegistrationForm = {
  fullName: "",
  cpf: "",
  whatsapp: "",
  vehicle: "",
  carNumber: "",
  category: "",
  acceptedTerms: false,
};

export type RegistrationFieldErrors = Partial<
  Record<keyof PilotRegistrationForm, string>
>;

/**
 * Retorno esperado do backend após a inscrição.
 * `protocol` hoje é gerado no cliente (stub) — quando o Supabase estiver
 * integrado, deve vir do registro criado na tabela `pilotos`.
 */
export interface RegistrationResult {
  protocol: string;
  fullName: string;
  vehicle: string;
  category: PilotCategory;
}
