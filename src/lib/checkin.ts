import { supabase } from "./supabase";

export type CheckinResult = {
  ok: boolean;
  message: string;
  piloto?: { nome: string; veiculo: string; categoria: string; checkinEm?: string };
};

/**
 * O token nunca é validado diretamente no navegador.
 * A Edge Function faz a validação e o consumo atômico no banco.
 */
export async function processarCheckin(token: string): Promise<CheckinResult> {
  const cleanToken = token.trim();
  if (!cleanToken) return { ok: false, message: "QR Code vazio." };

  const { data, error } = await supabase.functions.invoke("checkin", {
    body: { token: cleanToken },
  });

  if (error) return { ok: false, message: "Não foi possível validar o QR Code." };
  return data as CheckinResult;
}
