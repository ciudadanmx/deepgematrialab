// download_54_parashot.js
// Node 18+ recommended. package.json: { "type": "module" }
// Instala: npm install node-fetch fs-extra

import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";

const OUT_DIR = path.join(".", "data", "parashot");
await fs.ensureDir(OUT_DIR);

// Cambia lang si quieres "en" o "he,en"
const LANG = "he"; // "he" (hebreo) | "en" (inglés) | "he,en" (ambos)

const PARASHOT = [
  { id: 1, name: "Bereshit", heb: "בראשית", book: "Genesis", start: [1,1], end: [6,8] },
  { id: 2, name: "Noach", heb: "נח", book: "Genesis", start: [6,9], end: [11,32] },
  { id: 3, name: "Lech Lecha", heb: "לך לך", book: "Genesis", start: [12,1], end: [17,27] },
  { id: 4, name: "Vayera", heb: "וירא", book: "Genesis", start: [18,1], end: [22,24] },
  { id: 5, name: "Chayei Sarah", heb: "חיי שרה", book: "Genesis", start: [23,1], end: [25,18] },
  { id: 6, name: "Toldot", heb: "תולדות", book: "Genesis", start: [25,19], end: [28,9] },
  { id: 7, name: "Vayetzei", heb: "ויצא", book: "Genesis", start: [28,10], end: [32,3] },
  { id: 8, name: "Vayishlach", heb: "וישלח", book: "Genesis", start: [32,4], end: [36,43] },
  { id: 9, name: "Vayeshev", heb: "וישב", book: "Genesis", start: [37,1], end: [40,23] },
  { id: 10, name: "Miketz", heb: "מקץ", book: "Genesis", start: [41,1], end: [44,17] },
  { id: 11, name: "Vayigash", heb: "ויגש", book: "Genesis", start: [44,18], end: [47,27] },
  { id: 12, name: "Vayechi", heb: "ויחי", book: "Genesis", start: [47,28], end: [50,26] },

  { id: 13, name: "Shemot", heb: "שמות", book: "Exodus", start: [1,1], end: [6,1] },
  { id: 14, name: "Vaera", heb: "וארא", book: "Exodus", start: [6,2], end: [9,35] },
  { id: 15, name: "Bo", heb: "בוא", book: "Exodus", start: [10,1], end: [13,16] },
  { id: 16, name: "Beshalach", heb: "בשלח", book: "Exodus", start: [13,17], end: [17,16] },
  { id: 17, name: "Yitro", heb: "יתרו", book: "Exodus", start: [18,1], end: [20,23] },
  { id: 18, name: "Mishpatim", heb: "משפטים", book: "Exodus", start: [21,1], end: [24,18] },
  { id: 19, name: "Terumah", heb: "תרומה", book: "Exodus", start: [25,1], end: [27,19] },
  { id: 20, name: "Tetzaveh", heb: "תצוה", book: "Exodus", start: [27,20], end: [30,10] },
  { id: 21, name: "Ki Tisa", heb: "כי תשא", book: "Exodus", start: [30,11], end: [34,35] },
  { id: 22, name: "Vayakhel", heb: "ויקהל", book: "Exodus", start: [35,1], end: [38,20] },
  { id: 23, name: "Pekudei", heb: "פקודי", book: "Exodus", start: [38,21], end: [40,38] },

  { id: 24, name: "Vayikra", heb: "ויקרא", book: "Leviticus", start: [1,1], end: [5,26] },
  { id: 25, name: "Tzav", heb: "צו", book: "Leviticus", start: [6,1], end: [8,36] },
  { id: 26, name: "Shemini", heb: "שמיני", book: "Leviticus", start: [9,1], end: [11,47] },
  { id: 27, name: "Tazria", heb: "תזריע", book: "Leviticus", start: [12,1], end: [13,59] },
  { id: 28, name: "Metzora", heb: "מצורע", book: "Leviticus", start: [14,1], end: [15,33] },
  { id: 29, name: "Acharei Mot", heb: "אחרי מות", book: "Leviticus", start: [16,1], end: [18,30] },
  { id: 30, name: "Kedoshim", heb: "קדושים", book: "Leviticus", start: [19,1], end: [20,27] },
  { id: 31, name: "Emor", heb: "אמור", book: "Leviticus", start: [21,1], end: [24,23] },
  { id: 32, name: "Behar", heb: "בהר", book: "Leviticus", start: [25,1], end: [26,2] },
  { id: 33, name: "Bechukotai", heb: "בחוקותי", book: "Leviticus", start: [26,3], end: [27,34] },

  { id: 34, name: "Bamidbar", heb: "במדבר", book: "Numbers", start: [1,1], end: [4,20] },
  { id: 35, name: "Nasso", heb: "נשא", book: "Numbers", start: [4,21], end: [7,89] },
  { id: 36, name: "Beha'alotecha", heb: "בהעלותך", book: "Numbers", start: [8,1], end: [12,16] },
  { id: 37, name: "Shelach", heb: "שלח", book: "Numbers", start: [13,1], end: [15,41] },
  { id: 38, name: "Korach", heb: "קרח", book: "Numbers", start: [16,1], end: [18,32] },
  { id: 39, name: "Chukat", heb: "חקת", book: "Numbers", start: [19,1], end: [22,1] },
  { id: 40, name: "Balak", heb: "בלק", book: "Numbers", start: [22,2], end: [25,9] },
  { id: 41, name: "Pinchas", heb: "פנחס", book: "Numbers", start: [25,10], end: [30,1] },
  { id: 42, name: "Matot", heb: "מטות", book: "Numbers", start: [30,2], end: [32,42] },
  { id: 43, name: "Masei", heb: "מסעי", book: "Numbers", start: [33,1], end: [36,13] },

  { id: 44, name: "Devarim", heb: "דברים", book: "Deuteronomy", start: [1,1], end: [3,22] },
  { id: 45, name: "Vaetchanan", heb: "ואתחנן", book: "Deuteronomy", start: [3,23], end: [7,11] },
  { id: 46, name: "Eikev", heb: "עקב", book: "Deuteronomy", start: [7,12], end: [11,25] },
  { id: 47, name: "Re'eh", heb: "ראה", book: "Deuteronomy", start: [11,26], end: [16,17] },
  { id: 48, name: "Shoftim", heb: "שופטים", book: "Deuteronomy", start: [16,18], end: [21,9] },
  { id: 49, name: "Ki Teitzei", heb: "כי תצא", book: "Deuteronomy", start: [21,10], end: [25,19] },
  { id: 50, name: "Ki Tavo", heb: "כי תבוא", book: "Deuteronomy", start: [26,1], end: [29,8] },
  { id: 51, name: "Nitzavim", heb: "ניצבים", book: "Deuteronomy", start: [29,9], end: [30,20] },
  { id: 52, name: "Vayelech", heb: "וילך", book: "Deuteronomy", start: [31,1], end: [31,30] },
  { id: 53, name: "Haazinu", heb: "האזינו", book: "Deuteronomy", start: [32,1], end: [32,52] },
  { id: 54, name: "Vezot Haberacha", heb: "וזאת הברכה", book: "Deuteronomy", start: [33,1], end: [34,12] }
];

// Helper: small delay
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchChapter(book, chapter) {
  const url = `https://www.sefaria.org/api/texts/${book}.${chapter}?lang=${LANG}`;
  // console.log("GET", url);
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error fetching ${book} ${chapter}: ${res.status} ${res.statusText} ${txt}`);
  }
  const data = await res.json();
  // data.he = lista hebrea; data.text = lista inglesa
  return data;
}

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/\s+/g,"_").replace(/[^\w_]/g,"");
}

async function buildParasha(parasha) {
  const { id, name, heb, book, start, end } = parasha;
  const chapters = {};
  for (let ch = start[0]; ch <= end[0]; ch++) {
    // fetch chapter data
    let data;
    try {
      data = await fetchChapter(book, ch);
    } catch (err) {
      console.error("Warning:", err.message);
      data = {};
    }

    // choose arrays based on LANG
    // if LANG includes he -> data.he
    // if LANG includes en -> data.text
    // We'll store "he" and/or "text" under chapter->verse
    const hebArr = data.he || [];     // may be undefined
    const engArr = data.text || [];

    // Determine indexes for slice
    const firstIdx = (ch === start[0]) ? (start[1] - 1) : 0;
    const lastIdx = (ch === end[0]) ? end[1] : Math.max(hebArr.length, engArr.length);

    const chapterMap = {};
    for (let i = firstIdx; i < lastIdx; i++) {
      const verseNum = (i + 1).toString();
      const verseObj = {};
      if (LANG.includes("he")) verseObj.he = (i < hebArr.length) ? hebArr[i] : "";
      if (LANG.includes("en")) verseObj.en = (i < engArr.length) ? engArr[i] : "";
      // If only one language requested, store string instead of object for compactness
      if (LANG === "he") {
        chapterMap[verseNum] = verseObj.he || "";
      } else if (LANG === "en") {
        chapterMap[verseNum] = verseObj.en || "";
      } else {
        chapterMap[verseNum] = verseObj;
      }
    }

    // Only add chapter if has verses
    if (Object.keys(chapterMap).length > 0) {
      chapters[ch.toString()] = chapterMap;
    }

    // small sleep to be amable con la API
    await sleep(150);
  }

  return {
    id,
    name,
    hebrewName: heb,
    book,
    range: `${start[0]}:${start[1]}–${end[0]}:${end[1]}`,
    chapters
  };
}

async function main() {
  console.log("Generando parashot en:", OUT_DIR);
  for (const p of PARASHOT) {
    try {
      console.log(`-> Descargando ${p.id.toString().padStart(2,"0")} ${p.name} (${p.book} ${p.start[0]}:${p.start[1]}–${p.end[0]}:${p.end[1]})`);
      const json = await buildParasha(p);
      const fileName = `${p.id.toString().padStart(2,"0")}_${sanitizeFilename(p.name)}.json`;
      const filePath = path.join(OUT_DIR, fileName);
      await fs.writeJson(filePath, json, { spaces: 2, encoding: "utf-8" });
      console.log(`   Guardado: ${fileName}`);
    } catch (err) {
      console.error(`   ERROR en ${p.name}:`, err.message);
    }
  }
  console.log("¡Listo! Revisa la carpeta", OUT_DIR);
}

main().catch(err => {
  console.error("Fatal:", err);
});
