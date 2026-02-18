// parashaCycle.js

import {
  isLeapYear,
  hebrewToAbsolute,
  gregorianToAbsolute,
  absoluteToHebrewYear
} from "./jewishKalendar";

// Orden canónico
export const PARASHOT = [
  "Bereshit","Noach","Lech Lecha","Vayera","Chayei Sarah","Toldot",
  "Vayetzei","Vayishlach","Vayeshev","Miketz","Vayigash","Vayechi",
  "Shemot","Vaera","Bo","Beshalach","Yitro","Mishpatim",
  "Terumah","Tetzaveh","Ki Tisa",
  "Vayakhel","Pekudei",
  "Vayikra","Tzav","Shemini","Tazria","Metzora",
  "Acharei Mot","Kedoshim","Emor","Behar","Bechukotai",
  "Bamidbar","Nasso","Beha'alotecha","Shelach","Korach",
  "Chukat","Balak",
  "Pinchas","Matot","Masei",
  "Devarim","Vaetchanan","Eikev","Re'eh","Shoftim",
  "Ki Teitzei","Ki Tavo","Nitzavim","Vayelech",
  "Haazinu","Vezot Haberacha"
];

// Parashot que pueden ir juntas
export const DOUBLETS = [
  ["Vayakhel","Pekudei"],
  ["Tazria","Metzora"],
  ["Acharei Mot","Kedoshim"],
  ["Behar","Bechukotai"],
  ["Chukat","Balak"],
  ["Matot","Masei"],
  ["Nitzavim","Vayelech"]
];

// Reglas reales por tipo de año
export function getParashaForShabbat(date) {
  const abs = gregorianToAbsolute(date);

  const hebYear = absoluteToHebrewYear(abs);
  const leap = isLeapYear(hebYear);

  // Simjat Torá real
  const simchatTorah = hebrewToAbsolute(
    hebYear,
    leap ? 23 : 22,
    23
  );

  if (abs < simchatTorah) return null;

  const week = Math.floor((abs - simchatTorah) / 7);

  let cycle = [...PARASHOT];

  if (!leap) {
    DOUBLETS.forEach(([a, b]) => {
      const i = cycle.indexOf(a);
      if (i !== -1) {
        cycle.splice(i, 2, `${a}-${b}`);
      }
    });
  }

  return cycle[week] || null;
}
