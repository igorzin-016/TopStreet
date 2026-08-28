import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
async function hash(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join(""); }

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  try {
    const form = await request.formData();
    const token = String(form.get("token") ?? "");
    const file = form.get("file");
    if (!token || !(file instanceof File) || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) return json({ message: "Arquivo inválido. Envie JPG, PNG, WEBP ou PDF de até 5 MB." }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: pilot } = await admin.from("pilotos").select("id, status").eq("resume_token_hash", await hash(token)).maybeSingle();
    if (!pilot || !["aguardando_pagamento", "rejeitado", "pagamento_rejeitado"].includes(pilot.status)) return json({ message: "Inscrição não encontrada ou não permite novo comprovante." }, 403);
    const path = `${pilot.id}/${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() ?? "bin"}`;
    const upload = await admin.storage.from("comprovantes").upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) return json({ message: "Falha ao salvar o comprovante." }, 500);
    const { error } = await admin.from("pilotos").update({ proof_path: path, proof_filename: file.name, proof_mime_type: file.type, proof_size: file.size, proof_uploaded_at: new Date().toISOString(), status: "comprovante_enviado", payment_rejection_reason: null, updated_at: new Date().toISOString() }).eq("id", pilot.id);
    if (error) return json({ message: "Comprovante salvo, mas não foi possível atualizar o status." }, 500);
    return json({ ok: true, status: "comprovante_enviado" });
  } catch { return json({ message: "Não foi possível processar o upload." }, 400); }
});
