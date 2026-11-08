import { NextResponse } from "next/server";
import { SISTEMA_TIPO } from "@/content/sistema_tipo";

// DEMOSTRACIÓN: de cada guía del Sistema Tipo solo viajan al navegador las 3
// primeras sesiones completas. Del resto se envía únicamente el título.
const SESIONES_DEMO = 3;
const SESIONES_ENTRENADOR = 20;
const SESIONES_EXTRA_ESENCIAL = 5;

function limiteDeSesiones(plan, guia) {
  if (plan === "demo") return Math.min(SESIONES_DEMO, guia.totalSesiones);
  if (plan === "metodologo") return guia.totalSesiones;
  if (plan === "entrenador") return SESIONES_ENTRENADOR;
  const pre = guia.ciclos.find((c) => c.id === "pretemporada");
  const nPre = pre ? pre.semanas.reduce((a, w) => a + w.sesiones.length, 0) : 0;
  return nPre + SESIONES_EXTRA_ESENCIAL;
}

function planMinimoParaSesion(numero, guia) {
  if (numero <= limiteDeSesiones("esencial", guia)) return "esencial";
  if (numero <= limiteDeSesiones("entrenador", guia)) return "entrenador";
  return "metodologo";
}

export async function GET() {
  const plan = "demo";
  const guias = SISTEMA_TIPO.guias.map((guia) => {
    const limite = limiteDeSesiones(plan, guia);
    return {
      id: guia.id,
      nombre: guia.nombre,
      subtitulo: guia.subtitulo,
      sesionesPorSemana: guia.sesionesPorSemana,
      totalSesiones: guia.totalSesiones,
      sesionesDisponibles: limite,
      intro: guia.intro,
      ciclos: guia.ciclos.map((c) => ({
        id: c.id, nombre: c.nombre, subtitulo: c.subtitulo, rango: c.rango,
        semanas: c.semanas.map((w) => {
          const algunaAbierta = w.sesiones.some((s) => s.numero <= limite);
          return {
            numero: w.numero,
            titulo: w.titulo,
            objetivoSemanal: algunaAbierta ? w.objetivoSemanal : "",
            sesiones: w.sesiones.map((s) =>
              s.numero <= limite
                ? s
                : { numero: s.numero, titulo: s.titulo, bloqueada: true, planMinimo: planMinimoParaSesion(s.numero, guia) }
            ),
          };
        }),
      })),
    };
  });

  return NextResponse.json({ plan: "metodologo", demo: true, guias }, { headers: { "Cache-Control": "no-store" } });
}
