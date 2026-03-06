// src/components/Indice.jsx
import React, { useState } from "react";
import "../styles.css"; // asumimos que ahí pondremos los estilos

const PARASHOT = [
  { name: "Bereshit", pasukCount: 31 },
  { name: "Noach", pasukCount: 35 },
  { name: "Lech-Lecha", pasukCount: 25 },
  { name: "Vayera", pasukCount: 32 },
  { name: "Chayei-Sara", pasukCount: 23 },
  { name: "Toldot", pasukCount: 28 },
  { name: "Vayetzei", pasukCount: 30 },
  { name: "Vayishlach", pasukCount: 33 },
  { name: "Vayeshev", pasukCount: 27 },
  { name: "Miketz", pasukCount: 30 },
  { name: "Vayigash", pasukCount: 28 },
  { name: "Vayechi", pasukCount: 29 },
];

export default function Indice() {
  const [expandedParasha, setExpandedParasha] = useState(null);

  const handleParashaClick = (name) => {
    setExpandedParasha(expandedParasha === name ? null : name);
  };

  const handlePasukClick = (parasha, pasuk) => {
    window.location.hash = `#/parasha/${encodeURIComponent(parasha)}/${pasuk}`;
  };

  return (
    <div className="indice-container">
      <h1 className="indice-title">📖 Índice de Parashot</h1>
      <ul className="parasha-list">
        {PARASHOT.map((p) => (
          <li key={p.name} className="parasha-item">
            <button
              className={`parasha-button ${
                expandedParasha === p.name ? "expanded" : ""
              }`}
              onClick={() => handleParashaClick(p.name)}
            >
              {p.name} {expandedParasha === p.name ? "▲" : "▼"}
            </button>

            {expandedParasha === p.name && (
              <ul className="pasuk-list">
                {Array.from({ length: p.pasukCount }, (_, i) => i + 1).map(
                  (num) => (
                    <li key={num}>
                      <button
                        className="pasuk-button"
                        onClick={() => handlePasukClick(p.name, num)}
                      >
                        Pasuk {num}
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
