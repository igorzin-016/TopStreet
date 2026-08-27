import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) throw new Error("Não autenticado");

    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error("Não autenticado");

    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: profile } = await adminClient.from("admin_profiles").select("role").eq("user_id", user.id).maybeSingle();
    if (!profile || !["admin", "fiscal"].includes(profile.role)) throw new Error("Usuário sem permissão");

    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token || token.length > 512) throw new Error("QR Code inválido");

    const { data, error } = await adminClient.rpc("consume_checkin", { p_token_hash: await sha256(token), p_fiscal_id: user.id });
    if (error) throw error;
    if (!data?.length) return new Response(JSON.stringify({ ok: false, message: "QR Code inválido, não aprovado ou já utilizado." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ ok: true, message: "Acesso liberado.", piloto: { nome: data[0].nome, veiculo: data[0].veiculo, categoria: data[0].categoria, checkinEm: data[0].checkin_em } }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : "Falha ao validar acesso." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
