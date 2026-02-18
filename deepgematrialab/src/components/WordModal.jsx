// src/components/WordModal.jsx
import React from 'react';
import { breakdownLetters } from '../utils/gematria';

export default function WordModal({ open, word, onClose }) {
  if(!open) return null;
  const breakdown = breakdownLetters(word);
  const total = breakdown.reduce((s,it)=> s + it.value, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3 className="modal-word">{word}</h3>
        <div className="letters-grid">
          {breakdown.map((it, idx) => (
            <div className="letter-cell" key={idx}>
              <div className="letter">{it.letter}</div>
              <div className="value">{it.value}</div>
            </div>
          ))}
        </div>
        <div className="total">
          Guematría total: <strong>{total}</strong>
        </div>
      </div>
    </div>
  );
}
