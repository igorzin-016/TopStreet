import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const body = await request.json();
    const resumeToken = typeof body.token === "string" ? body.token.trim() : "";
    if (!resumeToken || resumeToken.length > 512) return json({ message: "Token de inscrição inválido." }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: pilot, error } = await admin.from("pilotos").select("id, protocolo, nome_completo, veiculo, categoria, status, status_checkin, qr_token_hash, payment_rejection_reason").eq("resume_token_hash", await sha256(resumeToken)).maybeSingle();
    if (error || !pilot) return json({ message: "Inscrição não encontrada." }, 404);
    let qrToken: string | null = null;
    if (["credenciamento_liberado", "aprovado"].includes(pilot.status)) {
      const secret = Deno.env.get("QR_SECRET") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      qrToken = await sha256(`${resumeToken}:${pilot.id}:${secret}`);
      if (pilot.qr_token_hash !== await sha256(qrToken)) {
        const { error: updateError } = await admin.from("pilotos").update({ qr_token_hash: await sha256(qrToken), qr_gerado_em: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", pilot.id);
        if (updateError) console.error("registration-status qr update error", updateError);
      }
    }
    return json({ protocolo: pilot.protocolo, nome: pilot.nome_completo, veiculo: pilot.veiculo, categoria: pilot.categoria, status: pilot.status, statusCheckin: pilot.status_checkin, rejectionReason: pilot.payment_rejection_reason, qrToken });
  } catch { return json({ message: "Não foi possível consultar a inscrição." }, 400); }
});
