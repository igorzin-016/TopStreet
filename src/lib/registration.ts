import {
  PilotCategory,
  PilotRegistrationForm,
  RegistrationResult,
} from "../types/registration";

/**
 * Camada de serviÃ§o isolada para a inscriÃ§Ã£o de pilotos.
 *
 * STATUS: STUB â€” ainda nÃ£o integrado ao Supabase.
 *
 * Quando o schema descrito no fluxo (`eventos`, `pilotos`, `checkins`,
 * RLS) estiver criado, substituir o corpo desta funÃ§Ã£o por uma chamada
 * real, mantendo a mesma assinatura para nÃ£o quebrar o componente que
 * a consome (`PilotRegistration.tsx`).
 *
 * IntegraÃ§Ã£o real esperada (etapa 2 do fluxo seguro):
 *
 *   const { data, error } = await supabase
 *     .from("pilotos")
 *     .insert({
 *       nome_completo: form.fullName,
 *       cpf: form.cpf.replace(/\D/g, ""),
 *       whatsapp: form.whatsapp.replace(/\D/g, ""),
 *       veiculo: form.vehicle,
 *       numero_carro: form.carNumber,
 *       categoria: form.category,
 *       status: "aguardando_pagamento",
 *     })
 *     .select("id, protocolo")
 *     .single();
 *
 *   if (error) throw new RegistrationError(error.message);
 *
 * O piloto NÃƒO deve poder consultar ou alterar cadastros de outras
 * pessoas â€” isso Ã© responsabilidade da policy de RLS na tabela
 * `pilotos`, nÃ£o do frontend.
 */

export class RegistrationError extends Error {}

function generateProtocol(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TS26-${random}`;
}

export async function submitPilotRegistration(
  form: PilotRegistrationForm
): Promise<RegistrationResult> {
  if (!form.category) {
    throw new RegistrationError("Categoria nÃ£o informada.");
  }

  // Simula latÃªncia de rede do stub. Remover quando integrar de verdade.
  await new Promise((resolve) => setTimeout(resolve, 900));

  // SimulaÃ§Ã£o de falha ocasional removida propositalmente â€” nÃ£o inventar
  // comportamento de erro de rede sem um caso real para tratar.

  return {
    protocol: generateProtocol(),
    fullName: form.fullName.trim(),
    vehicle: form.vehicle.trim(),
    category: form.category as PilotCategory,
  };
}


