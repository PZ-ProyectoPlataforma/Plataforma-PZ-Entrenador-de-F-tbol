import { NextResponse } from "next/server";
import { BLOQUES_OBJETIVOS, SESIONES_OBJETIVOS } from "@/content/sesiones_objetivos";
import { CATALOGO_TAREAS } from "@/content/catalogo_tareas";
import { TAREAS_LIBRO } from "@/content/catalogo_libro";
import { planMinimoDeSesion } from "@/lib/objetivos";

// DEMOSTRACIÓN: solo viaja al navegador una muestra (2 sesiones completas con sus
// tareas y 4 tareas del libro). Del resto se envía únicamente el título.
const TAREAS_LIBRO_MUESTRA = ["Cfís-01", "PTÉC-11", "PTÉC-21", "PTÁC-31"];

function codigosDeSesion(s) {
  return [s.A, s.B, s.C, s.partido, s.definicion, s.calentamiento?.rondo, s.calentamiento?.tercero, "CAL-01", "VC-01"].filter(Boolean);
}

export async function GET() {
  // Primera sesión del bloque 1 y primera del bloque 5.
  const abiertas = new Set(
    [1, 5].map((b) => SESIONES_OBJETIVOS.find((s) => s.bloque === b)?.n).filter((n) => n != null)
  );
  const codigos = new Set();
  const bloques = BLOQUES_OBJETIVOS.map((b) => ({
    ...b,
    sesiones: SESIONES_OBJETIVOS.filter((s) => s.bloque === b.n).map((s) => {
      if (!abiertas.has(s.n)) return { n: s.n, bloque: s.bloque, titulo: s.titulo, bloqueada: true, planMinimo: planMinimoDeSesion(s.n) };
      codigosDeSesion(s).forEach((c) => codigos.add(c));
      return s;
    }),
  }));
  const tareas = [
    ...CATALOGO_TAREAS.filter((t) => codigos.has(t.codigo)),
    ...TAREAS_LIBRO.filter((t) => TAREAS_LIBRO_MUESTRA.includes(t.codigo)),
  ];
  return NextResponse.json(
    { plan: "metodologo", demo: true, sesionesDisponibles: abiertas.size, totalSesiones: SESIONES_OBJETIVOS.length, bloques, tareas },
    { headers: { "Cache-Control": "no-store" } }
  );
}
