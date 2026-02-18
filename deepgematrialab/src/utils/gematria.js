// src/utils/gematria.js
// Mapping básico (valores estándares). Amplía según necesites.
export const HEBREW_VALUES = {
  'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,
  'י':10,'כ':20,'ך':20,'ל':30,'מ':40,'ם':40,'נ':50,'ן':50,'ס':60,
  'ע':70,'פ':80,'ף':80,'צ':90,'ץ':90,'ק':100,'ר':200,'ש':300,'ת':400
};

export function computeWordValue(word){
  if(!word) return 0;
  let total = 0;
  // eliminar puntuación posible
  const letters = Array.from(word).filter(ch => HEBREW_VALUES[ch] !== undefined);
  letters.forEach(ch => total += HEBREW_VALUES[ch] || 0);
  return { total, letters };
}

// utilidad para mostrar desgloses
export function breakdownLetters(word){
  const letters = Array.from(word).filter(ch => HEBREW_VALUES[ch] !== undefined);
  return letters.map(ch => ({ letter: ch, value: HEBREW_VALUES[ch] || 0 }));
}
