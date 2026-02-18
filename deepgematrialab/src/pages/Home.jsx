// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PasukView from "../components/PasukView";
import fondo from "../assets/fondo.png";
import { getCurrentParasha } from "../hebcal";
import "../styles.css";

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

export default function Home() {
  const [currentParasha, setCurrentParasha] = useState("bereshit");
  const [currentPasuk, setCurrentPasuk] = useState(1);

  // 🔹 Detectar hash de la URL para parashá/pasuk
  useEffect(() => {
    const parseHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/parasha")) {
        const clean = hash.replace("#/parasha", "").replace(/^\/+/, "");
        const parts = clean ? clean.split("/") : [];
        const parashaName = parts[0] || null;
        const pasukNumber = parts[1] ? Number(parts[1]) : 1;

        if (parashaName) {
          setCurrentParasha(decodeURIComponent(parashaName));
          setCurrentPasuk(isNaN(pasukNumber) ? 1 : pasukNumber);
          return;
        }
      }

      // 🔹 Si no hay hash, calculamos parashá actual
      try {
        const parashaData = await getCurrentParasha({ date: new Date(), israel: false });
        if (parashaData?.name) {
          setCurrentParasha(parashaData.name);
          setCurrentPasuk(1);
        }
      } catch (err) {
        console.error("No se pudo resolver la parashá actual", err);
        setCurrentParasha("bereshit");
        setCurrentPasuk(1);
      }
    };

    parseHash();

    const onHashChange = () => parseHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div
      className="app-root"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Header parasha={currentParasha} hebDate="3 Shevat 5786" />
      <SparklesCanvas />

      <main className="main-content">
        <section
          className="panel"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            margin: "2rem auto",
            maxWidth: 900,
            padding: "2rem",
          }}
        >
          <PasukView
            parashaName={currentParasha}
            pasukNumber={currentPasuk}
            indexRoute="/#parashot"
          />
        </section>
      </main>
    </div>
  );
}
