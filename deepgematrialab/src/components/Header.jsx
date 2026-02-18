// src/components/Header.jsx
import React from 'react';
import './header.css'; // opcional si quieres separar estilos

export default function Header({ parasha = "Parashá de la semana", hebDate = "3 Shevat 5786" }) {
  return (
    <header className="app-header">
      <div className="left">
        <img src="/logo.png" alt="Ciudadan" className="logo" />
      </div>
      <div className="center">
        <div className="parasha-name">{parasha}</div>
      </div>
      <div className="right">
        <div className="heb-date">{hebDate}</div>
      </div>
    </header>
  );
}
