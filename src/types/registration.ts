export type PilotCategory = "no-prep-201";

export const CATEGORY_LABELS: Record<PilotCategory, string> = {
  "no-prep-201": "Arrancada 201 metros · No Prep",
};

export const CATEGORY_OPTIONS: { value: PilotCategory; label: string }[] = [
  { value: "no-prep-201", label: CATEGORY_LABELS["no-prep-201"] },
];

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
  fullName: "", cpf: "", whatsapp: "", vehicle: "", carNumber: "", category: "", acceptedTerms: false,
};

export type RegistrationFieldErrors = Partial<Record<keyof PilotRegistrationForm, string>>;

export interface RegistrationResult {
  protocol: string;
  fullName: string;
  vehicle: string;
  category: PilotCategory;
  resumeToken: string;
}
