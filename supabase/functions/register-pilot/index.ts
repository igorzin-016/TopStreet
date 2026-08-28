import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  try {
    const body = await request.json();
    const required = ["fullName", "cpf", "whatsapp", "vehicle", "category"];
    if (required.some((field) => typeof body[field] !== "string" || !body[field].trim()) || body.acceptedTerms !== true) return json({ message: "Dados obrigatórios inválidos." }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: event } = await admin.from("eventos").select("id").eq("ativo", true).order("data_evento", { ascending: true }).limit(1).maybeSingle();
    if (!event) return json({ message: "Não há evento ativo." }, 409);
    const resumeToken = crypto.randomUUID() + crypto.randomUUID();
    const protocol = `TS26-${crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`;
    const { data, error } = await admin.from("pilotos").insert({ evento_id: event.id, protocolo: protocol, nome_completo: body.fullName.trim(), cpf: body.cpf.replace(/\D/g, ""), whatsapp: body.whatsapp.replace(/\D/g, ""), veiculo: body.vehicle.trim(), numero_carro: body.carNumber?.trim() || null, categoria: body.category, termos_aceitos: true, status: "aguardando_pagamento", resume_token_hash: await hash(resumeToken), pix_key_used: Deno.env.get("PIX_KEY") ?? "0001" }).select("id, protocolo, nome_completo, veiculo, categoria").single();
    if (error) return json({ message: "Não foi possível criar a inscrição." }, 400);
    return json({ ...data, resumeToken });
  } catch { return json({ message: "Requisição inválida." }, 400); }
});
