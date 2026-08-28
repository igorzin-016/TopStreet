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
    const cpf = typeof body.cpf === "string" ? body.cpf.replace(/\D/g, "") : "";
    const telefone = typeof body.telefone === "string" ? body.telefone.replace(/\D/g, "") : "";
    if (cpf.length !== 11 || telefone.length < 10) return json({ message: "Informe CPF e WhatsApp." }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: pilot } = await admin.from("pilotos").select("id, protocolo, nome_completo, cpf, status").eq("cpf", cpf).eq("telefone", telefone).maybeSingle();
    if (!pilot) return json({ message: "CPF ou WhatsApp não conferem." }, 401);
    const token = crypto.randomUUID() + crypto.randomUUID();
    const { error } = await admin.from("pilotos").update({ resume_token_hash: await sha256(token), updated_at: new Date().toISOString() }).eq("id", pilot.id);
    if (error) return json({ message: "Não foi possível liberar o acesso." }, 500);
    return json({ resumeToken: token, protocolo: pilot.protocolo, nome: pilot.nome_completo, status: pilot.status });
  } catch { return json({ message: "Não foi possível acessar a inscrição." }, 400); }
});
