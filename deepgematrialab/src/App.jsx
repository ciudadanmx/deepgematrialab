// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PasukView from "./components/PasukView";
import fondo from "./assets/fondo.png";
import "./styles.css";
import Tester from "./components/Tester";

function SparklesCanvas() {
  useEffect(() => {
    const cvs = document.getElementById("sparkles");
    if (!cvs) return;
    const ctx = cvs.getContext("2d");

    let W = (cvs.width = window.innerWidth);
    let H = (cvs.height = window.innerHeight * 0.75);

    const particles = [];
    const N = 45;

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

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

useEffect(() => {
  const onHashChange = () => setRoute(window.location.hash);
  window.addEventListener("hashchange", onHashChange);
  return () => window.removeEventListener("hashchange", onHashChange);
}, []);

if (route.startsWith("#/tester"))  {
  return <Tester />;
}
  return (
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

      <Header
        parasha="Va'era"
        hebDate="Shemot 6-9 · 3 Shevat 5786"
      />

      <SparklesCanvas />

      <main className="main-content">
        <section className="panel">
          <h2>Parashá — Lectura por pasuk</h2>
          <PasukView
            pasuk={"וַיֹּאמֶר יְהוָה אֶל־מֹשֶׁה כִּי בְעָפָה כִּי גֵדַע"}
          />
        </section>
      </main>
    </div>
  );
}
