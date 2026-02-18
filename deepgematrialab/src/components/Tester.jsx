// src/components/Tester.jsx
import { useEffect, useState } from "react";
import { PARASHOT, DOUBLES } from "../hebcal/parashaTables.js";
import { PARASHOT_JSON } from "../data/parashot/parashotIndex.js";

export default function Tester() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [israel, setIsrael] = useState(false);

  const [absDay, setAbsDay] = useState(null);
  const [parasha, setParasha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar ejemplo Bereshit
  async function loadExample() {
    setLoading(true);
    setError(null);
    try {
      const example = PARASHOT_JSON["Bereshit"];
      setParasha(example);
    } catch (err) {
      console.error("Error cargando ejemplo:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const cal = await import("../hebcal/jewishCalendar.js");
        const resolver = await import("../hebcal/parashaResolver.js");

        const gDate = new Date(date);
        const abs = cal.gregorianToAbsolute(gDate);

        // Resolver nombre de la parashá
        let name = resolver.resolveParasha(gDate, { israel });
        if (!name) throw new Error("No se pudo resolver la parashá");

        // Revisar si es doble
        let names = [name];
        const double = DOUBLES.find(
          ([a, b]) => `${a}-${b}` === name || name === a || name === b
        );
        if (double) names = double;

        // Cargar JSON de cada parashá
        const parashotData = names.map((n) => {
          const data = PARASHOT_JSON[n];
          if (!data) throw new Error(`No se encontró JSON para ${n}`);
          return data;
        });

        // Marcar doble si corresponde
        const fullParasha =
          parashotData.length > 1
            ? { double: true, parashot: parashotData }
            : parashotData[0];

        if (!cancelled) {
          setAbsDay(abs);
          setParasha(fullParasha);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message);
          setParasha(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date, israel]);

  function renderParashaBody() {
    if (loading) return <p>⏳ Cargando parashá…</p>;

    if (error)
      return (
        <div style={{ color: "crimson" }}>
          <p>Error: {error}</p>
          <button onClick={loadExample}>Cargar ejemplo (Bereshit)</button>
        </div>
      );

    if (!parasha)
      return (
        <div>
          <p>📭 No hay parashá para la fecha seleccionada.</p>
          <button onClick={loadExample}>Mostrar ejemplo (Bereshit)</button>
        </div>
      );

    if (parasha.double && Array.isArray(parasha.parashot)) {
      return (
        <div>
          <h3>📖 Parashá doble</h3>
          {parasha.parashot.map((p, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h4>{p.name}</h4>
              <p>{p.hebrewName ?? ""}</p>
              {p.chapters
                ? Object.entries(p.chapters).map(([ch, verses]) => (
                    <div key={ch} style={{ marginTop: 4 }}>
                      <strong>Capítulo {ch}</strong>
                      <ol>
                        {Object.values(verses).map((v, idx) => (
                          <li
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: v }}
                          />
                        ))}
                      </ol>
                    </div>
                  ))
                : "(Sin capítulos)"}
            </div>
          ))}
        </div>
      );
    }

    if (typeof parasha === "object") {
      return (
        <div>
          <h3>📖 {parasha.name ?? "—"}</h3>
          <p>{parasha.hebrewName ?? ""}</p>
          {parasha.chapters
            ? Object.entries(parasha.chapters).map(([ch, verses]) => (
                <div key={ch} style={{ marginTop: 8 }}>
                  <strong>Capítulo {ch}</strong>
                  <ol>
                    {Object.values(verses).map((v, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: v }} />
                    ))}
                  </ol>
                </div>
              ))
            : "(Sin capítulos)"}
        </div>
      );
    }

    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧪 Tester de Parashot (robusto, local)</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          📅 Fecha:&nbsp;
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={israel}
            onChange={(e) => setIsrael(e.target.checked)}
          />{" "}
          🇮🇱 Israel
        </label>
      </div>

      <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
        <p>
          <strong>📏 Absolute day:</strong>
        </p>
        <pre>{String(absDay)}</pre>

        {renderParashaBody()}
      </div>
    </div>
  );
}
