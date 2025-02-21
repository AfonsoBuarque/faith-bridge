export const PASSWORD_MIN_LENGTH = 6;

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} é obrigatório`,
  email: 'Email inválido',
  password: {
    length: `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres`,
    format: 'A senha deve conter letras e números',
    match: 'As senhas não conferem'
  }
};