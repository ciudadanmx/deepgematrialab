// src/views/WordView.jsx
import React from "react";
import { computeWordValue, breakdownLetters } from "../utils/gematria";

export default function WordView({ word, onClose }) {
  if (!word) return null;

  const { total } = computeWordValue(word);
  const letters = breakdownLetters(word);

  return (
    <div className="word-screen">
      <div className="word-header">
        <button className="back-btn" onClick={onClose}>
          ← Volver
        </button>
      </div>

      <div className="word-content">
        <h1 className="word-hebrew" dir="rtl">
          {word}
        </h1>

        <div className="gematria-total">
          Guematría: <strong>{total}</strong>
        </div>

        <div className="letters-breakdown">
          {letters.map((l, i) => (
            <div key={i} className="letter-box">
              <div className="letter">{l.letter}</div>
              <div className="value">{l.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
