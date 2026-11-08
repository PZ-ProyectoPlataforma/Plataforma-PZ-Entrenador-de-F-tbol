"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutGrid, Users, Swords, Dumbbell, BookOpen, Settings, Calendar,
  BarChart3, Search, ChevronRight, Plus, X, Trash2, Save, Edit3,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Menu, ChevronLeft,
  Shield, Target, Activity, Clock, MapPin, Star, Eye, Printer,
  FileText, Brain, Zap, ClipboardList, Lock, HelpCircle
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import SubirPlan from "@/components/SubirPlan";

/* ============================================================
   PZ · Puntualización Zonal — Plataforma de gestión de equipo
   Tokens de diseño
   navy      #0B1F3A  estructural
   navy2     #142A4E  superficies oscuras
   red       #E63946  énfasis
   green     #2A9D5C  campo / positivo
   yellow    #F4B400  advertencia / amarillas
   redLight  #FF6B6B  incidencias / negativo
   bg        #F5F7FA  fondo
   ============================================================ */

const T = {
  navy: "#0B1F3A", navy2: "#142A4E", navy3: "#1D3A66",
  red: "#E63946", green: "#2A9D5C", yellow: "#F4B400",
  redLight: "#FF6B6B", bg: "#F5F7FA", surface: "#FFFFFF",
  text: "#141C2B", muted: "#5B6B82", line: "#E4E8EF",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const calcAge = (dob) => {
  if (!dob) return "-";
  const d = new Date(dob), n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--;
  return a;
};

/* ---------------- Default config & demo data ---------------- */

const DEFAULT_CONFIG = {
  teamName: "CD Puntualización Zonal",
  logo: null,
  brandColor: "",
  category: "Juvenil A",
  season: "2026/2027",
  footballType: "Fútbol 11",
  colors: { primary: T.navy, accent: T.red },
  positions: ["Portero", "Defensa Central", "Lateral Derecho", "Lateral Izquierdo",
    "Mediocentro Defensivo", "Mediocentro", "Mediocentro Ofensivo",
    "Extremo Derecho", "Extremo Izquierdo", "Delantero Centro"],
  tacticalSystems: {
    "Fútbol 11": ["1-4-3-3", "1-4-4-2", "1-4-2-3-1", "1-3-5-2", "1-3-4-3"],
    "Fútbol 8": ["1-3-2-2", "1-3-3-1", "1-2-3-2", "1-2-2-3"],
  },
  trainingTypes: ["Físico", "Técnico", "Táctico", "Estratégico", "Psicológico"],
  foundations: {
    "Físicos": ["Resistencia", "Fuerza", "Velocidad", "Potencia", "Agilidad", "Coordinación", "Movilidad", "Recuperación"],
    "Técnicos": ["Control", "Conducción", "Regate", "Pase", "Golpeo", "Remate", "Juego aéreo", "Protección del balón", "Dominio del balón"],
    "Tácticos": ["Ataque", "Defensa", "Transición ofensiva", "Transición defensiva", "Balón parado ofensivo", "Balón parado defensivo"],
    "Psicológicos": ["Concentración", "Comunicación", "Cohesión", "Motivación", "Responsabilidad", "Toma de decisiones", "Actitud"],
  },
  playerStates: ["Disponible", "Lesionado", "En recuperación", "Sancionado", "Ausente temporal", "Baja", "Otro"],
  taskCategories: ["Calentamiento", "Parte principal", "Vuelta a la calma", "Técnico", "Táctico", "Físico", "Psicológico"],
  rankingWeights: {
    actitud: 10,
    goles: 10,
    asistencias: 5,
    decisiones: 10,
    lectura: 5,
    asistenciaEntreno: 10,
    instrucciones: 5,
    tarjetas: -10,
    liderazgo: 5,
    tecnica: 15,
    velocidad: 7,
    fuerza: 6,
    elasticidad: 5,
    resistencia: 7,
  },
  customFields: [],
};

const DEMO_PLAYERS = [
  { nombre: "Álvaro Ruiz Gómez", apodo: "Álvaro", numero: 1, posicion: "Portero", secundarias: [], dob: "2008-03-12", pie: "Diestro", altura: 183, peso: 76, estado: "Disponible" },
  { nombre: "Mario Castillo Peña", apodo: "Mario", numero: 4, posicion: "Defensa Central", secundarias: ["Mediocentro Defensivo"], dob: "2008-06-02", pie: "Zurdo", altura: 181, peso: 74, estado: "Disponible" },
  { nombre: "Diego Herrera Soto", apodo: "Diego", numero: 5, posicion: "Defensa Central", secundarias: [], dob: "2007-11-20", pie: "Diestro", altura: 186, peso: 79, estado: "Sancionado" },
  { nombre: "Iván Molina Lara", apodo: "Iván", numero: 2, posicion: "Lateral Derecho", secundarias: ["Extremo Derecho"], dob: "2008-01-15", pie: "Diestro", altura: 174, peso: 68, estado: "Disponible" },
  { nombre: "Pablo Navarro Ríos", apodo: "Pablo", numero: 3, posicion: "Lateral Izquierdo", secundarias: [], dob: "2008-09-08", pie: "Zurdo", altura: 176, peso: 70, estado: "Disponible" },
  { nombre: "Hugo Delgado Vidal", apodo: "Hugo", numero: 6, posicion: "Mediocentro Defensivo", secundarias: ["Defensa Central"], dob: "2007-07-30", pie: "Diestro", altura: 178, peso: 72, estado: "Lesionado" },
  { nombre: "Marcos Ferrer Nuño", apodo: "Marcos", numero: 8, posicion: "Mediocentro", secundarias: ["Mediocentro Ofensivo"], dob: "2008-04-18", pie: "Diestro", altura: 175, peso: 69, estado: "Disponible" },
  { nombre: "Nico Ortega Blas", apodo: "Nico", numero: 10, posicion: "Mediocentro Ofensivo", secundarias: ["Extremo Izquierdo"], dob: "2008-02-25", pie: "Zurdo", altura: 172, peso: 66, estado: "Disponible" },
  { nombre: "Bruno Salas Marín", apodo: "Bruno", numero: 7, posicion: "Extremo Derecho", secundarias: [], dob: "2009-05-11", pie: "Diestro", altura: 170, peso: 63, estado: "Disponible" },
  { nombre: "Rubén Campos Iglesias", apodo: "Rubén", numero: 11, posicion: "Extremo Izquierdo", secundarias: [], dob: "2008-08-03", pie: "Zurdo", altura: 173, peso: 65, estado: "Disponible" },
  { nombre: "Adrián Vega Torres", apodo: "Adrián", numero: 9, posicion: "Delantero Centro", secundarias: [], dob: "2007-12-14", pie: "Diestro", altura: 182, peso: 75, estado: "Disponible" },
  { nombre: "Leo Aranda Cid", apodo: "Leo", numero: 13, posicion: "Portero", secundarias: [], dob: "2009-01-09", pie: "Diestro", altura: 180, peso: 73, estado: "Disponible" },
  { nombre: "Sergio Muñoz Prat", apodo: "Sergio", numero: 12, posicion: "Defensa Central", secundarias: [], dob: "2008-05-22", pie: "Diestro", altura: 184, peso: 77, estado: "Disponible" },
  { nombre: "Aitor Lozano Sanz", apodo: "Aitor", numero: 14, posicion: "Lateral Derecho", secundarias: [], dob: "2008-10-11", pie: "Diestro", altura: 173, peso: 67, estado: "Disponible" },
  { nombre: "Gonzalo Serra Roig", apodo: "Gonzalo", numero: 15, posicion: "Lateral Izquierdo", secundarias: [], dob: "2009-02-17", pie: "Zurdo", altura: 175, peso: 68, estado: "Disponible" },
  { nombre: "Raúl Pardo Esteve", apodo: "Raúl", numero: 16, posicion: "Mediocentro Defensivo", secundarias: [], dob: "2008-07-04", pie: "Diestro", altura: 177, peso: 71, estado: "Sancionado" },
  { nombre: "Óscar Bravo Camino", apodo: "Óscar", numero: 17, posicion: "Mediocentro", secundarias: ["Mediocentro Ofensivo"], dob: "2008-03-29", pie: "Zurdo", altura: 174, peso: 69, estado: "Disponible" },
  { nombre: "Javier Cano Ibáñez", apodo: "Javi", numero: 18, posicion: "Extremo Derecho", secundarias: [], dob: "2009-06-06", pie: "Diestro", altura: 169, peso: 62, estado: "Disponible" },
  { nombre: "Dani Rey Folch", apodo: "Dani", numero: 19, posicion: "Extremo Izquierdo", secundarias: [], dob: "2008-11-27", pie: "Zurdo", altura: 171, peso: 64, estado: "Disponible" },
  { nombre: "Carlos Mendoza Puig", apodo: "Carlos", numero: 20, posicion: "Delantero Centro", secundarias: [], dob: "2008-01-30", pie: "Diestro", altura: 185, peso: 78, estado: "Disponible" },
];

function buildDemoPlayers() {
  return DEMO_PLAYERS.map((p) => ({
    id: uid(),
    nombre: p.nombre, apodo: p.apodo, numero: p.numero,
    posicion: p.posicion, secundarias: p.secundarias,
    categoria: DEFAULT_CONFIG.category, dob: p.dob, pie: p.pie,
    altura: p.altura, peso: p.peso, estado: p.estado,
    fechaIncorporacion: "2026-07-01", observaciones: "",
    manualRating: null,
    attrs: {
      actitud: Math.floor(Math.random() * 4) + 6,
      decisiones: Math.floor(Math.random() * 4) + 5,
      lectura: Math.floor(Math.random() * 4) + 5,
      instrucciones: Math.floor(Math.random() * 3) + 7,
      liderazgo: Math.floor(Math.random() * 5) + 4,
      tecnica: Math.floor(Math.random() * 4) + 5,
      velocidad: Math.floor(Math.random() * 4) + 5,
      fuerza: Math.floor(Math.random() * 4) + 5,
      elasticidad: Math.floor(Math.random() * 4) + 5,
      resistencia: Math.floor(Math.random() * 4) + 5,
    },
    stats: {
      convocatorias: Math.floor(Math.random() * 10) + 3,
      titular: Math.floor(Math.random() * 8) + 1,
      suplente: Math.floor(Math.random() * 4),
      minutos: Math.floor(Math.random() * 800) + 100,
      goles: p.posicion.includes("Delantero") || p.posicion.includes("Extremo") ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2),
      asistencias: Math.floor(Math.random() * 5),
      amarillas: Math.floor(Math.random() * 4),
      rojas: Math.random() > 0.9 ? 1 : 0,
      valoraciones: Array.from({ length: 6 }, () => +(5.5 + Math.random() * 3.5).toFixed(1)),
      entrenamientosRealizados: Math.floor(Math.random() * 20) + 10,
      entrenamientosTotales: 24,
    },
    custom: {},
    pruebasFisicas: [
      {
        id: uid(), fecha: "2026-08-05",
        velocidad20m: +(3.0 + Math.random() * 0.6).toFixed(2),
        velocidadZigzag20m: +(4.2 + Math.random() * 0.8).toFixed(2),
        controlBalon: Math.floor(20 + Math.random() * 60),
        vo2max: Math.floor(42 + Math.random() * 12),
        abdominalesMin: Math.floor(30 + Math.random() * 20),
        flexionesMin: Math.floor(20 + Math.random() * 20),
        golpeoDistancia: +(25 + Math.random() * 15).toFixed(1),
        flexibilidad: [-2, -1, 0, 1, 2, 3][Math.floor(Math.random() * 6)],
        observaciones: "Test inicial de pretemporada.",
      },
    ],
  }));
}

function buildDemoMatches(players) {
  const DEMO_LINEUP_1433 = [
    { x: 50, y: 92 },
    { x: 18, y: 72 }, { x: 40, y: 76 }, { x: 60, y: 76 }, { x: 82, y: 72 },
    { x: 30, y: 52 }, { x: 50, y: 48 }, { x: 70, y: 52 },
    { x: 22, y: 24 }, { x: 50, y: 16 }, { x: 78, y: 24 },
  ];
  const rivales = ["CF Montealto", "UD San Rafael", "Atlético Vega", "Real Costa", "EF Norte"];
  const scores = [[3, 0], [1, 1], [2, 3], [1, 2], [2, 1]];
  const sistema = "1-4-3-3";
  return rivales.map((rival, i) => {
    const esLocal = i % 2 === 0;
    const [gf, gc] = scores[i];
    const disponibles = players.filter((p) => p.estado === "Disponible");
    const noDisponibles = players.filter((p) => p.estado !== "Disponible");
    const convocados = disponibles.slice(0, 18);
    const noConvocados = [...disponibles.slice(18), ...noDisponibles];
    const titulares = convocados.slice(0, 11);
    const suplentes = convocados.slice(11);
    const capitan = players.find((p) => p.numero === 4) || convocados[1];
    const golePos = ["Delantero Centro", "Extremo Derecho", "Extremo Izquierdo", "Mediocentro Ofensivo"];
    const goleadores = convocados.filter((p) => golePos.includes(p.posicion));
    const goles = Array.from({ length: gf }, (_, gIdx) => {
      const autor = goleadores[gIdx % goleadores.length] || titulares[gIdx % titulares.length];
      const asistente = titulares[(gIdx + 3) % titulares.length];
      return { id: uid(), minuto: 12 + gIdx * 19, jugadorId: autor.id, asistenciaId: asistente.id !== autor.id ? asistente.id : null };
    });
    const sale = titulares[9], entra = suplentes[0];
    return {
      id: uid(),
      fecha: `2026-0${9 + Math.floor(i / 3)}-1${i}`,
      competicion: "Liga",
      jornada: i + 1,
      rival, esLocal,
      campo: esLocal ? "Campo Municipal PZ" : `Campo de ${rival}`,
      resultadoDescanso: `${Math.floor(gf / 2)}-${Math.floor(gc / 2)}`,
      resultadoFinal: `${gf}-${gc}`,
      tipoFutbol: "Fútbol 11",
      sistema,
      convocatoria: [
        ...convocados.map((p) => ({ jugadorId: p.id, estado: "Convocado" })),
        ...noConvocados.map((p) => ({ jugadorId: p.id, estado: p.estado === "Lesionado" ? "Lesionado" : p.estado === "Sancionado" ? "Sancionado" : "No convocado" })),
      ],
      capitanId: capitan.id,
      vestimenta: { camiseta: esLocal ? "Rojo" : "Blanco", pantaloneta: "Negro", medias: "Rojo" },
      alineacion: titulares.map((p, idx) => ({ x: DEMO_LINEUP_1433[idx]?.x ?? 50, y: DEMO_LINEUP_1433[idx]?.y ?? 50, jugadorId: p.id })),
      cambios: entra ? [{ id: uid(), minuto: 68, saleId: sale.id, entraId: entra.id }] : [],
      goles,
      tarjetas: [{ id: uid(), minuto: 55, jugadorId: titulares[3].id, tipo: "Amarilla" }],
      tactica: { modelo: "Presión alta y salida en corto", funciono: "Circulación en primera fase", noFunciono: "Pérdida de profundidad en banda", ajustes: "Cambio a 1-4-4-2 en el minuto 60" },
      rendimiento: {
        ataque: 7, defensa: 6, transicionOfensiva: 7, transicionDefensiva: 6,
        balonParadoOfensivo: 5, balonParadoDefensivo: 6,
        fortalezas: "Buena presión tras pérdida", debilidades: "Concesión de espacios a la espalda",
      },
      valoracionesJugadores: Object.fromEntries(titulares.map((p) => [p.id, 5 + Math.floor(Math.random() * 5)])),
      aprendizajes: { mantener: "Intensidad en el presing", corregir: "Cobertura defensiva en transición", trabajar: "Salida de balón bajo presión" },
      observaciones: "Buen partido en líneas generales. Revisar bloque medio para el próximo encuentro.",
    };
  });
}

/* Nombre de la sesión: se arma solo a partir del número, la semana y los objetivos cargados,
   así el entrenador no tiene que escribirlo aparte. */
function sessionDisplayName(t) {
  const parts = [];
  if (t.numeroSesion) parts.push(`Sesión ${t.numeroSesion}`);
  if (t.semana) parts.push(`Semana ${t.semana}`);
  const header = parts.join(" · ") || "Sesión de entrenamiento";
  const map = [["fisicos", "Físico"], ["tecnicos", "Técnico"], ["tacticos", "Táctico"], ["estrategicos", "Estratégico"], ["psicologicos", "Psicológico"]];
  const objLabels = map.filter(([k]) => (t.objetivos?.[k] || "").trim()).map(([, label]) => label);
  return objLabels.length ? `${header} — ${objLabels.join(", ")}` : header;
}

function buildDemoTrainings(players) {
  const OBJETIVOS_POR_SESION = [
    { fisicos: "Resistencia aeróbica de base", tecnicos: "Pase y control orientado", tacticos: "Salida de balón en 3 líneas", estrategicos: "Córner al primer palo", psicologicos: "Comunicación entre líneas" },
    { fisicos: "Velocidad y cambios de ritmo", tecnicos: "Conducción y regate en espacio reducido", tacticos: "", estrategicos: "", psicologicos: "" },
    { fisicos: "", tecnicos: "Centro y definición", tacticos: "Ocupación de espacios en el área", estrategicos: "", psicologicos: "Confianza en el remate" },
    { fisicos: "Fuerza y potencia en el salto", tecnicos: "", tacticos: "Presión tras pérdida", estrategicos: "Saque de banda largo", psicologicos: "" },
    { fisicos: "", tecnicos: "", tacticos: "Repliegue defensivo organizado", estrategicos: "Falta lateral directa", psicologicos: "Concentración en los últimos minutos" },
  ];
  const SEMANAS = [4, 4, 5, 5, 6];
  return Array.from({ length: 5 }, (_, i) => {
    const asistencia = players.map((p, idx) => ({ jugadorId: p.id, estado: p.estado === "Lesionado" ? "Lesionado" : (idx === (i + 2) % players.length ? "No asiste" : "Asiste") }));
    return {
      id: uid(),
      numeroSesion: String(i + 1),
      semana: String(SEMANAS[i]),
      fecha: `2026-08-${10 + i}`, hora: "19:00", lugar: "Campo Municipal PZ",
      duracion: 90, numJugadores: asistencia.filter((a) => a.estado === "Asiste").length,
      objetivos: OBJETIVOS_POR_SESION[i],
      calentamiento: {
        tareas: [{ id: uid(), libraryTaskId: null, nombre: "Movilidad articular + rondo 4v1", codigo: "CAL-0" + (i + 1), objetivo: "Activación general", fundamento: "Primer contacto con balón", materiales: "Conos, petos", tiempo: 15, jugadores: 5, espacio: "10x10m", reglas: "2 toques", organizacion: "Círculo con 1 defensor central", descripcion: "Rondo con apoyos exteriores y movilidad previa", notas: "" }],
        actividad: "Movilidad articular + rondos 4v1", objetivo: "Activación y primer contacto con el balón", materiales: "Conos, petos", tiempo: 15, notas: "Intensidad progresiva.",
      },
      tareas: [
        { id: uid(), libraryTaskId: null, nombre: "Rondo posicional 6v3", codigo: "TEC-04", objetivo: "Conservación de balón", fundamento: "Pase, control orientado", materiales: "Conos, petos", tiempo: 20, jugadores: 9, espacio: "15x15m", reglas: "2 toques máximo", organizacion: "Círculo con 3 defensores centrales", descripcion: "Rondo con apoyos exteriores", notas: "" },
        { id: uid(), libraryTaskId: null, nombre: "Circuito de velocidad y cambios de ritmo", codigo: "FIS-02", objetivo: "Velocidad y agilidad", fundamento: "Técnica de carrera", materiales: "Conos, vallas", tiempo: 15, jugadores: 12, espacio: "30m lineales", reglas: "Series de 4x30m", organizacion: "Filas paralelas", descripcion: "Circuito de esprines con cambios de dirección", notas: "" },
      ],
      aplicacionJuego: {
        tareas: [
          { id: uid(), libraryTaskId: null, nombre: "Partido condicionado 8v8 a 2 toques", codigo: "PC-0" + (i + 1), objetivo: "Circulación rápida y amplitud", fundamento: "Pase y toma de decisiones", materiales: "Petos, porterías", tiempo: 20, jugadores: 16, espacio: "Medio campo", reglas: "Máximo 2 toques", organizacion: "8v8 en campo reducido", descripcion: "Partido condicionado con transiciones rápidas", notas: "" },
          { id: uid(), libraryTaskId: null, nombre: "Juego real 11v11", codigo: "JR-0" + (i + 1), objetivo: "Aplicación del modelo de juego", fundamento: "Integración táctica", materiales: "Petos, porterías", tiempo: 15, jugadores: 22, espacio: "Campo completo", reglas: "Sin restricciones", organizacion: "11v11", descripcion: "Juego libre para fijar los automatismos trabajados", notas: "" },
        ],
        tipo: "Partido condicionado", objetivo: "Transición ofensiva rápida", tiempo: 35, observaciones: "8v8 en campo reducido con transiciones, luego juego real para fijar conceptos.",
      },
      vueltaCalma: {
        tareas: [{ id: uid(), libraryTaskId: null, nombre: "Estiramiento global guiado", codigo: "VC-0" + (i + 1), objetivo: "Recuperación", fundamento: "Flexibilidad", materiales: "Colchonetas", tiempo: 10, jugadores: 20, espacio: "Círculo central", reglas: "-", organizacion: "Círculo grupal", descripcion: "Estiramiento guiado por el cuerpo técnico", notas: "" }],
        estiramientos: "Estiramiento global", actividad: "Movilidad pasiva", tiempo: 10, observaciones: "Grupo receptivo, buena disposición al cierre.",
        balonParado: [{ id: uid(), libraryTaskId: null, nombre: "Córner al primer palo", codigo: "BP-0" + (i + 1), objetivo: "Definición de jugada ensayada", fundamento: "Balón parado ofensivo", materiales: "Balones, porterías", tiempo: 10, jugadores: 11, espacio: "Área de penal", reglas: "-", organizacion: "Jugadores en posiciones fijas", descripcion: "Repetición de córner ensayado al primer palo", notas: "" }],
      },
      notas: "Sesión con buena intensidad general; revisar la concentración en el último cuarto de hora.",
      asistencia,
    };
  });
}

function buildDemoRivals() {
  return [
    { id: uid(), nombre: "CF Montealto", sistemas: "1-4-4-2", fortalezas: "Juego aéreo en balón parado, laterales ofensivos", debilidades: "Pérdida de intensidad tras el minuto 70", jugadoresRelevantes: "9 - Delantero centro, referencia física", ofensivo: "Ataques directos por banda derecha", defensivo: "Línea de 4 alta con fuera de juego provocado", transiciones: "Rápidas al espacio tras robo", balonParado: "Central alto en córners, primer palo", observaciones: "Suelen presionar arriba en el saque de puerta.", historial: "1 enfrentamiento previo: victoria 3-0." },
    { id: uid(), nombre: "UD San Rafael", sistemas: "1-4-3-3", fortalezas: "Posesión y circulación en campo propio", debilidades: "Vulnerable a la presión alta tras pérdida", jugadoresRelevantes: "10 - Mediocentro organizador", ofensivo: "Construcción en corto desde portero", defensivo: "Bloque medio, presión por zonas", transiciones: "Lentas, priorizan la posesión", balonParado: "Jugadas ensayadas de córner al segundo palo", observaciones: "Rival exigente técnicamente, cuidar pérdidas en salida.", historial: "1 enfrentamiento previo: empate 1-1." },
    { id: uid(), nombre: "Atlético Vega", sistemas: "1-4-2-3-1", fortalezas: "Intensidad física y duelos individuales", debilidades: "Poca precisión en el último pase", jugadoresRelevantes: "8 - Mediocentro box-to-box muy físico", ofensivo: "Transiciones rápidas tras recuperación en campo propio", defensivo: "Presión hombre a hombre en campo contrario", transiciones: "Muy rápidas, buscan el contragolpe directo", balonParado: "Lanzadores potentes, disparo directo de falta", observaciones: "Equipo físicamente exigente; cuidar segundas jugadas.", historial: "1 enfrentamiento previo: derrota 2-3." },
    { id: uid(), nombre: "Real Costa", sistemas: "1-4-4-2", fortalezas: "Solidez defensiva y juego directo", debilidades: "Poca circulación de balón en salida", jugadoresRelevantes: "5 - Central zurdo, buen juego aéreo", ofensivo: "Balones largos a la espalda de la defensa", defensivo: "Bloque bajo muy compacto", transiciones: "Directas, saltan líneas con pase largo", balonParado: "Especialistas en saques de banda largos como centro", observaciones: "Rival incómodo por su planteamiento defensivo; paciencia en la circulación.", historial: "1 enfrentamiento previo: derrota 1-2 (como visitante)." },
  ];
}

function buildDemoSeason() {
  return {
    equipo: DEFAULT_CONFIG.teamName, categoria: DEFAULT_CONFIG.category, competicion: "Liga Regional Juvenil",
    localidad: "",
    fechaInicio: "2026-08-01", fechaFin: "2027-06-15",
    objetivosGenerales: "Consolidar un modelo de juego propio basado en la posesión con propósito y la presión coordinada tras pérdida.",
    objetivosDeportivos: "Finalizar entre los 3 primeros puestos de la categoría.",
    objetivosFormativos: "Desarrollar la toma de decisiones individual y la polivalencia posicional de los jugadores.",
    weeks: Array.from({ length: 4 }, (_, i) => ({
      id: uid(), numero: i + 1, fechaInicio: `2026-08-${String(4 + i * 7).padStart(2, "0")}`,
      objetivo: ["Adaptación física inicial", "Introducción del modelo de juego", "Consolidación de la fase ofensiva", "Trabajo de fase defensiva y transiciones"][i],
      contenidoFisico: "Resistencia aeróbica de base", contenidoTecnico: "Pase y control orientado",
      contenidoTactico: "Salida de balón en tres líneas", contenidoPsicologico: "Cohesión grupal",
      cargaPrevista: ["Media", "Media-alta", "Alta", "Media"][i],
    })),
    cuerpoTecnico: [],
  };
}

const DEFAULT_SEASON_PLANNING = {
  pretemporada: { fechaInicio: "", fechaFin: "", objetivos: "", dias: [], amistosos: [] },
  mensual: [],
  macrociclo: [],
  partidoNoProgramado: [],
  torneoRapido: [],
};

const DEFAULT_PLANNING = {
  fisica: [
    { id: uid(), fecha: "2026-08-10", capacidad: "Resistencia", carga: 6, observaciones: "Trabajo aeróbico de base, semana de adaptación." },
    { id: uid(), fecha: "2026-08-17", capacidad: "Velocidad", carga: 7, observaciones: "Series cortas con cambios de dirección." },
  ],
  tecnica: [
    { id: uid(), fundamento: "Pase", objetivo: "Mejorar precisión en pase largo", nivelActual: 6, nivelObjetivo: 8, tareas: "Rondo posicional 6v3", evolucion: [6, 6.4, 6.8] },
    { id: uid(), fundamento: "Remate", objetivo: "Definición dentro del área", nivelActual: 5, nivelObjetivo: 7, tareas: "Finalización tras centro", evolucion: [5, 5.3, 5.6] },
  ],
  tactica: [
    { id: uid(), nombre: "Salida de balón 1-4-3-3", sistema: "1-4-3-3", modelo: "Posesión con propósito", principios: "Amplitud, profundidad, apoyos", fase: "Ofensiva", faseOfensiva: "Construcción en 3 líneas", faseDefensiva: "Presión media-alta por zonas", transiciones: "Recuperación inmediata (5s)", balonParado: "Córner al primer palo", comportamientos: "Basculación coordinada de línea defensiva", slots: [] },
  ],
  psicologica: [
    { id: uid(), fecha: "2026-08-12", area: "Cohesión", observaciones: "Dinámica grupal en pretemporada, buena respuesta del grupo." },
  ],
};

const DEFAULT_STANDINGS = {
  posicion: null, totalEquipos: null, puntos: null,
  jugados: null, ganados: null, empatados: null, perdidos: null,
  golesFavor: null, golesContra: null,
  casa: { jugados: null, ganados: null, empatados: null, perdidos: null },
  fuera: { jugados: null, ganados: null, empatados: null, perdidos: null },
  enlace: "", actualizadoEl: null,
  cercanos: { lider: { nombre: "", puntos: null }, sup: { nombre: "", puntos: null }, inf: { nombre: "", puntos: null } },
};

const TIPO_EJERCICIO = ["Vacío", "Ejercicio integral", "Ejercicio analítico", "Ejercicio sistémico"];
const ZONA_TRABAJO = ["Vacío", "Calentamiento o regenerativo", "Aeróbica extensiva", "Aeróbica intensiva", "Umbral o zona mixta", "Anaeróbica", "Velocidad máxima"];
const FASE_JUEGO = ["Vacío", "Iniciación", "Creación en cobertura", "Creación ofensiva", "Finalización"];
const MOMENTO_JUEGO = ["Vacío", "Defensa", "Ataque", "Transición defensiva", "Transición ataque"];
const TIPO_TAREA = ["Actividades lúdicas", "Ruedas de pase", "Rondos", "Espacios reducidos", "Juegos de posición", "Circuito", "Situaciones tácticas de juego y táctica fija", "Partidos condicionados", "Juego real"];

const DEMO_TASKS = [
  { id: uid(), nombre: "Rondo posicional 6v3", codigo: "TEC-04", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Rondos", edad: "Juvenil", minJugadores: 9, maxJugadores: 9, espacio: "15x15m", duracion: 20, objFisico: "Resistencia", objTecnico: "Pase, control orientado", objTactico: "Conservación", objPsicologico: "Comunicación", materiales: "Conos, petos", descripcion: "Rondo con 6 jugadores exteriores y 3 defensores en el centro.", reglas: "2 toques máximo", movimientosObservar: "Orientación corporal antes de recibir; apoyos en diagonal; velocidad de circulación del balón.", observaciones: "" },
  { id: uid(), nombre: "Presión tras pérdida 8v8", codigo: "TAC-11", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 16, maxJugadores: 16, espacio: "40x30m", duracion: 20, objFisico: "Potencia", objTecnico: "Entrada, cobertura", objTactico: "Transición ofensiva/defensiva", objPsicologico: "Toma de decisiones", materiales: "Conos, petos, porterías", descripcion: "Juego 8v8 con objetivo de recuperación en menos de 5 segundos tras pérdida.", reglas: "Recuperar en 5s o el rival juega libre", movimientosObservar: "Basculación del bloque tras la pérdida; distancia entre líneas; agresividad en el primer contacto.", observaciones: "", videoUrl: "https://www.youtube.com/watch?v=exUDedqdidE" },
  { id: uid(), nombre: "Circuito de velocidad y cambios de ritmo", codigo: "FIS-02", categoria: "Físico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Velocidad máxima", faseJuego: "Iniciación", momentoJuego: "Ataque", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 4, maxJugadores: 20, espacio: "30m lineales", duracion: 15, objFisico: "Velocidad, agilidad", objTecnico: "", objTactico: "", objPsicologico: "Concentración", materiales: "Conos, vallas", descripcion: "Circuito de esprines con cambios de dirección.", reglas: "Series de 4x30m", movimientosObservar: "Técnica de carrera; ángulo de apoyo en cambios de dirección; recuperación entre series.", observaciones: "" },
  { id: uid(), nombre: "Movilidad articular y activación general", codigo: "CAL-01", categoria: "Calentamiento", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 10, maxJugadores: 22, espacio: "Medio campo", duracion: 15, objFisico: "Activación articular y muscular progresiva", objTecnico: "Primer contacto con el balón", objTactico: "", objPsicologico: "Concentración inicial del grupo", materiales: "Conos, petos, balones", descripcion: "Trote suave con movilidad de tobillos, rodillas y cadera, seguido de un rondo 4v1 de baja intensidad para el primer contacto con el balón.", reglas: "2 toques máximo en el rondo final", movimientosObservar: "Amplitud de movimiento en las articulaciones; postura correcta en los desplazamientos; actitud y concentración del grupo.", observaciones: "Ideal como primer bloque de cualquier sesión." },
  { id: uid(), nombre: "Posesión 7v7 más 3 comodines", codigo: "TAC-15", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 17, maxJugadores: 17, espacio: "35x25m", duracion: 20, objFisico: "Resistencia a la intensidad intermitente", objTecnico: "Pase y control bajo presión", objTactico: "Superioridad numérica y ocupación de espacios", objPsicologico: "Paciencia en la circulación del balón", materiales: "Conos, petos de 3 colores, balones", descripcion: "Dos equipos de 7 jugadores más 3 comodines que juegan siempre con el equipo en posesión, generando superioridad numérica constante.", reglas: "Los comodines solo pueden dar 1 toque", movimientosObservar: "Apoyos en diagonal de los comodines; amplitud del equipo con balón; presión coordinada del equipo sin balón.", observaciones: "Variante: reducir a 2 toques para todos si se domina bien la tarea." },
  { id: uid(), nombre: "Finalización tras centro lateral", codigo: "TEC-09", categoria: "Técnico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Espacios reducidos", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 12, espacio: "Área y medialuna", duracion: 20, objFisico: "Potencia en el salto y el remate", objTecnico: "Centro y definición de cabeza o volea", objTactico: "Ocupación de espacios en el área (primer palo, segundo palo, punto de penalti)", objPsicologico: "Decisión y confianza en el remate", materiales: "Conos, balones, porterías", descripcion: "Los extremos centran alternando desde banda derecha e izquierda; los delanteros y mediocentros ofensivos atacan el área en oleadas para definir.", reglas: "Máximo 2 toques antes de rematar", movimientosObservar: "Timing de llegada al área; ocupación de las 3 zonas de remate; calidad y altura del centro.", observaciones: "Rotar las posiciones de centrador y rematador cada 5 minutos." },
  { id: uid(), nombre: "Vuelta a la calma con estiramiento guiado", codigo: "VC-01", categoria: "Vuelta a la calma", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 10, maxJugadores: 22, espacio: "Círculo central", duracion: 10, objFisico: "Recuperación y vuelta a la calma progresiva", objTecnico: "", objTactico: "", objPsicologico: "Cierre grupal y reflexión sobre la sesión", materiales: "Colchonetas o toallas", descripcion: "Trote suave de 2 minutos seguido de estiramiento estático guiado por el cuerpo técnico en círculo, cerrando con una breve puesta en común de la sesión.", reglas: "-", movimientosObservar: "Calidad del estiramiento (sin rebotes); actitud de escucha en el cierre grupal.", observaciones: "Aprovechar el cierre para dar feedback breve del entrenamiento." },
];

const NUEVAS_TAREAS_2025 = [
  { id: uid(), nombre: "Activación para el partido", codigo: "CAL-02", categoria: "Calentamiento", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 10, maxJugadores: 22, espacio: "Medio campo", duracion: 12, objFisico: "Activación neuromuscular de corta duración, sin fatiga", objTecnico: "Toques cortos y precisos con balón", objTactico: "Simulación de las primeras acciones del partido", objPsicologico: "Concentración y activación mental previa a la competición", materiales: "Conos, petos, balones", descripcion: "Trote progresivo, movilidad dinámica y 3-4 series cortas de aceleración (10-15m). Se cierra con un rondo rápido 4v1 a un toque durante 3 minutos.", reglas: "Máximo 1 toque en el rondo final", movimientosObservar: "Intensidad progresiva; calidad del primer contacto; energía y comunicación del grupo antes de salir al campo.", observaciones: "Debe realizarse entre 20 y 30 minutos antes del inicio del partido, nunca generando fatiga." },
  { id: uid(), nombre: "Calentamiento con balón por parejas", codigo: "CAL-03", categoria: "Calentamiento", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Iniciación", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 10, maxJugadores: 22, espacio: "Medio campo", duracion: 15, objFisico: "Activación articular progresiva", objTecnico: "Pase, control y golpeo con las dos piernas", objTactico: "", objPsicologico: "Comunicación por parejas", materiales: "Balones (uno por pareja), conos", descripcion: "Por parejas, pases cortos progresando en distancia, control orientado, pase con el exterior, golpeo a media distancia y por último algunos remates suaves a portería.", reglas: "Progresar la distancia solo cuando la técnica sea correcta", movimientosObservar: "Postura corporal al golpear; uso de ambas piernas; calidad del primer contacto.", observaciones: "Ideal como segundo bloque tras la movilidad articular general." },
  { id: uid(), nombre: "Movilidad dinámica sin balón", codigo: "CAL-04", categoria: "Calentamiento", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 8, maxJugadores: 22, espacio: "Medio campo", duracion: 10, objFisico: "Movilidad articular y elongación dinámica de cadena posterior y anterior", objTecnico: "", objTactico: "", objPsicologico: "Activación grupal", materiales: "Ninguno", descripcion: "Desplazamientos en línea recta con skipping, talones a glúteo, zancada lateral, apertura y cierre de cadera, y carrera progresiva final.", reglas: "Trabajo en parejas o en filas, sin material", movimientosObservar: "Amplitud del movimiento; postura de tronco erguida; progresión correcta de intensidad.", observaciones: "Recomendado como primer bloque de cualquier sesión, antes del trabajo con balón." },
  { id: uid(), nombre: "Rondo de activación a dos toques", codigo: "CAL-05", categoria: "Calentamiento", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Calentamiento o regenerativo", faseJuego: "Iniciación", momentoJuego: "Ataque", tipoTarea: "Rondos", edad: "Todas", minJugadores: 5, maxJugadores: 6, espacio: "10x10m", duracion: 10, objFisico: "Activación cardiovascular progresiva de baja-media intensidad", objTecnico: "Pase y control orientado", objTactico: "Conservación básica del balón", objPsicologico: "Comunicación y primeros acuerdos del grupo", materiales: "Conos, petos, balones", descripcion: "Rondo 4v1 en espacio reducido a dos toques máximo, aumentando progresivamente el ritmo de circulación del balón.", reglas: "2 toques máximo; el defensor rota cada 2 minutos", movimientosObservar: "Calidad del primer contacto; orientación corporal antes de recibir; comunicación verbal entre compañeros.", observaciones: "" },
  { id: uid(), nombre: "Rondo simple 4v1", codigo: "RON-01", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Rondos", edad: "Formativo/Juvenil", minJugadores: 5, maxJugadores: 5, espacio: "8x8m", duracion: 15, objFisico: "Resistencia intermitente de corta duración", objTecnico: "Pase, control orientado, protección del balón", objTactico: "Conservación bajo presión", objPsicologico: "Concentración y comunicación constante", materiales: "Conos, petos, balones", descripcion: "Rondo clásico 4 jugadores exteriores contra 1 defensor central, en espacio reducido.", reglas: "2 toques máximo; el defensor rota tras 3 recuperaciones", movimientosObservar: "Orientación corporal antes de recibir; distancia entre apoyos; velocidad de circulación.", observaciones: "" },
  { id: uid(), nombre: "Rondo con apoyo 5v2 + comodín", codigo: "RON-02", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Rondos", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 8, espacio: "12x12m", duracion: 18, objFisico: "Resistencia a esfuerzos intermitentes", objTecnico: "Pase con precisión bajo presión, control orientado", objTactico: "Superioridad numérica y apoyos en diagonal", objPsicologico: "Toma de decisiones rápida", materiales: "Conos, petos de 2 colores, balones", descripcion: "5 jugadores exteriores más 1 comodín que siempre juega con el equipo en posesión, contra 2 defensores centrales.", reglas: "2 toques máximo; el comodín juega a 1 toque", movimientosObservar: "Apoyos en diagonal del comodín; amplitud de los exteriores; presión coordinada de los 2 defensores.", observaciones: "" },
  { id: uid(), nombre: "Rondo con apoyo y comodín central", codigo: "RON-03", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Rondos", edad: "Juvenil/Senior", minJugadores: 7, maxJugadores: 7, espacio: "14x14m", duracion: 18, objFisico: "Resistencia a la intensidad intermitente", objTecnico: "Pase y control orientado hacia el pivote", objTactico: "Uso del tercer hombre y del pivote de espaldas a la presión", objPsicologico: "Paciencia en la circulación", materiales: "Conos, petos, balones", descripcion: "6 jugadores exteriores más 1 comodín fijo en el centro, contra 2 defensores. El comodín puede jugar hacia cualquier lado y busca siempre recibir de espaldas a la presión.", reglas: "El comodín juega a 1 toque; los exteriores a 2 toques", movimientosObservar: "Apertura del comodín para recibir; velocidad de giro tras el control; ángulos de pase hacia el pivote.", observaciones: "" },
  { id: uid(), nombre: "Rondo con apoyos exteriores y presión", codigo: "RON-04", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Rondos", edad: "Juvenil/Senior", minJugadores: 9, maxJugadores: 9, espacio: "15x15m", duracion: 20, objFisico: "Potencia y capacidad de presión repetida", objTecnico: "Pase rápido bajo presión intensa", objTactico: "Presión coordinada tras pérdida", objPsicologico: "Agresividad y comunicación en la presión", materiales: "Conos, petos de 3 colores, balones", descripcion: "6 exteriores con apoyo en las esquinas contra 3 defensores que presionan de forma coordinada buscando la recuperación en menos de 6 segundos.", reglas: "Si el equipo defensor recupera en menos de 6 segundos, cambia el trío que defiende", movimientosObservar: "Coordinación de la presión en trío; distancias de basculación; velocidad de reacción tras la pérdida.", observaciones: "" },
  { id: uid(), nombre: "Rueda de pase con definición a mini portería A", codigo: "RUE-01", categoria: "Técnico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Ruedas de pase", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 10, espacio: "20x15m", duracion: 15, objFisico: "Velocidad de desplazamiento corto", objTecnico: "Pase, control orientado y definición a portería pequeña", objTactico: "Ocupación de espacios de finalización", objPsicologico: "Decisión y confianza en la definición", materiales: "Conos, balones, 2 mini porterías", descripcion: "Los jugadores rotan por estaciones de pase en rueda y el último de la secuencia recibe y define a mini portería.", reglas: "Máximo 2 toques antes de definir", movimientosObservar: "Calidad del pase de asistencia; timing de llegada a la definición; precisión del remate.", observaciones: "" },
  { id: uid(), nombre: "Rueda de pase con definición a mini portería B", codigo: "RUE-02", categoria: "Técnico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Ruedas de pase", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 10, espacio: "20x15m", duracion: 15, objFisico: "Velocidad gestual en la definición", objTecnico: "Control orientado y definición de primeras (a un toque)", objTactico: "Ocupación de espacios de finalización desde banda", objPsicologico: "Confianza en la definición rápida", materiales: "Conos, balones, 2 mini porterías", descripcion: "Variante de la rueda anterior: el pase de asistencia llega desde banda y el rematador debe definir a un toque a la mini portería.", reglas: "Definición obligatoria a 1 toque", movimientosObservar: "Ángulo de aproximación del rematador; calidad y altura del centro; contacto en la definición.", observaciones: "" },
  { id: uid(), nombre: "Rueda de pase con desdoblamiento", codigo: "RUE-03", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Ruedas de pase", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 12, espacio: "25x20m", duracion: 18, objFisico: "Resistencia a esfuerzos repetidos con cambios de ritmo", objTecnico: "Pase, control y apoyo en profundidad", objTactico: "Desdoblamiento del jugador tras el pase para generar una nueva línea de pase", objPsicologico: "Anticipación y timing de la carrera", materiales: "Conos, balones", descripcion: "Tras entregar el balón, el jugador realiza un desdoblamiento por detrás o por delante del receptor para ofrecer una nueva opción de pase en profundidad.", reglas: "El desdoblamiento debe iniciarse inmediatamente después del pase", movimientosObservar: "Timing de la carrera de desdoblamiento; calidad del pase en profundidad; sincronización entre el que pasa y el que recibe.", observaciones: "" },
  { id: uid(), nombre: "Rueda de pase continua en rombo", codigo: "RUE-04", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Ruedas de pase", edad: "Formativo/Juvenil", minJugadores: 4, maxJugadores: 8, espacio: "15x15m", duracion: 15, objFisico: "Resistencia aeróbica de base", objTecnico: "Pase y control con ambas piernas", objTactico: "Circulación continua y ocupación ordenada de posiciones", objPsicologico: "Concentración sostenida", materiales: "Conos, balones", descripcion: "Cuatro jugadores forman un rombo y el balón circula de forma continua siguiendo un patrón fijo, incorporando un segundo balón cuando el grupo domine el ejercicio.", reglas: "2 toques máximo; rotar de posición cada 2 minutos", movimientosObservar: "Calidad del pase; ritmo constante de circulación; ocupación correcta del rombo tras cada rotación.", observaciones: "" },
  { id: uid(), nombre: "Fútbol tenis", codigo: "LUD-01", categoria: "Técnico", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Todas", minJugadores: 4, maxJugadores: 12, espacio: "Medio campo (dividido con red o cinta)", duracion: 15, objFisico: "Coordinación, salto y golpeo aéreo", objTecnico: "Golpeo de precisión con distintas superficies (cabeza, empeine, muslo)", objTactico: "Anticipación de trayectorias", objPsicologico: "Competitividad sana y concentración", materiales: "Red o cinta elástica, balones", descripcion: "Por parejas o tríos, se juega un partido de tenis pero con el balón de fútbol, sin dejarlo caer al suelo más de una vez, pasándolo por encima de la red.", reglas: "Máximo 2 toques por equipo antes de pasar el balón al otro lado", movimientosObservar: "Control de la trayectoria del balón; variedad de superficies de golpeo; lectura anticipada del bote.", observaciones: "" },
  { id: uid(), nombre: "Pañuelo con balón", codigo: "LUD-02", categoria: "Físico", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Velocidad máxima", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Formativo", minJugadores: 8, maxJugadores: 20, espacio: "Medio campo", duracion: 12, objFisico: "Velocidad de reacción y aceleración", objTecnico: "Control orientado en carrera", objTactico: "", objPsicologico: "Reacción a estímulo y atención", materiales: "Balones, un pañuelo o peto", descripcion: "Dos equipos enfrentados; al llamar un número, los jugadores correspondientes de cada equipo salen a buscar el balón situado en el centro y deben conducirlo a su campo sin ser tocados.", reglas: "El que toca al rival antes de que controle el balón gana el punto", movimientosObservar: "Tiempo de reacción al estímulo; velocidad de arranque; control del balón en carrera a máxima velocidad.", observaciones: "" },
  { id: uid(), nombre: "Relevos con conducción", codigo: "LUD-03", categoria: "Técnico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Anaeróbica", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Actividades lúdicas", edad: "Formativo/Juvenil", minJugadores: 8, maxJugadores: 20, espacio: "20m lineales por equipo", duracion: 12, objFisico: "Velocidad y capacidad de repetir esfuerzos cortos", objTecnico: "Conducción con cambios de dirección", objTactico: "", objPsicologico: "Espíritu de equipo y competitividad", materiales: "Conos, balones", descripcion: "Equipos en fila realizan un circuito de conducción con cambios de dirección entre conos, entregando el balón al siguiente compañero como en una carrera de relevos.", reglas: "El balón no puede alejarse más de 1 metro del jugador", movimientosObservar: "Control del balón a alta velocidad; calidad en los cambios de dirección; entrega rápida al compañero.", observaciones: "" },
  { id: uid(), nombre: "Balón torre (rey del campo)", codigo: "LUD-04", categoria: "Táctico", tipoEjercicio: "Ejercicio integral", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Vacío", momentoJuego: "Ataque", tipoTarea: "Actividades lúdicas", edad: "Formativo/Juvenil", minJugadores: 6, maxJugadores: 16, espacio: "Medio campo dividido en zonas", duracion: 15, objFisico: "Resistencia y desplazamientos variados", objTecnico: "Pase y control bajo presión moderada", objTactico: "Ocupación de espacio y protección de zona propia", objPsicologico: "Manejo de la frustración ante la pérdida", materiales: "Conos para delimitar zonas, balones, petos", descripcion: "Cada equipo defiende su zona de conos ('torre'); ganan un punto si logran mantener la posesión dentro de su zona durante un tiempo determinado sin que el rival la toque.", reglas: "3 toques máximo dentro de la zona propia", movimientosObservar: "Ocupación ordenada del espacio propio; presión coordinada sobre la zona rival; toma de decisiones bajo presión de tiempo.", observaciones: "" },
  { id: uid(), nombre: "Espacio reducido 4v4 con presión tras pérdida", codigo: "ESP-01", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Espacios reducidos", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 8, espacio: "25x20m", duracion: 18, objFisico: "Potencia y capacidad de presión inmediata", objTecnico: "Control orientado y protección del balón bajo presión", objTactico: "Presión inmediata tras pérdida (5 segundos)", objPsicologico: "Agresividad mental tras la pérdida del balón", materiales: "Conos, petos, 4 porterías pequeñas o balizas", descripcion: "Juego 4v4 en espacio reducido con doble portería por lado; al perder el balón, el equipo debe presionar de inmediato para intentar recuperarlo antes de 5 segundos.", reglas: "Si no se recupera en 5s, se retira un jugador temporalmente en desventaja", movimientosObservar: "Velocidad de reacción tras la pérdida; distancia de presión al balón; comunicación para cerrar espacios.", observaciones: "" },
  { id: uid(), nombre: "3v3 más comodines con transición rápida", codigo: "ESP-02", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación ofensiva", momentoJuego: "Transición ataque", tipoTarea: "Espacios reducidos", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 8, espacio: "20x15m", duracion: 18, objFisico: "Velocidad de reacción y aceleración corta", objTecnico: "Control y pase en espacio reducido bajo presión", objTactico: "Transición ofensiva inmediata tras la recuperación", objPsicologico: "Rapidez de decisión", materiales: "Conos, petos, balones", descripcion: "3v3 con 2 comodines exteriores; al recuperar el balón, el equipo debe intentar una transición rápida hacia uno de los dos objetivos antes de que el rival se organice.", reglas: "El equipo que recupera tiene 8 segundos para atacar el objetivo", movimientosObservar: "Velocidad de la primera acción tras la recuperación; apoyo de los comodines; toma de decisiones en espacio reducido.", observaciones: "" },
  { id: uid(), nombre: "Espacio reducido con reacción a estímulo", codigo: "ESP-03", categoria: "Físico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Velocidad máxima", faseJuego: "Iniciación", momentoJuego: "Vacío", tipoTarea: "Espacios reducidos", edad: "Formativo/Juvenil", minJugadores: 6, maxJugadores: 10, espacio: "15x15m", duracion: 15, objFisico: "Velocidad de reacción ante estímulo visual o auditivo", objTecnico: "Control orientado inmediato tras la señal", objTactico: "Lectura rápida del juego tras el estímulo", objPsicologico: "Atención sostenida", materiales: "Conos, petos de colores, silbato", descripcion: "Juego de posesión en espacio reducido donde, al sonido del silbato o al levantar un peto de un color, los jugadores deben ejecutar una acción específica indicada previamente (ej. cambiar de dirección, presionar, buscar profundidad).", reglas: "La reacción debe ser inmediata al estímulo, sin detener el juego", movimientosObservar: "Tiempo de respuesta al estímulo; calidad de la acción ejecutada bajo presión de tiempo; atención mantenida durante todo el ejercicio.", observaciones: "" },
  { id: uid(), nombre: "2v2 con apoyos y salida rápida", codigo: "ESP-04", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación ofensiva", momentoJuego: "Transición ataque", tipoTarea: "Espacios reducidos", edad: "Juvenil/Senior", minJugadores: 4, maxJugadores: 6, espacio: "12x10m", duracion: 15, objFisico: "Aceleración y capacidad de repetir esfuerzos explosivos", objTecnico: "Conducción y pase en la salida rápida", objTactico: "Aprovechamiento inmediato del espacio libre tras ganar el duelo", objPsicologico: "Decisión rápida en superioridad momentánea", materiales: "Conos, petos, balones", descripcion: "2v2 con un apoyo exterior por equipo; en cuanto un equipo gana la posesión, debe buscar la salida rápida hacia el campo abierto antes de que el rival se reorganice.", reglas: "El apoyo exterior solo puede dar 1 toque", movimientosObservar: "Velocidad de salida tras ganar el balón; uso del apoyo exterior; ocupación del espacio libre.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición 5v5+3 a un toque", codigo: "POS-01", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 13, maxJugadores: 13, espacio: "30x25m", duracion: 20, objFisico: "Resistencia a la intensidad media constante", objTecnico: "Pase y control de primeras (1 toque)", objTactico: "Mantener el control del balón mediante superioridad posicional", objPsicologico: "Paciencia y precisión bajo exigencia técnica", materiales: "Conos, petos de 2 colores, balones", descripcion: "5 contra 5 más 3 comodines que juegan siempre a favor del equipo en posesión, con el objetivo de mantener el control del balón a un toque.", reglas: "Un toque obligatorio para todos los jugadores", movimientosObservar: "Calidad del primer y único contacto; anticipación en el apoyo; ocupación ordenada de espacios.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición 4v4+2 a máximo dos toques", codigo: "POS-02", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Formativo/Juvenil", minJugadores: 10, maxJugadores: 10, espacio: "25x20m", duracion: 18, objFisico: "Resistencia intermitente", objTecnico: "Pase, control orientado a 2 toques", objTactico: "Conservación del balón y ocupación de espacios libres", objPsicologico: "Comunicación constante entre compañeros", materiales: "Conos, petos, balones", descripcion: "4 contra 4 más 2 comodines que ayudan siempre al equipo con balón, jugando con un límite de 2 toques por jugador.", reglas: "Máximo 2 toques; los comodines pueden jugar libremente", movimientosObservar: "Orientación corporal antes de recibir; ocupación de espacios libres; velocidad de circulación del balón.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición de alta intensidad 6v6", codigo: "POS-03", categoria: "Físico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 12, maxJugadores: 12, espacio: "20x18m", duracion: 15, objFisico: "Potencia e intensidad intermitente elevada", objTecnico: "Pase rápido bajo presión constante", objTactico: "Conservación bajo presión intensa y organizada", objPsicologico: "Tolerancia a la fatiga y competitividad", materiales: "Conos, petos, balones", descripcion: "6 contra 6 en espacio reducido para su número de jugadores, exigiendo un ritmo de juego muy alto y presión constante sobre el balón.", reglas: "2 toques máximo; series de 3 minutos con descanso activo de 1 minuto", movimientosObservar: "Intensidad de la presión sobre el poseedor; capacidad de mantener la calidad técnica bajo fatiga; recuperación entre series.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición de alta intensidad con transición inmediata", codigo: "POS-04", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 12, maxJugadores: 14, espacio: "25x20m", duracion: 18, objFisico: "Capacidad de esfuerzo repetido a máxima intensidad", objTecnico: "Pase y control bajo presión intensa", objTactico: "Transición defensiva inmediata tras la pérdida del balón", objPsicologico: "Agresividad mental y concentración sostenida", materiales: "Conos, petos de 2 colores, balones", descripcion: "Juego de posesión de alta exigencia donde, en el instante de la pérdida, todo el equipo debe activar una presión inmediata y coordinada para recuperar el balón en menos de 6 segundos.", reglas: "Si no se recupera en 6s, se juega un contraataque libre para el equipo rival", movimientosObservar: "Velocidad de activación de la presión colectiva; coordinación de las líneas; intensidad mantenida durante toda la serie.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición de alta intensidad con superioridad numérica", codigo: "POS-05", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 10, maxJugadores: 12, espacio: "25x20m", duracion: 18, objFisico: "Resistencia a esfuerzos intermitentes de alta intensidad", objTecnico: "Pase preciso en situación de superioridad", objTactico: "Aprovechamiento de la superioridad numérica para progresar", objPsicologico: "Decisión rápida ante ventaja posicional", materiales: "Conos, petos, balones", descripcion: "Se juega en superioridad numérica constante (por ejemplo 6v4) con alta exigencia de ritmo, buscando aprovechar la ventaja para progresar y no solo para conservar el balón.", reglas: "El equipo en superioridad tiene un límite de 6 segundos para progresar tras recibir", movimientosObservar: "Uso de la superioridad para progresar (no solo conservar); velocidad de circulación; ocupación de espacios de progresión.", observaciones: "" },
  { id: uid(), nombre: "Juego de posición con porteros en doble área", codigo: "POS-06", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Juegos de posesión", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Dos áreas + círculo central", duracion: 20, objFisico: "Resistencia a la intensidad media-alta", objTecnico: "Pase, control y definición con apoyo del portero", objTactico: "Uso del portero como jugador extra en la salida de balón", objPsicologico: "Confianza en la circulación desde el propio portero", materiales: "Conos, petos, balones, 2 porterías", descripcion: "Juego de posesión disputado entre las dos áreas del campo (doble área), incluyendo a los dos porteros como jugadores de apoyo en la circulación y salida de balón.", reglas: "El portero solo puede jugar dentro de su área; máximo 2 toques fuera de ella", movimientosObservar: "Participación activa del portero en la circulación; calidad de la salida de balón desde atrás; ocupación de las dos áreas.", observaciones: "" },
  { id: uid(), nombre: "Transición ofensiva directa tras recuperación", codigo: "TAC-20", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Transición ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 12, maxJugadores: 16, espacio: "Medio campo", duracion: 20, objFisico: "Velocidad y potencia en la primera acción tras recuperar", objTecnico: "Pase directo en profundidad, definición", objTactico: "Transición ofensiva directa (contraataque rápido)", objPsicologico: "Decisión rápida en superioridad momentánea", materiales: "Conos, petos, balones, porterías", descripcion: "Al recuperar el balón, el equipo busca de inmediato la profundidad con el menor número de pases posible, atacando el espacio libre antes de que el rival se reorganice.", reglas: "Máximo 4 pases antes de definir tras la recuperación", movimientosObservar: "Velocidad de la primera acción; calidad del pase en profundidad; ocupación del espacio libre por los atacantes.", observaciones: "" },
  { id: uid(), nombre: "Transición ofensiva elaborada con conservación", codigo: "TAC-21", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación ofensiva", momentoJuego: "Transición ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Campo completo", duracion: 22, objFisico: "Resistencia a esfuerzos prolongados", objTecnico: "Pase y control bajo presión moderada", objTactico: "Transición ofensiva elaborada (conservación y progresión ordenada)", objPsicologico: "Paciencia en la progresión", materiales: "Conos, petos, balones, porterías", descripcion: "Tras recuperar el balón, el equipo prioriza conservar la posesión y progresar de forma ordenada, evitando la pérdida antes de intentar generar una ocasión de gol.", reglas: "Mínimo 6 pases antes de poder finalizar", movimientosObservar: "Calidad de la circulación bajo presión; paciencia colectiva; ocupación ordenada del campo durante la progresión.", observaciones: "" },
  { id: uid(), nombre: "Transición defensiva directa (repliegue rápido)", codigo: "TAC-22", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Campo completo", duracion: 20, objFisico: "Velocidad de repliegue y resistencia a esfuerzos repetidos", objTecnico: "Marcaje y cobertura en carrera", objTactico: "Repliegue rápido y recomposición de líneas tras perder el balón", objPsicologico: "Concentración y disciplina táctica", materiales: "Conos, petos, balones, porterías", descripcion: "Al perder el balón en campo rival, el equipo debe replegarse rápidamente para recomponer sus líneas defensivas antes de que el rival llegue a zona de finalización.", reglas: "El equipo rival tiene un tiempo limitado para intentar el contraataque directo", movimientosObservar: "Velocidad de repliegue de los jugadores más adelantados; distancias entre líneas al recomponer; comunicación defensiva durante el repliegue.", observaciones: "" },
  { id: uid(), nombre: "Transición defensiva elaborada (basculación y cobertura)", codigo: "TAC-23", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia a esfuerzos intermitentes", objTecnico: "Marcaje, cobertura e interceptación", objTactico: "Basculación ordenada del bloque y coberturas escalonadas", objPsicologico: "Comunicación y lectura colectiva del juego", materiales: "Conos, petos, balones, porterías", descripcion: "Tras la pérdida, el equipo prioriza mantener el orden defensivo, basculando de forma escalonada y cubriéndose entre líneas antes de intentar la recuperación del balón.", reglas: "No se permite la presión individual descoordinada; debe ser siempre en cobertura", movimientosObservar: "Coordinación de la basculación; distancia y cobertura entre líneas; paciencia para no romper el orden defensivo.", observaciones: "" },
  { id: uid(), nombre: "Salida de balón en construcción elaborada", codigo: "TAC-24", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Iniciación", momentoJuego: "Ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia y movilidad en la construcción", objTecnico: "Pase corto y control orientado bajo presión inicial", objTactico: "Salida de balón organizada desde el propio portero y defensas", objPsicologico: "Serenidad ante la presión inicial del rival", materiales: "Conos, petos, balones, porterías", descripcion: "El equipo construye el juego desde atrás con apoyo del portero, buscando superar la primera línea de presión rival mediante pases cortos y movimientos de apoyo.", reglas: "El portero debe participar activamente en al menos el 50% de las salidas", movimientosObservar: "Apertura de los centrales; apoyo del pivote; serenidad para no despejar bajo presión.", observaciones: "" },
  { id: uid(), nombre: "Contraataque directo tras robo", codigo: "TAC-25", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Velocidad máxima", faseJuego: "Finalización", momentoJuego: "Transición ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 10, maxJugadores: 14, espacio: "Medio campo y área", duracion: 18, objFisico: "Velocidad máxima y potencia en la carrera de ataque", objTecnico: "Conducción a velocidad y definición", objTactico: "Ataque directo con el menor número de jugadores posible tras el robo", objPsicologico: "Decisión valiente e inmediata", materiales: "Conos, balones, porterías", descripcion: "Tras un robo de balón provocado, 2 o 3 jugadores atacan directamente hacia portería contra una defensa en inferioridad, buscando definir lo más rápido posible.", reglas: "Máximo 6 segundos desde el robo hasta el remate", movimientosObservar: "Velocidad de ejecución; toma de decisión en superioridad numérica; calidad de la definición bajo presión de tiempo.", observaciones: "" },
  { id: uid(), nombre: "Repliegue defensivo tras pérdida en campo rival", codigo: "TAC-26", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 16, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia a esfuerzos repetidos de alta intensidad", objTecnico: "Marcaje y presión en carrera de vuelta", objTactico: "Repliegue intenso y presión inmediata sobre el que conduce el contraataque", objPsicologico: "Determinación y sacrificio colectivo", materiales: "Conos, petos, balones, porterías", descripcion: "Simulando una pérdida en zona de ataque, el equipo debe replegarse a máxima velocidad y presionar al conductor del contraataque rival antes de que llegue a zona de finalización.", reglas: "El equipo rival ataca siempre en superioridad para exigir el repliegue", movimientosObservar: "Velocidad de vuelta de los jugadores más adelantados; presión sobre el conductor del balón; recomposición del bloque defensivo.", observaciones: "" },
  { id: uid(), nombre: "Transición ofensiva-defensiva combinada (juego de posiciones)", codigo: "TAC-27", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Creación en cobertura", momentoJuego: "Transición ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 16, maxJugadores: 18, espacio: "Campo completo", duracion: 25, objFisico: "Resistencia general al esfuerzo intermitente prolongado", objTecnico: "Pase, control y definición en ambas transiciones", objTactico: "Alternancia constante entre transición ofensiva y defensiva según posesión", objPsicologico: "Adaptabilidad mental a los cambios de fase", materiales: "Conos, petos de 2 colores, balones, porterías", descripcion: "Juego reducido de campo completo donde cada pérdida o recuperación de balón obliga a todo el equipo a cambiar inmediatamente de fase (ataque a defensa o viceversa), repitiendo situaciones reales de partido.", reglas: "El entrenador puede detener el juego para corregir la reacción del equipo tras cada cambio de fase", movimientosObservar: "Velocidad de reacción al cambio de fase; coherencia colectiva en la nueva organización; calidad de las decisiones en ambas transiciones.", observaciones: "" },
  { id: uid(), nombre: "Córner ofensivo", codigo: "FIJ-01", categoria: "Táctico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Vacío", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 14, espacio: "Área y medialuna", duracion: 15, objFisico: "Potencia en el salto y el remate", objTecnico: "Centro con efecto, remate de cabeza", objTactico: "Ocupación organizada de las zonas de remate (primer palo, segundo palo, punto de penalti, borde del área)", objPsicologico: "Confianza y decisión en el remate", materiales: "Conos, balones, porterías", descripcion: "Se ejecutan córners desde ambas bandas con distintas variantes (directo al primer palo, al segundo palo, corto y combinado) mientras los atacantes ocupan posiciones prefijadas dentro y fuera del área.", reglas: "Cada jugador tiene una zona de responsabilidad asignada previamente", movimientosObservar: "Timing de llegada a cada zona; calidad y altura del centro; contundencia en el remate.", observaciones: "" },
  { id: uid(), nombre: "Córner defensivo", codigo: "FIJ-02", categoria: "Táctico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Vacío", faseJuego: "Creación en cobertura", momentoJuego: "Defensa", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 14, espacio: "Área y medialuna", duracion: 15, objFisico: "Fuerza en el duelo aéreo y salto", objTecnico: "Despeje y anticipación", objTactico: "Marcaje y ocupación defensiva de las zonas de peligro del área", objPsicologico: "Concentración y comunicación en la marca", materiales: "Conos, balones, porterías", descripcion: "Se defienden córners desde ambas bandas, asignando marcas fijas y zonas de cobertura (primer palo, segundo palo, punto de penalti, rechaces) para el equipo defensor.", reglas: "Cada defensor tiene asignada una zona o un marcaje específico", movimientosObservar: "Comunicación entre el portero y los defensores; contundencia en el despeje; ocupación de la zona de rechace.", observaciones: "" },
  { id: uid(), nombre: "Tiro libre ofensivo directo e indirecto", codigo: "FIJ-03", categoria: "Táctico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Vacío", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 12, espacio: "Zona de tiro libre y área", duracion: 15, objFisico: "Golpeo de precisión y potencia", objTecnico: "Golpeo con efecto (directo) y combinaciones cortas (indirecto)", objTactico: "Movimientos de desmarque de la barrera y ocupación de rechaces", objPsicologico: "Decisión y confianza del ejecutante", materiales: "Conos, balones, porterías, muñecos o barrera de conos", descripcion: "Se practican tiros libres directos desde distintas distancias y ángulos, además de variantes combinadas (pared corta, amague) frente a una barrera simulada.", reglas: "Se simula siempre una barrera de al menos 3 jugadores", movimientosObservar: "Calidad del golpeo directo; sincronización en las variantes combinadas; ocupación de rechaces por los compañeros.", observaciones: "" },
  { id: uid(), nombre: "Tiro libre defensivo (barrera y marcaje)", codigo: "FIJ-04", categoria: "Táctico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Vacío", faseJuego: "Creación en cobertura", momentoJuego: "Defensa", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 8, maxJugadores: 14, espacio: "Zona de tiro libre y área", duracion: 15, objFisico: "Salto y fuerza en la barrera", objTecnico: "Colocación correcta del cuerpo en la barrera", objTactico: "Organización de la barrera y marcajes en el área simultáneamente", objPsicologico: "Disciplina y comunicación bajo presión", materiales: "Conos, balones, porterías", descripcion: "Se defienden tiros libres organizando la barrera (número de jugadores según la distancia y ángulo) mientras el resto del equipo marca a los atacantes dentro del área.", reglas: "El portero decide el número de jugadores en la barrera", movimientosObservar: "Coordinación al saltar la barrera; comunicación entre portero y barrera; marcaje simultáneo dentro del área.", observaciones: "" },
  { id: uid(), nombre: "Saque de banda ofensivo", codigo: "FIJ-05", categoria: "Táctico", tipoEjercicio: "Ejercicio analítico", zonaTrabajo: "Vacío", faseJuego: "Creación ofensiva", momentoJuego: "Ataque", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 6, maxJugadores: 10, espacio: "Banda y medio campo", duracion: 12, objFisico: "Potencia en el saque largo (si aplica)", objTecnico: "Recepción y control tras el saque", objTactico: "Movimientos de apoyo y desmarque para recibir el saque de banda", objPsicologico: "Rapidez de ejecución para sorprender al rival", materiales: "Conos, balones", descripcion: "Se practican variantes de saque de banda (corto con apoyo, largo directo al área, combinación con pared) buscando progresar rápidamente tras la reanudación.", reglas: "El saque debe ejecutarse en menos de 5 segundos desde que el balón sale", movimientosObservar: "Velocidad de ejecución del saque; calidad de los movimientos de apoyo; aprovechamiento de la sorpresa inicial.", observaciones: "" },
  { id: uid(), nombre: "Ataque y defensa de estrategia (repaso general)", codigo: "FIJ-06", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Vacío", faseJuego: "Finalización", momentoJuego: "Vacío", tipoTarea: "Situaciones tácticas de juego y táctica fija", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 25, objFisico: "Exigencia física puntual en acciones explosivas (salto, esprint corto)", objTecnico: "Ejecución técnica específica de cada acción a balón parado", objTactico: "Repaso integrado de córners, tiros libres y saques de banda en ambas fases (ataque y defensa)", objPsicologico: "Concentración sostenida durante todo el repaso", materiales: "Conos, balones, porterías, petos", descripcion: "Sesión de repaso general de estrategia donde se alternan de forma continua las distintas acciones a balón parado (córners, tiros libres, saques de banda) tanto en fase ofensiva como defensiva.", reglas: "El entrenador determina el orden y la frecuencia de cada acción", movimientosObservar: "Organización y roles asignados en cada acción; transición ordenada entre una estrategia y la siguiente; nivel de concentración mantenido durante todo el bloque.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado de resistencia (posesión continua)", codigo: "PAR-01", categoria: "Físico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Aeróbica intensiva", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 25, objFisico: "Resistencia aeróbica de base sostenida", objTecnico: "Pase y control con exigencia física constante", objTactico: "Conservación del balón en movimiento continuo", objPsicologico: "Tolerancia al esfuerzo prolongado", materiales: "Conos, petos, balones, porterías", descripcion: "Partido normal donde se exige movimiento constante y apoyo permanente al compañero con balón, penalizando la inactividad física durante la posesión.", reglas: "El equipo debe mantener siempre un mínimo de 3 apoyos cercanos al balón", movimientosObservar: "Volumen de desplazamiento sin balón; calidad técnica bajo fatiga acumulada; ritmo constante durante todo el partido.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado: velocidad de ataque por bandas", codigo: "PAR-02", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Velocidad y potencia en el desplazamiento por banda", objTecnico: "Centro y definición tras el desborde", objTactico: "Ataque prioritario por los costados con llegada rápida al área", objPsicologico: "Decisión valiente en el uno contra uno por banda", materiales: "Conos, petos, balones, porterías", descripcion: "Se juega un partido normal donde el gol solo es válido si la jugada de ataque ha superado la línea de banda con un extremo o lateral antes de finalizar.", reglas: "El gol solo cuenta si hubo un desborde o centro previo desde banda", movimientosObservar: "Velocidad de los extremos y laterales en la subida; calidad del centro; llegada de compañeros al área para definir.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado: velocidad de ataques internos", codigo: "PAR-03", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Velocidad y coordinación en espacios interiores", objTecnico: "Pase entre líneas y definición en corto", objTactico: "Ataque prioritario por el interior mediante combinaciones cortas", objPsicologico: "Valentía para atacar espacios reducidos", materiales: "Conos, petos, balones, porterías", descripcion: "Partido normal donde el gol solo es válido si la jugada previa incluyó al menos un pase entre líneas ejecutado por el centro del campo, priorizando el juego interior sobre el juego por fuera.", reglas: "El gol solo cuenta si hubo un pase entre líneas previo por el interior", movimientosObservar: "Calidad del pase entre líneas; movimientos de apoyo interior; velocidad de combinación en espacios reducidos.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado a dos toques con transición rápida", codigo: "PAR-04", categoria: "Técnico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia a la intensidad media-alta constante", objTecnico: "Pase y control preciso bajo limitación de toques", objTactico: "Circulación rápida y transición inmediata tras cada cambio de posesión", objPsicologico: "Anticipación mental de la siguiente acción", materiales: "Conos, petos, balones, porterías", descripcion: "Partido normal con límite de 2 toques por jugador en todo el campo, exigiendo anticipación constante y decisiones rápidas antes de recibir el balón.", reglas: "Máximo 2 toques por jugador; libre en campo propio tras recuperar", movimientosObservar: "Calidad del primer control; velocidad de decisión; anticipación de la siguiente acción antes de recibir.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado con gol válido tras centro", codigo: "PAR-05", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Potencia en el salto y el remate aéreo", objTecnico: "Centro con precisión y remate de cabeza o volea", objTactico: "Ocupación de las zonas de remate dentro del área tras el centro", objPsicologico: "Confianza en el juego aéreo", materiales: "Conos, petos, balones, porterías", descripcion: "El gol solo es válido si proviene de una jugada que incluyó un centro desde banda, incentivando la llegada al área y el juego aéreo.", reglas: "El gol solo cuenta si la acción incluyó un centro previo desde banda", movimientosObservar: "Timing de llegada al área tras el centro; calidad y altura del centro; contundencia en el remate.", observaciones: "" },
  { id: uid(), nombre: "Partido condicionado de resistencia a intensidad submáxima", codigo: "PAR-06", categoria: "Físico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Partidos condicionados", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 25, objFisico: "Resistencia a intensidad submáxima sostenida", objTecnico: "Mantenimiento de la calidad técnica bajo fatiga progresiva", objTactico: "Conservación del orden táctico a pesar del cansancio acumulado", objPsicologico: "Determinación para mantener el nivel de exigencia", materiales: "Conos, petos, balones, porterías", descripcion: "Partido de campo completo disputado en bloques de 8 minutos a una intensidad exigente pero submáxima, priorizando el volumen de trabajo sobre la máxima velocidad puntual.", reglas: "Bloques de 8 minutos con 2 minutos de descanso activo entre bloques", movimientosObservar: "Mantenimiento del orden táctico con fatiga acumulada; calidad técnica en los últimos minutos de cada bloque; gestión del esfuerzo a lo largo del partido.", observaciones: "" },
  { id: uid(), nombre: "Juego real con marcador en contra", codigo: "REA-01", categoria: "Psicológico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Juego real", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia a la exigencia física bajo presión emocional", objTecnico: "Mantenimiento de la calidad técnica bajo presión psicológica", objTactico: "Búsqueda de soluciones tácticas para remontar el resultado", objPsicologico: "Manejo de la presión psicológica y la frustración", materiales: "Conos, petos, balones, porterías, marcador visible", descripcion: "Se inicia el partido con un marcador simulado en contra (por ejemplo 0-1), obligando al equipo a jugar con la presión añadida de necesitar remontar el resultado.", reglas: "El marcador inicial se anuncia antes de empezar y se mantiene visible durante todo el juego", movimientosObservar: "Reacción emocional ante la adversidad inicial; capacidad de mantener el plan de juego bajo presión; comunicación del liderazgo dentro del equipo.", observaciones: "" },
  { id: uid(), nombre: "Juego real: conservar el resultado", codigo: "REA-02", categoria: "Psicológico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Umbral o zona mixta", faseJuego: "Vacío", momentoJuego: "Vacío", tipoTarea: "Juego real", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Resistencia a la intensidad variable según el momento del juego", objTecnico: "Conservación técnica del balón bajo presión de resultado", objTactico: "Gestión del resultado favorable: cuándo replegar y cuándo seguir atacando", objPsicologico: "Serenidad y disciplina táctica cuando se va ganando", materiales: "Conos, petos, balones, porterías, marcador visible", descripcion: "Se inicia el partido con un marcador simulado a favor, y el equipo debe practicar cómo gestionar y conservar esa ventaja sin renunciar a su idea de juego ni caer en el desorden defensivo.", reglas: "El marcador inicial se anuncia antes de empezar y se mantiene visible durante todo el juego", movimientosObservar: "Decisiones sobre cuándo replegar o seguir presionando; disciplina táctica sin necesidad; comunicación defensiva para no sufrir innecesariamente.", observaciones: "" },
  { id: uid(), nombre: "Juego real: últimos minutos para remontar", codigo: "REA-03", categoria: "Psicológico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Finalización", momentoJuego: "Ataque", tipoTarea: "Juego real", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 12, objFisico: "Capacidad de esfuerzo máximo en un tramo corto y decisivo", objTecnico: "Definición bajo presión de tiempo", objTactico: "Búsqueda de soluciones ofensivas urgentes en los minutos finales", objPsicologico: "Gestión de la ansiedad y mantenimiento de la lucidez bajo presión de tiempo", materiales: "Conos, petos, balones, porterías, cronómetro visible", descripcion: "Se simulan los últimos 5 a 10 minutos de un partido con marcador en contra, exigiendo al equipo encontrar soluciones ofensivas urgentes antes de que se acabe el tiempo simulado.", reglas: "El tiempo restante debe estar siempre visible para los jugadores", movimientosObservar: "Lucidez en la toma de decisiones bajo presión de tiempo; valentía ofensiva en los minutos finales; gestión colectiva de la urgencia sin perder el orden por completo.", observaciones: "" },
  { id: uid(), nombre: "Juego real con presión alta", codigo: "REA-04", categoria: "Táctico", tipoEjercicio: "Ejercicio sistémico", zonaTrabajo: "Anaeróbica", faseJuego: "Creación en cobertura", momentoJuego: "Transición defensiva", tipoTarea: "Juego real", edad: "Juvenil/Senior", minJugadores: 14, maxJugadores: 18, espacio: "Campo completo", duracion: 20, objFisico: "Potencia e intensidad sostenida en la presión colectiva", objTecnico: "Marcaje, cobertura e interceptación en campo rival", objTactico: "Presión alta organizada y coordinada desde la pérdida del balón", objPsicologico: "Determinación y sacrificio colectivo mantenido durante todo el partido", materiales: "Conos, petos, balones, porterías", descripcion: "Partido real donde se exige al equipo aplicar una presión alta y coordinada nada más perder el balón, buscando recuperarlo lo más cerca posible del área rival.", reglas: "Se valora especialmente la coordinación del bloque al presionar arriba", movimientosObservar: "Coordinación de las líneas al presionar arriba; riesgo asumido dejando espacio a la espalda; intensidad mantenida durante todo el partido.", observaciones: "" },
];

/* ------------------------------------------------------------
   Mejoras de contenido de la biblioteca (descripciones, progresiones...)
   Se aplican a las cuentas nuevas desde el principio y, UNA sola vez, a las
   que ya tenían su biblioteca guardada, sin pisar nada que la persona haya
   editado: solo se rellenan campos vacíos y se amplían las descripciones que
   siguen siendo exactamente las originales.
   Para futuras mejoras: añadir aquí lo nuevo y cambiar la clave de migración
   ("pz-tasks-mejoras-2026-10b") por otra distinta.
   ------------------------------------------------------------ */
const MEJORAS_TAREAS = {
 "TEC-04": {
  "nombre": "Rondo posicional 6v3",
  "observaciones": "Progresión: pasar de dos toques a un toque cuando el grupo lo domine. Variante: añadir un cuarto defensor o reducir el espacio. Clave: exigir perfilamiento antes de recibir y apoyos en diagonal, no en línea recta.",
  "descripcion": "Seis jugadores forman un cuadrado de 15x15 m y tres defensores se mueven en el centro. Los exteriores conservan el balón con pases a dos toques como máximo, buscando abrir ángulos y usando apoyos en diagonal. Cuando los defensores interceptan, el jugador que perdió el balón pasa al centro y sale uno de los defensores. Se juega en series de 3 a 4 minutos con descanso activo.",
  "descripcionAnterior": "Rondo con 6 jugadores exteriores y 3 defensores en el centro."
 },
 "TAC-11": {
  "nombre": "Presión tras pérdida 8v8",
  "observaciones": "Progresión: reducir el tiempo de recuperación de 5 a 4 segundos. Variante: puntuar doble el gol que llega tras una recuperación inmediata. Clave: el jugador más cercano presiona el balón y el resto cierra las líneas de pase en lugar de perseguir.",
  "descripcion": "Partido 8v8 en 40x30 m con porterías. Cuando un equipo pierde el balón, todo el equipo presiona de inmediato al poseedor y cierra las líneas de pase para recuperarlo en menos de 5 segundos. Si lo consigue, ataca con ventaja; si no, el rival juega libre y el equipo se repliega. Se juegan bloques de 5 a 6 minutos contando cuántas recuperaciones rápidas logra cada equipo.",
  "descripcionAnterior": "Juego 8v8 con objetivo de recuperación en menos de 5 segundos tras pérdida."
 },
 "FIS-02": {
  "nombre": "Circuito de velocidad y cambios de ritmo",
  "observaciones": "Progresión: aumentar a 5 repeticiones o añadir una conducción de balón en el tramo final. Clave: pausa completa entre series para que cada esfuerzo sea de máxima velocidad. Adaptar la carga a la edad y a la forma física del grupo.",
  "descripcion": "Circuito de 30 m con conos: esprín de 10 m, zigzag entre conos con cambios de dirección, frenada y aceleración final. Se sale desde posiciones distintas (de pie, sentado, de espaldas) y se recupera caminando al volver. Series de 4x30 m con pausa completa para mantener la calidad de cada esfuerzo.",
  "descripcionAnterior": "Circuito de esprines con cambios de dirección.",
  "objTecnico": "Técnica de carrera, frenada y cambio de dirección",
  "objTactico": "Elección de la trayectoria y lectura del espacio en los cambios de dirección"
 },
 "VC-01": {
  "nombre": "Vuelta a la calma con estiramiento guiado",
  "reglas": "Ritmo suave, sin competir y con la respiración controlada",
  "objTecnico": "Postura correcta y control de la respiración durante el estiramiento",
  "objTactico": "Balance colectivo de la sesión: qué salió bien y qué hay que mejorar"
 },
 "CAL-04": {
  "nombre": "Movilidad dinámica sin balón",
  "objTecnico": "Técnica de carrera y movilidad dinámica",
  "objTactico": "Atención a las consignas y orden del grupo en el trabajo colectivo"
 },
 "CAL-05": {
  "nombre": "Rondo de activación a dos toques",
  "observaciones": "Progresión: pasar a un toque en los dos últimos minutos. Variante: 5v2 en 12x12 m. Clave: la intensidad sube de forma gradual; no debe generar fatiga antes de la parte principal."
 },
 "RON-01": {
  "nombre": "Rondo simple 4v1",
  "observaciones": "Progresión: pasar a un toque o añadir un segundo defensor con un jugador más. Clave: perfilar el cuerpo antes de recibir y pasar con la cara del pie correcta, con ambas piernas.",
  "descripcion": "Cuatro jugadores forman un cuadrado de 8x8 m y un defensor se mueve en el centro. Los exteriores se pasan el balón a dos toques como máximo, buscando mantener la posesión y abrir ángulos, mientras el defensor intenta interceptar. Cuando el defensor consigue tres recuperaciones, cambia de rol con el jugador que falló. Se juega en series de 2 minutos.",
  "descripcionAnterior": "Rondo clásico 4 jugadores exteriores contra 1 defensor central, en espacio reducido."
 },
 "RON-02": {
  "nombre": "Rondo con apoyo 5v2 + comodín",
  "observaciones": "Progresión: eliminar el comodín cuando se domine y pasar a 5v2. Variante: limitar al comodín a un toque en todo momento. Clave: apoyos en diagonal y amplitud de los exteriores para abrir ángulos de pase."
 },
 "RON-03": {
  "nombre": "Rondo con apoyo y comodín central",
  "observaciones": "Progresión: limitar a dos toques a todos, comodín incluido. Variante: el comodín gira y juega por el lado contrario al de recepción. Clave: el pase al pivote debe ir al pie contrario a la presión.",
  "reemplazos": {
   "minJugadores": [
    7,
    9
   ],
   "maxJugadores": [
    7,
    9
   ]
  }
 },
 "RON-04": {
  "nombre": "Rondo con apoyos exteriores y presión",
  "observaciones": "Progresión: acortar el tiempo de recuperación de 6 a 5 segundos. Variante: puntuar cada recuperación en menos de 6 segundos. Clave: los 3 defensores presionan en bloque y cierran líneas de pase; si cada uno presiona por su cuenta, el rondo no funciona."
 },
 "RUE-01": {
  "nombre": "Rueda de pase con definición a mini portería A",
  "observaciones": "Progresión: aumentar la velocidad de ejecución y pasar a definir a un toque. Variante: alternar la pierna de definición. Clave: el último pase debe llegar al pie adecuado para definir sin necesidad de controlar de más."
 },
 "RUE-02": {
  "nombre": "Rueda de pase con definición a mini portería B",
  "observaciones": "Progresión: alternar banda derecha e izquierda en cada serie. Variante: el rematador entra desde posiciones distintas. Clave: ajustar el ángulo de aproximación para definir de primeras; la calidad y la altura del centro condicionan todo."
 },
 "RUE-03": {
  "nombre": "Rueda de pase con desdoblamiento",
  "observaciones": "Progresión: añadir un defensor pasivo que se ofrece como obstáculo. Variante: alternar desdoblamiento por delante y por detrás del receptor. Clave: la carrera comienza justo después del pase; si el jugador espera, llega tarde."
 },
 "RUE-04": {
  "nombre": "Rueda de pase continua en rombo",
  "observaciones": "Progresión: incorporar un segundo balón y cambiar el sentido de la circulación. Variante: pase con el exterior del pie. Clave: mantener un ritmo estable y rotar de posición sin perder la estructura del rombo."
 },
 "LUD-01": {
  "nombre": "Fútbol tenis",
  "observaciones": "Progresión: limitar a un toque por jugador o exigir golpeos solo con muslo y cabeza. Variante: parejas fijas frente a rotación de rivales. Clave: es una tarea lúdica; priorizar la participación y la diversión sobre la competición."
 },
 "LUD-02": {
  "nombre": "Pañuelo con balón",
  "observaciones": "Progresión: llamar a dos números a la vez o salir desde posiciones distintas (sentado, de espaldas). Clave: la señal exige reacción inmediata; vigilar la seguridad en los cruces.",
  "objTactico": "Anticipación y lectura de la jugada del rival"
 },
 "LUD-03": {
  "nombre": "Relevos con conducción",
  "observaciones": "Progresión: añadir una pared o una conducción con la pierna menos hábil en el trayecto. Variante: relevos por parejas con pase. Clave: balón siempre cerca del pie; penalizar el balón lejano antes que el tiempo.",
  "objTactico": "Coordinación del equipo y orden en el relevo"
 },
 "LUD-04": {
  "nombre": "Balón torre (rey del campo)",
  "observaciones": "Progresión: reducir el tamaño de la zona propia o limitar a 2 toques. Variante: dos balones. Clave: protegerse con el cuerpo y repartirse por toda la zona; evitar que todos se acumulen alrededor del balón."
 },
 "ESP-01": {
  "nombre": "Espacio reducido 4v4 con presión tras pérdida",
  "observaciones": "Progresión: reducir el tiempo de recuperación de 5 a 4 segundos. Variante: sumar un comodín a favor del equipo que ataca. Clave: reacción inmediata tras la pérdida; el compañero más cercano al balón presiona y el resto cierra.",
  "reemplazos": {
   "reglas": [
    "Si no se recupera en 5s, se retira un jugador temporalmente en desventaja",
    "Si un equipo no recupera el balón en 5 segundos tras perderlo, juega con un jugador menos hasta la siguiente recuperación."
   ]
  }
 },
 "ESP-02": {
  "nombre": "3v3 más comodines con transición rápida",
  "observaciones": "Progresión: reducir el tiempo de ataque de 8 a 6 segundos. Variante: añadir un defensor en cada transición. Clave: la primera decisión tras recuperar (conducir, pasar al comodín o pasar en profundidad) marca la calidad de la transición."
 },
 "ESP-03": {
  "nombre": "Espacio reducido con reacción a estímulo",
  "observaciones": "Progresión: combinar dos señales distintas en una misma serie. Variante: alternar estímulos visuales y auditivos. Clave: el juego no se detiene; se valora la reacción de todo el grupo, no solo la del más rápido."
 },
 "ESP-04": {
  "nombre": "2v2 con apoyos y salida rápida",
  "observaciones": "Progresión: reducir el espacio o el tiempo de salida. Variante: el apoyo exterior juega a dos toques. Clave: la decisión rápida al ganar el duelo: conducir, pasar al apoyo o salir al espacio libre."
 },
 "POS-01": {
  "nombre": "Juego de posición 5v5+3 a un toque",
  "observaciones": "Progresión: reducir el espacio de 30x25 a 25x20 m o añadir un cuarto comodín. Variante: puntuar cada 8 pases consecutivos. Clave: el juego a un toque exige perfilar el cuerpo antes de recibir y mover constantemente los apoyos."
 },
 "POS-02": {
  "nombre": "Juego de posición 4v4+2 a máximo dos toques",
  "observaciones": "Progresión: pasar a un toque obligatorio en los últimos minutos. Variante: comodines en las esquinas. Clave: orientación corporal antes de recibir, amplitud y apoyos a distintas alturas."
 },
 "POS-03": {
  "nombre": "Juego de posición de alta intensidad 6v6",
  "observaciones": "Progresión: aumentar el número de series de 3 minutos, siempre con 1 minuto de pausa activa. Variante: reducir el espacio. Clave: es físicamente exigente; controlar la carga y mantener la calidad del pase aunque aparezca el cansancio.",
  "reemplazos": {
   "descripcion": [
    "6 contra 6 en espacio reducido para su número de jugadores, exigiendo un ritmo de juego muy alto y presión constante sobre el balón.",
    "Juego de posesión 6 contra 6 en un espacio reducido, con un ritmo muy alto y presión constante sobre el balón. Se juega por series de 3 minutos con 1 minuto de descanso activo."
   ]
  }
 },
 "POS-04": {
  "nombre": "Juego de posición de alta intensidad con transición inmediata",
  "observaciones": "Progresión: reducir el tiempo de recuperación de 6 a 5 segundos. Variante: puntuar doble si se recupera en menos de 3 segundos. Clave: presionar en bloque tras la pérdida: el más cercano al balón presiona y el resto cierra líneas de pase."
 },
 "POS-05": {
  "nombre": "Juego de posición de alta intensidad con superioridad numérica",
  "observaciones": "Progresión: bajar a 5 segundos para progresar. Variante: reducir la superioridad a 5v4. Clave: la superioridad sirve para progresar, no para conservar sin sentido; buscar el pase vertical cuando se abra."
 },
 "POS-06": {
  "nombre": "Juego de posición con porteros en doble área",
  "observaciones": "Progresión: limitar al portero a dos toques. Variante: permitir al portero jugar fuera del área con restricción. Clave: ocupar de forma ordenada las dos áreas y usar al portero como un jugador más para generar superioridad.",
  "reemplazos": {
   "reglas": [
    "El portero solo puede jugar dentro de su área; máximo 2 toques fuera de ella",
    "El portero puede usar las manos solo dentro de su área; fuera de ella juega con los pies, a 2 toques como máximo."
   ]
  }
 },
 "TAC-20": {
  "nombre": "Transición ofensiva directa tras recuperación",
  "observaciones": "Progresión: reducir el máximo de pases de 4 a 3. Variante: añadir un defensor que se repliega. Clave: atacar el espacio libre cuanto antes; la primera decisión tras recuperar debe ser mirar en profundidad."
 },
 "TAC-21": {
  "nombre": "Transición ofensiva elaborada con conservación",
  "observaciones": "Progresión: aumentar el mínimo de pases a 8 o exigir un cambio de orientación. Variante: finalizar solo tras superar una línea. Clave: paciencia para conservar y progresar con orden, sin precipitar la finalización."
 },
 "TAC-22": {
  "nombre": "Transición defensiva directa (repliegue rápido)",
  "observaciones": "Progresión: acortar el tiempo del contraataque rival. Variante: el rival ataca en superioridad. Clave: el primer jugador presiona o temporiza al poseedor y el resto recupera su posición en carrera, sin esperar a que otro lo haga.",
  "reemplazos": {
   "reglas": [
    "El equipo rival tiene un tiempo limitado para intentar el contraataque directo",
    "El rival dispone de unos 8 segundos para finalizar el contraataque; pasado ese tiempo, la acción termina."
   ]
  }
 },
 "TAC-23": {
  "nombre": "Transición defensiva elaborada (basculación y cobertura)",
  "observaciones": "Progresión: sumar un atacante más al contraataque rival. Variante: cambiar la zona donde se pierde el balón. Clave: cobertura entre líneas; presionar solo cuando el compañero cubre."
 },
 "TAC-24": {
  "nombre": "Salida de balón en construcción elaborada",
  "observaciones": "Progresión: añadir una segunda línea de presión rival. Variante: salida con un solo central y el portero. Clave: apoyos cercanos, perfilamiento del receptor y decisión rápida: salir jugando o pasar en largo si la presión es muy alta."
 },
 "TAC-25": {
  "nombre": "Contraataque directo tras robo",
  "observaciones": "Progresión: reducir el tiempo de 6 a 5 segundos. Variante: añadir un defensor que recupere a mitad de campo. Clave: pocos jugadores y velocidad de conducción; el último pase define la acción."
 },
 "TAC-26": {
  "nombre": "Repliegue defensivo tras pérdida en campo rival",
  "observaciones": "Progresión: sumar un atacante rival. Variante: pérdida en zonas distintas del campo. Clave: repliegue intenso por detrás del balón y presión al que conduce, evitando el pase vertical."
 },
 "TAC-27": {
  "nombre": "Transición ofensiva-defensiva combinada (juego de posiciones)",
  "observaciones": "Progresión: reducir las pausas de corrección del entrenador. Variante: cambiar el marcador inicial. Clave: la reacción en los primeros segundos tras perder o recuperar, más que el resultado."
 },
 "FIJ-01": {
  "nombre": "Córner ofensivo",
  "observaciones": "Progresión: sumar un defensor pasivo y después activo. Variante: córner corto, a ras de suelo al punto de penalti o con segunda jugada. Clave: cada jugador conoce su zona y su carrera; el centro llega con precisión y en el momento justo."
 },
 "FIJ-02": {
  "nombre": "Córner defensivo",
  "observaciones": "Progresión: pasar de marcajes pasivos a activos. Variante: defensa mixta (zona y hombre). Clave: comunicación clara, salida del área tras el despeje y atención a los rechaces."
 },
 "FIJ-03": {
  "nombre": "Tiro libre ofensivo directo e indirecto",
  "observaciones": "Progresión: pasar de una barrera pasiva a una barrera con movimiento. Variante: pared corta o amague. Clave: el desmarque de la barrera para recibir un pase corto confunde a la defensa; el rechace también hay que ocuparlo."
 },
 "FIJ-04": {
  "nombre": "Tiro libre defensivo (barrera y marcaje)",
  "observaciones": "Progresión: sumar más atacantes en el área. Variante: cambiar la distancia y el ángulo del tiro. Clave: la barrera se mantiene firme y no salta antes de tiempo; marcajes definidos y comunicación del portero."
 },
 "FIJ-05": {
  "nombre": "Saque de banda ofensivo",
  "observaciones": "Progresión: sumar un defensor que presione al receptor. Variante: saque largo al área con jugada ensayada. Clave: ejecución rápida y apoyo cercano del compañero más próximo; evitar sacar sin opción de pase."
 },
 "FIJ-06": {
  "nombre": "Ataque y defensa de estrategia (repaso general)",
  "observaciones": "Progresión: el entrenador cambia el orden sin avisar. Variante: marcador y tiempo simulados. Clave: repasar solo las jugadas ya trabajadas en la temporada; unir ataque y defensa de cada acción en la misma serie."
 },
 "PAR-01": {
  "nombre": "Partido condicionado de resistencia (posesión continua)",
  "observaciones": "Progresión: bloques de 8 minutos con descanso activo de 2. Variante: aumentar el mínimo de apoyos a 4. Clave: movimiento constante sin balón; el compañero con balón siempre tiene opciones cercanas."
 },
 "PAR-02": {
  "nombre": "Partido condicionado: velocidad de ataque por bandas",
  "observaciones": "Progresión: exigir centro de primeras tras el desborde. Variante: gol doble si hay llegada al segundo palo. Clave: amplitud máxima del extremo y del lateral, y llegada oportuna de los rematadores al área."
 },
 "PAR-03": {
  "nombre": "Partido condicionado: velocidad de ataques internos",
  "observaciones": "Progresión: exigir el pase entre líneas a dos toques como máximo. Variante: el entrenador marca la línea que hay que superar. Clave: perfilamiento y apoyos cercanos para combinar en corto por el interior."
 },
 "PAR-04": {
  "nombre": "Partido condicionado a dos toques con transición rápida",
  "observaciones": "Progresión: pasar a un toque en zonas de presión. Variante: toques libres en campo propio tras recuperar. Clave: anticipación; decidir antes de recibir, no después."
 },
 "PAR-05": {
  "nombre": "Partido condicionado con gol válido tras centro",
  "observaciones": "Progresión: gol doble si el centro es de primeras. Variante: obligar a centrar desde el fondo o desde el lateral. Clave: ocupar primer palo, segundo palo y punto de penalti; el centro, con precisión y a tiempo."
 },
 "PAR-06": {
  "nombre": "Partido condicionado de resistencia a intensidad submáxima",
  "observaciones": "Progresión: aumentar el número de bloques de 3 a 4. Variante: bloque final con presión alta. Clave: intensidad submáxima sostenida; controlar la carga y la calidad técnica cuando aparece la fatiga."
 },
 "REA-01": {
  "nombre": "Juego real con marcador en contra",
  "observaciones": "Progresión: cambiar el marcador inicial (por ejemplo 0-2). Variante: tiempo limitado. Clave: el equipo mantiene la calma y su idea de juego; evitar el juego precipitado y el desorden defensivo."
 },
 "REA-02": {
  "nombre": "Juego real: conservar el resultado",
  "observaciones": "Progresión: reducir el tiempo restante o sumar presión rival. Variante: conservar el resultado con un jugador menos. Clave: no renunciar al juego; replegar a tiempo sin regalar el balón."
 },
 "REA-03": {
  "nombre": "Juego real: últimos minutos para remontar",
  "observaciones": "Progresión: reducir el tiempo de 10 a 5 minutos. Variante: marcador de 0-2. Clave: decisiones urgentes pero ordenadas; asumir riesgos calculados y mantener la estructura."
 },
 "REA-04": {
  "nombre": "Juego real con presión alta",
  "observaciones": "Progresión: presión alta con un jugador menos en el bloque. Variante: señal del entrenador para activar la presión. Clave: coordinación del bloque: todos presionan a la vez, o nadie; el equipo se mueve unido."
 },
 "CAL-01": {
  "nombre": "Movilidad articular y activación general",
  "objTactico": "Primeras acciones de conservación y apoyo en el rondo final"
 },
 "CAL-03": {
  "nombre": "Calentamiento con balón por parejas",
  "objTactico": "Apoyo y desmarque sencillo con el compañero de la pareja"
 }
};

/* ---- Catálogo de tareas dibujadas (noviembre 2026) ----
   Llega del servidor según el plan (/api/sesiones-objetivos). Sustituye las tareas de fábrica que la persona NO ha tocado;
   las que ha editado y las suyas se conservan. */
/* Huella de una tarea: si la persona cambió cualquiera de estos campos (o su dibujo), la tarea se considera editada y no se toca. */
const CAMPOS_HUELLA = ["nombre", "descripcion", "reglas", "observaciones", "movimientosObservar", "objFisico", "objTecnico", "objTactico", "objPsicologico", "materiales", "duracion", "espacio", "minJugadores", "maxJugadores", "tipoTarea", "zonaTrabajo", "faseJuego", "momentoJuego", "categoria", "tipoEjercicio"];
const firmaTarea = (t) => CAMPOS_HUELLA.map((c) => String(t[c] ?? "").trim()).join("|") + "|" + JSON.stringify(t.graficoTactico || null);
const normalizaTipoTarea = (tks) => tks.map((t) => (t.tipoTarea === "Juegos de posesión" ? { ...t, tipoTarea: "Juegos de posición" } : t));
function aplicarCatalogo(tks, catalogo) {
  const firmasFabrica = new Set(normalizaTipoTarea([...DEMO_TASKS, ...NUEVAS_TAREAS_2025].map(mejorarTarea)).map(firmaTarea));
  const frescas = new Map(catalogo.map((t) => [t.codigo, t]));
  const idsFrescos = new Set(catalogo.map((t) => t.id));
  const vistos = new Set(); const out = [];
  normalizaTipoTarea(tks).forEach((t) => {
    if (!t.origenCatalogo && !t.origenLibro && firmasFabrica.has(firmaTarea(t))) return;          // de fábrica y sin tocar: la sustituye el catálogo
    if (t.origenLibro && t.soloImagen && idsFrescos.has(t.id)) return;                           // la versión antigua del libro (solo imagen) la sustituye la tarea editable del catálogo
    if (t.origenCatalogo) {
      const nueva = frescas.get(t.codigo);
      const huella = t.catalogoHuella || (nueva && firmaTarea(nueva) === firmaTarea(t) ? firmaTarea(t) : null);   // las de la primera entrega no traían huella
      vistos.add(t.codigo);
      if (nueva && huella && firmaTarea(t) === huella) { out.push({ ...nueva, id: t.id, catalogoHuella: firmaTarea(nueva), ...(t.valoracion ? { valoracion: t.valoracion } : {}) }); return; }   // sin editar: se actualiza
    }
    out.push(t);
  });
  catalogo.forEach((t) => { if (!vistos.has(t.codigo)) out.push({ ...t, catalogoHuella: firmaTarea(t) }); });
  return out;
}
/* El dibujo no se guarda como imagen en cada tarea (ocupa mucho): se calcula a partir de los datos del gráfico. */
const _imgCache = new Map();
const esSvgGuardado = (img) => typeof img === "string" && img.startsWith("data:image/svg");
function imagenDe(t) {
  if (!t) return "";
  if (t.imagen && !(t.graficoTactico && esSvgGuardado(t.imagen))) return t.imagen.startsWith("/") && typeof window !== "undefined" && window.location?.origin ? window.location.origin + t.imagen : t.imagen;
  if (!t.graficoTactico) return "";
  const k = (t.id || "") + ":" + JSON.stringify(t.graficoTactico).length;
  if (!_imgCache.has(k)) {
    try { _imgCache.set(k, "data:image/svg+xml;charset=utf-8," + encodeURIComponent(buildDiagramSVG(t.graficoTactico))); } catch (e) { return ""; }
  }
  return _imgCache.get(k);
}
const _imgCacheB = new Map();
function imagenDeBlanco(t) {
  if (!t || !t.graficoTactico || (t.imagen && !esSvgGuardado(t.imagen))) return "";
  const k = (t.id || "") + ":" + JSON.stringify(t.graficoTactico).length;
  if (!_imgCacheB.has(k)) { try { _imgCacheB.set(k, "data:image/svg+xml;charset=utf-8," + encodeURIComponent(buildDiagramSVG(t.graficoTactico, { modo: "blanco" }))); } catch (e) { return ""; } }
  return _imgCacheB.get(k);
}
/* Imagen para las hojas impresas: lleva también la versión de campo blanco (la ventana de impresión deja elegir). */
function imgImpresion(t, clase) {
  const c = imagenDe(t); if (!c) return "";
  const b = imagenDeBlanco(t);
  return `<img${clase ? ` class="${clase}"` : ""} src="${c}"${b ? ` data-color="${c}" data-blanco="${b}"` : ""} />`;
}
export { imagenDe };
export { envolverTexto };
export { CLAVES_PZ };
/* Leyenda de los gráficos: una sola vez para todas las hojas impresas. */
const LEYENDA_CSS = `.leyenda { margin-top: 5px; padding: 4px 8px; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 8.5px; color: #475569; background: #FAFBFC; line-height: 1.5; }
    .leyenda .lg { white-space: nowrap; margin-right: 8px; } .leyenda svg { vertical-align: middle; width: 30px; height: 8px; margin-right: 2px; }`;
const LEYENDA_HTML = `<div class="leyenda"><b>Cómo leer el gráfico:</b>
  <span class="lg"><svg viewBox="0 0 30 8"><line x1="0" y1="4" x2="26" y2="4" stroke="#1E3A8A" stroke-width="2"/><polygon points="26,1 30,4 26,7" fill="#1E3A8A"/></svg>balón (pase, pase centro, pase al espacio, tiro)</span>
  <span class="lg"><svg viewBox="0 0 30 8"><line x1="0" y1="4" x2="26" y2="4" stroke="#1E3A8A" stroke-width="2" stroke-dasharray="4 3"/><polygon points="26,1 30,4 26,7" fill="#1E3A8A"/></svg>jugador sin balón (desplazamiento, desmarque)</span>
  <span class="lg"><svg viewBox="0 0 30 8"><path d="M0 4 q2 -4 4 0 t4 0 t4 0 t4 0 t4 0 t4 0" fill="none" stroke="#1E3A8A" stroke-width="2"/></svg>conducción (jugador con balón)</span>
  <span class="lg"><svg viewBox="0 0 30 8"><path d="M0 7 Q13 -4 26 6" fill="none" stroke="#F97316" stroke-width="2"/><polygon points="25,2 30,7 24,8" fill="#F97316"/></svg>balón por el aire</span>
  · Los colores son los equipos · <b>P</b> portero · <b>C</b> comodín · <b>E</b> entrenador · las flechas rojas son del equipo rival</div>`;

function mejorarTarea(t) {
  const m = MEJORAS_TAREAS[t.codigo];
  if (!m || t.nombre !== m.nombre) return t; // si la persona renombró la tarea, no se toca
  const out = { ...t };
  // a) Campos vacíos: se rellenan.
  ["observaciones", "objTactico", "objTecnico", "reglas"].forEach((c) => {
    if (m[c] && (!out[c] || !String(out[c]).trim() || out[c] === "-")) out[c] = m[c];
  });
  // b) Textos originales que se amplían: solo si siguen siendo exactamente los originales.
  if (m.descripcion && m.descripcionAnterior && String(out.descripcion || "").trim() === m.descripcionAnterior) {
    out.descripcion = m.descripcion;
  }
  // c) Correcciones puntuales: solo si el valor sigue siendo el original (nunca pisa ediciones).
  Object.entries(m.reemplazos || {}).forEach(([campo, par]) => {
    if (String(out[campo] ?? "").trim() === String(par[0]).trim()) out[campo] = par[1];
  });
  return out;
}
for (let i = 0; i < DEMO_TASKS.length; i++) DEMO_TASKS[i] = mejorarTarea(DEMO_TASKS[i]);
for (let i = 0; i < NUEVAS_TAREAS_2025.length; i++) NUEVAS_TAREAS_2025[i] = mejorarTarea(NUEVAS_TAREAS_2025[i]);

function diaSemanaFecha(fechaISO) {
  if (!fechaISO) return "";
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const [y, m, d] = fechaISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const diaTxt = dias[dt.getDay()];
  return `${diaTxt.charAt(0).toUpperCase() + diaTxt.slice(1)}, ${d} de ${meses[m - 1]}`;
}

function restarMinutos(horaHHMM, minutos) {
  if (!horaHHMM) return "";
  const [h, m] = horaHHMM.split(":").map(Number);
  const total = h * 60 + m - minutos;
  const norm = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(norm / 60), mm = norm % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function loadImg(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

const TEXTO_ANTES_POR_DEFECTO = "Antes de venir: trae la equipación completa, las canilleras y una botella de agua. Quien juegue de portero, que traiga la equipación de portero del color acordado.";
const TEXTO_CIERRE_POR_DEFECTO = "Llega puntual y con buena actitud. ¡Vamos equipo!";
function envolverTexto(texto, maxAncho, medir) {
  const lineas = [];
  String(texto || "").split("\n").forEach((par) => {
    let linea = "";
    par.split(/\s+/).filter(Boolean).forEach((w) => {
      const prueba = linea ? `${linea} ${w}` : w;
      if (medir(prueba) > maxAncho && linea) { lineas.push(linea); linea = w; } else linea = prueba;
    });
    if (linea) lineas.push(linea);
  });
  return lineas;
}

async function generarConvocatoriaPNG(match, config, players, opts) {
  const W = 1080;
  const brand = config.brandColor || T.navy;
  const onBrandTxt = contrastTextColor(brand);
  const convocados = players.filter((p) => (match.cerrado || esDisponible(p)) && match.convocatoria?.find((c) => c.jugadorId === p.id && c.estado === "Convocado"))
    .sort((a, b) => (a.numero || 0) - (b.numero || 0));

  const cols = 2;
  const rowsCount = Math.ceil(convocados.length / cols);
  const listHeight = 82 + rowsCount * 54;
  // Los mensajes (antes de la lista y de cierre) se parten en líneas para calcular la altura de la imagen.
  const medidor = document.createElement("canvas").getContext("2d");
  if (medidor) medidor.font = "600 19px -apple-system, Segoe UI, Arial, sans-serif";
  const medir = (t) => (medidor ? medidor.measureText(t).width : t.length * 10);
  const lineasAntes = opts.mensajeAntes ? envolverTexto(opts.mensajeAntes, W - 144, medir) : [];
  const lineasCierre = opts.nota ? envolverTexto(opts.nota, W - 144, medir) : [];
  const antesH = lineasAntes.length ? lineasAntes.length * 28 + 54 : 0;
  const cierreH = lineasCierre.length ? lineasCierre.length * 28 + 50 : 0;
  const H = 650 + (antesH ? antesH + 24 : 0) + listHeight + (cierreH ? cierreH + 64 : 60);   // 650 = lo que ocupa todo lo que va antes de la lista (cabecera, datos y equipación)

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Fondo
  ctx.fillStyle = "#F3F5F8";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(24, 24, W - 48, H - 48);

  // Header: logo + nombre + temporada
  const logoImg = await loadImg(config.logo);
  let hx = 60;
  if (logoImg) { ctx.drawImage(logoImg, 56, 52, 76, 76); hx = 150; }
  ctx.fillStyle = "#0B1F3A";
  ctx.font = "800 34px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.fillText(config.teamName || "Equipo", hx, 90);
  ctx.fillStyle = "#64748B";
  ctx.font = "600 22px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.fillText(`Temporada ${config.season || ""}`, hx, 118);

  // Título
  ctx.fillStyle = "#0B1F3A";
  ctx.font = "800 26px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CONVOCATORIA PARA EL SIGUIENTE PARTIDO", W / 2, 175);
  ctx.textAlign = "left";

  // Rótulo de color con el enfrentamiento
  const bannerY = 200, bannerH = 100;
  ctx.fillStyle = brand;
  ctx.fillRect(56, bannerY, W - 112, bannerH);
  const local = config.teamName || "Equipo";
  const rival = match.rival || "Rival";
  const enfrentamiento = match.esLocal ? `${local}  vs  ${rival}` : `${rival}  vs  ${local}`;
  ctx.fillStyle = onBrandTxt;
  ctx.font = "800 32px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.textAlign = "center";
  // Ajuste de tamaño si el texto es muy largo
  let fontSize = 32;
  while (ctx.measureText(enfrentamiento).width > W - 160 && fontSize > 18) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize}px -apple-system, Segoe UI, Arial, sans-serif`;
  }
  ctx.fillText(enfrentamiento, W / 2, bannerY + bannerH / 2 + fontSize / 3);
  ctx.textAlign = "left";

  // Fila de datos: fecha, hora partido, hora vestuario, campo
  const infoY = bannerY + bannerH + 50;
  const infoItems = [
    ["FECHA", diaSemanaFecha(match.fecha)],
    ["HORA DEL PARTIDO", match.hora || "Por confirmar"],
    ["HORA DE CONVOCATORIA", opts.horaVestuario || "Por confirmar"],
    ["CAMPO", match.campo || "Por confirmar"],
  ];
  const colW = (W - 112) / 2;
  infoItems.forEach(([label, value], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 56 + col * colW;
    const y = infoY + row * 90;
    ctx.fillStyle = "#94A3B8";
    ctx.font = "800 15px -apple-system, Segoe UI, Arial, sans-serif";
    ctx.fillText(label, x, y);
    ctx.fillStyle = "#0B1F3A";
    ctx.font = "700 26px -apple-system, Segoe UI, Arial, sans-serif";
    ctx.fillText(value, x, y + 32);
  });

  // Equipación
  const equipY = infoY + 200;
  ctx.fillStyle = "#94A3B8";
  ctx.font = "800 15px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.fillText("EQUIPACIÓN", 56, equipY);
  ctx.fillStyle = "#0B1F3A";
  ctx.font = "700 22px -apple-system, Segoe UI, Arial, sans-serif";
  const eq = match.vestimenta || {};
  const eqTxt = [eq.camiseta, eq.pantaloneta, eq.medias].filter(Boolean).join("  ·  ") || "Por confirmar";
  ctx.fillText(eqTxt, 56, equipY + 30);
  ctx.fillStyle = "#B45309";
  ctx.font = "700 17px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.fillText("⚠ Llevar otra equipación, por si acaso.", 56, equipY + 62);

  // Mensaje antes de la lista (portero, canilleras, agua...)
  let listY = equipY + 100;
  if (lineasAntes.length) {
    ctx.fillStyle = "#FFF8E6";
    ctx.fillRect(56, listY - 8, W - 112, antesH);
    ctx.fillStyle = "#B45309";
    ctx.font = "800 15px -apple-system, Segoe UI, Arial, sans-serif";
    ctx.fillText("ANTES DEL PARTIDO", 72, listY + 18);
    ctx.fillStyle = "#1B2733";
    ctx.font = "600 19px -apple-system, Segoe UI, Arial, sans-serif";
    lineasAntes.forEach((l, i) => ctx.fillText(l, 72, listY + 50 + i * 28));
    listY += antesH + 24;
  }
  // Lista de convocados
  ctx.fillStyle = brand;
  ctx.fillRect(56, listY, W - 112, 46);
  ctx.fillStyle = onBrandTxt;
  ctx.font = "800 18px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.fillText(`JUGADORES CONVOCADOS  (${convocados.length})`, 72, listY + 30);

  const rowH = 54;
  convocados.forEach((p, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 72 + col * ((W - 144) / cols);
    const y = listY + 82 + row * rowH;
    const isCap = match.capitanId === p.id;
    ctx.fillStyle = "#0B1F3A";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y - 26, 36, 36, 8) : ctx.fillRect(x, y - 26, 36, 36);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 15px -apple-system, Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(p.numero), x + 18, y - 3);
    ctx.textAlign = "left";
    ctx.fillStyle = "#1B2733";
    ctx.font = "700 20px -apple-system, Segoe UI, Arial, sans-serif";
    ctx.fillText((p.apodo || p.nombre) + (isCap ? " (C)" : ""), x + 48, y - 3);
  });

  // Mensaje de cierre
  if (lineasCierre.length) {
    const notaY = listY + 82 + rowsCount * rowH + 18;
    ctx.fillStyle = "#F7F8FA";
    ctx.fillRect(56, notaY, W - 112, cierreH);
    ctx.fillStyle = "#334155";
    ctx.font = "700 19px -apple-system, Segoe UI, Arial, sans-serif";
    lineasCierre.forEach((l, i) => ctx.fillText((i === 0 ? "📌 " : "") + l, 72, notaY + 38 + i * 28));
  }

  return canvas.toDataURL("image/png", 1.0);
}

function ConvocatoriaCardModal({ match, config, players, onClose }) {
  const [modo, setModo] = useState("45");
  const [horaManual, setHoraManual] = useState("");
  const guardados = (() => { try { return JSON.parse(almacen().getItem(claveLocal("pz-convocatoria-textos")) || "{}") || {}; } catch { return {}; } })();
  const [mensajeAntes, setMensajeAntes] = useState(guardados.antes ?? TEXTO_ANTES_POR_DEFECTO);
  const [nota, setNota] = useState(guardados.cierre ?? TEXTO_CIERRE_POR_DEFECTO);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const horaVestuario = modo === "manual" ? horaManual : restarMinutos(match.hora, Number(modo));

  const generar = async () => {
    setLoading(true);
    try { almacen().setItem(claveLocal("pz-convocatoria-textos"), JSON.stringify({ antes: mensajeAntes, cierre: nota })); } catch { /* sin almacenamiento */ }
    const url = await generarConvocatoriaPNG(match, config, players, { horaVestuario, nota, mensajeAntes });
    setPreview(url);
    setLoading(false);
  };

  return (
    <Modal title="Generar convocatoria para compartir" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hora de convocatoria (encuentro en el vestuario)">
          <Select value={modo} onChange={(e) => setModo(e.target.value)}>
            <option value="30">30 minutos antes del partido</option>
            <option value="45">45 minutos antes del partido</option>
            <option value="60">1 hora antes del partido</option>
            <option value="manual">Manual</option>
          </Select>
        </Field>
        {modo === "manual" && (
          <Field label="Hora manual">
            <TextInput type="time" value={horaManual} onChange={(e) => setHoraManual(e.target.value)} />
          </Field>
        )}
        <Field label="Mensaje antes de la lista de jugadores (opcional)" className="sm:col-span-2">
          <TextInput placeholder="Ej: Trae canilleras, agua y la equipación de portero..." value={mensajeAntes} onChange={(e) => setMensajeAntes(e.target.value)} />
        </Field>
        <Field label="Mensaje de cierre (opcional)" className="sm:col-span-2">
          <TextInput placeholder="Ej: Vamos con todo, equipo 💪" value={nota} onChange={(e) => setNota(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Btn variant="accent" icon={Printer} onClick={generar}>{loading ? "Generando..." : "Generar imagen"}</Btn>
      </div>
      {preview && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <img src={preview} alt="Convocatoria" className="max-w-full rounded-xl border" style={{ borderColor: T.line, maxHeight: 480 }} />
          <a href={preview} download={`convocatoria-vs-${(match.rival || "rival").replace(/\s+/g, "-")}.png`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: T.red, color: "#fff" }}>
            <Save size={16} /> Descargar imagen (PNG)
          </a>
          <div className="text-xs text-center" style={{ color: T.muted }}>
            Descárgala y compártela directamente por WhatsApp con el equipo.
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------
   Impresión en UNA hoja A4.
   Si el contenido es más alto que la hoja, se reduce lo justo al imprimir o
   guardar como PDF (nunca por debajo del 70 %). Se mide con el mismo ancho
   y los mismos márgenes que tendrá la hoja impresa.
   ------------------------------------------------------------ */
function ajusteA4(html, opts = {}) {
  const m = html.match(/@page\s*{\s*size:\s*A4;\s*margin:\s*(\d+)mm/);
  const margen = m ? Number(m[1]) : 10;
  const css = "<style>@media print { .sheet { zoom: var(--ajuste-a4, 1); } }</style>";
  const script = "<script>(function(){var MARGEN=" + margen + ",MINIMO=0.7,FLUJO=" + (opts.flujo || 0) + ";" +
    "function ajustar(){var hoja=document.querySelector('.sheet');if(!hoja)return;" +
    "var st=document.createElement('style');" +
    "st.textContent='.sheet{padding:0 !important;box-shadow:none !important;border-radius:0 !important;max-width:none !important;width:'+(210-2*MARGEN)+'mm !important;zoom:1 !important} body{padding:0 !important} .toolbar{display:none !important}';" +
    "document.head.appendChild(st);var alto=hoja.getBoundingClientRect().height;document.head.removeChild(st);" +
    "var util=(297-2*MARGEN)/25.4*96;var raw=Math.floor(util/alto*0.98*100)/100;var z=alto>util?(FLUJO?(raw>=FLUJO?raw:1):Math.max(MINIMO,raw)):1;" +
    "document.documentElement.style.setProperty('--ajuste-a4',String(z));}" +
    "window.addEventListener('load',function(){ajustar();setTimeout(ajustar,150);});window.addEventListener('beforeprint',ajustar);})();<\/script>";
  const conCss = html.includes("</head>") ? html.replace("</head>", css + "</head>") : css + html;
  const campo = !html.includes("data-blanco=") ? "" : "<style>@media print{#pzCampoBtn{display:none!important}}</style><script>(function(){" +
    "var KEY='pz-print-campo';function modo(){try{return localStorage.getItem(KEY)==='blanco';}catch(e){return false;}}" +
    "function pintar(){var b=modo();document.querySelectorAll('img[data-blanco]').forEach(function(i){i.src=b?i.getAttribute('data-blanco'):i.getAttribute('data-color');});" +
    "var bt=document.getElementById('pzCampoBtn');if(bt)bt.textContent=b?'Campo: blanco (ahorra tinta) · pulsa para campo a rayas':'Campo: a rayas · pulsa para campo blanco (ahorra tinta)';}" +
    "window.addEventListener('load',function(){var bt=document.createElement('button');bt.id='pzCampoBtn';bt.type='button';" +
    "bt.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99;font:700 13px sans-serif;background:#0B1F3A;color:#fff;border:0;border-radius:12px;padding:11px 16px;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer';" +
    "bt.onclick=function(){try{localStorage.setItem(KEY,modo()?'color':'blanco');}catch(e){}pintar();};document.body.appendChild(bt);pintar();});})();<\/script>";
  return conJustificado(conCss.includes("</body>") ? conCss.replace("</body>", script + campo + "</body>") : conCss + script + campo);
}

// Justifica los textos de varias líneas de cualquier hoja de impresión (tareas, sesiones,
// informes…). Los títulos, cifras y textos centrados o a la derecha no se tocan.
function conJustificado(html) {
  const script = "<script>(function(){function justificar(){" +
    "document.querySelectorAll('p,li,div,td,dd,blockquote').forEach(function(el){" +
    "if(el.closest('.toolbar,#pz-demo-barra,#pzCampoBtn,.header,thead'))return;" +
    "var t=false;for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&n.textContent.trim().length>1){t=true;break;}}if(!t)return;" +
    "var cs=getComputedStyle(el);if(cs.display.indexOf('flex')>=0||cs.display.indexOf('grid')>=0||cs.display==='inline')return;" +
    "if(cs.textAlign!=='start'&&cs.textAlign!=='left')return;" +
    "var lh=parseFloat(cs.lineHeight);if(!lh)lh=parseFloat(cs.fontSize)*1.3;" +
    "if(el.getBoundingClientRect().height>lh*1.6)el.style.textAlign='justify';});}" +
    "if(document.readyState==='complete')justificar();else window.addEventListener('load',justificar);})();<\/script>";
  return html.includes("</body>") ? html.replace("</body>", script + "</body>") : html + script;
}

function printPlayerCard(p, config, ranking, playerMatches, playerTrainings) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  const sc = stateColor(p.estado);

  const asistidos = playerTrainings.filter((t) => t.asistencia?.find((a) => a.jugadorId === p.id && a.estado === "Asiste")).length;
  const convocatorias = playerMatches.length;

  const dato = (label, value) => `<div class="datoBox"><div class="datoLabel">${esc(label)}</div><div class="datoValue">${esc(value === 0 ? "0" : (value ?? "—"))}</div></div>`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ficha — ${esc(p.nombre)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; margin: 0; padding: 14px; background: #E9EDF3; font-size: 12px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 22px 26px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #0B1F3A; padding-bottom: 14px; margin-bottom: 20px; }
    .header img { width: 46px; height: 46px; object-fit: contain; border-radius: 10px; }
    .headerInfo { flex: 1; }
    .photo { width: 78px; height: 78px; object-fit: cover; border-radius: 14px; border: 2px solid #E2E8F0; }
    .item { margin: 3px 0; font-size: 11.5px; line-height: 1.45; }
    .block { font-size: 11.5px; line-height: 1.5; }
    .tbl { width: 100%; border-collapse: collapse; font-size: 10.5px; }
    .tbl th { background: #F1F5F9; text-align: left; padding: 4px 6px; border: 1px solid #E2E8F0; font-size: 9.5px; text-transform: uppercase; color: #475569; }
    .tbl td { padding: 4px 6px; border: 1px solid #E2E8F0; }
    .teamName { font-size: 16px; font-weight: 800; color: #0B1F3A; }
    .teamMeta { font-size: 11px; color: #64748B; margin-top: 2px; }
    .headerRight { text-align: right; font-size: 10px; color: #64748B; }
    .playerTop { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
    .numBox { width: 60px; height: 60px; border-radius: 14px; background: #0B1F3A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 900; flex-shrink: 0; }
    .playerName { font-size: 22px; font-weight: 900; color: #0B1F3A; }
    .playerSub { font-size: 12px; color: #64748B; margin-top: 2px; }
    .pill { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 6px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
    .datoBox { background: #F5F7FA; border-radius: 10px; padding: 10px 12px; }
    .datoLabel { font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94A3B8; letter-spacing: 0.3px; }
    .datoValue { font-size: 14px; font-weight: 800; color: #0B1F3A; margin-top: 2px; }
    .section { margin-bottom: 16px; }
    .sectionTitle { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fff; background: #0B1F3A; padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 8px; }
    .obs { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px; font-size: 12px; min-height: 40px; }
    .footer { margin-top: 18px; text-align: center; font-size: 9px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 8px; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div class="sheet">
      <div class="header">
        ${config.logo ? `<img src="${config.logo}" />` : ""}
        <div class="headerInfo">
          <div class="teamName">${esc(config.teamName || "Equipo")}</div>
          <div class="teamMeta">${esc(config.category || "")}${config.category && config.season ? " · " : ""}${esc(config.season || "")}</div>
        </div>
        <div class="headerRight">Ficha del jugador<br/><b style="color:#0B1F3A;">${fecha}</b></div>
      </div>

      <div class="playerTop">
        ${p.foto ? `<img class="photo" src="${p.foto}" alt="" />` : ""}
        <div class="numBox">${esc(p.numero)}</div>
        <div>
          <div class="playerName">${esc(p.nombre)}</div>
          <div class="playerSub">${esc(p.posicion)}${p.secundarias?.length ? ` · también: ${esc(p.secundarias.join(", "))}` : ""}</div>
          <span class="pill" style="background:${sc.bg};color:${sc.color};">${esc(p.estado)}</span>
        </div>
      </div>

      ${FICHA_SECCIONES.filter((sec) => sec.id !== "E").map((sec) => {
        const campos = fichaCamposConValor(p, sec, config);
        if (!campos.length) return "";
        return `<div class="section"><div class="sectionTitle">${sec.id} · ${esc(sec.titulo)}</div><div class="grid">${campos.map(([c, v]) => (c.full
          ? `<div class="datoBox" style="grid-column: 1 / -1;"><div class="datoLabel">${esc(c.label)}</div><div class="datoValue" style="white-space:pre-wrap;">${esc(v)}</div></div>`
          : dato(c.label, v))).join("")}</div></div>`;
      }).join("")}

      <div class="section">
        <div class="sectionTitle">Estadísticas</div>
        <div class="grid" style="grid-template-columns: repeat(4, 1fr);">
          ${dato("Minutos jugados", p.stats?.minutos ?? 0)}
          ${dato("Goles", p.stats?.goles ?? 0)}
          ${dato("Tarjetas amarillas", p.stats?.amarillas ?? 0)}
          ${dato("Tarjetas rojas", p.stats?.rojas ?? 0)}
        </div>
      </div>

      ${(() => {
        const tests = [...(p.tests || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
        if (!tests.length) return "";
        const grouped = {};
        tests.forEach((t) => { (grouped[t.nombre] = grouped[t.nombre] || []).push(t); });
        const rows = Object.entries(grouped).map(([nombre, arr]) => {
          const linea = arr.map((t) => `${esc(t.fecha)}: ${esc(t.medicion) || "-"} (${esc(valoracionTestTexto(t))})`).join(" &nbsp;→&nbsp; ");
          return `<div class="item"><b>${esc(nombre)}</b> (${esc(arr[0].tipo)}${arr[0].espacio ? ` · ${esc(arr[0].espacio)}` : ""}): ${linea}</div>`;
        }).join("");
        return `<div class="section"><div class="sectionTitle" style="background:#F4B400;">Test</div>${rows}</div>`;
      })()}

      <div class="footer">Generado con la Plataforma Puntualización Zonal</div>
    </div>
  </body></html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html, { flujo: 0.78 })); w.document.close(); }
}

function printCoachingReport(p, config) {
  const esc = (x) => (x == null ? "" : x).toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const co = p.coaching || {};
  const { slots, entrenador, ultima, previa, tendencia } = coachingResumen(co);
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  const corta = (f) => String(f || "").split("-").reverse().join("/");
  const celda = (v) => (typeof v === "number" ? `<td class="n"><span style="background:${colorNota(v)}">${v}</span></td>` : `<td class="n"><span class="vacio">–</span></td>`);
  const flecha = (t) => (t === 1 ? `<span style="color:#1B7A44;font-weight:800;">▲</span>` : t === -1 ? `<span style="color:#E63946;font-weight:800;">▼</span>` : t === 0 ? `<span style="color:#64748B;font-weight:800;">=</span>` : "");
  const cab = COACHING_SLOTS.map(([k, l]) => `<th>${k === "auto" ? "Auto" : l.replace("Evaluación ", "E")}<div class="f">${co[k]?.fecha ? corta(co[k].fecha) : ""}</div></th>`).join("");
  const resumen = COACHING_AREAS.map((a) => {
    const med = COACHING_SLOTS.map(([k]) => { const m = co[k]?.fecha ? mediaArea(co[k].valores, a) : null; return m == null ? `<td class="n"><span class="vacio">–</span></td>` : `<td class="n"><span style="background:${colorNota(Math.round(m))}">${m}</span></td>`; }).join("");
    const ma = ultima && previa ? (mediaArea(ultima.ev.valores, a) ?? 0) - (mediaArea(previa.ev.valores, a) ?? 0) : null;
    return `<tr><td class="lab"><span class="sw" style="background:${a.color}"></span>${esc(a.titulo.replace("Fundamentos ", ""))}</td>${med}<td class="n">${ma == null ? "" : flecha(ma > 0.04 ? 1 : ma < -0.04 ? -1 : 0)}</td></tr>`;
  }).join("");
  const tablaArea = (a) => `<div class="bloque"><div class="cabArea" style="background:${a.color}">${esc(a.titulo)}</div><table><thead><tr><th class="lab">Fundamento</th>${cab}<th>Evol.</th></tr></thead><tbody>${a.items.map((nombre, i) => `<tr><td class="lab">${i + 1} · ${esc(nombre)}</td>${COACHING_SLOTS.map(([k]) => celda(co[k]?.fecha ? co[k].valores?.[`${a.k}.${i}`] : undefined)).join("")}<td class="n" style="width:62px;">${coachingSparkHTML(entrenador.map((e) => e.ev.valores?.[`${a.k}.${i}`]))}</td></tr>`).join("")}</tbody></table></div>`;
  // mayores diferencias entre lo que dice el jugador y lo que ve el entrenador
  const diffs = [];
  if (co.auto?.fecha && ultima) COACHING_AREAS.forEach((a) => a.items.forEach((nombre, i) => { const x = co.auto.valores?.[`${a.k}.${i}`], y = ultima.ev.valores?.[`${a.k}.${i}`]; if (typeof x === "number" && typeof y === "number" && x !== y) diffs.push({ nombre, x, y, d: x - y }); }));
  diffs.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  const bloqueDifs = diffs.length ? `<div class="bloque"><div class="cabArea" style="background:#0B1F3A">Autoevaluación frente a ${esc(ultima.label)}: mayores diferencias</div><table><thead><tr><th class="lab">Fundamento</th><th>Jugador</th><th>Entrenador</th><th>Dif.</th></tr></thead><tbody>${diffs.slice(0, 6).map((d) => `<tr><td class="lab">${esc(d.nombre)}</td><td class="n">${d.x}</td><td class="n">${d.y}</td><td class="n" style="font-weight:800;color:${d.d > 0 ? "#B45309" : "#1B7A44"}">${d.d > 0 ? "+" : ""}${d.d}</td></tr>`).join("")}</tbody></table></div>` : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informe privado de coaching — ${esc(p.nombre)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; margin: 0; padding: 14px; background: #E9EDF3; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; } .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 0 0 18px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); overflow: hidden; }
    .banda { background: #0B1F3A; color: #fff; padding: 16px 22px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .banda .t { font-size: 17px; font-weight: 900; letter-spacing: .3px; text-transform: uppercase; } .banda .s { font-size: 10px; opacity: .8; margin-top: 2px; }
    .privado { background: #FFF1F1; color: #B42318; border-bottom: 1px solid #F5C2C2; padding: 6px 22px; font-size: 10px; font-weight: 800; }
    .cuerpo { padding: 14px 22px 0; }
    .jug { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .jug img { width: 64px; height: 64px; object-fit: cover; border-radius: 12px; border: 2px solid #E2E8F0; }
    .jug .num { width: 44px; height: 44px; border-radius: 10px; background: #0B1F3A; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
    .jug .nom { font-size: 17px; font-weight: 900; color: #0B1F3A; } .jug .sub { color: #64748B; font-size: 11px; }
    .bloque { margin-bottom: 10px; page-break-inside: avoid; }
    .cabArea { color: #fff; font-weight: 800; font-size: 10.5px; padding: 4px 10px; text-transform: uppercase; letter-spacing: .3px; }
    table { width: 100%; border-collapse: collapse; } th { text-align: center; font-size: 9px; text-transform: uppercase; color: #475569; background: #F1F5F9; padding: 3px 4px; border: 1px solid #E2E8F0; }
    th .f { font-weight: 600; text-transform: none; color: #94A3B8; font-size: 8.5px; }
    td { border: 1px solid #E2E8F0; padding: 2px 6px; } td.lab { text-align: left; } th.lab { text-align: left; }
    td.n { text-align: center; width: 46px; } td.n span { display: inline-block; min-width: 20px; padding: 1px 4px; border-radius: 9px; color: #fff; font-weight: 800; font-size: 10px; } td.n span.vacio { background: none; color: #CBD5E1; }
    .sw { display: inline-block; width: 9px; height: 9px; border-radius: 2px; margin-right: 6px; }
    .caja { border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 10px; min-height: 54px; white-space: pre-wrap; font-size: 11px; line-height: 1.5; }
    .firmas { display: flex; gap: 30px; margin-top: 22px; } .firmas div { flex: 1; border-top: 1px solid #94A3B8; padding-top: 4px; font-size: 10px; color: #64748B; text-align: center; }
    .pie { text-align: center; color: #94A3B8; font-size: 9px; margin-top: 12px; }
    @media print { body { background: #fff; padding: 0; } .toolbar { display: none !important; } .sheet { box-shadow: none; border-radius: 0; max-width: 100%; } }
  </style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="banda"><div><div class="t">Informe privado de coaching</div><div class="s">${esc(config.teamName || "Equipo")}${config.category ? " · " + esc(config.category) : ""}${config.season ? " · " + esc(config.season) : ""}</div></div><div style="text-align:right;font-size:10px;">Emitido el<br/><b>${fecha}</b></div></div>
      <div class="privado">DOCUMENTO PRIVADO entre el jugador y el entrenador. No es el informe de rendimiento del jugador ni se comparte con el equipo.</div>
      <div class="cuerpo">
        <div class="jug">${p.foto ? `<img src="${p.foto}" alt="" />` : ""}<div class="num">${esc(p.numero)}</div><div><div class="nom">${esc(p.nombre)}</div><div class="sub">${esc(p.posicion)}${calcAge(p.dob) ? ` · ${calcAge(p.dob)} años` : ""}</div></div></div>
        ${slots.length ? `<div class="bloque"><div class="cabArea" style="background:#0B1F3A">Resumen por áreas (promedio del 1 al 10)</div><table><thead><tr><th class="lab">Área</th>${cab}<th>Evol.</th></tr></thead><tbody>${resumen}</tbody></table></div>` : `<div class="caja">Todavía no hay evaluaciones registradas.</div>`}
        ${entrenador.length ? `<div class="bloque"><div class="cabArea" style="background:#0B1F3A">Evolución del promedio por área</div><div style="padding:6px 8px;">${coachingGraficoHTML(co, { impresion: true })}</div></div>` : ""}
        ${bloqueDifs}
        ${slots.length ? COACHING_AREAS.map(tablaArea).join("") : ""}
        <div class="bloque"><div class="cabArea" style="background:#0B1F3A">Objetivo general y observaciones del entrenador</div><div class="caja">${esc(co.objetivoGeneral) || ""}</div></div>
        <div class="firmas"><div>Jugador</div><div>Entrenador</div></div>
        <div class="pie">Generado con la Plataforma Puntualización Zonal · Documento privado</div>
      </div>
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html, { flujo: 0.78 })); w.document.close(); }
}

function printPlantilla(players, config, season) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const staffLine = (season?.cuerpoTecnico || []).map((c) => `${esc(c.nombre)}${c.cargo ? ` (${esc(c.cargo)})` : ""}`).join(", ") || "—";
  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

  // % de asistencia a entrenamientos: sesiones a las que asistió entre las sesiones en que estaba registrado.
  const asistenciaEntrenos = (p) => {
    const tot = p.stats?.entrenamientosTotales || 0;
    return tot ? `${Math.round(((p.stats?.entrenamientosRealizados || 0) / tot) * 100)}%` : "—";
  };

  const rows = [...players]
    .sort((a, b) => (a.numero || 0) - (b.numero || 0))
    .map((p) => {
      const rank = rankingScore(p, config.rankingWeights);
      const sc = stateColor(p.estado);
      return `<tr>
        <td class="num">${esc(p.numero)}</td>
        <td class="nombre">${esc(p.nombre)}</td>
        <td>${p.dob ? esc(p.dob) : "—"}</td>
        <td class="center">${p.dob ? calcAge(p.dob) : "—"}</td>
        <td><span class="statePill" style="background:${sc.bg};color:${sc.color};">${esc(p.estado)}</span></td>
        <td>${esc(p.posicion)}</td>
        <td class="center">${p.stats?.minutos ?? 0}</td>
        <td class="center">${p.stats?.goles ?? 0}</td>
        <td class="center">${asistenciaEntrenos(p)}</td>
        <td class="center rank">${rank}</td>
      </tr>`;
    }).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Plantilla — ${esc(config.teamName)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; margin: 0; padding: 14px; background: #E9EDF3; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 18px 22px 20px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .header { display: flex; align-items: center; gap: 12px; border-bottom: 3px solid #0B1F3A; padding-bottom: 12px; margin-bottom: 14px; }
    .header img { width: 46px; height: 46px; object-fit: contain; border-radius: 10px; }
    .headerInfo { flex: 1; }
    .teamName { font-size: 16px; font-weight: 800; color: #0B1F3A; }
    .teamMeta { font-size: 10px; color: #64748B; margin-top: 2px; }
    .headerRight { text-align: right; font-size: 9.5px; color: #64748B; }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    thead th { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.2px; color: #fff; background: #0B1F3A; padding: 7px 6px; text-align: left; }
    thead th.center { text-align: center; }
    tbody td { font-size: 10.5px; padding: 6px 6px; border-bottom: 1px solid #E2E8F0; }
    tbody tr:nth-child(even) { background: #FAFBFC; }
    td.num { font-weight: 800; color: #0B1F3A; text-align: center; width: 30px; }
    td.nombre { font-weight: 700; }
    td.center { text-align: center; }
    td.rank { font-weight: 800; color: #0B1F3A; }
    .statePill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 999px; display: inline-block; }
    .footer { margin-top: 14px; text-align: center; font-size: 8.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 8px; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div class="sheet">
      <div class="header">
        ${config.logo ? `<img src="${config.logo}" />` : ""}
        <div class="headerInfo">
          <div class="teamName">${esc(config.teamName || "Equipo")}</div>
          <div class="teamMeta">${esc(config.category || "")}${season?.competicion ? ` · ${esc(season.competicion)}` : ""}</div>
          <div class="teamMeta">Cuerpo técnico: ${staffLine}</div>
        </div>
        <div class="headerRight">Fecha de impresión<br/><b style="color:#0B1F3A;">${fecha}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nº</th><th>Jugador</th><th>Fecha nac.</th><th class="center">Edad</th>
            <th>Estado</th><th>Posición</th><th class="center">Min.</th><th class="center">Goles</th><th class="center">% Asist. entrenos</th><th class="center">Ranking</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Generado con la Plataforma Puntualización Zonal · ${players.length} jugadores</div>
    </div>
  </body></html>`;

  const w = window.open("", "_blank");
  w.document.write(ajusteA4(html));
  w.document.close();
}

/* ---------------- Storage helpers ---------------- */

/* Almacenamiento local del navegador (localStorage).
   Cada dispositivo (móvil, tablet, ordenador) guarda su propia copia. */
// Cada cuenta guarda sus datos aparte en el dispositivo: la clave lleva el identificador de la cuenta.
// Sin identificador (pruebas o modo local) se usan las claves de siempre.
let ESPACIO_USUARIO = "";
// Modo demostración (proyecto aparte, sin cuenta): todo funciona, pero nada se guarda
// (los datos viven en memoria y se pierden al recargar), no se imprime ni se descarga.
let MODO_DEMO = false;
let URL_COMPRA_DEMO = "https://entrenadordesdecero.com/#precios";
const ALMACEN_DEMO = (() => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } };
})();
const almacen = () => (MODO_DEMO ? ALMACEN_DEMO : window.localStorage);

function avisoDemo(texto) {
  if (typeof document === "undefined") return;
  const previo = document.getElementById("pz-demo-aviso");
  if (previo) previo.remove();
  const d = document.createElement("div");
  d.id = "pz-demo-aviso";
  d.setAttribute("role", "status");
  d.setAttribute("style", "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;background:#0B1F3A;color:#fff;font:700 14px/1.45 system-ui,sans-serif;padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);max-width:min(92vw,460px);text-align:center;");
  d.textContent = texto || "En la demostración no se puede guardar, imprimir ni descargar.";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3500);
}

// Marca de agua grande y repetida, para que ninguna captura sirva.
function marcaAguaDemoCSS() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="380"><text x="280" y="210" text-anchor="middle" transform="rotate(-28 280 190)" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="900" fill="rgba(230,57,70,0.24)">DEMOSTRACIÓN</text></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

// Añade a cada hoja de impresión: marca de agua, sin botón de imprimir y sin poder imprimir ni guardar.
function marcarHojaDemo(html) {
  const cierreScript = "<" + "/script>";
  const estilo = `<style>
    .btnPrint{display:none!important}
    #pz-demo-marca{position:fixed;inset:0;pointer-events:none;z-index:2147483646;background-image:${marcaAguaDemoCSS()};background-repeat:repeat;background-size:560px 380px}
    #pz-demo-barra{position:sticky;top:0;z-index:2147483647;background:#E63946;color:#fff;font:700 14px/1.4 Arial,sans-serif;padding:10px 14px;text-align:center}
    #pz-demo-barra a{color:#fff;text-decoration:underline}
    #pz-demo-impresion{display:none}
    @media print{body>*:not(#pz-demo-impresion){display:none!important}#pz-demo-impresion{display:flex!important;height:90vh;align-items:center;justify-content:center;font:900 64px Arial,sans-serif;color:#E63946;text-align:center}}
  </style>`;
  const cuerpo = `<div id="pz-demo-barra">Vista previa de demostración. Para imprimir o guardar en PDF, <a href="${URL_COMPRA_DEMO}" target="_blank" rel="noopener">elige tu plan</a>.</div>
  <div id="pz-demo-marca"></div><div id="pz-demo-impresion">DEMOSTRACIÓN</div>
  <script>(function(){var msg="Es una demostración: no se puede imprimir ni guardar.";window.print=function(){alert(msg)};
  document.addEventListener("keydown",function(e){var k=(e.key||"").toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==="p"||k==="s")){e.preventDefault();e.stopPropagation();alert(msg)}},true);
  document.addEventListener("contextmenu",function(e){e.preventDefault()},true);
  document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[download]");if(a){e.preventDefault();alert(msg)}},true);
  window.addEventListener("load",function(){var b=document.getElementById("pz-demo-barra");if(b&&document.body.firstChild!==b)document.body.insertBefore(b,document.body.firstChild)});})();${cierreScript}`;
  let out = html;
  out = /<\/head>/i.test(out) ? out.replace(/<\/head>/i, `${estilo}</head>`) : estilo + out;
  out = /<\/body>/i.test(out) ? out.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${cuerpo}</body>`) : out + cuerpo;
  return out;
}

let _proteccionDemoInstalada = false;
function instalarProteccionDemo() {
  if (_proteccionDemoInstalada || typeof window === "undefined") return;
  _proteccionDemoInstalada = true;
  // Hojas de impresión (todas se abren en una ventana nueva y se escriben con document.write).
  const abrir = window.open.bind(window);
  window.open = function (...args) {
    const w = abrir(...args);
    try {
      if (w && w.document) {
        const d = w.document;
        const escribir = d.write.bind(d);
        d.write = (...partes) => escribir(marcarHojaDemo(partes.join("")));
        w.print = () => w.alert("Es una demostración: no se puede imprimir ni guardar.");
      }
    } catch (e) { /* ventana de otro origen: no se toca */ }
    return w;
  };
  // Descargas (copias de seguridad, imágenes, exportaciones).
  const clicOriginal = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute("download")) { avisoDemo("En la demostración no se puede descargar nada."); return; }
    return clicOriginal.call(this);
  };
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest && e.target.closest("a[download]");
    if (a) { e.preventDefault(); e.stopPropagation(); avisoDemo("En la demostración no se puede descargar nada."); }
  }, true);
  // Imprimir o guardar la propia plataforma.
  window.print = () => avisoDemo("En la demostración no se puede imprimir.");
  document.addEventListener("keydown", (e) => {
    const k = (e.key || "").toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "p" || k === "s")) { e.preventDefault(); e.stopPropagation(); avisoDemo(); }
  }, true);
  const st = document.createElement("style");
  st.textContent = `@media print{body *{display:none!important}body::after{content:"DEMOSTRACIÓN";display:block;font:900 64px Arial,sans-serif;color:#E63946;text-align:center;margin-top:40vh}}`;
  document.head.appendChild(st);
}
const claveLocal = (key) => (ESPACIO_USUARIO ? `${key}::${ESPACIO_USUARIO}` : key);
async function loadKey(key, fallback) {
  try {
    const raw = almacen().getItem(claveLocal(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("storage read error", key, e);
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    almacen().setItem(claveLocal(key), JSON.stringify(value));
  } catch (e) {
    console.error("storage write error", key, e);
    try { window.dispatchEvent(new CustomEvent("pz-storage-error", { detail: { key } })); } catch (e2) { /* sin ventana */ }
  }
}

/* ---------------- Small UI atoms ---------------- */

function PitchDivider({ color = T.red }) {
  return (
    <div className="h-[3px] w-full rounded-full" style={{
      background: `repeating-linear-gradient(115deg, ${color} 0px, ${color} 14px, transparent 14px, transparent 24px)`,
    }} />
  );
}

function Eyebrow({ children }) {
  return <div className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: T.red }}>{children}</div>;
}

function Card({ children, className = "", style = {}, onClick }) {
  return <div className={`bg-white rounded-2xl border ${className}`} style={{ borderColor: T.line, ...style }} onClick={onClick}>{children}</div>;
}

function StatTile({ label, value, sub, accent = T.navy, icon: Icon }) {
  return (
    <Card className="p-4 flex flex-col items-center gap-2 min-w-0 text-center">
      <div className="flex items-center justify-center gap-1.5 w-full">
        <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: T.muted }}>{label}</span>
        {Icon && <Icon size={16} style={{ color: accent }} />}
      </div>
      <div className="text-2xl font-extrabold tabular-nums" style={{ color: T.navy }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: T.muted }}>{sub}</div>}
    </Card>
  );
}

function Pill({ children, color = T.navy, bg = "#EEF2F8" }) {
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ color, background: bg }}>{children}</span>;
}

/* ---- Estado del jugador: quien no está disponible no aparece en convocatorias ni en listas de entrenamiento ---- */
const esDisponible = (p) => p.estado === "Disponible";
const estadoAsistencia = (p) => (esDisponible(p) ? "Asiste" : p.estado === "Lesionado" ? "Lesionado" : "No asiste");
const estadoConvocatoria = (p) => (p.estado === "Lesionado" ? "Lesionado" : p.estado === "Sancionado" ? "Sancionado" : "No convocado");
const asistenciaInicial = (players) => players.map((p) => ({ jugadorId: p.id, estado: estadoAsistencia(p) }));
// Partido abierto: quien ya no está disponible deja de figurar como convocado (y como capitán). Un partido cerrado es historia y no se toca.
function sanearPartido(m, players) {
  if (m.cerrado) return m;
  let cambio = false;
  const convocatoria = (m.convocatoria || []).map((c) => {
    const pl = players.find((x) => x.id === c.jugadorId);
    if (pl && !esDisponible(pl) && c.estado === "Convocado") { cambio = true; return { ...c, estado: estadoConvocatoria(pl) }; }
    return c;
  });
  const cap = m.capitanId && players.some((x) => x.id === m.capitanId && !esDisponible(x)) ? null : m.capitanId;
  if (cap !== m.capitanId) cambio = true;
  return cambio ? { ...m, convocatoria, capitanId: cap } : m;
}
// Entrenamiento de hoy o futuro: quien no está disponible no figura como asistente.
function sanearEntreno(t, players) {
  if ((t.fecha || "") < todayISO()) return t;
  let cambio = false;
  const asistencia = (t.asistencia || []).map((a) => {
    const pl = players.find((x) => x.id === a.jugadorId);
    if (pl && !esDisponible(pl) && a.estado === "Asiste") { cambio = true; return { ...a, estado: estadoAsistencia(pl) }; }
    return a;
  });
  return cambio ? { ...t, asistencia } : t;
}

/* ---- Evolución de la valoración de un jugador a lo largo de la temporada ---- */
// Solo partidos cerrados. Si no fue convocado o no asistió, cuenta 0 (punto vacío). Si fue convocado y no tiene nota, no hay punto, pero la línea continúa.
function serieEvolucionJugador(playerId, matches) {
  return matches.filter((m) => m.cerrado).slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).map((m) => {
    const conv = (m.convocatoria || []).find((c) => c.jugadorId === playerId);
    const nota = m.valoracionesJugadores ? m.valoracionesJugadores[playerId] : null;
    const base = { fecha: m.fecha, rival: m.rival || "" };
    if (conv && conv.estado === "Convocado") return nota != null && nota !== "" ? { ...base, tipo: "nota", valor: Number(nota) } : { ...base, tipo: "sinNota", valor: null };
    return { ...base, tipo: "ausente", valor: 0 };
  });
}
function resumenEvolucion(serie) {
  const notas = serie.filter((x) => x.tipo === "nota").map((x) => x.valor);
  const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null;
  let tendencia = "";
  if (notas.length >= 2) {
    const mitad = Math.floor(notas.length / 2), prom = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const dif = prom(notas.slice(notas.length - mitad)) - prom(notas.slice(0, mitad));
    tendencia = dif >= 0.5 ? "La valoración ha subido a lo largo de la temporada." : dif <= -0.5 ? "La valoración ha bajado a lo largo de la temporada." : "La valoración se mantiene estable.";
  }
  return { media, tendencia, ausencias: serie.filter((x) => x.tipo === "ausente").length, total: serie.length };
}
function evolucionHTML(serie) {
  const esc = (t) => String(t ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  if (serie.length < 1) return `<div style="font-size:12px;color:#64748B;">Todavía no hay partidos cerrados para mostrar la evolución.</div>`;
  const W = 640, H = 230, L = 34, R = 14, Tp = 16, B = 40, n = serie.length;
  const x = (i) => (n === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (n - 1));
  const y = (v) => Tp + (1 - v / 10) * (H - Tp - B);
  const res = resumenEvolucion(serie);
  const conLinea = serie.map((d, i) => ({ d, i })).filter((o) => o.d.tipo !== "sinNota");
  const linea = conLinea.length > 1 ? `<polyline fill="none" stroke="#0B1F3A" stroke-width="2.2" stroke-linejoin="round" points="${conLinea.map((o) => `${x(o.i).toFixed(1)},${y(o.d.valor).toFixed(1)}`).join(" ")}"/>` : "";
  const rejilla = [0, 2, 4, 6, 8, 10].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#E2E8F0" stroke-width="1"/><text x="${L - 6}" y="${y(v) + 3}" text-anchor="end" font-size="9" fill="#64748B">${v}</text>`).join("");
  const paso = n > 24 ? 3 : n > 12 ? 2 : 1;
  const puntos = serie.map((d, i) => {
    const fx = x(i), fecha = new Date(`${d.fecha}T12:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
    const etiqueta = i % paso === 0 ? `<text x="${fx}" y="${H - B + 14}" text-anchor="middle" font-size="8.5" fill="#64748B">${esc(fecha)}</text>` : "";
    if (d.tipo === "sinNota") return etiqueta;
    const tip = `<title>${esc(fecha)} vs ${esc(d.rival)}: ${d.tipo === "ausente" ? "no asistió (0)" : d.valor}</title>`;
    const marca = d.tipo === "ausente"
      ? `<circle cx="${fx}" cy="${y(0)}" r="4.2" fill="#fff" stroke="#E5555F" stroke-width="2">${tip}</circle>`
      : `<circle cx="${fx}" cy="${y(d.valor)}" r="4.2" fill="#0B1F3A">${tip}</circle>` + (n <= 18 ? `<text x="${fx}" y="${y(d.valor) - 8}" text-anchor="middle" font-size="9" font-weight="700" fill="#0B1F3A">${d.valor}</text>` : "");
    return marca + etiqueta;
  }).join("");
  const media = res.media != null ? `<line x1="${L}" x2="${W - R}" y1="${y(res.media)}" y2="${y(res.media)}" stroke="#2A9D5C" stroke-width="1.4" stroke-dasharray="5 4"/><text x="${L + 4}" y="${y(res.media) - 4}" text-anchor="start" font-size="9" font-weight="700" fill="#2A9D5C">Media ${res.media.toFixed(1).replace(".", ",")}</text>` : "";
  return `<div><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Evolución de la valoración del jugador en los partidos de la temporada" style="display:block;max-width:${W}px;">${rejilla}${media}${linea}${puntos}</svg>
    <div style="font-size:10px;color:#64748B;margin-top:4px;line-height:1.5;"><b style="color:#0B1F3A;">●</b> Nota del entrenador (0 a 10) &nbsp; <b style="color:#E5555F;">○</b> No asistió o no fue convocado: cuenta 0 &nbsp; <b style="color:#2A9D5C;">- - -</b> Media de los partidos jugados.<br>${res.tendencia ? esc(res.tendencia) + " " : ""}${res.ausencias ? `Ausencias: ${res.ausencias} de ${res.total} partidos.` : ""}</div></div>`;
}

function stateColor(estado) {
  switch (estado) {
    case "Disponible": return { color: T.green, bg: "#E7F6ED" };
    case "Lesionado": return { color: T.redLight, bg: "#FFECEC" };
    case "Sancionado": return { color: T.yellow, bg: "#FFF6DE" };
    case "Baja": return { color: T.muted, bg: "#EEF1F5" };
    case "En recuperación": return { color: "#C2410C", bg: "#FFEDD5" };
    case "Ausente temporal": return { color: T.muted, bg: "#EEF1F5" };
    default: return { color: T.navy3, bg: "#EEF2F8" };
  }
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: T.muted }}>{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 transition";
const inputStyle = { borderColor: T.line, "--tw-ring-color": T.navy3 };

function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} style={{ ...inputStyle, ...(props.style || {}) }} />;
}
function TextArea(props) {
  return <textarea {...props} className={`${inputCls} ${props.className || ""}`} style={{ ...inputStyle, minHeight: 72, ...(props.style || {}) }} />;
}
function Select({ children, ...props }) {
  return <select {...props} className={`${inputCls} bg-white ${props.className || ""}`} style={{ ...inputStyle, fontSize: 14, ...(props.style || {}) }}>{children}</select>;
}

/* Reemplazo propio de <select> para listas largas: en vez del desplegable nativo
   (que en Android se ve enorme y con letra grande), abre una ventana con botones táctiles. */
function PickerField({ value, options, onChange, placeholder = "Seleccionar…", className = "" }) {
  const [open, setOpen] = useState(false);
  const normalized = options.map((o) => (typeof o === "object" ? o : { value: o, label: o }));
  const selected = normalized.find((o) => o.value === value);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-between bg-white ${className}`}
        style={{ borderColor: T.line, color: selected ? T.text : T.muted }}>
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronRight size={15} style={{ color: T.muted, transform: "rotate(90deg)", flexShrink: 0 }} />
      </button>
      {open && (
        <Modal title={placeholder} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-1.5 max-h-[55vh] overflow-y-auto">
            {normalized.map((o) => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className="p-3 rounded-xl text-left text-sm font-bold border"
                style={{ borderColor: value === o.value ? T.navy : T.line, background: value === o.value ? "#EEF2F8" : "#fff", color: T.navy }}>
                {o.label}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

function Btn({ children, onClick, variant = "primary", icon: Icon, className = "", type = "button", disabled, title }) {
  const styles = {
    primary: { background: T.navy, color: "#fff" },
    accent: { background: T.red, color: "#fff" },
    ghost: { background: "transparent", color: T.navy, border: `1px solid ${T.line}` },
    danger: { background: "#FFECEC", color: T.redLight },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} aria-label={title}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition active:scale-[0.97] disabled:opacity-40 ${className}`}
      style={styles[variant]}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className={`bg-white w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"} sm:rounded-2xl rounded-t-2xl`}
        style={{ maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: T.line, flex: "0 0 auto" }}>
          <h3 className="font-extrabold text-lg" style={{ color: T.navy }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="px-5 py-4" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>{children}</div>
      </div>
    </div>
  );
}

function Trend({ values }) {
  if (!values || values.length < 2) return <Minus size={14} style={{ color: T.muted }} />;
  const diff = values[values.length - 1] - values[values.length - 2];
  if (diff > 0.15) return <TrendingUp size={14} style={{ color: T.green }} />;
  if (diff < -0.15) return <TrendingDown size={14} style={{ color: T.redLight }} />;
  return <Minus size={14} style={{ color: T.muted }} />;
}

/* ============================================================
   APP
   ============================================================ */

const NAV = [
  { key: "dashboard", label: "Panel informativo", icon: LayoutGrid },
  { key: "temporada", label: "Temporada y Planificación", icon: Target },
  { key: "plantilla", label: "Plantilla", icon: Users },
  { key: "tareas", label: "Biblioteca de tareas", icon: BookOpen },
  { key: "entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { key: "partidos", label: "Partidos", icon: Swords },
  { key: "pizarra", label: "Pizarra", icon: ClipboardList },
  { key: "rival", label: "Análisis del rival", icon: Eye },
  { key: "calendario", label: "Calendario", icon: Calendar },
  { key: "estadisticas", label: "Estadísticas", icon: BarChart3 },
  { key: "informes", label: "Informes", icon: FileText },
  { key: "configuracion", label: "Configuración", icon: Settings },
];

// Qué módulos desbloquea cada plan del libro. El dashboard siempre queda
// visible para todos (es solo un resumen), y "configuracion" también se dejó
// abierta porque no expone datos de otros módulos bloqueados.
export const MODULOS_POR_PLAN = {
  // Esencial: aprende con el libro y las 45 tareas; pone a sus jugadores y ve en pantalla (con datos de ejemplo) lo que hay en el siguiente plan.
  esencial: ["dashboard", "plantilla", "tareas", "estadisticas", "configuracion"],
  // Entrenador: gestiona su equipo en el día a día; no planifica la temporada completa ni imprime informes.
  entrenador: ["dashboard", "plantilla", "tareas", "entrenamientos", "partidos", "pizarra", "rival", "calendario", "estadisticas", "configuracion"],
  metodologo: NAV.map((n) => n.key), // todos
};
// Limitaciones dentro de los módulos abiertos de cada plan.
export const CAPACIDADES_POR_PLAN = {
  esencial: { pestanasJugador: ["general"], imprimirInformes: false, estadisticasEjemplo: true, desbloqueaPestanas: "Entrenador" },
  entrenador: { pestanasJugador: ["general", "rendimiento", "valoracion", "tests", "coaching", "historial"], imprimirInformes: false, estadisticasEjemplo: false },
  metodologo: { pestanasJugador: ["general", "rendimiento", "valoracion", "tests", "coaching", "historial"], imprimirInformes: true, estadisticasEjemplo: false },
};
const planDeModulos = (mods) => (Object.entries(MODULOS_POR_PLAN).find(([, v]) => v.length === mods.length && v.every((x) => mods.includes(x))) || ["metodologo"])[0];

export default function App({ plan: planProp, modulosPermitidos: modulosProp, usuarioId, onUpgradeClick, modoDemo = false, urlCompra }) {
  MODO_DEMO = !!modoDemo;
  if (urlCompra) URL_COMPRA_DEMO = urlCompra;
  ESPACIO_USUARIO = MODO_DEMO ? "" : (usuarioId ? String(usuarioId) : "");
  useEffect(() => { if (MODO_DEMO) instalarProteccionDemo(); }, []);
  const modulosPermitidos = modulosProp || (planProp && MODULOS_POR_PLAN[planProp]) || NAV.map((n) => n.key);
  const plan = planProp && MODULOS_POR_PLAN[planProp] ? planProp : planDeModulos(modulosPermitidos);
  const cap = CAPACIDADES_POR_PLAN[plan] || CAPACIDADES_POR_PLAN.metodologo;
  const [loaded, setLoaded] = useState(false);
  const [almacenLleno, setAlmacenLleno] = useState(false);
  useEffect(() => { const h = () => setAlmacenLleno(true); window.addEventListener("pz-storage-error", h); return () => window.removeEventListener("pz-storage-error", h); }, []);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rivals, setRivals] = useState([]);
  const [season, setSeason] = useState(null);
  const [seasonPlanning, setSeasonPlanning] = useState(null);
  const [planning, setPlanning] = useState(null);
  const [standings, setStandings] = useState(null);
  const [pizarra, setPizarra] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      adoptarDatosAnteriores();
      const [c, p, m, t, tk, rv, se, pl2, st, spl, pz] = await Promise.all([
        loadKey("pz-config", null),
        loadKey("pz-players", null),
        loadKey("pz-matches", null),
        loadKey("pz-trainings", null),
        loadKey("pz-tasks", null),
        loadKey("pz-rivals", null),
        loadKey("pz-season", null),
        loadKey("pz-planning", null),
        loadKey("pz-standings", null),
        loadKey("pz-season-planning", null),
        loadKey("pz-pizarra", null),
      ]);
      if (c) {
        // Si la configuración ya existía de una versión anterior, puede faltarle
        // alguno de los factores nuevos de la fórmula de ranking. Se completa
        // con los valores por defecto para que el cálculo no dé "NaN".
        const guardados = c.rankingWeights || {};
        const PESOS_ANTIGUOS = { actitud: 15, goles: 15, asistencias: 10, decisiones: 15, lectura: 10, asistenciaEntreno: 15, instrucciones: 10, tarjetas: -10, liderazgo: 10 };
        const sinTocar = !("tecnica" in guardados) && Object.keys(PESOS_ANTIGUOS).every((k) => guardados[k] === PESOS_ANTIGUOS[k]);
        const NUEVAS = ["tecnica", "velocidad", "fuerza", "elasticidad", "resistencia"];
        const rankingWeights = sinTocar ? { ...DEFAULT_CONFIG.rankingWeights } : { ...DEFAULT_CONFIG.rankingWeights, ...Object.fromEntries(NUEVAS.map((k) => [k, 0])), ...guardados };
        const mergedConfig = { ...c, rankingWeights };
        setConfig(mergedConfig);
        if (JSON.stringify(mergedConfig.rankingWeights) !== JSON.stringify(c.rankingWeights)) {
          await saveKey("pz-config", mergedConfig);
        }
      }
      let pl = p;
      if (!pl) { pl = buildDemoPlayers(); await saveKey("pz-players", pl); }
      setPlayers(pl);
      let mt = m;
      if (!mt) { mt = buildDemoMatches(pl); await saveKey("pz-matches", mt); }
      if (mt.some((x) => x.cerrado === undefined)) {
        // Una sola vez: los partidos antiguos con fecha pasada y marcador se cierran solos; los demás quedan abiertos.
        mt = mt.map((x) => (x.cerrado === undefined ? { ...x, cerrado: !!(x.resultadoFinal && x.fecha && x.fecha <= todayISO()) } : x));
        await saveKey("pz-matches", mt);
      }
      setMatches(mt);
      let tr = t;
      if (!tr) { tr = buildDemoTrainings(pl); await saveKey("pz-trainings", tr); }
      setTrainings(tr);
      let tks = tk;
      if (!tks) {
        // Biblioteca nueva o reseteada: empieza vacía y se llena con las tareas nativas del catálogo (con su gráfico) al sincronizar.
        // Las 57 tareas antiguas sin gráfico ya no se vuelven a crear.
        tks = [];
        await saveKey("pz-tasks", tks);
        await saveKey("pz-tasks-migracion-2025", true);
        await saveKey("pz-tasks-mejoras-2026-10b", true);
      }
      // Migración: si ya existía una biblioteca de tareas guardada en este
      // dispositivo, se le suman las 50 tareas nuevas una sola vez, sin
      // duplicarlas si se vuelve a entrar más adelante.
      const yaMigrado = await loadKey("pz-tasks-migracion-2025", false);
      if (!yaMigrado) {
        const idsExistentes = new Set(tks.map((t) => t.codigo));
        const paraAgregar = NUEVAS_TAREAS_2025.filter((t) => !idsExistentes.has(t.codigo));
        tks = [...tks, ...paraAgregar];
        await saveKey("pz-tasks", tks);
        await saveKey("pz-tasks-migracion-2025", true);
      }
      // Mejoras de contenido (una sola vez): solo rellena lo vacío, nunca pisa ediciones.
      const mejorasAplicadas = await loadKey("pz-tasks-mejoras-2026-10b", false);
      if (!mejorasAplicadas) {
        tks = tks.map(mejorarTarea);
        await saveKey("pz-tasks", tks);
        await saveKey("pz-tasks-mejoras-2026-10b", true);
      }
      { const norm = normalizaTipoTarea(tks); if (norm.some((t, i) => t !== tks[i])) { tks = norm; await saveKey("pz-tasks", tks); } }
      setTasks(tks);
      let rvv = rv;
      if (!rvv) { rvv = buildDemoRivals(); await saveKey("pz-rivals", rvv); }
      setRivals(rvv);
      let sev = se;
      if (!sev) { sev = buildDemoSeason(); await saveKey("pz-season", sev); }
      sev = { localidad: "", ...sev };
      setSeason(sev);
      let plv = pl2;
      if (!plv) { plv = DEFAULT_PLANNING; await saveKey("pz-planning", plv); }
      setPlanning(plv);
      let stv = st;
      if (!stv) { stv = DEFAULT_STANDINGS; await saveKey("pz-standings", stv); }
      setStandings(stv);
      let splv = spl;
      if (!splv) { splv = DEFAULT_SEASON_PLANNING; await saveKey("pz-season-planning", splv); }
      splv = { ...splv, pretemporada: { objetivos: "", ...splv.pretemporada } };
      setSeasonPlanning(splv);
      setPizarra(pz || { elements: [], lines: [], strokes: [] });
      if (!c) await saveKey("pz-config", DEFAULT_CONFIG);
      setLoaded(true);
    })();
  }, []);

  // persistence wrappers
  const updatePlayers = useCallback((updater) => {
    setPlayers((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-players", next); return next; });
  }, []);
  const updateMatches = useCallback((updater) => {
    setMatches((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-matches", next); return next; });
  }, []);
  const updateTrainings = useCallback((updater) => {
    setTrainings((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-trainings", next); return next; });
  }, []);
  const updateTasks = useCallback((updater) => {
    setTasks((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-tasks", next); return next; });
  }, []);
  // Si el estado de un jugador cambia (lesionado, sancionado, baja...), deja de figurar al instante en las convocatorias abiertas y en los entrenamientos de hoy o futuros.
  const estadosKey = players.map((p) => `${p.id}:${p.estado}`).join("|");
  useEffect(() => {
    if (!loaded) return;
    updateMatches((prev) => { let cambio = false; const next = prev.map((m) => { const n = sanearPartido(m, players); if (n !== m) cambio = true; return n; }); return cambio ? next : prev; });
    updateTrainings((prev) => { let cambio = false; const next = prev.map((t) => { const n = sanearEntreno(t, players); if (n !== t) cambio = true; return n; }); return cambio ? next : prev; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, estadosKey]);

  // Al entrar: las tareas dibujadas de tu plan (desde el servidor) y las 45 del libro (tareas editables) se añaden a tu biblioteca.
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      let catalogo = null, plan = "";
      try { const d = await cargarObjetivos(); catalogo = d.tareas; plan = d.plan; } catch (e) { /* sin sesión o sin conexión: se vuelve a intentar la próxima vez */ }
      const firma = `${plan}|${catalogo ? catalogo.length : 0}|2026-11b`;
      const previa = await loadKey("pz-catalogo-sync", "");
      const actuales = await loadKey("pz-tasks", []);
      if (previa === firma && (actuales || []).some((t) => t.origenCatalogo)) return;
      updateTasks((prev) => (catalogo ? aplicarCatalogo(prev, catalogo) : prev));
      if (catalogo) await saveKey("pz-catalogo-sync", firma);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
  const updateConfig = useCallback((updater) => {
    setConfig((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-config", next); return next; });
  }, []);
  const updateRivals = useCallback((updater) => {
    setRivals((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-rivals", next); return next; });
  }, []);
  const updateSeason = useCallback((updater) => {
    setSeason((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-season", next); return next; });
  }, []);
  const updatePlanning = useCallback((updater) => {
    setPlanning((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-planning", next); return next; });
  }, []);
  const updateStandings = useCallback((updater) => {
    setStandings((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-standings", next); return next; });
  }, []);
  const updateSeasonPlanning = useCallback((updater) => {
    setSeasonPlanning((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-season-planning", next); return next; });
  }, []);
  const updatePizarra = useCallback((updater) => {
    setPizarra((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveKey("pz-pizarra", next); return next; });
  }, []);

  // Estadísticas de jugador siempre recalculadas en vivo desde partidos y entrenamientos reales,
  // para que Plantilla, Estadísticas e Informes queden todos conectados a una sola fuente de verdad.
  const playersWithStats = useMemo(() => players.map((p) => ({
    ...p,
    stats: {
      ...p.stats,
      ...computeMatchStatsForPlayer(p.id, matches),
      ...computeTrainingAttendanceForPlayer(p.id, trainings),
    },
  })), [players, matches, trainings]);

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [deepLink, setDeepLink] = useState(null); // { type: 'partido'|'entrenamiento'|'tarea', id }
  const goToResult = (type, id) => {
    if (type === "jugador") { setSelectedPlayerId(id); setView("plantilla"); }
    else {
      const viewByType = { partido: "partidos", entrenamiento: "entrenamientos", tarea: "tareas" };
      setView(viewByType[type]);
      setDeepLink({ type, id });
    }
    setSearch("");
  };

  // Las sesiones de ejemplo (recomendaciones) no cuentan como entrenadas ni salen en calendario, estadísticas o informes.
  const trainingsReales = trainings.filter((t) => !t.ejemplo);
  const ctx = { plan, cap, config, updateConfig, players: playersWithStats, updatePlayers, matches, updateMatches, trainings: trainingsReales, trainingsTodas: trainings, updateTrainings, tasks, updateTasks,
    rivals, updateRivals, season, updateSeason, planning, updatePlanning, standings, updateStandings, seasonPlanning, updateSeasonPlanning,
    pizarra, updatePizarra,
    deepLink, clearDeepLink: () => setDeepLink(null) };

  const globalResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return {
      jugadores: players.filter(p => p.nombre.toLowerCase().includes(q) || p.apodo.toLowerCase().includes(q)),
      partidos: matches.filter(m => m.rival.toLowerCase().includes(q) || (m.observaciones || "").toLowerCase().includes(q)),
      entrenamientos: trainings.filter(t => sessionDisplayName(t).toLowerCase().includes(q) || (t.notas || "").toLowerCase().includes(q)),
      tareas: tasks.filter(t => t.nombre.toLowerCase().includes(q) || t.codigo.toLowerCase().includes(q)),
    };
  }, [search, players, matches, trainings, tasks]);

  if (!loaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: T.navy }}>
        <div className="flex flex-col items-center gap-3">
          <Shield size={40} style={{ color: T.red }} />
          <div className="text-white font-extrabold tracking-widest text-sm uppercase">Cargando plataforma PZ…</div>
        </div>
      </div>
    );
  }

  const brandColor = config.brandColor || T.navy;
  const onBrand = contrastTextColor(brandColor);
  const onBrandMuted = onBrand === "#fff" ? "rgba(255,255,255,0.65)" : "rgba(11,31,58,0.6)";
  const onBrandFaint = onBrand === "#fff" ? "rgba(255,255,255,0.4)" : "rgba(11,31,58,0.45)";
  const onBrandBorder = onBrand === "#fff" ? "rgba(255,255,255,0.1)" : "rgba(11,31,58,0.12)";

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ background: T.bg, color: T.text, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      {almacenLleno && (
        <div className="fixed top-0 left-0 right-0 text-center text-sm font-bold px-3 py-2" style={{ background: T.red, color: "#fff", zIndex: 1000 }}>
          ⚠ No se pudo guardar: el espacio de tu dispositivo está lleno. Exporta tu copia de seguridad (Configuración) y borra lo que no uses.
          <button onClick={() => setAlmacenLleno(false)} className="underline ml-3">Cerrar</button>
        </div>
      )}
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 h-full flex flex-col shrink-0 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: 240, background: brandColor }}>
        <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${onBrandBorder}` }}>
          {config.logo ? (
            <img src={config.logo} alt="Escudo del equipo" className="w-9 h-9 rounded-lg object-cover shrink-0" style={{ background: "#fff" }} />
          ) : (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0" style={{ background: T.red, color: "#fff" }}>PZ</div>
          )}
          <div className="min-w-0">
            <div className="font-extrabold text-sm leading-tight truncate" style={{ color: onBrand }}>{config.teamName}</div>
            <div className="text-[11px] font-semibold" style={{ color: onBrandMuted }}>{config.season}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-1" style={{ alignItems: "stretch" }}>
          {NAV.map((n) => {
            const active = view === n.key;
            const permitido = modulosPermitidos.includes(n.key);
            return (
              <button
                key={n.key}
                onClick={() => {
                  // Un módulo de un plan superior se abre igualmente, pero muestra un aviso dentro de la plataforma (sin sacar a la persona a la página de precios).
                  setView(n.key); setSidebarOpen(false); setSelectedPlayerId(null);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition text-left"
                style={{
                  background: active ? T.red : "transparent",
                  color: active ? "#fff" : permitido ? onBrandMuted : onBrandFaint,
                  opacity: permitido ? 1 : 0.6,
                  textAlign: "left", justifyContent: "flex-start", width: "100%",
                }}>
                <n.icon size={17} className="shrink-0" />
                <span className="flex-1" style={{ textAlign: "left" }}>{n.label}</span>
                {!permitido && <Lock size={14} />}
              </button>
            );
          })}
        </nav>
        <div className="px-2.5 pb-2" style={{ borderTop: `1px solid ${onBrandBorder}` }}>
          <button onClick={() => { setView("ayuda"); setSidebarOpen(false); setSelectedPlayerId(null); }}
            className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-bold transition text-left"
            style={{ background: view === "ayuda" ? T.red : "transparent", color: view === "ayuda" ? "#fff" : onBrandMuted, textAlign: "left", justifyContent: "flex-start", width: "100%" }}>
            <HelpCircle size={17} className="shrink-0" />
            <span className="flex-1" style={{ textAlign: "left" }}>Ayuda</span>
          </button>
        </div>
        <div className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wide" style={{ borderTop: `1px solid ${onBrandBorder}`, color: onBrandFaint }}>
          {config.category} · {config.footballType}
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-white border-b shrink-0" style={{ borderColor: T.line }}>
          <button className="lg:hidden p-1.5" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar jugadores, partidos, tareas…"
              className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm outline-none" style={{ borderColor: T.line }} />
          </div>
          {MODO_DEMO ? (
            <a href={URL_COMPRA_DEMO} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-extrabold shrink-0"
              style={{ color: "#fff", background: T.red }}>
              Ver planes y precios
            </a>
          ) : (
          <a href="/mi-cuenta-real" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold shrink-0"
            style={{ color: T.navy, border: `1px solid ${T.line}` }}>
            <ChevronLeft size={15} /> Mi biblioteca
          </a>
          )}
          <button onClick={() => setShowResetModal(true)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold shrink-0"
            style={{ color: T.redLight, border: `1px solid ${T.line}` }}>
            <Trash2 size={15} /> Resetear todo
          </button>
        </header>
        {MODO_DEMO && (
          <div className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-center shrink-0" style={{ background: "#FFF7E6", color: "#8A5A00", borderBottom: "1px solid #F5D9A0" }}>
            Demostración: pruébalo todo con un equipo de ejemplo. Nada se guarda (al recargar vuelve al inicio) y las impresiones son solo una vista previa.
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {globalResults ? (
            <GlobalSearchResults results={globalResults} onClear={() => setSearch("")} onSelect={goToResult} />
          ) : view === "ayuda" ? (
            <AyudaModule />
          ) : !modulosPermitidos.includes(view) ? (
            <BloqueoModulo moduloKey={view} plan={plan} onVolver={() => setView("dashboard")} />
          ) : view === "dashboard" ? (
            <Dashboard ctx={ctx} goto={setView} />
          ) : view === "plantilla" ? (
            selectedPlayerId ? (
              <PlayerDetail ctx={ctx} playerId={selectedPlayerId} onBack={() => setSelectedPlayerId(null)} />
            ) : (
              <Plantilla ctx={ctx} onSelect={setSelectedPlayerId} />
            )
          ) : view === "partidos" ? (
            <Partidos ctx={ctx} />
          ) : view === "pizarra" ? (
            <PizarraModule ctx={ctx} />
          ) : view === "entrenamientos" ? (
            <Entrenamientos ctx={ctx} />
          ) : view === "tareas" ? (
            <Tareas ctx={ctx} />
          ) : view === "calendario" ? (
            <CalendarioView ctx={ctx} goto={goToResult} />
          ) : view === "estadisticas" ? (
            ctx.cap.estadisticasEjemplo ? <EstadisticasEjemplo ctx={ctx} /> : <Estadisticas ctx={ctx} />
          ) : view === "rival" ? (
            <RivalModule ctx={ctx} />
          ) : view === "temporada" ? (
            <TemporadaModule ctx={ctx} />
          ) : view === "informes" ? (
            <InformesModule ctx={ctx} />
          ) : view === "configuracion" ? (
            <Configuracion ctx={ctx} />
          ) : null}
        </main>
      </div>
      {showResetModal && <ResetConfirmModal onClose={() => setShowResetModal(false)} />}
    </div>
  );
}

// Todo lo que la plataforma guarda en este dispositivo. Incluye las marcas de sincronización y de migración de las tareas:
// si no se borraran, tras resetear no se volverían a cargar las tareas nativas del catálogo.
// Datos que ya había en el dispositivo antes de separar por cuenta: se los queda la PRIMERA cuenta que entre con esta versión;
// las demás cuentas empiezan con sus datos vacíos.
function adoptarDatosAnteriores() {
  if (!ESPACIO_USUARIO) return;
  try {
    const claves = [...CLAVES_PZ, "pz-convocatoria-textos", CAL_KEY];
    const dueno = almacen().getItem("pz-datos-anteriores-de");
    if (dueno && dueno !== ESPACIO_USUARIO) return;
    const hayAnteriores = claves.some((k) => almacen().getItem(k) != null);
    if (!hayAnteriores) return;
    claves.forEach((k) => {
      const viejo = almacen().getItem(k);
      if (viejo != null && almacen().getItem(claveLocal(k)) == null) almacen().setItem(claveLocal(k), viejo);
      almacen().removeItem(k);
    });
    almacen().setItem("pz-datos-anteriores-de", ESPACIO_USUARIO);
  } catch (e) { console.error("no se pudieron adoptar los datos anteriores", e); }
}

const CLAVES_PZ = [
  "pz-config", "pz-players", "pz-matches", "pz-trainings", "pz-tasks",
  "pz-rivals", "pz-season", "pz-season-planning", "pz-planning",
  "pz-standings", "pz-pizarra", "pz-tasks-migracion-2025", "pz-tasks-mejoras-2026-10b", "pz-catalogo-sync",
];

function ResetConfirmModal({ onClose }) {
  const [confirmando, setConfirmando] = useState(false);

  const resetearTodo = () => {
    CLAVES_PZ.forEach((k) => almacen().removeItem(claveLocal(k)));
    almacen().removeItem(claveLocal("pz-convocatoria-textos"));
    almacen().removeItem(claveLocal(CAL_KEY));
    window.location.href = "/pz";
  };

  return (
    <Modal title="Resetear toda la plataforma" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl" style={{ background: "#FCEAEC", border: `1px solid ${T.redLight}` }}>
          <p className="text-sm font-bold" style={{ color: T.redLight }}>Esta acción no se puede deshacer.</p>
          <p className="text-sm mt-1.5" style={{ color: T.text }}>
            Se borrarán absolutamente todos los datos guardados en esta plataforma: la plantilla de
            jugadores, la biblioteca de tareas, los entrenamientos, los partidos, el rival, la
            temporada y la configuración del club. Todo quedará vacío, como si fuera la primera vez
            que se usa. Las tareas nativas del catálogo de tu plan se cargan de nuevo solas al entrar.
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "#FFF6DE" }}>
          <p className="text-sm" style={{ color: T.text }}>
            <strong>Recomendación:</strong> antes de continuar, exporta tus tareas, tus partidos y
            tus jugadores desde <em>Configuración → Copia de seguridad → Compartir con otro
            entrenador</em>, así conservas una copia por si la necesitas más adelante.
          </p>
        </div>
        {!confirmando ? (
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn variant="danger" icon={Trash2} onClick={() => setConfirmando(true)}>Sí, quiero resetear todo</Btn>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold" style={{ color: T.redLight }}>
              Última confirmación: ¿seguro que quieres borrar todos los datos de la plataforma?
            </p>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setConfirmando(false)}>No, cancelar</Btn>
              <Btn variant="danger" icon={Trash2} onClick={resetearTodo}>Sí, borrar definitivamente</Btn>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ============================================================
   AYUDA Y PREGUNTAS FRECUENTES (dentro de la plataforma)
   ============================================================ */
const CORREO_AYUDA = "info@entrenadordesdecero.com"; // cambia aquí el correo de contacto
const AYUDA_FAQ = [
  { cat: "Primeros pasos", items: [
    { q: "¿Cómo entro por primera vez?", a: "Si compraste un plan, recibes un correo de bienvenida con un enlace para crear tu contraseña. Si tienes un código de regalo o cortesía, entra en la página «Activar código», escribe el código, tu nombre, tu correo y una contraseña. Después entra siempre con tu correo y tu contraseña desde «Acceso»." },
    { q: "¿Qué incluye cada plan?", a: "• Esencial: el libro, la biblioteca con las 45 tareas del libro (editables e imprimibles), la plantilla de jugadores con su ficha General y las estadísticas en pantalla con datos de ejemplo.\n• Entrenador: todo lo anterior, más todas las pestañas del jugador, entrenamientos, partidos, calendario, pizarra táctica, análisis del rival y estadísticas reales en pantalla.\n• Metodólogo: todo lo anterior, más la planificación completa de la temporada y los informes impresos (temporada, estadísticas, jugador y coaching privado).\nLa cantidad de tareas dibujadas y de sesiones por objetivos también aumenta con el plan." },
    { q: "¿Cómo sé qué plan tengo y qué significa el candado?", a: "En «Mi cuenta» aparece tu plan actual. Los módulos de un plan superior tienen un candado: al pulsarlos, la plataforma te dice en qué plan están. Todo lo demás sigue funcionando con normalidad." },
    { q: "¿Es un pago único? ¿Cómo subo de plan?", a: "Tu plan es de pago único: no hay cuotas ni renovaciones. Si más adelante quieres más herramientas, escríbenos al correo de contacto (abajo) indicando el correo de tu cuenta y el plan que quieres, y te explicamos cómo ampliarlo." },
  ] },
  { cat: "Mis datos y mis dispositivos", items: [
    { q: "¿Dónde se guardan mis datos?", a: "Tus jugadores, sesiones, partidos y configuración se guardan únicamente en el navegador del dispositivo que usas, separados por cuenta, no en nuestros servidores. Por eso son privados: nosotros no los vemos. Lo único que guardamos en nuestro servidor es tu cuenta (tu correo y tu plan)." },
    { q: "¿Puedo usar la plataforma en dos dispositivos?", a: "Sí. Con una licencia puedes usarla en 2 dispositivos a la vez, por ejemplo el móvil y la tablet. Cada dispositivo guarda sus propios datos, así que puedes llevar un equipo en uno y otro equipo en el otro." },
    { q: "¿Por qué no veo en la tablet lo que hice en el móvil?", a: "Porque los datos viven en cada dispositivo. Si quieres ver lo mismo en los dos, pasa tus datos con la copia de seguridad: en el primer dispositivo, Configuración → Copia de seguridad → exportar; en el segundo, importar ese archivo." },
    { q: "¿Cómo hago una copia de seguridad y cómo la restauro?", a: "Entra en Configuración → Copia de seguridad. Pulsa para exportar y se descarga un archivo; guárdalo en un lugar seguro (tu correo, la nube, un USB). Para restaurarla, en esa misma pantalla elige importar y selecciona el archivo." },
    { q: "¿Cada cuánto debo hacer la copia de seguridad?", a: "Te recomendamos una vez a la semana, y siempre antes de cambiar de móvil, borrar los datos del navegador o actualizar el sistema del dispositivo." },
    { q: "¿Qué pasa si cambio de móvil o borro los datos del navegador?", a: "Si no tienes una copia de seguridad, los datos se pierden y no podemos recuperarlos, porque no están en nuestros servidores. Por eso es importante hacer copias con regularidad." },
    { q: "¿Puedo compartir tareas, partidos o jugadores con otro entrenador?", a: "Sí. En Configuración → Copia de seguridad hay opciones para compartir solo tareas, partidos o jugadores. Al importar se suma lo recibido y no se borra lo que ya tienes." },
    { q: "¿Puedo entrar con varias cuentas en el mismo dispositivo?", a: "Sí. Cada cuenta guarda sus datos aparte en el dispositivo: al entrar con otra cuenta no verás los datos de la anterior, y al volver a la tuya los encontrarás tal como los dejaste. Si compartes el dispositivo, cierra tu sesión al terminar." },
    { q: "Me avisa de que el espacio del dispositivo está lleno", a: "Haz una copia de seguridad (Configuración → Copia de seguridad), borra lo que no uses —por ejemplo fotos de jugadores muy pesadas o tareas que no necesitas— y vuelve a intentarlo." },
    { q: "¿Mis datos y los de mis jugadores son privados?", a: "Sí. Al estar en tu dispositivo, solo los ves tú. La información médica de cada jugador es confidencial y no sale en ninguna impresión." },
  ] },
  { cat: "Jugadores y plantilla", items: [
    { q: "¿Qué datos puedo guardar de cada jugador?", a: "La ficha de registro del libro, en siete bloques: datos personales, deportivos, características antropométricas, formación académica, información médica, contacto de emergencia y situación del jugador. Rellena solo lo que necesites; el resto puede quedarse vacío." },
    { q: "¿Para qué sirve cada pestaña del jugador?", a: "• General: todos sus datos.\n• Rendimiento: estadísticas de la temporada y asistencia a entrenamientos.\n• Valoración: tu valoración del jugador, que alimenta el ranking interno.\n• Test: los test del libro y tus propios test.\n• Coaching: la autoevaluación y las evaluaciones del jugador, con su evolución.\n• Historial: lo ocurrido con ese jugador a lo largo de la temporada.\nSi tu plan no incluye alguna, aparece con un candado." },
    { q: "¿Cómo funcionan los test del libro?", a: "En Test → Registrar test eliges uno de los 15 test del libro y escribes el resultado. La plataforma calcula el nivel (Mucho por mejorar, Mejorar, Bueno o Excelente) según la edad del jugador el día del test, así que necesita su fecha de nacimiento. También puedes elegir el nivel a mano." },
    { q: "¿Qué es el coaching?", a: "Es la ficha de coaching del libro: una autoevaluación del jugador y hasta tres evaluaciones tuyas, con 50 fundamentos valorados del 1 al 10. La plataforma compara las fechas y dibuja la evolución. Es información privada entre el jugador y el entrenador." },
    { q: "¿Qué es el ranking interno y cómo se calcula?", a: "Es una nota que ordena a tus jugadores dentro del equipo. Se calcula con las diez valoraciones que haces en la pestaña Valoración, los goles, las asistencias, la asistencia a entrenamientos y las tarjetas. Los pesos se ajustan en Configuración → Fórmula ranking, y puedes fijar la nota a mano si lo prefieres." },
    { q: "¿Cómo cambio el nombre del equipo o de un jugador?", a: "El nombre del equipo se cambia en Configuración → Equipo, y el del jugador en su ficha, con «Editar». El cambio se refleja en toda la plataforma y en las impresiones." },
  ] },
  { cat: "Tareas y entrenamientos", items: [
    { q: "¿Cómo creo mi propia tarea?", a: "En la Biblioteca de tareas pulsa «Nueva tarea», rellena los datos y pulsa «Crear tarea gráfica» para dibujarla. Si prefieres, puedes subir una imagen tuya en lugar del dibujo." },
    { q: "¿Cómo se usa el editor de dibujo?", a: "Elige el lienzo (campo, área, zona…), añade jugadores, balones, conos o zonas con los botones y arrástralos para colocarlos. Toca una pieza o una línea para seleccionarla: aparece su círculo para moverla y el botón «Quitar». Para trazar una línea, pulsa «Dibujar línea». En el móvil se abre a pantalla completa con el tablero siempre visible." },
    { q: "¿Puedo editar las 45 tareas del libro?", a: "Sí, son tareas normales de tu biblioteca: puedes cambiar sus textos y su gráfico. Lo que modifiques se conserva." },
    { q: "¿Cómo uso una tarea en un entrenamiento?", a: "En Entrenamientos crea o abre una sesión y añade tareas de tu biblioteca. La sesión guarda una copia de cada tarea: si después cambias la tarea en la biblioteca, las sesiones ya preparadas no cambian." },
    { q: "¿Cómo imprimo una tarea o una sesión?", a: "Abre la tarea o la sesión y pulsa Imprimir. En la ventana de impresión puedes activar el campo en blanco para ahorrar tinta. Usa papel A4." },
    { q: "¿Qué son las sesiones por objetivos y el Sistema Tipo?", a: "Son contenidos del libro: sesiones ya preparadas según el objetivo y un sistema de trabajo por fases. La cantidad que tienes disponible depende de tu plan." },
    { q: "¿Por qué cambia mi biblioteca de tareas al entrar?", a: "Al iniciar sesión, la plataforma añade las tareas que corresponden a tu plan. Tus propias tareas no se tocan." },
  ] },
  { cat: "Partidos, estadísticas e informes", items: [
    { q: "¿Cómo se calculan las estadísticas?", a: "Se calculan solas a partir de tus partidos y tus entrenamientos: minutos, goles, tarjetas y asistencia. No hay que escribirlas jugador por jugador." },
    { q: "¿Por qué mis estadísticas del plan Esencial son de ejemplo?", a: "Porque el plan Esencial no incluye partidos ni entrenamientos. La pantalla muestra datos inventados, con un aviso, para que veas lo que podrás hacer con el plan Entrenador." },
    { q: "¿Qué puedo imprimir con mi plan?", a: "• Esencial: tareas, plantilla y ficha del jugador.\n• Entrenador: además, sesiones, partidos y la información del rival.\n• Metodólogo: además, los informes de temporada, de estadísticas, del jugador y el informe privado de coaching." },
    { q: "¿La pizarra táctica guarda mis dibujos?", a: "Sí, se guardan en tu dispositivo, igual que el resto de tus datos. Haz copias de seguridad para no perderlos." },
  ] },
  { cat: "Cuenta y acceso", items: [
    { q: "He olvidado mi contraseña", a: "En «Acceso» pulsa «¿Olvidaste tu contraseña?», escribe tu correo y te enviamos un enlace. Ábrelo y elige una contraseña nueva. Si no llega, mira en la carpeta de spam. El enlace caduca: si ya lo usaste o pasó mucho tiempo, pide uno nuevo." },
    { q: "¿Cómo uso un código de regalo o de cortesía?", a: "Entra en «Activar código» y escribe el código (por ejemplo PZ-XXXX-XXXX), tu nombre, tu correo y una contraseña. El código es personal y de un solo uso." },
    { q: "¿Cómo subo de plan?", a: "Entra en «Mi cuenta» y pulsa «Subir de plan», o pulsa un módulo bloqueado de la plataforma. Solo pagas la diferencia entre tu plan y el nuevo, sin recargo y en un único pago. Al confirmarse el pago, tu cuenta cambia de plan en unos segundos y todo lo que ya tenías se mantiene. Si estabas dentro, cierra la pestaña y vuelve a entrar." },
    { q: "¿Cómo regalo el libro a otra persona?", a: "En la página principal, en «Regala el libro», pulsa «Regalar el libro». Elige el plan, escribe el nombre de quien lo recibe y, si quieres, su correo, una dedicatoria y el día de entrega. Tras el pago recibes el código por correo. Si escribiste su correo, se lo enviamos con tu dedicatoria." },
    { q: "No me llega el correo", a: "Espera unos minutos y revisa spam o promociones. Comprueba que escribiste bien tu correo. Si sigue sin llegar, escríbenos al correo de contacto." },
    { q: "¿Puedo compartir mi cuenta?", a: "No. La licencia es personal. Puedes usarla en dos dispositivos tuyos, pero no prestarla a otras personas ni revender el acceso." },
    { q: "¿Puedo cambiar el correo de mi cuenta?", a: "Escríbenos al correo de contacto indicando tu correo actual y el nuevo, y lo gestionamos." },
  ] },
  { cat: "Problemas frecuentes", items: [
    { q: "No veo la última versión o algo se ve raro", a: "Recarga la página con Ctrl + F5 (en el móvil, cierra la pestaña y vuelve a abrirla). No borres los «datos del sitio» o los «datos de navegación» del navegador: perderías tus datos." },
    { q: "Mis cambios no se guardan", a: "Comprueba que no estás navegando en modo incógnito (los datos se borran al cerrarlo) y que no te ha avisado de que el espacio del dispositivo está lleno." },
    { q: "La impresión sale cortada o desajustada", a: "Usa la vista previa de la plataforma, papel A4 y los márgenes predeterminados del navegador. Si sigue mal, prueba con otro navegador (Chrome o Edge)." },
    { q: "¿Necesito internet?", a: "Sí para entrar y para descargar las tareas de tu plan. Tus datos se guardan en el propio dispositivo." },
    { q: "¿En qué navegadores funciona?", a: "En las versiones actuales de Chrome, Edge, Safari y Firefox, en ordenador, tablet y móvil." },
  ] },
];
const sinTildes = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function AyudaModule() {
  const [busca, setBusca] = useState("");
  const q = sinTildes(busca.trim());
  const grupos = AYUDA_FAQ.map((g) => ({ ...g, items: g.items.filter((it) => !q || sinTildes(it.q + " " + it.a).includes(q)) })).filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div>
        <div className="text-xl font-extrabold" style={{ color: T.navy }}>Ayuda y preguntas frecuentes</div>
        <div className="text-sm mt-1" style={{ color: T.muted }}>Aquí tienes las respuestas a lo que más se pregunta. Escribe una palabra para buscar.</div>
      </div>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar en la ayuda…" aria-label="Buscar en la ayuda"
          className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none" style={{ borderColor: T.line }} />
      </div>
      {!grupos.length && <Card className="p-5 text-sm" style={{ color: T.muted }}>No encontramos nada con esa palabra. Prueba con otra, o escríbenos al correo de contacto de abajo.</Card>}
      {grupos.map((g) => (
        <div key={g.cat}>
          <div className="text-[11px] font-bold uppercase mb-2" style={{ color: T.muted }}>{g.cat}</div>
          <div className="flex flex-col gap-2">
            {g.items.map((it) => (
              <details key={it.q} open={!!q} className="rounded-xl border bg-white" style={{ borderColor: T.line }}>
                <summary className="px-4 py-3 text-sm font-bold cursor-pointer" style={{ color: T.navy }}>{it.q}</summary>
                <div className="px-4 pb-4 text-sm whitespace-pre-line" style={{ color: T.text }}>{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      ))}
      <Card className="p-5">
        <div className="font-extrabold text-sm" style={{ color: T.navy }}>¿No encuentras lo que buscas?</div>
        <div className="text-sm mt-1" style={{ color: T.text }}>
          Escríbenos a <a href={`mailto:${CORREO_AYUDA}`} className="font-bold underline" style={{ color: T.red }}>{CORREO_AYUDA}</a>. Para ayudarte más rápido, indícanos el correo de tu cuenta, el dispositivo y el navegador que usas, y qué estabas haciendo.
        </div>
      </Card>
    </div>
  );
}

const PLAN_NOMBRES = { esencial: "Esencial", entrenador: "Entrenador", metodologo: "Metodólogo" };
function BloqueoModulo({ moduloKey, plan, onVolver }) {
  const nav = NAV.find((n) => n.key === moduloKey);
  const planNecesario = ["entrenador", "metodologo"].find((p) => MODULOS_POR_PLAN[p].includes(moduloKey));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: 24 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Lock size={24} color="#0B1F3A" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0B1F3A", marginBottom: 8 }}>
        {nav ? nav.label : "Esta opción"}: disponible en un plan superior
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 400, marginBottom: 8 }}>
        Esta opción está habilitada únicamente en el plan {PLAN_NOMBRES[planNecesario] || "superior"}{planNecesario === "entrenador" ? " y en el Metodólogo" : ""}. Tu plan actual es el {PLAN_NOMBRES[plan] || "tuyo"}, y puedes seguir usando todo lo demás.
      </p>
      <p style={{ fontSize: 13, color: "#8a93a0", maxWidth: 400, marginBottom: 20 }}>
        Al subir de plan, todo lo que ya hayas hecho en la plataforma se mantiene.
      </p>
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: 20 }}>
        <SubirPlan tema="claro" minimo={planNecesario} />
      </div>
      <button
        onClick={onVolver}
        style={{ background: "#0B1F3A", color: "#fff", fontWeight: 700, padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14 }}
      >
        Volver al panel
      </button>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

/* Interpreta el marcador de un partido considerando si jugamos de local o visitante,
   ya que el resultadoFinal siempre se guarda como "local-visitante". */
function resultadoPropio(m) {
  const sinCerrar = !m.cerrado; // solo cuenta cuando el entrenador cierra el partido (no basta con que pase la fecha)
  if (sinCerrar) {
    return { golesPropios: null, golesRival: null, resultado: "P" };
  }
  const [a, b] = (m.resultadoFinal || "0-0").split("-").map(Number);
  const golesPropios = m.esLocal ? (a || 0) : (b || 0);
  const golesRival = m.esLocal ? (b || 0) : (a || 0);
  const resultado = golesPropios > golesRival ? "V" : golesPropios === golesRival ? "E" : "D";
  return { golesPropios, golesRival, resultado };
}

/* Calcula si conviene letra blanca u oscura según cuán claro/oscuro es el color de marca elegido */
function contrastTextColor(hex) {
  if (!hex) return "#fff";
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  if ([r, g, b].some(isNaN)) return "#fff";
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0B1F3A" : "#fff";
}

function computeTeamStats(matches) {
  let v = 0, e = 0, d = 0, gf = 0, gc = 0, jugados = 0;
  matches.forEach((m) => {
    const { golesPropios, golesRival, resultado } = resultadoPropio(m);
    if (resultado === "P") return; // los partidos aún no jugados no se computan
    jugados++;
    gf += golesPropios; gc += golesRival;
    if (resultado === "V") v++; else if (resultado === "E") e++; else d++;
  });
  return { v, e, d, gf, gc, jugados };
}

const MATCH_DURATION_BY_TIPO = { "Fútbol 5": 40, "Fútbol 7": 50, "Fútbol 8": 60, "Fútbol 11": 90 };

/* Recalcula, a partir del historial real de partidos, las estadísticas de un jugador:
   convocatorias, titularidades, suplencias, minutos jugados (considerando cambios),
   goles, asistencias y tarjetas. Así todo queda alimentado desde un único lugar. */
function computeMatchStatsForPlayer(playerId, matches) {
  let convocatorias = 0, titular = 0, suplente = 0, minutos = 0, goles = 0, asistencias = 0, amarillas = 0, rojas = 0, capitanias = 0, mvps = 0;
  const valoraciones = [];
  matches.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).forEach((m) => {
    if (!m.cerrado) return; // los partidos sin cerrar no suman jugados, minutos, goles ni valoraciones
    const conv = (m.convocatoria || []).find((c) => c.jugadorId === playerId);
    if (!conv || conv.estado !== "Convocado") return;
    convocatorias++;
    if (m.capitanId === playerId) capitanias++;
    if (m.valoracionesJugadores && m.valoracionesJugadores[playerId] != null) {
      valoraciones.push(m.valoracionesJugadores[playerId]);
      const mvpEntry = Object.entries(m.valoracionesJugadores).sort((a, b) => b[1] - a[1])[0];
      if (mvpEntry && mvpEntry[0] === playerId) mvps++;
    }
    const duracion = m.duracionParte ? m.duracionParte * 2 : (MATCH_DURATION_BY_TIPO[m.tipoFutbol] || 90);
    const eraTitular = (m.alineacion || []).some((s) => s.jugadorId === playerId);
    const cambios = m.cambios || [];
    if (eraTitular) {
      titular++;
      const sale = cambios.find((c) => c.saleId === playerId);
      minutos += sale ? Number(sale.minuto) || 0 : duracion;
    } else {
      const entra = cambios.find((c) => c.entraId === playerId);
      if (entra) {
        suplente++;
        const minutoEntra = Number(entra.minuto) || 0;
        const saleDespues = cambios.find((c) => c.saleId === playerId && Number(c.minuto) > minutoEntra);
        minutos += (saleDespues ? Number(saleDespues.minuto) : duracion) - minutoEntra;
      } else {
        suplente++; // convocado, no jugó
      }
    }
    (m.goles || []).forEach((g) => {
      if (g.jugadorId === playerId) goles++;
      if (g.asistenciaId === playerId) asistencias++;
    });
    (m.tarjetas || []).forEach((t) => {
      if (t.jugadorId !== playerId) return;
      if ((t.tipo || "").toLowerCase().includes("roja")) rojas++;
      else if ((t.tipo || "").toLowerCase().includes("amarilla")) amarillas++;
    });
  });
  return { convocatorias, titular, suplente, minutos, goles, asistencias, amarillas, rojas, capitanias, mvps, valoraciones };
}

/* Recalcula el % de asistencia a entrenamientos desde el historial real de sesiones.
   Nunca puede superar el 100%: se basa en cuántas sesiones tenían al jugador registrado
   y en cuántas de esas realmente asistió (baja si faltó o estuvo lesionado). */
function computeTrainingAttendanceForPlayer(playerId, trainings) {
  let entrenamientosTotales = 0, entrenamientosRealizados = 0;
  trainings.forEach((t) => {
    const row = (t.asistencia || []).find((a) => a.jugadorId === playerId);
    if (!row) return;
    entrenamientosTotales++;
    if (row.estado === "Asiste") entrenamientosRealizados++;
  });
  return { entrenamientosTotales, entrenamientosRealizados };
}

function StandingsCard({ standings, onEdit, teamStats, casaStats, fueraStats, puntosCasa, puntosFuera }) {
  const s = standings || DEFAULT_STANDINGS;
  const hasData = s.posicion != null;
  const puntos = teamStats.v * 3 + teamStats.e;
  const Cell = ({ value, label, color, big }) => (
    <div className="flex-1 min-w-[64px] flex flex-col items-center justify-center text-center rounded-xl py-2.5 px-1" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
      <div className={big ? "text-2xl font-black" : "text-xl font-extrabold"} style={{ color }}>{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide mt-0.5 text-center" style={{ color: T.muted }}>{label}</div>
    </div>
  );
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Clasificación en la liga</Eyebrow>
        <div className="flex gap-2">
          {s.enlace && (
            <a href={s.enlace} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Btn variant="ghost">Ver tabla completa ↗</Btn>
            </a>
          )}
          <Btn variant="ghost" icon={Edit3} onClick={onEdit}>{hasData ? "Actualizar" : "Cargar datos"}</Btn>
        </div>
      </div>
      {!hasData ? (
        <div className="text-sm" style={{ color: T.muted }}>Todavía no has cargado la posición del equipo. Toca "Cargar datos" e indica tu posición y el total de equipos de la liga — el resto de las estadísticas se calculan solas a partir de los partidos de Liga que registres.</div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-[11px] mb-1" style={{ color: T.muted }}>Posición cargada a mano; el resto se calcula automáticamente desde los partidos de competición Liga.</div>
          <div className="flex gap-2 flex-wrap">
            <Cell big value={<>{s.posicion}º{s.totalEquipos ? <span className="text-sm font-bold" style={{ color: T.muted }}>/{s.totalEquipos}</span> : ""}</>} label="Posición" color={T.navy} />
            <Cell value={puntos} label="Puntos" color={T.red} />
            <Cell value={teamStats.jugados} label="Jugados" color={T.navy} />
            <Cell value={teamStats.v} label="Ganados" color={T.green} />
            <Cell value={teamStats.e} label="Empatados" color={T.yellow} />
            <Cell value={teamStats.d} label="Perdidos" color={T.redLight} />
            <Cell value={`${teamStats.gf}:${teamStats.gc}`} label="Goles" color={T.navy} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: T.line }}>
            <div className="rounded-xl p-2.5" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
              <div className="text-[11px] font-bold uppercase mb-1.5 text-center" style={{ color: T.muted }}>En casa</div>
              <div className="flex justify-center gap-1.5 flex-wrap">
                <Cell value={casaStats.jugados} label="PJ" color={T.navy} />
                <Cell value={casaStats.v} label="G" color={T.green} />
                <Cell value={casaStats.e} label="E" color={T.yellow} />
                <Cell value={casaStats.d} label="P" color={T.redLight} />
                <Cell value={puntosCasa} label="Pts" color={T.red} />
              </div>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
              <div className="text-[11px] font-bold uppercase mb-1.5 text-center" style={{ color: T.muted }}>Fuera de casa</div>
              <div className="flex justify-center gap-1.5 flex-wrap">
                <Cell value={fueraStats.jugados} label="PJ" color={T.navy} />
                <Cell value={fueraStats.v} label="G" color={T.green} />
                <Cell value={fueraStats.e} label="E" color={T.yellow} />
                <Cell value={fueraStats.d} label="P" color={T.redLight} />
                <Cell value={puntosFuera} label="Pts" color={T.red} />
              </div>
            </div>
          </div>
          {s.actualizadoEl && <div className="text-[11px]" style={{ color: T.muted }}>Actualizado el {s.actualizadoEl}</div>}
        </div>
      )}
    </Card>
  );
}

function StandingsForm({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || DEFAULT_STANDINGS);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v === "" ? null : v }));
  const setNum = (k, v) => setF((p) => ({ ...p, [k]: v === "" ? null : Number(v) }));
  const setHomeAway = (group, k, v) => setF((p) => ({ ...p, [group]: { ...p[group], [k]: v === "" ? null : Number(v) } }));
  const setCercano = (grupo, k, v) => setF((p) => ({ ...p, cercanos: { ...(p.cercanos || {}), [grupo]: { ...((p.cercanos || {})[grupo] || {}), [k]: k === "puntos" ? (v === "" ? null : Number(v)) : v } } }));
  const cer = f.cercanos || {};

  return (
    <Modal title="Clasificación en la liga" onClose={onClose} wide>
      <div className="text-sm mb-4" style={{ color: T.muted }}>Solo necesitas indicar tu posición y el total de equipos de la liga — el resto de las estadísticas (puntos, jugados, ganados, goles, casa/fuera) se calculan solas a partir de los partidos de competición "Liga" que registres.</div>
      <div className="flex flex-col gap-4">
        <Field label="Enlace a la tabla de posiciones oficial (opcional)">
          <TextInput type="url" placeholder="https://..." value={f.enlace || ""} onChange={(e) => set("enlace", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Posición"><TextInput type="number" value={f.posicion ?? ""} onChange={(e) => setNum("posicion", e.target.value)} /></Field>
          <Field label="Total equipos"><TextInput type="number" value={f.totalEquipos ?? ""} onChange={(e) => setNum("totalEquipos", e.target.value)} /></Field>
        </div>
        <div className="rounded-xl p-3 flex flex-col gap-3" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
          <div>
            <div className="text-sm font-bold" style={{ color: T.navy }}>Para calcular qué pasa si ganas (opcional)</div>
            <div className="text-xs mt-0.5" style={{ color: T.muted }}>Apunta los puntos de los equipos cercanos de la tabla. Con eso el panel te dice cómo cambiaría tu posición si ganas, empatas o pierdes. Actualízalos cuando cambie la tabla.</div>
          </div>
          {[["lider", "Líder"], ["sup", "Equipo de arriba"], ["inf", "Equipo de abajo"]].map(([k, etiqueta]) => (
            <div key={k} className="grid grid-cols-3 gap-2 items-end">
              <div className="col-span-2"><Field label={`${etiqueta} (nombre)`}><TextInput value={cer[k]?.nombre || ""} onChange={(e) => setCercano(k, "nombre", e.target.value)} /></Field></div>
              <Field label="Puntos"><TextInput type="number" value={cer[k]?.puntos ?? ""} onChange={(e) => setCercano(k, "puntos", e.target.value)} /></Field>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="accent" icon={Save} onClick={() => onSave({ ...f, actualizadoEl: todayISO() })}>Guardar</Btn>
      </div>
    </Modal>
  );
}

/* ============================================================
   Panel informativo: preparar el próximo partido, escenarios de
   clasificación y la semana en curso. Todo se calcula con los datos
   que ya tiene la persona; no se inventa nada.
   ============================================================ */
const normalizarNombre = (t) => String(t || "").trim().toLowerCase();

function escenariosClasificacion({ miPuntos, posicion, cercanos, rivalNombre }) {
  const c = cercanos || {};
  const esRival = (eq) => !!(eq?.nombre && normalizarNombre(eq.nombre) === normalizarNombre(rivalNombre));
  const tiene = (eq) => eq && eq.puntos !== null && eq.puntos !== undefined && eq.puntos !== "" && !Number.isNaN(Number(eq.puntos));
  return [["Si ganas", 3], ["Si empatas", 1], ["Si pierdes", 0]].map(([titulo, g]) => {
    const pts = miPuntos + g;
    const lineas = [];
    // Si el rival es ese equipo, su resultado es el contrario al nuestro; si no, se supone que no suma.
    const suma = g === 3 ? 0 : g === 1 ? 1 : 3;
    if (tiene(c.sup)) {
      const rival = Number(c.sup.puntos) + (esRival(c.sup) ? suma : 0); const dif = pts - rival; const nom = c.sup.nombre || "el equipo de arriba";
      lineas.push(dif > 0 ? `Superas a ${nom} por ${dif} punto${dif === 1 ? "" : "s"}${posicion > 1 ? ` → como mínimo subirías al puesto ${posicion - 1}` : ""}`
        : dif === 0 ? `Igualas a puntos con ${nom} (decide el desempate)` : `Te quedas a ${-dif} punto${dif === -1 ? "" : "s"} de ${nom}`);
    }
    if (tiene(c.inf)) {
      const rival = Number(c.inf.puntos) + (esRival(c.inf) ? suma : 0); const dif = pts - rival; const nom = c.inf.nombre || "el equipo de abajo";
      lineas.push(dif > 0 ? `Mantienes ${dif} punto${dif === 1 ? "" : "s"} de ventaja sobre ${nom}` : dif === 0 ? `${nom} te alcanza a puntos` : `${nom} te supera por ${-dif} punto${dif === -1 ? "" : "s"}`);
    }
    if (tiene(c.lider) && posicion !== 1) {
      const dif = Number(c.lider.puntos) - pts;
      lineas.push(dif > 0 ? `Quedas a ${dif} punto${dif === 1 ? "" : "s"} del líder` : dif === 0 ? "Igualas al líder a puntos" : "Superarías al líder");
    }
    return { titulo, pts, lineas, directo: esRival(c.sup) ? "arriba" : esRival(c.inf) ? "abajo" : null };
  });
}

function diasHasta(fecha) { return Math.round((new Date(`${fecha}T12:00:00`) - new Date(`${todayISO()}T12:00:00`)) / 86400000); }
const fechaCorta = (f) => { const [a, m, d] = String(f || "").split("-"); return d && m ? `${d}/${m}` : f || ""; };

function PrepararPartidoCard({ nextMatch, matches, rivals, standings, miPuntos, esLiga, goto, onEditStandings }) {
  if (!nextMatch) return null;
  const dias = diasHasta(nextMatch.fecha);
  const rival = (rivals || []).find((r) => normalizarNombre(r.nombre) === normalizarNombre(nextMatch.rival));
  const analizado = !!(rival && (String(rival.fortalezas || "").trim() || String(rival.debilidades || "").trim()));
  const historial = matches.filter((m) => normalizarNombre(m.rival) === normalizarNombre(nextMatch.rival) && m.cerrado && m.fecha <= todayISO()).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3)
    .map((m) => ({ m, ...resultadoPropio(m) })).filter((x) => x.resultado !== "P");
  const forma = matches.filter((m) => m.cerrado && m.fecha <= todayISO()).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5).map((m) => ({ m, ...resultadoPropio(m) })).filter((x) => x.resultado !== "P").reverse();
  const s = standings || {};
  const cercanos = s.cercanos || {};
  const hayTabla = s.posicion != null && esLiga;
  const hayCercanos = ["lider", "sup", "inf"].some((k) => cercanos[k] && cercanos[k].puntos !== null && cercanos[k].puntos !== undefined && cercanos[k].puntos !== "");
  const escenarios = hayTabla ? escenariosClasificacion({ miPuntos, posicion: s.posicion, cercanos, rivalNombre: nextMatch.rival }) : [];
  const col = { V: T.green, E: T.yellow, D: T.redLight };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Eyebrow>Prepara el próximo partido</Eyebrow>
          <h2 className="text-lg font-extrabold mt-1" style={{ color: T.navy }}>vs {nextMatch.rival}</h2>
          <div className="text-xs" style={{ color: T.muted }}>{dias <= 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`} · {fechaCorta(nextMatch.fecha)} · {nextMatch.esLocal ? "en casa" : "fuera"} · {nextMatch.competicion}</div>
        </div>
        {forma.length > 0 && (
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase" style={{ color: T.muted }}>Tu forma (últimos {forma.length})</div>
            <div className="flex gap-1 mt-1 justify-end">{forma.map((f, i) => <span key={i} title={`${f.m.rival}: ${f.golesPropios}-${f.golesRival}`} className="w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center" style={{ background: col[f.resultado], color: f.resultado === "E" ? T.navy : "#fff" }}>{f.resultado}</span>)}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div className="rounded-xl p-3" style={{ background: analizado ? "#EAF7EF" : "#FFF6E0", border: `1px solid ${analizado ? "#BFE5CD" : "#F2DC9B"}` }}>
          <div className="text-sm font-extrabold" style={{ color: analizado ? T.green : "#946B00" }}>{analizado ? "✓ Ya analizaste a este rival" : "⚠ Todavía no has analizado a este rival"}</div>
          {analizado && (
            <div className="text-xs mt-1" style={{ color: T.navy }}>
              {rival.fortalezas ? <div><b>Fortalezas:</b> {rival.fortalezas}</div> : null}
              {rival.debilidades ? <div className="mt-0.5"><b>Debilidades:</b> {rival.debilidades}</div> : null}
            </div>
          )}
          <button onClick={() => goto("rival")} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: T.red }}>{analizado ? "Ver análisis del rival" : "Analizar al rival"} <ChevronRight size={14} /></button>
        </div>
        <div className="rounded-xl p-3" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
          <div className="text-sm font-extrabold" style={{ color: T.navy }}>Historial contra este rival</div>
          {historial.length ? (
            <div className="text-xs mt-1 flex flex-col gap-0.5" style={{ color: T.navy }}>
              {historial.map((h, i) => <div key={i}><b style={{ color: col[h.resultado] }}>{h.resultado}</b> {h.golesPropios}-{h.golesRival} · {fechaCorta(h.m.fecha)} · {h.m.esLocal ? "en casa" : "fuera"}</div>)}
            </div>
          ) : <div className="text-xs mt-1" style={{ color: T.muted }}>Primer enfrentamiento registrado esta temporada.</div>}
        </div>
      </div>

      {esLiga && (
        <div className="mt-3">
          <div className="text-sm font-extrabold" style={{ color: T.navy }}>Qué pasa en la clasificación</div>
          {!hayTabla ? (
            <div className="text-xs mt-1" style={{ color: T.muted }}>Indica tu posición en la clasificación para ver los escenarios. <button onClick={onEditStandings} className="font-bold" style={{ color: T.red }}>Cargar datos →</button></div>
          ) : (
            <>
              <div className="text-xs mt-0.5" style={{ color: T.muted }}>Ahora: {s.posicion}º{s.totalEquipos ? ` de ${s.totalEquipos}` : ""} con {miPuntos} puntos.</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {escenarios.map((e, i) => (
                  <div key={i} className="rounded-xl p-2.5" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
                    <div className="text-xs font-extrabold" style={{ color: [T.green, T.yellow, T.redLight][i] }}>{e.titulo}: {e.pts} puntos</div>
                    {e.lineas.map((l, k) => <div key={k} className="text-[11px] mt-1" style={{ color: T.navy }}>{l}</div>)}
                  </div>
                ))}
              </div>
              {escenarios[0]?.directo && <div className="text-[11px] font-bold mt-2" style={{ color: T.red }}>Es un partido directo con el equipo de {escenarios[0].directo === "arriba" ? "arriba" : "abajo"}: si ganas, ese rival no suma.</div>}
              {!hayCercanos && <div className="text-xs mt-2" style={{ color: T.muted }}>Para ver cómo cambiaría tu posición, apunta los puntos del equipo de arriba y del de abajo. <button onClick={onEditStandings} className="font-bold" style={{ color: T.red }}>Añadir →</button></div>}
              {hayCercanos && <div className="text-[11px] mt-2" style={{ color: T.muted }}>Cálculo orientativo con los puntos que anotaste: los demás equipos también juegan esa jornada. Actualízalos cuando cambie la tabla.</div>}
            </>
          )}
        </div>
      )}
    </Card>
  );
}

function EstaSemanaCard({ season, trainings, matches, goto }) {
  const hoy = todayISO();
  const sumar = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const semana = (season?.weeks || []).find((w) => w.fechaInicio && hoy >= w.fechaInicio && hoy <= sumar(w.fechaInicio, 6));
  const lunes = (() => { const d = new Date(`${hoy}T12:00:00`); const dow = d.getDay(); d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow)); return d.toISOString().slice(0, 10); })();
  const ini = semana ? semana.fechaInicio : lunes, fin = sumar(ini, 6);
  const ses = trainings.filter((t) => t.fecha >= ini && t.fecha <= fin).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const par = matches.filter((m) => m.fecha >= ini && m.fecha <= fin).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const lineas = (t) => String(t || "").split("\n").filter(Boolean);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div><Eyebrow>Esta semana</Eyebrow>
          <h2 className="text-lg font-extrabold mt-1" style={{ color: T.navy }}>{semana ? `Semana ${semana.numero}` : "Sin planificar"} <span className="text-xs font-bold" style={{ color: T.muted }}>· {fechaCorta(ini)} – {fechaCorta(fin)}</span></h2>
        </div>
        <button onClick={() => goto("temporada")} className="text-xs font-bold flex items-center gap-1" style={{ color: T.red }}>{semana ? "Ver planificación" : "Planificar la semana"} <ChevronRight size={14} /></button>
      </div>
      {semana ? (
        <div className="mt-2">
          {semana.objetivo ? <div className="text-sm whitespace-pre-line" style={{ color: T.navy }}><b>Objetivo:</b> {lineas(semana.objetivo)[0]}</div> : null}
          {semana.cargaPrevista ? <div className="text-xs mt-0.5" style={{ color: T.muted }}>Carga prevista: {semana.cargaPrevista}</div> : null}
        </div>
      ) : <div className="text-xs mt-2" style={{ color: T.muted }}>No tienes planificada esta semana. Puedes crearla o traerla del Sistema Tipo desde Temporada y Planificación.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div>
          <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Sesiones ({ses.length})</div>
          {ses.length ? ses.map((t) => <div key={t.id} className="text-xs mt-1" style={{ color: T.navy }}><b style={{ color: t.fecha === hoy ? T.red : T.navy }}>{t.fecha === hoy ? "HOY" : fechaCorta(t.fecha)}</b> · {sessionDisplayName(t)}</div>) : <div className="text-xs mt-1" style={{ color: T.muted }}>Ninguna programada esta semana.</div>}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Partidos ({par.length})</div>
          {par.length ? par.map((m) => <div key={m.id} className="text-xs mt-1" style={{ color: T.navy }}><b>{fechaCorta(m.fecha)}</b> · vs {m.rival}{m.resultadoFinal && m.fecha <= hoy ? ` (${m.resultadoFinal})` : ""}</div>) : <div className="text-xs mt-1" style={{ color: T.muted }}>Ninguno esta semana.</div>}
        </div>
      </div>
    </Card>
  );
}

function Dashboard({ ctx, goto }) {
  const { config, players, matches, trainings, standings, updateStandings, updateMatches } = ctx;
  const [editingStandings, setEditingStandings] = useState(false);
  const [viewingMatch, setViewingMatch] = useState(null);
  // Trata como "Liga" cualquier partido que no sea explícitamente Amistoso o Torneo,
  // para no perder partidos cargados antes de que "Competición" fuera un selector.
  const ligaMatches = useMemo(() => matches.filter((m) => m.competicion !== "Amistoso" && m.competicion !== "Torneo"), [matches]);
  const amistosoMatches = useMemo(() => matches.filter((m) => m.competicion === "Amistoso"), [matches]);
  const torneoMatches = useMemo(() => matches.filter((m) => m.competicion === "Torneo"), [matches]);
  const teamStats = useMemo(() => computeTeamStats(ligaMatches), [ligaMatches]);
  const amistosoStats = useMemo(() => computeTeamStats(amistosoMatches), [amistosoMatches]);
  const torneoStats = useMemo(() => computeTeamStats(torneoMatches), [torneoMatches]);
  const disponibles = players.filter((p) => p.estado === "Disponible").length;
  const lesionados = players.filter((p) => p.estado === "Lesionado").length;
  const sancionados = players.filter((p) => p.estado === "Sancionado").length;
  const amarillas = players.reduce((s, p) => s + p.stats.amarillas, 0);
  const rojas = players.reduce((s, p) => s + p.stats.rojas, 0);
  const avgRating = players.length ? (players.reduce((s, p) => s + (p.manualRating ?? avgLast(p.stats.valoraciones)), 0) / players.length).toFixed(1) : "-";

  const today = todayISO();
  const sortedMatchesAsc = [...matches].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pastMatches = sortedMatchesAsc.filter((m) => m.cerrado && m.fecha <= today);
  const futureMatches = sortedMatchesAsc.filter((m) => m.fecha > today);
  const lastMatch = pastMatches[pastMatches.length - 1];
  const nextMatch = futureMatches[0];

  const sortedTrainingsAsc = [...trainings].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pastTrainings = sortedTrainingsAsc.filter((t) => t.fecha <= today);
  const futureTrainings = sortedTrainingsAsc.filter((t) => t.fecha > today);
  const lastTraining = pastTrainings[pastTrainings.length - 1];
  const nextTraining = futureTrainings[0] || sortedTrainingsAsc[sortedTrainingsAsc.length - 1];

  // La clasificación (posición y total de equipos) se carga a mano; el resto de estadísticas
  // de Liga se calculan siempre en automático a partir de los partidos de competición oficial.
  const s = standings || {};
  const { v, e, d, gf, gc } = teamStats;
  const jugadosRecord = v + e + d;
  const pctVictorias = jugadosRecord ? Math.round((v / jugadosRecord) * 100) : 0;

  const casaMatches = ligaMatches.filter((m) => m.esLocal);
  const fueraMatches = ligaMatches.filter((m) => !m.esLocal);
  const casaStats = computeTeamStats(casaMatches);
  const fueraStats = computeTeamStats(fueraMatches);
  const puntosCasa = casaStats.v * 3 + casaStats.e;
  const puntosFuera = fueraStats.v * 3 + fueraStats.e;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <Eyebrow>Panel informativo</Eyebrow>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: T.navy }}>{config.teamName}</h1>
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: T.text }}>{config.category}</span>
          <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: T.muted }}>·</span>
          <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: T.red }}>Temporada {config.season}</span>
        </div>
        <div className="mt-3"><PitchDivider /></div>
      </div>

      <StandingsCard standings={standings} onEdit={() => setEditingStandings(true)} teamStats={teamStats} casaStats={casaStats} fueraStats={fueraStats} puntosCasa={puntosCasa} puntosFuera={puntosFuera} />
      {editingStandings && <StandingsForm initial={standings} onClose={() => setEditingStandings(false)}
        onSave={(s2) => { updateStandings(s2); setEditingStandings(false); }} />}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile label="Jugadores" value={players.length} icon={Users} sub={`${disponibles} disponibles`} />
        <StatTile label="Sesiones" value={trainings.length} icon={Dumbbell} />
        <StatTile label="Valoración media" value={avgRating} icon={Star} accent={T.yellow} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <Eyebrow>Récord de Liga</Eyebrow>
          <div className="flex items-end justify-center gap-4 mt-2 flex-wrap text-center">
            <div><div className="text-2xl font-extrabold" style={{ color: T.green }}>{v}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Victorias</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.yellow }}>{e}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Empates</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.redLight }}>{d}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Derrotas</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{pctVictorias}%</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>% Victorias</div></div>
          </div>
        </Card>
        <Card className="p-4">
          <Eyebrow>Goles de Liga</Eyebrow>
          <div className="flex items-end justify-center gap-4 mt-2 text-center">
            <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{gf}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>A favor</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{gc}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>En contra</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{gf - gc >= 0 ? "+" : ""}{gf - gc}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Diferencia</div></div>
          </div>
        </Card>
        <Card className="p-4">
          <Eyebrow>Disciplina</Eyebrow>
          <div className="flex items-end justify-center gap-4 mt-2 text-center">
            <div><div className="text-2xl font-extrabold" style={{ color: T.yellow }}>{amarillas}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Amarillas</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.redLight }}>{rojas}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Rojas</div></div>
            <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{lesionados + sancionados}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>No disponibles</div></div>
          </div>
        </Card>
      </div>

      {(amistosoMatches.length > 0 || torneoMatches.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {amistosoMatches.length > 0 && (
            <Card className="p-4">
              <Eyebrow>Palmarés de amistosos</Eyebrow>
              <div className="flex items-end justify-center gap-4 mt-2 flex-wrap text-center">
                <div><div className="text-2xl font-extrabold" style={{ color: T.green }}>{amistosoStats.v}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Victorias</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.yellow }}>{amistosoStats.e}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Empates</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.redLight }}>{amistosoStats.d}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Derrotas</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{amistosoStats.gf}:{amistosoStats.gc}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Goles</div></div>
              </div>
            </Card>
          )}
          {torneoMatches.length > 0 && (
            <Card className="p-4">
              <Eyebrow>Torneos rápidos</Eyebrow>
              <div className="flex items-end justify-center gap-4 mt-2 flex-wrap text-center">
                <div><div className="text-2xl font-extrabold" style={{ color: T.green }}>{torneoStats.v}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Victorias</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.yellow }}>{torneoStats.e}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Empates</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.redLight }}>{torneoStats.d}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Derrotas</div></div>
                <div><div className="text-2xl font-extrabold" style={{ color: T.navy }}>{torneoStats.gf}:{torneoStats.gc}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Goles</div></div>
              </div>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4">
          <Eyebrow>Último partido</Eyebrow>
          {lastMatch ? (
            <div className="mt-2">
              <div className="font-extrabold" style={{ color: T.navy }}>{config.teamName} {lastMatch.resultadoFinal} {lastMatch.rival}</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>{lastMatch.fecha} · Jornada {lastMatch.jornada} · {lastMatch.competicion}</div>
              <button onClick={() => setViewingMatch(lastMatch)} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: T.red }}>Ver detalle del partido <ChevronRight size={14} /></button>
            </div>
          ) : <div className="text-sm mt-2" style={{ color: T.muted }}>Sin partidos jugados todavía.</div>}
        </Card>
        <Card className="p-4">
          <Eyebrow>Próximo partido</Eyebrow>
          {nextMatch ? (
            <div className="mt-2">
              <div className="font-extrabold" style={{ color: T.navy }}>vs {nextMatch.rival}</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>{nextMatch.fecha} · {nextMatch.campo || "Campo por confirmar"}</div>
              <button onClick={() => setViewingMatch(nextMatch)} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: T.red }}>Ver detalle del partido <ChevronRight size={14} /></button>
            </div>
          ) : <div className="text-sm mt-2" style={{ color: T.muted }}>Sin próximo partido programado.</div>}
        </Card>
        <Card className="p-4">
          <Eyebrow>Última sesión realizada</Eyebrow>
          {lastTraining ? (
            <div className="mt-2">
              <div className="font-extrabold" style={{ color: T.navy }}>{sessionDisplayName(lastTraining)}</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>{lastTraining.fecha} · {lastTraining.hora} · {lastTraining.lugar}</div>
              <button onClick={() => goto("entrenamientos")} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: T.red }}>Ver entrenamientos <ChevronRight size={14} /></button>
            </div>
          ) : <div className="text-sm mt-2" style={{ color: T.muted }}>Sin sesiones realizadas todavía.</div>}
        </Card>
        <Card className="p-4">
          <Eyebrow>Próxima sesión</Eyebrow>
          {nextTraining ? (
            <div className="mt-2">
              <div className="font-extrabold" style={{ color: T.navy }}>{sessionDisplayName(nextTraining)}</div>
              <div className="text-xs mt-1 flex items-center gap-1" style={{ color: T.muted }}><MapPin size={12} />{nextTraining.lugar || "Lugar por confirmar"} · {nextTraining.fecha} · {nextTraining.hora}</div>
              <button onClick={() => goto("entrenamientos")} className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: T.red }}>Ver entrenamientos <ChevronRight size={14} /></button>
            </div>
          ) : <div className="text-sm mt-2" style={{ color: T.muted }}>Sin sesiones programadas.</div>}
        </Card>
      </div>

      <PrepararPartidoCard nextMatch={nextMatch} matches={matches} rivals={ctx.rivals} standings={standings} miPuntos={teamStats.v * 3 + teamStats.e}
        esLiga={!!nextMatch && nextMatch.competicion !== "Amistoso" && nextMatch.competicion !== "Torneo"} goto={goto} onEditStandings={() => setEditingStandings(true)} />
      <EstaSemanaCard season={ctx.season} trainings={trainings} matches={matches} goto={goto} />

      <SmartAlerts ctx={ctx} />

      {viewingMatch && (
        <MatchDetailView match={viewingMatch} players={players} config={config}
          onClose={() => setViewingMatch(null)}
          onEdit={() => { setViewingMatch(null); goto("partidos"); }}
          onDelete={() => { if (confirm("¿Eliminar este partido?")) { updateMatches((prev) => prev.filter((x) => x.id !== viewingMatch.id)); setViewingMatch(null); } }} />
      )}
    </div>
  );
}

function avgLast(arr) {
  if (!arr || !arr.length) return 0;
  return arr[arr.length - 1];
}

function SmartAlerts({ ctx }) {
  const { players, trainings, matches, config } = ctx;
  const today = todayISO();
  const alerts = [];
  players.forEach((p) => {
    if (p.stats.amarillas >= 3) alerts.push({ type: "warn", text: `${p.nombre} acumula ${p.stats.amarillas} tarjetas amarillas.` });

    // Roja en el último partido disputado: alerta de sanción para el próximo partido
    const playerPastMatches = matches.filter((m) => m.cerrado && m.fecha <= today && (m.convocatoria || []).some((c) => c.jugadorId === p.id && c.estado === "Convocado")).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const lastMatch = playerPastMatches[0];
    if (lastMatch && (lastMatch.tarjetas || []).some((t) => t.jugadorId === p.id && (t.tipo || "").toLowerCase().includes("roja"))) {
      alerts.push({ type: "danger", text: `Alerta: ${p.nombre}${p.posicion === "Portero" ? " (portero)" : ""} tiene tarjeta roja del último partido — no puede jugar el próximo.` });
    }

    const pct = p.stats.entrenamientosTotales ? Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100) : 100;
    if (pct < 60) alerts.push({ type: "danger", text: `${p.nombre} tiene una asistencia a entrenamientos del ${pct}%.` });
    const v = p.stats.valoraciones;
    if (v && v.length >= 3) {
      const trend = v[v.length - 1] - v[v.length - 3];
      if (trend <= -1) alerts.push({ type: "danger", text: `${p.nombre} muestra una tendencia de rendimiento negativa.` });
      if (trend >= 1) alerts.push({ type: "good", text: `${p.nombre} muestra una tendencia de rendimiento muy positiva.` });
    }
  });
  const fCounts = {};
  Object.values(config.foundations).flat().forEach((f) => (fCounts[f] = 0));
  trainings.forEach((t) => { (t.objetivos?.tacticos || "").split(",").forEach((f) => { const k = f.trim(); if (fCounts[k] !== undefined) fCounts[k]++; }); });
  const forgotten = Object.entries(fCounts).filter(([, c]) => c === 0).map(([f]) => f).slice(0, 3);
  if (forgotten.length) alerts.push({ type: "warn", text: `Fundamentos poco trabajados últimamente: ${forgotten.join(", ")}.` });

  // Analiza con qué sistema táctico el equipo obtiene mejores resultados
  const bySystem = {};
  matches.forEach((m) => {
    if (!m.sistema) return;
    if (!bySystem[m.sistema]) bySystem[m.sistema] = { v: 0, e: 0, d: 0, total: 0 };
    const { resultado } = resultadoPropio(m);
    bySystem[m.sistema].total++;
    if (resultado === "V") bySystem[m.sistema].v++; else if (resultado === "E") bySystem[m.sistema].e++; else bySystem[m.sistema].d++;
  });
  const systemsWithEnoughData = Object.entries(bySystem).filter(([, s]) => s.total >= 2);
  if (systemsWithEnoughData.length) {
    const ranked = systemsWithEnoughData
      .map(([sys, s]) => ({ sys, s, pct: Math.round(((s.v + s.e * 0.5) / s.total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
    const best = ranked[0];
    if (ranked.length > 1 && best.pct > ranked[1].pct) {
      alerts.push({ type: "good", text: `Con el sistema ${best.sys} el equipo rinde mejor: ${best.s.v}V ${best.s.e}E ${best.s.d}D (${best.pct}% de rendimiento) en ${best.s.total} partidos.` });
    } else if (ranked.length === 1) {
      alerts.push({ type: "good", text: `Con el sistema ${best.sys}: ${best.s.v}V ${best.s.e}E ${best.s.d}D (${best.pct}% de rendimiento) en ${best.s.total} partidos.` });
    }
  }

  if (!alerts.length) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} style={{ color: T.red }} />
        <span className="font-extrabold text-sm" style={{ color: T.navy }}>Datos importantes</span>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.slice(0, 6).map((a, i) => {
          const c = a.type === "danger" ? T.redLight : a.type === "good" ? T.green : T.yellow;
          return (
            <div key={i} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: c }} />
              <span style={{ color: T.text }}>{a.text}</span>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] mt-3" style={{ color: T.muted }}>Estas son sugerencias automáticas. La decisión final es siempre del cuerpo técnico.</div>
    </Card>
  );
}

/* ============================================================
   PLANTILLA
   ============================================================ */

const RANKING_LABELS = {
  actitud: "Actitud y esfuerzo en los partidos",
  goles: "Goles",
  asistencias: "Asistencias en partido",
  decisiones: "Toma de decisiones con balón",
  lectura: "Lectura de juego sin balón",
  asistenciaEntreno: "Asistencia a entrenamientos",
  instrucciones: "Sigue instrucciones del entrenador",
  tarjetas: "Tarjetas o amonestaciones",
  liderazgo: "Liderazgo en el equipo",
  tecnica: "Técnica",
  velocidad: "Velocidad",
  fuerza: "Fuerza",
  elasticidad: "Elasticidad",
  resistencia: "Resistencia",
};

function rankingScore(p, weights) {
  const attrs = p.attrs || {};
  const g = p.stats.goles, a = p.stats.asistencias;
  const asis = p.stats.entrenamientosTotales ? (p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 10 : 5;
  const cards = p.stats.amarillas * 0.5 + p.stats.rojas * 2;
  const actitud = attrs.actitud ?? 5;
  const decisiones = attrs.decisiones ?? 5;
  const lectura = attrs.lectura ?? 5;
  const instrucciones = attrs.instrucciones ?? 5;
  const liderazgo = attrs.liderazgo ?? 5;
  const tecnica = attrs.tecnica ?? 5, velocidad = attrs.velocidad ?? 5, fuerza = attrs.fuerza ?? 5, elasticidad = attrs.elasticidad ?? 5, resistencia = attrs.resistencia ?? 5;
  const raw = (
    tecnica * (weights.tecnica ?? 0) +
    velocidad * (weights.velocidad ?? 0) +
    fuerza * (weights.fuerza ?? 0) +
    elasticidad * (weights.elasticidad ?? 0) +
    resistencia * (weights.resistencia ?? 0) +
    actitud * (weights.actitud ?? 0) +
    g * (weights.goles ?? 0) +
    a * (weights.asistencias ?? 0) +
    decisiones * (weights.decisiones ?? 0) +
    lectura * (weights.lectura ?? 0) +
    asis * (weights.asistenciaEntreno ?? 0) +
    instrucciones * (weights.instrucciones ?? 0) +
    liderazgo * (weights.liderazgo ?? 0) -
    cards * Math.abs(weights.tarjetas ?? 0)
  ) / 100;
  return p.manualRating ?? +raw.toFixed(2);
}

function Plantilla({ ctx, onSelect }) {
  const { players, updatePlayers, config, season } = ctx;
  const [sortBy, setSortBy] = useState("ranking");
  const [filterPos, setFilterPos] = useState("Todas");
  const [filterState, setFilterState] = useState("Todos");
  const [showNew, setShowNew] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [editingPlayer, setEditingPlayer] = useState(null);

  const deletePlayer = (p) => {
    if (confirm(`¿Eliminar a ${p.nombre}? Esta acción no se puede deshacer.`)) {
      updatePlayers((prev) => prev.filter((x) => x.id !== p.id));
    }
  };

  const ranked = players.map((p) => ({ ...p, ranking: rankingScore(p, config.rankingWeights) }));
  let list = ranked;
  if (filterPos !== "Todas") list = list.filter((p) => p.posicion === filterPos);
  if (filterState !== "Todos") list = list.filter((p) => p.estado === filterState);
  const sorters = {
    ranking: (a, b) => b.ranking - a.ranking,
    numero: (a, b) => a.numero - b.numero,
    goles: (a, b) => b.stats.goles - a.stats.goles,
    minutos: (a, b) => b.stats.minutos - a.stats.minutos,
    tarjetas: (a, b) => (b.stats.amarillas + b.stats.rojas * 2) - (a.stats.amarillas + a.stats.rojas * 2),
    asistencia: (a, b) => (b.stats.entrenamientosRealizados / b.stats.entrenamientosTotales) - (a.stats.entrenamientosRealizados / a.stats.entrenamientosTotales),
  };
  list = [...list].sort(sorters[sortBy]);

  return (
    <div className="flex flex-col gap-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Eyebrow>Plantilla</Eyebrow>
          <h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{players.length} jugadores registrados</h1>
        </div>
        <div className="flex items-center gap-2">
          <Btn icon={Printer} variant="ghost" onClick={() => printPlantilla(players, config, season)}>Imprimir plantilla</Btn>
          <Btn icon={Plus} variant="accent" onClick={() => setShowNew(true)}>Nuevo jugador</Btn>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-36"><PickerField value={filterPos} options={["Todas", ...config.positions]} onChange={setFilterPos} placeholder="Posición" /></div>
        <div className="w-36"><PickerField value={filterState} options={["Todos", ...estadosJugador(config)]} onChange={setFilterState} placeholder="Estado" /></div>
        <div className="w-44">
          <PickerField value={sortBy} onChange={setSortBy} placeholder="Ordenar por"
            options={[
              { value: "ranking", label: "Ordenar: Ranking" },
              { value: "numero", label: "Ordenar: Número" },
              { value: "goles", label: "Ordenar: Goles" },
              { value: "minutos", label: "Ordenar: Minutos" },
              { value: "tarjetas", label: "Ordenar: Tarjetas" },
              { value: "asistencia", label: "Ordenar: Asistencia" },
            ]} />
        </div>
        <div className="flex items-center rounded-xl border overflow-hidden ml-auto" style={{ borderColor: T.line }}>
          <button onClick={() => setViewMode("grid")} className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"
            style={{ background: viewMode === "grid" ? T.navy : "#fff", color: viewMode === "grid" ? "#fff" : T.muted }}>
            <LayoutGrid size={14} />Tarjetas
          </button>
          <button onClick={() => setViewMode("list")} className="px-3 py-2 text-xs font-bold flex items-center gap-1.5 border-l"
            style={{ background: viewMode === "list" ? T.navy : "#fff", color: viewMode === "list" ? "#fff" : T.muted, borderColor: T.line }}>
            <ClipboardList size={14} />Listado
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((p) => {
            const sc = stateColor(p.estado);
            const pct = Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100);
            return (
              <Card key={p.id} className="p-4 cursor-pointer hover:shadow-md transition relative" onClick={() => onSelect(p.id)}>
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  <button onClick={(e) => { e.stopPropagation(); setEditingPlayer(p); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                    <Edit3 size={14} style={{ color: T.muted }} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deletePlayer(p); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                    <Trash2 size={14} style={{ color: T.redLight }} />
                  </button>
                </div>
                <div className="flex items-start justify-between pr-14">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {p.foto && <img src={p.foto} alt={`Foto de ${p.apodo || p.nombre}`} className="w-12 h-12 rounded-xl object-cover shrink-0" style={{ border: `1px solid ${T.line}` }} />}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-white shrink-0" style={{ background: T.navy }}>{p.numero}</div>
                    <div className="min-w-0">
                      <div className="font-extrabold leading-tight" style={{ color: T.navy }}>{p.apodo || p.nombre}</div>
                      <div className="text-xs" style={{ color: T.muted }}>{p.posicion}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-1"><Pill color={sc.color} bg={sc.bg}>{p.estado}</Pill></div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                  <div><div className="font-extrabold tabular-nums" style={{ color: T.navy }}>{p.ranking}</div><div className="text-[10px] font-bold uppercase" style={{ color: T.muted }}>Rank</div></div>
                  <div><div className="font-extrabold tabular-nums" style={{ color: T.navy }}>{p.stats.goles}</div><div className="text-[10px] font-bold uppercase" style={{ color: T.muted }}>Goles</div></div>
                  <div><div className="font-extrabold tabular-nums" style={{ color: T.navy }}>{p.stats.minutos}</div><div className="text-[10px] font-bold uppercase" style={{ color: T.muted }}>Min</div></div>
                  <div className="flex flex-col items-center"><Trend values={p.stats.valoraciones} /><div className="text-[10px] font-bold uppercase" style={{ color: T.muted }}>Tend.</div></div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: T.muted }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.stats.amarillas ? T.yellow : T.line }} />{p.stats.amarillas} amarillas
                  <span className="w-2 h-2 rounded-full ml-2" style={{ background: p.stats.rojas ? T.redLight : T.line }} />{p.stats.rojas} rojas
                  <span className="ml-auto font-bold">{pct}% asist.</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2.5rem_1fr_6rem_5rem_5rem_5rem_5rem_4rem] gap-2 px-4 py-2.5 text-[11px] font-bold uppercase" style={{ color: T.muted, background: "#F7F8FA" }}>
            <span>#</span><span>Jugador</span><span>Estado</span><span>Rank</span><span>Goles</span><span>Min</span><span>Asist.</span><span></span>
          </div>
          <div className="divide-y" style={{ borderColor: T.line }}>
            {list.map((p) => {
              const sc = stateColor(p.estado);
              const pct = Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100);
              return (
                <div key={p.id} onClick={() => onSelect(p.id)}
                  className="grid grid-cols-[2.5rem_1fr_6rem_5rem_5rem_5rem_5rem_4rem] gap-2 px-4 py-2.5 items-center cursor-pointer hover:bg-slate-50 transition text-sm">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-white text-xs" style={{ background: T.navy }}>{p.numero}</div>
                  <div className="min-w-0">
                    <div className="font-bold truncate" style={{ color: T.navy }}>{p.apodo || p.nombre}</div>
                    <div className="text-[11px] truncate" style={{ color: T.muted }}>{p.posicion}</div>
                  </div>
                  <div><Pill color={sc.color} bg={sc.bg}>{p.estado}</Pill></div>
                  <div className="font-bold tabular-nums" style={{ color: T.navy }}>{p.ranking}</div>
                  <div className="tabular-nums">{p.stats.goles}</div>
                  <div className="tabular-nums">{p.stats.minutos}</div>
                  <div className="font-bold tabular-nums">{pct}%</div>
                  <div className="flex gap-1 justify-end">
                    <button onClick={(e) => { e.stopPropagation(); setEditingPlayer(p); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                      <Edit3 size={14} style={{ color: T.muted }} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deletePlayer(p); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                      <Trash2 size={14} style={{ color: T.redLight }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {showNew && <PlayerForm ctx={ctx} onClose={() => setShowNew(false)} onSave={(p) => { updatePlayers((prev) => [...prev, p]); setShowNew(false); }} />}
      {editingPlayer && <PlayerForm ctx={ctx} initial={editingPlayer} onClose={() => setEditingPlayer(null)}
        onSave={(np) => { updatePlayers((prev) => prev.map((x) => x.id === np.id ? np : x)); setEditingPlayer(null); }} />}
    </div>
  );
}

/* ============================================================
   FICHA DE REGISTRO Y MONITOREO DEL JUGADOR (libro, pág. 289)
   Siete bloques, A a G. Los datos nuevos se guardan en p.ficha; los que ya existían siguen donde estaban.
   ============================================================ */
const ESTADOS_BASE = ["Disponible", "Lesionado", "En recuperación", "Sancionado", "Ausente temporal", "Baja", "Otro"];
const estadosJugador = (config) => [...ESTADOS_BASE, ...(config?.playerStates || []).filter((x) => !ESTADOS_BASE.includes(x))];
const FICHA_SECCIONES = [
  { id: "A", titulo: "Datos personales", campos: [
    { k: "foto", top: true, t: "foto", label: "Foto del jugador", full: true },
    { k: "nombrePila", label: "Nombre" }, { k: "apellido1", label: "Primer apellido" }, { k: "apellido2", label: "Segundo apellido" },
    { k: "apodo", top: true, label: "Nombre deportivo / apodo" },
    { k: "dob", top: true, t: "fecha", label: "Fecha de nacimiento" }, { k: "edad", t: "edad", label: "Edad" },
    { k: "lugarNacimiento", label: "Lugar de nacimiento" }, { k: "nacionalidad", label: "Nacionalidad" },
    { k: "documento", label: "Documento de identificación" }, { k: "telefono", label: "Teléfono" },
    { k: "direccion", label: "Dirección / localidad" }, { k: "email", label: "Correo electrónico" },
  ] },
  { id: "B", titulo: "Datos deportivos", campos: [
    { k: "numero", top: true, t: "num", label: "Número de camiseta" },
    { k: "categoria", label: "Categoría" }, { k: "equipo", label: "Equipo" },
    { k: "fechaIncorporacion", top: true, t: "fecha", label: "Fecha de incorporación" },
    { k: "posicion", top: true, t: "pos", label: "Posición principal" },
    { k: "secundarias", top: true, t: "chips", label: "Posiciones secundarias", full: true },
    { k: "posicionTercera", t: "pos", label: "Tercera posición" },
    { k: "pie", top: true, t: "sel", opciones: ["Diestro", "Zurdo", "Ambidiestro"], label: "Pierna hábil (pie dominante)" },
    { k: "manoHabil", t: "sel", opciones: ["Derecha", "Izquierda", "Ambas"], vacio: true, label: "Mano hábil" },
    { k: "nivelAnterior", label: "Nivel / categoría anterior" }, { k: "clubAnterior", label: "Club anterior" },
    { k: "aniosPractica", t: "num", label: "Años de práctica" }, { k: "licencia", label: "Licencia federativa" },
    { k: "obsDeportivas", t: "area", label: "Observaciones deportivas", full: true },
  ] },
  { id: "C", titulo: "Características antropométricas", campos: [
    { k: "altura", top: true, t: "num", u: "cm", label: "Estatura (cm)" }, { k: "peso", top: true, t: "num", u: "kg", label: "Peso (kg)" },
    { k: "envergadura", t: "num", u: "cm", label: "Envergadura (cm, opcional)" },
    { k: "tallaCamiseta", label: "Talla de camiseta" }, { k: "tallaPantalon", label: "Talla de pantalón" }, { k: "tallaCalzado", label: "Talla de calzado" },
  ] },
  { id: "D", titulo: "Formación académica", campos: [
    { k: "nivelEstudios", label: "Nivel de estudios" }, { k: "centroEducativo", label: "Centro educativo" },
    { k: "cursoActual", label: "Curso / nivel actual" }, { k: "estudiosComplementarios", label: "Estudios complementarios" },
    { k: "obsAcademicas", t: "area", label: "Observaciones", full: true },
  ] },
  { id: "E", titulo: "Información médica / de salud", confidencial: true, campos: [
    { k: "tipoSangre", label: "Tipo de sangre" }, { k: "alergias", label: "Alergias conocidas" },
    { k: "medicacion", label: "Medicación relevante" }, { k: "lesionesAnteriores", t: "area", label: "Lesiones anteriores" },
    { k: "lesionesActuales", t: "area", label: "Lesiones actuales" }, { k: "fechaLesion", t: "fecha", label: "Fecha de lesión" },
    { k: "zonaAfectada", label: "Zona afectada" }, { k: "tratamiento", t: "area", label: "Tratamiento / rehabilitación" },
    { k: "fechaReincorporacion", t: "fecha", label: "Fecha de reincorporación" }, { k: "restricciones", label: "Restricciones deportivas" },
    { k: "obsMedicas", t: "area", label: "Observaciones relevantes", full: true },
  ] },
  { id: "F", titulo: "Contacto de emergencia", campos: [
    { k: "tutorNombre", label: "Nombre del padre / madre / tutor" }, { k: "tutorRelacion", label: "Relación con el jugador" },
    { k: "tutorTelefono", label: "Teléfono principal" }, { k: "tutorTelefono2", label: "Teléfono alternativo" },
    { k: "tutorEmail", label: "Correo electrónico" }, { k: "contactoEmergencia", label: "Contacto de emergencia" },
    { k: "obsContacto", t: "area", label: "Observaciones", full: true },
  ] },
  { id: "G", titulo: "Situación del jugador", campos: [
    { k: "estado", top: true, t: "estado", label: "Situación actual" },
    { k: "fechaActualizacion", t: "fecha", label: "Fecha de última actualización" },
    { k: "responsableActualizacion", label: "Responsable de la actualización" },
    { k: "observaciones", top: true, t: "area", label: "Observaciones generales", full: true },
    { k: "consentimiento", t: "check", label: "Autorización / consentimiento firmado" },
    { k: "consentimientoResponsable", label: "Nombre del responsable (consentimiento)" },
    { k: "consentimientoFecha", t: "fecha", label: "Fecha del consentimiento" },
  ] },
];
const fichaValor = (p, c, config) => {
  if (c.t === "edad") { const e = calcAge(p.dob); return e ? `${e} años` : ""; }
  if (c.k === "nombrePila") return p.ficha?.nombrePila ?? "";
  const v = c.top ? p[c.k] : p.ficha?.[c.k];
  if (c.t === "chips") return (v || []).join(", ");
  if (c.t === "check") return v ? "Sí" : "";
  if (v == null || v === "") return c.k === "equipo" ? (config?.teamName || "") : c.k === "categoria" ? (config?.category || "") : "";
  return c.u ? `${v} ${c.u}` : String(v);
};
/* Los campos con valor de una sección (para ver y para imprimir). */
const fichaCamposConValor = (p, sec, config) => sec.campos.filter((c) => c.t !== "foto" && c.k !== "nombrePila" && c.k !== "apellido1" && c.k !== "apellido2" && fichaValor(p, c, config) !== "").map((c) => [c, fichaValor(p, c, config)]);

/* ============================================================
   FICHA DE COACHING DEPORTIVO Y MONITOREO DEL JUGADOR (libro, pág. 290)
   Autoevaluación del jugador + tres evaluaciones del entrenador, valoradas del 1 al 10.
   Información privada entre jugador y entrenador.
   ============================================================ */
const COACHING_AREAS = [
  { k: "tecnicos", titulo: "Fundamentos técnicos", color: "#2A9D5C", items: ["Control del balón", "Conducción", "Pase (corto, medio, largo)", "Regate", "Remate / definición", "Juego aéreo", "Golpeo de balón", "Protección del balón", "1 vs 1 ofensivo", "1 vs 1 defensivo", "Pases en profundidad", "Centros / cambios de juego", "Tiros libres", "Penales", "Dominio orientado", "Recepción", "Desmarque", "Cabeceo ofensivo", "Cabeceo defensivo", "Finalización en el área"] },
  { k: "tacticos", titulo: "Fundamentos tácticos", color: "#1E3A8A", items: ["Comprensión táctica", "Posicionamiento", "Movilidad sin balón", "Toma de decisiones", "Apoyo y participación", "Transición ofensiva", "Transición defensiva", "Presión / intensidad", "Coberturas defensivas", "Balón parado (ofensivo y defensivo)"] },
  { k: "fisicos", titulo: "Fundamentos físicos", color: "#E63946", items: ["Resistencia aeróbica", "Resistencia anaeróbica", "Fuerza", "Velocidad", "Potencia", "Agilidad", "Coordinación", "Flexibilidad / movilidad", "Equilibrio", "Prevención de lesiones"] },
  { k: "psicologicos", titulo: "Fundamentos psicológicos", color: "#D99A00", items: ["Concentración", "Confianza / autoestima", "Motivación", "Control emocional", "Comunicación", "Liderazgo", "Trabajo en equipo", "Responsabilidad", "Actitud competitiva", "Gestión del estrés"] },
];
const COACHING_SLOTS = [["auto", "Autoevaluación"], ["e1", "Evaluación 1"], ["e2", "Evaluación 2"], ["e3", "Evaluación 3"]];
const colorNota = (n) => (n <= 3 ? "#E63946" : n <= 5 ? "#E0A100" : n <= 7 ? "#2A9D5C" : "#1B7A44");
const mediaArea = (valores, area) => {
  const v = area.items.map((_, i) => valores?.[`${area.k}.${i}`]).filter((x) => typeof x === "number");
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
};
/* Las evaluaciones guardadas, en orden, y la tendencia entre las dos últimas del entrenador. */
function coachingResumen(coaching) {
  const c = coaching || {};
  const slots = COACHING_SLOTS.map(([k, label]) => ({ k, label, ev: c[k] || null })).filter((x) => x.ev && x.ev.fecha);
  const entrenador = slots.filter((x) => x.k !== "auto");
  const ultima = entrenador[entrenador.length - 1], previa = entrenador[entrenador.length - 2];
  const tendencia = (area, i) => {
    if (!ultima || !previa) return null;
    const a = previa.ev.valores?.[`${area.k}.${i}`], b = ultima.ev.valores?.[`${area.k}.${i}`];
    if (typeof a !== "number" || typeof b !== "number") return null;
    return b > a ? 1 : b < a ? -1 : 0;
  };
  return { slots, entrenador, ultima, previa, tendencia };
}
/* Un gráfico por área (línea fina, escala ajustada a sus valores, valor en cada punto) y, si hay autoevaluación,
   una línea discontinua gris con su promedio. Devuelve SVG en texto, para pantalla y para impresión. */
function coachingGraficoHTML(coaching, opciones = {}) {
  const { entrenador } = coachingResumen(coaching);
  if (entrenador.length < 1) return "";
  const autoOk = !!coaching?.auto?.fecha;
  const fmt = (v) => String(v).replace(".", ",");
  const paneles = COACHING_AREAS.map((a) => {
    const meds = entrenador.map((e) => mediaArea(e.ev.valores, a));
    const am = autoOk ? mediaArea(coaching.auto.valores, a) : null;
    const todos = meds.filter((v) => v != null).concat(am != null ? [am] : []);
    const titulo = `<div style="font-size:12px;font-weight:700;margin:0 0 2px 4px;color:${a.color};">${a.titulo.replace("Fundamentos ", "")}</div>`;
    if (!todos.length) return `<div style="border:1px solid #E2E8F0;border-radius:8px;padding:6px;background:#fff;">${titulo}<div style="font-size:11px;color:#64748B;padding:14px 4px;">Sin valoraciones</div></div>`;
    let lo = Math.max(1, Math.floor(Math.min(...todos)) - 1), hi = Math.min(10, Math.ceil(Math.max(...todos)) + 1);
    if (hi - lo < 4) { hi = Math.min(10, lo + 4); lo = Math.max(1, hi - 4); }
    const W = 170, H = 124, l = 22, r = 14, tp = 16, bt = 26, n = entrenador.length;
    const Y = (v) => H - bt - ((v - lo) / (hi - lo)) * (H - bt - tp);
    const X = (i) => (n === 1 ? (l + W - r) / 2 : l + ((W - l - r) * i) / (n - 1));
    const paso = hi - lo <= 5 ? 1 : 2;
    let rej = "";
    for (let g = lo; g <= hi; g += paso) rej += `<line x1="${l}" y1="${Y(g)}" x2="${W - r}" y2="${Y(g)}" stroke="#CBD5E1" stroke-width="0.6"/><text x="${l - 4}" y="${Y(g) + 4}" font-size="11" fill="#64748B" text-anchor="end">${g}</text>`;
    const auto = am != null ? `<line x1="${l}" y1="${Y(am)}" x2="${W - r}" y2="${Y(am)}" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 3"/>` : "";
    const pts = meds.map((v, i) => (v == null ? null : [X(i), Y(v), v, i])).filter(Boolean);
    const linea = pts.length > 1 ? `<polyline points="${pts.map((q) => q[0] + "," + q[1]).join(" ")}" fill="none" stroke="${a.color}" stroke-width="1.6" stroke-linejoin="round"/>` : "";
    const puntos = pts.map((q) => { const primero = q[3] === 0 && n > 1; return `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="${a.color}"/><text x="${primero ? q[0] + 3 : q[0]}" y="${q[1] - 7}" font-size="11" font-weight="700" fill="${a.color}" text-anchor="${primero ? "start" : "middle"}">${fmt(q[2])}</text>`; }).join("");
    const etq = entrenador.map((e, i) => `<text x="${X(i)}" y="${H - 9}" font-size="11" fill="#64748B" text-anchor="middle">${e.label.replace("Evaluación ", "E")}</text>`).join("");
    return `<div style="border:1px solid #E2E8F0;border-radius:8px;padding:6px 6px 2px;background:#fff;">${titulo}<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Evolución de ${a.titulo}">${rej}${auto}${linea}${puntos}${etq}</svg></div>`;
  }).join("");
  const leyendaAuto = autoOk ? `<div style="font-size:11px;color:#64748B;margin-top:6px;">La línea discontinua gris es la autoevaluación del jugador.</div>` : "";
  const rejilla = opciones.impresion ? `display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;` : "";
  return opciones.impresion
    ? `<div style="${rejilla}">${paneles}</div>${leyendaAuto}`
    : `<div class="grid grid-cols-2 gap-3">${paneles}</div>${leyendaAuto}`;
}
/* Mini gráfico de evolución de un fundamento (valores de las evaluaciones del entrenador, en orden). */
function coachingSparkHTML(valores) {
  const v = valores.filter((x) => typeof x === "number");
  if (v.length < 2) return `<span style="color:#94A3B8;">–</span>`;
  const lo = Math.min(...v) - 0.5, hi = Math.max(...v) + 0.5, span = Math.max(hi - lo, 2);
  const Y = (x) => 17 - ((x - lo) / span) * 14;
  const X = (i) => 6 + (i * 44) / (v.length - 1);
  const col = v[v.length - 1] > v[0] ? "#3B6D11" : v[v.length - 1] < v[0] ? "#A32D2D" : "#64748B";
  return `<svg viewBox="0 0 56 20" width="56" height="20" role="img" aria-label="Evolución"><polyline points="${v.map((x, i) => X(i) + "," + Y(x)).join(" ")}" fill="none" stroke="${col}" stroke-width="1.4" stroke-linejoin="round"/><circle cx="${X(v.length - 1)}" cy="${Y(v[v.length - 1])}" r="2.4" fill="${col}"/></svg>`;
}

function PlayerForm({ ctx, initial, onClose, onSave }) {
  const { config } = ctx;
  const [f, setF] = useState(() => {
    const base = initial || {
      nombre: "", apodo: "", numero: "", posicion: config.positions[0], secundarias: [], foto: "",
      dob: "", pie: "Diestro", altura: "", peso: "",
      estado: "Disponible", fechaIncorporacion: todayISO(), observaciones: "",
      attrs: { actitud: 5, decisiones: 5, lectura: 5, instrucciones: 5, liderazgo: 5, tecnica: 5, velocidad: 5, fuerza: 5, elasticidad: 5, resistencia: 5 },
    };
    const ficha = { ...(base.ficha || {}) };
    if (ficha.equipo === config.teamName) ficha.equipo = "";
    if (ficha.categoria === config.category) ficha.categoria = "";
    if (ficha.nombrePila == null) ficha.nombrePila = base.nombre || "";
    return { ...base, secundarias: base.secundarias || [], ficha };
  });
  const [abiertas, setAbiertas] = useState(() => new Set(["A", "B"]));
  const [error, setError] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setFicha = (k, v) => setF((p) => ({ ...p, ficha: { ...(p.ficha || {}), [k]: v } }));
  const alternar = (id) => setAbiertas((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const submit = () => {
    const fi = f.ficha || {};
    const nombre = [fi.nombrePila, fi.apellido1, fi.apellido2].map((x) => (x || "").trim()).filter(Boolean).join(" ");
    if (!nombre) { setError("Escribe el nombre del jugador."); setAbiertas((prev) => new Set([...prev, "A"])); return; }
    const fichaFinal = { ...fi, fechaActualizacion: todayISO() };
    if (fichaFinal.equipo === config.teamName) fichaFinal.equipo = "";
    if (fichaFinal.categoria === config.category) fichaFinal.categoria = "";
    const base = { ...f, nombre, numero: Number(f.numero) || 0, altura: Number(f.altura) || null, peso: Number(f.peso) || null, ficha: fichaFinal };
    const player = initial ? { ...initial, ...base } : {
      id: uid(), ...base, manualRating: null,
      stats: { convocatorias: 0, titular: 0, suplente: 0, minutos: 0, goles: 0, asistencias: 0, amarillas: 0, rojas: 0, valoraciones: [], entrenamientosRealizados: 0, entrenamientosTotales: 0 },
      custom: {}, pruebasFisicas: [],
    };
    onSave(player);
  };
  const valor = (c) => (c.top ? f[c.k] : f.ficha?.[c.k]);
  const poner = (c, v) => (c.top ? set(c.k, v) : setFicha(c.k, v));
  const campo = (c) => {
    const v = valor(c);
    let ctrl;
    if (c.t === "foto") ctrl = <TaskImageUploader value={f.foto} onChange={(x) => set("foto", x)} />;
    else if (c.t === "edad") ctrl = <div className="text-sm font-bold py-2" style={{ color: T.navy }}>{calcAge(f.dob) ? `${calcAge(f.dob)} años` : "Se calcula con la fecha de nacimiento"}</div>;
    else if (c.t === "pos") ctrl = <PickerField value={v || ""} options={config.positions} onChange={(x) => poner(c, x)} placeholder={c.label} />;
    else if (c.t === "chips") ctrl = (
      <div className="flex flex-wrap gap-1.5">
        {config.positions.map((pp) => {
          const activa = (f.secundarias || []).includes(pp);
          return <button type="button" key={pp} onClick={() => set("secundarias", activa ? f.secundarias.filter((x) => x !== pp) : [...(f.secundarias || []), pp])}
            className="px-2.5 py-1 rounded-full text-xs font-bold border" style={{ borderColor: activa ? T.navy : T.line, background: activa ? T.navy : "#fff", color: activa ? "#fff" : T.muted }}>{pp}</button>;
        })}
      </div>
    );
    else if (c.t === "sel") ctrl = <Select value={v || ""} onChange={(e) => poner(c, e.target.value)}>{c.vacio && <option value="">—</option>}{c.opciones.map((o) => <option key={o}>{o}</option>)}</Select>;
    else if (c.t === "estado") ctrl = <Select value={v || "Disponible"} onChange={(e) => poner(c, e.target.value)}>{estadosJugador(config).map((x) => <option key={x}>{x}</option>)}</Select>;
    else if (c.t === "fecha") ctrl = <TextInput type="date" value={v || ""} onChange={(e) => poner(c, e.target.value)} />;
    else if (c.t === "num") ctrl = <TextInput type="number" value={v ?? ""} onChange={(e) => poner(c, e.target.value)} />;
    else if (c.t === "area") ctrl = <TextArea value={v || ""} onChange={(e) => poner(c, e.target.value)} />;
    else if (c.t === "check") ctrl = <label className="flex items-center gap-2 text-sm font-bold py-2" style={{ color: T.navy }}><input type="checkbox" checked={!!v} onChange={(e) => poner(c, e.target.checked)} />Sí</label>;
    else ctrl = <TextInput value={v || ""} onChange={(e) => poner(c, e.target.value)} placeholder={c.k === "equipo" ? config.teamName : c.k === "categoria" ? config.category : undefined} />;
    return <Field key={c.k} label={c.k === "equipo" || c.k === "categoria" ? `${c.label} (vacío = el de Configuración)` : c.label} className={c.full ? "sm:col-span-2" : ""}>{ctrl}</Field>;
  };
  return (
    <Modal title={initial ? "Editar jugador" : "Nuevo jugador"} onClose={onClose} wide>
      <div className="flex flex-col gap-2.5">
        {FICHA_SECCIONES.map((sec) => {
          const abierta = abiertas.has(sec.id);
          const rellenos = sec.campos.filter((c) => c.t !== "foto" && c.t !== "edad" && (c.k === "nombrePila" ? (f.ficha?.nombrePila || "") !== "" : (valor(c) != null && valor(c) !== "" && !(Array.isArray(valor(c)) && !valor(c).length) && valor(c) !== false))).length;
          const total = sec.campos.filter((c) => c.t !== "foto" && c.t !== "edad").length;
          return (
            <div key={sec.id} className="rounded-xl border" style={{ borderColor: T.line }}>
              <button type="button" onClick={() => alternar(sec.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left" aria-expanded={abierta}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0" style={{ background: sec.confidencial ? T.redLight : T.navy }}>{sec.id}</span>
                <span className="flex-1 font-extrabold text-sm" style={{ color: T.navy }}>{sec.titulo}</span>
                {sec.confidencial && <Lock size={13} style={{ color: T.redLight }} />}
                <span className="text-[11px] font-bold" style={{ color: T.muted }}>{rellenos}/{total}</span>
                <ChevronRight size={16} style={{ color: T.muted, transform: abierta ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </button>
              {abierta && (
                <div className="px-3 pb-3">
                  {sec.confidencial && <div className="text-[11px] font-bold mb-2" style={{ color: T.redLight }}>Información confidencial: se guarda solo en este dispositivo y no sale en las fichas impresas.</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{sec.campos.map(campo)}</div>
                </div>
              )}
            </div>
          );
        })}
        {error && <div className="text-sm font-bold" style={{ color: T.redLight }}>{error}</div>}
      </div>
      <div className="flex justify-end gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="accent" icon={Save} onClick={submit}>Guardar<span className="hidden sm:inline">&nbsp;jugador</span></Btn>
      </div>
    </Modal>
  );
}

/* Información médica en la ficha del jugador: confidencial, oculta hasta que se pide verla. */
function MedicaGeneral({ p }) {
  const [ver, setVer] = useState(false);
  const sec = FICHA_SECCIONES.find((x) => x.id === "E");
  const campos = fichaCamposConValor(p, sec);
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: T.redLight }}>E</span>
        <div className="font-extrabold text-sm flex-1" style={{ color: T.navy }}>{sec.titulo}</div>
        <Lock size={13} style={{ color: T.redLight }} />
        <button className="text-xs font-bold" style={{ color: T.red }} onClick={() => setVer((v) => !v)}>{ver ? "Ocultar" : "Mostrar"}</button>
      </div>
      <div className="text-[11px] font-bold mt-1" style={{ color: T.redLight }}>Información confidencial: solo está en este dispositivo y no sale en las fichas impresas.</div>
      {ver && (campos.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-3">
          {campos.map(([c, v]) => (
            <div key={c.k} className={c.full ? "col-span-2 sm:col-span-3" : ""}>
              <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{c.label}</div>
              <div className="font-bold text-sm whitespace-pre-wrap" style={{ color: T.navy }}>{v}</div>
            </div>
          ))}
        </div>
      ) : <div className="text-sm mt-3" style={{ color: T.muted }}>Sin datos todavía. Pulsa «Editar» para completarlos.</div>)}
    </Card>
  );
}

/* Seguimiento de coaching (ficha 2 del libro): autoevaluación + tres evaluaciones del entrenador, del 1 al 10. */
function CoachingPanel({ ctx, player }) {
  const { updatePlayers, config } = ctx;
  const co = player.coaching || {};
  const [slot, setSlot] = useState(null);
  const [fecha, setFecha] = useState("");
  const [valores, setValores] = useState({});
  const [abierta, setAbierta] = useState("tecnicos");
  const [error, setError] = useState("");
  const guardarCo = (nuevo) => updatePlayers((prev) => prev.map((x) => (x.id === player.id ? { ...x, coaching: { ...(x.coaching || {}), ...nuevo } } : x)));
  const abrir = (k) => { const ev = co[k]; setSlot(k); setFecha(ev?.fecha || todayISO()); setValores({ ...(ev?.valores || {}) }); setError(""); setAbierta("tecnicos"); };
  const guardar = () => { if (!fecha) { setError("Pon la fecha de la evaluación."); return; } guardarCo({ [slot]: { fecha, valores } }); setSlot(null); };
  const eliminar = () => { if (confirm("¿Eliminar esta evaluación?")) { guardarCo({ [slot]: null }); setSlot(null); } };
  const total = COACHING_AREAS.reduce((n, a) => n + a.items.length, 0);
  const hechas = Object.values(valores).filter((v) => typeof v === "number").length;
  const { slots, entrenador, tendencia } = coachingResumen(co);
  const slotLabel = COACHING_SLOTS.find(([k]) => k === slot)?.[1];
  const fechaCorta = (f) => String(f || "").split("-").reverse().join("/");

  if (slot) {
    return (
      <Card className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="font-extrabold" style={{ color: T.navy }}>{slotLabel}</div>
          <div className="text-xs font-bold" style={{ color: T.muted }}>{hechas} de {total} valoradas</div>
        </div>
        <Field label="Fecha de la evaluación"><TextInput type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); setError(""); }} /></Field>
        {COACHING_AREAS.map((a) => (
          <div key={a.k} className="rounded-xl border" style={{ borderColor: T.line }}>
            <button type="button" onClick={() => setAbierta(abierta === a.k ? null : a.k)} className="w-full flex items-center gap-2 px-3 py-2 text-left" aria-expanded={abierta === a.k}>
              <span className="w-2.5 h-7 rounded-sm" style={{ background: a.color }} />
              <span className="flex-1 font-extrabold text-sm" style={{ color: T.navy }}>{a.titulo}</span>
              <span className="text-[11px] font-bold" style={{ color: T.muted }}>{a.items.filter((_, i) => typeof valores[`${a.k}.${i}`] === "number").length}/{a.items.length}</span>
              <ChevronRight size={16} style={{ color: T.muted, transform: abierta === a.k ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
            </button>
            {abierta === a.k && (
              <div className="px-3 pb-3 flex flex-col gap-2.5">
                {a.items.map((nombre, i) => {
                  const key = `${a.k}.${i}`;
                  return (
                    <div key={key}>
                      <div className="text-xs font-bold mb-1" style={{ color: T.navy }}>{i + 1} · {nombre}</div>
                      <div className="grid grid-cols-10 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                          const activo = valores[key] === n;
                          return <button type="button" key={n} aria-label={`${nombre}: ${n}`} aria-pressed={activo} onClick={() => setValores((v) => ({ ...v, [key]: activo ? undefined : n }))}
                            className="h-7 w-full rounded-full text-[11px] font-extrabold border" style={{ background: activo ? colorNota(n) : "#fff", color: activo ? "#fff" : T.muted, borderColor: activo ? colorNota(n) : T.line }}>{n}</button>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {error && <div className="text-sm font-bold" style={{ color: T.redLight }}>{error}</div>}
        <div className="flex gap-2 flex-wrap justify-end">
          {co[slot] && <Btn variant="danger" icon={Trash2} onClick={eliminar} title="Eliminar evaluación"><span className="hidden sm:inline">Eliminar</span></Btn>}
          <Btn variant="ghost" onClick={() => setSlot(null)}>Cancelar</Btn>
          <Btn variant="accent" icon={Save} onClick={guardar}>Guardar</Btn>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="p-4">
        <div className="text-[11px] font-bold uppercase mb-2" style={{ color: T.muted }}>Evaluaciones</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COACHING_SLOTS.map(([k, label]) => {
            const ev = co[k];
            return (
              <button key={k} type="button" onClick={() => abrir(k)} className="rounded-xl border px-3 py-2 text-left" style={{ borderColor: ev?.fecha ? T.navy : T.line, borderStyle: ev?.fecha ? "solid" : "dashed" }}>
                <div className="text-xs font-extrabold" style={{ color: T.navy }}>{label}</div>
                <div className="text-[11px] font-bold" style={{ color: ev?.fecha ? T.green : T.muted }}>{ev?.fecha ? fechaCorta(ev.fecha) : "Añadir fecha"}</div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold" style={{ color: T.muted }}><Lock size={12} />Información privada entre el jugador y el entrenador: no entra en los informes del equipo.</div>
      </Card>

      {!slots.length ? (
        <Card className="p-4 text-sm" style={{ color: T.muted }}>Todavía no hay evaluaciones. Pulsa una de las casillas de arriba, pon la fecha y valora cada fundamento del 1 al 10.</Card>
      ) : (
        <>
          <Card className="p-4">
            <div className="text-[11px] font-bold uppercase mb-2" style={{ color: T.muted }}>Resumen por áreas (promedio)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 300 }}>
                <thead><tr className="text-[11px] font-bold uppercase" style={{ color: T.muted }}><th className="text-left py-1">Área</th>{COACHING_SLOTS.map(([k, l]) => <th key={k} className="text-center py-1">{k === "auto" ? "Auto" : l.replace("Evaluación ", "E")}</th>)}</tr></thead>
                <tbody>
                  {COACHING_AREAS.map((a) => (
                    <tr key={a.k} className="border-t" style={{ borderColor: T.line }}>
                      <td className="py-1.5 font-bold" style={{ color: T.navy }}><span className="inline-block w-2 h-2 rounded-sm mr-1.5" style={{ background: a.color }} />{a.titulo.replace("Fundamentos ", "")}</td>
                      {COACHING_SLOTS.map(([k]) => { const m = co[k]?.fecha ? mediaArea(co[k].valores, a) : null; return <td key={k} className="text-center tabular-nums font-bold" style={{ color: m == null ? T.muted : colorNota(Math.round(m)) }}>{m ?? "–"}</td>; })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {entrenador.length >= 1 && <div className="mt-3" dangerouslySetInnerHTML={{ __html: coachingGraficoHTML(co) }} />}
          </Card>

          {COACHING_AREAS.map((a) => (
            <Card key={a.k} className="p-4">
              <div className="flex items-center gap-2 mb-2"><span className="w-2.5 h-6 rounded-sm" style={{ background: a.color }} /><div className="font-extrabold text-sm" style={{ color: T.navy }}>{a.titulo}</div></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: 300 }}>
                  <thead><tr className="text-[11px] font-bold uppercase" style={{ color: T.muted }}><th className="text-left py-1">Fundamento</th>{COACHING_SLOTS.map(([k, l]) => <th key={k} className="text-center w-9">{k === "auto" ? "Au" : l.replace("Evaluación ", "E")}</th>)}<th className="w-16 text-center">Evolución</th></tr></thead>
                  <tbody>
                    {a.items.map((nombre, i) => {
                      return (
                        <tr key={i} className="border-t" style={{ borderColor: T.line }}>
                          <td className="py-1.5 pr-2" style={{ color: T.text }}>{i + 1} · {nombre}</td>
                          {COACHING_SLOTS.map(([k]) => { const v = co[k]?.fecha ? co[k].valores?.[`${a.k}.${i}`] : undefined; return <td key={k} className="text-center tabular-nums font-bold" style={{ color: typeof v === "number" ? colorNota(v) : T.muted }}>{typeof v === "number" ? v : "–"}</td>; })}
                          <td className="text-center" dangerouslySetInnerHTML={{ __html: coachingSparkHTML(entrenador.map((e) => e.ev.valores?.[`${a.k}.${i}`])) }} />
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </>
      )}

      <Card className="p-4">
        <Field label="Objetivo general y observaciones del entrenador">
          <TextArea value={co.objetivoGeneral || ""} placeholder="Escribe aquí el objetivo general del jugador a partir de estas evaluaciones…" onChange={(e) => guardarCo({ objetivoGeneral: e.target.value })} />
        </Field>
        <div className="flex gap-2 mt-3 flex-wrap">
          {ctx.cap?.imprimirInformes === false ? <Btn variant="ghost" icon={Lock} disabled>Informe impreso: plan Metodólogo</Btn> : <Btn variant="ghost" icon={Printer} onClick={() => printCoachingReport(player, config)}>Imprimir informe privado</Btn>}
        </div>
      </Card>
    </div>
  );
}

function PlayerDetail({ ctx, playerId, onBack }) {
  const { players, updatePlayers, matches, trainings, config } = ctx;
  const p = players.find((x) => x.id === playerId);
  const [tab, setTab] = useState("general");
  const pestanasOk = ctx.cap?.pestanasJugador || ["general", "rendimiento", "valoracion", "tests", "coaching", "historial"];
  const bloqueada = !pestanasOk.includes(tab);
  const tabE = bloqueada ? "__bloqueada" : tab;
  const [editing, setEditing] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);
  const [manualVal, setManualVal] = useState(p?.manualRating ?? "");
  if (!p) return null;

  const sc = stateColor(p.estado);
  const ranking = rankingScore(p, config.rankingWeights);

  const playerMatches = matches.filter((m) => m.convocatoria?.some((c) => c.jugadorId === p.id))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const playerTrainings = trainings.filter((t) => t.asistencia?.some((a) => a.jugadorId === p.id))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const remove = () => {
    if (confirm(`¿Eliminar a ${p.nombre}? Esta acción no se puede deshacer.`)) {
      updatePlayers((prev) => prev.filter((x) => x.id !== p.id));
      onBack();
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-bold w-fit" style={{ color: T.muted }}><ChevronLeft size={16} />Volver a la plantilla</button>

      <Card className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            {p.foto && <img src={p.foto} alt={`Foto de ${p.nombre}`} className="w-20 h-20 rounded-2xl object-cover shrink-0" style={{ border: `1px solid ${T.line}` }} />}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shrink-0" style={{ background: T.navy }}>{p.numero}</div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{p.nombre}</h1>
              <div className="text-sm" style={{ color: T.muted }}>{p.posicion}{p.secundarias?.length ? ` · ${p.secundarias.join(", ")}` : ""}</div>
              <div className="flex gap-1.5 mt-1.5"><Pill color={sc.color} bg={sc.bg}>{p.estado}</Pill><Pill>{calcAge(p.dob)} años</Pill><Pill>{p.pie}</Pill></div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Btn variant="ghost" icon={Printer} onClick={() => printPlayerCard(p, config, ranking, playerMatches, playerTrainings)}>Imprimir ficha</Btn>
            <Btn variant="ghost" icon={Edit3} onClick={() => setEditing(true)}>Editar</Btn>
            <Btn variant="danger" icon={Trash2} onClick={remove}>Eliminar</Btn>
          </div>
        </div>
      </Card>

      <div className="flex gap-1.5 flex-wrap">
        {[["general", "General"], ["rendimiento", "Rendimiento"], ["valoracion", "Valoración"], ["tests", "Test"], ["coaching", "Coaching"], ["historial", "Historial"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3.5 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-1.5"
            style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}`, opacity: pestanasOk.includes(k) ? 1 : 0.7 }}>{l}{!pestanasOk.includes(k) && <Lock size={12} />}</button>
        ))}
      </div>

      {tabE === "__bloqueada" && (
        <Card className="p-6 text-center">
          <Lock size={22} style={{ color: T.navy, margin: "0 auto 8px" }} />
          <div className="font-extrabold" style={{ color: T.navy }}>Esta pestaña no está incluida en tu plan</div>
          <div className="text-sm mt-1" style={{ color: T.muted }}>Rendimiento, valoración, test, coaching e historial se desbloquean con el plan {ctx.cap?.desbloqueaPestanas || "Entrenador"}, junto con los partidos y los entrenamientos de los que se alimentan.</div>
        </Card>
      )}
      {tabE === "general" && (
        <div className="flex flex-col gap-3">
          {FICHA_SECCIONES.filter((sec) => sec.id !== "E").map((sec) => {
            const campos = fichaCamposConValor(p, sec, config);
            return (
              <Card key={sec.id} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold text-white" style={{ background: T.navy }}>{sec.id}</span>
                  <div className="font-extrabold text-sm" style={{ color: T.navy }}>{sec.titulo}</div>
                </div>
                {campos.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                    {campos.map(([c, v]) => (
                      <div key={c.k} className={c.full ? "col-span-2 sm:col-span-3" : ""}>
                        <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{c.label}</div>
                        <div className="font-bold text-sm whitespace-pre-wrap" style={{ color: T.navy }}>{v}</div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-sm" style={{ color: T.muted }}>Sin datos todavía. Pulsa «Editar» para completarlos.</div>}
              </Card>
            );
          })}
          <MedicaGeneral p={p} />
        </div>
      )}

      {tabE === "rendimiento" && (
        <Card className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[["Convocatorias", p.stats.convocatorias], ["Titular", p.stats.titular], ["Suplente", p.stats.suplente], ["Minutos", p.stats.minutos],
              ["Goles", p.stats.goles], ["Asistencias", p.stats.asistencias], ["Amarillas", p.stats.amarillas], ["Rojas", p.stats.rojas], ["Capitanías", p.stats.capitanias], ["MVP", p.stats.mvps]].map(([l, v]) => (
              <div key={l}><div className="text-2xl font-extrabold tabular-nums" style={{ color: T.navy }}>{v}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{l}</div></div>
            ))}
          </div>
          <div className="text-[11px] font-bold uppercase mb-2" style={{ color: T.muted }}>Evolución de la valoración en los partidos</div>
          <div dangerouslySetInnerHTML={{ __html: evolucionHTML(serieEvolucionJugador(p.id, matches)) }} />
          <div className="mt-5 pt-4 border-t" style={{ borderColor: T.line }}>
            <div className="text-[11px] font-bold uppercase mb-2" style={{ color: T.muted }}>Asistencia a entrenamientos</div>
            {p.stats.entrenamientosTotales ? (
              <>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div><div className="text-2xl font-extrabold tabular-nums" style={{ color: T.navy }}>{p.stats.entrenamientosRealizados}/{p.stats.entrenamientosTotales}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Sesiones realizadas</div></div>
                  <div><div className="text-2xl font-extrabold tabular-nums" style={{ color: T.green }}>{Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100)}%</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Asistencia</div></div>
                  <div><div className="text-2xl font-extrabold tabular-nums" style={{ color: T.redLight }}>{p.stats.entrenamientosTotales - p.stats.entrenamientosRealizados}</div><div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Ausencias</div></div>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#EEF1F5" }}><div className="h-2 rounded-full" style={{ width: `${Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100)}%`, background: T.green }} /></div>
              </>
            ) : <div className="text-sm" style={{ color: T.muted }}>Sin sesiones registradas todavía.</div>}
          </div>
        </Card>
      )}

      {tabE === "valoracion" && (
        <Card className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Valoración del entrenador (para el ranking interno)</div>
            <Pill>Ranking interno: {ranking}</Pill>
          </div>
          {[
            ["Técnica y condición física", [["tecnica", "Técnica"], ["velocidad", "Velocidad"], ["fuerza", "Fuerza"], ["elasticidad", "Elasticidad"], ["resistencia", "Resistencia"]]],
            ["Táctica y psicológica", [["actitud", "Actitud y esfuerzo en los partidos"], ["decisiones", "Toma de decisiones con balón"], ["lectura", "Lectura de juego sin balón"], ["instrucciones", "Sigue instrucciones del entrenador"], ["liderazgo", "Liderazgo en el equipo"]]],
          ].map(([grupo, items]) => (
            <div key={grupo} className="mb-4">
              <div className="text-xs font-extrabold mb-2" style={{ color: T.navy }}>{grupo}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map(([k, label]) => (
                  <Field key={k} label={label}>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="10" step="1" value={Math.max(1, p.attrs?.[k] ?? 5)} className="flex-1" aria-label={label}
                        onChange={(e) => updatePlayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, attrs: { ...(x.attrs || {}), [k]: Number(e.target.value) } } : x)))} />
                      <span className="font-bold tabular-nums w-6 text-right" style={{ color: T.navy }}>{Math.max(1, p.attrs?.[k] ?? 5)}</span>
                    </div>
                  </Field>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: T.line }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Ranking manual (anula el cálculo automático)</div>
              {!manualEdit && <button className="text-xs font-bold" style={{ color: T.red }} onClick={() => setManualEdit(true)}>Ajustar</button>}
            </div>
            {manualEdit ? (
              <div className="flex gap-2 mt-2">
                <TextInput type="number" step="0.1" value={manualVal} onChange={(e) => setManualVal(e.target.value)} className="w-28" />
                <Btn variant="accent" onClick={() => { updatePlayers((prev) => prev.map((x) => x.id === p.id ? { ...x, manualRating: manualVal === "" ? null : Number(manualVal) } : x)); setManualEdit(false); }}>Aplicar</Btn>
                <Btn variant="ghost" onClick={() => { setManualVal(""); updatePlayers((prev) => prev.map((x) => x.id === p.id ? { ...x, manualRating: null } : x)); setManualEdit(false); }}>Quitar manual</Btn>
              </div>
            ) : <div className="text-sm mt-1" style={{ color: T.text }}>{p.manualRating != null ? p.manualRating : "Automático (según fórmula configurada)"}</div>}
          </div>
        </Card>
      )}
      {tabE === "tests" && <GeneralTestsPanel ctx={ctx} player={p} />}
      {tabE === "coaching" && <CoachingPanel ctx={ctx} player={p} />}

      {tabE === "historial" && (
        <div className="flex flex-col gap-2">
          {[...playerMatches.map((m) => ({ tipo: "Partido", fecha: m.fecha, label: `vs ${m.rival} · ${m.resultadoFinal}` })),
            ...playerTrainings.map((t) => ({ tipo: "Entrenamiento", fecha: t.fecha, label: sessionDisplayName(t) }))]
            .sort((a, b) => b.fecha.localeCompare(a.fecha)).map((h, i) => (
              <Card key={i} className="p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: h.tipo === "Partido" ? T.red : T.green }} />
                <div className="text-xs font-bold w-28 shrink-0" style={{ color: T.muted }}>{h.fecha}</div>
                <div className="text-sm font-bold" style={{ color: T.navy }}>{h.tipo}</div>
                <div className="text-sm truncate" style={{ color: T.text }}>{h.label}</div>
              </Card>
            ))}
          {!playerMatches.length && !playerTrainings.length && <div className="text-sm" style={{ color: T.muted }}>Sin historial registrado todavía.</div>}
        </div>
      )}

      {editing && <PlayerForm ctx={ctx} initial={p} onClose={() => setEditing(false)} onSave={(np) => { updatePlayers((prev) => prev.map((x) => x.id === p.id ? np : x)); setEditing(false); }} />}
    </div>
  );
}

/* ---------------- Pruebas físicas (con evolución) ---------------- */

const FLEX_LABELS = { "-2": "-2 · Muy limitada", "-1": "-1 · Limitada", "0": "0 · Normal", "1": "+1 · Buena", "2": "+2 · Muy buena", "3": "+3 · Excelente" };

/* Sistema general de tests del jugador: técnico, táctico, físico o psicológico,
   con medición libre (tiempo, repeticiones, errores, etc.) y comparación por fechas. */
/* ============================================================
   TEST APLICADOS EN FÚTBOL (libro, págs. 291 a 294)
   Técnicos y físicos o condicionales, con la escala general de cuatro niveles y los rangos por edad.
   Los rangos son [inicio del nivel 2, inicio del nivel 3, inicio del nivel 4] si más es mejor,
   y [límite superior del nivel 2, límite inferior del nivel 2, límite inferior del nivel 3] si menos es mejor (tiempos).
   Las filas con errata en el libro que no se pueden deducir quedan fuera: ahí el nivel se elige a mano.
   ============================================================ */
const NIVELES_TEST = [null,
  { n: 1, nombre: "Mucho por mejorar", color: "#C62828" },
  { n: 2, nombre: "Mejorar", color: "#E67E00" },
  { n: 3, nombre: "Bueno", color: "#6AA31A" },
  { n: 4, nombre: "Excelente", color: "#1B7A44" }];
const TRAMOS_EDAD_TEST = ["8-9", "10-11", "12-13", "14-15", "16-17", "+17"];
const tramoEdadTest = (e) => (e == null || e < 8 ? null : e <= 9 ? "8-9" : e <= 11 ? "10-11" : e <= 13 ? "12-13" : e <= 15 ? "14-15" : e <= 17 ? "16-17" : "+17");
const edadEnFecha = (dob, fecha) => {
  if (!dob) return null;
  const n = new Date(dob), f = new Date(fecha || todayISO());
  if (isNaN(n) || isNaN(f)) return null;
  let e = f.getFullYear() - n.getFullYear();
  if (f.getMonth() < n.getMonth() || (f.getMonth() === n.getMonth() && f.getDate() < n.getDate())) e--;
  return e;
};
const BAREMO_DOMINADAS = { "8-9": [15, 30, 45], "10-11": [20, 35, 50], "12-13": [25, 40, 55], "14-15": [30, 45, 60], "16-17": [35, 50, 65], "+17": [40, 55, 70] };
const BAREMO_DOMINADAS_LIBRE = { "8-9": [20, 35, 50], "10-11": [25, 40, 55], "12-13": [30, 45, 60], "14-15": [35, 50, 65], "16-17": [40, 55, 70], "+17": [45, 60, 75] };
const BAREMO_PASE = { "8-9": [8, 12, 16], "10-11": [9, 13, 17], "12-13": [10, 14, 18], "14-15": [11, 15, 18], "16-17": [12, 16, 19], "+17": [12, 16, 19] };
const TESTS_LIBRO = [
  { id: "dom-izq-der", nombre: "Dominadas izq.-der.", tipo: "Técnico", espacio: "1,2 m²", unidad: "segundos", medida: "El mayor tiempo en segundos", sentido: "mas", filas: BAREMO_DOMINADAS },
  { id: "dom-interno", nombre: "Dominadas borde interno", tipo: "Técnico", espacio: "1,2 m²", unidad: "segundos", medida: "El mayor tiempo en segundos", sentido: "mas", filas: BAREMO_DOMINADAS },
  { id: "dom-externo", nombre: "Dominadas borde externo", tipo: "Técnico", espacio: "1,2 m²", unidad: "segundos", medida: "El mayor tiempo en segundos", sentido: "mas", filas: BAREMO_DOMINADAS_LIBRE },
  { id: "dom-libre", nombre: "Dominadas estilo libre", tipo: "Técnico", espacio: "1,2 m²", unidad: "segundos", medida: "El mayor tiempo en segundos", sentido: "mas", filas: BAREMO_DOMINADAS_LIBRE },
  { id: "pase", nombre: "Precisión de pase", tipo: "Técnico", espacio: "5, 10, 15 y 20 m", unidad: "aciertos de 20", medida: "Aciertos (20 intentos)", sentido: "mas", filas: BAREMO_PASE },
  { id: "recepcion", nombre: "Recepción", tipo: "Técnico", espacio: "1,2 m²", unidad: "aciertos de 20", medida: "Aciertos en 20 repeticiones", sentido: "mas", filas: BAREMO_PASE },
  { id: "conduccion", nombre: "Conducción con obstáculos", tipo: "Técnico", espacio: "20 metros", unidad: "segundos", medida: "Tiempo en segundos (y errores)", sentido: "menos", errores: true, filas: { "8-9": [14.0, 12.0, 10.0], "10-11": [13.0, 11.0, 9.5], "12-13": [12.0, 10.5, 9.0], "14-15": [11.0, 9.8, 8.5], "16-17": [10.5, 9.3, 8.0], "+17": [10.0, 8.8, 7.5] } },
  { id: "flexiones", nombre: "Fuerza de brazos (flexiones de pecho)", tipo: "Físico", espacio: "20 segundos", unidad: "repeticiones", medida: "Repeticiones", sentido: "mas", filas: { "8-9": [6, 9, 12], "10-11": [7, 10, 13], "12-13": [8, 11, 15], "14-15": [9, 13, 17], "16-17": [10, 14, 18], "+17": [11, 15, 19] } },
  { id: "abdominales", nombre: "Fuerza abdominal (abdominales)", tipo: "Físico", espacio: "20 segundos", unidad: "repeticiones", medida: "Repeticiones", sentido: "mas", filas: { "8-9": [8, 11, 14], "10-11": [9, 12, 15], "12-13": [10, 13, 16], "14-15": [11, 14, 17], "16-17": [12, 15, 18], "+17": [13, 16, 19] } },
  { id: "salto", nombre: "Salto largo", tipo: "Físico", espacio: "Sin impulso", unidad: "centímetros", medida: "Centímetros", sentido: "mas", filas: { "8-9": [100, 120, 140], "10-11": [115, 135, 155], "12-13": [130, 150, 170], "14-15": [145, 165, 185], "16-17": [160, 180, 200], "+17": [170, 190, 210] } },
  { id: "vel-explosiva", nombre: "Velocidad explosiva", tipo: "Físico", espacio: "20 metros", unidad: "segundos", medida: "Segundos", sentido: "menos", filas: { "8-9": [5.0, 4.5, 4.0], "10-11": [4.7, 4.3, 3.9], "12-13": [4.4, 4.0, 3.6], "14-15": [4.2, 3.8, 3.4], "16-17": [4.0, 3.6, 3.2], "+17": [3.9, 3.5, 3.1] } },
  { id: "vel-zigzag", nombre: "Velocidad zigzag", tipo: "Físico", espacio: "20 metros", unidad: "segundos", medida: "Segundos", sentido: "menos", filas: {}, sinTabla: true },
  { id: "zigzag-balon", nombre: "Zigzag con balón", tipo: "Físico", espacio: "20 metros", unidad: "segundos", medida: "Segundos", sentido: "menos", filas: { "8-9": [10.0, 8.5, 7.0], "10-11": [9.5, 8.0, 6.7], "12-13": [9.0, 7.5, 6.4], "14-15": [8.5, 7.0, 6.0], "16-17": [8.0, 6.6, 5.7], "+17": [7.8, 6.3, 5.4] } },
  { id: "resistencia", nombre: "Resistencia", tipo: "Físico", espacio: "1.000 metros", unidad: "min:seg", medida: "Tiempo en minutos y segundos (por ejemplo 4:35)", sentido: "menos", tiempo: true, filas: { "8-9": [420, 360, 300], "10-11": [390, 330, 280], "12-13": [360, 310, 260], "14-15": [330, 285, 240], "16-17": [315, 270, 225], "+17": [300, 260, 215] } },
  { id: "flexibilidad", nombre: "Flexibilidad", tipo: "Físico", espacio: "En grada", unidad: "centímetros", medida: "Centímetros", sentido: "mas", filas: { "8-9": [5, 10, 15], "10-11": [6, 11, 16], "12-13": [7, 12, 17], "14-15": [8, 13, 18], "16-17": [9, 14, 19], "+17": [10, 15, 20] } },
];
const testLibro = (id) => TESTS_LIBRO.find((t) => t.id === id);
const parseResultadoTest = (texto, t) => {
  const x = String(texto ?? "").trim().replace(",", ".");
  if (x === "") return null;
  if (t.tiempo && x.includes(":")) { const [m, sg] = x.split(":"); const r = Number(m) * 60 + Number(sg || 0); return isNaN(r) ? null : r; }
  const r = Number(x); return isNaN(r) ? null : r;
};
/* Devuelve { nivel, nota } o null si no se puede calcular (sin edad, fuera de rango de edad o fila con errata). */
function nivelDeTest(t, tramo, valor) {
  if (!t || !tramo || valor == null) return null;
  const f = t.filas?.[tramo]; if (!f) return null;
  const nivel = t.sentido === "mas" ? (valor >= f[2] ? 4 : valor >= f[1] ? 3 : valor >= f[0] ? 2 : 1) : (valor > f[0] ? 1 : valor >= f[1] ? 2 : valor >= f[2] ? 3 : 4);
  return { nivel, nota: (t.deducidas || []).includes(tramo) ? "El libro tiene una errata en esta fila; el rango se ha deducido de las filas vecinas." : "" };
}
const valoracionTestTexto = (t) => (t.nivel ? `Nivel ${t.nivel} · ${NIVELES_TEST[t.nivel].nombre}` : `${t.valoracion}/10`);

function GeneralTestsPanel({ ctx, player }) {
  const { updatePlayers } = ctx;
  const [showForm, setShowForm] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const tests = [...(player.tests || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));

  const saveTests = (nextTests) => updatePlayers((prev) => prev.map((x) => x.id === player.id ? { ...x, tests: nextTests } : x));
  const addTest = (t) => { saveTests([...tests, t]); setShowForm(false); };
  const editSave = (t) => { saveTests(tests.map((x) => x.id === t.id ? t : x)); setEditTest(null); };
  const removeTest = (id) => { saveTests(tests.filter((x) => x.id !== id)); setEditTest(null); };

  const grouped = {};
  tests.forEach((t) => { (grouped[t.nombre] = grouped[t.nombre] || []).push(t); });
  const tipoColor = { "Físico": T.green, "Técnico": T.red, "Táctico": T.navy, "Psicológico": T.yellow };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Eyebrow>Tests del jugador durante la temporada</Eyebrow>
        <Btn variant="accent" icon={Plus} onClick={() => setShowForm(true)}>Registrar test</Btn>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold" style={{ color: T.muted }}>{NIVELES_TEST.filter(Boolean).map((n) => <span key={n.n} className="inline-flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: n.color }} />Nivel {n.n} · {n.nombre}</span>)}</div>
      {!tests.length && <div className="text-sm" style={{ color: T.muted }}>Todavía no hay tests registrados a este jugador.</div>}
      {Object.entries(grouped).map(([nombre, arr]) => {
        const sorted = [...arr].sort((a, b) => a.fecha.localeCompare(b.fecha));
        const last = sorted[sorted.length - 1];
        const first = sorted[0];
        const porNivel = !!last.nivel && !!first.nivel;
        const diff = sorted.length > 1 && porNivel ? last.nivel - first.nivel : (sorted.length > 1 && !isNaN(Number(last.valoracion)) && !isNaN(Number(first.valoracion)) && last.valoracion != null && first.valoracion != null ? +(Number(last.valoracion) - Number(first.valoracion)).toFixed(1) : null);
        return (
          <Card key={nombre} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-extrabold" style={{ color: T.navy }}>{nombre}</div>
                <Pill color={tipoColor[last.tipo] || T.navy}>{last.tipo}</Pill>
              </div>
              {diff != null && (
                <span className="text-sm font-bold flex items-center gap-1" style={{ color: diff > 0 ? T.green : diff < 0 ? T.redLight : T.muted }}>
                  {diff > 0 ? <TrendingUp size={14} /> : diff < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                  {diff > 0 ? "+" : ""}{diff} {porNivel ? (Math.abs(diff) === 1 ? "nivel" : "niveles") : "pts"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {sorted.map((t) => (
                <div key={t.id} onClick={() => setEditTest(t)} className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:shadow-sm transition" style={{ background: "#F7F8FA" }}>
                  <div className="text-xs" style={{ color: T.text }}>
                    <span className="font-bold" style={{ color: T.navy }}>{t.fecha}</span> · {t.medicion || "-"} {t.espacio ? `· ${t.espacio}` : ""}
                  </div>
                  {t.nivel ? <span className="text-xs font-extrabold px-2 py-1 rounded-full text-white whitespace-nowrap" style={{ background: NIVELES_TEST[t.nivel].color }}>Nivel {t.nivel} · {NIVELES_TEST[t.nivel].nombre}</span> : <div className="text-sm font-extrabold tabular-nums" style={{ color: T.red }}>{t.valoracion}/10</div>}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
      {showForm && <GeneralTestForm player={player} onClose={() => setShowForm(false)} onSave={addTest} onDelete={null} />}
      {editTest && <GeneralTestForm initial={editTest} player={player} onClose={() => setEditTest(null)} onSave={editSave} onDelete={() => removeTest(editTest.id)} />}
    </div>
  );
}

function GeneralTestForm({ initial, player, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initial || { id: uid(), nombre: "", tipo: "Físico", espacio: "", medicion: "", valoracion: 5, fecha: todayISO() });
  const [error, setError] = useState("");
  const set = (k, v) => { setError(""); setF((p) => ({ ...p, [k]: v })); };
  const libro = f.libro ? testLibro(f.libro) : null;
  const edad = edadEnFecha(player?.dob, f.fecha);
  const tramo = tramoEdadTest(edad);
  const valor = libro ? parseResultadoTest(f.resultado, libro) : null;
  const filaRevisar = !!libro && (libro.revisar || []).includes(tramo);
  const auto = libro && !filaRevisar && valor != null ? nivelDeTest(libro, tramo, valor) : null;
  const nivelFinal = f.nivelManual || auto?.nivel || null;
  const elegir = (id) => {
    setError("");
    if (!id) { setF((p) => ({ ...p, libro: undefined, resultado: undefined, nivel: undefined, nivelManual: undefined, valoracion: p.valoracion ?? 5 })); return; }
    const t = testLibro(id);
    setF((p) => ({ ...p, libro: id, nombre: t.nombre, tipo: t.tipo, espacio: t.espacio, resultado: p.resultado ?? "", nivelManual: undefined }));
  };
  const guardar = () => {
    if (libro) {
      if (f.resultado == null || String(f.resultado).trim() === "") { setError("Escribe el resultado del test."); return; }
      if (!nivelFinal) { setError("Elige el nivel a mano: el libro no tiene rango automático para este caso."); return; }
      const nErr = libro.errores && String(f.errores ?? "").trim() !== "" ? Number(f.errores) : null;
      onSave({ ...f, medicion: `${String(f.resultado).trim()} ${libro.unidad}${nErr != null ? ` · ${nErr} ${nErr === 1 ? "error" : "errores"}` : ""}`, nivel: nivelFinal, valoracion: null });
    } else onSave({ ...f, nivel: undefined, nivelManual: undefined });
  };
  let aviso = "";
  if (libro) {
    if (libro.sinTabla) aviso = "El libro no trae tabla de rangos para este test: elige el nivel a mano.";
    else if (edad == null) aviso = "Falta la fecha de nacimiento del jugador: elige el nivel a mano.";
    else if (!tramo) aviso = `El jugador tiene ${edad} años y el libro empieza a los 8: elige el nivel a mano.`;
    else if (filaRevisar) aviso = "El libro tiene un rango por revisar para esta edad: elige el nivel a mano.";
    else if (valor == null && String(f.resultado || "").trim() !== "") aviso = "No se entiende el resultado. Escribe solo el número (para la resistencia, minutos y segundos, por ejemplo 4:35).";
  }
  return (
    <Modal title={initial ? "Editar test" : "Registrar test"} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Test del libro (opcional)" className="sm:col-span-2">
          <Select value={f.libro || ""} onChange={(e) => elegir(e.target.value)}>
            <option value="">Otro test (lo escribo yo)</option>
            <optgroup label="Técnicos">{TESTS_LIBRO.filter((t) => t.tipo === "Técnico").map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}</optgroup>
            <optgroup label="Físicos o condicionales">{TESTS_LIBRO.filter((t) => t.tipo === "Físico").map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}</optgroup>
          </Select>
        </Field>
        <Field label="Nombre del test" className="sm:col-span-2"><TextInput value={f.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej: Dominadas en 1m²" /></Field>
        <Field label="Tipo de test">
          <Select value={f.tipo} onChange={(e) => set("tipo", e.target.value)}>
            <option>Físico</option><option>Técnico</option><option>Táctico</option><option>Psicológico</option>
          </Select>
        </Field>
        <Field label="Fecha realizada"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
        <Field label="Espacio o tiempo"><TextInput value={f.espacio} onChange={(e) => set("espacio", e.target.value)} placeholder="Ej: 1m² / 20m lineales" /></Field>
        {libro ? (
          <>
            <Field label={`Resultado (${libro.unidad})`}><TextInput value={f.resultado ?? ""} inputMode={libro.tiempo ? "text" : "decimal"} onChange={(e) => set("resultado", e.target.value)} placeholder={libro.tiempo ? "4:35" : "0"} /></Field>
            {libro.errores && <Field label="Errores (opcional)"><TextInput type="number" value={f.errores ?? ""} onChange={(e) => set("errores", e.target.value)} placeholder="0" /></Field>}
            <div className="sm:col-span-2 rounded-xl border p-3 flex flex-col gap-2" style={{ borderColor: T.line }}>
              <div className="text-[11px]" style={{ color: T.muted }}>Parámetro de medición: {libro.medida}. {tramo ? `Edad en la fecha del test: ${edad} años (tramo ${tramo}).` : ""} Las tablas del libro son las mismas para jugadores y jugadoras.{libro.errores ? " Los errores se anotan, pero no cambian el nivel." : ""}</div>
              {auto && !f.nivelManual && <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-extrabold px-2.5 py-1 rounded-full text-white" style={{ background: NIVELES_TEST[auto.nivel].color }}>Nivel {auto.nivel} · {NIVELES_TEST[auto.nivel].nombre}</span><span className="text-[11px]" style={{ color: T.muted }}>calculado con la tabla del libro</span></div>}
              {auto?.nota && !f.nivelManual && <div className="text-[11px] font-bold" style={{ color: T.muted }}>{auto.nota}</div>}
              {aviso && <div className="text-xs font-bold" style={{ color: T.redLight }}>{aviso}</div>}
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-[11px] font-bold" style={{ color: T.muted }}>Elegir a mano:</span>
                {NIVELES_TEST.filter(Boolean).map((n) => (
                  <button type="button" key={n.n} onClick={() => set("nivelManual", f.nivelManual === n.n ? undefined : n.n)} className="px-2 py-1 rounded-full text-[11px] font-extrabold border"
                    style={{ background: f.nivelManual === n.n ? n.color : "#fff", color: f.nivelManual === n.n ? "#fff" : n.color, borderColor: n.color }}>{n.n} · {n.nombre}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <Field label="Duración / medición"><TextInput value={f.medicion} onChange={(e) => set("medicion", e.target.value)} placeholder="Ej: 45 segundos / 12 repeticiones / 2 errores" /></Field>
            <Field label="Valoración del entrenador (1-10)" className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={f.valoracion ?? 5} onChange={(e) => set("valoracion", Number(e.target.value))} className="flex-1" />
                <span className="text-sm font-extrabold w-8 text-right" style={{ color: T.navy }}>{f.valoracion ?? 5}</span>
              </div>
            </Field>
          </>
        )}
      </div>
      {error && <div className="text-sm font-bold mt-3" style={{ color: T.redLight }}>{error}</div>}
      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="accent" icon={Save} onClick={guardar}>Guardar</Btn></div>
      </div>
    </Modal>
  );
}

function PhysicalTestsPanel({ ctx, player }) {
  const { updatePlayers } = ctx;
  const [showForm, setShowForm] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const tests = [...(player.pruebasFisicas || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const last = tests[tests.length - 1];
  const first = tests[0];

  const saveTests = (nextTests) => updatePlayers((prev) => prev.map((x) => x.id === player.id ? { ...x, pruebasFisicas: nextTests } : x));
  const addTest = (t) => { saveTests([...tests, t]); setShowForm(false); };
  const editSave = (t) => { saveTests(tests.map((x) => x.id === t.id ? t : x)); setEditTest(null); };
  const removeTest = (id) => { if (confirm("¿Eliminar este test?")) saveTests(tests.filter((x) => x.id !== id)); setEditTest(null); };

  const metrics = [
    ["velocidad20m", "Velocidad 20m recta (s)", true],
    ["velocidadZigzag20m", "Velocidad 20m zigzag (s)", true],
    ["controlBalon", "Control de balón (seg. sin caída)", false],
    ["vo2max", "VO₂ máx. estimado (ml/kg/min)", false],
    ["abdominalesMin", "Abdominales / min", false],
    ["flexionesMin", "Flexiones de pecho / min", false],
    ["golpeoDistancia", "Golpeo / chut (metros)", false],
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <Eyebrow>Pruebas físicas — punto de partida y evolución</Eyebrow>
          <Btn variant="accent" icon={Plus} onClick={() => setShowForm(true)}>Registrar test</Btn>
        </div>
        <div className="text-xs mb-4" style={{ color: T.muted }}>Herramienta de seguimiento deportivo. No sustituye una valoración médica.</div>

        {!tests.length ? (
          <div className="text-sm" style={{ color: T.muted }}>Todavía no hay tests registrados. Registra el primero como punto de partida del jugador.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metrics.map(([key, label, lowerIsBetter]) => {
              const lastVal = last?.[key];
              const firstVal = first?.[key];
              let diff = null;
              if (lastVal != null && firstVal != null && tests.length > 1) {
                diff = +(lastVal - firstVal).toFixed(2);
              }
              const improved = diff != null && (lowerIsBetter ? diff < 0 : diff > 0);
              const worsened = diff != null && (lowerIsBetter ? diff > 0 : diff < 0);
              return (
                <div key={key} className="p-3 rounded-xl" style={{ background: "#F7F8FA" }}>
                  <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{label}</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-extrabold tabular-nums" style={{ color: T.navy }}>{lastVal ?? "-"}</span>
                    {diff != null && (
                      <span className="text-xs font-bold flex items-center gap-0.5" style={{ color: improved ? T.green : worsened ? T.redLight : T.muted }}>
                        {improved ? <TrendingUp size={12} /> : worsened ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {diff > 0 ? "+" : ""}{diff}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="p-3 rounded-xl sm:col-span-2" style={{ background: "#F7F8FA" }}>
              <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>Flexibilidad</div>
              <div className="text-xl font-extrabold" style={{ color: T.navy }}>{last?.flexibilidad != null ? FLEX_LABELS[String(last.flexibilidad)] : "-"}</div>
            </div>
          </div>
        )}
      </Card>

      {tests.length > 0 && (
        <Card className="p-5">
          <Eyebrow>Historial de tests</Eyebrow>
          <div className="flex flex-col gap-2 mt-3">
            {[...tests].reverse().map((t) => (
              <div key={t.id} onClick={() => setEditTest(t)} className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:shadow-sm transition" style={{ background: "#F7F8FA" }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: T.navy }}>{t.fecha}</div>
                  <div className="text-xs" style={{ color: T.muted }}>{t.observaciones || "Sin observaciones"}</div>
                </div>
                <ChevronRight size={16} style={{ color: T.muted }} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {showForm && <PhysicalTestForm onClose={() => setShowForm(false)} onSave={addTest} onDelete={null} />}
      {editTest && <PhysicalTestForm initial={editTest} onClose={() => setEditTest(null)} onSave={editSave} onDelete={() => removeTest(editTest.id)} />}
    </div>
  );
}

function PhysicalTestForm({ initial, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initial || {
    id: uid(), fecha: todayISO(), velocidad20m: "", velocidadZigzag20m: "", controlBalon: "",
    vo2max: "", abdominalesMin: "", flexionesMin: "", golpeoDistancia: "", flexibilidad: 0, observaciones: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => onSave({
    ...f,
    velocidad20m: f.velocidad20m === "" ? null : Number(f.velocidad20m),
    velocidadZigzag20m: f.velocidadZigzag20m === "" ? null : Number(f.velocidadZigzag20m),
    controlBalon: f.controlBalon === "" ? null : Number(f.controlBalon),
    vo2max: f.vo2max === "" ? null : Number(f.vo2max),
    abdominalesMin: f.abdominalesMin === "" ? null : Number(f.abdominalesMin),
    flexionesMin: f.flexionesMin === "" ? null : Number(f.flexionesMin),
    golpeoDistancia: f.golpeoDistancia === "" ? null : Number(f.golpeoDistancia),
    flexibilidad: Number(f.flexibilidad),
  });

  return (
    <Modal title={initial ? "Editar test físico" : "Nuevo test físico"} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Fecha del test"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
        <Field label="Flexibilidad">
          <Select value={f.flexibilidad} onChange={(e) => set("flexibilidad", e.target.value)}>
            {Object.entries(FLEX_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        </Field>
        <Field label="Velocidad 20m línea recta (segundos)"><TextInput type="number" step="0.01" value={f.velocidad20m} onChange={(e) => set("velocidad20m", e.target.value)} /></Field>
        <Field label="Velocidad 20m zigzag (segundos)"><TextInput type="number" step="0.01" value={f.velocidadZigzag20m} onChange={(e) => set("velocidadZigzag20m", e.target.value)} /></Field>
        <Field label="Control de balón (segundos sin que caiga)"><TextInput type="number" value={f.controlBalon} onChange={(e) => set("controlBalon", e.target.value)} /></Field>
        <Field label="VO₂ máx. estimado (ml/kg/min)"><TextInput type="number" value={f.vo2max} onChange={(e) => set("vo2max", e.target.value)} /></Field>
        <Field label="Abdominales en 1 minuto"><TextInput type="number" value={f.abdominalesMin} onChange={(e) => set("abdominalesMin", e.target.value)} /></Field>
        <Field label="Flexiones de pecho en 1 minuto"><TextInput type="number" value={f.flexionesMin} onChange={(e) => set("flexionesMin", e.target.value)} /></Field>
        <Field label="Golpeo / chut (metros de alcance)"><TextInput type="number" step="0.1" value={f.golpeoDistancia} onChange={(e) => set("golpeoDistancia", e.target.value)} /></Field>
        <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>
      </div>
      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="accent" icon={Save} onClick={submit}>Guardar test</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   PARTIDOS
   ============================================================ */

function printMatch(m, config, players) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const playerName = (id) => { const p = players.find((x) => x.id === id); return p ? (p.apodo || p.nombre) : "?"; };
  const { resultado: resTag1 } = resultadoPropio(m);
  const resColor = resTag1 === "V" ? "#2A9D5C" : resTag1 === "E" ? "#F4B400" : "#FF6B6B";
  const convocados = (m.convocatoria || []).filter((c) => c.estado !== "No convocado");
  const titularIds = new Set((m.alineacion || []).filter((s) => s.jugadorId).map((s) => s.jugadorId));
  const titulares = convocados.filter((c) => c.estado === "Convocado" && titularIds.has(c.jugadorId));
  const banquillo = convocados.filter((c) => c.estado === "Convocado" && !titularIds.has(c.jugadorId));
  const kv = (label, value) => `<div class="kv"><span class="kvLabel">${esc(label)}</span><span class="kvValue">${esc(value) || "—"}</span></div>`;
  const list = (title, color, arr, render) => arr?.length ? `<div class="section"><div class="sectionTitle" style="background:${color};">${esc(title)}</div>${arr.map(render).join("")}</div>` : "";
  const line = (text) => `<div class="lineItem">${text}</div>`;

  const barChart = (label, value) => `
    <div class="barRow">
      <span class="barLabel">${esc(label)}</span>
      <div class="barTrack"><div class="barFill" style="width:${(value || 0) * 10}%;"></div></div>
      <span class="barVal">${value ?? "-"}</span>
    </div>`;

  let pitchHtml = "";
  if (m.alineacion?.some((s) => s.jugadorId)) {
    const dots = m.alineacion.filter((s) => s.jugadorId).map((s) => {
      const p = players.find((pl) => pl.id === s.jugadorId);
      if (!p) return "";
      return `<div class="dot" style="left:${s.x}%; top:${s.y}%;"><div class="dotCircle">${esc(p.numero)}</div><div class="dotName">${esc(p.apodo || p.nombre?.split(" ")[0])}</div></div>`;
    }).join("");
    pitchHtml = `<div class="pitch"><div class="pitchCircle"></div><div class="pitchAreaTop"></div><div class="pitchAreaBottom"></div><div class="pitchGoalTop"></div><div class="pitchGoalBottom"></div>${dots}</div>`;
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>vs ${esc(m.rival)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 16px 22px 20px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .header { display: flex; align-items: center; gap: 10px; border-bottom: 3px solid #0B1F3A; padding-bottom: 10px; margin-bottom: 12px; }
    .header img { width: 42px; height: 42px; object-fit: contain; border-radius: 10px; }
    .headerInfo { flex: 1; }
    .teamName { font-size: 14px; font-weight: 800; color: #0B1F3A; }
    .teamMeta { font-size: 9.5px; color: #64748B; margin-top: 1px; }
    .matchTitle { text-align: center; margin-bottom: 12px; }
    .matchTitle .vs { font-size: 18px; font-weight: 900; color: #0B1F3A; }
    .matchTitle .meta { font-size: 10px; color: #64748B; margin-top: 2px; }
    .score { text-align: center; font-size: 30px; font-weight: 900; color: #fff; background: ${resColor}; display: inline-block; padding: 4px 22px; border-radius: 12px; margin-top: 6px; }
    .scoreWrap { text-align: center; margin-bottom: 14px; }
    .scoreHalf { font-size: 10px; color: #64748B; margin-top: 4px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 16px; }
    .kv { display: flex; flex-direction: column; }
    .kvLabel { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94A3B8; }
    .kvValue { font-size: 11px; color: #1B2733; font-weight: 600; }
    .section { margin-top: 12px; }
    .sectionTitle { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fff; padding: 3px 10px; border-radius: 999px; display: inline-block; margin-bottom: 6px; letter-spacing: 0.3px; }
    .lineItem { font-size: 10px; color: #334155; background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 3px 8px; margin-bottom: 3px; }
    .pill { display: inline-block; font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: #F5F7FA; border: 1px solid #E2E8F0; margin: 0 3px 3px 0; }
    .twoCol { display: grid; grid-template-columns: 1fr 220px; gap: 18px; align-items: start; }
    .pitch { position: relative; width: 100%; max-width: 340px; margin: 0 auto; aspect-ratio: 2/3; background: linear-gradient(#2A9D5C, #22874C); border-radius: 10px; border: 2px solid #1F7A44; }
    .pitch::before, .pitch::after { content: ""; position: absolute; border-color: rgba(255,255,255,0.55); border-style: solid; }
    .pitch::before { left: 8px; right: 8px; top: 8px; bottom: 8px; border-width: 2px; border-radius: 6px; }
    .pitch::after { left: 8px; right: 8px; top: 50%; border-width: 2px 0 0 0; }
    .pitchCircle { position:absolute; left:50%; top:50%; width:70px; height:70px; margin-left:-35px; margin-top:-35px; border:2px solid rgba(255,255,255,0.55); border-radius:50%; }
    .pitchAreaTop, .pitchAreaBottom { position:absolute; left:50%; width:140px; height:56px; margin-left:-70px; border:2px solid rgba(255,255,255,0.55); }
    .pitchAreaTop { top:8px; border-top:none; }
    .pitchAreaBottom { bottom:8px; border-bottom:none; }
    .pitchGoalTop, .pitchGoalBottom { position:absolute; left:50%; width:70px; height:26px; margin-left:-35px; border:2px solid rgba(255,255,255,0.55); }
    .pitchGoalTop { top:8px; border-top:none; }
    .pitchGoalBottom { bottom:8px; border-bottom:none; }
    .dot { position: absolute; transform: translate(-50%,-50%); text-align: center; }
    .dotCircle { width: 22px; height: 22px; border-radius: 999px; background: #0B1F3A; color: #fff; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 1.5px solid #fff; margin: 0 auto; }
    .dotName { font-size: 7px; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.6); margin-top: 1px; white-space: nowrap; }
    .barRow { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .barLabel { font-size: 9px; color: #64748B; width: 90px; flex-shrink: 0; }
    .barTrack { flex: 1; height: 6px; border-radius: 999px; background: #F1F5F9; overflow: hidden; }
    .barFill { height: 100%; background: #0B1F3A; }
    .barVal { font-size: 9.5px; font-weight: 800; color: #0B1F3A; width: 16px; text-align: right; }
    .footer { margin-top: 14px; text-align: center; font-size: 8.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 8px; }
    @media print {
      html, body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
      body { padding: 0; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div class="sheet">
      <div class="header">
        ${config.logo ? `<img src="${config.logo}" />` : ""}
        <div class="headerInfo">
          <div class="teamName">${esc(config.teamName || "Equipo")}</div>
          <div class="teamMeta">${esc(config.category || "")}${config.category && config.season ? " · " : ""}${esc(config.season || "")}</div>
        </div>
      </div>

      <div class="matchTitle">
        <div class="vs">${m.esLocal ? `${esc(config.teamName)} vs ${esc(m.rival)}` : `${esc(m.rival)} vs ${esc(config.teamName)}`}</div>
        <div class="meta">${esc(m.fecha)} · Jornada ${esc(m.jornada)} · ${esc(m.competicion)} · ${esc(m.campo)}</div>
      </div>
      <div class="scoreWrap">
        <div class="score">${esc(m.resultadoFinal)}</div>
        <div class="scoreHalf">Descanso: ${esc(m.resultadoDescanso) || "-"}</div>
      </div>

      <div class="grid3" style="margin-bottom:10px;">
        ${kv("Tipo de fútbol", m.tipoFutbol)}
        ${kv("Sistema", m.sistema)}
        ${kv("Condición", m.esLocal ? "Local" : "Visitante")}
      </div>

      <div class="grid3" style="margin-bottom:2px;">
        ${kv("Camiseta", m.vestimenta?.camiseta)}
        ${kv("Pantaloneta", m.vestimenta?.pantaloneta)}
        ${kv("Medias", m.vestimenta?.medias)}
      </div>

      <div class="twoCol">
        <div>
          <div class="section">
            <div class="sectionTitle" style="background:#0B1F3A;">Titulares (${titulares.length})</div>
            <div>${titulares.map((c) => `<span class="pill">${esc(playerName(c.jugadorId))}${m.capitanId === c.jugadorId ? " (C)" : ""}</span>`).join("") || "—"}</div>
          </div>
          <div class="section">
            <div class="sectionTitle" style="background:#64748B;">Banquillo (${banquillo.length})</div>
            <div>${banquillo.map((c) => `<span class="pill">${esc(playerName(c.jugadorId))}${m.capitanId === c.jugadorId ? " (C)" : ""}</span>`).join("") || "—"}</div>
          </div>

          ${list("Goles", "#2A9D5C", m.goles, (g) => line(`Min. ${esc(g.minuto)}: ${esc(playerName(g.jugadorId))}${g.asistenciaId ? ` (asist. ${esc(playerName(g.asistenciaId))})` : ""}`))}
          ${list("Cambios", "#F4B400", m.cambios, (c) => line(`Min. ${esc(c.minuto)}: sale ${esc(playerName(c.saleId))}, entra ${esc(playerName(c.entraId))}`))}
          ${list("Tarjetas / incidencias", "#E63946", m.tarjetas, (t) => line(`Min. ${esc(t.minuto)}: ${esc(playerName(t.jugadorId))} — ${esc(t.tipo)}`))}
        </div>
        ${pitchHtml ? `<div><div class="sectionTitle" style="background:#2A9D5C;">Alineación</div>${pitchHtml}</div>` : ""}
      </div>

      <div class="section">
        <div class="sectionTitle" style="background:#E63946;">Aspectos tácticos</div>
        <div class="grid2">
          ${kv("Modelo de juego", m.tactica?.modelo)}
          ${kv("Ajustes durante el partido", m.tactica?.ajustes)}
          ${kv("Qué funcionó", m.tactica?.funciono)}
          ${kv("Qué no funcionó", m.tactica?.noFunciono)}
        </div>
      </div>

      <div class="section">
        <div class="sectionTitle" style="background:#0B1F3A;">Rendimiento por fases</div>
        ${barChart("Ataque", m.rendimiento?.ataque)}
        ${barChart("Defensa", m.rendimiento?.defensa)}
        ${barChart("Transición ofensiva", m.rendimiento?.transicionOfensiva)}
        ${barChart("Transición defensiva", m.rendimiento?.transicionDefensiva)}
        ${barChart("Balón parado ofensivo", m.rendimiento?.balonParadoOfensivo)}
        ${barChart("Balón parado defensivo", m.rendimiento?.balonParadoDefensivo)}
        <div class="grid2" style="margin-top:6px;">
          ${kv("Fortalezas", m.rendimiento?.fortalezas)}
          ${kv("Debilidades", m.rendimiento?.debilidades)}
        </div>
      </div>

      <div class="section">
        <div class="sectionTitle" style="background:#2A9D5C;">Aprendizajes</div>
        <div class="grid3">
          ${kv("Mantener", m.aprendizajes?.mantener)}
          ${kv("Corregir", m.aprendizajes?.corregir)}
          ${kv("Trabajar", m.aprendizajes?.trabajar)}
        </div>
      </div>

      ${m.observaciones ? `<div class="section"><div class="sectionTitle" style="background:#64748B;">Observaciones del entrenador</div><div class="lineItem">${esc(m.observaciones)}</div></div>` : ""}

      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

function Partidos({ ctx }) {
  const { matches, updateMatches, players, config } = ctx;
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  useEffect(() => {
    if (ctx.deepLink?.type === "partido") { setOpenId(ctx.deepLink.id); ctx.clearDeepLink(); }
  }, [ctx.deepLink]);
  const sorted = [...matches].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const viewing = matches.find((m) => m.id === openId);
  const editing = matches.find((m) => m.id === editId);

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Eyebrow>Partidos</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{matches.length} partidos registrados</h1></div>
        <Btn icon={Plus} variant="accent" onClick={() => setShowNew(true)}>Nuevo partido</Btn>
      </div>

      <div className="flex flex-col gap-2.5">
        {sorted.map((m) => {
          const { resultado: resTag2 } = resultadoPropio(m);
          const res = resTag2 === "P" ? T.muted : resTag2 === "V" ? T.green : resTag2 === "E" ? T.yellow : T.redLight;
          return (
            <Card key={m.id} className="p-4 cursor-pointer hover:shadow-md transition relative" onClick={() => setOpenId(m.id)}>
              <div className="absolute top-3 right-3 flex gap-1 z-10">
                <button onClick={(e) => { e.stopPropagation(); printMatch(m, config, players); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Imprimir / PDF">
                  <Printer size={14} style={{ color: T.muted }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditId(m.id); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                  <Edit3 size={14} style={{ color: T.muted }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); if (confirm("¿Eliminar este partido?")) updateMatches((prev) => prev.filter((x) => x.id !== m.id)); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                  <Trash2 size={14} style={{ color: T.redLight }} />
                </button>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2 pr-24">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 rounded-full" style={{ background: res }} />
                  <div>
                    <div className="font-extrabold" style={{ color: T.navy }}>{m.esLocal ? `${config.teamName} vs ${m.rival}` : `${m.rival} vs ${config.teamName}`}</div>
                    <div className="text-xs" style={{ color: T.muted }}>{m.fecha} · J{m.jornada} · {m.competicion} · {m.campo}</div>
                  </div>
                  {(() => {
                    const vals = Object.values(m.valoracionesJugadores || {});
                    if (!vals.length) return null;
                    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
                    return <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ color: T.navy, background: "#E7ECF5" }}>⭐ {avg} rendimiento</span>;
                  })()}
                </div>
                <div className="text-xl font-black tabular-nums" style={{ color: T.navy }}>{m.cerrado ? m.resultadoFinal : <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>Sin cerrar</span>}</div>
              </div>
            </Card>
          );
        })}
        {!sorted.length && <div className="text-sm" style={{ color: T.muted }}>Todavía no hay partidos registrados.</div>}
      </div>

      {viewing && (
        <MatchDetailView match={viewing} players={players} config={config}
          onClose={() => setOpenId(null)}
          onEdit={() => { setEditId(viewing.id); setOpenId(null); }}
          onDelete={() => { if (confirm("¿Eliminar este partido?")) { updateMatches((prev) => prev.filter((x) => x.id !== viewing.id)); setOpenId(null); } }} />
      )}

      {showNew && <MatchForm ctx={ctx} onClose={() => setShowNew(false)} onSave={(m) => { updateMatches((prev) => [...prev, m]); setShowNew(false); }} />}
      {editing && <MatchForm ctx={ctx} initial={editing}
        onClose={() => setEditId(null)}
        onSave={(m) => { updateMatches((prev) => prev.map((x) => x.id === m.id ? m : x)); setEditId(null); }}
        onDelete={() => { if (confirm("¿Eliminar este partido?")) { updateMatches((prev) => prev.filter((x) => x.id !== editing.id)); setEditId(null); } }} />}
    </div>
  );
}

function MatchDetailView({ match: m, players, config, onClose, onEdit, onDelete }) {
  const [showConvocatoriaCard, setShowConvocatoriaCard] = useState(false);
  const playerName = (id) => players.find((p) => p.id === id)?.apodo || players.find((p) => p.id === id)?.nombre || "-";
  const convocados = (m.convocatoria || []).filter((c) => c.estado !== "No convocado");
  const { resultado: resTag3 } = resultadoPropio(m);
  const resColor = resTag3 === "P" ? T.muted : resTag3 === "V" ? T.green : resTag3 === "E" ? T.yellow : T.redLight;

  const Section = ({ title, children }) => (
    <div className="pt-4 border-t first:pt-0 first:border-0" style={{ borderColor: T.line }}>
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-2">{children}</div>
    </div>
  );
  const KV = ({ label, value }) => (
    <div className="flex flex-col"><span className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{label}</span><span className="text-sm" style={{ color: T.text }}>{value || "-"}</span></div>
  );

  return (
    <Modal title={`vs ${m.rival}`} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xl font-extrabold" style={{ color: T.navy }}>{m.esLocal ? `${config.teamName} vs ${m.rival}` : `${m.rival} vs ${config.teamName}`}</div>
            <div className="text-xs mt-0.5" style={{ color: T.muted }}>{m.fecha} · Jornada {m.jornada} · {m.competicion} · {m.campo}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs" style={{ color: T.muted }}>Descanso: {m.resultadoDescanso || "-"}</div>
            <div className="text-2xl font-black tabular-nums px-3 py-1 rounded-xl" style={{ color: "#fff", background: resColor }}>{m.resultadoFinal}</div>
          </div>
        </div>

        <Section title="Datos del partido">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KV label="Tipo de fútbol" value={m.tipoFutbol} />
            <KV label="Sistema" value={m.sistema} />
            <KV label="Condición" value={m.esLocal ? "Local" : "Visitante"} />
          </div>
        </Section>

        <Section title={`Convocatoria (${convocados.length})`}>
          <div className="mb-2">
            <Btn variant="ghost" icon={Printer} onClick={() => setShowConvocatoriaCard(true)}>Generar convocatoria para compartir</Btn>
          </div>
          {convocados.length ? (
            <div className="flex flex-wrap gap-1.5">
              {convocados.map((c) => (
                <Pill key={c.jugadorId} color={c.estado === "Titular" ? T.navy : T.muted} bg={c.estado === "Titular" ? "#EEF2F8" : "#F3F4F6"}>
                  {playerName(c.jugadorId)} · {c.estado}
                </Pill>
              ))}
            </div>
          ) : <div className="text-sm" style={{ color: T.muted }}>Sin convocatoria registrada.</div>}
        </Section>

        {m.alineacion?.some((s) => s.jugadorId) && (
          <Section title="Alineación">
            <div className="max-w-[220px]">
              <PitchEditor system={m.sistema} players={players} lineup={m.alineacion} onChange={() => {}} readOnly />
            </div>
          </Section>
        )}

        <Section title="Cambios, goles y tarjetas">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: T.navy }}>Cambios</div>
              {m.cambios?.length ? m.cambios.map((c) => (
                <div key={c.id} className="text-sm" style={{ color: T.text }}>Min. {c.minuto}: sale {playerName(c.saleId)}, entra {playerName(c.entraId)}</div>
              )) : <div className="text-xs" style={{ color: T.muted }}>Sin cambios registrados.</div>}
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: T.navy }}>Goles</div>
              {m.goles?.length ? m.goles.map((g) => (
                <div key={g.id} className="text-sm" style={{ color: T.text }}>Min. {g.minuto}: {playerName(g.jugadorId)}{g.asistenciaId ? ` (asist. ${playerName(g.asistenciaId)})` : ""}</div>
              )) : <div className="text-xs" style={{ color: T.muted }}>Sin goles registrados.</div>}
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: T.navy }}>Tarjetas / incidencias</div>
              {m.tarjetas?.length ? m.tarjetas.map((t) => (
                <div key={t.id} className="text-sm" style={{ color: T.text }}>Min. {t.minuto}: {playerName(t.jugadorId)} — {t.tipo}</div>
              )) : <div className="text-xs" style={{ color: T.muted }}>Sin tarjetas registradas.</div>}
            </div>
          </div>
        </Section>

        <Section title="Aspectos tácticos">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <KV label="Modelo de juego" value={m.tactica?.modelo} />
            <KV label="Ajustes durante el partido" value={m.tactica?.ajustes} />
            <KV label="Qué funcionó" value={m.tactica?.funciono} />
            <KV label="Qué no funcionó" value={m.tactica?.noFunciono} />
          </div>
        </Section>

        <Section title="Rendimiento por fases">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {[["ataque", "Ataque"], ["defensa", "Defensa"], ["transicionOfensiva", "Transición ofensiva"], ["transicionDefensiva", "Transición defensiva"], ["balonParadoOfensivo", "Balón parado ofensivo"], ["balonParadoDefensivo", "Balón parado defensivo"]].map(([k, l]) => (
              <div key={k}>
                <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>{l}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${(m.rendimiento?.[k] || 0) * 10}%`, background: T.navy3 }} /></div>
                  <span className="text-xs font-bold" style={{ color: T.navy }}>{m.rendimiento?.[k] ?? "-"}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <KV label="Fortalezas" value={m.rendimiento?.fortalezas} />
            <KV label="Debilidades" value={m.rendimiento?.debilidades} />
          </div>
        </Section>

        <Section title="Aprendizajes">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <KV label="Mantener" value={m.aprendizajes?.mantener} />
            <KV label="Corregir" value={m.aprendizajes?.corregir} />
            <KV label="Trabajar" value={m.aprendizajes?.trabajar} />
          </div>
        </Section>

        <Section title="Observaciones del entrenador">
          <div className="text-sm whitespace-pre-wrap" style={{ color: T.text }}>{m.observaciones || "Sin observaciones."}</div>
          {m.videoUrl && (
            <a href={m.videoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold" style={{ color: T.red }}>
              <Eye size={15} /> Ver video del partido
            </a>
          )}
        </Section>
      </div>

      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose}>Cerrar</Btn>
          <Btn variant="accent" icon={Edit3} onClick={onEdit}>Editar partido</Btn>
        </div>
      </div>
      {showConvocatoriaCard && (
        <ConvocatoriaCardModal match={m} config={config} players={players} onClose={() => setShowConvocatoriaCard(false)} />
      )}
    </Modal>
  );
}

/* ---------------- Editor gráfico de alineación ---------------- */

function computeFormationSlots(systemStr) {
  const lines = (systemStr || "1-4-3-3").split("-").map(Number).filter((n) => !isNaN(n) && n > 0);
  if (!lines.length) return [{ x: 50, y: 90 }];
  const n = lines.length;
  const slots = [];
  lines.forEach((count, li) => {
    const y = n === 1 ? 50 : 88 - li * (78 / (n - 1));
    for (let i = 0; i < count; i++) {
      const x = ((i + 1) / (count + 1)) * 100;
      slots.push({ x, y });
    }
  });
  return slots;
}

/* ============================================================
   EDITOR DE TAREAS GRÁFICAS (diagramas tácticos)
   ============================================================ */
const PLAYER_COLORS = { jugadorA: "#1E3A8A", jugadorB: "#E63946", jugadorC: "#fff", portero: "#F4B400" };
const TACTICAL_ELEMENTS = [
  { type: "jugadorA", label: "Jugador (peto A)", isPlayer: true, isResizable: true },
  { type: "jugadorB", label: "Jugador (peto B)", isPlayer: true, isResizable: true },
  { type: "jugadorC", label: "Jugador (peto C)", isPlayer: true, isResizable: true },
  { type: "portero", label: "Portero", isPlayer: true, letter: "P", isResizable: true },
  { type: "balon", label: "Balón", isEmoji: true, emoji: "⚽", isResizable: true },
  { type: "porteria", label: "Portería", isResizable: true, isRotatable: true },
  { type: "cono", label: "Cono", isResizable: true },
  { type: "estaca", label: "Estaca / pica", isResizable: true },
  { type: "valla", label: "Valla de coordinación", isResizable: true, isRotatable: true },
  { type: "escalera", label: "Escalera de coordinación", isResizable: true, isRotatable: true },
  { type: "aro", label: "Aro / plato", isResizable: true },
  { type: "barrera", label: "Barrera (maniquí)", isResizable: true },
  { type: "texto", label: "Texto libre", needsText: true, isResizable: true },
  { type: "zonaRect", label: "Zona rectangular", isZona: true, shape: "rect", isResizable: true },
  { type: "zonaCuad", label: "Zona cuadrada", isZona: true, shape: "square", isResizable: true },
  { type: "zonaCirc", label: "Zona circular", isZona: true, shape: "circle", isResizable: true },
  { type: "zonaTri", label: "Zona triangular", isZona: true, shape: "triangle", isResizable: true },
];
const LINE_TYPES = [
  { type: "recta", label: "Recta — balón" },
  { type: "entrecortada", label: "Entrecortada — sin balón" },
  { type: "ondulada", label: "Ondulada — conducción" },
  { type: "salto", label: "Curva — salto" },
];
const LINE_COLORS = [["Azul (frente)", "#1E3A8A"], ["Amarillo (espaldas)", "#F4B400"], ["Naranja (salto)", "#F97316"], ["Rojo (remate/pase)", "#E63946"], ["Blanco", "#FFFFFF"]];
const FIELD_TYPES = [
  ["futbol11", "Campo fútbol"], ["area", "Área"], ["medioCampo", "Medio campo"], ["dobleArea", "Doble área"],
  ["zonaVacia", "Zona vacía"], ["zonaRectangular", "Zona rectangular"], ["zonaCuadrada", "Zona cuadrada"],
  ["zonaRedonda", "Zona redonda"],
];
const DIAGRAM_W = 600, DIAGRAM_H = 400;
const PITCH_LINE = "rgba(255,255,255,0.92)";

function goalSVG(cx, cy, w, h, dir) {
  // dir: 'left' | 'right' — hacia dónde "mira" la portería (fuera del campo)
  const sign = dir === "left" ? -1 : 1;
  const x2 = cx + sign * w;
  return `<g>
    <line x1="${cx}" y1="${cy - h / 2}" x2="${x2}" y2="${cy - h / 2}" stroke="#fff" stroke-width="2"/>
    <line x1="${cx}" y1="${cy + h / 2}" x2="${x2}" y2="${cy + h / 2}" stroke="#fff" stroke-width="2"/>
    <line x1="${x2}" y1="${cy - h / 2}" x2="${x2}" y2="${cy + h / 2}" stroke="#fff" stroke-width="2"/>
    <path d="M${cx},${cy - h / 2} L${x2},${cy} M${cx},${cy} L${x2},${cy - h / 2} M${cx},${cy} L${x2},${cy + h / 2} M${cx},${cy + h / 2} L${x2},${cy}" stroke="#fff" stroke-width="0.5" opacity="0.6"/>
  </g>`;
}
/* Versión centrada en (0,0), mirando a la derecha, para usar como elemento rotable */
function goalIconSVG(w, h) {
  return `<line x1="0" y1="${-h / 2}" x2="${w}" y2="${-h / 2}" stroke="#fff" stroke-width="2"/>
    <line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="#fff" stroke-width="2"/>
    <line x1="${w}" y1="${-h / 2}" x2="${w}" y2="${h / 2}" stroke="#fff" stroke-width="2"/>
    <path d="M0,${-h / 2} L${w},0 M0,0 L${w},${-h / 2} M0,0 L${w},${h / 2} M0,${h / 2} L${w},0" stroke="#fff" stroke-width="0.5" opacity="0.6"/>`;
}
/* Arco de esquina real: cuarto de círculo centrado en la esquina física del campo,
   sx/sy indican hacia qué lado está el campo (adentro) respecto a esa esquina. */
function cornerArc(cx, cy, sx, sy, r = 22) {
  const steps = 8; let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2);
    const x = cx + sx * r * Math.cos(t);
    const y = cy + sy * r * Math.sin(t);
    d += (i === 0 ? "M" : "L") + x + "," + y + " ";
  }
  return `<path d="${d}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.5"/>`;
}
/* Semicírculo del área ("D"), siempre bulto hacia afuera del área (lejos de la portería) */
function semicircleArc(cx, cy, r, axis, dir) {
  const steps = 14; let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI * (i / steps) - Math.PI / 2;
    let x, y;
    if (axis === "v") { const s = dir === "down" ? 1 : -1; x = cx + r * Math.sin(t); y = cy + s * r * Math.cos(t); }
    else { const s = dir === "right" ? 1 : -1; x = cx + s * r * Math.cos(t); y = cy + r * Math.sin(t); }
    d += (i === 0 ? "M" : "L") + x + "," + y + " ";
  }
  return `<path d="${d}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
}

/* Versión vertical del arco de portería (para lienzos Área/Medio campo/Doble área, que van girados) */
function goalSVGVertical(cx, y, w, h, dir) {
  const sign = dir === "up" ? -1 : 1;
  const y2 = y + sign * h;
  return `<g>
    <line x1="${cx - w / 2}" y1="${y}" x2="${cx - w / 2}" y2="${y2}" stroke="#fff" stroke-width="2"/>
    <line x1="${cx + w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y2}" stroke="#fff" stroke-width="2"/>
    <line x1="${cx - w / 2}" y1="${y2}" x2="${cx + w / 2}" y2="${y2}" stroke="#fff" stroke-width="2"/>
    <path d="M${cx - w / 2},${y} L${cx},${y2} M${cx},${y} L${cx + w / 2},${y2} M${cx},${y} L${cx - w / 2},${y2} M${cx + w / 2},${y} L${cx},${y2}" stroke="#fff" stroke-width="0.5" opacity="0.6"/>
  </g>`;
}

function bulgeDown(cx, cyEdge, r) {
  // Genera un semicírculo que siempre se abomba hacia abajo (alejándose de la portería), sin depender
  // de la ambigüedad del flag de dirección de los arcos SVG.
  let d = `M${(cx - r).toFixed(2)},${cyEdge.toFixed(2)}`;
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const theta = Math.PI - (Math.PI * i) / steps;
    d += ` L${(cx + r * Math.cos(theta)).toFixed(2)},${(cyEdge + r * Math.sin(theta)).toFixed(2)}`;
  }
  return d;
}
function bulgeUp(cx, cyEdge, r) {
  let d = `M${(cx - r).toFixed(2)},${cyEdge.toFixed(2)}`;
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const theta = Math.PI - (Math.PI * i) / steps;
    d += ` L${(cx + r * Math.cos(theta)).toFixed(2)},${(cyEdge - r * Math.sin(theta)).toFixed(2)}`;
  }
  return d;
}
const CAMPO_VERDE = "#2A9D5C", CAMPO_FRANJA = "#33AB67";
function renderFieldBackground(field, modo) {
  const s = renderFieldBackgroundBase(field);
  if (modo !== "blanco") return s;
  // Para imprimir: fondo blanco, líneas del campo en gris (ahorra tinta); las camisetas y las flechas conservan su color.
  return s.split("rgba(255,255,255,0.92)").join("#6B7280").split(CAMPO_VERDE).join("#FFFFFF").split(CAMPO_FRANJA).join("#FFFFFF").split("#F4B400").join("#6B7280");
}
function renderFieldBackgroundBase(field) {
  const W = DIAGRAM_W, H = DIAGRAM_H;
  const franjas = Array.from({ length: 6 }, (_, i) => `<rect x="${(i * 2 + 1) * (W / 12)}" y="0" width="${W / 12}" height="${H}" fill="${CAMPO_FRANJA}"/>`).join("");
  const green = `<rect width="${W}" height="${H}" fill="${CAMPO_VERDE}"/>${franjas}`;
  if (field === "zonaVacia") return green;

  if (field === "zonaRectangular" || field === "zonaCuadrada") {
    const w = field === "zonaCuadrada" ? 180 : 260, h = 180;
    return `${green}<rect x="${W / 2 - w / 2}" y="${H / 2 - h / 2}" width="${w}" height="${h}" fill="none" stroke="#F4B400" stroke-width="2" stroke-dasharray="9,6"/>`;
  }
  if (field === "zonaRedonda") return `${green}<circle cx="${W / 2}" cy="${H / 2}" r="95" fill="none" stroke="${PITCH_LINE}" stroke-width="2.2"/>`;

  // Área / Medio campo: orientación vertical (portería arriba), aprovechando mejor el espacio
  if (field === "area" || field === "medioCampo") {
    const cx = W / 2, topY = 40, left = 8, right = W - 8, bottom = H - 8;
    const boxBig = { w: 260, h: 90 }, boxSmall = { w: 130, h: 40 };
    let svg = green;
    svg += `<line x1="${left}" y1="${topY}" x2="${left}" y2="${bottom}" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<line x1="${right}" y1="${topY}" x2="${right}" y2="${bottom}" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<line x1="${left}" y1="${topY}" x2="${right}" y2="${topY}" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += cornerArc(left, topY, 1, 1);
    svg += cornerArc(right, topY, -1, 1);
    svg += `<rect x="${cx - boxBig.w / 2}" y="${topY}" width="${boxBig.w}" height="${boxBig.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<rect x="${cx - boxSmall.w / 2}" y="${topY}" width="${boxSmall.w}" height="${boxSmall.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<circle cx="${cx}" cy="${topY + 65}" r="2" fill="${PITCH_LINE}"/>`;
    svg += goalSVGVertical(cx, topY, 70, 28, "up");

    if (field === "area") {
      svg += `<path d="${bulgeDown(cx, topY + boxBig.h, 55)}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
      return svg;
    }
    const midY = topY + 285;
    svg += `<line x1="${left}" y1="${midY}" x2="${right}" y2="${midY}" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<circle cx="${cx}" cy="${midY}" r="65" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<circle cx="${cx}" cy="${midY}" r="2" fill="${PITCH_LINE}"/>`;
    return svg;
  }

  // Doble área: minipartido de transiciones — las dos áreas grandes, ampliadas y casi juntas,
  // sin líneas laterales ni medio campo, para aprovechar mejor el espacio de trabajo.
  if (field === "dobleArea") {
    const cx = W / 2;
    const boxBig = { w: 320, h: 130 }, boxSmall = { w: 160, h: 57 };
    const topY = 60, gap = 20;
    const box2Top = topY + boxBig.h + gap;
    let svg = green;
    // Área de arriba
    svg += `<rect x="${cx - boxBig.w / 2}" y="${topY}" width="${boxBig.w}" height="${boxBig.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<rect x="${cx - boxSmall.w / 2}" y="${topY}" width="${boxSmall.w}" height="${boxSmall.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<circle cx="${cx}" cy="${topY + 85}" r="2" fill="${PITCH_LINE}"/>`;
    svg += goalSVGVertical(cx, topY, 80, 26, "up");
    // Área de abajo (espejada)
    const box2Bottom = box2Top + boxBig.h;
    svg += `<rect x="${cx - boxBig.w / 2}" y="${box2Top}" width="${boxBig.w}" height="${boxBig.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<rect x="${cx - boxSmall.w / 2}" y="${box2Bottom - boxSmall.h}" width="${boxSmall.w}" height="${boxSmall.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
    svg += `<circle cx="${cx}" cy="${box2Bottom - 85}" r="2" fill="${PITCH_LINE}"/>`;
    svg += goalSVGVertical(cx, box2Bottom, 80, 26, "down");
    return svg;
  }

  // Campo fútbol completo
  const boxBig = { w: 95, h: 220 }, boxSmall = { w: 40, h: 110 };
  const cy = H / 2;
  let svg = green;
  svg += `<rect x="8" y="${cy - boxBig.h / 2}" width="${boxBig.w}" height="${boxBig.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<rect x="8" y="${cy - boxSmall.h / 2}" width="${boxSmall.w}" height="${boxSmall.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<circle cx="${8 + boxBig.w - 25}" cy="${cy}" r="2" fill="${PITCH_LINE}"/>`;
  svg += `<path d="M${8 + boxBig.w},${cy - 55} A55,55 0 0 1 ${8 + boxBig.w},${cy + 55}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += goalSVG(8, cy, 20, 70, "left");
  svg += cornerArc(8, 8, 1, 1);
  svg += cornerArc(8, H - 8, 1, -1);

  svg += `<rect x="${W - 8 - boxBig.w}" y="${cy - boxBig.h / 2}" width="${boxBig.w}" height="${boxBig.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<rect x="${W - 8 - boxSmall.w}" y="${cy - boxSmall.h / 2}" width="${boxSmall.w}" height="${boxSmall.h}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<circle cx="${W - 8 - boxBig.w + 25}" cy="${cy}" r="2" fill="${PITCH_LINE}"/>`;
  svg += `<path d="M${W - 8 - boxBig.w},${cy - 55} A55,55 0 0 0 ${W - 8 - boxBig.w},${cy + 55}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += goalSVG(W - 8, cy, 20, 70, "right");
  svg += cornerArc(W - 8, 8, -1, 1);
  svg += cornerArc(W - 8, H - 8, -1, -1);
  svg += `<line x1="${W / 2}" y1="8" x2="${W / 2}" y2="${H - 8}" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<circle cx="${W / 2}" cy="${cy}" r="55" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  svg += `<circle cx="${W / 2}" cy="${cy}" r="2" fill="${PITCH_LINE}"/>`;
  svg += `<rect x="8" y="8" width="${W - 16}" height="${H - 16}" fill="none" stroke="${PITCH_LINE}" stroke-width="1.8"/>`;
  return svg;
}

/* Íconos vectoriales propios (no emoji, salvo el balón) */
function elementIconSVG(type) {
  switch (type) {
    case "porteria": return "";
    case "cono": return `<ellipse cx="0" cy="8" rx="7" ry="2.2" fill="#E85D00"/><path d="M-6,8 L-1.8,-10 L1.8,-10 L6,8 Z" fill="#FF7A1A" stroke="#E85D00" stroke-width="0.8"/><rect x="-3.4" y="1" width="6.8" height="2" fill="#E85D00"/>`;
    case "estaca": return `<ellipse cx="0" cy="10" rx="4" ry="1.3" fill="#8E1F2C"/><line x1="0" y1="10" x2="0" y2="-11" stroke="#E63946" stroke-width="2.4"/><circle cx="0" cy="-11" r="2.8" fill="#E63946"/>`;
    case "valla": return `<line x1="-8" y1="10" x2="-8" y2="-7" stroke="#0B1F3A" stroke-width="2"/><line x1="8" y1="10" x2="8" y2="-7" stroke="#0B1F3A" stroke-width="2"/><line x1="-8" y1="-7" x2="8" y2="-7" stroke="#E63946" stroke-width="2.6"/>`;
    case "escalera": return `<line x1="-6" y1="16" x2="-6" y2="-16" stroke="#8B5E34" stroke-width="2"/><line x1="6" y1="16" x2="6" y2="-16" stroke="#8B5E34" stroke-width="2"/>` + [-12, -7, -2, 3, 8, 13].map((yy) => `<line x1="-6" y1="${yy}" x2="6" y2="${yy}" stroke="#B08968" stroke-width="1.8"/>`).join("");
    case "aro": return `<circle r="9" fill="none" stroke="#F4B400" stroke-width="3"/>`;
    case "barrera": return `<circle cx="0" cy="-9" r="4" fill="#1B2733"/><path d="M-6,10 L-5,-3 Q0,-6 5,-3 L6,10 Z" fill="#1B2733"/>`;
    default: return "";
  }
}

const COLORES_BLANCO = { "#FFFFFF": "#4B5563", "#F4B400": "#C2410C" };
const CAMISETA = "M-7 -12 L-13 -7 L-9 -3 L-6 -5 L-6 12 L6 12 L6 -5 L9 -3 L13 -7 L7 -12 L3 -12 Q0 -8 -3 -12 Z";
function buildDiagramSVG(diagram, opts = {}) {
  const blanco = opts.modo === "blanco";
  const tinta = (c) => (blanco ? (COLORES_BLANCO[(c || "").toUpperCase()] || c) : c);
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const px = (x) => (x / 100) * DIAGRAM_W;
  const py = (y) => (y / 100) * DIAGRAM_H;
  const colors = new Set((diagram.lines || []).map((l) => tinta(l.color)));
  const markers = [...colors].map((c) => `<marker id="arrow-${c.replace("#", "")}" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0,0.5 L7,4 L0,7.5 z" fill="${c}"/></marker>`).join("");

  const bg = renderFieldBackground(diagram.field || "futbol11", blanco ? "blanco" : "color");
  const rayasDef = (id, c) => `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="${c}" stroke-width="2.4"/></pattern>`;
  const sfx = blanco ? "k" : "";   // ids distintos por modo: si dos dibujos conviven en una página no se pisan
  const patrones = rayasDef("rz-a" + sfx, blanco ? "#111827" : "#FFE14D") + rayasDef("rz-b" + sfx, blanco ? "#111827" : "#FFFFFF");

  const lines = (diagram.lines || []).map((l) => {
    const x1 = px(l.x1), y1 = py(l.y1), x2 = px(l.x2), y2 = py(l.y2);
    let d;
    if (l.type === "recta" || l.type === "entrecortada") d = `M${x1},${y1} L${x2},${y2}`;
    else if (l.type === "salto") {
      const mx = l.cx != null ? px(l.cx) : (x1 + x2) / 2;
      const my = l.cy != null ? py(l.cy) : (y1 + y2) / 2 - 30;
      d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    } else {
      const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / dist, ny = dx / dist, segs = Math.max(6, Math.round(dist / 18));
      let path = `M${x1},${y1}`;
      for (let i = 1; i <= segs; i++) { const t = i / segs, amp = (i % 2 === 0 ? 1 : -1) * 3.5; path += ` L${x1 + dx * t + nx * amp},${y1 + dy * t + ny * amp}`; }
      d = path;
    }
    const dash = l.type === "entrecortada" ? `stroke-dasharray="8,6"` : "";
    const lc = tinta(l.color);
    const arrow = l.noArrow ? "" : `marker-end="url(#arrow-${lc.replace("#", "")})"`;
    return `<path d="${d}" fill="none" stroke="${lc}" stroke-width="1.6" ${dash} ${arrow}/>`;
  }).join("");

  const elements = (diagram.elements || []).map((el) => {
    const def = TACTICAL_ELEMENTS.find((d) => d.type === el.type) || {};
    const x = px(el.x), y = py(el.y);
    const escala = (el.size || 45) / 45;
    const scale = escala;
    if (def.isPlayer) {
      // Camisetas un poco más grandes que el tamaño guardado: las pequeñas crecen un 35 % y las
      // grandes algo menos (+0,25), para que se vean mejor sin tapar el resto del dibujo.
      const scale = Math.min(escala * 1.35, escala + 0.25);
      const label = el.number || def.letter || "";
      const fillColor = PLAYER_COLORS[el.type];
      const textColor = fillColor === "#fff" ? "#0B1F3A" : (el.type === "portero" ? "#0B1F3A" : "#fff");
      const trazo = blanco || fillColor === "#fff" ? "#1B2733" : "#fff";
      return `<g><path transform="translate(${x},${y}) scale(${scale})" d="${CAMISETA}" fill="${fillColor}" stroke="${trazo}" stroke-width="${blanco ? 1.1 : 1.4}" stroke-linejoin="round"/>${label ? `<text x="${x}" y="${y + 8 * scale}" font-size="${(String(label).length > 2 ? 7 : 9.5) * scale}" font-weight="800" fill="${textColor}" text-anchor="middle">${esc(label)}</text>` : ""}</g>`;
    }
    if (def.isZona) {
      const size = 78 * scale;
      const style = `fill="url(#${el.rayas === "blancas" ? "rz-b" : "rz-a"}${sfx})" stroke="${blanco ? "#111827" : (el.rayas === "blancas" ? "#FFFFFF" : "#FFE14D")}" stroke-width="1.5" stroke-linejoin="round"`;
      if (def.shape === "circle") return `<circle cx="${x}" cy="${y}" r="${size / 2}" ${style}/>`;
      if (def.shape === "square") return `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" ${style}/>`;
      if (def.shape === "triangle") { const r = size / 2; return `<polygon points="${x},${y - r} ${x + r * 0.95},${y + r * 0.8} ${x - r * 0.95},${y + r * 0.8}" ${style}/>`; }
      return `<rect x="${x - size * 0.7}" y="${y - size / 2}" width="${size * 1.4}" height="${size}" ${style}/>`;
    }
    if (def.isEmoji) {
      const size = 24 * scale;
      return `<text x="${x}" y="${y + size / 3}" font-size="${size}" text-anchor="middle">${def.emoji}</text>`;
    }
    if (el.type === "porteria") {
      const rot = el.rotation || 0;
      return `<g transform="translate(${x},${y}) rotate(${rot})">${goalSVG(0, 0, 22 * scale, 30 * scale, "right")}</g>`;
    }
    if (el.type === "texto") {
      const fs = 15 * scale;
      const w = Math.max(24, (el.text || "").length * fs * 0.6 + 12);
      return `<g><rect x="${x - w / 2}" y="${y - fs * 0.87}" width="${w}" height="${fs * 1.6}" rx="6" fill="#fff" stroke="#0B1F3A" stroke-width="1.4"/><text x="${x}" y="${y + fs * 0.33}" font-size="${fs}" font-weight="800" fill="#0B1F3A" text-anchor="middle">${esc(el.text)}</text></g>`;
    }
    const rot = def.isRotatable ? (el.rotation || 0) : 0;
    return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${scale})">${elementIconSVG(el.type)}</g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DIAGRAM_W} ${DIAGRAM_H}"><defs>${markers}${patrones}</defs>${bg}${lines}${elements}</svg>`;
}
function diagramToDataUrl(diagram) {
  const svg = buildDiagramSVG(diagram);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function TextEntryModal({ title, onClose, onSave }) {
  const [val, setVal] = useState("");
  return (
    <Modal title={title} onClose={onClose}>
      <TextInput autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="Escribe aquí…" />
      <div className="flex justify-end gap-2 mt-4">
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="accent" onClick={() => val.trim() && onSave(val.trim())}>Colocar</Btn>
      </div>
    </Modal>
  );
}

function useMediaQuery(q) {
  const [v, setV] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false));
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const m = window.matchMedia(q); const h = () => setV(m.matches); h();
    if (m.addEventListener) m.addEventListener("change", h); else m.addListener(h);
    return () => { if (m.removeEventListener) m.removeEventListener("change", h); else m.removeListener(h); };
  }, [q]);
  return v;
}
function TacticalEditorModal({ initial, onClose, onSave }) {
  const compacto = useMediaQuery("(max-width: 700px), (max-height: 520px)");
  const apaisado = useMediaQuery("(orientation: landscape) and (max-height: 520px)");
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [diagram, setDiagram] = useState(initial || { field: "futbol11", elements: [], lines: [] });
  const [lineMode, setLineMode] = useState(false);
  const [lineType, setLineType] = useState("recta");
  const [lineColor, setLineColor] = useState(LINE_COLORS[0][1]);
  const [noArrow, setNoArrow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [showTextEntry, setShowTextEntry] = useState(false);
  const containerRef = useRef(null);
  const dragId = useRef(null);

  const toPercent = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: Math.max(1, Math.min(99, ((clientX - rect.left) / rect.width) * 100)), y: Math.max(1, Math.min(99, ((clientY - rect.top) / rect.height) * 100)) };
  };

  const addElement = (type, text) => {
    setDiagram((p) => ({ ...p, elements: [...p.elements, { id: uid(), type, x: 45 + Math.random() * 10, y: 45 + Math.random() * 10, text, size: 45 }] }));
  };
  const handleToolTap = (el) => { if (el.needsText) { setShowTextEntry(true); return; } addElement(el.type); };

  const onCanvasClick = (e) => {
    if (!lineMode) { setSelectedId(null); setSelectedLineId(null); return; }
    const pt = toPercent(e.clientX, e.clientY);
    if (lineType === "salto") {
      // Curva en 3 toques: inicio, punto de control (define la curva), y cierre
      if (!pendingPoint) setPendingPoint({ step: 1, x1: pt.x, y1: pt.y });
      else if (pendingPoint.step === 1) setPendingPoint({ ...pendingPoint, step: 2, cx: pt.x, cy: pt.y });
      else {
        setDiagram((p) => ({ ...p, lines: [...p.lines, { id: uid(), type: "salto", color: lineColor, noArrow, x1: pendingPoint.x1, y1: pendingPoint.y1, x2: pt.x, y2: pt.y, cx: pendingPoint.cx, cy: pendingPoint.cy }] }));
        setPendingPoint(null);
      }
    } else {
      if (!pendingPoint) setPendingPoint({ step: 1, x1: pt.x, y1: pt.y });
      else {
        setDiagram((p) => ({ ...p, lines: [...p.lines, { id: uid(), type: lineType, color: lineColor, noArrow, x1: pendingPoint.x1, y1: pendingPoint.y1, x2: pt.x, y2: pt.y }] }));
        setPendingPoint(null);
      }
    }
  };

  // Arrastre de elementos: auto-contenido en cada elemento, con captura de puntero para que
  // funcione siempre tocando directamente la figura, sin necesidad de un segundo toque en otro lado.
  const onElPointerDown = (id, e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragId.current = id;
    setSelectedId(id); setSelectedLineId(null);
  };
  const onElPointerMove = (e) => {
    if (dragId.current == null) return;
    const pt = toPercent(e.clientX, e.clientY);
    setDiagram((p) => ({ ...p, elements: p.elements.map((el) => el.id === dragId.current ? { ...el, x: pt.x, y: pt.y } : el) }));
  };
  const onElPointerUp = () => { dragId.current = null; };

  // Arrastre de una línea ya creada: se mueve completa (ambos extremos), tomando como asa su punto medio
  const dragLineId = useRef(null);
  const dragLineStart = useRef(null);
  const onLinePointerDown = (id, e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragLineId.current = id;
    dragLineStart.current = toPercent(e.clientX, e.clientY);
    setSelectedId(null); setSelectedLineId(id);
  };
  const onLinePointerMove = (e) => {
    if (dragLineId.current == null) return;
    const pt = toPercent(e.clientX, e.clientY);
    const dx = pt.x - dragLineStart.current.x, dy = pt.y - dragLineStart.current.y;
    dragLineStart.current = pt;
    setDiagram((p) => ({ ...p, lines: p.lines.map((l) => l.id === dragLineId.current ? { ...l, x1: l.x1 + dx, y1: l.y1 + dy, x2: l.x2 + dx, y2: l.y2 + dy, cx: l.cx != null ? l.cx + dx : undefined, cy: l.cy != null ? l.cy + dy : undefined } : l) }));
  };
  const onLinePointerUp = () => { dragLineId.current = null; };

  const selectedEl = diagram.elements.find((e) => e.id === selectedId);
  const selectedDef = selectedEl && TACTICAL_ELEMENTS.find((d) => d.type === selectedEl.type);

  const removeSelected = () => { setDiagram((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== selectedId) })); setSelectedId(null); };
  const removeLine = (id) => setDiagram((p) => ({ ...p, lines: p.lines.filter((l) => l.id !== id) }));
  const undoLast = () => setDiagram((p) => p.lines.length ? { ...p, lines: p.lines.slice(0, -1) } : { ...p, elements: p.elements.slice(0, -1) });
  const resizeSelected = (delta) => setDiagram((p) => ({ ...p, elements: p.elements.map((el) => el.id === selectedId ? { ...el, size: Math.max(20, Math.min(160, (el.size || 45) + delta)) } : el) }));
  const rotateSelected = (delta) => setDiagram((p) => ({ ...p, elements: p.elements.map((el) => el.id === selectedId ? { ...el, rotation: ((el.rotation || 0) + delta + 360) % 360 } : el) }));
  const setZonaRayas = (v) => setDiagram((p) => ({ ...p, elements: p.elements.map((el) => el.id === selectedId ? { ...el, rayas: v } : el) }));
  const setPlayerNumber = (num) => setDiagram((p) => ({ ...p, elements: p.elements.map((el) => el.id === selectedId ? { ...el, number: num } : el) }));

  const svgMarkup = useMemo(() => buildDiagramSVG(diagram), [diagram]);

  const selectedLine = diagram.lines.find((l) => l.id === selectedLineId);
  const tablero = (
        <div className="relative w-full shrink-0" style={{ paddingBottom: `${(DIAGRAM_H / DIAGRAM_W) * 100}%`, borderRadius: 12, overflow: "hidden", border: `2px solid ${T.line}` }}>
          <div ref={containerRef} onClick={onCanvasClick}
            className="absolute inset-0 touch-none select-none [&>svg]:absolute [&>svg]:inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block" style={{ background: "#eee", cursor: lineMode ? "crosshair" : "default" }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }} />
          <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
            {!lineMode && (
              <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`} preserveAspectRatio="none" style={{ pointerEvents: "none" }}>
                {diagram.lines.map((l) => {
                  const X = (v) => (v / 100) * DIAGRAM_W, Y = (v) => (v / 100) * DIAGRAM_H;
                  const d = l.type === "salto"
                    ? `M${X(l.x1)},${Y(l.y1)} Q${X(l.cx != null ? l.cx : (l.x1 + l.x2) / 2)},${Y(l.cy != null ? l.cy : (l.y1 + l.y2) / 2 - 7.5)} ${X(l.x2)},${Y(l.y2)}`
                    : `M${X(l.x1)},${Y(l.y1)} L${X(l.x2)},${Y(l.y2)}`;
                  return (
                    <g key={l.id}>
                      {selectedLineId === l.id && <path d={d} fill="none" stroke={l.color} strokeWidth="10" strokeOpacity="0.35" strokeLinecap="round" />}
                      <path d={d} fill="none" stroke="transparent" strokeWidth="22" strokeLinecap="round" style={{ pointerEvents: "stroke", cursor: "grab", touchAction: "none" }}
                        onPointerDown={(e) => onLinePointerDown(l.id, e)} onPointerMove={onLinePointerMove} onPointerUp={onLinePointerUp} />
                    </g>
                  );
                })}
              </svg>
            )}
            {!lineMode && selectedLine && (
              <div onPointerDown={(e) => onLinePointerDown(selectedLine.id, e)} onPointerMove={onLinePointerMove} onPointerUp={onLinePointerUp}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full touch-none"
                style={{ left: `${selectedLine.cx != null ? selectedLine.cx : (selectedLine.x1 + selectedLine.x2) / 2}%`, top: `${selectedLine.cy != null ? selectedLine.cy : (selectedLine.y1 + selectedLine.y2) / 2}%`, width: 22, height: 22, pointerEvents: "auto", cursor: "grab", border: `2px dashed ${selectedLine.color === "#FFFFFF" ? "#0B1F3A" : selectedLine.color}`, background: "rgba(255,255,255,0.35)" }} title="Arrastrar línea" />
            )}
            {diagram.elements.map((el) => (
              <div key={el.id} onPointerDown={(e) => onElPointerDown(el.id, e)} onPointerMove={onElPointerMove} onPointerUp={onElPointerUp}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full touch-none"
                style={{ left: `${el.x}%`, top: `${el.y}%`, width: 32, height: 32, pointerEvents: lineMode ? "none" : "auto", cursor: "grab", border: selectedId === el.id ? `2px dashed ${T.red}` : "none" }} />
            ))}
          </div>
        </div>
  );
  const aviso = (
    <>
        {pendingPoint && lineMode && (
          <div className="text-xs font-bold" style={{ color: T.red }}>
            {lineType === "salto"
              ? (pendingPoint.step === 1 ? "Toca el punto que define la curva…" : "Toca el punto final para cerrar la curva…")
              : "Toca el punto final de la línea…"}
          </div>
        )}

    </>
  );
  const panelSel = (
    <>
        {selectedEl && (
          <div className="p-2.5 rounded-lg flex items-center gap-2 flex-wrap" style={{ background: "#EEF2F8" }}>
            {selectedDef?.isPlayer && (
              <>
                <span className="text-xs font-bold" style={{ color: T.navy }}>Número:</span>
                <TextInput value={selectedEl.number || ""} onChange={(e) => setPlayerNumber(e.target.value)} className="w-16 text-xs py-1" />
              </>
            )}
            {selectedDef?.isResizable && (
              <>
                <span className="text-xs font-bold" style={{ color: T.navy }}>Tamaño:</span>
                <Btn variant="ghost" onClick={() => resizeSelected(-10)}>−</Btn>
                <Btn variant="ghost" onClick={() => resizeSelected(10)}>+</Btn>
              </>
            )}
            {selectedDef?.isZona && (
              <>
                <span className="text-xs font-bold" style={{ color: T.navy }}>Rayas:</span>
                <Btn variant={selectedEl.rayas === "blancas" ? "ghost" : "primary"} onClick={() => setZonaRayas("amarillas")}>Amarillas</Btn>
                <Btn variant={selectedEl.rayas === "blancas" ? "primary" : "ghost"} onClick={() => setZonaRayas("blancas")}>Blancas</Btn>
              </>
            )}
            {selectedDef?.isRotatable && (
              <>
                <span className="text-xs font-bold" style={{ color: T.navy }}>Girar:</span>
                <Btn variant="ghost" onClick={() => rotateSelected(-45)}>↺ 45°</Btn>
                <Btn variant="ghost" onClick={() => rotateSelected(45)}>↻ 45°</Btn>
              </>
            )}
            <Btn variant="danger" icon={Trash2} onClick={removeSelected}>Quitar</Btn>
            <Btn variant="ghost" onClick={() => setSelectedId(null)}>Listo</Btn>
          </div>
        )}

        {selectedLine && !lineMode && (
          <div className="p-2.5 rounded-lg flex items-center gap-2 flex-wrap" style={{ background: "#EEF2F8" }}>
            <span className="text-xs font-bold" style={{ color: T.navy }}>Línea seleccionada: arrástrala para moverla</span>
            <Btn variant="danger" icon={Trash2} onClick={() => { removeLine(selectedLine.id); setSelectedLineId(null); }}>Quitar</Btn>
            <Btn variant="ghost" onClick={() => setSelectedLineId(null)}>Listo</Btn>
          </div>
        )}

    </>
  );
  const controlesA = (
    <>
        <div>
          <div className="text-xs font-bold uppercase mb-1.5" style={{ color: T.muted }}>Lienzo</div>
          <div className="flex gap-1.5 flex-wrap">
            {FIELD_TYPES.map(([k, l]) => (
              <button key={k} onClick={() => setDiagram((p) => ({ ...p, field: k }))} className="px-2.5 py-1.5 rounded-lg text-xs font-bold border"
                style={{ background: (diagram.field || "futbol11") === k ? T.navy : "#fff", color: (diagram.field || "futbol11") === k ? "#fff" : T.muted, borderColor: T.line }}>{l}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-2"><Btn variant="ghost" onClick={undoLast}>↩ Deshacer último</Btn></div>

    </>
  );
  const controlesD = (
    <>
        {lineMode && (
          <div className="p-2.5 rounded-lg" style={{ background: "#FEF3C7", border: `1.5px solid ${T.yellow}` }}>
            <div className="text-xs font-bold mb-1.5" style={{ color: T.navy }}>Toca el punto de inicio y luego el punto final de la línea</div>
            <div className="flex gap-1.5 flex-wrap mb-1.5">
              {LINE_TYPES.map((lt) => (
                <button key={lt.type} onClick={() => setLineType(lt.type)} className="px-2 py-1 rounded-full text-[10px] font-bold border"
                  style={{ background: lineType === lt.type ? T.navy : "#fff", color: lineType === lt.type ? "#fff" : T.muted, borderColor: T.line }}>{lt.label}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              {LINE_COLORS.map(([label, c]) => (
                <button key={c} onClick={() => setLineColor(c)} className="w-7 h-7 rounded-full border-2" style={{ background: c, borderColor: lineColor === c ? T.navy : T.line }} title={label} />
              ))}
              <label className="flex items-center gap-1.5 text-xs font-bold ml-2" style={{ color: T.navy }}>
                <input type="checkbox" checked={noArrow} onChange={(e) => setNoArrow(e.target.checked)} /> Sin flecha
              </label>
            </div>
          </div>
        )}

        <Btn variant={lineMode ? "accent" : "ghost"} onClick={() => { setLineMode((v) => !v); setPendingPoint(null); setSelectedLineId(null); }}>{lineMode ? "Cerrar modo línea" : "✏️ Dibujar línea"}</Btn>

        <div>
          <div className="text-xs font-bold uppercase mb-1.5" style={{ color: T.muted }}>Elementos</div>
          <div className="flex gap-1.5 flex-wrap">
            {TACTICAL_ELEMENTS.map((el) => (
              <button key={el.type} onClick={() => handleToolTap(el)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: T.line, color: T.navy }}>
                {el.label}
              </button>
            ))}
          </div>
        </div>

        {!!diagram.lines.length && (
          <div>
            <div className="text-xs font-bold uppercase mb-1.5" style={{ color: T.muted }}>Líneas creadas</div>
            <div className="flex flex-col gap-1">
              {diagram.lines.map((l, i) => (
                <div key={l.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg" style={{ background: "#F7F8FA" }}>
                  <span style={{ color: T.text }}><span className="inline-block w-3 h-3 rounded-full mr-1.5" style={{ background: l.color }} />{i + 1}. {LINE_TYPES.find((t) => t.type === l.type)?.label}</span>
                  <button onClick={() => removeLine(l.id)}><Trash2 size={13} style={{ color: T.redLight }} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTextEntry && (
          <TextEntryModal title="Texto a mostrar" onClose={() => setShowTextEntry(false)}
            onSave={(val) => { addElement("texto", val); setShowTextEntry(false); }} />
        )}
    </>
  );
  const guardar = () => onSave(diagram, diagramToDataUrl(diagram));

  if (compacto) {
    // Móvil (vertical u horizontal): pantalla completa, barra superior de una línea y el tablero siempre a la vista.
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex items-center gap-2 px-2 py-1.5 border-b shrink-0" style={{ borderColor: T.line }}>
          <button onClick={onClose} className="p-2 rounded-lg" aria-label="Cancelar"><X size={18} /></button>
          <div className="flex-1 min-w-0 font-extrabold text-sm truncate" style={{ color: T.navy }}>Tarea gráfica</div>
          <Btn variant="accent" icon={Save} onClick={guardar}>Guardar</Btn>
        </div>
        {apaisado ? (
          <div className="flex-1 min-h-0 flex gap-2 p-2">
            <div className="shrink-0 flex flex-col gap-2 overflow-y-auto" style={{ width: "min(58vw, calc((100vh - 60px) * 1.5))" }}>{tablero}{aviso}{panelSel}</div>
            <div className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-3 pr-1">{controlesA}{controlesD}</div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="shrink-0 px-2 pt-2 flex flex-col gap-2">{tablero}{aviso}{panelSel}</div>
            <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 flex flex-col gap-3">{controlesA}{controlesD}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal title="Tarea gráfica" onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        {controlesA}{aviso}{tablero}{panelSel}{controlesD}
      </div>

      <div className="flex justify-end gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="accent" icon={MODO_DEMO ? ChevronLeft : Save} onClick={guardar}>{MODO_DEMO ? "Ver el dibujo en la tarea" : "Guardar tarea gráfica"}</Btn>
      </div>
    </Modal>
  );
}

/* ============================================================
   PIZARRA (uso rápido en vivo: vestuario / borde de cancha)
   ============================================================ */
function jerseyIconSVG(color, borderColor) {
  return `<path d="M-13,-9 L-7,-14 L-2,-10 L2,-10 L7,-14 L13,-9 L9,-2 L6,-4 L6,14 L-6,14 L-6,-4 L-9,-2 Z" fill="${color}" stroke="${borderColor}" stroke-width="1.3"/>`;
}
function buildPizarraSVG(state, players) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const px = (x) => (x / 100) * DIAGRAM_W;
  const py = (y) => (y / 100) * DIAGRAM_H;
  const colors = new Set((state.lines || []).map((l) => l.color));
  const markers = [...colors].map((c) => `<marker id="arrowpz-${c.replace("#", "")}" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0,0.5 L7,4 L0,7.5 z" fill="${c}"/></marker>`).join("");
  const bg = renderFieldBackground("futbol11");

  const strokes = (state.strokes || []).map((s) => {
    const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`;
  }).join("");

  const lines = (state.lines || []).map((l) => {
    const x1 = px(l.x1), y1 = py(l.y1), x2 = px(l.x2), y2 = py(l.y2);
    let d;
    if (l.type === "recta" || l.type === "entrecortada") d = `M${x1},${y1} L${x2},${y2}`;
    else {
      const dx = x2 - x1, dy = y2 - y1, dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / dist, ny = dx / dist, segs = Math.max(6, Math.round(dist / 18));
      let path = `M${x1},${y1}`;
      for (let i = 1; i <= segs; i++) { const t = i / segs, amp = (i % 2 === 0 ? 1 : -1) * 3.5; path += ` L${x1 + dx * t + nx * amp},${y1 + dy * t + ny * amp}`; }
      d = path;
    }
    const dash = l.type === "entrecortada" ? `stroke-dasharray="8,6"` : "";
    return `<path d="${d}" fill="none" stroke="${l.color}" stroke-width="1.6" ${dash} marker-end="url(#arrowpz-${l.color.replace("#", "")})"/>`;
  }).join("");

  const elements = (state.elements || []).map((el) => {
    const x = px(el.x), y = py(el.y);
    if (el.type === "balon") return `<text x="${x}" y="${y + 8}" font-size="24" text-anchor="middle">⚽</text>`;
    const p = players.find((pl) => pl.id === el.playerId);
    const color = el.team === "B" ? "#F4B400" : el.team === "C" ? "#F97316" : "#1E3A8A";
    const nombre = p ? (p.apodo || p.nombre.split(" ")[0]) : "";
    const numero = p ? p.numero : (el.number || "");
    return `<g>
      <g transform="translate(${x},${y})">${jerseyIconSVG(color, "#fff")}</g>
      <text x="${x}" y="${y + 3}" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">${esc(numero)}</text>
      ${nombre ? `<rect x="${x - Math.max(20, nombre.length * 4)}" y="${y + 18}" width="${Math.max(40, nombre.length * 8)}" height="14" rx="4" fill="rgba(11,31,58,0.85)"/><text x="${x}" y="${y + 28}" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle">${esc(nombre)}</text>` : ""}
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DIAGRAM_W} ${DIAGRAM_H}"><defs>${markers}</defs>${bg}${strokes}${lines}${elements}</svg>`;
}
function pizarraToDataUrl(state, players) {
  const svg = buildPizarraSVG(state, players);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function PizarraModule({ ctx }) {
  const { players, pizarra, updatePizarra, config } = ctx;
  const state = pizarra || { elements: [], lines: [], strokes: [] };
  const [mode, setMode] = useState("select"); // select | linea | lapiz
  const [lineType, setLineType] = useState("recta");
  const [showPicker, setShowPicker] = useState(null); // 'A' | 'B' | null
  const [pendingPoint, setPendingPoint] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [liveStroke, setLiveStroke] = useState(null);
  const containerRef = useRef(null);
  const dragId = useRef(null);
  const isDrawingStroke = useRef(false);

  const toPercent = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: Math.max(1, Math.min(99, ((clientX - rect.left) / rect.width) * 100)), y: Math.max(1, Math.min(99, ((clientY - rect.top) / rect.height) * 100)) };
  };

  const set = (updater) => updatePizarra((prev) => updater(prev || { elements: [], lines: [], strokes: [] }));

  const addPlayer = (playerId, team) => {
    set((p) => ({ ...p, elements: [...p.elements, { id: uid(), type: "jugador", playerId, team, x: team === "A" ? 30 : 70, y: 20 + Math.random() * 60 }] }));
    setShowPicker(null);
  };
  // Equipos B y C son referencia del rival: se agregan directo, sin nombre, con número editable opcional.
  const addGenericPlayer = (team) => {
    set((p) => ({ ...p, elements: [...p.elements, { id: uid(), type: "jugador", playerId: null, team, number: "", x: team === "B" ? 70 : 50, y: 20 + Math.random() * 60 }] }));
  };
  const addBall = () => set((p) => ({ ...p, elements: [...p.elements, { id: uid(), type: "balon", x: 50, y: 50 }] }));
  const setSelectedNumber = (num) => set((p) => ({ ...p, elements: p.elements.map((el) => el.id === selectedId ? { ...el, number: num } : el) }));

  const usedIds = state.elements.filter((e) => e.type === "jugador" && e.playerId).map((e) => e.playerId);

  const onElPointerDown = (id, e) => {
    if (mode === "lapiz") return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragId.current = id;
    setSelectedId(id);
  };
  const onElPointerMove = (e) => {
    if (dragId.current == null) return;
    const pt = toPercent(e.clientX, e.clientY);
    set((p) => ({ ...p, elements: p.elements.map((el) => el.id === dragId.current ? { ...el, x: pt.x, y: pt.y } : el) }));
  };
  const onElPointerUp = () => { dragId.current = null; };

  const onCanvasPointerDown = (e) => {
    if (mode !== "lapiz") return;
    const pt = toPercent(e.clientX, e.clientY);
    isDrawingStroke.current = true;
    setLiveStroke([pt]);
  };
  const onCanvasPointerMove = (e) => {
    if (!isDrawingStroke.current) return;
    const pt = toPercent(e.clientX, e.clientY);
    setLiveStroke((prev) => (prev ? [...prev, pt] : [pt]));
  };
  const onCanvasPointerUp = () => {
    if (isDrawingStroke.current && liveStroke && liveStroke.length > 1) {
      set((p) => ({ ...p, strokes: [...p.strokes, { id: uid(), points: liveStroke }] }));
    }
    isDrawingStroke.current = false;
    setLiveStroke(null);
  };

  const onCanvasClick = (e) => {
    if (mode !== "linea") { setSelectedId(null); return; }
    const pt = toPercent(e.clientX, e.clientY);
    if (!pendingPoint) setPendingPoint(pt);
    else {
      set((p) => ({ ...p, lines: [...p.lines, { id: uid(), type: lineType, color: "#F4B400", x1: pendingPoint.x, y1: pendingPoint.y, x2: pt.x, y2: pt.y }] }));
      setPendingPoint(null);
    }
  };

  const removeSelected = () => { set((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== selectedId) })); setSelectedId(null); };
  const resetBoard = () => { if (confirm("¿Reiniciar la pizarra? Se borra todo.")) updatePizarra({ elements: [], lines: [], strokes: [] }); };

  const svgMarkup = useMemo(() => buildPizarraSVG(state, players), [state, players]);

  const doPrint = () => {
    const url = pizarraToDataUrl(state, players);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Pizarra</title><style>body{margin:0;background:#eee;display:flex;flex-direction:column;align-items:center;padding:12px;font-family:sans-serif;} img{max-width:100%;border-radius:10px;} .tb{display:flex;gap:10px;margin-bottom:12px;} button{font-size:14px;font-weight:800;border:none;border-radius:10px;padding:10px 18px;cursor:pointer;} .p{background:#E63946;color:#fff;} .c{background:#fff;border:1.5px solid #ccc !important;} @media print{.tb{display:none;}}</style></head><body><div class="tb"><button class="p" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="c" onclick="window.close()">Cerrar</button></div><img src="${url}"/></body></html>`);
      w.document.close();
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><Eyebrow>Pizarra</Eyebrow><h1 className="text-xl font-extrabold" style={{ color: T.navy }}>Explicación rápida en vivo</h1></div>
        <div className="flex gap-2">
          <Btn variant="ghost" icon={Printer} onClick={doPrint}>Imprimir / Guardar imagen</Btn>
          <Btn variant="danger" icon={Trash2} onClick={resetBoard}>Reiniciar</Btn>
        </div>
      </div>

      <div className="relative w-full shrink-0" style={{ paddingBottom: `${(DIAGRAM_H / DIAGRAM_W) * 100}%`, borderRadius: 12, overflow: "hidden", border: `2px solid ${T.line}` }}>
        <div ref={containerRef} onClick={onCanvasClick} onPointerDown={onCanvasPointerDown} onPointerMove={onCanvasPointerMove} onPointerUp={onCanvasPointerUp}
          className="absolute inset-0 touch-none select-none [&>svg]:absolute [&>svg]:inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block" style={{ background: "#eee", cursor: mode === "linea" ? "crosshair" : mode === "lapiz" ? "crosshair" : "default" }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }} />
        {liveStroke && liveStroke.length > 1 && (
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`} preserveAspectRatio="none">
            <polyline points={liveStroke.map((p) => `${(p.x / 100) * DIAGRAM_W},${(p.y / 100) * DIAGRAM_H}`).join(" ")}
              fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
          </svg>
        )}
        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          {state.elements.map((el) => (
            <div key={el.id} onPointerDown={(e) => onElPointerDown(el.id, e)} onPointerMove={onElPointerMove} onPointerUp={onElPointerUp}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full touch-none"
              style={{ left: `${el.x}%`, top: `${el.y}%`, width: 36, height: 44, pointerEvents: mode === "lapiz" ? "none" : "auto", cursor: "grab", border: selectedId === el.id ? `2px dashed ${T.red}` : "none" }} />
          ))}
        </div>
      </div>

      {selectedId && (
        <div className="p-2.5 rounded-lg flex items-center gap-2 flex-wrap" style={{ background: "#EEF2F8" }}>
          <span className="text-xs font-bold" style={{ color: T.navy }}>Elemento seleccionado</span>
          {(() => {
            const el = state.elements.find((e) => e.id === selectedId);
            if (el?.type === "jugador" && !el.playerId) {
              return (<>
                <span className="text-xs font-bold" style={{ color: T.navy }}>Número (opcional):</span>
                <TextInput value={el.number || ""} onChange={(e) => setSelectedNumber(e.target.value)} className="w-16 text-xs py-1" />
              </>);
            }
            return null;
          })()}
          <Btn variant="danger" icon={Trash2} onClick={removeSelected}>Quitar</Btn>
        </div>
      )}

      {mode === "linea" && (
        <div className="p-2.5 rounded-lg flex items-center gap-2 flex-wrap" style={{ background: "#FEF3C7", border: `1.5px solid ${T.yellow}` }}>
          <span className="text-xs font-bold" style={{ color: T.navy }}>{pendingPoint ? "Toca el punto final…" : "Toca el punto de inicio…"}</span>
          {[["recta", "Recta"], ["entrecortada", "Entrecortada"], ["ondulada", "Ondulada"]].map(([t, l]) => (
            <button key={t} onClick={() => setLineType(t)} className="px-2 py-1 rounded-full text-[10px] font-bold border"
              style={{ background: lineType === t ? T.navy : "#fff", color: lineType === t ? "#fff" : T.muted, borderColor: T.line }}>{l}</button>
          ))}
        </div>
      )}

      <details className="text-[11px] rounded-lg p-2" style={{ background: "#F8FAFC", border: `1px solid ${T.line}`, color: T.muted }}>
        <summary className="cursor-pointer font-bold" style={{ color: T.navy }}>ⓘ Cómo leer el gráfico</summary>
        <div className="mt-1 leading-relaxed">
          <b>Línea continua (recta):</b> el balón (pase, pase centro, pase al espacio, tiro). <b>Línea entrecortada:</b> jugador sin balón (desplazamiento, desmarque, desdoblamiento). <b>Línea ondulada:</b> conducción (jugador con balón). <b>Curva:</b> balón por el aire. Los colores son los equipos; <b>P</b> portero, <b>C</b> comodín, <b>E</b> entrenador; las flechas rojas son del equipo rival.
        </div>
      </details>

      <div className="flex items-center gap-2 flex-wrap">
        <Btn variant={mode === "select" ? "accent" : "ghost"} onClick={() => { setMode("select"); setPendingPoint(null); }}>👆 Mover</Btn>
        <Btn variant={mode === "linea" ? "accent" : "ghost"} onClick={() => { setMode("linea"); setPendingPoint(null); }}>✏️ Línea</Btn>
        <Btn variant={mode === "lapiz" ? "accent" : "ghost"} onClick={() => setMode("lapiz")}>🖊️ Lápiz</Btn>
        <Btn variant="ghost" onClick={() => setShowPicker("A")}>+ Jugador equipo A</Btn>
        <Btn variant="ghost" onClick={() => addGenericPlayer("B")}>+ Equipo B (rival)</Btn>
        <Btn variant="ghost" onClick={() => addGenericPlayer("C")}>+ Equipo C (rival)</Btn>
        <Btn variant="ghost" onClick={addBall}>+ Balón</Btn>
      </div>

      {showPicker && (
        <Modal title="Elegir jugador — tu equipo" onClose={() => setShowPicker(null)}>
          <div className="flex flex-col gap-1.5 max-h-[55vh] overflow-y-auto">
            {players.map((p) => (
              <button key={p.id} onClick={() => addPlayer(p.id, showPicker)} disabled={usedIds.includes(p.id)}
                className="flex items-center gap-3 p-3 rounded-xl text-left border disabled:opacity-40"
                style={{ borderColor: T.line }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0" style={{ background: T.navy }}>{p.numero}</span>
                <span className="text-sm font-bold" style={{ color: T.navy }}>{p.apodo || p.nombre}</span>
                {usedIds.includes(p.id) && <span className="text-[10px] ml-auto" style={{ color: T.muted }}>Ya en la pizarra</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function PitchEditor({ system, players, lineup, onChange, readOnly = false }) {
  const containerRef = useRef(null);
  const dragIndex = useRef(null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const [activeSlot, setActiveSlot] = useState(null);

  const baseSlots = useMemo(() => computeFormationSlots(system), [system]);
  const slots = baseSlots.map((s, i) => lineup[i] ? { ...s, ...lineup[i] } : { ...s, jugadorId: null });

  const setSlot = (i, patch) => {
    const next = slots.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    onChange(next.map(({ x, y, jugadorId }) => ({ x, y, jugadorId })));
  };

  const onPointerDown = (i, e) => {
    if (readOnly) return;
    dragIndex.current = i; movedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (readOnly || dragIndex.current == null || !containerRef.current) return;
    const dx = Math.abs(e.clientX - startRef.current.x), dy = Math.abs(e.clientY - startRef.current.y);
    if (dx > 12 || dy > 12) movedRef.current = true;
    if (!movedRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(4, Math.min(96, x)); y = Math.max(4, Math.min(96, y));
    setSlot(dragIndex.current, { x, y });
  };
  const onPointerUp = (i) => {
    if (readOnly) return;
    if (!movedRef.current) setActiveSlot(i === activeSlot ? null : i);
    dragIndex.current = null;
  };

  const assignedIds = slots.map((s) => s.jugadorId).filter(Boolean);

  return (
    <div>
      {!readOnly && <div className="text-xs mb-2" style={{ color: T.muted }}>Toca un jugador para asignarlo. Mantén pulsado y arrastra para moverlo sobre el campo.</div>}
      {!readOnly && activeSlot != null && (
        <Modal title={`Posición ${activeSlot + 1}`} onClose={() => setActiveSlot(null)}>
          <div className="flex flex-col gap-1.5 max-h-[55vh] overflow-y-auto">
            <button onClick={() => { setSlot(activeSlot, { jugadorId: null }); setActiveSlot(null); }}
              className="p-3 rounded-xl text-left text-sm font-bold border" style={{ borderColor: T.line, color: T.muted }}>
              Sin asignar
            </button>
            {players.filter((p) => !assignedIds.includes(p.id) || p.id === slots[activeSlot].jugadorId).map((p) => (
              <button key={p.id} onClick={() => { setSlot(activeSlot, { jugadorId: p.id }); setActiveSlot(null); }}
                className="flex items-center gap-3 p-3 rounded-xl text-left border"
                style={{ borderColor: slots[activeSlot].jugadorId === p.id ? T.navy : T.line, background: slots[activeSlot].jugadorId === p.id ? "#EEF2F8" : "#fff" }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0" style={{ background: T.navy }}>{p.numero}</span>
                <span className="text-sm font-bold" style={{ color: T.navy }}>{p.apodo || p.nombre}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
      <div ref={containerRef} onPointerMove={onPointerMove}
        className="relative w-full rounded-xl overflow-hidden select-none touch-none"
        style={{ aspectRatio: "2/3", maxWidth: 300, margin: "0 auto", background: `linear-gradient(${T.green}, #22874C)`, border: `2px solid #1F7A44` }}>
        <div className="absolute inset-2 border-2 rounded-lg" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        <div className="absolute left-2 right-2 top-1/2 border-t-2" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        <div className="absolute left-1/2 top-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }} />
        {/* Área grande (penal) */}
        <div className="absolute left-1/2 top-2 w-60 h-28 -translate-x-1/2 border-2 border-t-0" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        <div className="absolute left-1/2 bottom-2 w-60 h-28 -translate-x-1/2 border-2 border-b-0" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        {/* Área chica (portería) */}
        <div className="absolute left-1/2 top-2 w-32 h-12 -translate-x-1/2 border-2 border-t-0" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        <div className="absolute left-1/2 bottom-2 w-32 h-12 -translate-x-1/2 border-2 border-b-0" style={{ borderColor: "rgba(255,255,255,0.5)" }} />
        {/* Punto penal */}
        <div className="absolute left-1/2 top-[15%] w-1.5 h-1.5 -translate-x-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }} />
        <div className="absolute left-1/2 bottom-[15%] w-1.5 h-1.5 -translate-x-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.6)" }} />
        {/* Arcos de esquina */}
        <div className="absolute left-2 top-2 w-4 h-4 border-2 rounded-br-full" style={{ borderColor: "rgba(255,255,255,0.5)", borderTop: "none", borderLeft: "none" }} />
        <div className="absolute right-2 top-2 w-4 h-4 border-2 rounded-bl-full" style={{ borderColor: "rgba(255,255,255,0.5)", borderTop: "none", borderRight: "none" }} />
        <div className="absolute left-2 bottom-2 w-4 h-4 border-2 rounded-tr-full" style={{ borderColor: "rgba(255,255,255,0.5)", borderBottom: "none", borderLeft: "none" }} />
        <div className="absolute right-2 bottom-2 w-4 h-4 border-2 rounded-tl-full" style={{ borderColor: "rgba(255,255,255,0.5)", borderBottom: "none", borderRight: "none" }} />
        {slots.map((s, i) => {
          const p = players.find((pl) => pl.id === s.jugadorId);
          return (
            <div key={i} onPointerDown={(e) => onPointerDown(i, e)} onPointerUp={() => onPointerUp(i)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-extrabold text-white shadow-md"
                style={{ background: p ? T.navy : "rgba(255,255,255,0.35)", border: activeSlot === i ? `2px solid ${T.yellow}` : "2px solid rgba(255,255,255,0.8)" }}>
                {p ? p.numero : "+"}
              </div>
              {p && <div className="text-[12px] font-bold text-white mt-1 whitespace-nowrap" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>{p.apodo || p.nombre.split(" ")[0]}</div>}
            </div>
          );
        })}
      </div>
      {!readOnly && (
        <div className="mt-3">
          <Eyebrow>Banquillo (convocados sin asignar)</Eyebrow>
          <div className="flex flex-wrap gap-2 mt-2">
            {players.filter((p) => !assignedIds.includes(p.id)).map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white" style={{ background: T.muted }}>{p.numero}</span>
                <span className="text-xs font-bold" style={{ color: T.navy }}>{p.apodo || p.nombre}</span>
              </div>
            ))}
            {players.filter((p) => !assignedIds.includes(p.id)).length === 0 && <div className="text-xs" style={{ color: T.muted }}>Todos los convocados están en el campo.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchForm({ ctx, initial, onClose, onSave, onDelete }) {
  const { config, players } = ctx;
  const blank = {
    id: uid(), fecha: todayISO(), hora: "", duracionParte: 25, competicion: "Liga", jornada: "", rival: "", esLocal: true, campo: "",
    resultadoDescanso: "", resultadoFinal: "0-0", cerrado: false, tipoFutbol: config.footballType,
    sistema: config.tacticalSystems[config.footballType]?.[0] || "",
    convocatoria: players.map((p) => ({ jugadorId: p.id, estado: "No convocado" })),
    capitanId: null,
    vestimenta: { camiseta: "", pantaloneta: "", medias: "" },
    alineacion: [],
    cambios: [], goles: [], tarjetas: [],
    tactica: { modelo: "", funciono: "", noFunciono: "", ajustes: "" },
    rendimiento: { ataque: 5, defensa: 5, transicionOfensiva: 5, transicionDefensiva: 5, balonParadoOfensivo: 5, balonParadoDefensivo: 5, fortalezas: "", debilidades: "" },
    valoracionesJugadores: {},
    aprendizajes: { mantener: "", corregir: "", trabajar: "" },
    oportunidadesFalladas: "", tirosPuerta: "", posesionBalon: "",
    observaciones: "", videoUrl: "",
  };
  const [f, setF] = useState(initial ? {
    ...blank, ...initial,
    convocatoria: players.map((p) => initial.convocatoria?.find((c) => c.jugadorId === p.id) || { jugadorId: p.id, estado: "No convocado" }),
    vestimenta: { ...blank.vestimenta, ...(initial.vestimenta || {}) },
    valoracionesJugadores: { ...blank.valoracionesJugadores, ...(initial.valoracionesJugadores || {}) },
  } : blank);
  const [tab, setTab] = useState("datos");
  const [showConvocatoriaCard, setShowConvocatoriaCard] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setNested = (k, kk, v) => setF((p) => ({ ...p, [k]: { ...p[k], [kk]: v } }));
  const systemsForType = config.tacticalSystems[f.tipoFutbol] || [];
  const [sistemaManual, setSistemaManual] = useState(initial ? !systemsForType.includes(initial.sistema) && !!initial.sistema : false);

  const submit = () => onSave(sanearPartido(f, players));

  const addRow = (key, row) => setF((p) => ({ ...p, [key]: [...p[key], { id: uid(), ...row }] }));
  const removeRow = (key, id) => setF((p) => ({ ...p, [key]: p[key].filter((r) => r.id !== id) }));
  const updateRow = (key, id, kk, v) => setF((p) => ({ ...p, [key]: p[key].map((r) => r.id === id ? { ...r, [kk]: v } : r) }));

  const tabs = [["datos", "Datos"], ["convocatoria", "Convocatoria"], ["vestimenta", "Vestimenta"], ["alineacion", "Alineación"], ["eventos", "Cambios/Goles/Tarjetas"], ["tactica", "Táctica"], ["rendimiento", "Rendimiento"], ["aprendizajes", "Aprendizajes"], ["obs", "Observaciones"]];

  return (
    <Modal title={initial ? "Editar partido" : "Nuevo partido"} onClose={onClose} wide>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}` }}>{l}</button>
        ))}
      </div>

      {tab === "datos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Fecha"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
          <Field label="Hora del partido"><TextInput type="time" value={f.hora || ""} onChange={(e) => set("hora", e.target.value)} /></Field>
          <Field label="Duración de cada parte (minutos)">
            <Select
              value={[20, 25, 30, 35, 40, 45].includes(f.duracionParte) ? f.duracionParte : "manual"}
              onChange={(e) => set("duracionParte", e.target.value === "manual" ? "" : Number(e.target.value))}
            >
              <option value={20}>20 minutos (Fútbol 8 · categorías más pequeñas)</option>
              <option value={25}>25 minutos (Fútbol 8)</option>
              <option value={30}>30 minutos (Fútbol 8 avanzado / Fútbol 11 inicial)</option>
              <option value={35}>35 minutos (Fútbol 11 formativo)</option>
              <option value={40}>40 minutos (Fútbol 11 juvenil)</option>
              <option value={45}>45 minutos (Fútbol 11 senior/reglamentario)</option>
              <option value="manual">Otra duración (manual)</option>
            </Select>
            {![20, 25, 30, 35, 40, 45].includes(f.duracionParte) && (
              <TextInput
                type="number" min="1" placeholder="Minutos por parte" className="mt-2"
                value={f.duracionParte || ""}
                onChange={(e) => set("duracionParte", e.target.value ? Number(e.target.value) : "")}
              />
            )}
          </Field>
          <Field label="Competición">
            <Select value={f.competicion} onChange={(e) => set("competicion", e.target.value)}>
              <option>Liga</option><option>Amistoso</option><option>Torneo</option>
            </Select>
          </Field>
          <Field label="Jornada"><TextInput value={f.jornada} onChange={(e) => set("jornada", e.target.value)} /></Field>
          <Field label="Categoría"><TextInput value={f.categoria || config.category} onChange={(e) => set("categoria", e.target.value)} /></Field>
          <Field label="Rival"><TextInput value={f.rival} onChange={(e) => set("rival", e.target.value)} /></Field>
          <Field label="Condición">
            <Select value={f.esLocal ? "local" : "visitante"} onChange={(e) => set("esLocal", e.target.value === "local")}><option value="local">Local</option><option value="visitante">Visitante</option></Select>
          </Field>
          <Field label="Campo"><TextInput value={f.campo} onChange={(e) => set("campo", e.target.value)} /></Field>
          <Field label="Tipo de fútbol">
            <Select value={f.tipoFutbol} onChange={(e) => set("tipoFutbol", e.target.value)}>{Object.keys(config.tacticalSystems).map((t) => <option key={t}>{t}</option>)}</Select>
          </Field>
          <Field label="Sistema utilizado">
            <Select value={sistemaManual ? "__otro__" : f.sistema} onChange={(e) => {
              if (e.target.value === "__otro__") { setSistemaManual(true); set("sistema", ""); }
              else { setSistemaManual(false); set("sistema", e.target.value); }
            }}>
              {systemsForType.map((s) => <option key={s}>{s}</option>)}
              <option value="__otro__">Otro (ingresar manualmente)</option>
            </Select>
            {sistemaManual && (
              <TextInput className="mt-2" placeholder="Ej: 1-4-3-3" value={f.sistema} onChange={(e) => set("sistema", e.target.value)} />
            )}
          </Field>
          <Field label="Resultado al descanso"><TextInput value={f.resultadoDescanso} onChange={(e) => set("resultadoDescanso", e.target.value)} placeholder="0-0" /></Field>
          <Field label="Resultado final"><TextInput value={f.resultadoFinal} onChange={(e) => set("resultadoFinal", e.target.value)} placeholder="0-0" /></Field>
          <Field label="Estado del partido" className="sm:col-span-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: f.cerrado ? "#DCFCE7" : "#FEF3C7", color: f.cerrado ? "#166534" : "#92400E" }}>
                {f.cerrado ? "Cerrado: cuenta en la clasificación y las estadísticas" : "Abierto: no suma puntos ni partidos jugados"}
              </span>
              <Btn variant={f.cerrado ? "ghost" : "accent"} onClick={() => set("cerrado", !f.cerrado)}>{f.cerrado ? "Reabrir partido" : "Cerrar partido"}</Btn>
            </div>
            <div className="text-[11px] mt-1" style={{ color: T.muted }}>Si el partido se suspendió o aún no se jugó, déjalo abierto. Puedes editarlo después de cerrarlo.</div>
          </Field>
        </div>
      )}

      {tab === "convocatoria" && (() => {
        const abierto = !f.cerrado;
        const visibles = abierto ? players.filter(esDisponible) : players;
        const ocultos = abierto ? players.filter((p) => !esDisponible(p)) : [];
        const nConv = f.convocatoria.filter((c) => c.estado === "Convocado" && visibles.some((p) => p.id === c.jugadorId)).length;
        return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="text-xs" style={{ color: T.muted }}>{nConv} jugadores convocados. Toca la ⭐ para marcar al capitán.</div>
            <Btn variant="ghost" icon={Printer} onClick={() => setShowConvocatoriaCard(true)}>Generar convocatoria para compartir</Btn>
          </div>
          {ocultos.length > 0 && (
            <div className="text-xs p-2 rounded-lg" style={{ background: "#FFF6DE", color: "#92400E" }}>
              No disponibles, no aparecen en la convocatoria: {ocultos.map((p) => `${p.apodo || p.nombre} (${p.estado})`).join(", ")}. Cambia su estado en la plantilla cuando vuelvan.
            </div>
          )}
          {visibles.map((p) => {
            const row = f.convocatoria.find((c) => c.jugadorId === p.id);
            const isCap = f.capitanId === p.id;
            const setEstado = (estado) => setF((prev) => ({ ...prev, convocatoria: prev.convocatoria.map((c) => c.jugadorId === p.id ? { ...c, estado } : c) }));
            const opts = [["No convocado", T.muted], ["Convocado", T.green], ["Lesionado", T.yellow], ["Sancionado", T.redLight]];
            return (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg flex-wrap" style={{ background: "#F7F8FA" }}>
                <button onClick={() => set("capitanId", isCap ? null : p.id)} title="Marcar como capitán" className="shrink-0 text-base leading-none">
                  {isCap ? "⭐" : "☆"}
                </button>
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold text-white shrink-0" style={{ background: T.navy }}>{p.numero}</div>
                <div className="text-sm font-bold flex-1 truncate min-w-[80px]" style={{ color: T.navy }}>{p.apodo || p.nombre}{isCap ? " (C)" : ""}</div>
                <div className="flex gap-1 flex-wrap">
                  {opts.map(([label, color]) => (
                    <button key={label} onClick={() => setEstado(label)}
                      className="px-2 py-1 rounded-full text-[10px] font-bold border"
                      style={{ background: row.estado === label ? color : "#fff", color: row.estado === label ? "#fff" : T.muted, borderColor: row.estado === label ? color : T.line }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        );
      })()}

      {tab === "vestimenta" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Camiseta"><TextInput value={f.vestimenta.camiseta} onChange={(e) => setNested("vestimenta", "camiseta", e.target.value)} placeholder="Ej: Rojo" /></Field>
          <Field label="Pantaloneta"><TextInput value={f.vestimenta.pantaloneta} onChange={(e) => setNested("vestimenta", "pantaloneta", e.target.value)} placeholder="Ej: Blanco" /></Field>
          <Field label="Medias"><TextInput value={f.vestimenta.medias} onChange={(e) => setNested("vestimenta", "medias", e.target.value)} placeholder="Ej: Rojo" /></Field>
        </div>
      )}

      {tab === "alineacion" && (
        <div>
          <div className="mb-3 text-sm" style={{ color: T.muted }}>Sistema: <strong style={{ color: T.navy }}>{f.sistema}</strong> ({f.tipoFutbol}). Cambia el sistema en la pestaña Datos para recalcular las posiciones.</div>
          {f.convocatoria.filter((c) => c.estado === "Convocado").length === 0 ? (
            <div className="text-sm p-3 rounded-lg" style={{ color: T.muted, background: "#F7F8FA" }}>Primero marcá jugadores como "Convocado" en la pestaña Convocatoria para poder ubicarlos en la cancha.</div>
          ) : (
            <PitchEditor system={f.sistema} players={players.filter((p) => f.convocatoria.find((c) => c.jugadorId === p.id)?.estado === "Convocado")} lineup={f.alineacion} onChange={(l) => set("alineacion", l)} />
          )}
        </div>
      )}

      {tab === "eventos" && (
        <div className="flex flex-col gap-6">
          <EventTable title="Cambios" rows={f.cambios} players={players}
            cols={[["saleId", "Sale", "player"], ["entraId", "Entra", "player"], ["minuto", "Min.", "text"]]}
            onAdd={() => addRow("cambios", { saleId: "", entraId: "", minuto: "" })}
            onRemove={(id) => removeRow("cambios", id)} onUpdate={(id, k, v) => updateRow("cambios", id, k, v)} />
          <EventTable title="Goles" rows={f.goles} players={players}
            cols={[["minuto", "Min.", "text"], ["jugadorId", "Jugador", "player"], ["asistenciaId", "Asistencia", "player"]]}
            onAdd={() => addRow("goles", { minuto: "", jugadorId: "", asistenciaId: "" })}
            onRemove={(id) => removeRow("goles", id)} onUpdate={(id, k, v) => updateRow("goles", id, k, v)} />
          <EventTable title="Tarjetas e incidencias" rows={f.tarjetas} players={players}
            cols={[["jugadorId", "Jugador", "player"], ["tipo", "Tipo", "cardtype"], ["minuto", "Min.", "text"]]}
            onAdd={() => addRow("tarjetas", { jugadorId: "", tipo: "Amarilla", minuto: "" })}
            onRemove={(id) => removeRow("tarjetas", id)} onUpdate={(id, k, v) => updateRow("tarjetas", id, k, v)} />
        </div>
      )}

      {tab === "tactica" && (
        <div className="flex flex-col gap-3">
          <Field label="Modelo de juego utilizado"><TextArea value={f.tactica.modelo} onChange={(e) => setNested("tactica", "modelo", e.target.value)} /></Field>
          <Field label="Qué funcionó"><TextArea value={f.tactica.funciono} onChange={(e) => setNested("tactica", "funciono", e.target.value)} /></Field>
          <Field label="Qué no funcionó"><TextArea value={f.tactica.noFunciono} onChange={(e) => setNested("tactica", "noFunciono", e.target.value)} /></Field>
          <Field label="Ajustes realizados durante el partido"><TextArea value={f.tactica.ajustes} onChange={(e) => setNested("tactica", "ajustes", e.target.value)} /></Field>
        </div>
      )}

      {tab === "rendimiento" && (
        <div className="flex flex-col gap-4">
          {[["ataque", "Ataque"], ["defensa", "Defensa"], ["transicionOfensiva", "Transición ofensiva"], ["transicionDefensiva", "Transición defensiva"], ["balonParadoOfensivo", "Balón parado ofensivo"], ["balonParadoDefensivo", "Balón parado defensivo"]].map(([k, l]) => (
            <Field key={k} label={`${l} (1-10)`}>
              <input type="range" min="1" max="10" value={f.rendimiento[k]} onChange={(e) => setNested("rendimiento", k, Number(e.target.value))} className="w-full" />
              <div className="text-xs font-bold text-right" style={{ color: T.navy }}>{f.rendimiento[k]}</div>
            </Field>
          ))}
          <Field label="Fortalezas"><TextArea value={f.rendimiento.fortalezas} onChange={(e) => setNested("rendimiento", "fortalezas", e.target.value)} /></Field>
          <Field label="Debilidades"><TextArea value={f.rendimiento.debilidades} onChange={(e) => setNested("rendimiento", "debilidades", e.target.value)} /></Field>

          <div className="pt-3 border-t" style={{ borderColor: T.line }}>
            <Eyebrow>Rendimiento individual (1-10)</Eyebrow>
            <div className="text-xs mb-2" style={{ color: T.muted }}>Se suma a las estadísticas de cada jugador.</div>
            <div className="flex flex-col gap-1.5">
              {players.filter((p) => f.convocatoria.find((c) => c.jugadorId === p.id)?.estado === "Convocado").map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "#F7F8FA" }}>
                  <div className="text-sm font-bold flex-1 truncate" style={{ color: T.navy }}>{p.apodo || p.nombre}</div>
                  <input type="range" min="1" max="10" value={f.valoracionesJugadores[p.id] ?? 5}
                    onChange={(e) => setF((prev) => ({ ...prev, valoracionesJugadores: { ...prev.valoracionesJugadores, [p.id]: Number(e.target.value) } }))}
                    className="w-28" />
                  <span className="text-xs font-extrabold w-5 text-right" style={{ color: T.navy }}>{f.valoracionesJugadores[p.id] ?? 5}</span>
                </div>
              ))}
              {!players.some((p) => f.convocatoria.find((c) => c.jugadorId === p.id)?.estado === "Convocado") && (
                <div className="text-xs" style={{ color: T.muted }}>No hay jugadores convocados todavía.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "aprendizajes" && (
        <div className="flex flex-col gap-3">
          <Field label="Qué debemos mantener"><TextArea value={f.aprendizajes.mantener} onChange={(e) => setNested("aprendizajes", "mantener", e.target.value)} /></Field>
          <Field label="Qué debemos corregir"><TextArea value={f.aprendizajes.corregir} onChange={(e) => setNested("aprendizajes", "corregir", e.target.value)} /></Field>
          <Field label="Qué debemos trabajar en los próximos entrenamientos"><TextArea value={f.aprendizajes.trabajar} onChange={(e) => setNested("aprendizajes", "trabajar", e.target.value)} /></Field>
        </div>
      )}

      {tab === "obs" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Oportunidades falladas"><TextInput type="number" value={f.oportunidadesFalladas ?? ""} onChange={(e) => set("oportunidadesFalladas", e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Tiros a puerta"><TextInput type="number" value={f.tirosPuerta ?? ""} onChange={(e) => set("tirosPuerta", e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Posesión de balón (%)"><TextInput type="number" value={f.posesionBalon ?? ""} onChange={(e) => set("posesionBalon", e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          </div>
          <Field label="Observaciones del entrenador"><TextArea style={{ minHeight: 160 }} value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>
          <Field label="Video del partido (enlace)">
            <TextInput placeholder="https://..." value={f.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
          </Field>
        </div>
      )}

      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="accent" icon={Save} onClick={submit}>Guardar partido</Btn>
        </div>
      </div>
      {showConvocatoriaCard && (
        <ConvocatoriaCardModal match={f} config={config} players={players} onClose={() => setShowConvocatoriaCard(false)} />
      )}
    </Modal>
  );
}

function EventTable({ title, rows, players, cols, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-extrabold" style={{ color: T.navy }}>{title}</div>
        <Btn variant="ghost" icon={Plus} onClick={onAdd}>Añadir</Btn>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2 flex-wrap">
            {cols.map(([key, label, type]) => (
              type === "player" ? (
                <Select key={key} value={r[key]} onChange={(e) => onUpdate(r.id, key, e.target.value)} className="w-auto text-xs py-1">
                  <option value="">{label}</option>
                  {players.map((p) => <option key={p.id} value={p.id}>{p.apodo || p.nombre}</option>)}
                </Select>
              ) : type === "cardtype" ? (
                <Select key={key} value={r[key]} onChange={(e) => onUpdate(r.id, key, e.target.value)} className="w-auto text-xs py-1">
                  <option>Amarilla</option><option>Roja</option><option>Lesión</option><option>Otro</option>
                </Select>
              ) : (
                <TextInput key={key} value={r[key]} onChange={(e) => onUpdate(r.id, key, e.target.value)} placeholder={label} className="w-20 text-xs py-1" />
              )
            ))}
            <button onClick={() => onRemove(r.id)} className="p-1 rounded-lg hover:bg-red-50"><Trash2 size={14} style={{ color: T.redLight }} /></button>
          </div>
        ))}
        {!rows.length && <div className="text-xs" style={{ color: T.muted }}>Sin registros.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   ENTRENAMIENTOS
   ============================================================ */

/* Frases del entrenador: las frases que dice durante la sesión para trabajar el objetivo.
   Las sesiones nuevas las guardan en t.frases; en las antiguas se recuperan de las notas
   (apartado «Correcciones para decir durante la sesión»). */
function frasesDeEntreno(t) {
  if (Array.isArray(t?.frases)) return t.frases.map((x) => String(x || "").trim()).filter(Boolean);
  const n = String(t?.notas || "");
  const i = n.indexOf("Correcciones para decir durante la sesión:");
  if (i < 0) return [];
  const resto = n.slice(i).split("\n").slice(1);
  const out = [];
  for (const linea of resto) {
    const l = linea.trim();
    if (l.startsWith("- ")) out.push(l.slice(2).trim());
    else if (l) break;
  }
  return out.filter(Boolean);
}
// Notas escritas por el entrenador. Las que la plataforma generó sola al traer una sesión
// (repiten título y objetivo) no se imprimen.
function notasPropias(t) {
  const n = String(t?.notas || "").trim();
  if (!n) return "";
  if (/^(Sesión \d+ de las 50 por objetivos|Sistema Tipo · |Sesión \d+: )/.test(n)) return "";
  return n;
}

function printTraining(t, config, players) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const playerName = (id) => { const p = players.find((x) => x.id === id); return p ? (p.apodo || p.nombre) : "?"; };

  const teamSummary = (task) => {
    if (!task.equipos?.length) return "";
    const asign = task.asignaciones || {};
    return task.equipos.map((eq) => `${esc(eq.name)}: ${Object.values(asign).filter((v) => v === eq.id).length}`).join(" · ");
  };

  const taskRow = (task) => `
    <div class="taskRow">
      <div class="taskRowMain">
        <div class="taskRowTitle">${esc(task.nombre) || "(sin nombre)"}${task.tiempo ? ` <span class="taskRowTime">· ${esc(task.tiempo)} min</span>` : ""}</div>
        ${task.objetivo ? `<div class="taskRowLine"><b>Obj:</b> ${esc(task.objetivo)}</div>` : ""}
        ${task.materiales ? `<div class="taskRowLine"><b>Materiales:</b> ${esc(task.materiales)}</div>` : ""}
        ${task.descripcion ? `<div class="taskRowLine">${esc(task.descripcion)}</div>` : ""}
        ${teamSummary(task) ? `<div class="taskRowLine taskTeams">🎽 ${teamSummary(task)}</div>` : ""}
      </div>
      ${imgImpresion(task, "taskRowImg")}
    </div>`;

  const section = (title, color, timeLabel, tasksArr) => {
    if (!tasksArr?.length) return "";
    return `<div class="section">
      <div class="sectionTitle" style="background:${color};">${esc(title)}${timeLabel ? ` <span class="sectionTime">(${esc(timeLabel)} min)</span>` : ""}</div>
      ${tasksArr.map(taskRow).join("")}
    </div>`;
  };

  const objBlock = (label, value, color) => value ? `<div class="objItem"><div class="objLabel" style="color:${color};">${esc(label)}</div><div class="objText">${esc(value)}</div></div>` : "";
  const objetivosHtml = [
    objBlock("Físico", t.objetivos?.fisicos, "#2A9D5C"),
    objBlock("Técnico", t.objetivos?.tecnicos, "#1E5FAF"),
    objBlock("Táctico", t.objetivos?.tacticos, "#0B1F3A"),
    objBlock("Estratégico", t.objetivos?.estrategicos, "#7C3AED"),
    objBlock("Psicológico", t.objetivos?.psicologicos, "#B7791F"),
  ].join("");
  const frases = frasesDeEntreno(t);
  const notasEntrenador = notasPropias(t);

  const asistCount = { asiste: 0, noAsiste: 0, lesionado: 0 };
  (t.asistencia || []).forEach((a) => {
    if (a.estado === "Asiste") asistCount.asiste++;
    else if (a.estado === "Lesionado") asistCount.lesionado++;
    else asistCount.noAsiste++;
  });

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sesión de entrenamiento</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 16px 20px 18px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .header { display: flex; align-items: center; gap: 10px; border-bottom: 3px solid #0B1F3A; padding-bottom: 8px; margin-bottom: 10px; }
    .header img { width: 40px; height: 40px; object-fit: contain; border-radius: 10px; }
    .headerInfo { flex: 1; }
    .teamName { font-size: 14px; font-weight: 800; color: #0B1F3A; }
    .teamMeta { font-size: 9.5px; color: #64748B; margin-top: 1px; }
    .headerRight { text-align: right; }
    .headerRight .big { font-size: 15px; font-weight: 900; color: #E63946; text-transform: uppercase; }
    .headerRight .small { font-size: 9.5px; color: #64748B; }
    .infoBar { display: flex; flex-wrap: wrap; gap: 6px 16px; background: #F5F7FA; border-radius: 10px; padding: 6px 12px; margin-bottom: 10px; font-size: 10px; }
    .infoBar span b { color: #0B1F3A; }
    .bloque { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px 12px 9px; margin-bottom: 10px; page-break-inside: avoid; }
    .bloqueTitulo { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #0B1F3A; margin-bottom: 7px; padding-bottom: 5px; border-bottom: 1px solid #E2E8F0; }
    .bloqueTitulo::before { content: ""; width: 4px; height: 12px; border-radius: 2px; background: #E63946; }
    .objGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 18px; }
    .objItem { min-width: 0; }
    .objLabel { font-size: 8.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
    .objText { font-size: 9.5px; color: #1B2733; line-height: 1.35; text-align: justify; }
    .asistRow { display: flex; gap: 16px; font-size: 10px; margin-top: 7px; padding-top: 6px; border-top: 1px dashed #E2E8F0; }
    .asistRow span { font-weight: 800; }
    .asistGrid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px 6px; }
    .frases { margin: 0; padding-left: 16px; font-size: 9.5px; line-height: 1.45; color: #1B2733; }
    .frases li { text-align: justify; margin-bottom: 2px; }
    .asistItem { font-size: 9px; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .section { margin-bottom: 8px; }
    .sectionTitle { break-after: avoid; page-break-after: avoid; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fff; padding: 3px 10px; border-radius: 999px; display: table; margin-bottom: 4px; letter-spacing: 0.3px; }
    .sectionTime { font-weight: 600; opacity: 0.85; }
    .taskRow { display: flex; gap: 8px; align-items: flex-start; background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 5px 8px; margin-bottom: 4px; page-break-inside: avoid; }
    .taskRowMain { flex: 1; min-width: 0; }
    .taskRowTitle { font-size: 10.5px; font-weight: 800; color: #0B1F3A; }
    .taskRowTime { font-weight: 600; color: #64748B; }
    .taskRowLine { font-size: 9.5px; color: #334155; line-height: 1.3; text-align: justify; }
    .taskTeams { color: #E63946; font-weight: 700; }
    .taskRowImg { width: 195px; height: 130px; object-fit: contain; background: #fff; border-radius: 8px; border: 1px solid #E2E8F0; flex-shrink: 0; }
    ${LEYENDA_CSS}
    .notes { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; font-size: 9.5px; margin-top: 6px; page-break-inside: avoid; text-align: justify; white-space: pre-line; }
    .footer { margin-top: 10px; text-align: center; font-size: 8.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 6px; }
    #pageFit { width: 190mm; margin: 0 auto; }
    @media print {
      html, body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
      #pageFit { width: 100%; }
      body { padding: 0; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div id="pageFit">
    <div class="sheet">
      <div class="header">
        ${config.logo ? `<img src="${config.logo}" />` : ""}
        <div class="headerInfo">
          <div class="teamName">${esc(config.teamName || "Equipo")}</div>
          <div class="teamMeta">${esc(config.category || "")}${config.category && config.season ? " · " : ""}${esc(config.season || "")}</div>
        </div>
        <div class="headerRight">
          <div class="big">Sesión de entrenamiento${t.numeroSesion ? ` Nº ${esc(t.numeroSesion)}` : ""}</div>
          <div class="small">${esc(t.fecha)} · ${esc(t.hora)}</div>
        </div>
      </div>

      <div class="infoBar">
        <span><b>Lugar:</b> ${esc(t.lugar) || "—"}</span>
        <span><b>Duración:</b> ${esc(t.duracion)} min</span>
        <span><b>Jugadores disponibles:</b> ${esc(t.numJugadores)}</span>
      </div>


      ${objetivosHtml ? `<div class="bloque">
        <div class="bloqueTitulo">Objetivos de la sesión</div>
        <div class="objGrid">${objetivosHtml}</div>
      </div>` : ""}

      ${(t.asistencia || []).length ? `<div class="bloque">
        <div class="bloqueTitulo">Asistencia</div>
        <div class="asistGrid">
          ${(t.asistencia || []).map((a) => {
            const nombre = playerName(a.jugadorId);
            const icon = a.estado === "Asiste" ? { s: "✓", c: "#2A9D5C" } : a.estado === "Lesionado" ? { s: "✚", c: "#F4B400" } : { s: "✗", c: "#E63946" };
            return `<div class="asistItem"><span style="color:${icon.c}; font-weight:800;">${icon.s}</span> ${esc(nombre)}</div>`;
          }).join("")}
        </div>
        <div class="asistRow">
          <span style="color:#2A9D5C;">✓ Asiste: ${asistCount.asiste}</span>
          <span style="color:#E63946;">✗ No asiste: ${asistCount.noAsiste}</span>
          <span style="color:#B7791F;">✚ Lesionado: ${asistCount.lesionado}</span>
        </div>
      </div>` : ""}

      ${section("Calentamiento", "#F4B400", t.calentamiento?.tiempo, t.calentamiento?.tareas)}
      ${section("Parte principal", "#0B1F3A", null, t.tareas)}
      ${section("Partido condicionado y juego real", "#E63946", t.aplicacionJuego?.tiempo, t.aplicacionJuego?.tareas)}
      ${section("Vuelta a la calma", "#2A9D5C", t.vueltaCalma?.tiempo, t.vueltaCalma?.tareas)}
      ${section("Balón parado", "#94A3B8", null, t.vueltaCalma?.balonParado)}

      ${frases.length ? `<div class="bloque frasesBloque">
        <div class="bloqueTitulo">Frases del entrenador</div>
        <ul class="frases">${frases.map((x) => `<li>«${esc(x)}»</li>`).join("")}</ul>
      </div>` : ""}
      ${notasEntrenador ? `<div class="notes"><b>Notas del entrenador:</b> ${esc(notasEntrenador)}</div>` : ""}
      ${[...(t.calentamiento?.tareas || []), ...(t.tareas || []), ...(t.aplicacionJuego?.tareas || []), ...(t.vueltaCalma?.tareas || [])].some((x) => imagenDe(x)) ? LEYENDA_HTML : ""}
      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html, { flujo: 0.78 })); w.document.close(); }
}

function Entrenamientos({ ctx }) {
  const { trainingsTodas: trainings, updateTrainings, players, config } = ctx;
  const [openId, setOpenId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showTraer, setShowTraer] = useState(false);
  const [showObjetivos, setShowObjetivos] = useState(false);
  useEffect(() => {
    if (ctx.deepLink?.type === "entrenamiento") { setOpenId(ctx.deepLink.id); ctx.clearDeepLink(); }
  }, [ctx.deepLink]);
  const sorted = [...trainings].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const editing = trainings.find((t) => t.id === openId);
  // Sesiones ya traídas del Sistema Tipo (para avisar antes de duplicar por error)
  const traidosST = new Set(trainings.filter((t) => t.origenSistemaTipo).map((t) => `${t.origenSistemaTipo.guia}:S${t.origenSistemaTipo.sesion}`));
  // Se crea una copia editable y se abre al instante para que añadas tus tareas.
  const traidosOBJ = new Set(trainings.filter((t) => t.origenObjetivos).map((t) => t.origenObjetivos.sesion));
  const traerObjetivos = (sesion, tareas, bloqueNombre) => {
    const t = sesionDesdeObjetivos(sesion, tareas, players, bloqueNombre);
    updateTrainings((prev) => [...prev, t]);
    setShowObjetivos(false); setOpenId(t.id);
  };
  const traerSesionST = (a) => {
    const t = sesionDesdeST(a.guia, a.semana, a.sesion, a.indice, a.cal, players);
    updateTrainings((prev) => [...prev, t]);
    setShowTraer(false);
    setOpenId(t.id);
    return "";
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Eyebrow>Entrenamientos</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{trainings.length} sesiones registradas</h1></div>
        <div className="flex gap-2 flex-wrap"><Btn icon={Target} variant="ghost" onClick={() => setShowObjetivos(true)}>Traer de las 50 por objetivos</Btn><Btn icon={BookOpen} variant="ghost" onClick={() => setShowTraer(true)}>Traer sesión del Sistema Tipo</Btn><Btn icon={Plus} variant="accent" onClick={() => setShowNew(true)}>Nueva sesión</Btn></div>
      </div>

      <div className="flex flex-col gap-2.5">
        {sorted.map((t) => (
          <Card key={t.id} className="p-4 cursor-pointer hover:shadow-md transition relative" onClick={() => setOpenId(t.id)}>
            <div className="absolute top-3 right-3 flex gap-1 z-10">
              <button onClick={(e) => { e.stopPropagation(); printTraining(t, config, players); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Imprimir / PDF">
                <Printer size={14} style={{ color: T.muted }} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setOpenId(t.id); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                <Edit3 size={14} style={{ color: T.muted }} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm("¿Eliminar esta sesión?")) updateTrainings((prev) => prev.filter((x) => x.id !== t.id)); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                <Trash2 size={14} style={{ color: T.redLight }} />
              </button>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 pr-24">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 rounded-full" style={{ background: T.green }} />
                <div>
                  <div className="font-extrabold" style={{ color: T.navy }}>{sessionDisplayName(t)}</div>
                  <div className="text-xs" style={{ color: T.muted }}>{t.fecha} · {t.hora} · {t.lugar} · {t.duracion} min</div>
                </div>
              </div>
              <Pill>{t.tareas?.length || 0} tareas</Pill>
            </div>
          </Card>
        ))}
        {!sorted.length && <div className="text-sm" style={{ color: T.muted }}>Todavía no hay sesiones registradas.</div>}
      </div>

      {showTraer && <SistemaTipoModal modo="sesion" onClose={() => setShowTraer(false)} onTraer={traerSesionST} traidos={traidosST} />}
      {showObjetivos && <SesionesObjetivosModal onClose={() => setShowObjetivos(false)} onTraer={traerObjetivos} traidos={traidosOBJ} />}
      {showNew && <TrainingForm ctx={ctx} onClose={() => setShowNew(false)} onSave={(t) => { updateTrainings((prev) => [...prev, t]); setShowNew(false); }} />}
      {editing && <TrainingForm ctx={ctx} initial={editing}
        onClose={() => setOpenId(null)}
        onSave={(t) => { updateTrainings((prev) => prev.map((x) => x.id === t.id ? t : x)); setOpenId(null); }}
        onDelete={() => { if (confirm("¿Eliminar esta sesión?")) { updateTrainings((prev) => prev.filter((x) => x.id !== editing.id)); setOpenId(null); } }} />}
    </div>
  );
}

function blankLibTask() {
  return { id: uid(), libraryTaskId: null, nombre: "", codigo: "", objetivo: "", fundamento: "", materiales: "", tiempo: 15, jugadores: "", espacio: "", reglas: "", organizacion: "", descripcion: "", notas: "", imagen: "" };
}
function libTaskFromLibrary(t) {
  return { id: uid(), libraryTaskId: t.id, nombre: t.nombre, codigo: t.codigo, objetivo: t.objTactico || t.objTecnico, fundamento: t.objTecnico, materiales: t.materiales, tiempo: t.duracion, jugadores: t.minJugadores, espacio: t.espacio, reglas: t.reglas, organizacion: "", descripcion: t.descripcion, notas: "", imagen: t.imagen || "", graficoTactico: t.graficoTactico || null };
}
function computeTaskUsageCounts(trainings) {
  const counts = {};
  (trainings || []).forEach((tr) => {
    const arrays = [tr.calentamiento?.tareas, tr.tareas, tr.aplicacionJuego?.tareas, tr.vueltaCalma?.tareas, tr.vueltaCalma?.balonParado];
    arrays.forEach((arr) => (arr || []).forEach((item) => {
      if (item.libraryTaskId) counts[item.libraryTaskId] = (counts[item.libraryTaskId] || 0) + 1;
    }));
  });
  return counts;
}

const TEAM_PRESETS = [
  { id: "eq0", name: "Peto rojo", color: "#E63946" },
  { id: "eq1", name: "Peto azul", color: "#1E3A8A" },
  { id: "eq2", name: "Sin peto", color: "#94A3B8" },
  { id: "eq3", name: "Peto verde", color: "#2A9D5C" },
];

/* Panel de asignación de equipos/petos, independiente por cada tarea */
function TeamAssignPanel({ task, attendingPlayers, onUpdate }) {
  const equipos = task.equipos || [];
  const asign = task.asignaciones || {};
  const setTeamCount = (n) => {
    const teams = TEAM_PRESETS.slice(0, n);
    onUpdate("equipos", teams);
    const validIds = teams.map((t) => t.id);
    const cleaned = {};
    Object.entries(asign).forEach(([pid, eid]) => { if (validIds.includes(eid)) cleaned[pid] = eid; });
    onUpdate("asignaciones", cleaned);
  };
  const assign = (playerId, teamId) => onUpdate("asignaciones", { ...asign, [playerId]: asign[playerId] === teamId ? undefined : teamId });
  const autoDistribute = () => {
    if (!equipos.length) return;
    const shuffled = [...attendingPlayers].sort(() => Math.random() - 0.5);
    const newAsign = {};
    shuffled.forEach((p, i) => { newAsign[p.id] = equipos[i % equipos.length].id; });
    onUpdate("asignaciones", newAsign);
  };
  return (
    <div className="mt-2 p-2.5 rounded-lg" style={{ background: "#fff", border: `1px solid ${T.line}` }}>
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className="text-[10px] font-bold" style={{ color: T.muted }}>Nº de equipos:</span>
        {[2, 3, 4].map((n) => (
          <button key={n} onClick={() => setTeamCount(n)} className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
            style={{ background: equipos.length === n ? T.navy : "#fff", color: equipos.length === n ? "#fff" : T.muted, borderColor: equipos.length === n ? T.navy : T.line }}>
            {n}
          </button>
        ))}
        {equipos.length > 0 && (
          <button onClick={autoDistribute} className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ borderColor: T.line, color: T.muted }}>
            🔀 Repartir automático
          </button>
        )}
      </div>
      {equipos.length > 0 && attendingPlayers.length > 0 && (
        <div className="flex flex-col gap-1">
          {attendingPlayers.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <span className="text-[11px] truncate flex-1" style={{ color: T.text }}>{p.apodo || p.nombre}</span>
              <div className="flex gap-1">
                {equipos.map((eq) => (
                  <button key={eq.id} onClick={() => assign(p.id, eq.id)} title={eq.name}
                    className="w-5 h-5 rounded-full border-2"
                    style={{ background: asign[p.id] === eq.id ? eq.color : "#fff", borderColor: eq.color }} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2.5 flex-wrap mt-1.5 pt-1.5 border-t" style={{ borderColor: T.line }}>
            {equipos.map((eq) => (
              <span key={eq.id} className="text-[9.5px] flex items-center gap-1" style={{ color: T.muted }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: eq.color }} />
                {eq.name}: {Object.values(asign).filter((v) => v === eq.id).length}
              </span>
            ))}
          </div>
        </div>
      )}
      {!equipos.length && <div className="text-[10px]" style={{ color: T.muted }}>Elige el número de equipos para repartir petos en esta tarea.</div>}
      {equipos.length > 0 && attendingPlayers.length === 0 && (
        <div className="text-[10px]" style={{ color: T.redLight }}>No hay jugadores marcados como "Asiste" todavía (pestaña Asistencia).</div>
      )}
    </div>
  );
}

function TaskPickerModal({ library, usageCounts, onSelect, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [tipo, setTipo] = useState("Todos");
  const categorias = useMemo(() => ["Todas", ...Array.from(new Set(library.map((t) => t.categoria).filter(Boolean)))], [library]);
  const tipos = useMemo(() => ["Todos", ...Array.from(new Set(library.map((t) => t.tipoTarea).filter(Boolean)))], [library]);

  const results = useMemo(() => {
    let list = library;
    if (cat !== "Todas") list = list.filter((t) => t.categoria === cat);
    if (tipo !== "Todos") list = list.filter((t) => t.tipoTarea === tipo);
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((t) => (t.nombre || "").toLowerCase().includes(query) || (t.codigo || "").toLowerCase().includes(query));
    }
    // Sin búsqueda: ordenar por más utilizadas primero
    return [...list].sort((a, b) => {
      const ua = usageCounts[a.id] || 0, ub = usageCounts[b.id] || 0;
      if (ub !== ua) return ub - ua;
      return (a.nombre || "").localeCompare(b.nombre || "");
    });
  }, [library, cat, tipo, q, usageCounts]);

  return (
    <Modal title="Añadir desde biblioteca de tareas" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <TextInput autoFocus placeholder="Buscar por nombre o código..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="text-xs w-auto shrink-0">
            {categorias.map((c) => <option key={c} value={c}>{c === "Todas" ? "Todas las categorías" : c}</option>)}
          </Select>
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)} className="text-xs w-auto shrink-0">
            {tipos.map((t) => <option key={t} value={t}>{t === "Todos" ? "Todos los tipos" : t}</option>)}
          </Select>
        </div>
        {!q.trim() && <div className="text-[11px] font-bold uppercase" style={{ color: T.muted }}>⭐ Más utilizadas</div>}
        <div className="flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto">
          {results.map((t) => (
            <button key={t.id} onClick={() => onSelect(t.id)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl text-left hover:bg-slate-50 border" style={{ borderColor: T.line }}>
              {imagenDe(t) && <img src={imagenDe(t)} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate" style={{ color: T.navy }}>{t.nombre}</div>
                <div className="text-[10px]" style={{ color: T.muted }}>{t.codigo} · {t.categoria}{t.tipoTarea ? ` · ${t.tipoTarea}` : ""}</div>
              </div>
              {usageCounts[t.id] > 0 && <Pill>{usageCounts[t.id]}x usada</Pill>}
            </button>
          ))}
          {!results.length && <div className="text-xs text-center py-4" style={{ color: T.muted }}>No se encontraron tareas con esos filtros.</div>}
        </div>
      </div>
    </Modal>
  );
}

/* Pequeño listado reutilizable de tareas: "+ añadir desde biblioteca" + "tarea en blanco" + tarjetas editables */
function TaskMiniList({ items, library, attendingPlayers, usageCounts, onAddFromLibrary, onAddBlank, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Btn variant="ghost" icon={Search} onClick={() => setShowPicker(true)}>+ Añadir desde biblioteca de tareas</Btn>
        <Btn variant="ghost" icon={Plus} onClick={onAddBlank}>Tarea en blanco</Btn>
      </div>
      {showPicker && (
        <TaskPickerModal
          library={library}
          usageCounts={usageCounts || {}}
          onClose={() => setShowPicker(false)}
          onSelect={(id) => { onAddFromLibrary(id); setShowPicker(false); }}
        />
      )}
      {items.map((t) => (
        <Card key={t.id} className="p-3" style={{ background: "#F7F8FA" }}>
          <div className="flex justify-end"><button onClick={() => onRemove(t.id)}><Trash2 size={14} style={{ color: T.redLight }} /></button></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <TextInput placeholder="Nombre" value={t.nombre} onChange={(e) => onUpdate(t.id, "nombre", e.target.value)} className="text-xs" />
            <TextInput placeholder="Código" value={t.codigo} onChange={(e) => onUpdate(t.id, "codigo", e.target.value)} className="text-xs" />
            <TextInput placeholder="Objetivo" value={t.objetivo} onChange={(e) => onUpdate(t.id, "objetivo", e.target.value)} className="text-xs" />
            <TextInput placeholder="Materiales" value={t.materiales} onChange={(e) => onUpdate(t.id, "materiales", e.target.value)} className="text-xs" />
            <TextInput placeholder="Tiempo (min)" type="number" value={t.tiempo} onChange={(e) => onUpdate(t.id, "tiempo", e.target.value)} className="text-xs" />
            <TextInput placeholder="Nº jugadores" value={t.jugadores} onChange={(e) => onUpdate(t.id, "jugadores", e.target.value)} className="text-xs" />
          </div>
          <TextArea placeholder="Descripción / notas" value={t.descripcion} onChange={(e) => onUpdate(t.id, "descripcion", e.target.value)} className="text-xs mt-2" />
          {attendingPlayers && (
            <div className="mt-2">
              <button onClick={() => setExpanded((p) => ({ ...p, [t.id]: !p[t.id] }))}
                className="text-[11px] font-bold flex items-center gap-1" style={{ color: T.navy }}>
                🎽 Equipos / petos {t.equipos?.length ? `(${t.equipos.length})` : ""} {expanded[t.id] ? "▲" : "▼"}
              </button>
              {expanded[t.id] && (
                <TeamAssignPanel task={t} attendingPlayers={attendingPlayers} onUpdate={(k, v) => onUpdate(t.id, k, v)} />
              )}
            </div>
          )}
        </Card>
      ))}
      {!items.length && <div className="text-xs" style={{ color: T.muted }}>Todavía no hay tareas añadidas.</div>}
    </div>
  );
}

const STOPWORDS = new Set(["de", "la", "el", "en", "y", "a", "los", "las", "del", "un", "una", "con", "para", "por", "que", "se"]);
function keywordScore(text, target) {
  const words = (text || "").toLowerCase().split(/[^a-záéíóúñ0-9]+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  const targetLower = (target || "").toLowerCase();
  return words.reduce((acc, w) => acc + (targetLower.includes(w) ? 1 : 0), 0);
}
function recommendTasksForObjectives(objetivos, tasks) {
  const map = [["fisicos", "objFisico"], ["tecnicos", "objTecnico"], ["tacticos", "objTactico"], ["psicologicos", "objPsicologico"]];
  const active = map.filter(([k]) => (objetivos[k] || "").trim().length > 0);
  if (!active.length) return [];
  const scored = [];
  const seen = new Set();
  for (const t of tasks) {
    let score = 0;
    let matches = 0;
    for (const [ok, field] of active) {
      if ((t[field] || "").trim()) {
        matches++;
        score += 1 + keywordScore(objetivos[ok], t[field]) + keywordScore(objetivos[ok], t.descripcion);
      }
    }
    if (matches > 0 && !seen.has(t.id)) { scored.push({ t, score }); seen.add(t.id); }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((s) => s.t);
}

function ObjectiveRecommendations({ objetivos, library, onAdd, label }) {
  const recommended = useMemo(() => recommendTasksForObjectives(objetivos, library), [objetivos, library]);
  if (!recommended.length) return null;
  return (
    <Card className="p-3" style={{ background: "#FCEAEC", borderColor: "#F6C6CB" }}>
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} style={{ color: T.red }} />
        <div className="text-xs font-extrabold" style={{ color: T.red }}>{label || "Sugerencias de la biblioteca de tareas, según tus objetivos"}</div>
      </div>
      <div className="flex flex-col gap-2">
        {recommended.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white">
            <div className="min-w-0">
              <div className="text-xs font-bold truncate" style={{ color: T.navy }}>{t.nombre}</div>
              <div className="text-[10px]" style={{ color: T.muted }}>{t.codigo} · {t.categoria}</div>
            </div>
            <Btn variant="ghost" icon={Plus} onClick={() => onAdd(t.id)}>Añadir</Btn>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TrainingForm({ ctx, initial, onClose, onSave, onDelete }) {
  const { players, tasks, config } = ctx;
  const blank = {
    id: uid(), numeroSesion: "", semana: "", fecha: todayISO(), hora: "19:00", lugar: "", duracion: 90, numJugadores: players.length,
    objetivos: { fisicos: "", tecnicos: "", tacticos: "", estrategicos: "", psicologicos: "" },
    calentamiento: { tareas: [], actividad: "", objetivo: "", materiales: "", tiempo: 15, notas: "" },
    tareas: [],
    aplicacionJuego: { tareas: [], tipo: "Partido condicionado", objetivo: "", tiempo: 20, observaciones: "" },
    vueltaCalma: { tareas: [], estiramientos: "", actividad: "", tiempo: 10, observaciones: "", balonParado: [] },
    notas: "",
    asistencia: asistenciaInicial(players),
  };
  const [f, setF] = useState(initial ? {
    ...blank, ...initial,
    objetivos: { ...blank.objetivos, ...(initial.objetivos || {}) },
    calentamiento: { ...blank.calentamiento, ...(initial.calentamiento || {}), tareas: initial.calentamiento?.tareas || [] },
    aplicacionJuego: { ...blank.aplicacionJuego, ...(initial.aplicacionJuego || {}), tareas: initial.aplicacionJuego?.tareas || [] },
    vueltaCalma: { ...blank.vueltaCalma, ...(initial.vueltaCalma || {}), tareas: initial.vueltaCalma?.tareas || [], balonParado: initial.vueltaCalma?.balonParado || [] },
    asistencia: players.map((p) => {
      const found = initial.asistencia?.find((a) => a.jugadorId === p.id);
      let estado = found?.estado || estadoAsistencia(p);
      if (estado === "Presente") estado = "Asiste";
      if (estado === "Asiste" && !esDisponible(p) && (initial.fecha || "") >= todayISO()) estado = estadoAsistencia(p);
      if (estado === "Ausente justificado" || estado === "Ausente no justificado") estado = "No asiste";
      return { jugadorId: p.id, estado };
    }),
  } : blank);
  const [tab, setTab] = useState("info");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setNested = (k, kk, v) => setF((p) => ({ ...p, [k]: { ...p[k], [kk]: v } }));

  // El número de jugadores disponibles se calcula automáticamente según la asistencia
  useEffect(() => {
    const count = f.asistencia.filter((a) => a.estado === "Asiste").length;
    setF((p) => (p.numJugadores === count ? p : { ...p, numJugadores: count }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.asistencia]);

  const addTaskFromLibrary = (taskId) => {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    setF((p) => ({ ...p, tareas: [...p.tareas, libTaskFromLibrary(t)] }));
  };
  const addBlankTask = () => setF((p) => ({ ...p, tareas: [...p.tareas, blankLibTask()] }));
  const updateTask = (id, k, v) => setF((p) => ({ ...p, tareas: p.tareas.map((t) => t.id === id ? { ...t, [k]: v } : t) }));
  const removeTask = (id) => setF((p) => ({ ...p, tareas: p.tareas.filter((t) => t.id !== id) }));

  // Helpers genéricos para los bloques anidados (calentamiento, juego, vuelta a la calma, balón parado)
  const blockAddFromLibrary = (blockKey, subKey, taskId) => {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    setF((p) => ({ ...p, [blockKey]: { ...p[blockKey], [subKey]: [...(p[blockKey][subKey] || []), libTaskFromLibrary(t)] } }));
  };
  const blockAddBlank = (blockKey, subKey) => setF((p) => ({ ...p, [blockKey]: { ...p[blockKey], [subKey]: [...(p[blockKey][subKey] || []), blankLibTask()] } }));
  const blockUpdate = (blockKey, subKey, id, k, v) => setF((p) => ({ ...p, [blockKey]: { ...p[blockKey], [subKey]: p[blockKey][subKey].map((t) => t.id === id ? { ...t, [k]: v } : t) } }));
  const blockRemove = (blockKey, subKey, id) => setF((p) => ({ ...p, [blockKey]: { ...p[blockKey], [subKey]: p[blockKey][subKey].filter((t) => t.id !== id) } }));

  const libByCategoria = (categoria) => {
    const filtered = tasks.filter((t) => t.categoria === categoria);
    return filtered.length ? filtered : tasks;
  };
  const libByTipoTarea = (...tipos) => {
    const filtered = tasks.filter((t) => tipos.includes(t.tipoTarea));
    return filtered.length ? filtered : tasks;
  };

  const recommended = useMemo(() => recommendTasksForObjectives(f.objetivos, tasks), [f.objetivos, tasks]);
  const usageCounts = useMemo(() => computeTaskUsageCounts(ctx.trainings), [ctx.trainings]);
  const attendingPlayers = useMemo(() => {
    const asisteIds = new Set(f.asistencia.filter((a) => a.estado === "Asiste").map((a) => a.jugadorId));
    return players.filter((p) => asisteIds.has(p.id));
  }, [players, f.asistencia]);

  const tabs = [["info", "Información"], ["asistencia", "Asistencia"], ["objetivos", "Objetivos"], ["calentamiento", "Calentamiento"], ["tareas", "Parte principal"], ["juego", "Partido condicionado y juego real"], ["calma", "Vuelta a la calma"]];

  return (
    <Modal title={initial ? "Editar sesión" : "Nueva sesión de entrenamiento"} onClose={onClose} wide>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}` }}>{l}</button>
        ))}
      </div>

      {tab === "info" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Número de sesión"><TextInput value={f.numeroSesion} onChange={(e) => set("numeroSesion", e.target.value)} placeholder="Ej: 24" /></Field>
          <Field label="Semana"><TextInput value={f.semana} onChange={(e) => set("semana", e.target.value)} placeholder="Ej: 4" /></Field>
          <Field label="Fecha"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
          <Field label="Hora"><TextInput type="time" value={f.hora} onChange={(e) => set("hora", e.target.value)} /></Field>
          <Field label="Lugar"><TextInput value={f.lugar} onChange={(e) => set("lugar", e.target.value)} /></Field>
          <Field label="Duración (min)"><TextInput type="number" value={f.duracion} onChange={(e) => set("duracion", Number(e.target.value))} /></Field>
          <Field label="Número de jugadores disponibles" className="sm:col-span-2">
            <TextInput type="number" value={f.numJugadores} disabled className="opacity-70" />
            <div className="text-[11px] mt-1" style={{ color: T.muted }}>Se calcula automáticamente según la pestaña "Asistencia". El nombre de la sesión se arma solo, según los objetivos que cargues.</div>
          </Field>
        </div>
      )}

      {tab === "objetivos" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Físicos"><TextArea value={f.objetivos.fisicos} onChange={(e) => setNested("objetivos", "fisicos", e.target.value)} /></Field>
            <Field label="Técnicos"><TextArea value={f.objetivos.tecnicos} onChange={(e) => setNested("objetivos", "tecnicos", e.target.value)} /></Field>
            <Field label="Tácticos"><TextArea value={f.objetivos.tacticos} onChange={(e) => setNested("objetivos", "tacticos", e.target.value)} /></Field>
            <Field label="Estratégicos"><TextArea value={f.objetivos.estrategicos} onChange={(e) => setNested("objetivos", "estrategicos", e.target.value)} /></Field>
            <Field label="Psicológicos"><TextArea value={f.objetivos.psicologicos} onChange={(e) => setNested("objetivos", "psicologicos", e.target.value)} /></Field>
          </div>
          <ObjectiveRecommendations objetivos={f.objetivos} library={tasks} onAdd={addTaskFromLibrary}
            label="Sugerencias generales de la biblioteca de tareas — se añaden a Parte principal" />
        </div>
      )}

      {tab === "calentamiento" && (
        <div className="flex flex-col gap-4">
          <ObjectiveRecommendations objetivos={f.objetivos} library={libByCategoria("Calentamiento")}
            onAdd={(id) => blockAddFromLibrary("calentamiento", "tareas", id)}
            label="Sugerencias para el Calentamiento, según tus objetivos" />
          <TaskMiniList
            items={f.calentamiento.tareas}
            library={libByCategoria("Calentamiento")}
            attendingPlayers={attendingPlayers}
            usageCounts={usageCounts}
            onAddFromLibrary={(id) => blockAddFromLibrary("calentamiento", "tareas", id)}
            onAddBlank={() => blockAddBlank("calentamiento", "tareas")}
            onUpdate={(id, k, v) => blockUpdate("calentamiento", "tareas", id, k, v)}
            onRemove={(id) => blockRemove("calentamiento", "tareas", id)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Actividad (manual, opcional)"><TextInput value={f.calentamiento.actividad} onChange={(e) => setNested("calentamiento", "actividad", e.target.value)} /></Field>
            <Field label="Objetivo"><TextInput value={f.calentamiento.objetivo} onChange={(e) => setNested("calentamiento", "objetivo", e.target.value)} /></Field>
            <Field label="Materiales"><TextInput value={f.calentamiento.materiales} onChange={(e) => setNested("calentamiento", "materiales", e.target.value)} /></Field>
            <Field label="Tiempo (min)"><TextInput type="number" value={f.calentamiento.tiempo} onChange={(e) => setNested("calentamiento", "tiempo", Number(e.target.value))} /></Field>
            <Field label="Notas / observaciones" className="sm:col-span-2"><TextArea value={f.calentamiento.notas} onChange={(e) => setNested("calentamiento", "notas", e.target.value)} /></Field>
          </div>
        </div>
      )}

      {tab === "tareas" && (
        <div className="flex flex-col gap-4">
          <ObjectiveRecommendations objetivos={f.objetivos} library={tasks} onAdd={addTaskFromLibrary}
            label="Sugerencias para la Parte principal, según tus objetivos" />
          <TaskMiniList
            items={f.tareas}
            library={tasks}
            attendingPlayers={attendingPlayers}
            usageCounts={usageCounts}
            onAddFromLibrary={addTaskFromLibrary}
            onAddBlank={addBlankTask}
            onUpdate={updateTask}
            onRemove={removeTask}
          />
        </div>
      )}

      {tab === "juego" && (
        <div className="flex flex-col gap-4">
          <ObjectiveRecommendations objetivos={f.objetivos} library={libByTipoTarea("Partidos condicionados", "Juego real")}
            onAdd={(id) => blockAddFromLibrary("aplicacionJuego", "tareas", id)}
            label="Sugerencias para Partido condicionado y juego real, según tus objetivos" />
          <TaskMiniList
            items={f.aplicacionJuego.tareas}
            library={libByTipoTarea("Partidos condicionados", "Juego real")}
            attendingPlayers={attendingPlayers}
            usageCounts={usageCounts}
            onAddFromLibrary={(id) => blockAddFromLibrary("aplicacionJuego", "tareas", id)}
            onAddBlank={() => blockAddBlank("aplicacionJuego", "tareas")}
            onUpdate={(id, k, v) => blockUpdate("aplicacionJuego", "tareas", id, k, v)}
            onRemove={(id) => blockRemove("aplicacionJuego", "tareas", id)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={f.aplicacionJuego.tipo} onChange={(e) => setNested("aplicacionJuego", "tipo", e.target.value)}>
                <option>Partido condicionado</option><option>Juego real</option><option>Juego reducido</option><option>Situación táctica</option>
              </Select>
            </Field>
            <Field label="Tiempo (min)"><TextInput type="number" value={f.aplicacionJuego.tiempo} onChange={(e) => setNested("aplicacionJuego", "tiempo", Number(e.target.value))} /></Field>
            <Field label="Objetivo" className="sm:col-span-2"><TextInput value={f.aplicacionJuego.objetivo} onChange={(e) => setNested("aplicacionJuego", "objetivo", e.target.value)} /></Field>
            <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.aplicacionJuego.observaciones} onChange={(e) => setNested("aplicacionJuego", "observaciones", e.target.value)} /></Field>
          </div>
        </div>
      )}

      {tab === "calma" && (
        <div className="flex flex-col gap-4">
          <ObjectiveRecommendations objetivos={f.objetivos} library={libByCategoria("Vuelta a la calma")}
            onAdd={(id) => blockAddFromLibrary("vueltaCalma", "tareas", id)}
            label="Sugerencias para la Vuelta a la calma, según tus objetivos" />
          <TaskMiniList
            items={f.vueltaCalma.tareas}
            library={libByCategoria("Vuelta a la calma")}
            attendingPlayers={attendingPlayers}
            usageCounts={usageCounts}
            onAddFromLibrary={(id) => blockAddFromLibrary("vueltaCalma", "tareas", id)}
            onAddBlank={() => blockAddBlank("vueltaCalma", "tareas")}
            onUpdate={(id, k, v) => blockUpdate("vueltaCalma", "tareas", id, k, v)}
            onRemove={(id) => blockRemove("vueltaCalma", "tareas", id)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Estiramientos"><TextInput value={f.vueltaCalma.estiramientos} onChange={(e) => setNested("vueltaCalma", "estiramientos", e.target.value)} /></Field>
            <Field label="Actividad pasiva"><TextInput value={f.vueltaCalma.actividad} onChange={(e) => setNested("vueltaCalma", "actividad", e.target.value)} /></Field>
            <Field label="Tiempo (min)"><TextInput type="number" value={f.vueltaCalma.tiempo} onChange={(e) => setNested("vueltaCalma", "tiempo", Number(e.target.value))} /></Field>
            <Field label="Observaciones"><TextInput value={f.vueltaCalma.observaciones} onChange={(e) => setNested("vueltaCalma", "observaciones", e.target.value)} /></Field>
          </div>

          <div className="pt-2 border-t" style={{ borderColor: T.line }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: T.navy }}>Estrategia / jugadas de balón parado (opcional)</div>
            <TaskMiniList
              items={f.vueltaCalma.balonParado}
              library={libByTipoTarea("Situaciones tácticas de juego y táctica fija")}
              attendingPlayers={attendingPlayers}
              usageCounts={usageCounts}
              onAddFromLibrary={(id) => blockAddFromLibrary("vueltaCalma", "balonParado", id)}
              onAddBlank={() => blockAddBlank("vueltaCalma", "balonParado")}
              onUpdate={(id, k, v) => blockUpdate("vueltaCalma", "balonParado", id, k, v)}
              onRemove={(id) => blockRemove("vueltaCalma", "balonParado", id)}
            />
          </div>

          <Field label="Frases del entrenador (una por línea; se imprimen en la sesión)">
            <TextArea value={(Array.isArray(f.frases) ? f.frases : frasesDeEntreno(f)).join("\n")} onChange={(e) => set("frases", e.target.value.split("\n"))}
              placeholder={"Perfílate antes de recibir: mira la presión y decide.\nAtrae la presión y suelta el balón al lado libre."} />
          </Field>
          <Field label="Notas del entrenador"><TextArea value={f.notas} onChange={(e) => set("notas", e.target.value)} /></Field>
        </div>
      )}

      {tab === "asistencia" && (() => {
        const esPasada = (f.fecha || "") < todayISO();
        const visibles = esPasada ? players : players.filter(esDisponible);
        const ocultos = esPasada ? [] : players.filter((p) => !esDisponible(p));
        return (
        <div className="flex flex-col gap-1.5">
          <div className="text-xs mb-1" style={{ color: T.muted }}>{f.asistencia.filter((a) => a.estado === "Asiste" && visibles.some((p) => p.id === a.jugadorId)).length} de {visibles.length} jugadores disponibles para esta sesión.</div>
          {ocultos.length > 0 && (
            <div className="text-xs p-2 rounded-lg" style={{ background: "#FFF6DE", color: "#92400E" }}>
              No disponibles, no aparecen en la lista: {ocultos.map((p) => `${p.apodo || p.nombre} (${p.estado})`).join(", ")}. Cambia su estado en la plantilla cuando vuelvan.
            </div>
          )}
          {visibles.map((p) => {
            const row = f.asistencia.find((a) => a.jugadorId === p.id);
            const setEstado = (estado) => setF((prev) => ({ ...prev, asistencia: prev.asistencia.map((a) => a.jugadorId === p.id ? { ...a, estado } : a) }));
            const opts = [["Asiste", T.green], ["No asiste", T.redLight], ["Lesionado", T.yellow]];
            return (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg flex-wrap" style={{ background: "#F7F8FA" }}>
                <div className="text-sm font-bold flex-1 truncate min-w-[100px]" style={{ color: T.navy }}>{p.apodo || p.nombre}</div>
                <div className="flex gap-1.5">
                  {opts.map(([label, color]) => (
                    <button key={label} onClick={() => setEstado(label)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                      style={{ background: row.estado === label ? color : "#fff", color: row.estado === label ? "#fff" : T.muted, borderColor: row.estado === label ? color : T.line }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        );
      })()}

      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="accent" icon={Save} onClick={() => onSave(sanearEntreno(f.ejemplo ? { ...f, ejemplo: false } : f, players))}>Guardar sesión</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   TAREAS (biblioteca)
   ============================================================ */

function printTask(t, config) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const row = (label, value) => value ? `<div class="spec"><span class="specLabel">${esc(label)}</span><span class="specValue">${esc(value)}</span></div>` : "";
  const block = (label, value, color) => value ? `<div class="block" style="border-color:${color}22;"><div class="blockLabel" style="color:${color};">${esc(label)}</div><div class="blockText">${esc(value)}</div></div>` : "";
  const section = (title, color, inner) => inner ? `<div class="section"><div class="sectionTitle" style="background:${color};">${esc(title)}</div>${inner}</div>` : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(t.nombre)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 16px 20px 18px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .header { display: flex; align-items: center; gap: 10px; border-bottom: 3px solid #0B1F3A; padding-bottom: 8px; margin-bottom: 10px; }
    .header img { width: 40px; height: 40px; object-fit: contain; border-radius: 10px; }
    .headerInfo { flex: 1; text-align: left; }
    .teamName { font-size: 14px; font-weight: 800; color: #0B1F3A; }
    .teamMeta { font-size: 9.5px; color: #64748B; margin-top: 1px; }
    .title { text-align: right; }
    .title h1 { font-size: 14px; font-weight: 900; color: #E63946; margin: 0; letter-spacing: 0.3px; text-transform: uppercase; }
    .title .sub { font-size: 9px; color: #64748B; margin-top: 1px; font-weight: 600; }
    .taskName { font-size: 15px; font-weight: 800; color: #0B1F3A; text-align: center; margin-top: 2px; }
    .taskCode { font-size: 10px; color: #64748B; text-align: center; margin-bottom: 10px; }
    .twoCol { display: block; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; background: #F5F7FA; border-radius: 10px; padding: 8px 12px; }
    .spec { display: flex; justify-content: space-between; font-size: 10px; padding: 2px 0; border-bottom: 1px dotted #D8DEE7; }
    .specLabel { color: #64748B; font-weight: 700; }
    .specValue { color: #0B1F3A; font-weight: 800; text-align: right; }
    .section { margin-top: 8px; }
    .sectionTitle { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #fff; padding: 3px 10px; border-radius: 999px; display: inline-block; margin-bottom: 4px; letter-spacing: 0.3px; }
    .objectives { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .block { background: #FAFBFC; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 5px 9px; margin-bottom: 5px; }
    .blockLabel { font-size: 8.5px; font-weight: 800; text-transform: uppercase; margin-bottom: 1px; }
    .blockText { font-size: 10px; line-height: 1.3; color: #1B2733; }
    .imgWrap { text-align: center; }
    ${LEYENDA_CSS}
    .imgWrap img { width: 100%; max-height: 420px; object-fit: contain; border-radius: 12px; border: 1.5px solid #E2E8F0; background: #FAFBFC; }
    .sideLabel { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94A3B8; margin: 8px 0 3px; }
    .footer { margin-top: 10px; text-align: center; font-size: 8px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 6px; }
    @media print {
      html, body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
      body { padding: 0; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div class="sheet" id="sheet">
      <div class="header">
        ${config.logo ? `<img src="${config.logo}" />` : ""}
        <div class="headerInfo">
          <div class="teamName">${esc(config.teamName || "Equipo")}</div>
          <div class="teamMeta">${esc(config.category || "")}${config.category && config.season ? " · " : ""}${esc(config.season || "")}</div>
        </div>
        <div class="title"><h1>Tarea de entrenamiento</h1><div class="sub">Ficha técnica de ejercicio</div></div>
      </div>
      <div class="taskName">${esc(t.nombre)}</div>
      <div class="taskCode">${esc(t.codigo)}${t.codigo ? " · " : ""}${esc(t.categoria)}</div>

      <div class="twoCol">
        <div>
          ${section("Objetivos", "#0B1F3A", `<div class="objectives">
            ${block("Físico", t.objFisico, "#2A9D5C")}
            ${block("Técnico", t.objTecnico, "#E63946")}
            ${block("Táctico", t.objTactico, "#0B1F3A")}
            ${block("Psicológico", t.objPsicologico, "#F4B400")}
          </div>`)}

          ${section("Materiales", "#2A9D5C", `<div class="block" style="margin-bottom:0;">${esc(t.materiales) || "—"}</div>`)}

          ${section("Especificaciones", "#E63946", `<div class="grid">
            ${row("Tipo de ejercicio", t.tipoEjercicio)}
            ${row("Zona de trabajo", t.zonaTrabajo)}
            ${row("Fase del juego", t.faseJuego)}
            ${row("Momento del juego", t.momentoJuego)}
            ${row("Tipo de tarea", t.tipoTarea)}
            ${row("Nº jugadores", t.minJugadores && t.maxJugadores ? `${t.minJugadores}-${t.maxJugadores}` : "")}
            ${row("Espacio", t.espacio)}
            ${row("Duración", t.duracion ? `${t.duracion} min` : "")}
          </div>`)}

          ${section("Descripción", "#0B1F3A", t.descripcion ? `<div class="block" style="margin-bottom:0;">${esc(t.descripcion)}</div>` : "")}
          ${section("Reglas o provocación", "#F4B400", t.reglas ? `<div class="block" style="margin-bottom:0;">${esc(t.reglas)}</div>` : "")}
          ${section("Movimientos y acciones a observar", "#E63946", t.movimientosObservar ? `<div class="block" style="margin-bottom:0;">${esc(t.movimientosObservar)}</div>` : "")}
          ${section("Notas adicionales", "#64748B", t.observaciones ? `<div class="block" style="margin-bottom:0;">${esc(t.observaciones)}</div>` : "")}
        </div>
        ${imagenDe(t) ? `<div class="section"><div class="sectionTitle" style="background:#2A9D5C;">Representación gráfica</div><div class="imgWrap">${imgImpresion(t)}</div>${LEYENDA_HTML}</div>` : ""}
      </div>

      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
    <script>
      window.onload = function () {
        var sheet = document.getElementById('sheet');
        var pageHeightPx = 277 * 96 / 25.4; // alto útil de una hoja A4 con márgenes de 10mm
        var scale = 1;
        var tries = 0;
        while (sheet.scrollHeight * scale > pageHeightPx && tries < 25) {
          scale -= 0.02;
          sheet.style.zoom = scale;
          tries++;
        }
      };
    </script>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

function Tareas({ ctx }) {
  const { tasks, updateTasks, config } = ctx;
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState(null);
  useEffect(() => {
    if (ctx.deepLink?.type === "tarea") { setEditTask(tasks.find((t) => t.id === ctx.deepLink.id) || null); ctx.clearDeepLink(); }
  }, [ctx.deepLink]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [maxTime, setMaxTime] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [minEstrellas, setMinEstrellas] = useState("");

  const filtered = tasks.filter((t) => {
    if (minEstrellas === "sin" && Number(t.valoracion) > 0) return false;
    if (minEstrellas && minEstrellas !== "sin" && !(Number(t.valoracion) >= Number(minEstrellas))) return false;
    if (q && !`${t.nombre} ${t.codigo} ${t.objTactico} ${t.objTecnico}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== "Todas" && t.categoria !== cat) return false;
    if (maxTime && Number(t.duracion) > Number(maxTime)) return false;
    if (minPlayers && Number(t.maxJugadores) < Number(minPlayers)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Eyebrow>Biblioteca de tareas</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{tasks.length} tareas guardadas</h1></div>
        <Btn icon={Plus} variant="accent" onClick={() => setShowNew(true)}>Nueva tarea</Btn>
      </div>
      {MODO_DEMO && <div className="rounded-xl px-4 py-3 text-sm font-bold" style={{ background: "#FFF7E6", color: "#8A5A00", border: "1px solid #F5D9A0" }}>Demostración: aquí ves una muestra de las tareas. Puedes abrirlas, cambiarlas, crear una nueva y probar el editor gráfico, pero al pulsar «Atrás» nada se guarda. Con tu plan tendrás el catálogo completo y podrás guardar e imprimir tus tareas.</div>}

      <div className="flex flex-wrap gap-2">
        <TextInput placeholder="Buscar por nombre, código u objetivo…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={cat} onChange={(e) => setCat(e.target.value)} className="w-auto"><option>Todas</option>{config.taskCategories.map((c) => <option key={c}>{c}</option>)}</Select>
        <TextInput placeholder="Duración máx (min)" type="number" value={maxTime} onChange={(e) => setMaxTime(e.target.value)} className="w-40" />
        <TextInput placeholder="Nº jugadores mín." type="number" value={minPlayers} onChange={(e) => setMinPlayers(e.target.value)} className="w-40" />
        <Select value={minEstrellas} onChange={(e) => setMinEstrellas(e.target.value)} className="w-auto">
          <option value="">Valoración: todas</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★ o más</option>
          <option value="3">★★★ o más</option>
          <option value="sin">Sin valorar</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <Card key={t.id} className="p-4 cursor-pointer hover:shadow-md transition flex flex-col gap-3" onClick={() => setEditTask(t)}>
            {/* Título arriba */}
            <div className="font-extrabold leading-snug line-clamp-2" style={{ color: T.navy, minHeight: "2.75em" }} title={t.nombre}>{t.nombre}</div>

            {/* Representación gráfica grande */}
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "3 / 2", background: "#EEF2F8", border: `1px solid ${T.line}` }}>
              {imagenDe(t) ? (
                <img src={imagenDe(t)} alt={`Gráfico de ${t.nombre}`} loading="lazy" className="w-full h-full block" style={{ objectFit: "contain" }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-xs font-bold" style={{ color: T.muted }}>
                  <LayoutGrid size={26} />
                  Sin representación gráfica
                </div>
              )}
              {MODO_DEMO && imagenDe(t) && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: marcaAguaDemoCSS(), backgroundSize: "280px 190px" }} />}
            </div>

            {/* Código y categoría a la izquierda; duración, jugadores y espacio a la derecha */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="text-xs font-bold pt-0.5" style={{ color: T.muted }}>{t.codigo}{t.codigo && t.categoria ? " · " : ""}{t.categoria}</div>
              <div className="flex gap-1.5 flex-wrap justify-end ml-auto">
                {!!t.duracion && <Pill>{t.duracion} min</Pill>}
                {!!(t.minJugadores || t.maxJugadores) && <Pill color={T.green} bg="#E7F6ED">{t.minJugadores}{t.minJugadores && t.maxJugadores ? "-" : ""}{t.maxJugadores} jug.</Pill>}
                {!!t.espacio && <Pill>{t.espacio}</Pill>}
                {t.videoUrl && <Pill color={T.red} bg="#FCEAEC">🎬 Video</Pill>}
              </div>
            </div>

            {/* Estrellas abajo a la izquierda; imprimir, editar y eliminar abajo a la derecha */}
            <div className="flex items-center justify-between gap-2 -mb-1 mt-auto">
              <Estrellas valor={t.valoracion} size={15} />
              <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); printTask(t, config); }} className="p-2 rounded-lg hover:bg-slate-100" title={MODO_DEMO ? "Vista previa" : "Imprimir / PDF"}>
                {MODO_DEMO ? <Eye size={16} style={{ color: T.muted }} /> : <Printer size={16} style={{ color: T.muted }} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setEditTask(t); }} className="p-2 rounded-lg hover:bg-slate-100" title="Editar">
                <Edit3 size={16} style={{ color: T.muted }} />
              </button>
              {!MODO_DEMO && <>
              <button onClick={(e) => { e.stopPropagation(); if (confirm("¿Eliminar esta tarea?")) updateTasks((prev) => prev.filter((x) => x.id !== t.id)); }} className="p-2 rounded-lg hover:bg-red-50" title="Eliminar">
                <Trash2 size={16} style={{ color: T.redLight }} />
              </button>
              </>}
              </div>
            </div>
          </Card>
        ))}
        {!filtered.length && <div className="text-sm" style={{ color: T.muted }}>No se encontraron tareas con estos filtros.</div>}
      </div>

      {showNew && <TaskForm ctx={ctx} onClose={() => setShowNew(false)} onSave={(t) => { updateTasks((prev) => [...prev, t]); setShowNew(false); }} />}
      {editTask && <TaskForm ctx={ctx} initial={editTask} onClose={() => setEditTask(null)}
        onSave={(t) => { updateTasks((prev) => prev.map((x) => x.id === t.id ? t : x)); setEditTask(null); }}
        onDelete={() => { if (confirm("¿Eliminar esta tarea?")) { updateTasks((prev) => prev.filter((x) => x.id !== editTask.id)); setEditTask(null); } }} />}
    </div>
  );
}

/* Valoración de la tarea de 1 a 5 estrellas (la pone el entrenador al editarla). */
function Estrellas({ valor = 0, onChange, size = 16, compacto = false }) {
  const v = Math.max(0, Math.min(5, Number(valor) || 0));
  return (
    <div className="inline-flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`Valoración: ${v} de 5 estrellas`} title={v ? `${v} de 5 estrellas` : "Sin valorar"}>
      {[1, 2, 3, 4, 5].map((n) => {
        const llena = n <= v;
        const icono = <Star size={size} fill={llena ? "#F4B400" : "none"} color={llena ? "#F4B400" : "#CBD5E1"} strokeWidth={1.8} />;
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={n === v} aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
            onClick={(e) => { e.stopPropagation(); onChange(n === v ? 0 : n); }} className={compacto ? "p-0.5" : "p-1 rounded-lg hover:bg-slate-100"}>
            {icono}
          </button>
        ) : <span key={n} className="inline-flex">{icono}</span>;
      })}
    </div>
  );
}

function TaskForm({ ctx, initial, onClose, onSave, onDelete }) {
  const { config } = ctx;
  const [f, setF] = useState(initial || {
    id: uid(), nombre: "", codigo: "", categoria: config.taskCategories[0],
    tipoEjercicio: TIPO_EJERCICIO[0], zonaTrabajo: ZONA_TRABAJO[0], faseJuego: FASE_JUEGO[0], momentoJuego: MOMENTO_JUEGO[0], tipoTarea: TIPO_TAREA[0],
    edad: "", minJugadores: "", maxJugadores: "",
    espacio: "", duracion: "", objFisico: "", objTecnico: "", objTactico: "", objPsicologico: "", materiales: "",
    descripcion: "", reglas: "", movimientosObservar: "", observaciones: "",
    imagen: null, graficoTactico: null, videoUrl: "",
  });
  const [showTacticalEditor, setShowTacticalEditor] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const embedUrl = getVideoEmbedUrl(f.videoUrl);
  return (
    <Modal title={initial ? "Editar tarea" : "Nueva tarea"} onClose={onClose} wide>
      <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Valoración de la tarea (para tu equipo)" className="sm:col-span-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Estrellas valor={f.valoracion} onChange={(n) => set("valoracion", n)} size={24} />
            <span className="text-xs" style={{ color: T.muted }}>{f.valoracion ? `${f.valoracion} de 5 · pulsa la misma estrella para quitarla` : "Pulsa de 1 a 5 estrellas según lo bien que funcionó"}</span>
          </div>
        </Field>
        <Field label="Nombre"><TextInput value={f.nombre} onChange={(e) => set("nombre", e.target.value)} /></Field>
        <Field label="Código"><TextInput value={f.codigo} onChange={(e) => set("codigo", e.target.value)} /></Field>
        <Field label="Categoría"><PickerField value={f.categoria} options={config.taskCategories} onChange={(v) => set("categoria", v)} placeholder="Categoría" /></Field>
        <Field label="Tipo de ejercicio"><PickerField value={f.tipoEjercicio} options={TIPO_EJERCICIO} onChange={(v) => set("tipoEjercicio", v)} placeholder="Tipo de ejercicio" /></Field>
        <Field label="Zona de trabajo"><PickerField value={f.zonaTrabajo} options={ZONA_TRABAJO} onChange={(v) => set("zonaTrabajo", v)} placeholder="Zona de trabajo" /></Field>
        <Field label="Fase del juego"><PickerField value={f.faseJuego} options={FASE_JUEGO} onChange={(v) => set("faseJuego", v)} placeholder="Fase del juego" /></Field>
        <Field label="Momentos del juego"><PickerField value={f.momentoJuego} options={MOMENTO_JUEGO} onChange={(v) => set("momentoJuego", v)} placeholder="Momentos del juego" /></Field>
        <Field label="Tipo de tarea"><PickerField value={f.tipoTarea} options={TIPO_TAREA} onChange={(v) => set("tipoTarea", v)} placeholder="Tipo de tarea" /></Field>
        <Field label="Edad / categoría recomendada"><TextInput value={f.edad} onChange={(e) => set("edad", e.target.value)} /></Field>
        <Field label="Nº mínimo jugadores"><TextInput type="number" value={f.minJugadores} onChange={(e) => set("minJugadores", e.target.value)} /></Field>
        <Field label="Nº máximo jugadores"><TextInput type="number" value={f.maxJugadores} onChange={(e) => set("maxJugadores", e.target.value)} /></Field>
        <Field label="Espacio"><TextInput value={f.espacio} onChange={(e) => set("espacio", e.target.value)} /></Field>
        <Field label="Duración (min)"><TextInput type="number" value={f.duracion} onChange={(e) => set("duracion", e.target.value)} /></Field>
        <Field label="Objetivo físico"><TextInput value={f.objFisico} onChange={(e) => set("objFisico", e.target.value)} /></Field>
        <Field label="Objetivo técnico"><TextInput value={f.objTecnico} onChange={(e) => set("objTecnico", e.target.value)} /></Field>
        <Field label="Objetivo táctico"><TextInput value={f.objTactico} onChange={(e) => set("objTactico", e.target.value)} /></Field>
        <Field label="Objetivo psicológico"><TextInput value={f.objPsicologico} onChange={(e) => set("objPsicologico", e.target.value)} /></Field>
        <Field label="Materiales" className="sm:col-span-2"><TextInput value={f.materiales} onChange={(e) => set("materiales", e.target.value)} /></Field>
        <Field label="Descripción" className="sm:col-span-2"><TextArea value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} /></Field>
        <Field label="Reglas o provocación"><TextArea value={f.reglas} onChange={(e) => set("reglas", e.target.value)} /></Field>
        <Field label="Movimientos y acciones a observar y corregir"><TextArea value={f.movimientosObservar} onChange={(e) => set("movimientosObservar", e.target.value)} /></Field>
        <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>

        <Field label="Representación gráfica de la tarea" className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Btn variant="ghost" icon={LayoutGrid} onClick={() => setShowTacticalEditor(true)}>
              {f.graficoTactico ? "Editar tarea gráfica" : "Crear tarea gráfica"}
            </Btn>
            {!f.graficoTactico && <span className="text-xs" style={{ color: T.muted }}>o sube una imagen ya hecha abajo</span>}
          </div>
          {f.graficoTactico ? (
            <div className="flex flex-col gap-2">
              {imagenDe(f) && (
                <div className="rounded-xl overflow-hidden max-w-sm relative" style={{ border: `1px solid ${T.line}` }}>
                  <img src={imagenDe(f)} alt="Gráfico de la tarea" className="w-full block" />
                  {MODO_DEMO && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: marcaAguaDemoCSS(), backgroundSize: "280px 190px" }} />}
                </div>
              )}
              <div><Btn variant="ghost" onClick={() => setF((p) => ({ ...p, graficoTactico: null, imagen: "" }))}>Quitar el gráfico dibujado</Btn></div>
            </div>
          ) : (
            <TaskImageUploader value={f.imagen} onChange={(dataUrl) => set("imagen", dataUrl)} />
          )}
          {showTacticalEditor && (
            <TacticalEditorModal initial={f.graficoTactico} onClose={() => setShowTacticalEditor(false)}
              onSave={(diagram) => { setF((p) => ({ ...p, graficoTactico: diagram, imagen: "" })); setShowTacticalEditor(false); }} />
          )}
        </Field>
        <Field label="Enlace a video (YouTube, Vimeo, Drive…)" className="sm:col-span-2">
          <TextInput type="url" placeholder="https://www.youtube.com/watch?v=…" value={f.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
          {f.videoUrl && (
            embedUrl ? (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video de la tarea" />
              </div>
            ) : (
              <a href={f.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold mt-1 inline-block" style={{ color: T.red }}>Abrir enlace de video ↗</a>
            )
          )}
        </Field>
      </div>
      </fieldset>
      {MODO_DEMO ? (
        <div className="flex flex-wrap justify-between items-center gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
          <span className="text-xs font-bold" style={{ color: T.muted }}>Demostración: puedes cambiar todo y probar el editor gráfico, pero los cambios no se guardan.</span>
          <div className="flex gap-2 flex-wrap justify-end">
            <Btn variant="ghost" icon={Eye} onClick={() => printTask(f, ctx.config)} title="Vista previa">Vista previa</Btn>
            <Btn variant="accent" icon={ChevronLeft} onClick={onClose}>Atrás</Btn>
          </div>
        </div>
      ) : (
      <div className="flex flex-wrap justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete} title="Eliminar tarea"><span className="hidden sm:inline">Eliminar</span></Btn> : <div />}
        <div className="flex gap-2 flex-wrap justify-end">
          {initial && <Btn variant="ghost" icon={Printer} onClick={() => printTask(f, ctx.config)} title="Imprimir tarea"><span className="hidden sm:inline">Imprimir</span></Btn>}
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="accent" icon={Save} onClick={() => onSave(f)}>Guardar<span className="hidden sm:inline">&nbsp;tarea</span></Btn>
        </div>
      </div>
      )}
    </Modal>
  );
}

/* ============================================================
   CALENDARIO
   ============================================================ */

function CalendarioView({ ctx, goto }) {
  const { matches, trainings, seasonPlanning } = ctx;
  const today = todayISO();
  const in14 = new Date();
  in14.setDate(in14.getDate() + 14);
  const in14ISO = in14.toISOString().slice(0, 10);

  // Detecta el patrón habitual de entrenamientos (día de la semana + hora más frecuentes)
  const dayCounts = {}, hourCounts = {};
  trainings.forEach((t) => {
    const d = new Date(t.fecha + "T00:00:00");
    const day = d.getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
    if (t.hora) hourCounts[t.hora] = (hourCounts[t.hora] || 0) + 1;
  });
  const topDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d]) => Number(d));
  const topHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "19:00";
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  // Genera sugerencias de entrenamiento para los próximos 14 días, en los días habituales,
  // evitando fechas donde ya hay un entrenamiento o partido registrado.
  const existingDates = new Set([...matches.map((m) => m.fecha), ...trainings.map((t) => t.fecha)]);
  const suggestions = [];
  if (topDays.length) {
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      if (topDays.includes(d.getDay()) && !existingDates.has(iso)) {
        suggestions.push({ fecha: iso, tipo: "Entrenamiento sugerido", label: `Entrenamiento habitual de ${DIAS[d.getDay()]} a las ${topHour}`, color: T.yellow, sugerido: true });
      }
    }
  }

  const events = [
    ...matches.map((m) => ({ id: m.id, fecha: m.fecha, tipo: "Partido", label: `vs ${m.rival} (${m.resultadoFinal})`, color: T.red })),
    ...trainings.map((t) => ({ id: t.id, fecha: t.fecha, tipo: "Entrenamiento", label: sessionDisplayName(t), color: T.green })),
    ...(seasonPlanning?.partidoNoProgramado || []).filter((p) => !p.matchId).map((p) => ({ fecha: p.fecha, tipo: "Partido no programado", label: `vs ${p.rival}`, color: T.redLight })),
    ...suggestions,
  ].filter((e) => e.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const proximos = events.filter((e) => e.fecha >= today && e.fecha <= in14ISO);
  const resto = events.filter((e) => e.fecha < today || e.fecha > in14ISO);

  const EventRow = (e, i) => {
    const clicable = e.tipo === "Partido" || e.tipo === "Entrenamiento";
    return (
      <Card key={i} className={`p-3 flex items-center gap-3 ${clicable ? "cursor-pointer hover:shadow-md transition" : ""}`}
        style={e.sugerido ? { borderStyle: "dashed" } : {}}
        onClick={clicable ? () => goto(e.tipo === "Partido" ? "partido" : "entrenamiento", e.id) : undefined}>
        <div className="w-2 h-8 rounded-full shrink-0" style={{ background: e.color }} />
        <div className="text-xs font-bold w-28 shrink-0" style={{ color: T.muted }}>{e.fecha}</div>
        <Pill color={e.color} bg={e.sugerido ? "#FFF6DE" : e.color === T.red || e.color === T.redLight ? "#FCEAEC" : "#E7F6ED"}>{e.tipo}</Pill>
        <div className="text-sm truncate flex-1" style={{ color: T.text }}>{e.label}</div>
        {clicable && <ChevronRight size={16} style={{ color: T.muted }} />}
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div><Eyebrow>Calendario</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Próximos eventos</h1></div>

      <Card className="p-4" style={{ background: "#FCEAEC", borderColor: "#F6C6CB" }}>
        <Eyebrow>Próximos 14 días</Eyebrow>
        <div className="flex flex-col gap-2 mt-2">
          {proximos.length ? proximos.map(EventRow) : <div className="text-sm" style={{ color: T.muted }}>Sin eventos en los próximos 14 días.</div>}
        </div>
        {!!suggestions.length && <div className="text-[11px] mt-2" style={{ color: T.muted }}>Los entrenamientos con borde punteado son sugerencias automáticas, según el día y la hora que sueles usar — todavía no están registrados.</div>}
      </Card>

      <div className="flex flex-col gap-2">
        {resto.map(EventRow)}
        {!resto.length && !proximos.length && <div className="text-sm" style={{ color: T.muted }}>Sin eventos programados.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   ESTADÍSTICAS
   ============================================================ */

function LineChartSVG({ points, color, height = 140 }) {
  if (!points.length) return null;
  const width = 100; // % viewbox, scaled via viewBox
  const maxY = Math.max(...points.map((p) => p.y), 1);
  const minY = Math.min(...points.map((p) => p.y), 0);
  const range = maxY - minY || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;
  const coords = points.map((p, i) => ({ x: i * stepX, y: height - ((p.y - minY) / range) * (height - 20) - 10 }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${path} L ${coords[coords.length - 1].x} ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <path d={areaPath} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="1.6" fill={color} vectorEffect="non-scaling-stroke">
          <title>{points[i].label}</title>
        </circle>
      ))}
    </svg>
  );
}

/* ============================================================
   Gráficos de estadísticas: con ejes, cifras y una guía de lectura.
   Solo cuentan los partidos ya jugados.
   ============================================================ */
function etiquetasJornada(partidos) {
  const js = partidos.map((m) => Number(m.jornada));
  const validas = js.every((j) => Number.isFinite(j) && j > 0) && new Set(js).size === js.length;
  return partidos.map((m, i) => `J${validas ? js[i] : i + 1}`);
}
const COLOR_RESULTADO = { V: T.green, E: T.yellow, D: T.redLight };
const num1 = (v) => (Math.round(v * 10) / 10).toString();
// Evita que las cifras se amontonen cuando hay muchos partidos
const mostrarCifra = (i, n) => n <= 16 || i === n - 1 || i % Math.ceil(n / 16) === 0;

// Ajusta el gráfico al ancho disponible; solo se desliza si hay demasiadas jornadas y empieza mostrando las últimas.
function ScrollGrafico({ n, children }) {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const medir = () => setAncho(el.clientWidth);
    medir(); window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);
  const W = Math.max(ancho || 520, n * 46 + 110);
  const desborda = ancho > 0 && W > ancho + 4;
  useEffect(() => { const el = ref.current; if (el && desborda) el.scrollLeft = el.scrollWidth; }, [desborda, W]);
  return (
    <div>
      <div ref={ref} className="overflow-x-auto">{children(W)}</div>
      {desborda && <div className="text-[11px] mt-1" style={{ color: T.muted }}>← Desliza para ver todas las jornadas (se muestran las últimas)</div>}
    </div>
  );
}

function GraficoResultados({ partidos }) {
  const n = partidos.length;
  const etq = etiquetasJornada(partidos.map((p) => p.m));
  const H = 232, ml = 84, mr = 22, mt = 18, mb = 36;
  const nivel = { V: mt + 22, E: mt + (H - mt - mb) / 2, D: H - mb - 22 };
  const v = partidos.filter((p) => p.resultado === "V").length, e = partidos.filter((p) => p.resultado === "E").length, d = partidos.filter((p) => p.resultado === "D").length;
  let racha = 0; const ultimo = partidos[n - 1].resultado;
  for (let i = n - 1; i >= 0 && partidos[i].resultado === ultimo; i--) racha++;
  let sinPerder = 0; for (let i = n - 1; i >= 0 && partidos[i].resultado !== "D"; i--) sinPerder++;
  const nombreRacha = { V: racha === 1 ? "victoria" : "victorias seguidas", E: racha === 1 ? "empate" : "empates seguidos", D: racha === 1 ? "derrota" : "derrotas seguidas" }[ultimo];
  return (
    <div>
      <ScrollGrafico n={n}>{(W) => {
        const x = (i) => ml + 24 + (n === 1 ? (W - ml - mr - 48) / 2 : (i * (W - ml - mr - 48)) / (n - 1));
        return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Resultados de cada jornada: arriba victoria, en medio empate, abajo derrota">
          {[["V", "Victoria"], ["E", "Empate"], ["D", "Derrota"]].map(([k, l]) => (
            <g key={k}>
              <line x1={ml} x2={W - mr} y1={nivel[k]} y2={nivel[k]} stroke={T.line} strokeWidth="1" />
              <text x={ml - 12} y={nivel[k] + 4} textAnchor="end" fontSize="12" fill={T.muted}>{l}</text>
            </g>
          ))}
          <polyline points={partidos.map((p, i) => `${x(i)},${nivel[p.resultado]}`).join(" ")} fill="none" stroke="#CBD5E1" strokeWidth="2.2" />
          {partidos.map((p, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={nivel[p.resultado]} r="16" fill={COLOR_RESULTADO[p.resultado]} stroke="#fff" strokeWidth="2">
                <title>{`${etq[i]} vs ${p.m.rival} (${p.m.fecha}) · ${p.m.esLocal ? "en casa" : "fuera"} · ${p.golesPropios}-${p.golesRival}`}</title>
              </circle>
              <text x={x(i)} y={nivel[p.resultado] + 3.5} textAnchor="middle" fontSize="10" fontWeight="800" fill={p.resultado === "E" ? T.navy : "#fff"} pointerEvents="none">{p.golesPropios}-{p.golesRival}</text>
              <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="12" fill={T.muted}>{etq[i]}</text>
            </g>
          ))}
        </svg>
        );
      }}</ScrollGrafico>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold mt-2" style={{ color: T.navy }}>
        <span className="font-normal" style={{ color: T.muted }}>
          {[["V", "Victoria"], ["E", "Empate"], ["D", "Derrota"]].map(([k, l]) => (
            <span key={k} style={{ marginRight: 12, whiteSpace: "nowrap" }}><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 999, background: COLOR_RESULTADO[k], marginRight: 4 }} />{l}</span>
          ))}
        </span>
        <span>Balance: {v} victoria{v === 1 ? "" : "s"} · {e} empate{e === 1 ? "" : "s"} · {d} derrota{d === 1 ? "" : "s"}</span>
        <span>Racha actual: {racha} {nombreRacha}</span>
        {ultimo !== "D" && sinPerder >= 3 && <span style={{ color: T.green }}>Sin perder en {sinPerder} partidos</span>}
      </div>
    </div>
  );
}

function GraficoPuntos({ partidos }) {
  const n = partidos.length;
  const etq = etiquetasJornada(partidos.map((p) => p.m));
  let acum = 0; const pts = partidos.map((p) => (acum += p.resultado === "V" ? 3 : p.resultado === "E" ? 1 : 0));
  const maxPos = n * 3;
  const paso = maxPos <= 15 ? 3 : maxPos <= 45 ? 5 : 10;
  const top = Math.ceil(Math.max(maxPos, 3) / paso) * paso;
  const H = 262, ml = 52, mr = 22, mt = 34, mb = 36;
  const y = (val) => H - mb - (val / top) * (H - mt - mb);
  const ticks = []; for (let t = 0; t <= top; t += paso) ticks.push(t);
  return (
    <div>
      <ScrollGrafico n={n}>{(W) => {
        const x = (i) => ml + 24 + (n === 1 ? (W - ml - mr - 48) / 2 : (i * (W - ml - mr - 48)) / (n - 1));
        return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Puntos acumulados después de cada jornada">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={ml} x2={W - mr} y1={y(t)} y2={y(t)} stroke={T.line} strokeWidth="1" />
              <text x={ml - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={T.muted}>{t}</text>
            </g>
          ))}
          <text x={6} y={mt - 14} textAnchor="start" fontSize="11" fontWeight="700" fill={T.muted}>Puntos</text>
          <polyline points={partidos.map((_, i) => `${x(i)},${y(3 * (i + 1))}`).join(" ")} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 4" />
          <polyline points={pts.map((p, i) => `${x(i)},${y(p)}`).join(" ")} fill="none" stroke={T.red} strokeWidth="2.8" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(p)} r="5" fill={T.red} stroke="#fff" strokeWidth="1.5">
                <title>{`${etq[i]} vs ${partidos[i].m.rival}: ${partidos[i].golesPropios}-${partidos[i].golesRival} → ${p} puntos`}</title>
              </circle>
              {mostrarCifra(i, n) && <text x={x(i)} y={y(p) - 11} textAnchor="middle" fontSize="12" fontWeight="800" fill={T.red}>{p}</text>}
              <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="12" fill={T.muted}>{etq[i]}</text>
            </g>
          ))}
          <g transform={`translate(${ml + 8}, 10)`}>
            <line x1="0" x2="22" y1="0" y2="0" stroke={T.red} strokeWidth="2.8" /><text x="28" y="4" fontSize="11" fill={T.muted}>Tus puntos</text>
            <line x1="112" x2="134" y1="0" y2="0" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 4" /><text x="140" y="4" fontSize="11" fill={T.muted}>Máximo posible (3 por victoria)</text>
          </g>
        </svg>
        );
      }}</ScrollGrafico>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold mt-2" style={{ color: T.navy }}>
        <span>Llevas {pts[n - 1]} de {maxPos} puntos posibles ({Math.round((pts[n - 1] / maxPos) * 100)}%)</span>
        <span>Media: {num1(pts[n - 1] / n)} puntos por partido</span>
      </div>
    </div>
  );
}

function GraficoValoracion({ items }) {
  const n = items.length;
  const etq = etiquetasJornada(items.map((it) => it.m));
  const vals = items.map((it) => it.avg);
  const media = vals.reduce((a, b) => a + b, 0) / n;
  const maxV = Math.max(...vals), minV = Math.min(...vals);
  const lo = Math.max(0, Math.floor(minV) - 1), hi = Math.min(10, Math.ceil(maxV) + 1);
  const H = 262, ml = 52, mr = 22, mt = 30, mb = 36;
  const y = (val) => H - mb - ((val - lo) / (hi - lo || 1)) * (H - mt - mb);
  const ticks = []; for (let t = lo; t <= hi; t++) ticks.push(t);
  const iMax = vals.indexOf(maxV), iMin = vals.indexOf(minV);
  return (
    <div>
      <ScrollGrafico n={n}>{(W) => {
        const x = (i) => ml + 24 + (n === 1 ? (W - ml - mr - 48) / 2 : (i * (W - ml - mr - 48)) / (n - 1));
        return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Valoración media del equipo en cada partido">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={ml} x2={W - mr} y1={y(t)} y2={y(t)} stroke={T.line} strokeWidth="1" />
              <text x={ml - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={T.muted}>{t}</text>
            </g>
          ))}
          <text x={6} y={mt - 12} textAnchor="start" fontSize="11" fontWeight="700" fill={T.muted}>Nota (0-10)</text>
          <line x1={ml} x2={W - mr} y1={y(media)} y2={y(media)} stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 4" />
          <g transform={`translate(${ml + 36}, 8)`}>
            <line x1="0" x2="22" y1="0" y2="0" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5 4" /><text x="28" y="4" fontSize="11" fill={T.muted}>Media de la temporada: {num1(media)}</text>
          </g>
          <polyline points={vals.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={T.navy} strokeWidth="2.8" />
          {vals.map((v, i) => {
            const color = n > 1 && i === iMax ? T.green : n > 1 && i === iMin ? T.redLight : T.navy;
            return (
              <g key={i}>
                <circle cx={x(i)} cy={y(v)} r="5" fill={color} stroke="#fff" strokeWidth="1.5">
                  <title>{`${etq[i]} vs ${items[i].m.rival} (${items[i].m.fecha}): nota media ${num1(v)}`}</title>
                </circle>
                {(mostrarCifra(i, n) || i === iMax || i === iMin) && <text x={x(i)} y={y(v) - 11} textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{num1(v)}</text>}
                <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="12" fill={T.muted}>{etq[i]}</text>
              </g>
            );
          })}
        </svg>
        );
      }}</ScrollGrafico>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold mt-2" style={{ color: T.navy }}>
        <span>Media: {num1(media)}</span>
        {n > 1 && <span style={{ color: T.green }}>Mejor partido: {etq[iMax]} ({num1(maxV)})</span>}
        {n > 1 && <span style={{ color: T.redLight }}>Peor partido: {etq[iMin]} ({num1(minV)})</span>}
      </div>
    </div>
  );
}

function EstadisticasEjemplo({ ctx }) {
  const datos = useMemo(() => {
    const pl = buildDemoPlayers(), mt = buildDemoMatches(pl), tr = buildDemoTrainings(pl);
    const pws = pl.map((p) => ({ ...p, stats: { ...p.stats, ...computeMatchStatsForPlayer(p.id, mt), ...computeTrainingAttendanceForPlayer(p.id, tr) } }));
    return { players: pws, matches: mt, trainings: tr, season: buildDemoSeason() };
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl px-4 py-3 text-sm font-bold flex items-start gap-2" style={{ background: "#FFF7E6", color: "#8A5A00", border: "1px solid #F5D9A0" }}>
        <Lock size={15} className="mt-0.5 shrink-0" />
        <span>Datos de ejemplo. Con el plan Entrenador verás aquí las estadísticas reales de tu equipo, calculadas con tus partidos, tus jugadores y tus entrenamientos.</span>
      </div>
      <Estadisticas ctx={{ ...ctx, ...datos }} />
    </div>
  );
}

function Estadisticas({ ctx }) {
  const { players, matches, trainings, season, seasonPlanning, config } = ctx;
  const ts = computeTeamStats(matches);
  const topScorers = [...players].sort((a, b) => b.stats.goles - a.stats.goles).slice(0, 5);
  const topAssists = [...players].sort((a, b) => b.stats.asistencias - a.stats.asistencias).slice(0, 5);
  const topMvps = [...players].filter((p) => p.stats.mvps > 0).sort((a, b) => b.stats.mvps - a.stats.mvps).slice(0, 5);
  const maxMvps = Math.max(1, ...topMvps.map((p) => p.stats.mvps));
  const sortedMatches = [...matches].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const matchMvps = sortedMatches
    .filter((m) => Object.keys(m.valoracionesJugadores || {}).length > 0)
    .map((m) => {
      const entry = Object.entries(m.valoracionesJugadores).sort((a, b) => b[1] - a[1])[0];
      const player = players.find((p) => p.id === entry[0]);
      return { fecha: m.fecha, rival: m.rival, player, puntuacion: entry[1] };
    });

  let acumulado = 0;
  const pointsEvolution = sortedMatches.map((m, i) => {
    const { resultado } = resultadoPropio(m);
    if (resultado !== "P") acumulado += resultado === "V" ? 3 : resultado === "E" ? 1 : 0;
    return { y: acumulado, label: `J${m.jornada || i + 1} vs ${m.rival}: ${m.resultadoFinal} (${acumulado} pts)` };
  });

  // Solo partidos ya jugados: los futuros no tienen resultado todavía.
  const jugados = sortedMatches.map((m) => ({ m, ...resultadoPropio(m) })).filter((p) => p.resultado !== "P");
  const valoraciones = jugados
    .filter((p) => Object.values(p.m.valoracionesJugadores || {}).length > 0)
    .map((p) => { const v = Object.values(p.m.valoracionesJugadores); return { m: p.m, avg: v.reduce((a, b) => a + b, 0) / v.length }; });

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div><Eyebrow>Estadísticas</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Resumen del equipo</h1>
          <p className="text-xs mt-1" style={{ color: T.muted }}>Todos los datos se calculan automáticamente a partir de Partidos, Plantilla y Entrenamientos.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ctx.cap?.imprimirInformes === false ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl" style={{ background: "#F5F7FA", color: T.muted }}><Lock size={13} />Informes impresos: plan Metodólogo</span>
          ) : (
            <>
              <Btn variant="ghost" icon={Printer} onClick={() => printEstadisticas(prepararDatosTemporada({ players, matches, trainings, season, seasonPlanning, config }))}>Imprimir estadísticas</Btn>
              <Btn variant="accent" icon={FileText} onClick={() => printSeasonReport(prepararDatosTemporada({ players, matches, trainings, season, seasonPlanning, config }))}>Informe de temporada</Btn>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatTile label="Jugados" value={ts.jugados} />
        <StatTile label="% Victorias" value={ts.jugados ? `${Math.round((ts.v / ts.jugados) * 100)}%` : "-"} accent={T.green} />
        <StatTile label="Goles/partido" value={ts.jugados ? (ts.gf / ts.jugados).toFixed(1) : "-"} />
        <StatTile label="Goles favor" value={ts.gf} />
        <StatTile label="Goles contra" value={ts.gc} />
      </div>

      {(() => {
        const conDatos = matches.filter((m) => m.posesionBalon !== "" && m.posesionBalon != null);
        const avgPosesion = conDatos.length ? Math.round(conDatos.reduce((s, m) => s + Number(m.posesionBalon), 0) / conDatos.length) : null;
        const totalTiros = matches.reduce((s, m) => s + (Number(m.tirosPuerta) || 0), 0);
        const totalOportunidades = matches.reduce((s, m) => s + (Number(m.oportunidadesFalladas) || 0), 0);
        return (
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="Posesión media" value={avgPosesion != null ? `${avgPosesion}%` : "-"} />
            <StatTile label="Tiros a puerta" value={totalTiros} />
            <StatTile label="Oportunidades falladas" value={totalOportunidades} accent={T.redLight} />
          </div>
        );
      })()}

      <Card className="p-4">
        <Eyebrow>Evolución de resultados por jornada</Eyebrow>
        <p className="text-xs mt-1" style={{ color: T.muted }}>Arriba si ganas, en medio si empatas y abajo si pierdes. El número de cada punto es el marcador (tus goles - goles del rival). Pasa el cursor o toca un punto para ver el rival.</p>
        {jugados.length ? <div className="mt-3"><GraficoResultados partidos={jugados} /></div> : <div className="text-sm mt-3" style={{ color: T.muted }}>Sin partidos jugados todavía.</div>}
      </Card>

      <Card className="p-4">
        <Eyebrow>Evolución de puntos acumulados por jornada</Eyebrow>
        <p className="text-xs mt-1" style={{ color: T.muted }}>Los puntos que llevas después de cada jornada (victoria 3, empate 1, derrota 0). La línea gris discontinua es el máximo posible si ganases todo.</p>
        {jugados.length ? <div className="mt-3"><GraficoPuntos partidos={jugados} /></div> : <div className="text-sm mt-3" style={{ color: T.muted }}>Sin partidos jugados todavía.</div>}
      </Card>

      <Card className="p-4">
        <Eyebrow>Rendimiento del equipo según valoración del entrenador</Eyebrow>
        <p className="text-xs mt-1" style={{ color: T.muted }}>Media de las notas (de 0 a 10) que pusiste a los jugadores en cada partido. La línea gris discontinua es la media de la temporada.</p>
        {valoraciones.length ? <div className="mt-3"><GraficoValoracion items={valoraciones} /></div> : <div className="text-sm mt-3" style={{ color: T.muted }}>Todavía no has valorado a los jugadores en ningún partido.</div>}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4">
          <Eyebrow>Máximos goleadores</Eyebrow>
          <div className="flex flex-col gap-2 mt-3">
            {topScorers.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="font-bold" style={{ color: T.navy }}>{p.apodo || p.nombre}</span>
                <span className="font-extrabold tabular-nums" style={{ color: T.red }}>{p.stats.goles}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <Eyebrow>Máximos asistentes</Eyebrow>
          <div className="flex flex-col gap-2 mt-3">
            {topAssists.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="font-bold" style={{ color: T.navy }}>{p.apodo || p.nombre}</span>
                <span className="font-extrabold tabular-nums" style={{ color: T.green }}>{p.stats.asistencias}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4">
          <Eyebrow>Ranking de MVP (mejor del partido)</Eyebrow>
          {topMvps.length ? (
            <div className="flex flex-col gap-2.5 mt-3">
              {topMvps.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-bold" style={{ color: T.navy }}>🏅 {p.apodo || p.nombre}</span>
                    <span className="font-extrabold tabular-nums" style={{ color: T.red }}>{p.stats.mvps}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "#F1F5F9" }}>
                    <div className="h-2 rounded-full" style={{ width: `${(p.stats.mvps / maxMvps) * 100}%`, background: T.red }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm mt-3" style={{ color: T.muted }}>Todavía no hay valoraciones de partido cargadas.</div>
          )}
        </Card>
        <Card className="p-4">
          <Eyebrow>MVP por partido</Eyebrow>
          {matchMvps.length ? (
            <div className="flex flex-col gap-1.5 mt-3 max-h-56 overflow-y-auto">
              {matchMvps.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span style={{ color: T.muted }}>{m.fecha} vs {m.rival}</span>
                  <span className="font-bold" style={{ color: T.navy }}>{m.player ? (m.player.apodo || m.player.nombre) : "-"} ({m.puntuacion})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm mt-3" style={{ color: T.muted }}>Sin datos todavía.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   CONFIGURACIÓN
   ============================================================ */

function resizeImageToDataUrl(file, maxSize = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) { if (width > maxSize) { height = Math.round(height * (maxSize / width)); width = maxSize; } }
        else { if (height > maxSize) { width = Math.round(width * (maxSize / height)); height = maxSize; } }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function LogoUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 400);
      onChange(dataUrl);
    } catch {
      alert("No se pudo procesar la imagen. Prueba con otra foto.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0" style={{ background: "#F7F8FA", border: `1px solid ${T.line}` }}>
        {value ? <img src={value} alt="Escudo del equipo" className="w-full h-full object-cover" /> : <span className="text-[11px] font-bold" style={{ color: T.muted }}>Sin imagen</span>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Btn variant="accent" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? "Procesando…" : "Subir imagen"}</Btn>
          {value && <Btn variant="ghost" onClick={() => onChange(null)}>Quitar</Btn>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <div className="text-[11px]" style={{ color: T.muted }}>Se ajusta automáticamente para ocupar poco espacio. Se usará en el menú lateral de la app.</div>
      </div>
    </div>
  );
}

function TaskImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 900);
      onChange(dataUrl);
    } catch {
      alert("No se pudo procesar la imagen. Prueba con otra foto.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="rounded-xl overflow-hidden max-w-sm" style={{ border: `1px solid ${T.line}` }}>
          <img src={value} alt="Representación gráfica de la tarea" className="w-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <Btn variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? "Procesando…" : value ? "Cambiar imagen" : "Subir imagen"}</Btn>
        {value && <Btn variant="ghost" onClick={() => onChange(null)}>Quitar</Btn>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}

function getVideoEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function TagEditor({ items, onChange, placeholder }) {
  const [val, setVal] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#EEF2F8", color: T.navy }}>
            {it}<button onClick={() => onChange(items.filter((_, idx) => idx !== i))}><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter" && val.trim()) { onChange([...items, val.trim()]); setVal(""); } }} />
        <Btn variant="ghost" onClick={() => { if (val.trim()) { onChange([...items, val.trim()]); setVal(""); } }}>Añadir</Btn>
      </div>
    </div>
  );
}

function Configuracion({ ctx }) {
  const { config, updateConfig } = ctx;
  const [tab, setTab] = useState("equipo");
  const set = (k, v) => updateConfig((p) => ({ ...p, [k]: v }));

  const tabs = [["equipo", "Equipo"], ["posiciones", "Posiciones"], ["sistemas", "Sistemas tácticos"], ["ranking", "Fórmula ranking"], ["estados", "Estados jugador"], ["campos", "Campos personalizados"], ["datos", "Copia de seguridad"]];

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div><Eyebrow>Configuración</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Ajustes de la plataforma</h1>
        <p className="text-sm mt-1" style={{ color: T.muted }}>Todo lo que ves aquí puede modificarse en cualquier momento. Nada está bloqueado de forma permanente.</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}` }}>{l}</button>
        ))}
      </div>

      {tab === "equipo" && (
        <Card className="p-5 flex flex-col gap-3">
          <Field label="Escudo / logotipo / foto del equipo">
            <LogoUploader value={config.logo} onChange={(dataUrl) => set("logo", dataUrl)} />
          </Field>
          <Field label="Nombre del equipo"><TextInput value={config.teamName} onChange={(e) => set("teamName", e.target.value)} /></Field>
          <Field label="Categoría"><TextInput value={config.category} onChange={(e) => set("category", e.target.value)} /></Field>
          <Field label="Temporada activa"><TextInput value={config.season} onChange={(e) => set("season", e.target.value)} /></Field>
          <Field label="Tipo de fútbol">
            <Select value={config.footballType} onChange={(e) => set("footballType", e.target.value)}>{Object.keys(config.tacticalSystems).map((t) => <option key={t}>{t}</option>)}</Select>
          </Field>
          <Field label="Color de la barra lateral (marca del club)">
            <div className="flex items-center gap-3">
              <input type="color" value={config.brandColor || T.navy} onChange={(e) => set("brandColor", e.target.value)} className="w-12 h-10 rounded-lg border cursor-pointer" style={{ borderColor: T.line }} />
              <TextInput value={config.brandColor || T.navy} onChange={(e) => set("brandColor", e.target.value)} className="flex-1" />
              <Btn variant="ghost" onClick={() => set("brandColor", "")}>Restablecer</Btn>
            </div>
            <div className="text-[11px] mt-1" style={{ color: T.muted }}>El color de la letra se ajusta solo (blanca u oscura) según lo claro u oscuro que sea el color elegido.</div>
          </Field>
        </Card>
      )}

      {tab === "posiciones" && (
        <Card className="p-5">
          <div className="text-sm mb-3" style={{ color: T.muted }}>Estas posiciones aparecen en las fichas de jugador y en las convocatorias.</div>
          <TagEditor items={config.positions} onChange={(v) => set("positions", v)} placeholder="Nueva posición…" />
        </Card>
      )}

      {tab === "sistemas" && (
        <Card className="p-5 flex flex-col gap-4">
          {Object.entries(config.tacticalSystems).map(([type, systems]) => (
            <div key={type}>
              <div className="text-xs font-bold uppercase mb-2" style={{ color: T.muted }}>{type}</div>
              <TagEditor items={systems} onChange={(v) => set("tacticalSystems", { ...config.tacticalSystems, [type]: v })} placeholder="Nuevo sistema (ej. 1-4-3-3)…" />
            </div>
          ))}
        </Card>
      )}

      {tab === "ranking" && (
        <Card className="p-5 flex flex-col gap-4">
          <div className="text-sm" style={{ color: T.muted }}>Ajusta el peso (%) de cada variable en el cálculo automático del ranking interno. El entrenador siempre puede sobrescribir manualmente el valor de un jugador concreto.</div>
          {Object.entries(config.rankingWeights).map(([k, v]) => (
            <Field key={k} label={RANKING_LABELS[k] || k}>
              <div className="flex items-center gap-3">
                <input type="range" min="-50" max="100" value={v} onChange={(e) => set("rankingWeights", { ...config.rankingWeights, [k]: Number(e.target.value) })} className="flex-1" />
                <span className="font-bold tabular-nums w-12 text-right" style={{ color: T.navy }}>{v}%</span>
              </div>
            </Field>
          ))}
        </Card>
      )}

      {tab === "estados" && (
        <Card className="p-5">
          <div className="text-sm mb-3" style={{ color: T.muted }}>Estados disponibles para la ficha de disponibilidad de cada jugador.</div>
          <TagEditor items={config.playerStates} onChange={(v) => set("playerStates", v)} placeholder="Nuevo estado…" />
        </Card>
      )}

      {tab === "campos" && (
        <Card className="p-5 flex flex-col gap-4">
          <div className="text-sm" style={{ color: T.muted }}>Añade campos personalizados sin modificar el código. Estos campos quedan disponibles como referencia para ampliar fichas de jugador en el futuro (por ejemplo: dominancia, perfil, velocidad punta).</div>
          <TagEditor items={config.customFields} onChange={(v) => set("customFields", v)} placeholder="Nuevo campo personalizado…" />
        </Card>
      )}

      {tab === "datos" && <BackupPanel ctx={ctx} />}
    </div>
  );
}

function BackupPanel({ ctx }) {
  const { config, players, matches, trainingsTodas: trainings, tasks, rivals, season, planning, seasonPlanning,
    updateConfig, updatePlayers, updateMatches, updateTrainings, updateTasks, updateRivals, updateSeason, updatePlanning, updateSeasonPlanning } = ctx;
  const fileInputRef = useRef(null);
  const shareSessionsInputRef = useRef(null);
  const shareCyclesInputRef = useRef(null);
  const sharePackInputRef = useRef(null);
  const shareTasksInputRef = useRef(null);
  const shareMatchesInputRef = useRef(null);
  const sharePlayersInputRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [shareMsg, setShareMsg] = useState("");

  const exportData = () => {
    const data = { config, players, matches, trainings, tasks, rivals, season, planning, exportadoEl: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pz-backup-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    setMsg("Copia exportada. Guarda el archivo donde lo encuentres fácil.");
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.config) updateConfig(data.config);
        if (data.players) updatePlayers(data.players);
        if (data.matches) updateMatches(data.matches);
        if (data.trainings) updateTrainings(data.trainings);
        if (data.tasks) updateTasks(data.tasks);
        if (data.rivals) updateRivals(data.rivals);
        if (data.season) updateSeason(data.season);
        if (data.planning) updatePlanning(data.planning);
        setMsg("Datos importados correctamente en este dispositivo.");
      } catch {
        setMsg("Ese archivo no es una copia de seguridad válida de PZ.");
      }
    };
    reader.readAsText(file);
  };

  // Compartir tareas o partidos entre entrenadores: exporta solo esa parte, y al importar
  // se SUMA a lo que ya existe en el dispositivo (nunca reemplaza ni borra nada propio).
  const exportShare = (key, list, filePrefix) => {
    const data = { tipo: `pz-${key}`, [key]: list, exportadoEl: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filePrefix}-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    setShareMsg(`${list.length} ${key === "tasks" ? "tareas" : key === "players" ? "jugadores" : "partidos"} exportados para compartir.`);
  };

  const importShareMerge = (file, key, updater, label) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const incoming = data[key];
        if (!Array.isArray(incoming)) { setShareMsg("Ese archivo no contiene " + label + " para compartir."); return; }
        const withNewIds = incoming.map((item) => ({ ...item, id: uid() }));
        updater((prev) => [...prev, ...withNewIds]);
        setShareMsg(`Se sumaron ${withNewIds.length} ${label} a los que ya tenías — no se borró nada tuyo.`);
      } catch {
        setShareMsg("Ese archivo no es válido.");
      }
    };
    reader.readAsText(file);
  };

  // ---- Compartir sesiones, ciclos o un paquete completo ----
  // Igual que lo anterior: al importar siempre se SUMA y cada elemento recibe un
  // identificador nuevo, así que nunca se pisa ni se borra nada de lo que ya tienes.
  const exportContenido = (partes, prefijo) => {
    const data = { tipo: "pz-paquete", exportadoEl: new Date().toISOString() };
    const resumen = [];
    if (partes.includes("tasks")) { data.tasks = tasks; resumen.push(`${tasks.length} tareas`); }
    if (partes.includes("trainings")) {
      // La asistencia se deja fuera: pertenece a los jugadores de quien exporta.
      data.trainings = trainings.map((t) => ({ ...t, asistencia: [] }));
      resumen.push(`${trainings.length} sesiones`);
    }
    if (partes.includes("ciclos")) {
      const macro = seasonPlanning?.macrociclo || [];
      const mens = seasonPlanning?.mensual || [];
      const sem = season?.weeks || [];
      data.ciclos = { macrociclo: macro, mensual: mens, semanas: sem };
      resumen.push(`${macro.length + mens.length + sem.length} elementos de ciclos`);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${prefijo}-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    setShareMsg(`Exportado para compartir: ${resumen.join(", ")}.`);
  };

  const importarContenido = (file, partes) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const resumen = [];
        const mapaTareas = {}; // id antiguo de la tarea -> id nuevo, para mantener enlazadas las sesiones

        if (partes.includes("tasks") && Array.isArray(data.tasks) && data.tasks.length) {
          const nuevas = data.tasks.map((t) => { const id = uid(); mapaTareas[t.id] = id; return { ...t, id }; });
          updateTasks((prev) => [...prev, ...nuevas]);
          resumen.push(`${nuevas.length} tareas`);
        }

        if (partes.includes("trainings") && Array.isArray(data.trainings) && data.trainings.length) {
          const conIds = (arr) => (arr || []).map((x) => ({
            ...x, id: uid(),
            libraryTaskId: x.libraryTaskId && mapaTareas[x.libraryTaskId] ? mapaTareas[x.libraryTaskId] : null,
          }));
          const nuevas = data.trainings.map((t) => ({
            ...t, id: uid(), fecha: todayISO(), asistencia: [],
            calentamiento: { ...(t.calentamiento || {}), tareas: conIds(t.calentamiento?.tareas) },
            tareas: conIds(t.tareas),
            aplicacionJuego: { ...(t.aplicacionJuego || {}), tareas: conIds(t.aplicacionJuego?.tareas) },
            vueltaCalma: { ...(t.vueltaCalma || {}), tareas: conIds(t.vueltaCalma?.tareas), balonParado: conIds(t.vueltaCalma?.balonParado) },
          }));
          updateTrainings((prev) => [...prev, ...nuevas]);
          resumen.push(`${nuevas.length} sesiones (con la fecha de hoy: cámbiala cuando las programes)`);
        }

        if (partes.includes("ciclos") && data.ciclos && typeof data.ciclos === "object") {
          const conId = (arr) => (Array.isArray(arr) ? arr : []).map((x) => ({ ...x, id: uid() }));
          const macro = conId(data.ciclos.macrociclo);
          const mens = conId(data.ciclos.mensual);
          const sem = conId(data.ciclos.semanas);
          if (macro.length || mens.length) {
            updateSeasonPlanning((p) => ({ ...p, macrociclo: [...(p.macrociclo || []), ...macro], mensual: [...(p.mensual || []), ...mens] }));
          }
          if (sem.length) {
            updateSeason((p) => ({
              ...p,
              weeks: [...(p.weeks || []), ...sem.map((w, i) => ({ ...w, numero: (p.weeks || []).length + i + 1, fechaInicio: todayISO() }))],
            }));
          }
          if (macro.length || mens.length || sem.length) resumen.push("ciclos");
        }

        setShareMsg(resumen.length
          ? `Se sumaron ${resumen.join(", ")} a lo que ya tenías — no se borró nada tuyo.`
          : "Ese archivo no contiene lo que se quiere sumar aquí.");
      } catch {
        setShareMsg("Ese archivo no es válido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="text-sm" style={{ color: T.muted }}>
        Los datos se guardan únicamente en este navegador/dispositivo. Usa esta copia de seguridad para
        pasar tu información de un dispositivo a otro (por ejemplo, del móvil a la tablet) o para no perder
        nada si cambias de equipo o navegador.
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn variant="accent" icon={Save} onClick={exportData}>Exportar copia de seguridad</Btn>
        <Btn variant="ghost" icon={Plus} onClick={() => fileInputRef.current?.click()}>Importar copia de seguridad</Btn>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) importData(e.target.files[0]); e.target.value = ""; }} />
      </div>
      {msg && <div className="text-xs font-bold" style={{ color: T.green }}>{msg}</div>}
      <div className="text-[11px] mt-1" style={{ color: T.muted }}>
        Importar una copia reemplaza los datos actuales de este dispositivo por los del archivo. Exporta antes si no estás seguro.
      </div>

      <div className="pt-4 border-t" style={{ borderColor: T.line }}>
        <Eyebrow>Compartir con otro entrenador</Eyebrow>
        <div className="text-sm mt-1" style={{ color: T.muted }}>
          A diferencia de la copia de seguridad completa, esto <b>no reemplaza nada</b>: al importar, las tareas, partidos, jugadores, sesiones o ciclos
          del archivo se <b>suman</b> a los que ya tienes, sin borrar ni pisar los tuyos.
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Tareas</span>
            <Btn variant="ghost" icon={Save} onClick={() => exportShare("tasks", tasks, "pz-tareas-compartir")}>Exportar mis tareas</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => shareTasksInputRef.current?.click()}>Sumar tareas de un archivo</Btn>
            <input ref={shareTasksInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importShareMerge(e.target.files[0], "tasks", updateTasks, "tareas"); e.target.value = ""; }} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Partidos</span>
            <Btn variant="ghost" icon={Save} onClick={() => exportShare("matches", matches, "pz-partidos-compartir")}>Exportar mis partidos</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => shareMatchesInputRef.current?.click()}>Sumar partidos de un archivo</Btn>
            <input ref={shareMatchesInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importShareMerge(e.target.files[0], "matches", updateMatches, "partidos"); e.target.value = ""; }} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Jugadores</span>
            <Btn variant="ghost" icon={Save} onClick={() => exportShare("players", players, "pz-jugadores-compartir")}>Exportar mis jugadores</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => sharePlayersInputRef.current?.click()}>Sumar jugadores de un archivo</Btn>
            <input ref={sharePlayersInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importShareMerge(e.target.files[0], "players", updatePlayers, "jugadores"); e.target.value = ""; }} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Sesiones</span>
            <Btn variant="ghost" icon={Save} onClick={() => exportContenido(["trainings"], "pz-sesiones-compartir")}>Exportar mis sesiones</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => shareSessionsInputRef.current?.click()}>Sumar sesiones de un archivo</Btn>
            <input ref={shareSessionsInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importarContenido(e.target.files[0], ["trainings"]); e.target.value = ""; }} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Ciclos</span>
            <Btn variant="ghost" icon={Save} onClick={() => exportContenido(["ciclos"], "pz-ciclos-compartir")}>Exportar mis ciclos</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => shareCyclesInputRef.current?.click()}>Sumar ciclos de un archivo</Btn>
            <input ref={shareCyclesInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importarContenido(e.target.files[0], ["ciclos"]); e.target.value = ""; }} />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: T.line }}>
            <span className="text-xs font-bold w-24" style={{ color: T.navy }}>Paquete</span>
            <Btn variant="accent" icon={Save} onClick={() => exportContenido(["tasks", "trainings", "ciclos"], "pz-paquete-compartir")}>Exportar tareas + sesiones + ciclos</Btn>
            <Btn variant="ghost" icon={Plus} onClick={() => sharePackInputRef.current?.click()}>Sumar un paquete de un archivo</Btn>
            <input ref={sharePackInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) importarContenido(e.target.files[0], ["tasks", "trainings", "ciclos"]); e.target.value = ""; }} />
          </div>
        </div>
        {shareMsg && <div className="text-xs font-bold mt-2" style={{ color: T.green }}>{shareMsg}</div>}
      </div>
    </Card>
  );
}

/* ============================================================
   ANÁLISIS DEL RIVAL
   ============================================================ */

function printRival(r, config, hist) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const kv = (label, value) => value ? `<div class="item"><b>${esc(label)}:</b> ${esc(value)}</div>` : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(r.nombre)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 12px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; } .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 18px 22px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .title { font-size: 20px; font-weight: 900; color: #0B1F3A; border-bottom: 3px solid #0B1F3A; padding-bottom: 8px; margin-bottom: 12px; }
    .item { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; margin-bottom: 5px; font-size: 11px; }
    @media print { html, body { background: #fff; } .toolbar { display: none !important; } .sheet { box-shadow: none; padding: 0; } body { padding: 0; } }
  </style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="title">${esc(r.nombre)}</div>
      ${kv("Sistema habitual", r.sistemas)}
      ${kv("Fortalezas", r.fortalezas)}
      ${kv("Debilidades", r.debilidades)}
      ${kv("Jugadores relevantes", r.jugadoresRelevantes)}
      ${kv("Aspecto ofensivo", r.ofensivo)}
      ${kv("Aspecto defensivo", r.defensivo)}
      ${kv("Transiciones", r.transiciones)}
      ${kv("Balón parado", r.balonParado)}
      ${kv("Observaciones", r.observaciones)}
      ${kv("Historial", r.historial)}
      ${hist?.length ? `<div class="item"><b>Enfrentamientos registrados:</b> ${hist.map((m) => `${esc(m.fecha)}: ${esc(m.resultadoFinal)}`).join(", ")}</div>` : ""}
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

function RivalModule({ ctx }) {
  const { rivals, updateRivals, updateMatches, matches, config } = ctx;
  const [openId, setOpenId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const editing = rivals.find((r) => r.id === openId);

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Eyebrow>Análisis del rival</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{rivals.length} rivales registrados</h1></div>
        <Btn icon={Plus} variant="accent" onClick={() => setShowNew(true)}>Nuevo rival</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rivals.map((r) => {
          const hist = matches.filter((m) => m.rival === r.nombre);
          return (
            <Card key={r.id} className="p-4 cursor-pointer hover:shadow-md transition relative" onClick={() => setOpenId(r.id)}>
              <div className="absolute top-3 right-3 flex gap-1 z-10">
                <button onClick={(e) => { e.stopPropagation(); printRival(r, config, hist); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Imprimir / PDF">
                  <Printer size={14} style={{ color: T.muted }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setOpenId(r.id); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                  <Edit3 size={14} style={{ color: T.muted }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); if (confirm("¿Eliminar este rival?")) updateRivals((prev) => prev.filter((x) => x.id !== r.id)); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                  <Trash2 size={14} style={{ color: T.redLight }} />
                </button>
              </div>
              <div className="font-extrabold pr-24" style={{ color: T.navy }}>{r.nombre}</div>
              <div className="text-xs mt-0.5" style={{ color: T.muted }}>Sistema habitual: {r.sistemas || "-"}</div>
              <div className="text-xs mt-2 line-clamp-2" style={{ color: T.text }}>{r.fortalezas}</div>
              <Pill className="mt-2">{hist.length} enfrentamiento(s) registrado(s)</Pill>
            </Card>
          );
        })}
        {!rivals.length && <div className="text-sm" style={{ color: T.muted }}>Todavía no hay rivales registrados.</div>}
      </div>
      {showNew && <RivalForm onClose={() => setShowNew(false)} onSave={(r) => { updateRivals((prev) => [...prev, r]); setShowNew(false); }} />}
      {editing && <RivalForm initial={editing} matches={matches.filter((m) => m.rival === editing.nombre)}
        onClose={() => setOpenId(null)}
        onSave={(r) => {
          const antes = editing.nombre;
          updateRivals((prev) => prev.map((x) => x.id === r.id ? r : x));
          if (antes && r.nombre && antes !== r.nombre) updateMatches((prev) => prev.map((m) => (m.rival === antes ? { ...m, rival: r.nombre } : m)));
          setOpenId(null);
        }}
        onDelete={() => { if (confirm("¿Eliminar este rival?")) { updateRivals((prev) => prev.filter((x) => x.id !== editing.id)); setOpenId(null); } }} />}
    </div>
  );
}

function RivalForm({ initial, matches, onClose, onSave, onDelete }) {
  const [f, setF] = useState(initial || {
    id: uid(), nombre: "", sistemas: "", fortalezas: "", debilidades: "", jugadoresRelevantes: "",
    ofensivo: "", defensivo: "", transiciones: "", balonParado: "", observaciones: "", historial: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal title={initial ? "Editar rival" : "Nuevo rival"} onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Rival" className="sm:col-span-2"><TextInput value={f.nombre} onChange={(e) => set("nombre", e.target.value)} /></Field>
        <Field label="Sistemas utilizados"><TextInput value={f.sistemas} onChange={(e) => set("sistemas", e.target.value)} /></Field>
        <Field label="Jugadores relevantes"><TextInput value={f.jugadoresRelevantes} onChange={(e) => set("jugadoresRelevantes", e.target.value)} /></Field>
        <Field label="Fortalezas"><TextArea value={f.fortalezas} onChange={(e) => set("fortalezas", e.target.value)} /></Field>
        <Field label="Debilidades"><TextArea value={f.debilidades} onChange={(e) => set("debilidades", e.target.value)} /></Field>
        <Field label="Comportamientos ofensivos"><TextArea value={f.ofensivo} onChange={(e) => set("ofensivo", e.target.value)} /></Field>
        <Field label="Comportamientos defensivos"><TextArea value={f.defensivo} onChange={(e) => set("defensivo", e.target.value)} /></Field>
        <Field label="Transiciones"><TextArea value={f.transiciones} onChange={(e) => set("transiciones", e.target.value)} /></Field>
        <Field label="Balón parado"><TextArea value={f.balonParado} onChange={(e) => set("balonParado", e.target.value)} /></Field>
        <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>
      </div>
      {matches && matches.length > 0 && (
        <div className="mt-4">
          <Eyebrow>Historial de enfrentamientos (automático, según partidos registrados)</Eyebrow>
          {(() => {
            const jugados = matches.filter((m) => !(m.fecha && m.fecha > todayISO()));
            const resumen = jugados.reduce((acc, m) => {
              const { resultado } = resultadoPropio(m);
              if (resultado === "P") return acc;
              const zona = m.esLocal ? "local" : "visitante";
              acc.total++;
              acc[resultado]++;
              acc[zona][resultado]++;
              return acc;
            }, { total: 0, V: 0, E: 0, D: 0, local: { V: 0, E: 0, D: 0 }, visitante: { V: 0, E: 0, D: 0 } });
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 mb-3">
                <div className="p-2.5 rounded-lg text-center" style={{ background: "#F5F7FA" }}>
                  <div className="text-lg font-extrabold" style={{ color: T.navy }}>{resumen.total}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>Enfrentamientos</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: "#E7F6ED" }}>
                  <div className="text-lg font-extrabold" style={{ color: T.green }}>{resumen.V}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>Victorias</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: "#FFF6DE" }}>
                  <div className="text-lg font-extrabold" style={{ color: "#B8860B" }}>{resumen.E}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>Empates</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: "#FCEAEC" }}>
                  <div className="text-lg font-extrabold" style={{ color: T.redLight }}>{resumen.D}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>Derrotas</div>
                </div>
                <div className="col-span-2 text-xs mt-1" style={{ color: T.muted }}>
                  Como local: {resumen.local.V}V - {resumen.local.E}E - {resumen.local.D}D
                </div>
                <div className="col-span-2 text-xs mt-1" style={{ color: T.muted }}>
                  Como visitante: {resumen.visitante.V}V - {resumen.visitante.E}E - {resumen.visitante.D}D
                </div>
              </div>
            );
          })()}
          <div className="flex flex-col gap-1.5 mt-2">
            {matches.map((m) => {
              const { resultado } = resultadoPropio(m);
              const etiqueta = resultado === "P" ? "Programado" : resultado === "V" ? "Victoria" : resultado === "E" ? "Empate" : "Derrota";
              return (
                <div key={m.id} className="text-sm flex items-center gap-2" style={{ color: T.text }}>
                  <span>{m.fecha} · {m.esLocal ? "Local" : "Visitante"} · {m.resultadoFinal}</span>
                  <Pill color={resultado === "P" ? T.muted : resultado === "V" ? T.green : resultado === "E" ? "#B8860B" : T.redLight}>{etiqueta}</Pill>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="accent" icon={Save} onClick={() => onSave(f)}>Guardar rival</Btn></div>
      </div>
    </Modal>
  );
}

/* ============================================================
   TEMPORADA — anual → mensual → semanal
   ============================================================ */

function CuerpoTecnicoEditor({ items, onChange }) {
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const add = () => { if (!nombre.trim()) return; onChange([...items, { id: uid(), nombre: nombre.trim(), cargo: cargo.trim() }]); setNombre(""); setCargo(""); };
  const remove = (id) => onChange(items.filter((x) => x.id !== id));
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between gap-2 p-2 rounded-lg" style={{ background: "#F7F8FA" }}>
          <div className="text-sm"><span className="font-bold" style={{ color: T.navy }}>{it.nombre}</span>{it.cargo ? ` · ${it.cargo}` : ""}</div>
          <button onClick={() => remove(it.id)}><Trash2 size={14} style={{ color: T.redLight }} /></button>
        </div>
      ))}
      {!items.length && <div className="text-xs" style={{ color: T.muted }}>Sin miembros del cuerpo técnico registrados.</div>}
      <div className="flex gap-2 flex-wrap">
        <TextInput placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="flex-1 min-w-[140px]" />
        <TextInput placeholder="Cargo (ej: Preparador físico)" value={cargo} onChange={(e) => setCargo(e.target.value)} className="flex-1 min-w-[140px]" />
        <Btn variant="ghost" icon={Plus} onClick={add}>Añadir</Btn>
      </div>
    </div>
  );
}

function PlanItemModalForm({ title, fields, initial, onClose, onSave, onDelete, matches }) {
  const [f, setF] = useState(initial);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const linkMatch = (matchId, fld) => {
    const m = matches?.find((x) => x.id === matchId);
    setF((p) => ({ ...p, [fld.key]: matchId || null, ...(m ? { fecha: m.fecha, rival: m.rival } : {}) }));
  };
  return (
    <Modal title={title} onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((fld) => (
          <Field key={fld.key} label={fld.label} className={fld.wide ? "sm:col-span-2" : ""}>
            {fld.type === "textarea" ? <TextArea value={f[fld.key] || ""} onChange={(e) => set(fld.key, e.target.value)} />
              : fld.type === "date" ? <TextInput type="date" value={f[fld.key] || ""} onChange={(e) => set(fld.key, e.target.value)} />
              : fld.type === "select" ? <Select value={f[fld.key] || ""} onChange={(e) => set(fld.key, e.target.value)}>{fld.options.map((o) => <option key={o}>{o}</option>)}</Select>
              : fld.type === "matchRef" ? (
                <div>
                  <Select value={f[fld.key] || ""} onChange={(e) => linkMatch(e.target.value, fld)}>
                    <option value="">— Cargar manualmente (sin vincular) —</option>
                    {[...(matches || [])].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((m) => (
                      <option key={m.id} value={m.id}>{m.fecha} vs {m.rival} ({m.competicion}){m.resultadoFinal ? ` · ${m.resultadoFinal}` : ""}</option>
                    ))}
                  </Select>
                  {f[fld.key] && <div className="text-[11px] mt-1" style={{ color: T.green }}>✓ Vinculado — fecha y rival se toman del partido registrado.</div>}
                </div>
              )
              : fld.type === "matchMultiRef" ? (
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border rounded-lg p-2" style={{ borderColor: T.line }}>
                  {[...(matches || [])].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((m) => {
                    const list = f[fld.key] || [];
                    const checked = list.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={checked} onChange={(e) => set(fld.key, e.target.checked ? [...list, m.id] : list.filter((id) => id !== m.id))} />
                        {m.fecha} vs {m.rival} ({m.competicion}){m.resultadoFinal ? ` · ${m.resultadoFinal}` : ""}
                      </label>
                    );
                  })}
                  {!matches?.length && <div className="text-xs" style={{ color: T.muted }}>Todavía no hay partidos registrados.</div>}
                </div>
              )
              : <TextInput value={f[fld.key] || ""} onChange={(e) => set(fld.key, e.target.value)} disabled={fld.readOnlyIfLinked && !!f[fld.readOnlyIfLinked]} />}
          </Field>
        ))}
      </div>
      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="accent" icon={Save} onClick={() => onSave(f)}>Guardar</Btn></div>
      </div>
    </Modal>
  );
}

/* ============================================================
   SISTEMA TIPO — traer contenido de la guía de temporada
   Todo lo que se trae es una COPIA editable: no se enlaza con el original
   y nunca se borra ni se pisa nada de lo que la persona ya tenga.
   El contenido llega desde el servidor (/api/sistema-tipo) ya filtrado
   según el plan de cada persona.
   ============================================================ */
const CAL_KEY = "pz-sistema-tipo-calendarios";
const DIAS_SEMANA = [[1, "L"], [2, "M"], [3, "X"], [4, "J"], [5, "V"], [6, "S"], [0, "D"]];
const NOMBRE_PLAN_ST = { esencial: "Esencial", entrenador: "Entrenador", metodologo: "Metodólogo" };

let _sistemaTipoCache = null;
async function cargarSistemaTipo(forzar = false) {
  if (_sistemaTipoCache && !forzar) return _sistemaTipoCache;
  const { data } = await supabase.auth.getSession();
  const token = MODO_DEMO ? "demo" : data?.session?.access_token;
  if (!token) throw new Error("sin-sesion");
  const res = await fetch("/api/sistema-tipo", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (res.status === 401) throw new Error("sin-sesion");
  if (!res.ok) throw new Error("error");
  _sistemaTipoCache = await res.json();
  return _sistemaTipoCache;
}

let _objetivosCache = null;
async function cargarObjetivos(forzar = false) {
  if (_objetivosCache && !forzar) return _objetivosCache;
  const { data } = await supabase.auth.getSession();
  const token = MODO_DEMO ? "demo" : data?.session?.access_token;
  if (!token) throw new Error("sin-sesion");
  const res = await fetch("/api/sesiones-objetivos", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (res.status === 401) throw new Error("sin-sesion");
  if (!res.ok) throw new Error("error");
  _objetivosCache = await res.json();
  return _objetivosCache;
}

// ---- Fechas (se calculan en hora local para evitar desfases de un día) ----
function aISOlocal(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function sumarDiasISO(iso, n) { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return aISOlocal(d); }
function lunesDeISO(iso) { const d = new Date(`${iso}T12:00:00`); const dow = d.getDay(); d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow)); return aISOlocal(d); }
function proximoLunesISO() { const hoy = todayISO(); const l = lunesDeISO(hoy); return l === hoy ? hoy : sumarDiasISO(l, 7); }
function calendarioPorDefecto(guia) { return { inicio: proximoLunesISO(), dias: guia?.sesionesPorSemana === 3 ? [1, 3, 5] : [1, 3] }; }
function leerCalendarios() { try { return JSON.parse(almacen().getItem(claveLocal(CAL_KEY)) || "{}") || {}; } catch { return {}; } }
function guardarCalendarios(c) { try { almacen().setItem(claveLocal(CAL_KEY), JSON.stringify(c)); } catch { /* sin almacenamiento: no pasa nada */ } }
function inicioSemanaST(cal, numSemana) { return sumarDiasISO(lunesDeISO(cal.inicio), (numSemana - 1) * 7); }
function fechaSesionST(cal, numSemana, indice) {
  const dias = [...(cal.dias?.length ? cal.dias : [1])].map((d) => (d === 0 ? 7 : d)).sort((a, b) => a - b);
  return sumarDiasISO(inicioSemanaST(cal, numSemana), dias[Math.min(indice, dias.length - 1)] - 1);
}

// ---- Textos ----
const cap1 = (t) => { const s = String(t || "").trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };
function separarEstrategia(txt) {
  const partes = String(txt || "").split(/;?\s*estrategia:\s*/i);
  const limpia = (x) => x.trim().replace(/[;,\s]+$/, "");
  return { tactico: limpia(partes[0] || ""), estrategico: limpia(partes.slice(1).join(" ")) };
}
function tipoDiaDesdeTitulo(t) {
  if (/amistoso/i.test(t)) return "Amistoso";
  if (/f[ií]sic/i.test(t)) return "Físico";
  if (/t[aá]ctic|estrategia|sistema|posici[oó]n/i.test(t)) return "Táctico";
  return "Técnico";
}
const fisicosDe = (s) => [s.fisicos, s.coordinativos ? `Coordinativos: ${s.coordinativos}` : ""].filter(Boolean).join(". ");

// ---- Conversores: Sistema Tipo → estructuras de la plataforma ----
function sesionDesdeST(guia, semana, s, indice, cal, players) {
  const { tactico, estrategico } = separarEstrategia(s.tacticos);
  return {
    id: uid(), numeroSesion: String(s.numero), semana: String(semana.numero),
    fecha: fechaSesionST(cal, semana.numero, indice), hora: "19:00", lugar: "", duracion: 90, numJugadores: players.length,
    objetivos: { fisicos: cap1(fisicosDe(s)), tecnicos: cap1(s.tecnicos), tacticos: cap1(tactico), estrategicos: cap1(estrategico), psicologicos: cap1(s.psicologicos) },
    calentamiento: { tareas: [], actividad: "", objetivo: "", materiales: "", tiempo: 15, notas: "" },
    tareas: [],
    aplicacionJuego: { tareas: [], tipo: "Partido condicionado", objetivo: "", tiempo: 20, observaciones: "" },
    vueltaCalma: { tareas: [], estiramientos: "", actividad: "", tiempo: 10, observaciones: "", balonParado: [] },
    notas: `Sistema Tipo · ${guia.nombre} · Sesión ${s.numero}: ${s.titulo}.\nObjetivo: ${cap1(s.objetivo)}`,
    asistencia: asistenciaInicial(players),
    origenSistemaTipo: { guia: guia.id, sesion: s.numero },
  };
}

/* Sesión de las 50 por objetivos → entrenamiento editable (con las tareas ya montadas) */
function sesionDesdeObjetivos(s, tareas, players, bloqueNombre) {
  const porCodigo = new Map(tareas.map((t) => [t.codigo, t]));
  const mk = (cod, tiempo) => { const t = cod && porCodigo.get(cod); return t ? { ...libTaskFromLibrary(t), tiempo } : null; };
  const lista = (a) => a.filter(Boolean);
  const tm = s.tiempos, o = s.objetivos;
  const notas = `Sesión ${s.n} de las 50 por objetivos · ${bloqueNombre}: ${s.titulo}.\nObjetivo: ${s.objetivo}` +
    (s.ideas ? `\n\nIdeas clave: ${s.ideas}` : "") + (s.adaptacion ? `\n\nAdaptación: ${s.adaptacion}` : "");
  return {
    id: uid(), numeroSesion: String(s.n), semana: "", fecha: todayISO(), hora: "19:00", lugar: "", duracion: 90, numJugadores: players.length,
    objetivos: { fisicos: o.fisicos, tecnicos: o.tecnicos, tacticos: o.tacticos, estrategicos: o.estrategicos, psicologicos: o.psicologicos },
    calentamiento: { tareas: lista([mk("CAL-01", 6), mk(s.calentamiento.rondo, 5), mk(s.calentamiento.tercero, 4)]), actividad: "", objetivo: "", materiales: "", tiempo: 15, notas: "" },
    tareas: lista([mk(s.A, tm.A), mk(s.B, tm.B), mk(s.C, tm.C)]),
    aplicacionJuego: { tareas: lista([mk(s.partido, tm.P)]), tipo: "Partido condicionado", objetivo: "", tiempo: tm.P || 0, observaciones: "" },
    vueltaCalma: { tareas: lista([mk(s.definicion, tm.D), mk("VC-01", 10)]), estiramientos: "", actividad: "", tiempo: 10, observaciones: "", balonParado: [] },
    notas, frases: [...(s.correcciones || [])], asistencia: asistenciaInicial(players),
    origenObjetivos: { sesion: s.n },
  };
}

function semanaDesdeST(guia, semana, cal, numero) {
  const abiertas = semana.sesiones.filter((s) => !s.bloqueada);
  const juntar = (fn) => abiertas.map((s) => { const t = fn(s); return t ? `Sesión ${s.numero}: ${cap1(t)}` : ""; }).filter(Boolean).join("\n");
  return {
    id: uid(), numero, fechaInicio: inicioSemanaST(cal, semana.numero),
    objetivo: `${semana.titulo}${semana.objetivoSemanal ? ` — ${cap1(semana.objetivoSemanal)}` : ""}`,
    contenidoFisico: juntar(fisicosDe), contenidoTecnico: juntar((s) => s.tecnicos),
    contenidoTactico: juntar((s) => s.tacticos), contenidoPsicologico: juntar((s) => s.psicologicos),
    cargaPrevista: "Media",
    origenSistemaTipo: { guia: guia.id, semana: semana.numero },
  };
}

function pretemporadaDesdeST(guia, cal) {
  const pre = guia.ciclos.find((c) => c.id === "pretemporada");
  if (!pre) return null;
  const semanas = pre.semanas;
  const dias = [];
  semanas.forEach((w) => w.sesiones.forEach((s, i) => {
    if (s.bloqueada) return;
    dias.push({
      id: uid(), fecha: fechaSesionST(cal, w.numero, i), tipo: tipoDiaDesdeTitulo(s.titulo),
      notas: `Sesión ${s.numero}: ${s.titulo}. Objetivo: ${cap1(s.objetivo)}`,
      origenSistemaTipo: { guia: guia.id, sesion: s.numero },
    });
  }));
  return {
    fechaInicio: inicioSemanaST(cal, semanas[0].numero),
    fechaFin: sumarDiasISO(inicioSemanaST(cal, semanas[semanas.length - 1].numero), 6),
    objetivos: semanas.map((w) => `Semana ${w.numero}. ${w.titulo}${w.objetivoSemanal ? `: ${cap1(w.objetivoSemanal)}` : ""}`).join("\n"),
    dias,
  };
}

function cicloDesdeST(guia, ciclo, cal) {
  const n = ciclo.semanas.map((w) => w.numero);
  return {
    id: uid(), nombre: `${ciclo.nombre} — ${ciclo.subtitulo}`,
    fechaInicio: inicioSemanaST(cal, Math.min(...n)), fechaFin: sumarDiasISO(inicioSemanaST(cal, Math.max(...n)), 6),
    objetivo: `${ciclo.subtitulo}.\n${ciclo.semanas.map((w) => `Semana ${w.numero}: ${w.titulo}`).join("\n")}`,
    sesionesPlanificadas: ciclo.semanas.reduce((n, w) => n + w.sesiones.length, 0),
    origenSistemaTipo: { guia: guia.id, ciclo: ciclo.id },
  };
}

function mesDesdeST(guia, semanas, cal) {
  const a = semanas[0].numero, b = semanas[semanas.length - 1].numero;
  const nombreMes = new Date(`${inicioSemanaST(cal, a)}T12:00:00`).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const ses = semanas.flatMap((w) => w.sesiones);
  return {
    id: uid(), mes: `${cap1(nombreMes)} · ${a === b ? `Semana ${a}` : `Semanas ${a}–${b}`}`,
    objetivo: semanas.map((w) => `Semana ${w.numero}: ${w.titulo}`).join("\n"),
    eventosClave: `Sistema Tipo: sesiones ${ses[0].numero}–${ses[ses.length - 1].numero} (${ses.length} sesiones).`,
    sesionesPlanificadas: ses.length,
    cargaResumen: "",
    origenSistemaTipo: { guia: guia.id, desdeSemana: a, hastaSemana: b },
  };
}

// ---- Ventana de las 50 sesiones por objetivos ----
function SesionesObjetivosModal({ onClose, onTraer, traidos }) {
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error | sinsesion
  const [datos, setDatos] = useState(null);
  const [bloque, setBloque] = useState(1);
  const [abierta, setAbierta] = useState(null);
  const [locales, setLocales] = useState([]);
  useEffect(() => {
    cargarObjetivos().then((d) => { setDatos(d); setEstado("listo"); }).catch((e) => setEstado(e.message === "sin-sesion" ? "sinsesion" : "error"));
  }, []);
  const b = datos?.bloques.find((x) => x.n === bloque);
  const nombreTarea = (c) => datos?.tareas.find((t) => t.codigo === c)?.nombre || c;
  const ya = (n) => traidos.has(n) || locales.includes(n);
  const traer = (s) => {
    if (ya(s.n) && !confirm("Ya trajiste esta sesión antes. ¿Traerla otra vez? Se añadirá una copia nueva, sin tocar la anterior.")) return;
    onTraer(s, datos.tareas, b.nombre); setLocales((l) => [...l, s.n]);
  };
  return (
    <Modal title="50 sesiones por objetivos tácticos" onClose={onClose} wide>
      {estado === "cargando" && <div className="text-sm" style={{ color: T.muted }}>Cargando las sesiones de tu plan...</div>}
      {estado === "sinsesion" && <div className="text-sm" style={{ color: T.muted }}>Inicia sesión con tu cuenta para ver las sesiones.</div>}
      {estado === "error" && <div className="text-sm" style={{ color: T.red }}>No se pudieron cargar las sesiones. Inténtalo de nuevo en unos minutos.</div>}
      {estado === "listo" && b && (
        <div className="flex flex-col gap-3">
          <div className="text-xs" style={{ color: T.muted }}>{MODO_DEMO ? "La demostración incluye" : "Tu plan incluye"} {datos.sesionesDisponibles} de las {datos.totalSesiones} sesiones. Al traer una, se crea un entrenamiento con todas sus tareas, que puedes cambiar, quitar o completar.</div>
          <div className="flex flex-wrap gap-1.5">
            {datos.bloques.map((x) => (
              <button key={x.n} onClick={() => { setBloque(x.n); setAbierta(null); }} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" title={x.nombre}
                style={{ background: x.n === bloque ? T.navy : "#EEF2F7", color: x.n === bloque ? "#fff" : T.navy }}>{x.n}</button>
            ))}
          </div>
          <div><div className="font-extrabold" style={{ color: T.navy }}>Bloque {b.n} · {b.nombre}</div><div className="text-xs mt-1" style={{ color: T.muted }}>{b.intro}</div></div>
          <div className="flex flex-col gap-2">
            {b.sesiones.map((s) => (
              <Card key={s.n} className="p-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm" style={{ color: s.bloqueada ? T.muted : T.navy }}>{s.bloqueada ? "🔒 " : ""}Sesión {s.n} · {s.titulo}</div>
                    {s.bloqueada && <div className="text-xs" style={{ color: T.muted }}>{MODO_DEMO ? `No incluida en la demostración (desde el plan ${NOMBRE_PLAN_ST[s.planMinimo]}).` : `Incluida en el plan ${NOMBRE_PLAN_ST[s.planMinimo]}.`}</div>}
                  </div>
                  {!s.bloqueada && (
                    <div className="flex gap-2">
                      <Btn variant="ghost" onClick={() => setAbierta(abierta === s.n ? null : s.n)}>{abierta === s.n ? "Ocultar" : "Ver"}</Btn>
                      <Btn variant={ya(s.n) ? "ghost" : "accent"} onClick={() => traer(s)}>{ya(s.n) ? "Ya traída" : "Traer"}</Btn>
                    </div>
                  )}
                </div>
                {abierta === s.n && !s.bloqueada && (
                  <div className="mt-2 text-xs flex flex-col gap-1.5" style={{ color: T.navy }}>
                    <div>{s.objetivo}</div>
                    <div><b>Calentamiento:</b> movilidad · {nombreTarea(s.calentamiento.rondo)} · {nombreTarea(s.calentamiento.tercero)}</div>
                    <div><b>Tarea A:</b> {nombreTarea(s.A)} · <b>Tarea B:</b> {nombreTarea(s.B)}{s.C ? <> · <b>Tarea C:</b> {nombreTarea(s.C)}</> : null}</div>
                    {s.partido && <div><b>Partido:</b> {nombreTarea(s.partido)}</div>}
                    {s.definicion && <div><b>Definición:</b> {nombreTarea(s.definicion)}</div>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---- Ventana para elegir qué traer ----
const TITULOS_TRAER = {
  sesion: "Traer sesión del Sistema Tipo", semana: "Traer semanas del Sistema Tipo", ciclo: "Traer ciclos tipo del Sistema Tipo",
  pretemporada: "Traer la pretemporada del Sistema Tipo", mes: "Traer un mes del Sistema Tipo",
};

function SistemaTipoModal({ modo, onClose, onTraer, traidos }) {
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error | sinsesion
  const [datos, setDatos] = useState(null);
  const [guiaId, setGuiaId] = useState(null);
  const [calendarios, setCalendarios] = useState(() => leerCalendarios());
  const [crearSesiones, setCrearSesiones] = useState(false);
  const [rango, setRango] = useState({ desde: 1, hasta: 4 });
  const [aviso, setAviso] = useState("");
  const [locales, setLocales] = useState([]);

  const cargar = (forzar = false) => {
    setEstado("cargando");
    cargarSistemaTipo(forzar)
      .then((d) => { setDatos(d); setGuiaId((g) => g || d.guias[0]?.id || null); setEstado("listo"); })
      .catch((e) => setEstado(e.message === "sin-sesion" ? "sinsesion" : "error"));
  };
  useEffect(() => { cargar(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guia = datos?.guias.find((g) => g.id === guiaId) || datos?.guias[0];
  const cal = guia ? (calendarios[guia.id] || calendarioPorDefecto(guia)) : null;
  const updateCal = (patch) => {
    const nuevo = { ...calendarios, [guia.id]: { ...cal, ...patch } };
    setCalendarios(nuevo); guardarCalendarios(nuevo);
  };
  const toggleDia = (n) => {
    const dias = cal.dias.includes(n) ? cal.dias.filter((d) => d !== n) : [...cal.dias, n];
    if (dias.length) updateCal({ dias });
  };

  const ya = (clave) => clave && (traidos.has(clave) || locales.includes(clave));
  const hacer = (clave, accion) => {
    if (ya(clave) && !confirm("Ya lo trajiste antes. ¿Traerlo otra vez? Se añadirá una copia nueva, sin tocar la anterior.")) return;
    const msg = onTraer({ ...accion, guia, cal });
    if (clave) setLocales((l) => [...l, clave]);
    setAviso(msg || "");
  };

  const semanasGuia = guia ? guia.ciclos.flatMap((c) => c.semanas) : [];
  const BtnTraer = ({ clave, accion, disabled, etiqueta }) => (
    <Btn variant={ya(clave) ? "ghost" : "accent"} disabled={disabled} onClick={() => hacer(clave, accion)}>
      {disabled ? "🔒" : ya(clave) ? "✓ Traída" : etiqueta || "Traer"}
    </Btn>
  );
  const Bloqueo = ({ plan }) => <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: "#F1F5F9", color: T.muted }}>🔒 {MODO_DEMO ? "Al comprar" : `Plan ${NOMBRE_PLAN_ST[plan]}`}</span>;

  return (
    <Modal title={TITULOS_TRAER[modo]} onClose={onClose} wide>
      {estado === "cargando" && <div className="text-sm p-4" style={{ color: T.muted }}>Cargando el Sistema Tipo...</div>}
      {estado === "sinsesion" && <div className="text-sm p-4" style={{ color: T.redLight }}>Tu sesión ha caducado. Vuelve a iniciar sesión para traer contenido del Sistema Tipo.</div>}
      {estado === "error" && (
        <div className="text-sm p-4 flex flex-col gap-3" style={{ color: T.redLight }}>
          No se pudo cargar el Sistema Tipo. Revisa tu conexión e inténtalo de nuevo.
          <div><Btn variant="ghost" onClick={() => cargar(true)}>Reintentar</Btn></div>
        </div>
      )}

      {estado === "listo" && guia && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            {datos.guias.map((g) => (
              <button key={g.id} onClick={() => { setGuiaId(g.id); setAviso(""); }} className="px-3 py-2 rounded-xl text-left text-xs"
                style={{ background: g.id === guia.id ? T.navy : "#fff", color: g.id === guia.id ? "#fff" : T.navy, border: `1px solid ${g.id === guia.id ? T.navy : T.line}` }}>
                <div className="font-extrabold">{g.nombre}</div>
                <div className="opacity-80">{g.subtitulo}</div>
              </button>
            ))}
          </div>

          <div className="text-[11px]" style={{ color: T.muted }}>
            Tu plan: <b>{NOMBRE_PLAN_ST[datos.plan] || datos.plan}</b> · {guia.sesionesDisponibles} de {guia.totalSesiones} sesiones disponibles en esta guía.
          </div>

          <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
            <div className="text-sm font-bold" style={{ color: T.navy }}>Calendario de tu temporada</div>
            <div className="flex flex-wrap gap-4 items-end">
              <Field label="Fecha de inicio (semana 1)"><TextInput type="date" value={cal.inicio} onChange={(e) => e.target.value && updateCal({ inicio: e.target.value })} /></Field>
              <div>
                <div className="text-[11px] font-bold uppercase mb-1" style={{ color: T.muted }}>Días de entrenamiento ({guia.sesionesPorSemana} por semana)</div>
                <div className="flex gap-1">
                  {DIAS_SEMANA.map(([n, l]) => {
                    const on = cal.dias.includes(n);
                    return <button key={n} type="button" onClick={() => toggleDia(n)} className="w-8 h-8 rounded-lg text-xs font-bold"
                      style={{ background: on ? T.navy : "#fff", color: on ? "#fff" : T.muted, border: `1px solid ${on ? T.navy : T.line}` }}>{l}</button>;
                  })}
                </div>
              </div>
            </div>
            <div className="text-[11px]" style={{ color: T.muted }}>La semana 1 empieza el lunes de esa fecha. Con esto se calculan las fechas de lo que traigas; después puedes cambiarlas una por una.</div>
          </div>

          {aviso && <div className="text-sm font-bold p-3 rounded-xl" style={{ background: "#E7F6ED", color: T.green }}>{aviso}</div>}

          {modo === "sesion" && guia.ciclos.map((c, idx) => (
            <details key={c.id} open={idx === 0} className="rounded-xl" style={{ border: `1px solid ${T.line}` }}>
              <summary className="px-3 py-2 cursor-pointer font-extrabold text-sm" style={{ color: T.navy }}>{c.nombre} · <span className="font-normal">{c.subtitulo}</span> <span className="text-[11px] font-normal" style={{ color: T.muted }}>({c.rango})</span></summary>
              <div className="px-3 pb-3">
                {c.semanas.map((w) => (
                  <div key={w.numero} className="mt-2">
                    <div className="text-xs font-bold" style={{ color: T.muted }}>Semana {w.numero} · {w.titulo}</div>
                    {w.sesiones.map((s) => (
                      <div key={s.numero} className="flex items-center justify-between gap-2 py-1.5 border-t" style={{ borderColor: T.line }}>
                        <div className="text-sm"><b>Sesión {s.numero}</b> · {s.titulo}</div>
                        {s.bloqueada ? <Bloqueo plan={s.planMinimo} /> : <BtnTraer clave={`${guia.id}:S${s.numero}`} accion={{ tipo: "sesion", semana: w, sesion: s, indice: w.sesiones.indexOf(s) }} />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          ))}

          {modo === "semana" && (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={crearSesiones} onChange={(e) => setCrearSesiones(e.target.checked)} />
                Crear también sus sesiones en Entrenamientos
              </label>
              <div><Btn variant="accent" onClick={() => hacer(null, { tipo: "semanas", semanas: semanasGuia, crearSesiones })}>Traer las {semanasGuia.length} semanas (toda la temporada)</Btn></div>
              {guia.ciclos.map((c, idx) => (
                <details key={c.id} open={idx === 0} className="rounded-xl" style={{ border: `1px solid ${T.line}` }}>
                  <summary className="px-3 py-2 cursor-pointer font-extrabold text-sm" style={{ color: T.navy }}>{c.nombre} · <span className="font-normal">{c.subtitulo}</span> <span className="text-[11px] font-normal" style={{ color: T.muted }}>({c.rango})</span></summary>
                  <div className="px-3 pb-3">
                    <div className="pt-2"><Btn variant="ghost" onClick={() => hacer(null, { tipo: "semanas", semanas: c.semanas, crearSesiones })}>Traer las {c.semanas.length} semanas de este ciclo</Btn></div>
                    {c.semanas.map((w) => {
                      const todasBloqueadas = w.sesiones.every((s) => s.bloqueada);
                      return (
                        <div key={w.numero} className="flex items-center justify-between gap-2 py-2 border-t" style={{ borderColor: T.line }}>
                          <div className="text-sm"><b>Semana {w.numero}</b> · {w.titulo} <span className="text-[11px]" style={{ color: T.muted }}>({w.sesiones.length} sesiones)</span></div>
                          {todasBloqueadas ? <Bloqueo plan={w.sesiones[0].planMinimo} /> : <BtnTraer clave={`${guia.id}:W${w.numero}`} accion={{ tipo: "semana", semana: w, crearSesiones }} etiqueta="Traer semana" />}
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </>
          )}

          {modo === "ciclo" && (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={crearSesiones} onChange={(e) => setCrearSesiones(e.target.checked)} />
                Crear también sus sesiones en Entrenamientos
              </label>
              <div className="text-xs" style={{ color: T.muted }}>Cada ciclo se trae con todas sus semanas, con el detalle de las sesiones de cada una.</div>
              <div><Btn variant="accent" onClick={() => hacer(null, { tipo: "ciclos", ciclos: guia.ciclos, crearSesiones })}>Traer toda la temporada ({guia.ciclos.length} ciclos y {semanasGuia.length} semanas)</Btn></div>
              {guia.ciclos.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 py-2 border-t" style={{ borderColor: T.line }}>
                  <div className="text-sm"><b>{c.nombre}</b> · {c.subtitulo} <span className="text-[11px]" style={{ color: T.muted }}>({c.rango})</span></div>
                  <BtnTraer clave={`${guia.id}:C${c.id}`} accion={{ tipo: "ciclos", ciclos: [c], crearSesiones }} etiqueta="Traer ciclo" />
                </div>
              ))}
            </>
          )}

          {modo === "pretemporada" && (() => {
            const pre = guia.ciclos.find((c) => c.id === "pretemporada");
            const hayAbiertas = pre && pre.semanas.some((w) => w.sesiones.some((s) => !s.bloqueada));
            return (
              <div className="flex flex-col gap-2">
                {pre && pre.semanas.map((w) => <div key={w.numero} className="text-sm"><b>Semana {w.numero}</b> · {w.titulo} <span className="text-[11px]" style={{ color: T.muted }}>({w.sesiones.length} sesiones)</span></div>)}
                <div className="text-xs" style={{ color: T.muted }}>Se rellenan las fechas y los objetivos de la pretemporada y se añade a la agenda un día por cada sesión. Lo que ya tengas escrito no se borra.</div>
                <div><BtnTraer clave={`${guia.id}:P`} accion={{ tipo: "pretemporada" }} disabled={!hayAbiertas} etiqueta="Traer la pretemporada" /></div>
              </div>
            );
          })()}

          {modo === "mes" && (() => {
            const a = Math.min(rango.desde, rango.hasta), b = Math.max(rango.desde, rango.hasta);
            const sel = semanasGuia.filter((w) => w.numero >= a && w.numero <= b);
            return (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 flex-wrap items-end">
                  <Field label="Desde la semana"><Select value={rango.desde} onChange={(e) => setRango((r) => ({ ...r, desde: Number(e.target.value) }))}>{semanasGuia.map((w) => <option key={w.numero} value={w.numero}>Semana {w.numero}</option>)}</Select></Field>
                  <Field label="Hasta la semana"><Select value={rango.hasta} onChange={(e) => setRango((r) => ({ ...r, hasta: Number(e.target.value) }))}>{semanasGuia.map((w) => <option key={w.numero} value={w.numero}>Semana {w.numero}</option>)}</Select></Field>
                </div>
                <div className="text-xs" style={{ color: T.muted }}>{sel.map((w) => `S${w.numero}: ${w.titulo}`).join(" · ")}</div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={crearSesiones} onChange={(e) => setCrearSesiones(e.target.checked)} />
                  Crear también sus sesiones en Entrenamientos
                </label>
                <div className="text-xs" style={{ color: T.muted }}>Se crea el mes y, además, cada una de sus semanas con todo su detalle.</div>
                <div><Btn variant="accent" disabled={!sel.length} onClick={() => hacer(null, { tipo: "mes", semanas: sel, crearSesiones })}>Traer como un mes ({sel.length} semana{sel.length === 1 ? "" : "s"})</Btn></div>
              </div>
            );
          })()}
        </div>
      )}
    </Modal>
  );
}

/* Imprime un elemento de la planificación (mes, ciclo tipo, pretemporada, torneo…) en una hoja A4. */
function printPlanItem({ config, tipo, titulo, datos = [], bloques = [], filasTitulo = "", filas = [] }) {
  const esc = (s) => (s ?? "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const bloque = ([l, v]) => (v ? `<div class="section"><div class="sectionTitle">${esc(l)}</div><div class="block">${esc(v)}</div></div>` : "");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(tipo)}</title>
  <style>@page { size: A4; margin: 12mm; }${CSS_INFORME_BASE}
    .section { margin-top: 10px; } .datos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
    .dato { background: #F5F7FA; border-radius: 10px; padding: 7px 9px; } .dato b { display: block; font-size: 8.5px; text-transform: uppercase; color: #64748B; } .dato span { font-size: 12px; font-weight: 800; color: #0B1F3A; }
  </style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="head"><div><div class="title">${esc(titulo) || esc(tipo)}</div><div class="meta">${esc(config.teamName)} · ${esc(tipo)}</div></div><div class="meta">${esc(config.category)}</div></div>
      ${datos.length ? `<div class="datos">${datos.map(([l, v]) => `<div class="dato"><b>${esc(l)}</b><span>${esc(v) || "—"}</span></div>`).join("")}</div>` : ""}
      ${bloques.map(bloque).join("")}
      ${filas.length ? `<div class="section"><div class="sectionTitle">${esc(filasTitulo)}</div><table><thead><tr>${["Semana", "Inicio", "Objetivo", "Sesiones"].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${filas.map((f) => `<tr><td class="b">${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td><td class="c">${esc(f[3])}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

function SimplePlanList({ title, items, blank, fields, titleField, subtitleField, onAdd, onSave, onRemove, matches, extra, onPrint, renderInfo }) {
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-2 flex-wrap">{extra}<Btn variant="accent" icon={Plus} onClick={() => setShowNew(true)}>Añadir</Btn></div>
      {items.map((it) => (
        <Card key={it.id} className="p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1 cursor-pointer" style={{ minWidth: 220 }} onClick={() => setEditing(it)}>
              <div className="font-extrabold" style={{ color: T.navy }}>{it[titleField] || "(sin título)"}</div>
              {renderInfo && <div className="text-xs mt-0.5 font-bold" style={{ color: T.green }}>{renderInfo(it)}</div>}
              {subtitleField && it[subtitleField] ? <div className="text-xs mt-1 whitespace-pre-line" style={{ color: T.muted }}>{it[subtitleField]}</div> : null}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn variant="ghost" icon={Edit3} onClick={() => setEditing(it)}>Editar</Btn>
              {onPrint && <Btn variant="ghost" icon={Printer} onClick={() => onPrint(it)}>Imprimir</Btn>}
              <Btn variant="danger" icon={Trash2} onClick={() => { if (confirm(`¿Eliminar «${it[titleField] || "este registro"}»? No se puede deshacer.`)) onRemove(it.id); }}>Eliminar</Btn>
            </div>
          </div>
        </Card>
      ))}
      {!items.length && <div className="text-sm" style={{ color: T.muted }}>Todavía no hay registros.</div>}
      {showNew && <PlanItemModalForm title={title} fields={fields} initial={blank()} onClose={() => setShowNew(false)} onSave={(it) => { onAdd(it); setShowNew(false); }} matches={matches} />}
      {editing && <PlanItemModalForm title={title} fields={fields} initial={editing} onClose={() => setEditing(null)} onSave={(it) => { onSave(it); setEditing(null); }} onDelete={() => { onRemove(editing.id); setEditing(null); }} matches={matches} />}
    </div>
  );
}

function printWeek(w, config, weekTrainingsArr, weekMatchesArr) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Semana ${esc(w.numero)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 12px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; } .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 18px 22px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .title { font-size: 18px; font-weight: 900; color: #0B1F3A; border-bottom: 3px solid #0B1F3A; padding-bottom: 8px; margin-bottom: 10px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .chip { background: #F5F7FA; border-radius: 10px; padding: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #0B1F3A; }
    .section { margin-top: 12px; }
    .sectionTitle { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #fff; background: #0B1F3A; padding: 4px 10px; border-radius: 999px; display: inline-block; margin-bottom: 6px; }
    .item { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; margin-bottom: 4px; font-size: 11px; }
    @media print { html, body { background: #fff; } .toolbar { display: none !important; } .sheet { box-shadow: none; padding: 0; } body { padding: 0; } }
  </style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="title">${esc(config.teamName)} · Semana ${esc(w.numero)} (${esc(w.fechaInicio)})</div>
      <div class="grid3">
        <div class="chip">Carga prevista<br/><b>${esc(w.cargaPrevista)}</b></div>
        <div class="chip">Sesiones<br/><b>${weekTrainingsArr.length}</b></div>
        <div class="chip">Partidos<br/><b>${weekMatchesArr.length}</b></div>
      </div>
      ${w.objetivo ? `<div class="section"><div class="sectionTitle">Objetivo semanal</div><div class="item">${esc(w.objetivo)}</div></div>` : ""}
      <div class="section"><div class="sectionTitle">Contenido por área</div>
        ${w.contenidoFisico ? `<div class="item"><b>Físico:</b> ${esc(w.contenidoFisico)}</div>` : ""}
        ${w.contenidoTecnico ? `<div class="item"><b>Técnico:</b> ${esc(w.contenidoTecnico)}</div>` : ""}
        ${w.contenidoTactico ? `<div class="item"><b>Táctico:</b> ${esc(w.contenidoTactico)}</div>` : ""}
        ${w.contenidoPsicologico ? `<div class="item"><b>Psicológico:</b> ${esc(w.contenidoPsicologico)}</div>` : ""}
      </div>
      <div class="section"><div class="sectionTitle">Sesiones de la semana</div>
        ${weekTrainingsArr.map((t) => `<div class="item">${esc(t.fecha)} — ${esc(sessionDisplayName(t))}</div>`).join("") || `<div class="item">Sin sesiones registradas.</div>`}
      </div>
      <div class="section"><div class="sectionTitle">Partidos de la semana</div>
        ${weekMatchesArr.map((m) => `<div class="item">${esc(m.fecha)} vs ${esc(m.rival)} — ${esc(m.resultadoFinal)}</div>`).join("") || `<div class="item">Sin partidos esta semana.</div>`}
      </div>
    </div>
  </body></html>`;
  const w2 = window.open("", "_blank");
  if (w2) { w2.document.open(); w2.document.write(ajusteA4(html)); w2.document.close(); }
}

function printSeasonPlanning(season, seasonPlanning, config, matches, trainings = []) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const fc = (f) => { const [a, m, d] = String(f || "").split("-"); return d && m ? `${d}/${m}` : esc(f) || "—"; };
  const primera = (t) => esc(String(t || "").split("\n")[0]);
  const hoyISO = todayISO();
  const sesionesEntre = (ini, fin) => (trainings || []).filter((t) => t.fecha && ini && fin && t.fecha >= ini && t.fecha <= fin && t.fecha <= hoyISO).length;
  const sumar = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const titulo = (t, color) => `<div class="sectionTitle" style="background:${color};">${esc(t)}</div>`;
  const vacio = (t) => `<div class="vacio">${t}</div>`;
  const pt = seasonPlanning.pretemporada || {};
  const dias = pt.dias || [], amistosos = pt.amistosos || [];
  const semanas = [...(season.weeks || [])].sort((a, b) => String(a.fechaInicio).localeCompare(String(b.fechaInicio)));
  const filaSemana = (w) => {
    const n = sesionesEntre(w.fechaInicio, sumar(w.fechaInicio, 6));
    return `<div class="fila"><b class="c1">S${esc(w.numero)}</b><span class="c2">${fc(w.fechaInicio)}</span><span class="obj clamp1">${primera(w.objetivo) || "—"}</span><span class="c3">${n ? n + " ses." : ""}</span></div>`;
  };
  const filaMes = (m) => `<div class="fila fila2"><b class="mes">${esc(m.mes)}</b><span class="obj clamp2">${esc(String(m.objetivo || "").replace(/\n/g, " · ")) || "—"}</span></div>`;
  const ciclos = (seasonPlanning.macrociclo || []).map((c) => {
    const real = sesionesEntre(c.fechaInicio, c.fechaFin);
    const plan = c.sesionesPlanificadas != null ? c.sesionesPlanificadas : null;
    return `<tr><td class="b">${esc(c.nombre)}</td><td>${fc(c.fechaInicio)} – ${fc(c.fechaFin)}</td><td class="c">${plan != null ? plan + " plan. · " : ""}${real} real.</td><td class="clamp2">${primera(c.objetivo)}</td></tr>`;
  }).join("");
  const mitad = (arr) => [arr.slice(0, Math.ceil(arr.length / 2)), arr.slice(Math.ceil(arr.length / 2))];
  const dosColumnas = (arr, fila) => { const [a, b] = mitad(arr); return `<div class="dosCol"><div>${a.map(fila).join("")}</div><div>${b.map(fila).join("")}</div></div>`; };
  const torneos = (seasonPlanning.torneoRapido || []).map((t) => `${esc(t.nombreTorneo)} (${fc(t.fechaInicio)} – ${fc(t.fechaFin)})`).join(" · ");
  const imprevistos = (seasonPlanning.partidoNoProgramado || []).map((m) => `${fc(m.fecha)} vs ${esc(m.rival)}`).join(" · ");
  const totalSesiones = (trainings || []).filter((t) => t.fecha && t.fecha <= hoyISO).length;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Temporada y Planificación</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 10px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; } .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 20px 24px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .title { font-size: 17px; font-weight: 900; color: #0B1F3A; border-bottom: 3px solid #0B1F3A; padding-bottom: 6px; margin-bottom: 8px; text-align: center; }
    .datos { display: flex; flex-wrap: wrap; gap: 3px 16px; font-size: 9.5px; margin-bottom: 4px; }
    .section { margin-top: 9px; }
    .sectionTitle { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #fff; padding: 2px 10px; border-radius: 999px; display: inline-block; margin-bottom: 4px; }
    .nota { font-size: 9.5px; line-height: 1.35; margin: 2px 0; }
    .vacio { font-size: 9px; color: #94A3B8; }
    table { width: 100%; border-collapse: collapse; font-size: 9px; }
    th { text-align: left; background: #F1F5F9; color: #475569; text-transform: uppercase; font-size: 8px; padding: 3px 5px; }
    td { padding: 3px 5px; border-bottom: 1px solid #E2E8F0; vertical-align: top; }
    td.b { font-weight: 800; white-space: nowrap; } td.c { text-align: center; white-space: nowrap; }
    .dosCol { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .fila { display: flex; gap: 6px; align-items: baseline; font-size: 9px; padding: 2px 0; border-bottom: 1px solid #EEF2F6; }
    .fila .c1 { width: 22px; color: #0B1F3A; } .fila .c2 { width: 30px; color: #64748B; } .fila .c3 { width: 36px; text-align: right; color: #2A9D5C; font-weight: 700; white-space: nowrap; }
    .fila .obj { flex: 1; min-width: 0; } .fila2 { align-items: flex-start; } .fila2 .mes { width: 92px; flex-shrink: 0; }
    .clamp1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .chips { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
    .chip { font-size: 8.5px; background: #FFF6DD; border: 1px solid #F4D77A; border-radius: 999px; padding: 1px 7px; }
    @media print { html, body { background: #fff; } .toolbar { display: none !important; } .sheet { box-shadow: none; padding: 0; } body { padding: 0; } }
  </style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="title">${esc(config.teamName)} — Temporada y Planificación</div>
      <div class="datos"><span><b>Categoría:</b> ${esc(config.category)}</span><span><b>Competición:</b> ${esc(season.competicion) || "—"}</span><span><b>Localidad:</b> ${esc(season.localidad) || "—"}</span><span><b>Temporada:</b> ${fc(season.fechaInicio)} – ${fc(season.fechaFin)}</span><span><b>Sesiones entrenadas:</b> ${totalSesiones}</span></div>
      ${season.objetivosGenerales ? `<div class="nota"><b>Objetivos generales:</b> ${esc(season.objetivosGenerales)}</div>` : ""}
      ${(season.cuerpoTecnico || []).length ? `<div class="nota"><b>Cuerpo técnico:</b> ${(season.cuerpoTecnico || []).map((c) => `${esc(c.nombre)} (${esc(c.cargo)})`).join(" · ")}</div>` : ""}

      <div class="section">${titulo("Pretemporada", "#F4B400")}
        <div class="nota"><b>Del ${fc(pt.fechaInicio)} al ${fc(pt.fechaFin)}</b> · ${dias.length} día(s) de agenda · ${amistosos.length} amistoso(s)${pt.fechaInicio && pt.fechaFin ? ` · ${sesionesEntre(pt.fechaInicio, pt.fechaFin)} sesión(es) entrenada(s)` : ""}</div>
        ${pt.objetivos ? `<div class="nota clamp2"><b>Objetivos:</b> ${esc(String(pt.objetivos).replace(/\n+/g, " · "))}</div>` : ""}
        ${dias.length ? `<div class="chips">${dias.map((d) => `<span class="chip">${fc(d.fecha)} ${esc(d.tipo)}</span>`).join("")}</div>` : ""}
        ${amistosos.length ? `<div class="nota"><b>Amistosos:</b> ${amistosos.map((a) => `${fc(a.fecha)} vs ${esc(a.rival)}`).join(" · ")}</div>` : ""}
      </div>

      <div class="section">${titulo("Ciclos tipo (toda la temporada)", "#2A9D5C")}
        ${ciclos ? `<table><thead><tr><th>Ciclo</th><th>Fechas</th><th class="c">Sesiones</th><th>Objetivo</th></tr></thead><tbody>${ciclos}</tbody></table>` : vacio("Sin ciclos tipo definidos.")}
      </div>

      <div class="section">${titulo(`Planificación semanal (${semanas.length})`, "#0B1F3A")}
        ${semanas.length ? dosColumnas(semanas, filaSemana) : vacio("Sin semanas planificadas.")}
      </div>

      <div class="section">${titulo("Planificación mensual", "#E63946")}
        ${(seasonPlanning.mensual || []).length ? dosColumnas(seasonPlanning.mensual, filaMes) : vacio("Sin meses planificados.")}
      </div>

      ${imprevistos || torneos ? `<div class="section">${titulo("Otros partidos", "#94A3B8")}
        ${imprevistos ? `<div class="nota"><b>No programados:</b> ${imprevistos}</div>` : ""}${torneos ? `<div class="nota"><b>Torneos rápidos:</b> ${torneos}</div>` : ""}</div>` : ""}
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

function TemporadaModule({ ctx }) {
  const { season, updateSeason, matches, trainings, updateTrainings, players, seasonPlanning, updateSeasonPlanning, config } = ctx;
  const [tab, setTab] = useState("temporada");
  const [planTab, setPlanTab] = useState("pretemporada");
  const [editWeek, setEditWeek] = useState(null);
  const [dayModal, setDayModal] = useState(null);
  const [amistosoModal, setAmistosoModal] = useState(null);
  const [traer, setTraer] = useState(null); // null | "semana" | "pretemporada" | "mes" | "ciclo"
  if (!season || !seasonPlanning) return null;
  const set = (k, v) => updateSeason((p) => ({ ...p, [k]: v }));

  const weekMatches = (w) => {
    const start = new Date(w.fechaInicio), end = new Date(start); end.setDate(end.getDate() + 7);
    return matches.filter((m) => { const d = new Date(m.fecha); return d >= start && d < end; });
  };
  const weekTrainings = (w) => {
    const start = new Date(w.fechaInicio), end = new Date(start); end.setDate(end.getDate() + 7);
    return trainings.filter((t) => { const d = new Date(t.fecha); return d >= start && d < end; });
  };

  // "Añadir semana" abre el formulario al instante (antes la añadía al final de la lista sin avisar).
  const addWeek = () => {
    const ultima = [...season.weeks].sort((a, b) => String(a.fechaInicio).localeCompare(String(b.fechaInicio))).pop();
    setEditWeek({
      id: uid(), numero: season.weeks.length + 1, fechaInicio: ultima?.fechaInicio ? sumarDiasISO(ultima.fechaInicio, 7) : todayISO(),
      objetivo: "", contenidoFisico: "", contenidoTecnico: "", contenidoTactico: "", contenidoPsicologico: "", cargaPrevista: "Media",
    });
  };
  const saveWeek = (w) => updateSeason((p) => ({ ...p, weeks: p.weeks.some((x) => x.id === w.id) ? p.weeks.map((x) => x.id === w.id ? w : x) : [...p.weeks, w] }));
  const removeWeek = (id) => updateSeason((p) => ({ ...p, weeks: p.weeks.filter((x) => x.id !== id) }));

  const setPretemp = (k, v) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, [k]: v } }));
  const addDia = (dia) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, dias: [...p.pretemporada.dias, dia] } }));
  const saveDia = (dia) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, dias: p.pretemporada.dias.map((x) => x.id === dia.id ? dia : x) } }));
  const removeDia = (id) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, dias: p.pretemporada.dias.filter((x) => x.id !== id) } }));
  const addAmistoso = (a) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, amistosos: [...p.pretemporada.amistosos, a] } }));
  const saveAmistoso = (a) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, amistosos: p.pretemporada.amistosos.map((x) => x.id === a.id ? a : x) } }));
  const removeAmistoso = (id) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, amistosos: p.pretemporada.amistosos.filter((x) => x.id !== id) } }));

  // ---- Sistema Tipo: lo que ya se trajo (para avisar y evitar duplicados por error) ----
  const traidosST = new Set([
    ...season.weeks.filter((w) => w.origenSistemaTipo).map((w) => `${w.origenSistemaTipo.guia}:W${w.origenSistemaTipo.semana}`),
    ...seasonPlanning.macrociclo.filter((c) => c.origenSistemaTipo).map((c) => `${c.origenSistemaTipo.guia}:C${c.origenSistemaTipo.ciclo}`),
    ...(seasonPlanning.pretemporada.dias || []).filter((d) => d.origenSistemaTipo).map((d) => `${d.origenSistemaTipo.guia}:P`),
  ]);
  const traerDesdeST = (a) => {
    // Semanas con todo su detalle. Se evita repetir las ya traídas, salvo que se pida una sola semana a propósito.
    const semanasNuevas = (guia, semanas, cal, crearSesiones, permitirRepetir) => {
      const pendientes = semanas.filter((w) => permitirRepetir || !traidosST.has(`${guia.id}:W${w.numero}`));
      const objetos = pendientes.map((w) => semanaDesdeST(guia, w, cal, 0));
      const nuevasSesiones = crearSesiones ? pendientes.flatMap((w) => w.sesiones.map((s, i) => (s.bloqueada ? null : sesionDesdeST(guia, w, s, i, cal, players))).filter(Boolean)) : [];
      return { objetos, nuevasSesiones, repetidas: semanas.length - pendientes.length };
    };
    const guardarSemanas = ({ objetos, nuevasSesiones }) => {
      if (objetos.length) updateSeason((p) => ({ ...p, weeks: [...p.weeks, ...objetos.map((w, i) => ({ ...w, numero: p.weeks.length + i + 1 }))] }));
      if (nuevasSesiones.length) updateTrainings((prev) => [...prev, ...nuevasSesiones]);
    };
    const resumen = (r) => `${r.objetos.length} semana${r.objetos.length === 1 ? "" : "s"}${r.nuevasSesiones.length ? ` y ${r.nuevasSesiones.length} sesión(es) en Entrenamientos` : ""}`;
    const repetidas = (r) => (r.repetidas ? ` (${r.repetidas} ya estaba${r.repetidas === 1 ? "" : "n"} traída${r.repetidas === 1 ? "" : "s"})` : "");

    if (a.tipo === "semana") {
      const r = semanasNuevas(a.guia, [a.semana], a.cal, a.crearSesiones, true);
      guardarSemanas(r);
      return `Semana ${a.semana.numero} traída${r.nuevasSesiones.length ? ` y ${r.nuevasSesiones.length} sesión(es) en Entrenamientos` : ""}. La encuentras en «Semanal».`;
    }
    if (a.tipo === "semanas") {
      const r = semanasNuevas(a.guia, a.semanas, a.cal, a.crearSesiones, false);
      if (!r.objetos.length) return "Todas esas semanas ya estaban traídas.";
      guardarSemanas(r);
      return `Traídas ${resumen(r)}${repetidas(r)}. Las encuentras en «Semanal».`;
    }
    if (a.tipo === "pretemporada") {
      const pt = pretemporadaDesdeST(a.guia, a.cal);
      if (!pt) return "Esta guía no tiene pretemporada.";
      const yaTraidas = new Set((seasonPlanning.pretemporada.dias || []).filter((d) => d.origenSistemaTipo).map((d) => `${d.origenSistemaTipo.guia}:S${d.origenSistemaTipo.sesion}`));
      const diasNuevos = pt.dias.filter((d) => !yaTraidas.has(`${d.origenSistemaTipo.guia}:S${d.origenSistemaTipo.sesion}`));
      updateSeasonPlanning((p) => {
        const actual = p.pretemporada;
        const objetivos = !actual.objetivos ? pt.objetivos : (actual.objetivos.includes(pt.objetivos) ? actual.objetivos : `${actual.objetivos}\n\n${pt.objetivos}`);
        return { ...p, pretemporada: { ...actual, fechaInicio: actual.fechaInicio || pt.fechaInicio, fechaFin: actual.fechaFin || pt.fechaFin, objetivos, dias: [...(actual.dias || []), ...diasNuevos] } };
      });
      return `Pretemporada traída: ${diasNuevos.length} día(s) añadidos a la agenda. La encuentras en «Pretemporada».`;
    }
    if (a.tipo === "ciclos") {
      const elegidos = a.ciclos.filter((c) => a.ciclos.length === 1 || !traidosST.has(`${a.guia.id}:C${c.id}`));
      if (!elegidos.length) return "Todos los ciclos ya estaban traídos.";
      const nuevos = elegidos.map((c) => cicloDesdeST(a.guia, c, a.cal));
      const r = semanasNuevas(a.guia, elegidos.flatMap((c) => c.semanas), a.cal, a.crearSesiones, false);
      updateSeasonPlanning((p) => ({ ...p, macrociclo: [...p.macrociclo, ...nuevos] }));
      guardarSemanas(r);
      const que = nuevos.length === 1 ? nuevos[0].nombre.split(" — ")[0] : `${nuevos.length} ciclos tipo`;
      return `${que} traído con ${resumen(r)}${repetidas(r)}. Lo encuentras en «Toda la temporada» y sus semanas en «Semanal».`;
    }
    if (a.tipo === "mes") {
      const m = mesDesdeST(a.guia, a.semanas, a.cal);
      const r = semanasNuevas(a.guia, a.semanas, a.cal, a.crearSesiones, false);
      updateSeasonPlanning((p) => ({ ...p, mensual: [...p.mensual, m] }));
      guardarSemanas(r);
      return `Mes traído (${m.mes}) con ${resumen(r)}${repetidas(r)}. Lo encuentras en «Mensual» y sus semanas en «Semanal».`;
    }
    return "";
  };

  // ---- Información e impresión de los elementos de la planificación ----
  const fcl2 = (f) => { const [a, m, d] = String(f || "").split("-"); return d && m ? `${d}/${m}/${a}` : f || "—"; };
  const hoyPlan = todayISO();
  const sesionesRango = (ini, fin) => trainings.filter((t) => t.fecha && ini && fin && t.fecha >= ini && t.fecha <= fin);
  const sumarDiasPlan = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const semanasDeRango = (ini, fin) => [...season.weeks].filter((w) => w.fechaInicio && ini && fin && w.fechaInicio >= ini && w.fechaInicio <= fin).sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  const filaSemanaPlan = (w) => [`S${w.numero}`, fcl2(w.fechaInicio), String(w.objetivo || "").split("\n")[0], sesionesRango(w.fechaInicio, sumarDiasPlan(w.fechaInicio, 6)).length];
  const infoCiclo = (c) => {
    const prog = sesionesRango(c.fechaInicio, c.fechaFin); const real = prog.filter((t) => t.fecha <= hoyPlan).length;
    const plan = c.sesionesPlanificadas !== undefined && c.sesionesPlanificadas !== "" && c.sesionesPlanificadas !== null ? Number(c.sesionesPlanificadas) : null;
    return `${fcl2(c.fechaInicio)} → ${fcl2(c.fechaFin)} · ${plan != null ? `${plan} sesiones previstas · ` : ""}${real} entrenadas${prog.length > real ? ` · ${prog.length - real} programadas` : ""}`;
  };
  const infoMes = (m) => (m.sesionesPlanificadas ? `${m.sesionesPlanificadas} sesiones previstas` : "");
  const imprimirCiclo = (c) => {
    const ws = semanasDeRango(c.fechaInicio, c.fechaFin); const prog = sesionesRango(c.fechaInicio, c.fechaFin);
    printPlanItem({ config, tipo: "Ciclo tipo", titulo: c.nombre, datos: [["Inicio", fcl2(c.fechaInicio)], ["Fin", fcl2(c.fechaFin)], ["Sesiones previstas", c.sesionesPlanificadas ?? "—"], ["Sesiones entrenadas", prog.filter((t) => t.fecha <= hoyPlan).length], ["Sesiones programadas", prog.filter((t) => t.fecha > hoyPlan).length], ["Semanas planificadas", ws.length]],
      bloques: [["Objetivo del ciclo tipo", c.objetivo]], filasTitulo: "Semanas de este ciclo", filas: ws.map(filaSemanaPlan) });
  };
  const imprimirMes = (m) => {
    const o = m.origenSistemaTipo; const ws = o ? [...season.weeks].filter((w) => w.origenSistemaTipo && w.origenSistemaTipo.guia === o.guia && w.origenSistemaTipo.semana >= o.desdeSemana && w.origenSistemaTipo.semana <= o.hastaSemana).sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)) : [];
    printPlanItem({ config, tipo: "Planificación mensual", titulo: m.mes, datos: [["Sesiones previstas", m.sesionesPlanificadas ?? "—"], ["Semanas detalladas", ws.length]], bloques: [["Objetivo del mes", m.objetivo], ["Eventos clave", m.eventosClave], ["Resumen de carga", m.cargaResumen]], filasTitulo: "Semanas de este mes", filas: ws.map(filaSemanaPlan) });
  };
  const imprimirPartido = (m) => printPlanItem({ config, tipo: "Partido no programado", titulo: `vs ${m.rival || "?"}`, datos: [["Fecha", fcl2(m.fecha)]], bloques: [["Objetivo del partido", m.objetivo], ["Ajustes tácticos rápidos", m.ajustesTacticos]] });
  const imprimirTorneo = (t) => printPlanItem({ config, tipo: "Torneo rápido", titulo: t.nombreTorneo, datos: [["Inicio", fcl2(t.fechaInicio)], ["Fin", fcl2(t.fechaFin)], ["Partidos", (t.partidoIds || []).length]],
    bloques: [["Partidos del torneo", (t.partidoIds || []).map((id) => { const m = (matches || []).find((x) => x.id === id); return m ? `${fcl2(m.fecha)} vs ${m.rival}${m.resultadoFinal ? ` (${m.resultadoFinal})` : ""}` : null; }).filter(Boolean).join("\n")], ["Plan de rotación / manejo de la fatiga", t.rotacion]] });
  const pre = seasonPlanning.pretemporada;
  const imprimirPretemporada = () => printPlanItem({ config, tipo: "Pretemporada", titulo: "Pretemporada", datos: [["Inicio", fcl2(pre.fechaInicio)], ["Fin", fcl2(pre.fechaFin)], ["Días de agenda", (pre.dias || []).length], ["Amistosos", (pre.amistosos || []).length]],
    bloques: [["Objetivos de la pretemporada", pre.objetivos], ["Agenda día por día", [...(pre.dias || [])].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((d) => `${fcl2(d.fecha)} · ${d.tipo}${d.notas ? ` — ${d.notas}` : ""}`).join("\n")], ["Partidos amistosos", [...(pre.amistosos || [])].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((a) => `${fcl2(a.fecha)} · vs ${a.rival || "?"}${a.lugar ? ` (${a.lugar})` : ""}${a.objetivo ? ` — ${a.objetivo}` : ""}`).join("\n")]] });
  const vaciarPretemporada = () => { if (confirm("¿Vaciar toda la pretemporada (fechas, objetivos, agenda y amistosos)? No se puede deshacer.")) updateSeasonPlanning((p) => ({ ...p, pretemporada: { fechaInicio: "", fechaFin: "", objetivos: "", dias: [], amistosos: [] } })); };
  const removeDiaDirecto = (id) => updateSeasonPlanning((p) => ({ ...p, pretemporada: { ...p.pretemporada, dias: p.pretemporada.dias.filter((x) => x.id !== id) } }));

  const planTabs = [["pretemporada", "Pretemporada"], ["semanal", "Semanal"], ["mensual", "Mensual"], ["macrociclo", "Toda la temporada"], ["imprevisto", "Partido no programado"], ["torneo", "Torneo rápido"], ["areas", "Áreas de rendimiento"]];

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><Eyebrow>Temporada y Planificación</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>{season.competicion} · {config.category}</h1></div>
        <Btn variant="ghost" icon={Printer} onClick={() => printSeasonPlanning(season, seasonPlanning, config, matches, trainings)}>Imprimir todo</Btn>
      </div>
      <div className="flex gap-1.5">
        {[["temporada", "Temporada"], ["planificacion", "Planificación"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3.5 py-2 rounded-xl text-sm font-bold"
            style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}` }}>{l}</button>
        ))}
      </div>

      {tab === "temporada" && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Equipo (se edita en Configuración)"><TextInput value={config.teamName} disabled /></Field>
            <Field label="Categoría (se edita en Configuración)"><TextInput value={config.category} disabled /></Field>
            <Field label="Localidad / ciudad"><TextInput value={season.localidad || ""} onChange={(e) => set("localidad", e.target.value)} placeholder="Ej: Quito" /></Field>
            <Field label="Competición"><TextInput value={season.competicion} onChange={(e) => set("competicion", e.target.value)} /></Field>
            <Field label="Fecha de inicio"><TextInput type="date" value={season.fechaInicio} onChange={(e) => set("fechaInicio", e.target.value)} /></Field>
            <Field label="Fecha de finalización"><TextInput type="date" value={season.fechaFin} onChange={(e) => set("fechaFin", e.target.value)} /></Field>
            <Field label="Objetivos generales" className="sm:col-span-2"><TextArea value={season.objetivosGenerales} onChange={(e) => set("objetivosGenerales", e.target.value)} /></Field>
            <Field label="Objetivos deportivos"><TextArea value={season.objetivosDeportivos} onChange={(e) => set("objetivosDeportivos", e.target.value)} /></Field>
            <Field label="Objetivos formativos"><TextArea value={season.objetivosFormativos} onChange={(e) => set("objetivosFormativos", e.target.value)} /></Field>
          </Card>
          <Card className="p-5">
            <Eyebrow>Cuerpo técnico</Eyebrow>
            <div className="mt-3"><CuerpoTecnicoEditor items={season.cuerpoTecnico || []} onChange={(v) => set("cuerpoTecnico", v)} /></div>
          </Card>
        </div>
      )}

      {tab === "planificacion" && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-1.5 flex-wrap">
            {planTabs.map(([k, l]) => (
              <button key={k} onClick={() => setPlanTab(k)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: planTab === k ? T.navy : "#fff", color: planTab === k ? "#fff" : T.muted, border: `1px solid ${planTab === k ? T.navy : T.line}` }}>{l}</button>
            ))}
          </div>

          {planTab === "pretemporada" && (
            <div className="flex flex-col gap-4">
              <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Fecha de inicio"><TextInput type="date" value={seasonPlanning.pretemporada.fechaInicio} onChange={(e) => setPretemp("fechaInicio", e.target.value)} /></Field>
                <Field label="Fecha de finalización"><TextInput type="date" value={seasonPlanning.pretemporada.fechaFin} onChange={(e) => setPretemp("fechaFin", e.target.value)} /></Field>
                <Field label="Objetivos de la pretemporada" className="sm:col-span-2"><TextArea value={seasonPlanning.pretemporada.objetivos} onChange={(e) => setPretemp("objetivos", e.target.value)} /></Field>
              </Card>

              <Card className="p-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm" style={{ color: T.muted }}>¿Quieres partir de la guía del Sistema Tipo? Trae la pretemporada ya planificada y después la ajustas a tu gusto.</div>
                <Btn variant="accent" icon={BookOpen} onClick={() => setTraer("pretemporada")}>Traer pretemporada del Sistema Tipo</Btn>
              </Card>

              <div className="flex justify-end gap-2 flex-wrap">
                <Btn variant="ghost" icon={Printer} onClick={imprimirPretemporada}>Imprimir pretemporada</Btn>
                <Btn variant="danger" icon={Trash2} onClick={vaciarPretemporada}>Vaciar pretemporada</Btn>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2"><Eyebrow>Agenda día por día</Eyebrow><Btn variant="ghost" icon={Plus} onClick={() => setDayModal({ id: uid(), fecha: todayISO(), tipo: "Físico", notas: "" })}>Añadir día</Btn></div>
                <div className="flex flex-col gap-2">
                  {[...seasonPlanning.pretemporada.dias].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((d) => (
                    <Card key={d.id} className="p-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0 flex-1 cursor-pointer" style={{ minWidth: 200 }} onClick={() => setDayModal(d)}>
                          <div className="flex items-center gap-2 flex-wrap"><div className="text-sm font-bold" style={{ color: T.navy }}>{fcl2(d.fecha)}</div><Pill color={T.navy}>{d.tipo}</Pill></div>
                          {d.notas && <div className="text-xs mt-1 whitespace-pre-line" style={{ color: T.muted }}>{d.notas}</div>}
                        </div>
                        <div className="flex gap-2">
                          <Btn variant="ghost" icon={Edit3} onClick={() => setDayModal(d)}>Editar</Btn>
                          <Btn variant="danger" icon={Trash2} onClick={() => { if (confirm("¿Eliminar este día de la agenda?")) removeDiaDirecto(d.id); }}>Eliminar</Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {!seasonPlanning.pretemporada.dias.length && <div className="text-sm" style={{ color: T.muted }}>Sin días agendados todavía.</div>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2"><Eyebrow>Partidos amistosos</Eyebrow><Btn variant="ghost" icon={Plus} onClick={() => setAmistosoModal({ id: uid(), matchId: null, fecha: todayISO(), rival: "", lugar: "", objetivo: "" })}>Añadir amistoso</Btn></div>
                <div className="flex flex-col gap-2">
                  {[...seasonPlanning.pretemporada.amistosos].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((a) => (
                    <Card key={a.id} className="p-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0 flex-1 cursor-pointer" style={{ minWidth: 200 }} onClick={() => setAmistosoModal(a)}>
                          <div className="font-bold text-sm" style={{ color: T.navy }}>{fcl2(a.fecha)} · vs {a.rival || "?"}</div>
                          <div className="text-xs" style={{ color: T.muted }}>{a.lugar}{a.objetivo ? ` · Objetivo: ${a.objetivo}` : ""}</div>
                        </div>
                        <div className="flex gap-2">
                          <Btn variant="ghost" icon={Edit3} onClick={() => setAmistosoModal(a)}>Editar</Btn>
                          <Btn variant="danger" icon={Trash2} onClick={() => { if (confirm("¿Eliminar este amistoso?")) removeAmistoso(a.id); }}>Eliminar</Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {!seasonPlanning.pretemporada.amistosos.length && <div className="text-sm" style={{ color: T.muted }}>Sin amistosos programados todavía.</div>}
                </div>
              </div>

              {dayModal && (
                <PlanItemModalForm title="Día de pretemporada"
                  fields={[{ key: "fecha", label: "Fecha", type: "date" }, { key: "tipo", label: "Tipo", type: "select", options: ["Físico", "Técnico", "Táctico", "Descanso", "Amistoso", "Test físico"] }, { key: "notas", label: "Notas", type: "textarea", wide: true }]}
                  initial={dayModal} onClose={() => setDayModal(null)}
                  onSave={(d) => { seasonPlanning.pretemporada.dias.find((x) => x.id === d.id) ? saveDia(d) : addDia(d); setDayModal(null); }}
                  onDelete={seasonPlanning.pretemporada.dias.find((x) => x.id === dayModal.id) ? () => { removeDia(dayModal.id); setDayModal(null); } : null} />
              )}
              {amistosoModal && (
                <PlanItemModalForm title="Partido amistoso"
                  fields={[{ key: "matchId", label: "Vincular partido ya registrado (opcional)", type: "matchRef" }, { key: "fecha", label: "Fecha", type: "date" }, { key: "rival", label: "Rival" }, { key: "lugar", label: "Lugar" }, { key: "objetivo", label: "Objetivo del amistoso", type: "textarea", wide: true }]}
                  initial={amistosoModal} onClose={() => setAmistosoModal(null)}
                  onSave={(a) => { seasonPlanning.pretemporada.amistosos.find((x) => x.id === a.id) ? saveAmistoso(a) : addAmistoso(a); setAmistosoModal(null); }}
                  onDelete={seasonPlanning.pretemporada.amistosos.find((x) => x.id === amistosoModal.id) ? () => { removeAmistoso(amistosoModal.id); setAmistosoModal(null); } : null}
                  matches={matches} />
              )}
            </div>
          )}

          {planTab === "semanal" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end gap-2 flex-wrap"><Btn variant="ghost" icon={BookOpen} onClick={() => setTraer("semana")}>Traer semana del Sistema Tipo</Btn><Btn variant="accent" icon={Plus} onClick={addWeek}>Añadir semana</Btn></div>
              {season.weeks.map((w) => (
                <Card key={w.id} className="p-4 cursor-pointer hover:shadow-md transition relative" onClick={() => setEditWeek(w)}>
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); printWeek(w, config, weekTrainings(w), weekMatches(w)); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Imprimir / PDF">
                      <Printer size={14} style={{ color: T.muted }} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditWeek(w); }} className="p-1.5 rounded-lg hover:bg-slate-100" title="Editar">
                      <Edit3 size={14} style={{ color: T.muted }} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("¿Eliminar esta semana?")) removeWeek(w.id); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Eliminar">
                      <Trash2 size={14} style={{ color: T.redLight }} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 pr-24">
                    <div>
                      <div className="font-extrabold" style={{ color: T.navy }}>Semana {w.numero} · {w.fechaInicio}</div>
                      <div className="text-xs" style={{ color: T.muted }}>{w.objetivo}</div>
                    </div>
                    <div className="flex gap-1.5"><Pill>{weekMatches(w).length} partido(s)</Pill><Pill color={T.green} bg="#E7F6ED">{weekTrainings(w).length} sesión(es)</Pill><Pill color={T.yellow} bg="#FFF6DE">Carga: {w.cargaPrevista}</Pill></div>
                  </div>
                </Card>
              ))}
              {!season.weeks.length && <div className="text-sm" style={{ color: T.muted }}>Sin semanas planificadas todavía.</div>}
            </div>
          )}

          {planTab === "mensual" && (
            <SimplePlanList title="Planificación mensual"
              extra={<Btn variant="ghost" icon={BookOpen} onClick={() => setTraer("mes")}>Traer mes del Sistema Tipo</Btn>}
              items={seasonPlanning.mensual} titleField="mes" subtitleField="objetivo" onPrint={imprimirMes} renderInfo={infoMes}
              blank={() => ({ id: uid(), mes: "", objetivo: "", eventosClave: "", cargaResumen: "" })}
              fields={[{ key: "mes", label: "Mes" }, { key: "objetivo", label: "Objetivo del mes (una semana por línea)", type: "textarea", wide: true }, { key: "eventosClave", label: "Eventos clave", type: "textarea", wide: true }, { key: "cargaResumen", label: "Resumen de carga", type: "textarea", wide: true }]}
              onAdd={(it) => updateSeasonPlanning((p) => ({ ...p, mensual: [...p.mensual, it] }))}
              onSave={(it) => updateSeasonPlanning((p) => ({ ...p, mensual: p.mensual.map((x) => x.id === it.id ? it : x) }))}
              onRemove={(id) => updateSeasonPlanning((p) => ({ ...p, mensual: p.mensual.filter((x) => x.id !== id) }))} />
          )}

          {planTab === "macrociclo" && (
            <SimplePlanList title="Ciclo tipo de la temporada"
              extra={<Btn variant="ghost" icon={BookOpen} onClick={() => setTraer("ciclo")}>Traer ciclos tipo del Sistema Tipo</Btn>}
              items={seasonPlanning.macrociclo} titleField="nombre" subtitleField="objetivo" onPrint={imprimirCiclo} renderInfo={infoCiclo}
              blank={() => ({ id: uid(), nombre: "", fechaInicio: "", fechaFin: "", sesionesPlanificadas: "", objetivo: "" })}
              fields={[{ key: "nombre", label: "Nombre del ciclo tipo (ej: Pretemporada, Ciclo Tipo 1, Ida, Vuelta, Play-offs)" }, { key: "fechaInicio", label: "Fecha de inicio", type: "date" }, { key: "fechaFin", label: "Fecha de fin", type: "date" }, { key: "sesionesPlanificadas", label: "Sesiones de entrenamiento previstas en el ciclo (número)" }, { key: "objetivo", label: "Objetivo de este ciclo tipo", type: "textarea", wide: true }]}
              onAdd={(it) => updateSeasonPlanning((p) => ({ ...p, macrociclo: [...p.macrociclo, it] }))}
              onSave={(it) => updateSeasonPlanning((p) => ({ ...p, macrociclo: p.macrociclo.map((x) => x.id === it.id ? it : x) }))}
              onRemove={(id) => updateSeasonPlanning((p) => ({ ...p, macrociclo: p.macrociclo.filter((x) => x.id !== id) }))} />
          )}

          {planTab === "imprevisto" && (
            <SimplePlanList title="Partido no programado"
              items={seasonPlanning.partidoNoProgramado} titleField="rival" subtitleField="fecha" onPrint={imprimirPartido}
              blank={() => ({ id: uid(), matchId: null, fecha: todayISO(), rival: "", objetivo: "", ajustesTacticos: "" })}
              fields={[{ key: "matchId", label: "Vincular partido ya registrado (opcional)", type: "matchRef" }, { key: "fecha", label: "Fecha", type: "date" }, { key: "rival", label: "Rival" }, { key: "objetivo", label: "Objetivo del partido", type: "textarea", wide: true }, { key: "ajustesTacticos", label: "Ajustes tácticos rápidos", type: "textarea", wide: true }]}
              onAdd={(it) => updateSeasonPlanning((p) => ({ ...p, partidoNoProgramado: [...p.partidoNoProgramado, it] }))}
              onSave={(it) => updateSeasonPlanning((p) => ({ ...p, partidoNoProgramado: p.partidoNoProgramado.map((x) => x.id === it.id ? it : x) }))}
              onRemove={(id) => updateSeasonPlanning((p) => ({ ...p, partidoNoProgramado: p.partidoNoProgramado.filter((x) => x.id !== id) }))}
              matches={matches} />
          )}

          {planTab === "torneo" && (
            <SimplePlanList title="Torneo rápido"
              items={seasonPlanning.torneoRapido} titleField="nombreTorneo" subtitleField="fechaInicio" onPrint={imprimirTorneo}
              blank={() => ({ id: uid(), nombreTorneo: "", fechaInicio: "", fechaFin: "", partidoIds: [], rotacion: "" })}
              fields={[{ key: "nombreTorneo", label: "Nombre del torneo" }, { key: "fechaInicio", label: "Fecha de inicio", type: "date" }, { key: "fechaFin", label: "Fecha de fin", type: "date" }, { key: "partidoIds", label: "Partidos del torneo (elegir de los ya registrados)", type: "matchMultiRef", wide: true }, { key: "rotacion", label: "Plan de rotación / manejo de la fatiga", type: "textarea", wide: true }]}
              onAdd={(it) => updateSeasonPlanning((p) => ({ ...p, torneoRapido: [...p.torneoRapido, it] }))}
              onSave={(it) => updateSeasonPlanning((p) => ({ ...p, torneoRapido: p.torneoRapido.map((x) => x.id === it.id ? it : x) }))}
              onRemove={(id) => updateSeasonPlanning((p) => ({ ...p, torneoRapido: p.torneoRapido.filter((x) => x.id !== id) }))}
              matches={matches} />
          )}

          {planTab === "areas" && <PlanificacionModule ctx={ctx} embedded />}
        </div>
      )}

      {traer && <SistemaTipoModal modo={traer} onClose={() => setTraer(null)} onTraer={traerDesdeST} traidos={traidosST} />}
      {editWeek && (
        <Modal title={`Semana ${editWeek.numero}`} onClose={() => setEditWeek(null)}>
          <div className="flex flex-col gap-3">
            <Field label="Fecha de inicio"><TextInput type="date" value={editWeek.fechaInicio} onChange={(e) => setEditWeek({ ...editWeek, fechaInicio: e.target.value })} /></Field>
            <Field label="Objetivo semanal"><TextArea value={editWeek.objetivo || ""} onChange={(e) => setEditWeek({ ...editWeek, objetivo: e.target.value })} /></Field>
            <Field label="Contenido físico"><TextArea value={editWeek.contenidoFisico || ""} onChange={(e) => setEditWeek({ ...editWeek, contenidoFisico: e.target.value })} /></Field>
            <Field label="Contenido técnico"><TextArea value={editWeek.contenidoTecnico || ""} onChange={(e) => setEditWeek({ ...editWeek, contenidoTecnico: e.target.value })} /></Field>
            <Field label="Contenido táctico"><TextArea value={editWeek.contenidoTactico || ""} onChange={(e) => setEditWeek({ ...editWeek, contenidoTactico: e.target.value })} /></Field>
            <Field label="Contenido psicológico"><TextArea value={editWeek.contenidoPsicologico || ""} onChange={(e) => setEditWeek({ ...editWeek, contenidoPsicologico: e.target.value })} /></Field>
            <Field label="Carga prevista">
              <Select value={editWeek.cargaPrevista} onChange={(e) => setEditWeek({ ...editWeek, cargaPrevista: e.target.value })}><option>Baja</option><option>Media</option><option>Media-alta</option><option>Alta</option></Select>
            </Field>
          </div>
          <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
            <Btn variant="danger" icon={Trash2} onClick={() => { removeWeek(editWeek.id); setEditWeek(null); }}>Eliminar semana</Btn>
            <div className="flex gap-2"><Btn variant="ghost" onClick={() => setEditWeek(null)}>Cancelar</Btn><Btn variant="accent" icon={Save} onClick={() => { saveWeek(editWeek); setEditWeek(null); }}>Guardar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   PLANIFICACIÓN — física / técnica / táctica / psicológica
   ============================================================ */

function PlanificacionModule({ ctx, embedded }) {
  const { planning, updatePlanning, config } = ctx;
  const [tab, setTab] = useState("fisica");
  const [modal, setModal] = useState(null); // {area, item|null}

  const areaLabels = { fisica: "Física", tecnica: "Técnica", tactica: "Táctica", psicologica: "Psicológica" };
  const areaIcons = { fisica: Zap, tecnica: Target, tactica: ClipboardList, psicologica: Brain };

  const addItem = (area, item) => updatePlanning((p) => ({ ...p, [area]: [...p[area], item] }));
  const saveItem = (area, item) => updatePlanning((p) => ({ ...p, [area]: p[area].map((x) => x.id === item.id ? item : x) }));
  const removeItem = (area, id) => updatePlanning((p) => ({ ...p, [area]: p[area].filter((x) => x.id !== id) }));

  return (
    <div className={embedded ? "flex flex-col gap-4" : "flex flex-col gap-5 max-w-4xl"}>
      {!embedded && (
        <div><Eyebrow>Planificación</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Física · Técnica · Táctica · Psicológica</h1>
          <p className="text-sm mt-1" style={{ color: T.muted }}>Herramienta de seguimiento y planificación deportiva del cuerpo técnico. No constituye ni sustituye un diagnóstico médico o psicológico.</p>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(areaLabels).map(([k, l]) => {
          const Icon = areaIcons[k];
          return (
            <button key={k} onClick={() => setTab(k)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold"
              style={{ background: tab === k ? T.navy : "#fff", color: tab === k ? "#fff" : T.muted, border: `1px solid ${tab === k ? T.navy : T.line}` }}>
              <Icon size={15} />{l}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end"><Btn variant="accent" icon={Plus} onClick={() => setModal({ area: tab, item: null })}>Añadir registro</Btn></div>

      {tab === "fisica" && (
        <div className="flex flex-col gap-2.5">
          {planning.fisica.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).map((it) => (
            <Card key={it.id} className="p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-md transition" onClick={() => setModal({ area: "fisica", item: it })}>
              <div className="text-xs font-bold w-24 shrink-0" style={{ color: T.muted }}>{it.fecha}</div>
              <Pill color={T.navy}>{it.capacidad}</Pill>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${it.carga * 10}%`, background: T.red }} /></div>
              <span className="text-xs font-bold" style={{ color: T.navy }}>{it.carga}/10</span>
            </Card>
          ))}
          {!planning.fisica.length && <div className="text-sm" style={{ color: T.muted }}>Sin registros físicos todavía.</div>}
        </div>
      )}

      {tab === "tecnica" && (
        <div className="flex flex-col gap-2.5">
          {planning.tecnica.map((it) => (
            <Card key={it.id} className="p-3.5 cursor-pointer hover:shadow-md transition" onClick={() => setModal({ area: "tecnica", item: it })}>
              <div className="flex items-center justify-between">
                <div className="font-extrabold" style={{ color: T.navy }}>{it.fundamento}</div>
                <span className="text-xs font-bold" style={{ color: T.muted }}>{it.nivelActual} → {it.nivelObjetivo}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>{it.objetivo}</div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-2"><div className="h-full" style={{ width: `${(it.nivelActual / (it.nivelObjetivo || 10)) * 100}%`, background: T.green }} /></div>
            </Card>
          ))}
          {!planning.tecnica.length && <div className="text-sm" style={{ color: T.muted }}>Sin registros técnicos todavía.</div>}
        </div>
      )}

      {tab === "tactica" && (
        <div className="flex flex-col gap-2.5">
          {planning.tactica.map((it) => (
            <Card key={it.id} className="p-3.5 cursor-pointer hover:shadow-md transition" onClick={() => setModal({ area: "tactica", item: it })}>
              <div className="font-extrabold" style={{ color: T.navy }}>{it.nombre}</div>
              <div className="text-xs" style={{ color: T.muted }}>{it.sistema} · {it.modelo}</div>
            </Card>
          ))}
          {!planning.tactica.length && <div className="text-sm" style={{ color: T.muted }}>Sin esquemas tácticos guardados.</div>}
        </div>
      )}

      {tab === "psicologica" && (
        <div className="flex flex-col gap-2.5">
          {planning.psicologica.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).map((it) => (
            <Card key={it.id} className="p-3.5 cursor-pointer hover:shadow-md transition" onClick={() => setModal({ area: "psicologica", item: it })}>
              <div className="flex items-center justify-between">
                <Pill color={T.navy}>{it.area}</Pill>
                <span className="text-xs font-bold" style={{ color: T.muted }}>{it.fecha}</span>
              </div>
              <div className="text-sm mt-1.5" style={{ color: T.text }}>{it.observaciones}</div>
            </Card>
          ))}
          {!planning.psicologica.length && <div className="text-sm" style={{ color: T.muted }}>Sin registros psicológicos todavía.</div>}
        </div>
      )}

      {modal && (
        <PlanningItemForm ctx={ctx} area={modal.area} initial={modal.item} onClose={() => setModal(null)}
          onSave={(item) => { modal.item ? saveItem(modal.area, item) : addItem(modal.area, item); setModal(null); }}
          onDelete={modal.item ? () => { if (confirm("¿Eliminar este registro?")) { removeItem(modal.area, modal.item.id); setModal(null); } } : null} />
      )}
    </div>
  );
}

function PlanningItemForm({ ctx, area, initial, onClose, onSave, onDelete }) {
  const { config, players } = ctx;
  const blanks = {
    fisica: { id: uid(), fecha: todayISO(), capacidad: config.foundations["Físicos"][0], carga: 5, observaciones: "" },
    tecnica: { id: uid(), fundamento: config.foundations["Técnicos"][0], objetivo: "", nivelActual: 5, nivelObjetivo: 8, tareas: "", evolucion: [5] },
    tactica: { id: uid(), nombre: "", sistema: config.tacticalSystems[config.footballType]?.[0] || "", modelo: "", principios: "", faseOfensiva: "", faseDefensiva: "", transiciones: "", balonParado: "", comportamientos: "", slots: [] },
    psicologica: { id: uid(), fecha: todayISO(), area: config.foundations["Psicológicos"][0], observaciones: "" },
  };
  const [f, setF] = useState(initial || blanks[area]);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Modal title={`Registro ${area === "fisica" ? "físico" : area === "tecnica" ? "técnico" : area === "tactica" ? "táctico" : "psicológico"}`} onClose={onClose} wide>
      {area === "fisica" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Fecha"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
          <Field label="Capacidad"><Select value={f.capacidad} onChange={(e) => set("capacidad", e.target.value)}>{config.foundations["Físicos"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label={`Carga de entrenamiento (1-10): ${f.carga}`} className="sm:col-span-2"><input type="range" min="1" max="10" value={f.carga} onChange={(e) => set("carga", Number(e.target.value))} /></Field>
          <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>
        </div>
      )}
      {area === "tecnica" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Fundamento"><Select value={f.fundamento} onChange={(e) => set("fundamento", e.target.value)}>{config.foundations["Técnicos"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Tareas utilizadas"><TextInput value={f.tareas} onChange={(e) => set("tareas", e.target.value)} /></Field>
          <Field label="Nivel actual (1-10)"><TextInput type="number" min="1" max="10" value={f.nivelActual} onChange={(e) => set("nivelActual", Number(e.target.value))} /></Field>
          <Field label="Nivel objetivo (1-10)"><TextInput type="number" min="1" max="10" value={f.nivelObjetivo} onChange={(e) => set("nivelObjetivo", Number(e.target.value))} /></Field>
          <Field label="Objetivo" className="sm:col-span-2"><TextArea value={f.objetivo} onChange={(e) => set("objetivo", e.target.value)} /></Field>
        </div>
      )}
      {area === "tactica" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nombre del esquema"><TextInput value={f.nombre} onChange={(e) => set("nombre", e.target.value)} /></Field>
            <Field label="Sistema">
              <Select value={f.sistema} onChange={(e) => set("sistema", e.target.value)}>{Object.values(config.tacticalSystems).flat().map((s) => <option key={s}>{s}</option>)}</Select>
            </Field>
            <Field label="Modelo de juego" className="sm:col-span-2"><TextInput value={f.modelo} onChange={(e) => set("modelo", e.target.value)} /></Field>
            <Field label="Principios de juego" className="sm:col-span-2"><TextArea value={f.principios} onChange={(e) => set("principios", e.target.value)} /></Field>
            <Field label="Fase ofensiva"><TextArea value={f.faseOfensiva} onChange={(e) => set("faseOfensiva", e.target.value)} /></Field>
            <Field label="Fase defensiva"><TextArea value={f.faseDefensiva} onChange={(e) => set("faseDefensiva", e.target.value)} /></Field>
            <Field label="Transiciones"><TextArea value={f.transiciones} onChange={(e) => set("transiciones", e.target.value)} /></Field>
            <Field label="Balón parado"><TextArea value={f.balonParado} onChange={(e) => set("balonParado", e.target.value)} /></Field>
            <Field label="Comportamientos específicos" className="sm:col-span-2"><TextArea value={f.comportamientos} onChange={(e) => set("comportamientos", e.target.value)} /></Field>
          </div>
          <div>
            <Eyebrow>Esquema sobre el campo</Eyebrow>
            <div className="mt-2"><PitchEditor system={f.sistema} players={players} lineup={f.slots} onChange={(l) => set("slots", l)} /></div>
          </div>
        </div>
      )}
      {area === "psicologica" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Fecha"><TextInput type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} /></Field>
          <Field label="Área"><Select value={f.area} onChange={(e) => set("area", e.target.value)}>{config.foundations["Psicológicos"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Observaciones" className="sm:col-span-2"><TextArea value={f.observaciones} onChange={(e) => set("observaciones", e.target.value)} /></Field>
        </div>
      )}
      <div className="flex justify-between gap-2 mt-5 sticky bottom-0 bg-white -mx-5 px-5 py-3 border-t" style={{ borderColor: T.line }}>
        {onDelete ? <Btn variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Btn> : <div />}
        <div className="flex gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="accent" icon={Save} onClick={() => onSave(f)}>Guardar</Btn></div>
      </div>
    </Modal>
  );
}

/* ============================================================
   INFORMES
   ============================================================ */

function printPlayerReport(p, config, matches, trainings) {
  const esc = (s) => (s || "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const kv = (label, value) => `<div class="kv"><span class="kvLabel">${esc(label)}</span><span class="kvValue">${esc(value) || "—"}</span></div>`;
  const stat = (label, value, color) => `<div class="statTile"><div class="statVal" style="color:${color};">${value ?? "-"}</div><div class="statLabel">${esc(label)}</div></div>`;
  const playerMatches = (matches || []).filter((m) => (m.convocatoria || []).some((c) => c.jugadorId === p.id && c.estado === "Convocado")).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const playerTrainings = (trainings || []).filter((t) => (t.asistencia || []).some((a) => a.jugadorId === p.id)).sort((a, b) => b.fecha.localeCompare(a.fecha));
  // ---- Datos completos de la temporada de este jugador ----
  const fmtFecha = (f) => { const [a, m, d] = String(f || "").split("-"); return d && m ? `${d}/${m}/${a}` : esc(f); };
  const vals = p.stats?.valoraciones || [];
  const valoracionMedia = vals.length ? (vals.reduce((x, y) => x + y, 0) / vals.length).toFixed(1) : "-";
  const pctEntrenos = p.stats?.entrenamientosTotales ? `${Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100)}%` : "-";
  const filasPartidos = [...playerMatches].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((m) => {
    const e = computeMatchStatsForPlayer(p.id, [m]);
    const val = m.valoracionesJugadores?.[p.id];
    const tarj = e.amarillas + e.rojas ? `${e.amarillas ? e.amarillas + "A" : ""}${e.amarillas && e.rojas ? " " : ""}${e.rojas ? e.rojas + "R" : ""}` : "—";
    return { m, e, val, tarj };
  });
  const muchos = filasPartidos.length > 12;
  const filaHtml = ({ m, e, val, tarj }) => muchos
    ? `<tr><td>${fmtFecha(m.fecha).slice(0, 5)}</td><td>${esc(m.rival)}</td><td class="c">${esc(m.resultadoFinal) || "—"}</td><td class="c">${e.minutos}</td><td class="c">${e.goles}</td><td class="c">${e.asistencias}</td><td class="c">${val != null ? esc(val) : "—"}</td></tr>`
    : `<tr><td>${fmtFecha(m.fecha)}</td><td>${esc(m.rival)}</td><td class="c">${esc(m.resultadoFinal) || "—"}</td><td class="c">${e.minutos}</td><td class="c">${e.goles}</td><td class="c">${e.asistencias}</td><td class="c">${tarj}</td><td class="c">${val != null ? esc(val) : "—"}</td></tr>`;
  const cabeceraPartidos = muchos
    ? `<tr><th>Fecha</th><th>Rival</th><th class="c">Res.</th><th class="c">Min.</th><th class="c">G</th><th class="c">A</th><th class="c">Val.</th></tr>`
    : `<tr><th>Fecha</th><th>Rival</th><th class="c">Resultado</th><th class="c">Min.</th><th class="c">Goles</th><th class="c">Asist.</th><th class="c">Tarjetas</th><th class="c">Valoración</th></tr>`;
  const tablaPartidos = (filas) => `<table class="mini"><thead>${cabeceraPartidos}</thead><tbody>${filas.map(filaHtml).join("")}</tbody></table>`;
  const partidosTemporada = !filasPartidos.length ? "" : muchos
    ? `<div class="dosCol">${tablaPartidos(filasPartidos.slice(0, Math.ceil(filasPartidos.length / 2)))}${tablaPartidos(filasPartidos.slice(Math.ceil(filasPartidos.length / 2)))}</div>`
    : tablaPartidos(filasPartidos);
  const entrenosTemporada = [...playerTrainings].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((t) => {
    const row = (t.asistencia || []).find((a) => a.jugadorId === p.id);
    const estado = row?.estado === "Asiste" ? "ok" : row?.estado === "Lesionado" ? "les" : "no";
    return `<span class="chip ${estado}" title="${esc(sessionDisplayName(t))}">${fmtFecha(t.fecha).slice(0, 5)}</span>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(p.nombre)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { background: #E9EDF3; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; }
    .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 18px 22px 20px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .brandRow { display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 14px; }
    .brandLogo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; }
    .teamName { font-size: 11px; font-weight: 700; color: #64748B; flex: 1; }
    .reportTag { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #E63946; letter-spacing: 0.5px; }
    .playerHeader { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
    .playerPhoto { width: 76px; height: 76px; border-radius: 16px; object-fit: cover; border: 2px solid #0B1F3A; flex-shrink: 0; }
    .playerPhotoPlaceholder { display: flex; align-items: center; justify-content: center; background: #0B1F3A; color: #fff; font-size: 32px; font-weight: 900; }
    .dorsal { font-size: 40px; font-weight: 900; color: #E63946; min-width: 60px; text-align: center; flex-shrink: 0; }
    .playerHeaderInfo { flex: 1; }
    .playerName { font-size: 24px; font-weight: 900; color: #0B1F3A; line-height: 1.1; }
    .playerSub { font-size: 12px; color: #64748B; font-weight: 600; margin-top: 2px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 16px; margin-bottom: 12px; }
    .kv { display: flex; flex-direction: column; }
    .kvLabel { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94A3B8; }
    .kvValue { font-size: 12px; color: #1B2733; font-weight: 700; }
    .statsRow { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; margin-bottom: 12px; }
    .statTile { min-width: 0; text-align: center; background: #F5F7FA; border-radius: 10px; padding: 8px 4px; }
    .statVal { font-size: 20px; font-weight: 900; }
    .statLabel { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-top: 2px; }
    .section { margin-top: 10px; }
    .sectionTitle { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fff; background: #0B1F3A; padding: 3px 10px; border-radius: 999px; display: inline-block; margin-bottom: 6px; }
    .block { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 10px; font-size: 11px; line-height: 1.4; }
    .item { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; margin-bottom: 4px; font-size: 10.5px; line-height: 1.4; }
    .barsWrap { display: flex; align-items: flex-end; gap: 4px; height: 70px; background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px; }
    .barItem { flex: 1; min-width: 6px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: stretch; }
    .barNum { font-size: 8px; font-weight: 800; color: #475569; text-align: center; line-height: 1.2; }
    .barCol { border-radius: 3px 3px 0 0; }
    .footer { margin-top: 14px; text-align: center; font-size: 8.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 8px; }
        .rankBox { margin-left: auto; text-align: center; border: 2px solid #E63946; border-radius: 14px; padding: 8px 16px 6px; flex-shrink: 0; }
    .rankLabel { font-size: 8px; text-transform: uppercase; letter-spacing: 0.4px; font-weight: 800; color: #64748B; }
    .rankValue { font-size: 38px; font-weight: 900; color: #E63946; line-height: 1.05; }
    .dosCol { display: flex; gap: 10px; align-items: flex-start; }
    .dosCol table.mini { width: 50%; font-size: 8.5px; }
    .dosCol table.mini td, .dosCol table.mini th { padding: 2px 4px; }
    table.mini { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 4px; }
    table.mini th { background: #F1F5F9; color: #475569; text-transform: uppercase; font-size: 8.5px; padding: 5px 6px; text-align: left; }
    table.mini td { padding: 5px 6px; border-bottom: 1px solid #E2E8F0; }
    table.mini .c { text-align: center; }
    .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .chip { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 999px; display: inline-block; }
    .chip.ok { background: #DDF3E5; color: #1E7A44; } .chip.no { background: #FBE0E3; color: #B42335; } .chip.les { background: #FFF1CC; color: #946B00; }
    .chipLeyenda { margin-top: 6px; display: flex; gap: 6px; }
    @media print {
      html, body { background: #fff; }
      .toolbar { display: none !important; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
      body { padding: 0; }
    }
  </style></head>
  <body>
    <div class="toolbar">
      <button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <button class="btnClose" onclick="window.close()">Cerrar vista previa</button>
    </div>
    <div class="sheet">
      <div class="brandRow">
        ${config.logo ? `<img class="brandLogo" src="${config.logo}" />` : ""}
        <div class="teamName">${esc(config.teamName || "Equipo")}</div>
        <div class="reportTag">Informe de jugador</div>
      </div>

      <div class="playerHeader">
        ${p.foto ? `<img class="playerPhoto" src="${p.foto}" />` : `<div class="playerPhoto playerPhotoPlaceholder">${esc((p.nombre || "?").charAt(0))}</div>`}
        <div class="dorsal">${esc(p.numero) || "-"}</div>
        <div class="playerHeaderInfo">
          <div class="playerName">${esc(p.nombre)}</div>
          <div class="playerSub">${esc(p.posicion)}${p.secundarias?.length ? ` · también: ${esc(p.secundarias.join(", "))}` : ""}</div>
          <div class="playerSub">${calcAge(p.dob) ?? "-"} años · ${esc(config.category)}</div>
        </div>
        <div class="rankBox">
          <div class="rankLabel">Ranking de la temporada</div>
          <div class="rankValue">${rankingScore(p, config.rankingWeights)}</div>
        </div>
      </div>

      <div class="grid3">
        ${kv("Apodo", p.apodo)}
        ${kv("Pie hábil", p.pie)}
        ${kv("Altura", p.altura ? `${p.altura} cm` : "")}
        ${kv("Peso", p.peso ? `${p.peso} kg` : "")}
        ${kv("Estado", p.estado)}
        ${kv("Fecha de nacimiento", p.dob)}
        ${kv("Fecha de incorporación", p.fechaIncorporacion)}
      </div>

      <div class="statsRow">
        ${stat("Convocatorias", p.stats?.convocatorias, "#0B1F3A")}
        ${stat("Titular", p.stats?.titular, "#0B1F3A")}
        ${stat("Suplente", p.stats?.suplente, "#0B1F3A")}
        ${stat("Minutos", p.stats?.minutos, "#0B1F3A")}
        ${stat("Goles", p.stats?.goles, "#E63946")}
        ${stat("Asistencias", p.stats?.asistencias, "#2A9D5C")}
        ${stat("Amarillas", p.stats?.amarillas, "#F4B400")}
        ${stat("Rojas", p.stats?.rojas, "#E63946")}
        ${stat("Capitanías", p.stats?.capitanias, "#0B1F3A")}
        ${stat("MVP", p.stats?.mvps, "#E63946")}
        ${stat("Valoración media", valoracionMedia, "#0B1F3A")}
        ${stat("% Asist. entrenos", pctEntrenos, "#2A9D5C")}
      </div>

      <div class="section">
        <div class="sectionTitle" style="background:#2A9D5C;">Asistencia a entrenamientos</div>
        <div class="block">${p.stats?.entrenamientosTotales ? `${p.stats.entrenamientosRealizados} de ${p.stats.entrenamientosTotales} sesiones (${Math.round((p.stats.entrenamientosRealizados / p.stats.entrenamientosTotales) * 100)}%)` : "Sin sesiones registradas todavía."}</div>
      </div>

      ${(() => {
        if (!p.tests?.length) return "";
        const grouped = {};
        [...p.tests].sort((a, b) => a.fecha.localeCompare(b.fecha)).forEach((t) => { (grouped[t.nombre] = grouped[t.nombre] || []).push(t); });
        const rows = Object.entries(grouped).map(([nombre, arr]) => {
          const linea = arr.map((t) => `${esc(t.fecha)}: ${esc(t.medicion) || "-"} (${esc(valoracionTestTexto(t))})`).join(" &nbsp;→&nbsp; ");
          return `<div class="item"><b>${esc(nombre)}</b> (${esc(arr[0].tipo)}): ${linea}</div>`;
        }).join("");
        return `<div class="section"><div class="sectionTitle" style="background:#F4B400;">Tests durante la temporada</div>${rows}</div>`;
      })()}

      ${(() => { const serie = serieEvolucionJugador(p.id, matches); return serie.length ? `<div class="section"><div class="sectionTitle" style="background:#0B1F3A;">Evolución de la valoración en los partidos de la temporada</div><div style="padding:6px 0;">${evolucionHTML(serie)}</div></div>` : ""; })()}

      ${(() => {
        const pf = [...(p.pruebasFisicas || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
        if (!pf.length) return "";
        const last = pf[pf.length - 1];
        const rows = [["Velocidad 20m (s)", last.velocidad20m], ["Velocidad zigzag (s)", last.velocidadZigzag20m], ["Control de balón (s)", last.controlBalon],
          ["VO₂ máx.", last.vo2max], ["Abdominales/min", last.abdominalesMin], ["Flexiones/min", last.flexionesMin], ["Golpeo (m)", last.golpeoDistancia]]
          .filter(([, v]) => v != null && v !== "").map(([l, v]) => kv(l, v)).join("");
        return `<div class="section"><div class="sectionTitle" style="background:#2A9D5C;">Pruebas físicas (último registro: ${esc(last.fecha)})</div><div class="grid3">${rows}</div></div>`;
      })()}

      ${partidosTemporada ? `<div class="section"><div class="sectionTitle" style="background:#0B1F3A;">Partidos de la temporada (${playerMatches.length})</div>
        ${partidosTemporada}</div>` : ""}

      ${entrenosTemporada ? `<div class="section"><div class="sectionTitle" style="background:#2A9D5C;">Entrenamientos de la temporada (${playerTrainings.length})</div>
        <div class="chips">${entrenosTemporada}</div>
        <div class="chipLeyenda"><span class="chip ok">asistió</span> <span class="chip no">no asistió</span> <span class="chip les">lesionado</span></div></div>` : ""}

      ${p.observaciones ? `<div class="section"><div class="sectionTitle">Observaciones</div><div class="block">${esc(p.observaciones)}</div></div>` : ""}

      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

/* ============================================================
   Estadísticas imprimibles y informe de temporada
   - Estadísticas: UNA hoja A4 (con ajuste automático).
   - Informe de temporada: puede ocupar las hojas que haga falta.
   ============================================================ */
function prepararDatosTemporada({ players, matches, trainings, season, seasonPlanning, config }) {
  const hoy = todayISO();
  const ts = computeTeamStats(matches);
  const ordenados = [...matches].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const jugados = ordenados.map((m) => ({ m, ...resultadoPropio(m) })).filter((p) => p.resultado !== "P");
  const valoraciones = jugados
    .filter((p) => Object.values(p.m.valoracionesJugadores || {}).length > 0)
    .map((p) => { const v = Object.values(p.m.valoracionesJugadores); return { m: p.m, avg: v.reduce((a, b) => a + b, 0) / v.length }; });
  const hechas = (trainings || []).filter((t) => t.fecha && t.fecha <= hoy);
  const programadas = (trainings || []).filter((t) => t.fecha && t.fecha > hoy).length;
  const totEntr = players.reduce((s, p) => s + (p.stats?.entrenamientosTotales || 0), 0);
  const realEntr = players.reduce((s, p) => s + (p.stats?.entrenamientosRealizados || 0), 0);
  const porMes = {}; hechas.forEach((t) => { const k = t.fecha.slice(0, 7); porMes[k] = (porMes[k] || 0) + 1; });
  const conPosesion = jugados.filter((p) => p.m.posesionBalon !== "" && p.m.posesionBalon != null);
  const parcial = (lista) => ({ j: lista.length, v: lista.filter((p) => p.resultado === "V").length, e: lista.filter((p) => p.resultado === "E").length, d: lista.filter((p) => p.resultado === "D").length,
    gf: lista.reduce((s, p) => s + p.golesPropios, 0), gc: lista.reduce((s, p) => s + p.golesRival, 0) });
  return {
    season, seasonPlanning, config, players, matches, trainings: trainings || [], ts, jugados, valoraciones, hechas, programadas,
    puntos: ts.v * 3 + ts.e,
    asistenciaMedia: totEntr ? Math.round((realEntr / totEntr) * 100) : null,
    porMes,
    posesionMedia: conPosesion.length ? Math.round(conPosesion.reduce((s, p) => s + Number(p.m.posesionBalon), 0) / conPosesion.length) : null,
    tiros: jugados.reduce((s, p) => s + (Number(p.m.tirosPuerta) || 0), 0),
    oportunidades: jugados.reduce((s, p) => s + (Number(p.m.oportunidadesFalladas) || 0), 0),
    local: parcial(jugados.filter((p) => p.m.esLocal)), visitante: parcial(jugados.filter((p) => !p.m.esLocal)),
  };
}

// Dibuja un gráfico igual que en pantalla y lo adapta al ancho de la hoja
function graficoParaImprimir(Comp, props, alto, renderToStaticMarkup) {
  const marcado = renderToStaticMarkup(React.createElement(Comp, props));
  return marcado.replace(/<svg[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, "").replace("<svg", `<svg style="width:100%;${alto ? `height:${alto}px;` : "height:auto;"}"`));
}

const CSS_INFORME_BASE = `
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { background: #E9EDF3; margin: 0; }
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1B2733; padding: 14px; font-size: 11px; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; gap: 10px; padding: 8px 0 14px; z-index: 50; }
    .toolbar button { font-family: inherit; font-size: 13px; font-weight: 800; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
    .btnPrint { background: #E63946; color: #fff; } .btnClose { background: #fff; color: #0B1F3A; border: 1.5px solid #CBD5E1 !important; }
    .sheet { max-width: 210mm; margin: 0 auto; background: #fff; border-radius: 14px; padding: 18px 22px 20px; box-shadow: 0 6px 24px rgba(11,31,58,0.15); }
    .head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0B1F3A; padding-bottom: 8px; margin-bottom: 10px; gap: 12px; }
    .title { font-size: 21px; font-weight: 900; color: #0B1F3A; } .meta { font-size: 10.5px; color: #64748B; margin-top: 2px; }
    .section { margin-top: 12px; break-inside: avoid; }
    .sectionTitle { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fff; padding: 3px 11px; border-radius: 999px; display: inline-block; margin-bottom: 6px; }
    .block { background: #FAFBFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 7px 10px; font-size: 10.5px; line-height: 1.4; white-space: pre-line; }
    .tiles { display: grid; gap: 7px; } .t6 { grid-template-columns: repeat(6, 1fr); } .t4 { grid-template-columns: repeat(4, 1fr); }
    .tile { text-align: center; background: #F5F7FA; border-radius: 10px; padding: 8px 4px; min-width: 0; }
    .tileVal { font-size: 19px; font-weight: 900; color: #0B1F3A; line-height: 1.1; } .tileLab { font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #64748B; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
    thead { display: table-header-group; } tr { break-inside: avoid; }
    th { text-align: left; background: #F1F5F9; color: #475569; text-transform: uppercase; font-size: 8px; padding: 4px 5px; }
    td { padding: 3px 5px; border-bottom: 1px solid #E2E8F0; } .c { text-align: center; } .b { font-weight: 800; }
    .res { display: inline-block; min-width: 18px; text-align: center; border-radius: 6px; padding: 1px 4px; font-weight: 800; color: #fff; font-size: 9px; }
    .grafico { border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px 10px; break-inside: avoid; } .grafico .guia { font-size: 9px; color: #64748B; margin: 0 0 4px; }
    .flex { display: flex; } .flex-wrap { flex-wrap: wrap; } .gap-x-5 { column-gap: 20px; } .gap-y-1 { row-gap: 3px; } .text-xs { font-size: 10px; } .font-bold { font-weight: 700; } .mt-2 { margin-top: 6px; } .overflow-x-auto { overflow: visible; }
    .tops { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; } .top { font-size: 10px; } .top h4 { margin: 0 0 3px; font-size: 9.5px; text-transform: uppercase; color: #0B1F3A; }
    .top div { display: flex; justify-content: space-between; border-bottom: 1px solid #EEF2F6; padding: 1.5px 0; }
    .footer { margin-top: 14px; text-align: center; font-size: 9px; color: #94A3B8; }
    @media print { html, body { background: #fff; } .toolbar { display: none !important; } .sheet { box-shadow: none; padding: 0; border-radius: 0; max-width: none; } body { padding: 0; } }`;

function bloquesComunesTemporada(d, altos = {}, render) {
  const esc = (s) => (s ?? "").toString().replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const tile = (valor, etiqueta, color) => `<div class="tile"><div class="tileVal" ${color ? `style="color:${color};"` : ""}>${valor}</div><div class="tileLab">${esc(etiqueta)}</div></div>`;
  const { ts } = d;
  const dg = ts.gf - ts.gc;
  const tilesResumen = [
    tile(ts.jugados, "Jugados"), tile(`${ts.v}-${ts.e}-${ts.d}`, "Victorias-Empates-Derrotas"), tile(d.puntos, "Puntos", "#E63946"),
    tile(ts.jugados ? `${Math.round((ts.v / ts.jugados) * 100)}%` : "-", "% victorias", "#2A9D5C"), tile(ts.gf, "Goles a favor"), tile(ts.gc, "Goles en contra"),
    tile(dg > 0 ? `+${dg}` : dg, "Diferencia de goles", dg >= 0 ? "#2A9D5C" : "#E5555F"), tile(ts.jugados ? (ts.gf / ts.jugados).toFixed(1) : "-", "Goles por partido"),
    tile(d.posesionMedia != null ? `${d.posesionMedia}%` : "-", "Posesión media"), tile(d.tiros, "Tiros a puerta"), tile(d.oportunidades, "Oportunidades falladas", "#E5555F"),
    tile(d.hechas.length, "Sesiones entrenadas", "#0B1F3A"),
  ].join("");
  const top = (titulo, lista, campo) => `<div class="top"><h4>${esc(titulo)}</h4>${lista.length ? lista.map((p) => `<div><span>${esc(p.nombre)}</span><b>${p.stats[campo]}</b></div>`).join("") : "<div><span>—</span></div>"}</div>`;
  const maxPor = (campo) => [...d.players].filter((p) => (p.stats?.[campo] || 0) > 0).sort((a, b) => b.stats[campo] - a.stats[campo]).slice(0, 5);
  const tops = `<div class="tops">${top("Goleadores", maxPor("goles"), "goles")}${top("Asistentes", maxPor("asistencias"), "asistencias")}${top("Jugador del partido (MVP)", maxPor("mvps"), "mvps")}</div>`;
  const hayRes = d.jugados.length > 0;
  const graficos = {
    resultados: hayRes ? graficoParaImprimir(GraficoResultados, { partidos: d.jugados }, altos.resultados, render) : "",
    puntos: hayRes ? graficoParaImprimir(GraficoPuntos, { partidos: d.jugados }, altos.puntos, render) : "",
    valoracion: d.valoraciones.length ? graficoParaImprimir(GraficoValoracion, { items: d.valoraciones }, altos.valoracion, render) : "",
  };
  return { esc, tile, tilesResumen, tops, graficos };
}

async function printEstadisticas(d) {
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write("<p style='font-family:sans-serif;padding:24px;color:#475569'>Preparando la hoja de estadísticas…</p>"); w.document.close(); }
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { esc, tilesResumen, tops, graficos } = bloquesComunesTemporada(d, { resultados: 165, puntos: 185, valoracion: 185 }, renderToStaticMarkup);
  const cuadro = (titulo, guia, svg, vacio) => `<div class="grafico"><div class="sectionTitle" style="background:#0B1F3A;">${esc(titulo)}</div><p class="guia">${esc(guia)}</p>${svg || `<div class="guia">${esc(vacio)}</div>`}</div>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Estadísticas</title>
  <style>@page { size: A4; margin: 10mm; }${CSS_INFORME_BASE}</style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="head"><div><div class="title">${esc(d.config.teamName)} — Estadísticas</div><div class="meta">${esc(d.config.category)} · ${esc(d.season.competicion)} · ${esc(d.season.fechaInicio)} — ${esc(d.season.fechaFin)}</div></div><div class="meta">Impreso el ${esc(todayISO())}</div></div>
      <div class="tiles t6">${tilesResumen}</div>
      <div class="section">${cuadro("Resultados por jornada", "Arriba si ganas, en medio si empatas y abajo si pierdes. El número es el marcador (tus goles - goles del rival).", graficos.resultados, "Sin partidos jugados todavía.")}</div>
      <div class="section">${cuadro("Puntos acumulados por jornada", "Victoria 3, empate 1, derrota 0. La línea gris es el máximo posible.", graficos.puntos, "Sin partidos jugados todavía.")}</div>
      <div class="section">${cuadro("Valoración del entrenador", "Media de las notas (de 0 a 10) de cada partido.", graficos.valoracion, "Todavía no has valorado a los jugadores.")}</div>
      <div class="section">${tops}</div>
      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
  </body></html>`;
  if (w) { w.document.open(); w.document.write(ajusteA4(html)); w.document.close(); }
}

// Informe de temporada: completo, puede ocupar varias hojas (no se reduce a una).
async function printSeasonReport(d) {
  const w = window.open("", "_blank");
  if (w) { w.document.open(); w.document.write("<p style='font-family:sans-serif;padding:24px;color:#475569'>Preparando el informe de temporada…</p>"); w.document.close(); }
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { esc, tile, tilesResumen, tops, graficos } = bloquesComunesTemporada(d, {}, renderToStaticMarkup);
  const { season, seasonPlanning, config } = d;
  const fcl = (f) => { const [a, m, dd] = String(f || "").split("-"); return dd && m ? `${dd}/${m}/${a}` : esc(f) || "—"; };
  const block = (label, value, color) => value ? `<div class="section"><div class="sectionTitle" style="background:${color};">${esc(label)}</div><div class="block">${esc(value)}</div></div>` : "";
  const colorRes = { V: "#2A9D5C", E: "#F4B400", D: "#E5555F" };
  const filasPartidos = d.jugados.map((p, i) => `<tr><td class="b">J${esc(p.m.jornada || i + 1)}</td><td>${fcl(p.m.fecha)}</td><td>${esc(p.m.rival)}</td><td>${p.m.esLocal ? "Casa" : "Fuera"}</td><td class="c b">${p.golesPropios}-${p.golesRival}</td><td class="c"><span class="res" style="background:${colorRes[p.resultado]};">${p.resultado}</span></td></tr>`).join("");
  const parcial = (n, x) => `<tr><td class="b">${n}</td><td class="c">${x.j}</td><td class="c">${x.v}</td><td class="c">${x.e}</td><td class="c">${x.d}</td><td class="c">${x.gf}</td><td class="c">${x.gc}</td><td class="c b">${x.v * 3 + x.e}</td></tr>`;
  const jugadoresOrd = [...d.players].sort((a, b) => (Number(a.numero) || 99) - (Number(b.numero) || 99));
  const filasJug = jugadoresOrd.map((p) => {
    const st = p.stats || {}; const pct = st.entrenamientosTotales ? `${Math.round((st.entrenamientosRealizados / st.entrenamientosTotales) * 100)}%` : "—";
    const vals = st.valoraciones || []; const vm = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
    return `<tr><td class="c b">${esc(p.numero)}</td><td class="b">${esc(p.nombre)}</td><td>${esc(p.posicion)}</td><td class="c">${st.convocatorias ?? 0}</td><td class="c">${st.minutos ?? 0}</td><td class="c">${st.goles ?? 0}</td><td class="c">${st.asistencias ?? 0}</td><td class="c">${(st.amarillas || 0)}A ${(st.rojas || 0)}R</td><td class="c">${st.mvps ?? 0}</td><td class="c">${vm}</td><td class="c">${pct}</td><td class="c b">${rankingScore(p, config.rankingWeights)}</td></tr>`;
  }).join("");
  const nombreMes = (k) => { const t = new Date(`${k}-01T12:00:00`).toLocaleDateString("es-ES", { month: "long", year: "numeric" }); return t.charAt(0).toUpperCase() + t.slice(1); };
  const filasMes = Object.keys(d.porMes).sort().map((k) => `<tr><td>${esc(nombreMes(k))}</td><td class="c b">${d.porMes[k]}</td></tr>`).join("");
  const sesionesEntre = (ini, fin) => d.trainings.filter((t) => t.fecha && ini && fin && t.fecha >= ini && t.fecha <= fin && t.fecha <= todayISO()).length;
  const ciclos = (seasonPlanning?.macrociclo || []).map((c) => `<tr><td class="b">${esc(c.nombre)}</td><td>${fcl(c.fechaInicio)} – ${fcl(c.fechaFin)}</td><td class="c">${c.sesionesPlanificadas != null ? c.sesionesPlanificadas + " plan. · " : ""}${sesionesEntre(c.fechaInicio, c.fechaFin)} real.</td></tr>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informe de temporada</title>
  <style>@page { size: A4; margin: 10mm; }${CSS_INFORME_BASE}</style></head><body>
    <div class="toolbar"><button class="btnPrint" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button><button class="btnClose" onclick="window.close()">Cerrar vista previa</button></div>
    <div class="sheet">
      <div class="head"><div><div class="title">${esc(config.teamName)} — Informe de temporada</div><div class="meta">${esc(config.category)} · ${esc(season.competicion)} · ${fcl(season.fechaInicio)} — ${fcl(season.fechaFin)}${season.localidad ? " · " + esc(season.localidad) : ""}</div></div><div class="meta">Impreso el ${fcl(todayISO())}</div></div>

      ${block("Objetivos generales", season.objetivosGenerales, "#0B1F3A")}${block("Objetivos deportivos", season.objetivosDeportivos, "#E63946")}${block("Objetivos formativos", season.objetivosFormativos, "#2A9D5C")}
      <div class="section"><div class="sectionTitle" style="background:#64748B;">Cuerpo técnico</div><div class="block">${(season.cuerpoTecnico || []).map((c) => `${esc(c.nombre)}${c.cargo ? ` (${esc(c.cargo)})` : ""}`).join(", ") || "—"}</div></div>

      <div class="section"><div class="sectionTitle" style="background:#0B1F3A;">Resumen de la temporada</div><div class="tiles t6">${tilesResumen}</div></div>

      <div class="section"><div class="sectionTitle" style="background:#2A9D5C;">Entrenamientos</div>
        <div class="tiles t4">${tile(d.hechas.length, "Sesiones entrenadas", "#0B1F3A")}${tile(d.programadas, "Sesiones programadas por venir")}${tile(d.asistenciaMedia != null ? `${d.asistenciaMedia}%` : "—", "Asistencia media del equipo", "#2A9D5C")}${tile(season.weeks?.length || 0, "Semanas planificadas")}</div>
        ${filasMes ? `<table style="margin-top:8px;max-width:340px;"><thead><tr><th>Mes</th><th class="c">Sesiones entrenadas</th></tr></thead><tbody>${filasMes}</tbody></table>` : ""}
        ${ciclos ? `<table style="margin-top:8px;"><thead><tr><th>Ciclo tipo</th><th>Fechas</th><th class="c">Sesiones</th></tr></thead><tbody>${ciclos}</tbody></table>` : ""}
      </div>

      <div class="section"><div class="sectionTitle" style="background:#E63946;">Rendimiento en casa y fuera</div>
        <table><thead><tr><th></th><th class="c">PJ</th><th class="c">G</th><th class="c">E</th><th class="c">P</th><th class="c">GF</th><th class="c">GC</th><th class="c">Pts</th></tr></thead><tbody>${parcial("En casa", d.local)}${parcial("Fuera", d.visitante)}${parcial("Total", { j: d.ts.jugados, v: d.ts.v, e: d.ts.e, d: d.ts.d, gf: d.ts.gf, gc: d.ts.gc })}</tbody></table></div>

      ${filasPartidos ? `<div class="section" style="break-inside:auto;"><div class="sectionTitle" style="background:#0B1F3A;">Resultados (${d.jugados.length} partidos)</div>
        <table><thead><tr><th>Jornada</th><th>Fecha</th><th>Rival</th><th>Campo</th><th class="c">Marcador</th><th class="c"></th></tr></thead><tbody>${filasPartidos}</tbody></table></div>` : ""}

      ${graficos.resultados ? `<div class="section"><div class="grafico"><div class="sectionTitle" style="background:#0B1F3A;">Resultados por jornada</div><p class="guia">Arriba si ganas, en medio si empatas y abajo si pierdes. El número es el marcador (tus goles - goles del rival).</p>${graficos.resultados}</div></div>` : ""}
      ${graficos.puntos ? `<div class="section"><div class="grafico"><div class="sectionTitle" style="background:#E63946;">Puntos acumulados por jornada</div><p class="guia">Victoria 3, empate 1, derrota 0. La línea gris es el máximo posible si se ganase todo.</p>${graficos.puntos}</div></div>` : ""}
      ${graficos.valoracion ? `<div class="section"><div class="grafico"><div class="sectionTitle" style="background:#2A9D5C;">Valoración del entrenador</div><p class="guia">Media de las notas (de 0 a 10) de cada partido.</p>${graficos.valoracion}</div></div>` : ""}

      <div class="section"><div class="sectionTitle" style="background:#64748B;">Destacados</div>${tops}</div>

      <div class="section" style="break-inside:auto;"><div class="sectionTitle" style="background:#0B1F3A;">Plantilla (${d.players.length} jugadores)</div>
        <table><thead><tr><th class="c">Nº</th><th>Jugador</th><th>Posición</th><th class="c">Conv.</th><th class="c">Min.</th><th class="c">G</th><th class="c">A</th><th class="c">Tarj.</th><th class="c">MVP</th><th class="c">Val.</th><th class="c">% Asist.</th><th class="c">Rank.</th></tr></thead><tbody>${filasJug}</tbody></table></div>

      <div class="footer">Generado con PZ · Puntualización Zonal</div>
    </div>
  </body></html>`;
  if (w) { w.document.open(); w.document.write(conJustificado(html)); w.document.close(); }
}


function InformesModule({ ctx }) {
  const { matches, players, updatePlayers, trainingsTodas: trainings, season, config } = ctx;
  const [tipo, setTipo] = useState("partido");
  const [entityId, setEntityId] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const tipos = [["partido", "Informe de partido"], ["jugador", "Informe de jugador"], ["entrenamiento", "Informe de entrenamiento"], ["temporada", "Informe de temporada"]];

  const entity = tipo === "partido" ? matches.find((m) => m.id === entityId)
    : tipo === "jugador" ? players.find((p) => p.id === entityId)
    : tipo === "entrenamiento" ? trainings.find((t) => t.id === entityId)
    : season;

  const options = tipo === "partido" ? matches.map((m) => ({ id: m.id, label: `${m.fecha} · vs ${m.rival}` }))
    : tipo === "jugador" ? players.map((p) => ({ id: p.id, label: p.nombre }))
    : tipo === "entrenamiento" ? trainings.map((t) => ({ id: t.id, label: `${t.fecha} · ${sessionDisplayName(t)}` }))
    : [];
  const selectedLabel = options.find((o) => o.id === entityId)?.label;

  const doPrint = () => {
    if (tipo === "partido") printMatch(entity, config, players);
    else if (tipo === "entrenamiento") printTraining(entity, config, players);
    else if (tipo === "jugador") printPlayerReport(entity, config, matches, trainings);
    else printSeasonReport(prepararDatosTemporada({ players, matches, trainings: ctx.trainings, season: entity, seasonPlanning: ctx.seasonPlanning, config }));
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div><Eyebrow>Informes</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Generar informe</h1></div>

      <div className="flex gap-1.5 flex-wrap">
        {tipos.map(([k, l]) => (
          <button key={k} onClick={() => { setTipo(k); setEntityId(""); }} className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: tipo === k ? T.navy : "#fff", color: tipo === k ? "#fff" : T.muted, border: `1px solid ${tipo === k ? T.navy : T.line}` }}>{l}</button>
        ))}
      </div>

      {tipo !== "temporada" && (
        <div>
          <button onClick={() => setShowPicker(true)}
            className="w-full text-left px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-between"
            style={{ borderColor: T.line, color: selectedLabel ? T.navy : T.muted, background: "#fff" }}>
            {selectedLabel || "Seleccionar…"} <ChevronRight size={16} style={{ color: T.muted }} />
          </button>
          {showPicker && (
            <Modal title="Seleccionar" onClose={() => setShowPicker(false)}>
              <div className="flex flex-col gap-1.5 max-h-[55vh] overflow-y-auto">
                {options.map((o) => (
                  <button key={o.id} onClick={() => { setEntityId(o.id); setShowPicker(false); }}
                    className="p-3 rounded-xl text-left text-sm font-bold border"
                    style={{ borderColor: entityId === o.id ? T.navy : T.line, background: entityId === o.id ? "#EEF2F8" : "#fff", color: T.navy }}>
                    {o.label}
                  </button>
                ))}
                {!options.length && <div className="text-sm p-2" style={{ color: T.muted }}>No hay opciones todavía.</div>}
              </div>
            </Modal>
          )}
        </div>
      )}

      {entity && (
        <>
          <div><Btn variant="accent" icon={Printer} onClick={doPrint}>Vista previa / Imprimir / PDF</Btn></div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4"><Shield size={20} style={{ color: T.red }} /><span className="font-extrabold" style={{ color: T.navy }}>{config.teamName}</span></div>
            {tipo === "partido" && (
              <div className="flex flex-col gap-3 text-sm">
                <h2 className="text-xl font-extrabold" style={{ color: T.navy }}>Informe de partido · vs {entity.rival}</h2>
                <div>{entity.fecha} · Jornada {entity.jornada} · {entity.competicion} · {entity.campo}</div>
                <div className="text-2xl font-black">{entity.resultadoFinal}</div>
                <div><strong>Sistema:</strong> {entity.sistema} ({entity.tipoFutbol})</div>
                <div><strong>Modelo de juego:</strong> {entity.tactica?.modelo}</div>
                <div><strong>Qué funcionó:</strong> {entity.tactica?.funciono}</div>
                <div><strong>Qué no funcionó:</strong> {entity.tactica?.noFunciono}</div>
                <div><strong>Fortalezas:</strong> {entity.rendimiento?.fortalezas}</div>
                <div><strong>Debilidades:</strong> {entity.rendimiento?.debilidades}</div>
                <div><strong>Mantener:</strong> {entity.aprendizajes?.mantener}</div>
                <div><strong>Corregir:</strong> {entity.aprendizajes?.corregir}</div>
                <div><strong>Trabajar:</strong> {entity.aprendizajes?.trabajar}</div>
                <div><strong>Observaciones:</strong> {entity.observaciones}</div>
              </div>
            )}
            {tipo === "jugador" && (() => {
              const st = entity.stats || {};
              const ranking = rankingScore(entity, config.rankingWeights);
              const vals = st.valoraciones || [];
              const valMedia = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
              const pct = st.entrenamientosTotales ? Math.round((st.entrenamientosRealizados / st.entrenamientosTotales) * 100) : null;
              const fmt = (f) => { const [a, m, d] = String(f || "").split("-"); return d && m ? `${d}/${m}/${a}` : f; };
              const susPartidos = matches.filter((m) => (m.convocatoria || []).some((c) => c.jugadorId === entity.id && c.estado === "Convocado")).sort((a, b) => a.fecha.localeCompare(b.fecha));
              const susEntrenos = trainings.filter((t) => (t.asistencia || []).some((a) => a.jugadorId === entity.id)).sort((a, b) => a.fecha.localeCompare(b.fecha));
              const datos = [["Posición", entity.posicion], ["Dorsal", entity.numero], ["Edad", entity.dob ? `${calcAge(entity.dob)} años` : ""], ["Estado", entity.estado],
                ["Pie hábil", entity.pie], ["Altura", entity.altura ? `${entity.altura} cm` : ""], ["Peso", entity.peso ? `${entity.peso} kg` : ""],
                ["Fecha de nacimiento", fmt(entity.dob)], ["Incorporación", fmt(entity.fechaIncorporacion)]];
              const cifras = [["Convocatorias", st.convocatorias], ["Titular", st.titular], ["Suplente", st.suplente], ["Minutos", st.minutos], ["Goles", st.goles], ["Asistencias", st.asistencias],
                ["Amarillas", st.amarillas], ["Rojas", st.rojas], ["Capitanías", st.capitanias], ["MVP", st.mvps], ["Valoración media", valMedia], ["% Asist. entrenos", pct != null ? `${pct}%` : "—"]];
              return (
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold" style={{ color: T.navy }}>Informe de jugador · {entity.nombre}</h2>
                      {entity.apodo ? <div style={{ color: T.muted }}>«{entity.apodo}»</div> : null}
                    </div>
                    <div className="text-center rounded-2xl px-4 py-2 shrink-0" style={{ border: `2px solid ${T.red}` }}>
                      <div className="text-[10px] font-extrabold uppercase" style={{ color: T.muted }}>Ranking de la temporada</div>
                      <div className="text-4xl font-black leading-none" style={{ color: T.red }}>{ranking}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                    {datos.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([l, v]) => (
                      <div key={l}><div className="text-[10px] uppercase font-bold" style={{ color: T.muted }}>{l}</div><div className="font-bold" style={{ color: T.navy }}>{v}</div></div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {cifras.map(([l, v]) => (
                      <div key={l} className="rounded-xl p-2 text-center" style={{ background: "#F5F7FA", border: `1px solid ${T.line}` }}>
                        <div className="text-lg font-extrabold" style={{ color: T.navy }}>{v ?? "—"}</div>
                        <div className="text-[10px] uppercase font-bold" style={{ color: T.muted }}>{l}</div>
                      </div>
                    ))}
                  </div>

                  {susPartidos.length > 0 && (
                    <div>
                      <div className="font-extrabold mb-1" style={{ color: T.navy }}>Partidos de la temporada ({susPartidos.length})</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr style={{ color: T.muted }}>{["Fecha", "Rival", "Resultado", "Min.", "Goles", "Asist.", "Valoración"].map((h) => <th key={h} className="text-left py-1 pr-3 font-bold uppercase text-[10px]">{h}</th>)}</tr></thead>
                          <tbody>
                            {susPartidos.map((m) => {
                              const e = computeMatchStatsForPlayer(entity.id, [m]);
                              const val = m.valoracionesJugadores?.[entity.id];
                              return (
                                <tr key={m.id} style={{ borderTop: `1px solid ${T.line}` }}>
                                  <td className="py-1 pr-3">{fmt(m.fecha)}</td><td className="pr-3">{m.rival}</td><td className="pr-3">{m.resultadoFinal || "—"}</td>
                                  <td className="pr-3">{e.minutos}</td><td className="pr-3">{e.goles}</td><td className="pr-3">{e.asistencias}</td><td>{val != null ? val : "—"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {susEntrenos.length > 0 && (
                    <div>
                      <div className="font-extrabold mb-1" style={{ color: T.navy }}>Entrenamientos de la temporada ({susEntrenos.length}) · asistencia {pct != null ? `${pct}%` : "—"}</div>
                      <div className="flex flex-wrap gap-1">
                        {susEntrenos.map((t) => {
                          const r = (t.asistencia || []).find((a) => a.jugadorId === entity.id);
                          const ok = r?.estado === "Asiste", les = r?.estado === "Lesionado";
                          return <span key={t.id} title={sessionDisplayName(t)} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: ok ? "#DDF3E5" : les ? "#FFF1CC" : "#FBE0E3", color: ok ? "#1E7A44" : les ? "#946B00" : "#B42335" }}>{fmt(t.fecha).slice(0, 5)}</span>;
                        })}
                      </div>
                      <div className="text-[11px] mt-1" style={{ color: T.muted }}>Verde: asistió · Rojo: no asistió · Amarillo: lesionado.</div>
                    </div>
                  )}

                  <div>
                    <strong>Observaciones del entrenador:</strong>
                    <TextArea value={entity.observaciones || ""} placeholder="Escribe aquí tus observaciones y notas sobre el jugador. Saldrán en la vista previa y en la impresión del informe..."
                      onChange={(e) => updatePlayers((prev) => prev.map((x) => x.id === entity.id ? { ...x, observaciones: e.target.value } : x))} />
                  </div>
                  <div className="text-[11px]" style={{ color: T.muted }}>La vista previa incluye además las pruebas físicas, los tests y todos los registros de la temporada.</div>
                </div>
              );
            })()}
            {tipo === "entrenamiento" && (
              <div className="flex flex-col gap-3 text-sm">
                <h2 className="text-xl font-extrabold" style={{ color: T.navy }}>Informe de entrenamiento</h2>
                <div>{entity.fecha} · {entity.hora} · {entity.lugar} · {entity.duracion} min</div>
                <div><strong>Sesión:</strong> {sessionDisplayName(entity)}</div>
                <div><strong>Tareas realizadas:</strong> {entity.tareas?.map((t) => t.nombre).join(", ") || "-"}</div>
                <div><strong>Notas del entrenador:</strong> {entity.notas}</div>
              </div>
            )}
            {tipo === "temporada" && (
              <div className="flex flex-col gap-3 text-sm">
                <h2 className="text-xl font-extrabold" style={{ color: T.navy }}>Informe de temporada · {entity.competicion}</h2>
                <div>{entity.fechaInicio} — {entity.fechaFin}</div>
                <div><strong>Objetivos generales:</strong> {entity.objetivosGenerales}</div>
                <div><strong>Objetivos deportivos:</strong> {entity.objetivosDeportivos}</div>
                <div><strong>Objetivos formativos:</strong> {entity.objetivosFormativos}</div>
                <div><strong>Semanas planificadas:</strong> {entity.weeks.length}</div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

/* ============================================================
   BUSCADOR GLOBAL
   ============================================================ */

function GlobalSearchResults({ results, onClear, onSelect }) {
  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><Eyebrow>Búsqueda</Eyebrow><h1 className="text-2xl font-extrabold" style={{ color: T.navy }}>Resultados</h1></div>
        <Btn variant="ghost" icon={X} onClick={onClear}>Limpiar</Btn>
      </div>
      {[["Jugadores", results.jugadores, (x) => x.nombre, "jugador"], ["Partidos", results.partidos, (x) => `vs ${x.rival} (${x.resultadoFinal})`, "partido"],
        ["Entrenamientos", results.entrenamientos, (x) => sessionDisplayName(x), "entrenamiento"], ["Tareas", results.tareas, (x) => `${x.nombre} (${x.codigo})`, "tarea"]].map(([label, arr, fmt, type]) => (
        arr.length > 0 && (
          <Card key={label} className="p-4">
            <Eyebrow>{label}</Eyebrow>
            <div className="flex flex-col gap-1.5 mt-2">
              {arr.map((x) => (
                <button key={x.id} onClick={() => onSelect(type, x.id)}
                  className="text-sm font-bold text-left hover:underline flex items-center gap-1.5" style={{ color: T.navy }}>
                  {fmt(x)} <ChevronRight size={14} style={{ color: T.muted }} />
                </button>
              ))}
            </div>
          </Card>
        )
      ))}
      {!results.jugadores.length && !results.partidos.length && !results.entrenamientos.length && !results.tareas.length && (
        <div className="text-sm" style={{ color: T.muted }}>Sin resultados para esta búsqueda.</div>
      )}
    </div>
  );
}
