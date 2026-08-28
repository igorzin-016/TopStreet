import { supabase } from "./supabase";
import type { PilotCategory, PilotRegistrationForm, RegistrationResult } from "../types/registration";

export class RegistrationError extends Error {}

async function readFunctionError(error: unknown) {
  const context = (error as { context?: unknown } | null)?.context;
  if (context instanceof Response) {
    try {
      const body = await context.clone().json() as { message?: string; details?: string; code?: string };
      const extra = [body.details, body.code].filter(Boolean).join(" · ");
      return extra ? `${body.message ?? "Erro no cadastro."} (${extra})` : body.message;
    } catch { /* mantém a mensagem genérica */ }
  }
  return undefined;
}

export async function submitPilotRegistration(form: PilotRegistrationForm): Promise<RegistrationResult> {
  const { data, error } = await supabase.functions.invoke("register-pilot", { body: form });
  if (error || !data?.protocolo || !data?.resumeToken) {
    const message = data?.message ?? "Não foi possível criar a inscrição.";
    const details = typeof data?.details === "string" ? data.details : await readFunctionError(error);
    throw new RegistrationError(details ? `${message} (${details})` : message);
  }
  return { protocol: data.protocolo, fullName: data.nome_completo, vehicle: data.veiculo, category: data.categoria as PilotCategory, resumeToken: data.resumeToken };
}
