// src/utils/locale.ts
export const CATEGORY_ES: Record<string, string> = {
  beauty: "Belleza",
  furniture: "Muebles",
  fragrances: "Fragancias",
  groceries: "Abarrotes",
  "home-decoration": "Decoración del hogar",
  laptops: "Portátiles",
  smartphones: "Teléfonos",
  skincare: "Cuidado de la piel",
  lighting: "Iluminación",
  automotive: "Automotriz",
  motorcycle: "Motocicletas",
  "mens-shirts": "Camisas de hombre",
  "mens-shoes": "Zapatos de hombre",
  "womens-dresses": "Vestidos de mujer",
  "womens-shoes": "Zapatos de mujer",
};

export const uiES = {
  addToCart: "Agregar al carrito",
  stock: "Stock",
  searchPlaceholder: "Buscar productos… (mínimo 3 caracteres)",
  all: "Todos",
};

// —— Formato de moneda en PEN ——
// Si tu API ya viene en PEN, SOLO usa formatPricePEN(amount)
export const formatPricePEN = (amount: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(amount);

// (Opcional) conversión USD → PEN. Ajusta el tipo de cambio según necesites.
export const USD_TO_PEN = 3.75; // cámbialo cuando quieras
export const usdToPen = (usd: number, rate = USD_TO_PEN) => usd * rate;

// Función para capitalizar la primera letra
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};