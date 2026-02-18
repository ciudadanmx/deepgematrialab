// src/hebcal/parashaResolver.js
import {
  isLeapYear,
  gregorianToAbsolute,
  hebrewToAbsolute
} from "./jewishKalendar.js";

import {
  PARASHOT,
  DOUBLETS
} from "./parashaCycle.js";

/**
 * Normaliza nombres para comparar (sin acentos; ASCII simple)
 */
function norm(s) {
  return String(s ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Calcula la fecha absoluta de Simjat Torá para un año hebreo dado.
 * (mantiene la convención de tus archivos: month 22/23 y day 23)
 */
function simchatTorahAbsoluteForHebYear(hebYear, israel) {
  const leap = isLeapYear(hebYear);
  // tu código anterior usaba (hebYear, leap ? 23 : 22, 23)
  const month = leap ? 23 : 22;
  const day = 23;
  return hebrewToAbsolute(hebYear, month, day);
}

/**
 * Busca el hebYear tal que abs está en [SimchatTorah(hebYear), SimchatTorah(hebYear+1))
 * Prueba alrededor de una aproximación basada en el año gregoriano.
 */
function findHebYearForAbs(abs, date, israel) {
  // aproximación basada en el año gregoriano
  const gregYear = date instanceof Date ? date.getFullYear() : new Date().getFullYear();
  let approxHeb = gregYear + 3760; // heurística común

  // buscar en ventana -3..+3 primero
  for (let delta = -3; delta <= 3; delta++) {
    const heb = approxHeb + delta;
    const st = simchatTorahAbsoluteForHebYear(heb, israel);
    const stNext = simchatTorahAbsoluteForHebYear(heb + 1, israel);
    if (abs >= st && abs < stNext) return heb;
  }

  // ampliar búsqueda -10..+10 como fallback raro
  for (let delta = -10; delta <= 10; delta++) {
    const heb = approxHeb + delta;
    const st = simchatTorahAbsoluteForHebYear(heb, israel);
    const stNext = simchatTorahAbsoluteForHebYear(heb + 1, israel);
    if (abs >= st && abs < stNext) return heb;
  }

  return null;
}

/**
 * resolveParasha(date, { israel: boolean })
 *
 * Devuelve:
 *  - string simple: "Bereshit"
 *  - string doble: "Vayakhel-Pekudei"
 *  - null si no puede resolver (fecha fuera de rango, datos inválidos)
 */
export function resolveParasha(inputDate, opts = { israel: false }) {
  // validar date
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  if (!(date instanceof Date) || isNaN(date)) return null;

  const abs = gregorianToAbsolute(date);
  if (typeof abs !== "number" || isNaN(abs)) return null;

  const israel = !!opts.israel;

  // localizar hebYear correcto
  const hebYear = findHebYearForAbs(abs, date, israel);
  if (hebYear == null) return null;

  const simchatTorah = simchatTorahAbsoluteForHebYear(hebYear, israel);
  const week = Math.floor((abs - simchatTorah) / 7);

  // preparar ciclo (clonar)
  const cycle = Array.isArray(PARASHOT) ? [...PARASHOT] : [];

  // aplicar dobles en años no bisiestos según tu lista DOUBLETS
  if (!isLeapYear(hebYear) && Array.isArray(DOUBLETS)) {
    for (const [a, b] of DOUBLETS) {
      const aNorm = norm(a);
      // buscar índice donde name normalizado === aNorm
      const idx = cycle.findIndex((name) => norm(name) === aNorm);
      if (idx !== -1) {
        // reemplazar dos entradas por "A-B"
        cycle.splice(idx, 2, `${a}-${b}`);
      }
    }
  }

  // seguridad: week en rango
  if (week < 0 || week >= cycle.length) return null;

  const result = cycle[week];
  return typeof result === "string" ? result : null;
}

// default export por compatibilidad de imports
export default resolveParasha;
