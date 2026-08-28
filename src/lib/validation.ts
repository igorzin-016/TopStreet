import {
  PilotRegistrationForm,
  RegistrationFieldErrors,
} from "../types/registration";

/* -------------------------------------------------------------------- */
/*  MÃSCARAS â€” aplicadas no onChange, sempre a partir do valor "cru"     */
/* -------------------------------------------------------------------- */

export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function maskCarNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

/* -------------------------------------------------------------------- */
/*  VALIDAÃ‡ÃƒO                                                            */
/* -------------------------------------------------------------------- */

export function isValidCPF(rawValue: string): boolean {
  const cpf = rawValue.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let checkDigit1 = (sum * 10) % 11;
  if (checkDigit1 === 10) checkDigit1 = 0;
  if (checkDigit1 !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let checkDigit2 = (sum * 10) % 11;
  if (checkDigit2 === 10) checkDigit2 = 0;

  return checkDigit2 === Number(cpf[10]);
}

export function isValidWhatsApp(rawValue: string): boolean {
  const digits = rawValue.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function validateRegistrationForm(
  form: PilotRegistrationForm
): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Informe o nome completo.";
  } else if (form.fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = "Informe nome e sobrenome.";
  }

  if (!form.cpf.trim()) {
    errors.cpf = "Informe o CPF.";
  } else if (!isValidCPF(form.cpf)) {
    errors.cpf = "CPF invÃ¡lido.";
  }

  if (!form.whatsapp.trim()) {
    errors.whatsapp = "Informe o WhatsApp.";
  } else if (!isValidWhatsApp(form.whatsapp)) {
    errors.whatsapp = "NÃºmero de WhatsApp invÃ¡lido.";
  }

  if (!form.vehicle.trim()) {
    errors.vehicle = "Informe o veÃ­culo e modelo.";
  }

  if (!form.carNumber.trim()) {
    errors.carNumber = "Informe o nÃºmero do carro.";
  }

  if (!form.category) {
    errors.category = "Selecione uma categoria.";
  }

  if (!form.acceptedTerms) {
    errors.acceptedTerms =
      "Ã‰ necessÃ¡rio aceitar o regulamento para continuar.";
  }

  return errors;
}

export function hasErrors(errors: RegistrationFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}


