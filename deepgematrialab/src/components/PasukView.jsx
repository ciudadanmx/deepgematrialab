// src/components/PasukView.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WordModal from "./WordModal";
import { computeWordValue } from "../utils/gematria";
import { normalizeParashaKey } from "../utils/normalizeParasha";
import { PARASHOT_JSON } from "../data/parashot/parashotIndex";
import fondo from "../assets/fondo.png"; // fondo igual que Home
import "../styles.css";

function goFullScreen() {
  const el = document.documentElement; // toda la página
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) { // Safari
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) { // IE/Edge
    el.msRequestFullscreen();
  }
}


// --- Nuevo: tokenizador que preserva etiquetas permitidas y tokeniza por palabras ---
function tokenizeHTMLPreserveTags(html) {
  if (!html) return [];

  const allowed = new Set([
    "small",
    "big",
    "strong",
    "b",
    "i",
    "em",
    "sup",
    "sub",
    "br",
    "span",
  ]);

  // Helper: escape text content
  const escapeText = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const parser = new DOMParser();
  // Envolvemos en un contenedor para parsear fragmentos
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild;
  const tokens = [];

  function walk(node, ancestors) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      // texto: partir en palabras (preservando solo palabras reales)
      const text = node.textContent || "";
      const parts = text.split(/\s+/).filter(Boolean);
      for (const part of parts) {
        // escape del texto y envolver con las etiquetas de los ancestros permitidos
        let token = escapeText(part);
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const tag = ancestors[i];
          // br no envuelve texto; si hubiera br en ancestros no pasa (se maneja como nodo separado)
          token = `<${tag}>${token}</${tag}>`;
        }
        tokens.push(token);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();

      if (tag === "br") {
        // Representamos salto de línea como token especial
        tokens.push("<br/>");
        return;
      }

      const useTag = allowed.has(tag);
      const newAnc = useTag ? ancestors.concat(tag) : ancestors;

      // Recorremos hijos
      for (const child of Array.from(node.childNodes)) {
        walk(child, newAnc);
      }
      return;
    }

    // ignorar otros tipos de nodos
  }

  walk(root, []);
  return tokens;
}

// --- (Opcional) sanitizador simple por si necesitas limpiar fragmentos sueltos ---
function sanitizeTokenHTML(safeHtml) {
  // Los tokens ya salen seguros desde tokenizeHTMLPreserveTags (texto escapado, solo tags permitidos sin atributos).
  // Aquí devolvemos tal cual, pero protegemos contra undefined.
  if (!safeHtml) return "";
  return String(safeHtml);
}

// Sparkles igual que Home
function SparklesCanvas() {
  useEffect(() => {
    const cvs = document.getElementById("sparkles");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let W = (cvs.width = window.innerWidth);
    let H = (cvs.height = window.innerHeight);

    const particles = [];
    const N = 45;
    const rand = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < N; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.6, 2.2),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.05, 0.05),
        alpha: rand(0.2, 0.9),
      });
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(255, 230, 120, 1)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    step();

    const onResize = () => {
      W = cvs.width = window.innerWidth;
      H = cvs.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <canvas id="sparkles" className="sparkles-canvas" />;
}

export default function PasukView({ parashaName: propParashaName, pasukNumber: propPasukNumber, indexRoute = "/parashot", pasukText }) {
  const params = useParams?.() || {};
  const navigate = useNavigate?.() || (() => {});

  const routeParasha = params.parasha;
  const routePasuk = params.pasuk;

  const initialParasha = propParashaName || routeParasha || null;
  const initialPasuk = Number(propPasukNumber ?? routePasuk ?? 1);

  const [currentParashaName, setCurrentParashaName] = useState(initialParasha);
  const [currentPasukNumber, setCurrentPasukNumber] = useState(isNaN(initialPasuk) ? 1 : initialPasuk);
  const [selectedWord, setSelectedWord] = useState(null);

const parashaData = useMemo(() => {
  if (!currentParashaName) return null;

  // si hay key exacta
  if (PARASHOT_JSON[currentParashaName]) return PARASHOT_JSON[currentParashaName];

  // normaliza la entrada (soporta "Lech-Lecha", "lech_lecha", "Lech Lecha", etc)
  const inputKey = normalizeParashaKey(currentParashaName);

  const foundKey = Object.keys(PARASHOT_JSON).find(k => {
    return normalizeParashaKey(k) === inputKey;
  });

  return foundKey ? PARASHOT_JSON[foundKey] : null;
}, [currentParashaName]);

  function collectVerses(node) {
    if (!node) return [];
    if (typeof node === "string") return [node];
    if (Array.isArray(node)) return node.flatMap(collectVerses);
    if (typeof node === "object") return Object.values(node).flatMap(collectVerses);
    return [];
  }

  const flattenedVerses = useMemo(() => {
    if (!parashaData) return [];
    if (Array.isArray(parashaData.verses) && parashaData.verses.every(v => typeof v === "string")) return parashaData.verses;
    if (Array.isArray(parashaData.chapters)) {
      const c = parashaData.chapters.flatMap(ch => Array.isArray(ch.verses) ? ch.verses : collectVerses(ch));
      if (c.length) return c;
    }
    return collectVerses(parashaData);
  }, [parashaData]);

  const totalVerses = flattenedVerses.length;

  useEffect(() => {
    if (initialParasha && initialParasha !== currentParashaName) setCurrentParashaName(initialParasha);
    if (!isNaN(initialPasuk) && initialPasuk !== currentPasukNumber) setCurrentPasukNumber(initialPasuk);
  }, [initialParasha, initialPasuk]);

const pushUrl = (parasha, pasuk) => {
  if (!navigate) return;
  const seg = encodeURIComponent(String(parasha).trim().replace(/\s+/g, "-"));
  const p = pasuk ? `/${pasuk}` : "";
  navigate(`/parasha/${seg}${p}`);
};

  const goToPasuk = (num) => {
    const n = Math.max(1, Math.min(num, totalVerses || num));
    setCurrentPasukNumber(n);
    if (typeof navigate === "function") pushUrl(currentParashaName || "", n);
  };

  const handlePrev = () => goToPasuk(currentPasukNumber - 1);
  const handleNext = () => goToPasuk(currentPasukNumber + 1);
  const handleBackToIndex = () => {
    window.location.hash = "#/indice";
  };

  const currentPasukText = useMemo(() => {
    if (pasukText) return pasukText;
    if (!flattenedVerses || flattenedVerses.length === 0) return null;
    const idx = Math.max(0, Math.min(currentPasukNumber - 1, flattenedVerses.length - 1));
    return flattenedVerses[idx] ?? null;
  }, [flattenedVerses, currentPasukNumber, pasukText]);

  // --- Nuevo: generar "words" respetando etiquetas ---
  const words = useMemo(() => {
    if (!currentPasukText) return [];
    // tokenizeHtml devuelve tokens seguros: palabras con tags permitidos, o "<br/>" tokens
    return tokenizeHTMLPreserveTags(currentPasukText);
  }, [currentPasukText]);

  return (
    <div
      className="app-root"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <SparklesCanvas />

      <div
        className="panel pasuk-container"
        style={{
          margin: "2rem auto",
          maxWidth: 900,
          padding: "2rem",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0, 0, 0, 0.01)",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <strong>{parashaData?.name ?? currentParashaName}</strong>
            {parashaData?.hebrewName && <div style={{ fontSize: 12 }}>{parashaData.hebrewName}</div>}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={handlePrev} disabled={currentPasukNumber <= 1}>← Anterior</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Pasuk</span>
              <input type="number" min={1} max={totalVerses || 9999} value={currentPasukNumber} onChange={e => goToPasuk(Number(e.target.value || 1))} style={{ width: 70 }} />
              <span> / {totalVerses || "?"}</span>
            </div>
            <button onClick={handleNext} disabled={totalVerses ? currentPasukNumber >= totalVerses : false}>Siguiente →</button>
            <button onClick={handleBackToIndex}>Índice</button>
          </div>
        </div>

        <div className="pasuk-line" style={{ lineHeight: 1.6 }}>
          {words.length === 0 ? (
            <p>{currentPasukText ?? "(Pasuk no disponible)"}</p>
          ) : (
            // mostramos las palabras (se invierte para mantener el layout en hebreo si lo tenías así)
            words.slice().reverse().map((w, i) => {
              // w puede ser "<br/>" o un fragmento HTML seguro como "<small>palabra</small>"
              if (w === "<br/>") return <br key={`br-${i}`} />;

              // limpiar tags para la gema (removemos cualquier tag restante)
              const clean = w.replace(/<\/?[^>]+(>|$)/g, "").normalize("NFD").replace(/\p{M}/gu, "");
              const { total } = computeWordValue(clean);

              return (
                <button key={i} className="word-token" onClick={() => setSelectedWord(clean)} title={`Guematría: ${total}`}>
                  <span className="hebrew" dangerouslySetInnerHTML={{ __html: sanitizeTokenHTML(w) }} />
                  <span className="badge">{total}</span>
                </button>
              );
            })
          )}
        </div>

        <button onClick={goFullScreen} style={{ position: "fixed", bottom: 10, right: 10, zIndex: 1000 }}>
        ⬜ Pantalla Completa
        </button>

        <WordModal open={!!selectedWord} word={selectedWord} onClose={() => setSelectedWord(null)} />
      </div>
    </div>
  );
}
