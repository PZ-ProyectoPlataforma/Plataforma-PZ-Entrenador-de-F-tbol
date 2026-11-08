"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Botones para subir de plan pagando solo la diferencia.
// tema: "claro" (dentro de la plataforma) u "oscuro" (Mi cuenta).
// minimo: si se indica (p. ej. "metodologo"), solo se ofrecen planes de ese nivel o superior.
const NIVEL = { esencial: 1, entrenador: 2, metodologo: 3 };

export default function SubirPlan({ tema = "claro", minimo }) {
  const [opciones, setOpciones] = useState(null);
  const [elegido, setElegido] = useState(null);
  const [acepta, setAcepta] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const token = async () => (await supabase.auth.getSession()).data?.session?.access_token || "";

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await fetch("/api/subir-plan", { headers: { Authorization: `Bearer ${await token()}` } });
        const data = await res.json().catch(() => ({}));
        if (!vivo) return;
        if (!res.ok) { setOpciones([]); return; }
        setOpciones((data.opciones || []).filter((o) => !minimo || NIVEL[o.plan] >= NIVEL[minimo]));
      } catch {
        if (vivo) setOpciones([]);
      }
    })();
    return () => { vivo = false; };
  }, [minimo]);

  if (!opciones || opciones.length === 0) return null;

  const oscuro = tema === "oscuro";
  const c = {
    texto: oscuro ? "#C9C7BC" : "#4b5563",
    fuerte: oscuro ? "#F3F1E8" : "#0B1F3A",
    borde: oscuro ? "rgba(243,241,232,0.2)" : "#CBD5E1",
    fondoCaja: oscuro ? "#16201A" : "#F5F7FA",
    acento: oscuro ? "#E8A33D" : "#E63946",
    textoAcento: oscuro ? "#0F1611" : "#ffffff",
  };

  const pagar = async () => {
    if (!elegido || !acepta) return;
    setError("");
    setCargando(true);
    try {
      const res = await fetch("/api/subir-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
        body: JSON.stringify({ plan: elegido.plan, aceptaPolitica: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) { window.location.href = data.url; return; }
      setError(data.error || "No se pudo iniciar el pago. Inténtalo de nuevo en unos minutos.");
    } catch {
      setError("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
    }
    setCargando(false);
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opciones.map((o) => {
          const activo = elegido?.plan === o.plan;
          return (
            <button
              key={o.plan}
              type="button"
              onClick={() => { setElegido(o); setError(""); }}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                width: "100%", padding: "13px 16px", borderRadius: 10, cursor: "pointer", font: "inherit",
                fontSize: 14, fontWeight: 700, textAlign: "left",
                border: `2px solid ${activo ? c.acento : c.borde}`,
                background: activo ? c.fondoCaja : "transparent", color: c.fuerte,
              }}
            >
              <span>Subir al plan {o.nombre}</span>
              <span style={{ whiteSpace: "nowrap" }}>{o.texto}</span>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: c.texto, margin: "8px 0 0" }}>
        Pago único. Solo pagas la diferencia con tu plan actual, sin recargo.
      </p>

      {elegido && (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: c.fondoCaja, border: `1px solid ${c.borde}` }}>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, lineHeight: 1.5, color: c.texto, cursor: "pointer" }}>
            <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0 }} />
            <span>
              He leído y acepto la{" "}
              <a href="/politica-de-uso" target="_blank" rel="noopener" style={{ color: c.acento, fontWeight: 700 }}>política de uso</a>
              , incluido que no hay reembolsos.
            </span>
          </label>
          <button
            type="button"
            onClick={pagar}
            disabled={!acepta || cargando}
            style={{
              marginTop: 12, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", font: "inherit",
              fontWeight: 800, fontSize: 14, background: c.acento, color: c.textoAcento,
              opacity: !acepta || cargando ? 0.45 : 1, cursor: !acepta || cargando ? "not-allowed" : "pointer",
            }}
          >
            {cargando ? "Abriendo el pago…" : `Pagar ${elegido.texto} y subir al ${elegido.nombre}`}
          </button>
          {error && <p style={{ color: "#DC2626", fontSize: 13, margin: "10px 0 0" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
