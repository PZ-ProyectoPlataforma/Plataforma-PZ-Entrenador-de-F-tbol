// Reparto del contenido de las 50 sesiones por objetivos y del catálogo de tareas según el plan.
// SOLO se usa desde el servidor: lo que no está incluido en el plan NO viaja al navegador.
import { BLOQUES_OBJETIVOS, SESIONES_OBJETIVOS, SESIONES_POR_PLAN } from "@/content/sesiones_objetivos";
import { CATALOGO_TAREAS } from "@/content/catalogo_tareas";
import { TAREAS_LIBRO } from "@/content/catalogo_libro";

export const PLANES_VALIDOS = ["esencial", "entrenador", "metodologo"];

export function numerosDelPlan(plan) {
  if (plan === "metodologo") return SESIONES_OBJETIVOS.map((s) => s.n);
  return SESIONES_POR_PLAN[plan] || SESIONES_POR_PLAN.esencial;
}

export function planMinimoDeSesion(n) {
  if (SESIONES_POR_PLAN.esencial.includes(n)) return "esencial";
  if (SESIONES_POR_PLAN.entrenador.includes(n)) return "entrenador";
  return "metodologo";
}

function codigosDeSesion(s) {
  return [s.A, s.B, s.C, s.partido, s.definicion, s.calentamiento.rondo, s.calentamiento.tercero, "CAL-01", "VC-01"].filter(Boolean);
}

export function respuestaParaPlan(planPedido) {
  const plan = PLANES_VALIDOS.includes(planPedido) ? planPedido : "esencial";
  const abiertas = new Set(numerosDelPlan(plan));
  const codigos = new Set();
  const bloques = BLOQUES_OBJETIVOS.map((b) => ({
    ...b,
    sesiones: SESIONES_OBJETIVOS.filter((s) => s.bloque === b.n).map((s) => {
      if (!abiertas.has(s.n)) return { n: s.n, bloque: s.bloque, titulo: s.titulo, bloqueada: true, planMinimo: planMinimoDeSesion(s.n) };
      codigosDeSesion(s).forEach((c) => codigos.add(c));
      return s;
    }),
  }));
  // Metodólogo recibe todo el catálogo; los demás, solo las tareas de las sesiones de su plan.
  // Las 45 tareas del libro llegan a los tres planes (no dependen de las sesiones).
  const tareas = [...CATALOGO_TAREAS.filter((t) => plan === "metodologo" || codigos.has(t.codigo)), ...TAREAS_LIBRO];
  return { plan, sesionesDisponibles: abiertas.size, totalSesiones: SESIONES_OBJETIVOS.length, bloques, tareas };
}
