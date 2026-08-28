import { supabase } from "./supabase";
import type { PilotCategory, PilotRegistrationForm, RegistrationResult } from "../types/registration";

export class RegistrationError extends Error {}

export async function submitPilotRegistration(form: PilotRegistrationForm): Promise<RegistrationResult> {
  const { data, error } = await supabase.functions.invoke("register-pilot", { body: form });
  if (error || !data?.protocolo || !data?.resumeToken) {
    const details = typeof data?.details === "string" ? ` (${data.details})` : "";
    throw new RegistrationError((data?.message ?? "Não foi possível criar a inscrição.") + details);
  }
  return {
    protocol: data.protocolo,
    fullName: data.nome_completo,
    vehicle: data.veiculo,
    category: data.categoria as PilotCategory,
    resumeToken: data.resumeToken,
  };
}
