export const isNonEmpty = (s: string) => s.trim().length > 0;
export const isLetters = (s: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(s.trim());
export const isPhone = (s: string) => /^[0-9]{7,15}$/.test(s.trim());
