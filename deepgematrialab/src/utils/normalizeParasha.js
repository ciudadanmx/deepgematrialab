// src/utils/normalizeParasha.js
export function normalizeParashaKey(s) {
  if (!s) return "";
  return String(s)
    .trim()
    // guion, underscore o multiples guiones → espacio
    .replace(/[_\-\u2010-\u2015]+/g, " ")
    // colapsa espacios múltiples
    .replace(/\s+/g, " ")
    // remover diacríticos
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function urlifyParashaDisplay(s) {
  if (!s) return "";
  // guiones para URL
  return String(s).trim().replace(/\s+/g, "-");
}

export function displayFromRouteSegment(seg) {
  if (!seg) return "";
  // decodeURIComponent y guiones/underscores → espacios
  return decodeURIComponent(seg).replace(/[_\-]+/g, " ").trim();
}
