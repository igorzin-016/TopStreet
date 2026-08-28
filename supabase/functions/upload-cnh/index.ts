import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
async function hash(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join(""); }

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  try {
    const form = await request.formData(); const token = String(form.get("token") ?? ""); const file = form.get("file");
    if (!token || !(file instanceof File) || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) return json({ message: "CNH inválida. Envie JPG, PNG, WEBP ou PDF de até 5 MB." }, 400);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: pilot } = await admin.from("pilotos").select("id").eq("resume_token_hash", await hash(token)).maybeSingle();
    if (!pilot) return json({ message: "Inscrição não encontrada." }, 404);
    const bucket = admin.storage.from("documentos-pilotos");
    const { data: existingBucket } = await admin.storage.getBucket("documentos-pilotos");
    if (!existingBucket) {
      const { error: bucketError } = await admin.storage.createBucket("documentos-pilotos", { public: false });
      if (bucketError && !/already exists/i.test(bucketError.message)) return json({ message: "O armazenamento da CNH não está configurado.", details: bucketError.message }, 500);
    }
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin"; const path = `${pilot.id}/${crypto.randomUUID()}.${extension}`;
    const upload = await bucket.upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) return json({ message: "Não foi possível salvar a CNH.", details: upload.error.message }, 500);
    const { error } = await admin.from("pilotos").update({ cnh_path: path, cnh_filename: file.name, cnh_mime_type: file.type, cnh_size: file.size, cnh_uploaded_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", pilot.id);
    if (error) return json({ message: "CNH salva, mas não foi possível atualizar o cadastro.", details: error.message }, 500);
    return json({ ok: true });
  } catch { return json({ message: "Não foi possível processar a CNH." }, 400); }
});
