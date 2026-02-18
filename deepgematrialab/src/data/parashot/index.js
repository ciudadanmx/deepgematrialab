// src/data/parashot/index.js
// Exporta un objeto { "01_bereshit.json": {...}, "02_noach.json": {...}, ... }
// Requiere Vite (import.meta.glob)

const modules = import.meta.glob("./*.json", { eager: true });

const PARASHOT = {};
for (const p in modules) {
  // p será "./01_bereshit.json"
  const filename = p.replace("./", "");
  // modules[p] puede ser { default: {...} } o el json directamente dependiendo de config
  const value = modules[p]?.default ?? modules[p];
  PARASHOT[filename] = value;
}

export default PARASHOT;
