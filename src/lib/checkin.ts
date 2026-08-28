import { supabase } from "./supabase";

export type CheckinResult = {
  ok: boolean;
  message: string;
  piloto?: { nome: string; veiculo: string; categoria: string; checkinEm?: string };
};

export async function processarCheckin(token: string): Promise<CheckinResult> {
  const cleanToken = token.trim();
  if (!cleanToken) return { ok: false, message: "QR Code vazio." };
  const { data, error } = await supabase.functions.invoke("checkin", { body: { token: cleanToken } });
  if (error) {
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      try {
        const body = await context.clone().json() as { message?: string };
        return { ok: false, message: body.message ?? "Não foi possível validar o QR Code." };
      } catch { /* usa a mensagem padrão */ }
    }
    return { ok: false, message: "Não foi possível validar o QR Code." };
  }
  return data as CheckinResult;
}
