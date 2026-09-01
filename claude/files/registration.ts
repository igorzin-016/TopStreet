import {
  PilotCategory,
  PilotRegistrationForm,
  RegistrationResult,
} from "../types/registration";

/**
 * Camada de serviço isolada para a inscrição de pilotos.
 *
 * STATUS: STUB — ainda não integrado ao Supabase.
 *
 * Quando o schema descrito no fluxo (`eventos`, `pilotos`, `checkins`,
 * RLS) estiver criado, substituir o corpo desta função por uma chamada
 * real, mantendo a mesma assinatura para não quebrar o componente que
 * a consome (`PilotRegistration.tsx`).
 *
 * Integração real esperada (etapa 2 do fluxo seguro):
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
 * O piloto NÃO deve poder consultar ou alterar cadastros de outras
 * pessoas — isso é responsabilidade da policy de RLS na tabela
 * `pilotos`, não do frontend.
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
    throw new RegistrationError("Categoria não informada.");
  }

  // Simula latência de rede do stub. Remover quando integrar de verdade.
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Simulação de falha ocasional removida propositalmente — não inventar
  // comportamento de erro de rede sem um caso real para tratar.

  return {
    protocol: generateProtocol(),
    fullName: form.fullName.trim(),
    vehicle: form.vehicle.trim(),
    category: form.category as PilotCategory,
  };
}
