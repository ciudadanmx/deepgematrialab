// src/hebcal/index.js
import resolveParasha from "./parashaResolver";

/**
 * Devuelve el JSON completo de la parashá para una fecha
 * @param {Object} opts
 * @param {Date} opts.date
 * @param {boolean} opts.israel
 */
export async function getCurrentParasha({ date, israel = false }) {
  const name = resolveParasha(date, { israel });

  if (!name) return null;

  // normaliza: "Bereshit" -> "01_bereshit.json"
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]+/g, "_");

  try {
    const mod = await import(`../data/parashot/${slug}.json`);
    return mod.default ?? mod;
  } catch (err) {
    console.error("No se pudo cargar JSON de parashá:", slug, err);
    return {
      name,
      hebrewName: "",
      chapters: {}
    };
  }
}

export default {
  getCurrentParasha
};
