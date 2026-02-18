// src/components/PasukView.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WordModal from "./WordModal";
import { computeWordValue } from "../utils/gematria";
import { PARASHOT_JSON } from "../data/parashot/parashotIndex";
import fondo from "../assets/fondo.png"; // fondo igual que Home
import "../styles.css";

function sanitizeTokenHTML(token) {
  if (!token) return "";
  return token.replace(/<\/?[^>]+>/gi, (match) => {
    if (/^<\s*small\s*\/?>$/i.test(match)) return "<small>";
    if (/^<\s*\/\s*small\s*>$/i.test(match)) return "</small>";
    return "";
  });
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
    if (PARASHOT_JSON[currentParashaName]) return PARASHOT_JSON[currentParashaName];
    const normalized = currentParashaName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const foundKey = Object.keys(PARASHOT_JSON).find(k =>
      k.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase() === normalized
    );
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
    const encoded = encodeURIComponent(parasha);
    const p = pasuk ? `/${pasuk}` : "";
    navigate(`/parasha/${encoded}${p}`);
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

  const words = useMemo(() => {
    if (!currentPasukText) return [];
    return currentPasukText.split(/\s+/).filter(Boolean);
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
          borderRadius: "12px", // opcional para redondear
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

        <div className="pasuk-line">
          {words.length === 0 ? (
            <p>{currentPasukText ?? "(Pasuk no disponible)"}</p>
          ) : (
            words.slice().reverse().map((w, i) => {
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

        <WordModal open={!!selectedWord} word={selectedWord} onClose={() => setSelectedWord(null)} />
      </div>
    </div>
  );
}
