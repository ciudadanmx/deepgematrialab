// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PasukView from "./components/PasukView";
import Indice from "./components/Indice.jsx";
import fondo from "./assets/fondo.png";
import "./styles.css";
import WordView from "./views/WordView.jsx";
import { displayFromRouteSegment } from "./utils/normalizeParasha";


// Función para calcular la parashá de hoy
function getParashaOfToday() {
  // Aquí puedes poner tu lógica real o una API
  // Por ahora vamos a usar un array fijo de ejemplo
  const parashot = [
    "Bereshit",
    "Noach",
    "Lech-Lecha",
    "Vayera",
    "Chayei-Sara",
    "Toldot",
    "Vayetzei",
    "Vayishlach",
    "Vayeshev",
    "Miketz",
    "Vayigash",
    "Vayechi",
  ];

  const today = new Date();
  const dayOfYear =
    Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    ) % parashot.length;

  return parashot[dayOfYear];
}

function SparklesCanvas() {
  useEffect(() => {
    const cvs = document.getElementById("sparkles");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");

    let W = (cvs.width = window.innerWidth);
    let H = (cvs.height = window.innerHeight * 0.75);

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
      H = cvs.height = window.innerHeight * 0.75;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <canvas id="sparkles" className="sparkles-canvas" aria-hidden />;
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [selectedWord, setSelectedWord] = useState(null);

  let parashaName = getParashaOfToday(); // La de hoy (string)
let pasukNumber = 1; // siempre arranca en 1

if (route.startsWith("#/parasha")) {
  const clean = route.replace("#/parasha", "").replace(/^\/+/, "");
  const parts = clean ? clean.split("/") : [];

  if (parts[0]) parashaName = displayFromRouteSegment(parts[0]);
  if (parts[1]) pasukNumber = Number(parts[1]) || 1;
}

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // --- ROUTING ---
  if (route.startsWith("#/tester")) {
    return <Tester />;
  }

  // Para home o cualquier #/parasha
  parashaName = getParashaOfToday(); // La de hoy
  pasukNumber = 1; // siempre arranca en 1

  if (route.startsWith("#/parasha")) {
    const clean = route.replace("#/parasha", "").replace(/^\/+/, "");
    const parts = clean ? clean.split("/") : [];

    if (parts[0]) parashaName = decodeURIComponent(parts[0]);
    if (parts[1]) pasukNumber = Number(parts[1]);
  }

  if (route.startsWith("#/indice") || route === "") {
  // mostramos el home / índice de parashot
  return <Indice />;
}

  return (
    <>
    <div
      className="app-root"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="background-layer" />

      <Header parasha={parashaName} hebDate="Shemot 6-9 · 3 Shevat 5786" />

      <SparklesCanvas />

      <main className="main-content">
        <section className="panel">
          <h2>Parashá — Lectura por pasuk</h2>
          <PasukView
  parashaName={parashaName}
  pasukNumber={pasukNumber}
  onWordClick={(w) => setSelectedWord(w)}
/>
        </section>
      </main>
    </div>
    {selectedWord && (
  <WordView
    word={selectedWord}
    onClose={() => setSelectedWord(null)}
  />
)}
    </>
  );
}
