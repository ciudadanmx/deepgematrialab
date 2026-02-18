// src/components/PasukView.jsx
import React, { useState } from 'react';
import WordModal from './WordModal';
import { computeWordValue } from '../utils/gematria';

export default function PasukView({ pasuk = "וַיֹּאמֶר יְהוָֹה אֶל־מֹשֶׁה אַל־תְּ" }) {
  // separa por espacios (ajusta si hay puntuación)
  const words = pasuk.split(/\s+/).filter(Boolean);
  const [selected, setSelected] = useState(null);

  return (
    <div className="pasuk-container">
      <div className="pasuk-line">
        {words.map((w, i) => {
          const { total } = computeWordValue(w);
          return (
            <button
              key={i}
              className="word-token"
              onClick={() => setSelected(w)}
              title={`Guematría: ${total}`}
            >
              <span className="hebrew">{w}</span>
              <span className="badge">{total}</span>
            </button>
          );
        })}
      </div>

      <WordModal open={!!selected} word={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
