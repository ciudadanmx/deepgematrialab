// src/components/Tester.jsx
import { useEffect, useState } from "react";

export default function Tester() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [israel, setIsrael] = useState(false);

  const [absDay, setAbsDay] = useState(null);
  const [parashaName, setParashaName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const cal = await import("../hebcal/jewishCalendar.js");
        const resolver = await import("../hebcal/parashaResolver.js");

        const gDate = new Date(date);

        // ✅ ESTA FUNCIÓN SÍ EXISTE
        const abs = cal.gregorianToAbsolute(gDate);

        // 🔍 SOLO ESTO NOS IMPORTA AHORA
        const p = resolver.resolveParasha(gDate, { israel });

        if (!cancelled) {
          setAbsDay(abs);
          setParashaName(p);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date, israel]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🧪 Tester diagnóstico REAL</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          📅 Fecha:&nbsp;
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={israel}
            onChange={(e) => setIsrael(e.target.checked)}
          />{" "}
          🇮🇱 Israel
        </label>
      </div>

      {loading && <p>⏳ Calculando…</p>}

      {error && (
        <p style={{ color: "crimson" }}>
          ❌ Error: {error}
        </p>
      )}

      {!loading && !error && (
        <div style={{ borderTop: "1px solid #ddd", paddingTop: 12 }}>
          <p>
            <strong>📏 Absolute day:</strong>
          </p>
          <pre>{String(absDay)}</pre>

          <p>
            <strong>📖 Parashá resuelta (STRING):</strong>
          </p>
          <pre>{String(parashaName)}</pre>

          {!parashaName && (
            <p style={{ color: "#a00" }}>
              ⚠️ resolveParasha está devolviendo <code>null</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
