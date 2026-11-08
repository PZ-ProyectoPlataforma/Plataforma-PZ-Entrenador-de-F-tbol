// Sistema Tipo — guía de temporada recomendada (Metodología Puntualización Zonal).
// IMPORTANTE: este archivo solo se importa desde el servidor (/api/sistema-tipo) para que
// el contenido de cada plan no viaje al navegador de quien no lo tiene.
export const SISTEMA_TIPO = {
 "guias": [
  {
   "id": "futbol-base",
   "nombre": "Fútbol base (Fútbol 8)",
   "subtitulo": "Prebenjamín, benjamín y alevín",
   "sesionesPorSemana": 2,
   "totalSesiones": 60,
   "intro": [
    "Dos sesiones semanales (lunes y miércoles), con el partido habitual el fin de semana. De la semana 1 a la 20 se introducen todos los fundamentos técnicos, tácticos, coordinativos, condicionales y psicológicos del libro, además de los conceptos esenciales del portero. De la semana 21 a la 30 se consolidan, se combinan y se aplican al juego real.",
    "Criterios: una sola capacidad condicional principal por sesión; progresión de lo individual a lo colectivo, de lo sencillo a lo complejo y de la ejecución a la toma de decisiones; las capacidades coordinativas se integran libremente con balón en ambas sesiones.",
    "Es una guía de introducción y aprendizaje progresivo, no una promesa de que todos los niños dominarán cada fundamento en veinte semanas. El juego aéreo, la fuerza y los contenidos del portero deben adaptarse a la madurez, la seguridad y el nivel del grupo."
   ],
   "ciclos": [
    {
     "semanas": [
      {
       "numero": 1,
       "titulo": "Conocimiento del grupo y familiarización con el balón",
       "objetivoSemanal": "conocer a los jugadores, observar su nivel inicial y establecer una base de confianza, coordinación y contacto con el balón.",
       "sesiones": [
        {
         "numero": 1,
         "titulo": "Reconocimiento y evaluación inicial",
         "objetivo": "observar el punto de partida técnico, físico y social de cada jugador.",
         "tecnicos": "desplazamiento con y sin balón, conducción libre y contacto básico con ambas piernas.",
         "tacticos": "reconocimiento del espacio, compañeros, rivales y zonas del campo.",
         "fisicos": "adaptación física al juego, sin carga condicional exigente.",
         "coordinativos": "orientación espacial, equilibrio y coordinación óculo-pédica.",
         "psicologicos": "confianza, atención, motivación y trabajo en equipo."
        },
        {
         "numero": 2,
         "titulo": "Familiarización y control corporal",
         "objetivo": "mejorar la relación jugador-balón y las normas básicas de convivencia deportiva.",
         "tecnicos": "conducción, pase corto inicial y control básico.",
         "tacticos": "ocupar espacios libres y reconocer líneas de pase sencillas.",
         "fisicos": "flexibilidad mediante movilidad apropiada y movimientos dinámicos adaptados.",
         "coordinativos": "ritmo, equilibrio y sincronización de movimientos.",
         "psicologicos": "responsabilidad, escucha, respeto y confianza para probar."
        }
       ]
      },
      {
       "numero": 2,
       "titulo": "Pase, control y coordinación básica",
       "objetivoSemanal": "establecer una primera base técnica para jugar con compañeros.",
       "sesiones": [
        {
         "numero": 3,
         "titulo": "El pase y la recepción",
         "objetivo": "comprender cómo enviar y recibir el balón con precisión.",
         "tecnicos": "pase con el interior, precisión, control o recepción y uso progresivo de ambas piernas.",
         "tacticos": "apoyo al compañero y elección de una línea de pase sencilla.",
         "fisicos": "velocidad de reacción ante señales visuales o auditivas, con esfuerzos breves.",
         "coordinativos": "orientación, perfil corporal básico y sincronización entre desplazamiento y golpeo.",
         "psicologicos": "atención, persistencia y confianza tras el error."
        },
        {
         "numero": 4,
         "titulo": "Conducción y desplazamiento",
         "objetivo": "desplazarse con balón manteniendo el control y adaptándose al espacio.",
         "tecnicos": "desplazamiento, conducción con diferentes superficies del pie y cambios de dirección.",
         "tacticos": "reconocer espacios libres y evitar zonas congestionadas.",
         "fisicos": "agilidad entendida como cambio de dirección y control corporal, sin añadir un segundo objetivo condicional.",
         "coordinativos": "equilibrio dinámico, ritmo y adaptación motriz.",
         "psicologicos": "motivación, responsabilidad individual y respeto por los compañeros."
        }
       ]
      }
     ],
     "id": "pretemporada",
     "nombre": "Pretemporada",
     "subtitulo": "Reconocer al grupo y construir la base de la temporada",
     "rango": "Semanas 1–2"
    },
    {
     "semanas": [
      {
       "numero": 3,
       "titulo": "Regate, finta y protección del balón",
       "objetivoSemanal": "mejorar el dominio individual ante la presencia de un rival.",
       "sesiones": [
        {
         "numero": 5,
         "titulo": "Dribbling, regate y finta",
         "objetivo": "superar a un adversario mediante acciones técnicas sencillas.",
         "tecnicos": "dribbling, regate, finta, cambios de dirección y conducción próxima.",
         "tacticos": "identificar cuándo progresar individualmente y cuándo conservar el balón.",
         "fisicos": "aceleración breve tras superar al rival.",
         "coordinativos": "reacción, equilibrio, ritmo de ejecución y orientación.",
         "psicologicos": "valentía para intentar, creatividad y confianza."
        },
        {
         "numero": 6,
         "titulo": "Protección y carga",
         "objetivo": "conservar el balón ante la oposición sin recurrir a acciones peligrosas.",
         "tecnicos": "protección del balón, uso del cuerpo, cambios de orientación y carga legal adaptada a la edad.",
         "tacticos": "conservar la posesión y reconocer el momento adecuado para soltar el balón.",
         "fisicos": "fuerza general adaptada mediante autocargas y control postural, sin trabajo máximo ni contacto intenso.",
         "coordinativos": "equilibrio, orientación corporal y sincronización.",
         "psicologicos": "autocontrol, responsabilidad, respeto al rival y persistencia."
        }
       ]
      },
      {
       "numero": 4,
       "titulo": "Control orientado y precisión",
       "objetivoSemanal": "preparar al jugador para recibir, orientarse y ejecutar con intención.",
       "sesiones": [
        {
         "numero": 7,
         "titulo": "Control orientado",
         "objetivo": "recibir el balón preparando la acción siguiente.",
         "tecnicos": "control orientado, recepción con distintas superficies y pase posterior.",
         "tacticos": "perfil corporal, orientación hacia el espacio libre y apoyo diagonal.",
         "fisicos": "velocidad de reacción ante la trayectoria del balón.",
         "coordinativos": "orientación, sincronización y equilibrio durante la recepción.",
         "psicologicos": "atención anticipada y confianza en la toma de decisiones."
        },
        {
         "numero": 8,
         "titulo": "Precisión en pase y conducción",
         "objetivo": "aumentar la precisión de las acciones técnicas en espacios delimitados.",
         "tecnicos": "precisión del pase, conducción controlada y golpeo con diferentes superficies.",
         "tacticos": "elegir compañero y dirección según el espacio disponible.",
         "fisicos": "resistencia adaptada al juego mediante actividad continua moderada con balón, regulada por el grupo.",
         "coordinativos": "ritmo, adaptación motriz y orientación.",
         "psicologicos": "persistencia, motivación y valoración del esfuerzo."
        }
       ]
      }
     ],
     "id": "ciclo-1",
     "nombre": "Ciclo Tipo 1",
     "subtitulo": "Adaptación, dominio individual y fundamentos básicos",
     "rango": "Semanas 3–4"
    },
    {
     "semanas": [
      {
       "numero": 5,
       "titulo": "Desmarque y apoyos",
       "objetivoSemanal": "comprender que el juego no consiste únicamente en tener el balón, sino también en ayudar al compañero sin él.",
       "sesiones": [
        {
         "numero": 9,
         "titulo": "Apoyo y líneas de pase",
         "objetivo": "facilitar la continuidad del juego mediante apoyos útiles.",
         "tecnicos": "pase, control orientado y precisión.",
         "tacticos": "apoyo al frente, lateral, diagonal y atrás; distancias adecuadas respecto al poseedor.",
         "fisicos": "velocidad de reacción para ofrecer una línea de pase tras un cambio de posesión.",
         "coordinativos": "orientación espacial y sincronización de desplazamiento y pase.",
         "psicologicos": "trabajo en equipo, solidaridad y comunicación."
        },
        {
         "numero": 10,
         "titulo": "Desmarque y ocupación de espacios",
         "objetivo": "aprender a moverse para recibir en mejores condiciones.",
         "tecnicos": "control orientado, pase y conducción hacia espacios libres.",
         "tacticos": "desmarque de apoyo y ruptura; zonas del campo y distancias entre compañeros.",
         "fisicos": "velocidad de aceleración en desplazamientos breves.",
         "coordinativos": "reacción, orientación y cambio de ritmo motor.",
         "psicologicos": "atención, creatividad y responsabilidad colectiva."
        }
       ]
      },
      {
       "numero": 6,
       "titulo": "Remate, tiro y definición",
       "objetivoSemanal": "conectar la técnica de golpeo con la elección de la mejor opción para finalizar.",
       "sesiones": [
        {
         "numero": 11,
         "titulo": "Remate o tiro",
         "objetivo": "mejorar la mecánica básica del golpeo a portería.",
         "tecnicos": "remate con interior y empeine, precisión, coordinación de apoyos y golpeo con ambas piernas según nivel.",
         "tacticos": "reconocer la zona de finalización y el momento adecuado para rematar.",
         "fisicos": "coordinación y control del gesto como prioridad; sin carga condicional específica elevada.",
         "coordinativos": "equilibrio, sincronización y orientación del cuerpo hacia el objetivo.",
         "psicologicos": "confianza, atención y valentía para finalizar."
        },
        {
         "numero": 12,
         "titulo": "Definición en situaciones de juego",
         "objetivo": "elegir cómo y cuándo finalizar ante diferentes situaciones.",
         "tecnicos": "definición tras control, conducción, pase y remate.",
         "tacticos": "profundidad, desmarque, apoyo y decisión entre pasar o tirar.",
         "fisicos": "velocidad de reacción ante una oportunidad de finalización.",
         "coordinativos": "orientación corporal, reacción y sincronización.",
         "psicologicos": "competitividad sana, motivación y gestión emocional ante el acierto o el error."
        }
       ]
      },
      {
       "numero": 7,
       "titulo": "Pared y combinación ofensiva",
       "objetivoSemanal": "conectar acciones técnicas individuales con asociaciones entre compañeros.",
       "sesiones": [
        {
         "numero": 13,
         "titulo": "La pared",
         "objetivo": "utilizar el pase y el movimiento para superar una oposición.",
         "tecnicos": "pase, control orientado, precisión y devolución al primer toque cuando el nivel lo permita.",
         "tacticos": "pared, apoyo frontal, desmarque posterior al pase y ocupación del espacio liberado.",
         "fisicos": "agilidad en desplazamientos cortos y cambios de dirección.",
         "coordinativos": "sincronización entre pasador y receptor, orientación y ritmo.",
         "psicologicos": "cooperación, atención y comunicación."
        },
        {
         "numero": 14,
         "titulo": "Progresión colectiva",
         "objetivo": "avanzar hacia la portería rival mediante decisiones coordinadas.",
         "tecnicos": "pase, control, conducción, regate y remate.",
         "tacticos": "progresión, profundidad, amplitud, apoyo y elección entre conservar o avanzar.",
         "fisicos": "resistencia adaptada mediante juegos con balón y pausas suficientes.",
         "coordinativos": "orientación espacial, ritmo y adaptación a cambios de situación.",
         "psicologicos": "creatividad, persistencia y responsabilidad compartida."
        }
       ]
      },
      {
       "numero": 8,
       "titulo": "Juego aéreo, anticipación e interceptación",
       "objetivoSemanal": "introducir el juego sobre balones elevados y mejorar la lectura de las acciones del rival.",
       "sesiones": [
        {
         "numero": 15,
         "titulo": "Juego aéreo con la cabeza",
         "objetivo": "familiarizarse con la trayectoria del balón y la técnica básica del juego aéreo.",
         "tecnicos": "seguimiento visual, orientación corporal y contacto con la cabeza mediante progresiones seguras y adecuadas a la edad.",
         "tacticos": "reconocer trayectorias, ubicación respecto al balón y elección de la acción.",
         "fisicos": "equilibrio y control corporal; sin añadir una carga condicional intensa.",
         "coordinativos": "orientación, sincronización ojo-cuerpo y equilibrio.",
         "psicologicos": "confianza progresiva, atención y valentía sin forzar al jugador."
        },
        {
         "numero": 16,
         "titulo": "Anticipación e interceptación",
         "objetivo": "aprender a leer el pase rival e intervenir sin cometer faltas.",
         "tecnicos": "interceptación, anticipación, control posterior y pase tras recuperar.",
         "tacticos": "lectura de líneas de pase, vigilancia básica y elección del momento de intervenir.",
         "fisicos": "velocidad de reacción ante señales y trayectorias.",
         "coordinativos": "reacción, orientación y sincronización.",
         "psicologicos": "concentración, responsabilidad y competitividad sana."
        }
       ]
      }
     ],
     "id": "ciclo-2",
     "nombre": "Ciclo Tipo 2",
     "subtitulo": "Progresión ofensiva y primeras decisiones colectivas",
     "rango": "Semanas 5–8"
    },
    {
     "semanas": [
      {
       "numero": 9,
       "titulo": "Marcaje, acoso y presión",
       "objetivoSemanal": "enseñar a defender al rival y al espacio sin perder el equilibrio individual ni colectivo.",
       "sesiones": [
        {
         "numero": 17,
         "titulo": "Marcaje y acoso al poseedor",
         "objetivo": "aprender a reducir el tiempo y el espacio del rival con balón.",
         "tecnicos": "posición defensiva, interceptación y recuperación controlada.",
         "tacticos": "marcaje, acoso, orientación del atacante hacia zonas menos favorables y distancia de intervención.",
         "fisicos": "velocidad de reacción ante cambios de dirección del atacante.",
         "coordinativos": "equilibrio, orientación corporal y reacción.",
         "psicologicos": "atención, valentía y responsabilidad defensiva."
        },
        {
         "numero": 18,
         "titulo": "Pressing o presión colectiva",
         "objetivo": "comprender cuándo presionar y cómo ayudar al compañero que presiona.",
         "tecnicos": "interceptación, control tras recuperación y pase de salida.",
         "tacticos": "pressing, coberturas, distancias entre compañeros y orientación de la presión.",
         "fisicos": "resistencia adaptada al juego, con pausas suficientes y sin buscar agotamiento.",
         "coordinativos": "orientación espacial, sincronización de movimientos y adaptación.",
         "psicologicos": "trabajo en equipo, solidaridad y comunicación."
        }
       ]
      },
      {
       "numero": 10,
       "titulo": "Coberturas, permutas y repliegue",
       "objetivoSemanal": "organizar la respuesta colectiva cuando un compañero es superado o el equipo pierde el balón.",
       "sesiones": [
        {
         "numero": 19,
         "titulo": "Cobertura y permuta",
         "objetivo": "aprender a proteger al compañero y reorganizar posiciones defensivas.",
         "tecnicos": "desplazamiento defensivo, interceptación y recuperación.",
         "tacticos": "cobertura, permuta, equilibrio defensivo y vigilancia.",
         "fisicos": "agilidad mediante desplazamientos defensivos cortos y cambios de dirección.",
         "coordinativos": "orientación, sincronización y equilibrio.",
         "psicologicos": "solidaridad, responsabilidad y comunicación."
        },
        {
         "numero": 20,
         "titulo": "Repliegue y temporización",
         "objetivo": "retrasar el avance rival y recuperar la organización del equipo.",
         "tecnicos": "desplazamiento defensivo, protección del espacio y recuperación del balón.",
         "tacticos": "repliegue, temporización, acoso al poseedor y recuperación de posiciones.",
         "fisicos": "velocidad de aceleración en desplazamientos breves de recuperación.",
         "coordinativos": "reacción, orientación y adaptación espacial.",
         "psicologicos": "persistencia, autocontrol y sacrificio colectivo entendido como esfuerzo compartido."
        }
       ]
      },
      {
       "numero": 11,
       "titulo": "Vigilancia y equilibrio defensivo",
       "objetivoSemanal": "mantener la organización defensiva incluso cuando el balón está lejos de algunos jugadores.",
       "sesiones": [
        {
         "numero": 21,
         "titulo": "Vigilancia defensiva",
         "objetivo": "aprender a observar el balón y a los adversarios que pueden recibir.",
         "tecnicos": "desplazamiento, interceptación y control posterior a la recuperación.",
         "tacticos": "vigilancia, marcaje, cobertura y protección de espacios peligrosos.",
         "fisicos": "reacción ante cambios de orientación del juego.",
         "coordinativos": "orientación espacial, perfil corporal y sincronización.",
         "psicologicos": "atención sostenida, responsabilidad y concentración."
        },
        {
         "numero": 22,
         "titulo": "Equilibrio defensivo",
         "objetivo": "evitar que el equipo quede desorganizado al atacar.",
         "tecnicos": "pase seguro, control orientado y recuperación defensiva.",
         "tacticos": "equilibrio defensivo, distancias entre líneas, vigilancia y repliegue.",
         "fisicos": "resistencia adaptada a situaciones intermitentes de juego.",
         "coordinativos": "adaptación física al juego, orientación y ritmo.",
         "psicologicos": "trabajo en equipo, solidaridad y liderazgo compartido."
        }
       ]
      },
      {
       "numero": 12,
       "titulo": "Salida de balón y circulación",
       "objetivoSemanal": "aprender a iniciar el juego desde atrás y conservar la posesión con intención.",
       "sesiones": [
        {
         "numero": 23,
         "titulo": "Salida de balón",
         "objetivo": "progresar desde la zona de inicio mediante pases y apoyos.",
         "tecnicos": "control orientado, pase, precisión y manejo del balón con los pies por parte del portero.",
         "tacticos": "zonas del campo, salida de balón, apoyos, amplitud y distancias.",
         "fisicos": "velocidad de reacción para ofrecer líneas de pase tras una devolución o cambio de orientación.",
         "coordinativos": "orientación corporal, sincronización y equilibrio.",
         "psicologicos": "confianza, responsabilidad y comunicación."
        },
        {
         "numero": 24,
         "titulo": "Conservación y circulación",
         "objetivo": "conservar el balón y cambiar de zona cuando sea conveniente.",
         "tecnicos": "pase, recepción, precisión y control orientado.",
         "tacticos": "conservación del balón, circulación, apoyos laterales y diagonales, distancias y pared.",
         "fisicos": "resistencia adaptada a través de juegos de posesión de intensidad regulada.",
         "coordinativos": "ritmo, orientación y adaptación al espacio.",
         "psicologicos": "paciencia, atención, solidaridad y trabajo en equipo."
        }
       ]
      },
      {
       "numero": 13,
       "titulo": "Desdoblamiento, profundidad y transiciones",
       "objetivoSemanal": "mejorar la progresión ofensiva y la reacción colectiva tras perder o recuperar el balón.",
       "sesiones": [
        {
         "numero": 25,
         "titulo": "Desdoblamiento y profundidad",
         "objetivo": "crear opciones de avance y superar líneas rivales.",
         "tecnicos": "pase, control orientado, conducción y remate.",
         "tacticos": "desdoblamiento, profundidad, amplitud, apoyo y desmarque.",
         "fisicos": "aceleración breve en desmarques y llegadas a espacios libres.",
         "coordinativos": "sincronización entre pase y desmarque, orientación y ritmo.",
         "psicologicos": "creatividad, liderazgo positivo y valentía para progresar."
        },
        {
         "numero": 26,
         "titulo": "Transiciones ofensivas y defensivas",
         "objetivo": "responder con rapidez y criterio al cambio de posesión.",
         "tecnicos": "primer control tras recuperación, pase de salida, conducción y recuperación.",
         "tacticos": "transición ofensiva, repliegue, presión inmediata, temporización y equilibrio defensivo.",
         "fisicos": "velocidad de reacción; los esfuerzos serán breves y con recuperación adecuada.",
         "coordinativos": "reacción, orientación y adaptación a cambios rápidos.",
         "psicologicos": "atención, autocontrol, persistencia y responsabilidad."
        }
       ]
      },
      {
       "numero": 14,
       "titulo": "Zonas, fases y control del partido",
       "objetivoSemanal": "integrar los fundamentos anteriores dentro de una comprensión global del juego.",
       "sesiones": [
        {
         "numero": 27,
         "titulo": "Zonas del campo y fases del juego",
         "objetivo": "reconocer dónde se desarrolla el juego y cómo cambia la función del equipo.",
         "tecnicos": "desplazamiento, pase, control orientado, conducción y recuperación.",
         "tacticos": "zonas del campo, fases ofensiva y defensiva, transiciones, salida de balón y ocupación racional del espacio.",
         "fisicos": "adaptación física al juego, regulando el esfuerzo según la situación.",
         "coordinativos": "orientación, ritmo, sincronización y equilibrio.",
         "psicologicos": "atención, comunicación, responsabilidad y trabajo en equipo."
        },
        {
         "numero": 28,
         "titulo": "Ritmos y control del partido",
         "objetivo": "empezar a distinguir cuándo acelerar, cuándo conservar y cuándo reorganizarse.",
         "tecnicos": "pase, control, precisión, conducción y finalización.",
         "tacticos": "ritmos o tiempos del partido, control del partido, conservación, profundidad, temporización y equilibrio defensivo.",
         "fisicos": "flexibilidad y movilidad adaptadas, sin combinarlas con una carga condicional intensa.",
         "coordinativos": "ritmo de ejecución, orientación y adaptación.",
         "psicologicos": "motivación, emotividad y autocontrol ante el resultado, el error y la presión competitiva."
        }
       ]
      },
      {
       "numero": 15,
       "titulo": "Integración de los fundamentos técnicos",
       "objetivoSemanal": "relacionar las acciones técnicas individuales en secuencias cada vez más próximas al juego real.",
       "sesiones": [
        {
         "numero": 29,
         "titulo": "Técnica individual bajo oposición",
         "objetivo": "seleccionar y ejecutar el recurso técnico apropiado ante un rival.",
         "tecnicos": "desplazamiento, pase, recepción, conducción, regate, finta, enganche, control orientado y protección.",
         "tacticos": "conservar, progresar, superar al rival y buscar apoyos.",
         "fisicos": "agilidad con cambios de dirección controlados.",
         "coordinativos": "equilibrio, orientación, reacción y sincronización.",
         "psicologicos": "confianza, valentía, creatividad y persistencia."
        },
        {
         "numero": 30,
         "titulo": "Precisión, remate y definición",
         "objetivo": "integrar la técnica de pase y control con la finalización.",
         "tecnicos": "precisión, control orientado, remate, definición y uso progresivo de ambas piernas.",
         "tacticos": "pared, desmarque, apoyo, profundidad y elección entre pase y tiro.",
         "fisicos": "velocidad de reacción ante el momento de finalización.",
         "coordinativos": "orientación, ritmo y sincronización.",
         "psicologicos": "atención, competitividad sana y gestión emocional."
        }
       ]
      },
      {
       "numero": 16,
       "titulo": "Integración de los fundamentos tácticos ofensivos",
       "objetivoSemanal": "relacionar apoyos, desmarques y circulación para progresar colectivamente.",
       "sesiones": [
        {
         "numero": 31,
         "titulo": "Asociación y progresión",
         "objetivo": "avanzar mediante la cooperación y el uso inteligente del espacio.",
         "tecnicos": "pase, control orientado, pared, conducción y precisión.",
         "tacticos": "apoyo, desmarque, distancias, zonas, profundidad, amplitud y desdoblamiento.",
         "fisicos": "resistencia adaptada mediante juegos de posesión y progresión, sin llevar al grupo al agotamiento.",
         "coordinativos": "orientación, sincronización y ritmo.",
         "psicologicos": "trabajo en equipo, solidaridad, comunicación y liderazgo compartido."
        },
        {
         "numero": 32,
         "titulo": "Conservación y control del ritmo",
         "objetivo": "decidir cuándo mantener la posesión y cuándo acelerar el ataque.",
         "tecnicos": "pase, control, precisión y recepción orientada.",
         "tacticos": "conservación, circulación, ritmos del partido, temporización ofensiva y control del partido.",
         "fisicos": "flexibilidad y movilidad adaptadas.",
         "coordinativos": "adaptación, orientación y ritmo.",
         "psicologicos": "paciencia, atención, motivación y responsabilidad."
        }
       ]
      },
      {
       "numero": 17,
       "titulo": "Integración de los fundamentos tácticos defensivos",
       "objetivoSemanal": "coordinar la defensa individual y colectiva.",
       "sesiones": [
        {
         "numero": 33,
         "titulo": "Defensa individual y recuperación",
         "objetivo": "mejorar la capacidad de defender, anticipar y recuperar.",
         "tecnicos": "desplazamiento defensivo, carga legal adaptada, anticipación, interceptación y protección del balón recuperado.",
         "tacticos": "marcaje, acoso, pressing, temporización y orientación del rival.",
         "fisicos": "velocidad de reacción ante cambios de dirección y pases rivales.",
         "coordinativos": "equilibrio, orientación y reacción.",
         "psicologicos": "concentración, valentía, persistencia y autocontrol."
        },
        {
         "numero": 34,
         "titulo": "Defensa colectiva y reorganización",
         "objetivo": "proteger el espacio y ayudar al compañero durante la acción defensiva.",
         "tecnicos": "interceptación, recuperación y primer pase tras robo.",
         "tacticos": "coberturas, permutas, repliegue, vigilancia, equilibrio defensivo y distancias.",
         "fisicos": "agilidad en desplazamientos defensivos.",
         "coordinativos": "sincronización, orientación y adaptación espacial.",
         "psicologicos": "sacrificio colectivo, solidaridad, responsabilidad y comunicación."
        }
       ]
      },
      {
       "numero": 18,
       "titulo": "Fundamentos físicos y coordinativos",
       "objetivoSemanal": "desarrollar las capacidades del libro de forma adaptada a la edad, sin acumular cargas innecesarias.",
       "sesiones": [
        {
         "numero": 35,
         "titulo": "Velocidad y reacción",
         "objetivo": "mejorar la respuesta rápida y la aceleración en acciones propias del fútbol.",
         "tecnicos": "desplazamiento, conducción y control tras una acción rápida.",
         "tacticos": "desmarque, anticipación y respuesta tras recuperación.",
         "fisicos": "velocidad, con énfasis en reacción y aceleración; pausas suficientes para mantener la calidad.",
         "coordinativos": "reacción, orientación y sincronización.",
         "psicologicos": "atención, motivación y confianza."
        },
        {
         "numero": 36,
         "titulo": "Fuerza adaptada y equilibrio",
         "objetivo": "mejorar el control postural y la capacidad de aplicar fuerza de forma segura.",
         "tecnicos": "protección del balón y estabilidad durante el control y el pase.",
         "tacticos": "proteger la posesión y mantener la posición defensiva sin contacto excesivo.",
         "fisicos": "fuerza general adaptada mediante autocargas y ejercicios técnicos controlados, sin cargas máximas.",
         "coordinativos": "equilibrio estático y dinámico, orientación corporal y sincronización.",
         "psicologicos": "responsabilidad, persistencia y respeto por las normas de seguridad."
        }
       ]
      },
      {
       "numero": 19,
       "titulo": "Fundamentos psicológicos y competitivos",
       "objetivoSemanal": "reforzar la dimensión personal y colectiva del jugador en el entrenamiento y el partido.",
       "sesiones": [
        {
         "numero": 37,
         "titulo": "Confianza, liderazgo y responsabilidad",
         "objetivo": "fomentar la autonomía, la comunicación y el compromiso con el equipo.",
         "tecnicos": "pase, control y conducción en situaciones conocidas para favorecer la ejecución con confianza.",
         "tacticos": "apoyo, organización, comunicación y toma de decisiones compartida.",
         "fisicos": "resistencia adaptada al juego, con intensidad regulada.",
         "coordinativos": "orientación, ritmo y sincronización.",
         "psicologicos": "liderazgo, responsabilidad, confianza, trabajo en equipo y solidaridad."
        },
        {
         "numero": 38,
         "titulo": "Competitividad, persistencia y emotividad",
         "objetivo": "aprender a competir respetando al rival y gestionando el error y el resultado.",
         "tecnicos": "regate, remate, control y precisión bajo presión moderada.",
         "tacticos": "transición, conservación y decisiones en situaciones competitivas.",
         "fisicos": "flexibilidad y movilidad adaptadas.",
         "coordinativos": "equilibrio, reacción y adaptación.",
         "psicologicos": "competitividad sana, motivación, persistencia, sacrificio, valentía, atención y gestión emocional."
        }
       ]
      },
      {
       "numero": 20,
       "titulo": "Portero, estrategia y revisión de fundamentos",
       "objetivoSemanal": "completar la introducción general de los contenidos y revisar los que necesiten refuerzo.",
       "sesiones": [
        {
         "numero": 39,
         "titulo": "El portero como jugador del equipo",
         "objetivo": "comprender la función del portero en la defensa y en el inicio del ataque.",
         "tecnicos": "ubicación básica, manejo del balón con los pies, pase, control y fundamentos de intervención propios del portero adaptados al nivel.",
         "tacticos": "participación en la salida de balón, cobertura del espacio y comunicación con la defensa.",
         "fisicos": "reacción específica y desplazamientos breves, con recuperación suficiente.",
         "coordinativos": "equilibrio, orientación, sincronización y reacción.",
         "psicologicos": "confianza, liderazgo, responsabilidad y comunicación."
        },
        {
         "numero": 40,
         "titulo": "Estrategia y revisión global",
         "objetivo": "revisar los fundamentos introducidos y completar los contenidos que se hayan detectado como pendientes.",
         "tecnicos": "pase, control orientado, conducción, regate, precisión, remate, definición, anticipación e interceptación.",
         "tacticos": "zonas, fases del juego, apoyos, desmarques, pressing, coberturas, permutas, temporización, acoso, vigilancia, equilibrio defensivo, pared, desdoblamiento, salida de balón, profundidad, ritmos y control del partido; introducción a saques de banda, saques de meta, córneres, faltas y penaltis.",
         "fisicos": "adaptación física al juego, con carga moderada y sin combinar dos objetivos condicionales principales.",
         "coordinativos": "revisión de equilibrio, reacción, orientación, perfil corporal, sincronización y ritmo.",
         "psicologicos": "trabajo en equipo, liderazgo, responsabilidad, confianza, atención, sacrificio, persistencia, solidaridad, valentía, creatividad, competitividad, motivación y gestión emocional."
        }
       ]
      }
     ],
     "id": "ciclo-3",
     "nombre": "Ciclo Tipo 3",
     "subtitulo": "Fundamentos defensivos y organización colectiva",
     "rango": "Semanas 9–20"
    },
    {
     "semanas": [
      {
       "numero": 21,
       "titulo": "Estrategia ofensiva a balón parado",
       "objetivoSemanal": "introducir rutinas sencillas y comprensibles para aprovechar las acciones a balón parado.",
       "sesiones": [
        {
         "numero": 41,
         "titulo": "Córneres y faltas indirectas",
         "objetivo": "reconocer las funciones básicas de los jugadores en acciones a balón parado.",
         "tecnicos": "precisión del golpeo, pase, control y remate.",
         "tacticos": "córneres ofensivos, faltas indirectas, ocupación de espacios y movimientos de apoyo.",
         "fisicos": "coordinación y control de los desplazamientos; sin carga condicional específica elevada.",
         "coordinativos": "orientación, sincronización y ritmo.",
         "psicologicos": "atención, responsabilidad y comunicación."
        },
        {
         "numero": 42,
         "titulo": "Saques de banda y saques de meta",
         "objetivo": "utilizar los reinicios para conservar el balón e iniciar la progresión.",
         "tecnicos": "saque de banda reglamentario, control, pase y recepción.",
         "tacticos": "opciones de apoyo, salida de balón desde meta, amplitud y profundidad.",
         "fisicos": "velocidad de reacción ante la reanudación del juego.",
         "coordinativos": "orientación, reacción y sincronización.",
         "psicologicos": "concentración, responsabilidad y trabajo en equipo."
        }
       ]
      },
      {
       "numero": 22,
       "titulo": "Estrategia defensiva y organización",
       "objetivoSemanal": "mejorar la respuesta del equipo ante las acciones a balón parado del rival.",
       "sesiones": [
        {
         "numero": 43,
         "titulo": "Defensa de córneres y faltas",
         "objetivo": "aprender a proteger la portería y actuar coordinadamente.",
         "tecnicos": "despeje, interceptación, control posterior y pase de salida.",
         "tacticos": "marcaje individual o por zonas según el modelo elegido, protección de espacios y organización defensiva.",
         "fisicos": "reacción y desplazamientos breves hacia el balón.",
         "coordinativos": "orientación, equilibrio y sincronización.",
         "psicologicos": "atención, valentía, comunicación y responsabilidad."
        },
        {
         "numero": 44,
         "titulo": "Penaltis y faltas directas",
         "objetivo": "comprender los aspectos técnicos, reglamentarios y emocionales de estas situaciones.",
         "tecnicos": "golpeo de precisión, remate y fundamentos de intervención del portero.",
         "tacticos": "elección de zona de lanzamiento, organización de barrera cuando corresponda y colocación del portero.",
         "fisicos": "reacción específica del portero y control postural.",
         "coordinativos": "equilibrio, orientación y sincronización.",
         "psicologicos": "confianza, concentración y gestión emocional, evitando que el resultado de una acción defina la valoración del jugador."
        }
       ]
      },
      {
       "numero": 23,
       "titulo": "Superioridad, igualdad e inferioridad numérica",
       "objetivoSemanal": "mejorar la toma de decisiones en función de la relación numérica entre atacantes y defensores.",
       "sesiones": [
        {
         "numero": 45,
         "titulo": "Superioridad ofensiva",
         "objetivo": "aprovechar la ventaja numérica para progresar.",
         "tecnicos": "pase, control orientado, pared, conducción y definición.",
         "tacticos": "amplitud, profundidad, apoyos, desmarques y cambios de orientación.",
         "fisicos": "velocidad de reacción para identificar y aprovechar la ventaja.",
         "coordinativos": "orientación, sincronización y adaptación.",
         "psicologicos": "creatividad, confianza y cooperación."
        },
        {
         "numero": 46,
         "titulo": "Defensa en inferioridad numérica",
         "objetivo": "proteger las zonas más peligrosas y retrasar el avance rival.",
         "tecnicos": "desplazamiento defensivo, interceptación y temporización.",
         "tacticos": "repliegue, acoso, coberturas, equilibrio defensivo y protección de espacios.",
         "fisicos": "agilidad defensiva, con cambios de dirección controlados.",
         "coordinativos": "orientación, equilibrio y reacción.",
         "psicologicos": "persistencia, solidaridad, atención y autocontrol."
        }
       ]
      },
      {
       "numero": 24,
       "titulo": "Transiciones y toma de decisiones",
       "objetivoSemanal": "reducir el tiempo entre percibir una situación y elegir una respuesta eficaz.",
       "sesiones": [
        {
         "numero": 47,
         "titulo": "Recuperación y contraataque",
         "objetivo": "transformar una recuperación en una oportunidad de progresión.",
         "tecnicos": "primer control, pase vertical, conducción y remate.",
         "tacticos": "transición ofensiva, profundidad, desmarque y ocupación de espacios.",
         "fisicos": "aceleración breve tras recuperación, con recuperación adecuada.",
         "coordinativos": "reacción, orientación y sincronización.",
         "psicologicos": "valentía, creatividad y confianza."
        },
        {
         "numero": 48,
         "titulo": "Pérdida y reorganización defensiva",
         "objetivo": "reaccionar ante la pérdida del balón sin desorganizar al equipo.",
         "tecnicos": "recuperación, interceptación y primer pase seguro.",
         "tacticos": "presión inmediata, repliegue, temporización, vigilancia y equilibrio defensivo.",
         "fisicos": "velocidad de reacción; no se añade un objetivo de fuerza.",
         "coordinativos": "reacción, adaptación y orientación.",
         "psicologicos": "autocontrol, responsabilidad, solidaridad y atención."
        }
       ]
      },
      {
       "numero": 25,
       "titulo": "Ritmo del partido y conservación inteligente",
       "objetivoSemanal": "aprender a gestionar la posesión según la situación de juego, no solo a mantenerla por acumular pases.",
       "sesiones": [
        {
         "numero": 49,
         "titulo": "Conservar para progresar",
         "objetivo": "mantener el balón mientras se identifica una oportunidad real de avance.",
         "tecnicos": "pase, control orientado, precisión y pared.",
         "tacticos": "conservación, circulación, apoyos, distancias y cambios de zona.",
         "fisicos": "resistencia adaptada mediante juegos con balón, ajustando la intensidad al grupo.",
         "coordinativos": "ritmo, orientación y adaptación al espacio.",
         "psicologicos": "paciencia, atención, solidaridad y comunicación."
        },
        {
         "numero": 50,
         "titulo": "Acelerar o pausar el juego",
         "objetivo": "distinguir cuándo progresar rápidamente y cuándo reorganizarse.",
         "tecnicos": "control, pase vertical, conducción y finalización.",
         "tacticos": "ritmos o tiempos del partido, temporización, profundidad y control del partido.",
         "fisicos": "velocidad de reacción ante cambios de ritmo táctico.",
         "coordinativos": "sincronización, orientación y adaptación.",
         "psicologicos": "toma de decisiones, confianza, motivación y responsabilidad."
        }
       ]
      },
      {
       "numero": 26,
       "titulo": "Construcción colectiva y desdoblamientos",
       "objetivoSemanal": "relacionar salida de balón, progresión y llegada a zonas de finalización.",
       "sesiones": [
        {
         "numero": 51,
         "titulo": "Construcción desde atrás",
         "objetivo": "conectar portero, defensa y jugadores de apoyo para superar la primera presión.",
         "tecnicos": "pase, control orientado, precisión y manejo del balón con los pies por el portero.",
         "tacticos": "salida de balón, apoyos, amplitud, distancias y orientación corporal.",
         "fisicos": "agilidad y movilidad de desplazamiento, sin sumar otra capacidad condicional como objetivo.",
         "coordinativos": "orientación, sincronización y equilibrio.",
         "psicologicos": "liderazgo compartido, confianza y comunicación."
        },
        {
         "numero": 52,
         "titulo": "Progresión y llegada",
         "objetivo": "conectar la construcción con la finalización mediante movimientos coordinados.",
         "tecnicos": "pared, control orientado, pase, conducción, remate y definición.",
         "tacticos": "desdoblamiento, profundidad, amplitud, desmarque y equilibrio defensivo.",
         "fisicos": "aceleración breve en acciones de apoyo y llegada.",
         "coordinativos": "sincronización, orientación y ritmo.",
         "psicologicos": "creatividad, cooperación, valentía y persistencia."
        }
       ]
      },
      {
       "numero": 27,
       "titulo": "Portero: integración específica",
       "objetivoSemanal": "reforzar la participación del portero como defensor de la portería y como primer jugador de la construcción ofensiva.",
       "sesiones": [
        {
         "numero": 53,
         "titulo": "Ubicación e intervención",
         "objetivo": "mejorar la colocación y la elección de la intervención más adecuada.",
         "tecnicos": "ubicación, blocaje y desvío adaptados al nivel, despeje seguro y manejo básico del balón.",
         "tacticos": "posición respecto al balón y la portería, protección del espacio y comunicación con los defensores.",
         "fisicos": "velocidad de reacción específica, con acciones breves y pausas suficientes.",
         "coordinativos": "equilibrio, orientación, reacción y sincronización.",
         "psicologicos": "confianza, atención y valentía controlada."
        },
        {
         "numero": 54,
         "titulo": "Portero en la salida de balón",
         "objetivo": "integrar al portero en la circulación y en la organización defensiva.",
         "tecnicos": "pase, control con los pies, precisión y reinicio del juego.",
         "tacticos": "salida de balón, apoyo, ubicación, vigilancia y comunicación defensiva.",
         "fisicos": "movilidad y flexibilidad adaptadas.",
         "coordinativos": "orientación, equilibrio y sincronización.",
         "psicologicos": "liderazgo, responsabilidad, confianza y trabajo en equipo."
        }
       ]
      },
      {
       "numero": 28,
       "titulo": "Integración global ofensiva y defensiva",
       "objetivoSemanal": "combinar los fundamentos en situaciones de juego con múltiples soluciones posibles.",
       "sesiones": [
        {
         "numero": 55,
         "titulo": "Ataque organizado",
         "objetivo": "construir ataques mediante circulación, progresión y finalización.",
         "tecnicos": "pase, control, conducción, regate, pared, precisión, remate y definición.",
         "tacticos": "apoyos, desmarques, amplitud, profundidad, desdoblamientos, conservación y control del ritmo.",
         "fisicos": "resistencia adaptada al juego, regulando las pausas.",
         "coordinativos": "orientación, ritmo, sincronización y adaptación.",
         "psicologicos": "creatividad, cooperación, motivación y responsabilidad."
        },
        {
         "numero": 56,
         "titulo": "Defensa organizada y transición",
         "objetivo": "mantener la organización defensiva y responder a los cambios de posesión.",
         "tecnicos": "anticipación, interceptación, protección, recuperación y pase de salida.",
         "tacticos": "marcaje, presión, acoso, coberturas, permutas, vigilancia, repliegue, temporización y equilibrio defensivo.",
         "fisicos": "agilidad defensiva mediante desplazamientos controlados.",
         "coordinativos": "reacción, orientación y sincronización.",
         "psicologicos": "solidaridad, persistencia, atención y autocontrol."
        }
       ]
      },
      {
       "numero": 29,
       "titulo": "Evaluación y transferencia al partido",
       "objetivoSemanal": "comprobar cómo aplican los jugadores los fundamentos en situaciones reales y detectar necesidades individuales.",
       "sesiones": [
        {
         "numero": 57,
         "titulo": "Evaluación técnica y coordinativa",
         "objetivo": "observar la evolución en la ejecución técnica y el control corporal.",
         "tecnicos": "desplazamiento, pase, control, conducción, juego aéreo adaptado, precisión, regate, enganche, control orientado, remate, definición, carga legal, protección, anticipación e interceptación.",
         "tacticos": "elección del recurso adecuado según el espacio, el rival y el compañero.",
         "fisicos": "valoración cualitativa de la adaptación física al juego, sin convertir la sesión en una batería de pruebas agotadora.",
         "coordinativos": "equilibrio, reacción, orientación, perfil corporal, sincronización y ritmo.",
         "psicologicos": "confianza, atención, persistencia y aceptación constructiva de las correcciones."
        },
        {
         "numero": 58,
         "titulo": "Evaluación táctica y colectiva",
         "objetivo": "observar la comprensión del juego y la capacidad de colaborar con el equipo.",
         "tecnicos": "pase, control orientado, recuperación y finalización.",
         "tacticos": "zonas y fases del juego, apoyo, desmarque, distancias, pressing, coberturas, conservación, repliegue, permuta, temporización, acoso, vigilancia, equilibrio, pared, desdoblamiento, salida, profundidad, ritmo y control del partido.",
         "fisicos": "velocidad de reacción en situaciones naturales de juego, con carga moderada.",
         "coordinativos": "orientación, sincronización y adaptación.",
         "psicologicos": "liderazgo, responsabilidad, solidaridad, comunicación y competitividad sana."
        }
       ]
      },
      {
       "numero": 30,
       "titulo": "Consolidación y cierre del ciclo",
       "objetivoSemanal": "finalizar el ciclo comprobando el progreso, reforzando los fundamentos prioritarios y preparando la continuidad de la temporada.",
       "sesiones": [
        {
         "numero": 59,
         "titulo": "Integración competitiva",
         "objetivo": "aplicar los fundamentos técnicos y tácticos en un contexto global de juego.",
         "tecnicos": "selección libre de pase, control, conducción, regate, protección, remate y definición.",
         "tacticos": "organización ofensiva y defensiva, transiciones, estrategia a balón parado y toma de decisiones.",
         "fisicos": "adaptación al juego, evitando añadir una carga condicional específica elevada.",
         "coordinativos": "reacción, orientación, ritmo, equilibrio y sincronización.",
         "psicologicos": "trabajo en equipo, motivación, confianza y responsabilidad."
        },
        {
         "numero": 60,
         "titulo": "Revisión, refuerzo y proyección",
         "objetivo": "reconocer avances, reforzar necesidades y establecer prioridades para el siguiente ciclo.",
         "tecnicos": "repaso de los fundamentos que el grupo necesita mejorar.",
         "tacticos": "repaso de los principios colectivos que aún no se aplican con continuidad.",
         "fisicos": "movilidad y flexibilidad adaptadas, con carga global moderada.",
         "coordinativos": "orientación, equilibrio y adaptación motriz.",
         "psicologicos": "valoración del esfuerzo, persistencia, respeto, motivación y objetivos individuales de mejora."
        }
       ]
      }
     ],
     "id": "ciclo-4",
     "nombre": "Ciclo Tipo 4",
     "subtitulo": "Consolidación, aplicación al juego y desarrollo colectivo",
     "rango": "Semanas 21–30"
    }
   ]
  },
  {
   "id": "formacion-desarrollo",
   "nombre": "Formación y Desarrollo en el Fútbol 11",
   "subtitulo": "Infantil, cadete y juvenil",
   "sesionesPorSemana": 3,
   "totalSesiones": 90,
   "intro": [
    "Se apoya en las 4 zonas del campo del libro (Zona Inicial, Zona Media-Cobertura, Zona Media-Creación y Zona Final) y en los 4 momentos del juego (ataque organizado, defensa organizada, transición ofensiva y transición defensiva). Tres sesiones semanales: las dos primeras desarrollan el objetivo de la semana y la tercera tiene siempre la misma función a lo largo de toda la temporada: sistematizar el ataque para generar espacio y trabajar un bloque de estrategia a balón parado que va creciendo en complejidad, en ataque y en defensa.",
    "En todas las sesiones aparecen de forma constante el perfilamiento corporal (para recibir y para pasar), el control orientado para generar espacio y el juego a un toque en las zonas de presión para ganar tiempo al rival.",
    "Es una planificación de referencia: ajústala a la respuesta real de tu grupo sin perder la conexión entre los objetivos técnicos, tácticos, físicos y psicológicos."
   ],
   "ciclos": [
    {
     "semanas": [
      {
       "numero": 1,
       "titulo": "Reconocimiento del grupo, sistema y posiciones",
       "objetivoSemanal": "conocer el nivel técnico-táctico del grupo y fijar el sistema de juego base.",
       "sesiones": [
        {
         "numero": 1,
         "titulo": "Evaluación inicial",
         "objetivo": "observar el punto de partida técnico, táctico, físico y psicológico de cada jugador.",
         "tecnicos": "pase, control orientado, conducción y perfilamiento corporal al recibir.",
         "tacticos": "ocupación de posiciones según el sistema elegido, reconocimiento de compañeros y espacios.",
         "fisicos": "adaptación general, sin carga condicional exigente.",
         "coordinativos": "",
         "psicologicos": "atención, confianza y disposición a ser evaluado sin presión."
        },
        {
         "numero": 2,
         "titulo": "Sistema táctico y posiciones",
         "objetivo": "que cada jugador entienda su posición y su relación con las posiciones vecinas.",
         "tecnicos": "pase corto y medio según distancia, control orientado hacia la posición siguiente.",
         "tacticos": "líneas del sistema, distancias entre líneas, posiciones y funciones básicas por puesto.",
         "fisicos": "resistencia general mediante desplazamientos posicionales.",
         "coordinativos": "",
         "psicologicos": "comunicación, responsabilidad posicional y escucha."
        },
        {
         "numero": 3,
         "titulo": "Integración + introducción a estrategia",
         "objetivo": "unir lo trabajado en juego reducido y abrir el bloque fijo de estrategia.",
         "tecnicos": "pase, control, golpeo de precisión en centro lateral.",
         "tacticos": "ocupación de espacios en ataque; estrategia: corner ofensivo directo y corner defensivo con marcaje por zonas, en su forma más simple.",
         "fisicos": "velocidad de reacción en la llegada al primer y segundo palo.",
         "coordinativos": "",
         "psicologicos": "atención y responsabilidad en la función asignada en la jugada."
        }
       ]
      },
      {
       "numero": 2,
       "titulo": "Base física y principios de posesión",
       "objetivoSemanal": "construir la base física de la temporada sin descuidar la posesión colectiva.",
       "sesiones": [
        {
         "numero": 4,
         "titulo": "Posesión en espacio grande",
         "objetivo": "conservar el balón con calidad técnica en espacios amplios.",
         "tecnicos": "pase, control orientado para generar espacio, perfilamiento antes de recibir.",
         "tacticos": "apoyos, amplitud, distancias de pase y circulación.",
         "fisicos": "resistencia aeróbica de base mediante el propio juego de posesión.",
         "coordinativos": "",
         "psicologicos": "paciencia, atención y comunicación."
        },
        {
         "numero": 5,
         "titulo": "Base física específica",
         "objetivo": "desarrollar fuerza general y velocidad de reacción aplicadas al juego.",
         "tecnicos": "conducción y control bajo fatiga moderada.",
         "tacticos": "ocupación de espacio tras esfuerzos físicos (volver a la posición).",
         "fisicos": "fuerza general (autocargas) o velocidad de reacción — una sola capacidad principal.",
         "coordinativos": "",
         "psicologicos": "persistencia y autocontrol ante el esfuerzo."
        },
        {
         "numero": 6,
         "titulo": "Amplitud para generar espacio + estrategia",
         "objetivo": "usar la amplitud como herramienta para abrir huecos, y ampliar el repertorio de corner.",
         "tecnicos": "pase largo, centro, remate de cabeza o pie según nivel.",
         "tacticos": "amplitud forzada para desequilibrar la defensa; estrategia: variante de corner con bloqueo y desmarque cruzado, ofensivo y defensivo.",
         "fisicos": "aceleración breve en la llegada al área.",
         "coordinativos": "",
         "psicologicos": "creatividad y confianza en la ejecución."
        }
       ]
      },
      {
       "numero": 3,
       "titulo": "Integración y amistosos de evaluación",
       "objetivoSemanal": "comprobar en competición real lo trabajado en pretemporada.",
       "sesiones": [
        {
         "numero": 7,
         "titulo": "Integración técnico-táctica-física",
         "objetivo": "unir los contenidos de las dos semanas previas en juego continuo.",
         "tecnicos": "todos los trabajados hasta ahora, con énfasis en el perfilamiento.",
         "tacticos": "sistema, posiciones, posesión y amplitud en conjunto.",
         "fisicos": "resistencia general aplicada al juego.",
         "coordinativos": "",
         "psicologicos": "trabajo en equipo y responsabilidad colectiva."
        },
        {
         "numero": 8,
         "titulo": "Amistoso de pretemporada",
         "objetivo": "observar el comportamiento global del equipo en competición.",
         "tecnicos": "",
         "tacticos": "",
         "fisicos": "carga real de competición, sin forzar más allá del amistoso.",
         "coordinativos": "",
         "psicologicos": "gestión del contexto competitivo, confianza y comunicación."
        },
        {
         "numero": 9,
         "titulo": "Repaso de estrategia + segundo amistoso",
         "objetivo": "cerrar la pretemporada con un repaso de estrategia y una segunda referencia competitiva.",
         "tecnicos": "golpeo de precisión, remate, perfilamiento en la ejecución de la jugada.",
         "tacticos": "repaso de corner ofensivo/defensivo; introducción de falta lateral básica ofensiva y defensiva.",
         "fisicos": "adaptación a la carga de un segundo amistoso en la misma semana.",
         "coordinativos": "",
         "psicologicos": "confianza acumulada y disposición a competir."
        }
       ]
      }
     ],
     "id": "pretemporada",
     "nombre": "Pretemporada",
     "subtitulo": "Reconocer al grupo y construir la base de la temporada",
     "rango": "Semanas 1–3"
    },
    {
     "semanas": [
      {
       "numero": 4,
       "titulo": "Conservación, salida de balón y primer apoyo",
       "objetivoSemanal": "construir el juego desde atrás con seguridad.",
       "sesiones": [
        {
         "numero": 10,
         "titulo": "Salida de balón desde el portero",
         "objetivo": "iniciar el juego desde el portero con seguridad, ofreciendo apoyos cercanos y perfilándose para recibir de espaldas a la presión.",
         "tecnicos": "manejo del balón con los pies del portero, pase, control orientado.",
         "tacticos": "apoyos cercanos, amplitud de los centrales, perfilamiento para recibir de espaldas a la presión.",
         "fisicos": "velocidad de reacción para ofrecer línea de pase.",
         "coordinativos": "",
         "psicologicos": "confianza y serenidad bajo la primera presión rival."
        },
        {
         "numero": 11,
         "titulo": "Primer apoyo y conservación",
         "objetivo": "asegurar el primer apoyo del mediocentro y conservar el balón mediante triángulos de pase y una circulación fluida.",
         "tecnicos": "pase corto, control orientado, un toque cuando el espacio lo permita.",
         "tacticos": "primer apoyo del mediocentro, triángulos de pase, circulación.",
         "fisicos": "resistencia adaptada al ritmo de posesión.",
         "coordinativos": "",
         "psicologicos": "paciencia y comunicación constante."
        },
        {
         "numero": 12,
         "titulo": "Sistematización de espacio + estrategia",
         "objetivo": "generar espacio en banda con desmarques de ruptura y aprender la falta lateral con cambio de orientación: se simula el centro hacia un lado y el pase real llega al contrario, donde las marcas se confunden.",
         "tecnicos": "pase al espacio, control orientado tras desmarque.",
         "tacticos": "desmarques de ruptura para generar espacio en banda; estrategia: falta lateral con cambio de orientación — centro inicial simulado a un lado, pase real al lado contrario donde las marcas se confunden.",
         "fisicos": "aceleración breve en el desmarque de ruptura.",
         "coordinativos": "",
         "psicologicos": "creatividad y valentía para desmarcarse al espacio."
        }
       ]
      },
      {
       "numero": 5,
       "titulo": "Marcaje, distancias y primera línea de presión",
       "objetivoSemanal": "defender con orden desde el primer contacto con el balón rival.",
       "sesiones": [
        {
         "numero": 13,
         "titulo": "Marcaje y distancia de intervención",
         "objetivo": "marcar con la distancia de intervención correcta y orientar al rival hacia las zonas menos peligrosas.",
         "tecnicos": "posición defensiva, interceptación, perfilamiento defensivo orientando al rival.",
         "tacticos": "marcaje, distancia de intervención, orientar al rival hacia zonas menos peligrosas.",
         "fisicos": "velocidad de reacción ante el cambio de dirección del atacante.",
         "coordinativos": "",
         "psicologicos": "atención y valentía en el duelo individual."
        },
        {
         "numero": 14,
         "titulo": "Primera línea de presión",
         "objetivo": "organizar la primera línea de presión, orientando al rival con balón y asegurando la cobertura del segundo hombre.",
         "tecnicos": "interceptación, recuperación, primer pase tras robo.",
         "tacticos": "presión de la primera línea, orientación de la presión, cobertura del segundo hombre.",
         "fisicos": "resistencia adaptada a esfuerzos intermitentes de presión.",
         "coordinativos": "",
         "psicologicos": "trabajo en equipo y comunicación en la presión."
        },
        {
         "numero": 15,
         "titulo": "Generar espacio con cambios de ritmo + estrategia",
         "objetivo": "desequilibrar al marcador alternando pausa y aceleración, y organizar la falta frontal con barrera: colocación, salto coordinado y defensa del segundo palo.",
         "tecnicos": "control orientado, cambio de ritmo en la conducción.",
         "tacticos": "pausa-aceleración para desequilibrar al marcador; estrategia: falta frontal con barrera — colocación, salto coordinado, defensa del segundo palo.",
         "fisicos": "velocidad de aceleración tras el cambio de ritmo.",
         "coordinativos": "",
         "psicologicos": "confianza para variar el ritmo con intención."
        }
       ]
      },
      {
       "numero": 6,
       "titulo": "Coberturas, permutas y equilibrio defensivo",
       "objetivoSemanal": "proteger al compañero superado y mantener el orden del equipo.",
       "sesiones": [
        {
         "numero": 16,
         "titulo": "Cobertura y permuta",
         "objetivo": "proteger al compañero superado mediante la cobertura del central y la permuta entre lateral y central, con comunicación constante.",
         "tecnicos": "desplazamiento defensivo, interceptación, recuperación.",
         "tacticos": "cobertura del central, permuta entre lateral y central, comunicación.",
         "fisicos": "agilidad en desplazamientos defensivos cortos.",
         "coordinativos": "",
         "psicologicos": "solidaridad y responsabilidad compartida."
        },
        {
         "numero": 17,
         "titulo": "Equilibrio defensivo",
         "objetivo": "mantener el equilibrio entre líneas, sabiendo quién sube, quién se queda y a qué distancias, para no regalar espacios al rival.",
         "tecnicos": "pase seguro bajo presión, control orientado para salir de la presión.",
         "tacticos": "equilibrio entre líneas, quién sube y quién se queda, distancias.",
         "fisicos": "resistencia adaptada a situaciones intermitentes.",
         "coordinativos": "",
         "psicologicos": "liderazgo compartido y comunicación."
        },
        {
         "numero": 18,
         "titulo": "Terceros hombres para generar espacio + estrategia",
         "objetivo": "superar líneas de presión con la combinación del tercer hombre y trabajar el saque de banda largo al área, tanto para atacar como para defenderlo.",
         "tecnicos": "pase a un toque, control orientado del tercer hombre.",
         "tacticos": "combinación con tercer hombre para superar líneas de presión; estrategia: saque de banda largo al área (ofensivo) y organización defensiva del saque de banda rival.",
         "fisicos": "velocidad de reacción del tercer hombre al ofrecerse.",
         "coordinativos": "",
         "psicologicos": "anticipación y confianza colectiva."
        }
       ]
      },
      {
       "numero": 7,
       "titulo": "Amplitud y profundidad en ataque organizado",
       "objetivoSemanal": "estirar al rival en ancho y en profundidad para abrir espacios interiores.",
       "sesiones": [
        {
         "numero": 19,
         "titulo": "Amplitud",
         "objetivo": "estirar al bloque rival con la máxima amplitud, con receptores perfilados en banda que abran espacios interiores.",
         "tecnicos": "pase largo a banda, control orientado del extremo/lateral.",
         "tacticos": "amplitud máxima para estirar al bloque rival, perfilamiento del receptor en banda.",
         "fisicos": "resistencia específica de carrilero/extremo.",
         "coordinativos": "",
         "psicologicos": "paciencia para esperar el espacio generado."
        },
        {
         "numero": 20,
         "titulo": "Profundidad",
         "objetivo": "atacar el espacio a la espalda de la defensa con desmarques de profundidad, ajustando el momento de la carrera al del pase.",
         "tecnicos": "pase al espacio a la espalda, control orientado en carrera.",
         "tacticos": "desmarques de profundidad, timing de la carrera respecto al pase.",
         "fisicos": "aceleración en la carrera de profundidad.",
         "coordinativos": "",
         "psicologicos": "valentía para atacar el espacio a la espalda."
        },
        {
         "numero": 21,
         "titulo": "Combinar amplitud y profundidad + estrategia",
         "objetivo": "encadenar amplitud, profundidad, centro y remate en una misma secuencia, y ensayar el córner con bloqueo y desmarque al punto de penalti.",
         "tecnicos": "centro tras amplitud, remate tras llegada de profundidad.",
         "tacticos": "secuencia amplitud → profundidad → centro → remate; estrategia: corner con jugada ensayada (bloqueo + desmarque al punto de penalti).",
         "fisicos": "velocidad gestual en la definición.",
         "coordinativos": "",
         "psicologicos": "confianza en la secuencia ensayada."
        }
       ]
      },
      {
       "numero": 8,
       "titulo": "Circulación, ritmos del partido y ocupación sin balón",
       "objetivoSemanal": "que todo el equipo sepa qué hacer cuando no tiene el balón.",
       "sesiones": [
        {
         "numero": 22,
         "titulo": "Circulación y cambios de orientación",
         "objetivo": "mover el balón de un lado a otro con cambios de orientación para encontrar el lado débil del rival.",
         "tecnicos": "pase, control orientado, golpeo de cambio de orientación.",
         "tacticos": "circulación de un lado a otro para encontrar el lado débil del rival.",
         "fisicos": "resistencia adaptada al ritmo de circulación.",
         "coordinativos": "",
         "psicologicos": "paciencia y lectura colectiva del momento de cambiar."
        },
        {
         "numero": 23,
         "titulo": "Ritmos del partido",
         "objetivo": "decidir colectivamente cuándo acelerar y cuándo pausar según la zona del campo y la presión rival.",
         "tecnicos": "un toque en zonas de presión para ganar tiempo; pausa con control orientado en zonas libres.",
         "tacticos": "acelerar o pausar según la zona y la presión rival.",
         "fisicos": "velocidad de reacción ante el cambio de ritmo decidido por el equipo.",
         "coordinativos": "",
         "psicologicos": "toma de decisiones y confianza del portador del balón."
        },
        {
         "numero": 24,
         "titulo": "Ocupación racional sin balón + estrategia",
         "objetivo": "que los jugadores sin balón ocupen el espacio con criterio, y cerrar el Ciclo Tipo 1 repasando córner y falta lateral, en ataque y en defensa.",
         "tecnicos": "desplazamiento sin balón, perfilamiento para ofrecer apoyo constante.",
         "tacticos": "ocupación racional del espacio de los jugadores sin balón; estrategia: repaso integral de corner y falta lateral, ofensivo y defensivo, cerrando el Ciclo Tipo 1.",
         "fisicos": "adaptación física general al juego continuo.",
         "coordinativos": "",
         "psicologicos": "trabajo en equipo y responsabilidad sin balón."
        }
       ]
      }
     ],
     "id": "ciclo-1",
     "nombre": "Ciclo Tipo 1",
     "subtitulo": "Principios colectivos básicos",
     "rango": "Semanas 4–8"
    },
    {
     "semanas": [
      {
       "numero": 9,
       "titulo": "Ataque organizado — construcción (Zona Inicial / Media-Cobertura)",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 25,
         "titulo": "Construcción desde el portero",
         "objetivo": "construir el juego en Zona Inicial con superioridad posicional ante la primera presión rival, saliendo con calma desde el portero.",
         "tecnicos": "pase corto, control orientado, perfilamiento de espaldas a la presión.",
         "tacticos": "construcción en Zona Inicial, superioridad posicional ante la primera presión rival.",
         "fisicos": "velocidad de reacción para ofrecer apoyo en construcción.",
         "coordinativos": "",
         "psicologicos": "serenidad bajo presión."
        },
        {
         "numero": 26,
         "titulo": "Progresión a Zona Media-Cobertura",
         "objetivo": "superar la primera línea de presión rival y ocupar con orden la Zona Media-Cobertura.",
         "tecnicos": "conducción progresiva, pase entre líneas.",
         "tacticos": "superar la primera línea rival, ocupación de la Zona Media-Cobertura.",
         "fisicos": "resistencia adaptada a la progresión continua.",
         "coordinativos": "",
         "psicologicos": "paciencia y decisión conjunta."
        },
        {
         "numero": 27,
         "titulo": "Generar superioridad posicional + estrategia",
         "objetivo": "crear superioridad numérica puntual en Zona Media-Cobertura y trabajar la falta ofensiva desde el lateral con centro de pase largo.",
         "tecnicos": "pase al tercer hombre, control orientado bajo presión.",
         "tacticos": "generar superioridad numérica puntual en Zona Media-Cobertura; estrategia: falta ofensiva desde el lateral del campo — centro con pase largo.",
         "fisicos": "aceleración breve al recibir entre líneas.",
         "coordinativos": "",
         "psicologicos": "confianza para jugar bajo presión."
        }
       ]
      },
      {
       "numero": 10,
       "titulo": "Ataque organizado — creación y llegada (Zona Media-Creación / Final)",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 28,
         "titulo": "Creación en Zona Media-Creación",
         "objetivo": "crear ocasiones en Zona Media-Creación mediante desdoblamientos y combinaciones que permitan entrar a Zona Final.",
         "tecnicos": "pase filtrado, control orientado, regate en espacio reducido.",
         "tacticos": "desdoblamientos, combinaciones para entrar a Zona Final.",
         "fisicos": "agilidad con cambios de dirección.",
         "coordinativos": "",
         "psicologicos": "creatividad y valentía."
        },
        {
         "numero": 29,
         "titulo": "Llegada y finalización en Zona Final",
         "objetivo": "ocupar las zonas de remate y ajustar el momento de llegada para finalizar con ventaja.",
         "tecnicos": "centro, remate, definición tras último pase.",
         "tacticos": "ocupación de zonas de remate, timing de llegada.",
         "fisicos": "velocidad de reacción en el momento de definir.",
         "coordinativos": "",
         "psicologicos": "confianza y gestión del acierto/error."
        },
        {
         "numero": 30,
         "titulo": "Secuencia completa construcción-creación-llegada + estrategia",
         "objetivo": "recorrer las cuatro zonas en una sola secuencia ofensiva, de la construcción a la finalización, y ensayar el córner con bloqueo doble.",
         "tecnicos": "todos los anteriores encadenados.",
         "tacticos": "recorrido completo de las 4 zonas en una secuencia ofensiva; estrategia: corner con variante de bloqueo doble.",
         "fisicos": "resistencia aplicada a la secuencia completa.",
         "coordinativos": "",
         "psicologicos": "paciencia y persistencia en la construcción del ataque."
        }
       ]
      },
      {
       "numero": 11,
       "titulo": "Defensa organizada — bloque y vigilancia por zona",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 31,
         "titulo": "Bloque defensivo",
         "objetivo": "mantener las distancias del bloque defensivo según la zona donde está el balón.",
         "tecnicos": "desplazamiento defensivo, interceptación.",
         "tacticos": "mantener distancias del bloque según la zona donde está el balón.",
         "fisicos": "agilidad defensiva.",
         "coordinativos": "",
         "psicologicos": "atención sostenida."
        },
        {
         "numero": 32,
         "titulo": "Vigilancia según zona",
         "objetivo": "vigilar a los rivales según la zona que ocupan y orientar la marca para anticipar sus movimientos.",
         "tecnicos": "anticipación, interceptación, perfilamiento defensivo.",
         "tacticos": "vigilancia de rivales según la zona que ocupan, orientación de la marca.",
         "fisicos": "reacción ante cambios de orientación del juego rival.",
         "coordinativos": "",
         "psicologicos": "concentración sostenida."
        },
        {
         "numero": 33,
         "titulo": "Defensa organizada integral + estrategia",
         "objetivo": "defender como bloque combinando vigilancia y cobertura, y organizar la defensa de la falta frontal con barrera y marcaje mixto (zona y hombre).",
         "tecnicos": "despeje, recuperación, pase de salida inmediato.",
         "tacticos": "bloque + vigilancia + cobertura en conjunto; estrategia: defensa de falta frontal con barrera y marcaje combinado zona-hombre.",
         "fisicos": "resistencia a la presión sostenida.",
         "coordinativos": "",
         "psicologicos": "solidaridad defensiva."
        }
       ]
      },
      {
       "numero": 12,
       "titulo": "Transición ofensiva hacia Zona Final",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 34,
         "titulo": "Primer pase tras recuperar",
         "objetivo": "decidir en segundos, tras recuperar el balón, si conviene conservarlo o progresar en directo según la zona de recuperación.",
         "tecnicos": "primer control, pase vertical inmediato.",
         "tacticos": "decisión rápida — ¿conservar o progresar directo? — según la zona de recuperación.",
         "fisicos": "aceleración inmediata tras la recuperación.",
         "coordinativos": "",
         "psicologicos": "valentía para decidir rápido."
        },
        {
         "numero": 35,
         "titulo": "Progresión rápida a Zona Final",
         "objetivo": "llegar rápido a Zona Final tras recuperar, ocupando carriles y ofreciendo apoyos en profundidad.",
         "tecnicos": "conducción a velocidad, pase al espacio.",
         "tacticos": "ocupación de carriles para la transición, apoyos en profundidad.",
         "fisicos": "velocidad máxima en la conducción.",
         "coordinativos": "",
         "psicologicos": "confianza en la decisión individual."
        },
        {
         "numero": 36,
         "titulo": "Transición + definición + estrategia",
         "objetivo": "culminar la transición ofensiva con una buena definición y ensayar la falta lateral avanzada con pase corto y disparo.",
         "tecnicos": "definición tras transición rápida.",
         "tacticos": "últimos metros de la transición ofensiva; estrategia: falta lateral avanzada — variante con pase corto y disparo.",
         "fisicos": "velocidad gestual en la definición tras esfuerzo intenso.",
         "coordinativos": "",
         "psicologicos": "gestión de la ansiedad en la definición rápida."
        }
       ]
      },
      {
       "numero": 13,
       "titulo": "Transición defensiva hacia Zona Inicial",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 37,
         "titulo": "Reacción inmediata a la pérdida",
         "objetivo": "reaccionar en los cinco segundos posteriores a la pérdida, sabiendo quién presiona al poseedor y quién repliega.",
         "tecnicos": "presión inmediata sobre el poseedor, recuperación.",
         "tacticos": "los 5 segundos tras la pérdida — quién presiona, quién repliega.",
         "fisicos": "velocidad de reacción inmediata.",
         "coordinativos": "",
         "psicologicos": "autocontrol y responsabilidad tras el error."
        },
        {
         "numero": 38,
         "titulo": "Repliegue hacia Zona Inicial",
         "objetivo": "replegar con orden y recomponer las líneas en Zona Inicial.",
         "tecnicos": "desplazamiento defensivo a máxima intensidad.",
         "tacticos": "repliegue ordenado, recomposición de líneas en Zona Inicial.",
         "fisicos": "resistencia a esfuerzos repetidos de alta intensidad.",
         "coordinativos": "",
         "psicologicos": "sacrificio colectivo y persistencia."
        },
        {
         "numero": 39,
         "titulo": "Transición defensiva completa + estrategia",
         "objetivo": "completar el ciclo pérdida, presión, repliegue y recomposición, y organizar la defensa del saque de banda ofensivo rival.",
         "tecnicos": "interceptación tras repliegue, primer pase de salida.",
         "tacticos": "ciclo completo pérdida → presión → repliegue → recomposición; estrategia: organización defensiva ante saque de banda ofensivo rival.",
         "fisicos": "capacidad de repetir el esfuerzo varias veces en la sesión.",
         "coordinativos": "",
         "psicologicos": "determinación y disciplina táctica."
        }
       ]
      },
      {
       "numero": 14,
       "titulo": "Integración de los 4 momentos en juego continuo",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 40,
         "titulo": "Reconocer el momento del juego",
         "objetivo": "que cada jugador reconozca en qué momento del juego está el equipo (ataque, defensa o transición) y actúe en consecuencia.",
         "tecnicos": "todos los trabajados, aplicados según el momento.",
         "tacticos": "identificar en qué momento está el equipo (ataque, defensa, transición) y actuar en consecuencia.",
         "fisicos": "adaptación a cambios constantes de intensidad.",
         "coordinativos": "",
         "psicologicos": "atención y lectura colectiva."
        },
        {
         "numero": 41,
         "titulo": "Reconocer la zona y el momento combinados",
         "objetivo": "cruzar la zona del campo con el momento del juego para elegir la acción correcta.",
         "tecnicos": "todos los trabajados, con énfasis en el perfilamiento según zona.",
         "tacticos": "cruzar zona + momento para decidir la acción correcta.",
         "fisicos": "resistencia general aplicada al juego continuo.",
         "coordinativos": "",
         "psicologicos": "toma de decisiones bajo presión de tiempo."
        },
        {
         "numero": 42,
         "titulo": "Juego real con los 4 momentos + estrategia",
         "objetivo": "valorar en juego real el paso entre los cuatro momentos, con atención especial a las transiciones, y repasar el repertorio de balón parado antes de entrar en el Ciclo Tipo 3.",
         "tecnicos": "libre, según la situación de juego.",
         "tacticos": "partido condicionado donde se valoran especialmente las transiciones; estrategia: repaso de todo el repertorio del Ciclo Tipo 1 y 2 antes de entrar en el Ciclo Tipo 3 sistémico.",
         "fisicos": "carga de partido real.",
         "coordinativos": "",
         "psicologicos": "cierre de ciclo — confianza en lo aprendido."
        }
       ]
      }
     ],
     "id": "ciclo-2",
     "nombre": "Ciclo Tipo 2",
     "subtitulo": "Momentos del juego × 4 zonas",
     "rango": "Semanas 9–14"
    },
    {
     "semanas": [
      {
       "numero": 15,
       "titulo": "Ataque a la profundidad por bandas",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 43,
         "titulo": "Generar superioridad en el carril exterior",
         "objetivo": "generar superioridad numérica en el carril exterior con el apoyo del interior o del lateral.",
         "tecnicos": "pase a banda, control orientado del carrilero/extremo, perfilamiento para encarar.",
         "tacticos": "superioridad numérica en banda mediante apoyo del interior o del lateral.",
         "fisicos": "resistencia específica de banda.",
         "coordinativos": "",
         "psicologicos": "valentía para encarar en 1v1."
        },
        {
         "numero": 44,
         "titulo": "De la banda a Zona Final",
         "objetivo": "llevar la superioridad de banda hasta Zona Final, llegando con apoyos interiores.",
         "tecnicos": "centro, remate, definición.",
         "tacticos": "desde la superioridad de banda hasta la llegada a Zona Final con apoyos interiores.",
         "fisicos": "velocidad en la progresión final de banda.",
         "coordinativos": "",
         "psicologicos": "confianza en el desborde y el centro."
        },
        {
         "numero": 45,
         "titulo": "Profundidad por banda sistematizada + estrategia",
         "objetivo": "automatizar el patrón amplitud, superioridad, profundidad y centro, y ensayar el córner con variante al primer palo en corto.",
         "tecnicos": "todos los anteriores encadenados a máxima velocidad.",
         "tacticos": "automatizar el patrón: amplitud → superioridad → profundidad → centro; estrategia: corner con variante al primer palo en corto.",
         "fisicos": "capacidad de repetir la secuencia varias veces.",
         "coordinativos": "",
         "psicologicos": "persistencia en la ejecución del patrón."
        }
       ]
      },
      {
       "numero": 16,
       "titulo": "Presión alta: activación y objetivo",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 46,
         "titulo": "Cuándo activar la presión alta",
         "objetivo": "reconocer las señales que activan la presión alta: un pase hacia atrás, un control deficiente del rival o un pase lateral del portero.",
         "tecnicos": "interceptación, anticipación en Zona Final rival.",
         "tacticos": "señales de activación de la presión (pase hacia atrás, control deficiente del rival, pase lateral del portero).",
         "fisicos": "capacidad de esfuerzos cortos y explosivos repetidos.",
         "coordinativos": "",
         "psicologicos": "atención colectiva y comunicación de la activación."
        },
        {
         "numero": 47,
         "titulo": "Con qué jugadores y hacia qué zona",
         "objetivo": "definir qué jugadores presionan primero y hacia qué lado se orienta al rival.",
         "tecnicos": "cobertura de líneas de pase rival, orientación de la presión.",
         "tacticos": "qué jugadores presionan primero, hacia qué lado se orienta al rival.",
         "fisicos": "resistencia a esfuerzos intermitentes de alta intensidad.",
         "coordinativos": "",
         "psicologicos": "coordinación colectiva y confianza en el plan."
        },
        {
         "numero": 48,
         "titulo": "Presión alta con recompensa + estrategia",
         "objetivo": "convertir la presión alta en una finalización rápida y trabajar la falta ofensiva cercana al área con variante directa a portería.",
         "tecnicos": "recuperación en Zona Final, definición inmediata.",
         "tacticos": "de la presión alta a la finalización rápida; estrategia: falta ofensiva cercana al área — variante directa a portería.",
         "fisicos": "capacidad de finalizar tras esfuerzo intenso.",
         "coordinativos": "",
         "psicologicos": "ambición colectiva y gestión de la euforia tras recuperar."
        }
       ]
      },
      {
       "numero": 17,
       "titulo": "Secuencia de repliegue (presión → línea del balón → línea de inicio)",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 49,
         "titulo": "Paso 1: presión en Zona Final rival",
         "objetivo": "presionar arriba con organización, como primer paso de la secuencia de repliegue.",
         "tecnicos": "interceptación, carga legal adaptada.",
         "tacticos": "primer paso de la secuencia — presionar arriba con organización.",
         "fisicos": "esfuerzo explosivo de corta duración.",
         "coordinativos": "",
         "psicologicos": "determinación en la primera fase de presión."
        },
        {
         "numero": 50,
         "titulo": "Paso 2: bascular a la línea del balón",
         "objetivo": "si no se recupera arriba, bascular el bloque hasta la línea del balón en Zona Media-Creación.",
         "tecnicos": "desplazamiento defensivo coordinado.",
         "tacticos": "si no se recupera arriba, el bloque bascula hasta la línea del balón en Zona Media-Creación.",
         "fisicos": "resistencia a esfuerzos intermitentes coordinados.",
         "coordinativos": "",
         "psicologicos": "disciplina para no romper el orden del bloque."
        },
        {
         "numero": 51,
         "titulo": "Paso 3: recomponer en Zona Inicial + estrategia",
         "objetivo": "recomponer todo el bloque en Zona Inicial si tampoco se recupera, y defender el córner con doble marcaje al rematador principal.",
         "tecnicos": "recuperación final, primer pase de salida tras recomponer.",
         "tacticos": "tercer paso — si tampoco se recupera, el bloque completo recompone en Zona Inicial; estrategia: defensa de corner con variante de doble marcaje al rematador principal rival.",
         "fisicos": "capacidad de sostener la secuencia completa de tres pasos.",
         "coordinativos": "",
         "psicologicos": "paciencia y confianza en que el sistema, no el individuo, resuelve."
        }
       ]
      },
      {
       "numero": 18,
       "titulo": "Bloques defensivos (alto, medio, bajo) y transición entre ellos",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 52,
         "titulo": "Bloque alto",
         "objetivo": "defender con el bloque alto, manejando distancias y coberturas y asumiendo el riesgo del espacio a la espalda.",
         "tecnicos": "interceptación en campo rival, pase de salida inmediato.",
         "tacticos": "distancias y coberturas propias del bloque alto, riesgo asumido a la espalda.",
         "fisicos": "capacidad de sprint repetido.",
         "coordinativos": "",
         "psicologicos": "valentía y confianza colectiva para asumir el riesgo."
        },
        {
         "numero": 53,
         "titulo": "Bloque medio y bloque bajo",
         "objetivo": "defender con los bloques medio y bajo, cuidando distancias, coberturas y la protección del área.",
         "tecnicos": "despeje, recuperación en campo propio.",
         "tacticos": "distancias y coberturas de los bloques medio y bajo, protección del área.",
         "fisicos": "resistencia a la concentración defensiva sostenida.",
         "coordinativos": "",
         "psicologicos": "paciencia y disciplina posicional."
        },
        {
         "numero": 54,
         "titulo": "Cuándo cambiar de bloque + estrategia",
         "objetivo": "decidir cuándo pasar de un bloque a otro según el marcador, el cansancio o el rival, y ensayar una jugada de laboratorio ofensiva que combine córner y segunda jugada.",
         "tecnicos": "todos los anteriores según el bloque activado.",
         "tacticos": "criterios para pasar de un bloque a otro durante el partido (marcador, cansancio, rival); estrategia: jugada de laboratorio ofensiva combinando corner y segunda jugada.",
         "fisicos": "adaptación a cambios de intensidad según el bloque.",
         "coordinativos": "",
         "psicologicos": "lectura colectiva del partido para decidir el bloque."
        }
       ]
      },
      {
       "numero": 19,
       "titulo": "Transición defensiva tras pérdida en zona rival",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 55,
         "titulo": "La situación más exigente",
         "objetivo": "gestionar la pérdida en zona avanzada, decidiendo quién presiona primero (el más cercano) y quién cubre el contragolpe.",
         "tecnicos": "presión inmediata tras perder en Zona Final propia (ofensivamente).",
         "tacticos": "quién presiona primero (el más cercano), quién cubre el contragolpe.",
         "fisicos": "capacidad de reacción inmediata tras esfuerzo ofensivo previo.",
         "coordinativos": "",
         "psicologicos": "autocontrol inmediato tras la pérdida en zona avanzada."
        },
        {
         "numero": 56,
         "titulo": "Evitar el contragolpe rival",
         "objetivo": "temporizar el contragolpe rival mientras el equipo se recompone.",
         "tecnicos": "falta táctica adaptada a la edad y al reglamento, interceptación.",
         "tacticos": "temporización del contragolpe, recomposición mientras se temporiza.",
         "fisicos": "velocidad de repliegue tras esfuerzo ofensivo.",
         "coordinativos": "",
         "psicologicos": "sacrificio y responsabilidad colectiva."
        },
        {
         "numero": 57,
         "titulo": "Integración completa + estrategia",
         "objetivo": "entrenar la pérdida en zona avanzada como una situación habitual del juego y organizar la defensa de la falta lateral avanzada del rival.",
         "tecnicos": "todos los anteriores en juego continuo.",
         "tacticos": "la pérdida en zona avanzada como entrenamiento constante, no excepcional; estrategia: defensa organizada ante falta lateral avanzada rival.",
         "fisicos": "resistencia a la exigencia repetida de esta situación.",
         "coordinativos": "",
         "psicologicos": "aceptar el riesgo como parte del juego ofensivo."
        }
       ]
      },
      {
       "numero": 20,
       "titulo": "Lectura global: momento + zona + bloque",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 58,
         "titulo": "Lectura individual",
         "objetivo": "que cada jugador identifique por sí mismo el momento, la zona y el bloque, sin indicaciones externas.",
         "tecnicos": "todos los trabajados en el Ciclo Tipo 3.",
         "tacticos": "cada jugador identifica momento, zona y bloque sin indicación externa.",
         "fisicos": "adaptación general a la exigencia sistémica.",
         "coordinativos": "",
         "psicologicos": "autonomía y confianza en la propia lectura."
        },
        {
         "numero": 59,
         "titulo": "Lectura colectiva",
         "objetivo": "coordinar al equipo a partir de una lectura compartida del momento, la zona y el bloque.",
         "tecnicos": "comunicación verbal y gestual entre jugadores.",
         "tacticos": "el equipo se coordina en conjunto según la lectura compartida.",
         "fisicos": "resistencia aplicada a la exigencia sistémica sostenida.",
         "coordinativos": "",
         "psicologicos": "liderazgo compartido y comunicación constante."
        },
        {
         "numero": 60,
         "titulo": "Cierre del Ciclo Tipo 3 + estrategia",
         "objetivo": "cerrar el Ciclo Tipo 3 con un partido condicionado que exige los cuatro momentos, las cuatro zonas y los tres bloques, y repasar todo el repertorio de balón parado.",
         "tecnicos": "repaso libre de todo el ciclo.",
         "tacticos": "partido condicionado que exige los 4 momentos, las 4 zonas y los 3 bloques; estrategia: repaso integral de todo el repertorio de balón parado trabajado hasta ahora.",
         "fisicos": "carga de cierre de ciclo, moderada.",
         "coordinativos": "",
         "psicologicos": "satisfacción por el progreso y proyección al Ciclo Tipo 4."
        }
       ]
      }
     ],
     "id": "ciclo-3",
     "nombre": "Ciclo Tipo 3",
     "subtitulo": "Sistémica pura",
     "rango": "Semanas 15–20"
    },
    {
     "semanas": [
      {
       "numero": 21,
       "titulo": "Superioridad/inferioridad numérica por zona",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 61,
         "titulo": "Superioridad ofensiva por zona",
         "objetivo": "aprovechar la superioridad numérica según la zona en que se produce, porque no es lo mismo en Zona Inicial que en Zona Final.",
         "tecnicos": "pase, control orientado, definición en superioridad.",
         "tacticos": "aprovechar la superioridad según en qué zona se produce (no es igual en Zona Inicial que en Zona Final).",
         "fisicos": "velocidad de reacción para aprovechar la ventaja.",
         "coordinativos": "",
         "psicologicos": "decisión rápida y confianza."
        },
        {
         "numero": 62,
         "titulo": "Inferioridad defensiva por zona",
         "objetivo": "proteger la zona más peligrosa cuando el equipo defiende en inferioridad numérica.",
         "tecnicos": "temporización, interceptación, despeje si es necesario.",
         "tacticos": "proteger la zona más peligrosa según dónde se produce la inferioridad.",
         "fisicos": "agilidad defensiva bajo desventaja numérica.",
         "coordinativos": "",
         "psicologicos": "persistencia y autocontrol."
        },
        {
         "numero": 63,
         "titulo": "Situaciones mixtas + estrategia",
         "objetivo": "resolver situaciones con superioridad en una zona e inferioridad en otra, y ensayar una jugada de laboratorio defensiva ante un córner de un rival superior en el juego aéreo.",
         "tecnicos": "todos los anteriores combinados.",
         "tacticos": "superioridad en una zona e inferioridad en otra simultáneamente; estrategia: jugada de laboratorio defensiva ante corner con rival de superioridad aérea.",
         "fisicos": "adaptación a la exigencia variable.",
         "coordinativos": "",
         "psicologicos": "calma ante la complejidad de la situación."
        }
       ]
      },
      {
       "numero": 22,
       "titulo": "Variantes del sistema táctico según el bloque rival",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 64,
         "titulo": "Ante bloque bajo rival",
         "objetivo": "atacar un bloque bajo con amplitud, paciencia y aprovechamiento de los espacios entre líneas.",
         "tecnicos": "pase corto, paciencia en la circulación, cambio de ritmo puntual.",
         "tacticos": "cómo atacar un bloque bajo — amplitud, paciencia, aprovechar espacios entre líneas.",
         "fisicos": "resistencia a la paciencia táctica (mantener la concentración sin acelerar de más).",
         "coordinativos": "",
         "psicologicos": "paciencia colectiva."
        },
        {
         "numero": 65,
         "titulo": "Ante bloque alto rival",
         "objetivo": "superar un bloque alto con juego directo y ataque al espacio a su espalda.",
         "tecnicos": "pase directo, control orientado tras recibir con espacio.",
         "tacticos": "cómo superar un bloque alto — juego directo, aprovechar el espacio a la espalda.",
         "fisicos": "velocidad en la progresión directa.",
         "coordinativos": "",
         "psicologicos": "valentía para jugar directo sin dudar."
        },
        {
         "numero": 66,
         "titulo": "Adaptación en tiempo real + estrategia",
         "objetivo": "reconocer en los primeros minutos qué bloque usa el rival y adaptar el plan, incluidas las variantes de saque de banda (corto si el rival presiona, largo si no).",
         "tecnicos": "todos los anteriores según lo que el rival presente.",
         "tacticos": "reconocer en los primeros minutos qué bloque usa el rival y adaptar el plan; estrategia: variantes de saque de banda según el bloque rival (corto si presiona, largo si no).",
         "fisicos": "adaptación general.",
         "coordinativos": "",
         "psicologicos": "flexibilidad mental y confianza en el plan B."
        }
       ]
      },
      {
       "numero": 23,
       "titulo": "Gestión del resultado (ganando / perdiendo / empatando)",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 67,
         "titulo": "Jugando con resultado a favor",
         "objetivo": "saber cuándo replegar más y cuándo seguir atacando sin renunciar a la idea de juego.",
         "tecnicos": "conservación, control orientado bajo presión psicológica del marcador.",
         "tacticos": "cuándo replegar más, cuándo seguir atacando sin renunciar a la idea.",
         "fisicos": "gestión de la intensidad sin bajar la guardia.",
         "coordinativos": "",
         "psicologicos": "serenidad, disciplina y evitar el exceso de confianza."
        },
        {
         "numero": 68,
         "titulo": "Jugando con resultado en contra",
         "objetivo": "buscar soluciones ofensivas sin desorganizar al equipo.",
         "tecnicos": "definición bajo presión, remate con precisión.",
         "tacticos": "buscar soluciones ofensivas sin desorganizar al equipo.",
         "fisicos": "capacidad de mantener intensidad bajo presión emocional.",
         "coordinativos": "",
         "psicologicos": "gestión de la frustración y persistencia."
        },
        {
         "numero": 69,
         "titulo": "Partido con marcador simulado + estrategia",
         "objetivo": "gestionar un partido con un marcador inicial impuesto y ensayar la estrategia de remontada a balón parado, con casi todo el equipo arriba.",
         "tecnicos": "libre, según la situación.",
         "tacticos": "partido real con marcador inicial impuesto; estrategia: estrategia ofensiva usada específicamente para remontar (corner con todos arriba salvo el último hombre).",
         "fisicos": "carga de competición real.",
         "coordinativos": "",
         "psicologicos": "gestión emocional completa ante el resultado."
        }
       ]
      },
      {
       "numero": 24,
       "titulo": "Gestión de los minutos finales",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 70,
         "titulo": "Cerrar un partido ganando",
         "objetivo": "cerrar el partido decidiendo dónde llevar el balón, hacia qué zonas y con qué ritmo en los últimos minutos.",
         "tecnicos": "conservación en espacios reducidos, control orientado bajo presión del reloj.",
         "tacticos": "dónde llevar el balón en los últimos minutos, hacia qué zonas, con qué ritmo.",
         "fisicos": "resistencia específica a la fatiga de los minutos finales.",
         "coordinativos": "",
         "psicologicos": "serenidad y disciplina hasta el final."
        },
        {
         "numero": 71,
         "titulo": "Buscar el empate o la victoria en los últimos minutos",
         "objetivo": "asumir riesgos calculados en los últimos minutos, incluida la subida del portero en jugadas puntuales.",
         "tecnicos": "centro, remate bajo presión de tiempo.",
         "tacticos": "asumir riesgos calculados, subir al portero en jugadas puntuales si corresponde.",
         "fisicos": "capacidad de esfuerzo máximo en fatiga avanzada.",
         "coordinativos": "",
         "psicologicos": "lucidez bajo presión de tiempo."
        },
        {
         "numero": 72,
         "titulo": "Simulación de final de partido + estrategia",
         "objetivo": "simular los últimos diez minutos con distintos marcadores y trabajar jugadas de laboratorio, ofensivas y defensivas, para el cierre del partido.",
         "tecnicos": "libre, según el guion de la simulación.",
         "tacticos": "últimos 10 minutos simulados con distintos marcadores; estrategia: jugadas de laboratorio específicas para los minutos finales, ofensivas y defensivas.",
         "fisicos": "fatiga acumulada simulada.",
         "coordinativos": "",
         "psicologicos": "gestión integral de la presión competitiva."
        }
       ]
      },
      {
       "numero": 25,
       "titulo": "Rivales que presionan alto vs. rivales que se repliegan",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 73,
         "titulo": "Salida ante presión alta rival",
         "objetivo": "superar la presión alta rival con combinaciones cortas o juego directo, según el espacio disponible.",
         "tecnicos": "control orientado bajo presión inmediata, pase al primer toque si hace falta.",
         "tacticos": "superar la presión alta rival con combinaciones cortas o con juego directo según el espacio.",
         "fisicos": "velocidad de reacción bajo presión inmediata.",
         "coordinativos": "",
         "psicologicos": "serenidad bajo presión alta rival."
        },
        {
         "numero": 74,
         "titulo": "Ataque ante rival replegado",
         "objetivo": "atacar a un rival replegado con paciencia, buscando los espacios entre líneas.",
         "tecnicos": "pase, paciencia técnica, cambio de ritmo puntual.",
         "tacticos": "paciencia y búsqueda de espacios entre líneas ante un bloque bajo rival.",
         "fisicos": "resistencia a la paciencia táctica.",
         "coordinativos": "",
         "psicologicos": "paciencia colectiva y confianza en la circulación."
        },
        {
         "numero": 75,
         "titulo": "Reconocer el tipo de rival en vivo + estrategia",
         "objetivo": "identificar en los primeros minutos qué tipo de rival se enfrenta y adaptar la estrategia a balón parado a ese perfil.",
         "tecnicos": "todos los anteriores según el escenario.",
         "tacticos": "identificar en los primeros minutos del partido qué tipo de rival se enfrenta; estrategia: adaptar la estrategia a balón parado según el tipo de rival (más directa ante rivales altos, más elaborada ante bloques bajos).",
         "fisicos": "adaptación general.",
         "coordinativos": "",
         "psicologicos": "flexibilidad y lectura del partido."
        }
       ]
      },
      {
       "numero": 26,
       "titulo": "Jugadas de laboratorio avanzadas",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 76,
         "titulo": "Diseño de jugadas ofensivas propias",
         "objetivo": "diseñar y ensayar jugadas de laboratorio ofensivas con varios movimientos coordinados.",
         "tecnicos": "ejecución de precisión en jugadas ensayadas complejas.",
         "tacticos": "jugadas de laboratorio ofensivas con varios movimientos coordinados.",
         "fisicos": "coordinación y sincronización como prioridad.",
         "coordinativos": "",
         "psicologicos": "memoria colectiva y confianza en la jugada ensayada."
        },
        {
         "numero": 77,
         "titulo": "Diseño de jugadas defensivas propias",
         "objetivo": "anticipar y neutralizar las posibles jugadas de laboratorio del rival.",
         "tecnicos": "ejecución coordinada en defensa de jugadas complejas rivales.",
         "tacticos": "anticipar y neutralizar posibles jugadas de laboratorio del rival.",
         "fisicos": "coordinación defensiva bajo presión.",
         "coordinativos": "",
         "psicologicos": "atención al detalle y comunicación."
        },
        {
         "numero": 78,
         "titulo": "Repertorio completo de estrategia + cierre de ciclo",
         "objetivo": "repasar todo el repertorio de córners, faltas y saques de banda, en ataque y en defensa, y cerrar el Ciclo Tipo 4.",
         "tecnicos": "todo el repertorio técnico de balón parado trabajado en la temporada.",
         "tacticos": "repaso integral de corners, faltas, saques de banda, ofensivos y defensivos, con variantes; cierre del Ciclo Tipo 4.",
         "fisicos": "carga moderada de repaso.",
         "coordinativos": "",
         "psicologicos": "confianza plena en el repertorio de estrategia del equipo."
        }
       ]
      }
     ],
     "id": "ciclo-4",
     "nombre": "Ciclo Tipo 4",
     "subtitulo": "Situaciones especiales de competición",
     "rango": "Semanas 21–26"
    },
    {
     "semanas": [
      {
       "numero": 27,
       "titulo": "Integración competitiva completa",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 79,
         "titulo": "Los 4 momentos en juego real",
         "objetivo": "comprobar en partido el equilibrio entre los cuatro momentos del juego, dando a cada uno la misma importancia.",
         "tecnicos": "libre, según la situación de juego.",
         "tacticos": "partido donde se valoran los 4 momentos del juego con igual importancia.",
         "fisicos": "carga de competición completa.",
         "coordinativos": "",
         "psicologicos": "confianza y disfrute de la competición."
        },
        {
         "numero": 80,
         "titulo": "Las 4 zonas y los 3 bloques en juego real",
         "objetivo": "observar la coherencia del equipo en las cuatro zonas y su capacidad de cambiar de bloque.",
         "tecnicos": "libre.",
         "tacticos": "partido donde se observa la coherencia del equipo en las 4 zonas y su capacidad de cambiar de bloque.",
         "fisicos": "carga de competición completa.",
         "coordinativos": "",
         "psicologicos": "lectura colectiva madura del partido."
        },
        {
         "numero": 81,
         "titulo": "Estrategia integrada en juego real",
         "objetivo": "aprovechar y defender con eficacia las acciones a balón parado que surgen en el juego real.",
         "tecnicos": "libre.",
         "tacticos": "partido con énfasis particular en aprovechar y defender acciones a balón parado reales.",
         "fisicos": "carga de competición completa.",
         "coordinativos": "",
         "psicologicos": "confianza integral en todo lo entrenado."
        }
       ]
      },
      {
       "numero": 28,
       "titulo": "Evaluación técnico-táctica situada por zona",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 82,
         "titulo": "Evaluación en Zona Inicial y Media-Cobertura",
         "objetivo": "valorar dónde decide bien y dónde no cada jugador en Zona Inicial y Zona Media-Cobertura.",
         "tecnicos": "observación de la calidad de salida de balón y construcción.",
         "tacticos": "dónde decide bien cada jugador, dónde no, en estas dos zonas.",
         "fisicos": "valoración cualitativa, sin convertir la sesión en pruebas agotadoras.",
         "coordinativos": "",
         "psicologicos": "aceptación constructiva de la corrección."
        },
        {
         "numero": 83,
         "titulo": "Evaluación en Zona Media-Creación y Final",
         "objetivo": "valorar dónde decide bien y dónde no cada jugador en Zona Media-Creación y Zona Final.",
         "tecnicos": "observación de la calidad de creación y definición.",
         "tacticos": "dónde decide bien cada jugador, dónde no, en estas dos zonas.",
         "fisicos": "valoración cualitativa en situaciones de alta exigencia.",
         "coordinativos": "",
         "psicologicos": "gestión emocional ante la evaluación en zonas decisivas."
        },
        {
         "numero": 84,
         "titulo": "Síntesis de la evaluación técnico-táctica",
         "objetivo": "trabajar de forma específica las carencias detectadas en las dos sesiones de evaluación anteriores.",
         "tecnicos": "repaso libre según lo detectado.",
         "tacticos": "trabajo específico sobre las carencias detectadas en las dos sesiones anteriores.",
         "fisicos": "carga moderada.",
         "coordinativos": "",
         "psicologicos": "motivación para el cierre de temporada."
        }
       ]
      },
      {
       "numero": 29,
       "titulo": "Evaluación física y psicológica en contexto competitivo",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 85,
         "titulo": "Evaluación física en contexto de juego",
         "objetivo": "valorar la condición física aplicada al juego y comprobar si los jugadores eligen bien el recurso técnico-táctico bajo fatiga.",
         "tecnicos": "desplazamiento, conducción y control bajo distintas exigencias físicas.",
         "tacticos": "elección del recurso técnico-táctico adecuado bajo fatiga.",
         "fisicos": "valoración cualitativa de velocidad, fuerza y resistencia aplicadas al juego.",
         "coordinativos": "",
         "psicologicos": "persistencia y actitud ante la exigencia física."
        },
        {
         "numero": 86,
         "titulo": "Evaluación psicológica y colectiva",
         "objetivo": "observar el liderazgo, la comunicación y la toma de decisiones compartida del grupo.",
         "tecnicos": "libre, según la situación.",
         "tacticos": "observación de liderazgo, comunicación y toma de decisiones compartida.",
         "fisicos": "carga moderada en contexto de juego.",
         "coordinativos": "",
         "psicologicos": "confianza, responsabilidad, solidaridad y competitividad sana."
        },
        {
         "numero": 87,
         "titulo": "Partido de evaluación integral + estrategia",
         "objetivo": "valorar en un partido el conjunto de lo trabajado en la temporada y hacer una última revisión del repertorio de balón parado.",
         "tecnicos": "libre.",
         "tacticos": "partido donde se valora el conjunto de lo trabajado en la temporada; estrategia: última revisión del repertorio completo antes del cierre.",
         "fisicos": "carga de competición completa.",
         "coordinativos": "",
         "psicologicos": "satisfacción por el recorrido de la temporada."
        }
       ]
      },
      {
       "numero": 30,
       "titulo": "Consolidación, refuerzo individual y proyección",
       "objetivoSemanal": "",
       "sesiones": [
        {
         "numero": 88,
         "titulo": "Refuerzo de carencias individuales",
         "objetivo": "reforzar las carencias individuales detectadas en la evaluación y repasar los principios colectivos que aún no se aplican con continuidad.",
         "tecnicos": "repaso específico según las necesidades detectadas en la evaluación.",
         "tacticos": "repaso de los principios colectivos que aún no se aplican con continuidad.",
         "fisicos": "movilidad y flexibilidad adaptadas, carga global moderada.",
         "coordinativos": "",
         "psicologicos": "motivación y objetivos individuales de mejora."
        },
        {
         "numero": 89,
         "titulo": "Consolidación colectiva",
         "objetivo": "consolidar en conjunto los cuatro momentos del juego, las cuatro zonas y los tres bloques defensivos.",
         "tecnicos": "repaso libre de todo lo trabajado.",
         "tacticos": "repaso de los 4 momentos, las 4 zonas y los 3 bloques defensivos en conjunto.",
         "fisicos": "carga global moderada.",
         "coordinativos": "",
         "psicologicos": "valoración del esfuerzo colectivo de la temporada."
        },
        {
         "numero": 90,
         "titulo": "Cierre de temporada y proyección",
         "objetivo": "cerrar la temporada con un partido sin condicionantes tácticos impuestos y proyectar el trabajo de la siguiente.",
         "tecnicos": "libre, elegido por los propios jugadores.",
         "tacticos": "partido de cierre sin condicionantes tácticos impuestos.",
         "fisicos": "carga ligera, de celebración más que de exigencia.",
         "coordinativos": "",
         "psicologicos": "respeto, motivación y proyección hacia la siguiente temporada."
        }
       ]
      }
     ],
     "id": "ciclo-5",
     "nombre": "Ciclo Tipo 5",
     "subtitulo": "Integración y cierre",
     "rango": "Semanas 27–30"
    }
   ]
  }
 ]
};
