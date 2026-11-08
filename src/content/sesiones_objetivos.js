// 50 sesiones por objetivos tácticos, agrupadas en 10 bloques. SOLO se importa desde el servidor.
export const BLOQUES_OBJETIVOS = [
 {
  "n": 1,
  "nombre": "Salida y construcción del juego",
  "intro": "Una salida clara y limpia evita regalar el balón cerca de la propia portería. Este bloque entrena la salida hasta el medio campo: el portero y las líneas ofrecen ángulos, los jugadores se desmarcan, generan espacios para recibir y se muestran con perfil abierto, de modo que el equipo supere la primera presión con pases seguros. Al cruzar el medio campo, el trabajo pasa a la progresión.",
  "desde": 1,
  "hasta": 5
 },
 {
  "n": 2,
  "nombre": "Amplitud, profundidad y progresión ofensiva",
  "intro": "Superada la salida, el equipo necesita avanzar con orden. Se trabaja ocupar los carriles y las alturas del campo para estirar al rival, progresar por dentro o por fuera con pases entre líneas y llegar a la zona de creación con ventaja de posición y superioridad.",
  "desde": 6,
  "hasta": 10
 },
 {
  "n": 3,
  "nombre": "Conservación, posesión y circulación del balón",
  "intro": "Tener el balón es la primera forma de defender y de marcar el ritmo del partido. Estas sesiones enseñan a cuidar el balón, pasar con intención, perfilarse y mover la circulación hasta que aparezca el espacio libre, con apoyos a distintas alturas y a las distancias adecuadas.",
  "desde": 11,
  "hasta": 15
 },
 {
  "n": 4,
  "nombre": "Creación de espacios, apoyos y desmarques",
  "intro": "El espacio no se encuentra: se crea. Se entrena el movimiento coordinado sin balón, con apoyos cercanos, desmarques de apoyo y de ruptura, fijaciones, paredes y tercer hombre, para liberar a quien juega y superar las líneas del rival.",
  "desde": 16,
  "hasta": 21
 },
 {
  "n": 5,
  "nombre": "Ataque por bandas y finalización",
  "intro": "Las bandas permiten ampliar el campo y llegar al área con tiempo. El bloque entrena la combinación y el desdoblamiento por fuera, el pase centro y la ocupación del área, y cada trabajo termina en una finalización clara, de primeras y sin controlar.",
  "desde": 22,
  "hasta": 27
 },
 {
  "n": 6,
  "nombre": "Organización y equilibrio defensivo",
  "intro": "Defender bien empieza por estar ordenados. Se entrena la estructura del bloque defensivo: distancias entre líneas, coberturas, basculaciones y marcajes, para cerrar los espacios importantes, proteger el centro y defender el área.",
  "desde": 28,
  "hasta": 32
 },
 {
  "n": 7,
  "nombre": "Presión, recuperación y reorganización defensiva",
  "intro": "Recuperar el balón pronto y de forma colectiva. Se trabaja cuándo y cómo presionar, orientar al rival hacia donde conviene, cerrar líneas de pase y reorganizar el bloque después de la presión, sin dejar espacios entre líneas.",
  "desde": 33,
  "hasta": 36
 },
 {
  "n": 8,
  "nombre": "Transiciones ofensivas y verticalidad",
  "intro": "El instante posterior a recuperar el balón es una oportunidad, porque el rival está desorganizado. Se entrena decidir rápido y atacar hacia delante: pase vertical, ruptura, ocupación de espacios libres y finalización en pocos segundos, sabiendo también cuándo conviene conservar.",
  "desde": 37,
  "hasta": 41
 },
 {
  "n": 9,
  "nombre": "Transiciones defensivas y reacción tras pérdida",
  "intro": "Tras perder el balón, los primeros segundos lo deciden todo. Se entrena la reacción inmediata, la presión tras pérdida, el repliegue en cobertura y la reorganización hacia la línea del balón para impedir que el rival aproveche el desorden.",
  "desde": 42,
  "hasta": 44
 },
 {
  "n": 10,
  "nombre": "Estrategia, control del juego y aplicación del modelo",
  "intro": "Aquí se une todo: acciones de balón parado ofensivas y defensivas con roles y señales, gestión del ritmo y del marcador, y aplicación del modelo de juego en situaciones reales de partido.",
  "desde": 45,
  "hasta": 50
 }
];
export const SESIONES_OBJETIVOS = [
 {
  "n": 1,
  "bloque": 1,
  "titulo": "Salida de balón desde la primera línea ante presión alta",
  "objetivo": "Organizar y practicar la salida de balón desde la primera línea ante presión alta del rival, hasta llegar al medio campo: apoyos a distinta altura, perfil corporal y líneas de pase para superar la presión con pases cortos o el cambio de lado.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente y velocidad de reacción",
   "tecnicos": "Pase corto con ambas piernas y control orientado bajo presión",
   "tacticos": "Salida de balón desde la primera línea ante presión alta",
   "estrategicos": "Saque de puerta corto",
   "psicologicos": "Serenidad y confianza para jugar bajo presión"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "RUE-02"
  },
  "A": "POS-02",
  "B": "TB-07",
  "C": null,
  "partido": "PAR-04",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) El apoyo debe aparecer a distinta altura del balón. 2) Atraer la presión hacia un lado y soltar al lado libre. 3) El portero inicia la construcción.",
  "correcciones": [
   "Amplitud: laterales abiertos para abrir el campo.",
   "Perfílate antes de recibir: mira la presión y decide.",
   "El portero se ofrece con ángulo y juega a uno o dos toques.",
   "Escanea la zona antes de recibir y busca el espacio libre.",
   "Atrae la presión y suelta el balón al lado libre."
  ],
  "adaptacion": "En fútbol 8 se juega 5v2 y 7v4; la categoría condiciona el tamaño del espacio y los toques máximos."
 },
 {
  "n": 2,
  "bloque": 1,
  "titulo": "Construcción del juego desde el portero y los centrales",
  "objetivo": "Enseñar y organizar la construcción del juego desde el portero y los centrales hasta el medio campo: abrir ángulos, atraer la presión del rival y encontrar a quien está libre para iniciar las jugadas con orden desde atrás.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase corto y control orientado con ambas piernas",
   "tacticos": "Construcción del juego desde el portero y los centrales",
   "estrategicos": "Saque de puerta con central abierto",
   "psicologicos": "Paciencia y confianza para no precipitarse"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "CAL-03"
  },
  "A": "ESP-03",
  "B": "TAC-21",
  "C": null,
  "partido": "TAC-28",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Formar triángulos y un rombo de salida. 2) Los centrales se abren y el mediocentro ofrece una opción por delante. 3) El portero participa en la construcción.",
  "correcciones": [
   "Escanea la zona antes de recibir y busca el espacio libre.",
   "Atrae la presión y suelta el balón al lado libre.",
   "Apoyos a distinta altura: nadie en la misma línea del balón.",
   "Si no hay línea de pase, ofrécete a otra altura.",
   "Los mediocentros se ofrecen de cara, entre líneas."
  ],
  "adaptacion": "Reducir el espacio a 30x25 m en categorías pequeñas y utilizar 5v2."
 },
 {
  "n": 3,
  "bloque": 1,
  "titulo": "Salida de balón mediante apoyos interiores y exteriores",
  "objetivo": "Practicar la salida de balón hasta el medio campo con apoyos interiores y exteriores: ofrecer líneas de pase a distintas alturas, combinar con los mediocentros y llegar al lateral con el rival desorganizado.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pared, pase en diagonal y pase centro raso",
   "tacticos": "Salida de balón mediante apoyos interiores y exteriores",
   "estrategicos": "Saque de banda corto con apoyo interior",
   "psicologicos": "Compañerismo y comunicación constante"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "LUD-01"
  },
  "A": "POS-01",
  "B": "TAC-27",
  "C": null,
  "partido": "REA-03",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Apoyo interior a la altura del pivote para recibir entre líneas. 2) Lateral y extremo para abrir al rival. 3) Si se cierra el espacio, devolver el balón al interior.",
  "correcciones": [
   "Si no hay línea de pase, ofrécete a otra altura.",
   "Los mediocentros se ofrecen de cara, entre líneas.",
   "Después de pasar, muévete: desmarques continuos.",
   "Control orientado hacia el espacio, no hacia el rival.",
   "Tranquilidad: pausa si llega la presión, salida si aparece el espacio."
  ],
  "adaptacion": "En fútbol 8 se reduce el campo y el número de jugadores en cada zona."
 },
 {
  "n": 4,
  "bloque": 1,
  "titulo": "Superación de la primera línea de presión rival",
  "objetivo": "Entrenar la superación de la primera línea de presión rival hasta el medio campo mediante el pase entre líneas, el tercer hombre y el juego por fuera, manteniendo distancias cortas y superioridad numérica en cada zona.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y agilidad",
   "tecnicos": "Pase raso entre defensores, conducción con la cabeza alta",
   "tacticos": "Superación de la primera línea de presión rival",
   "estrategicos": "Saque de puerta largo con segunda jugada",
   "psicologicos": "Valentía para arriesgar el pase entre líneas"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "LUD-02"
  },
  "A": "TAC-11",
  "B": "TB-07",
  "C": null,
  "partido": "TB-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) El pase entre líneas se activa cuando el defensor se compromete con el poseedor del balón. 2) Quien conduce debe tener apoyos cerca. 3) Pasar por fuera también supera la línea.",
  "correcciones": [
   "Control orientado hacia el espacio, no hacia el rival.",
   "Tranquilidad: pausa si llega la presión, salida si aparece el espacio.",
   "Comunica: avisa de quién viene a presionar.",
   "Al cruzar esta zona, uno o dos toques como máximo.",
   "Busca siempre a quien está libre, no a quien está marcado."
  ],
  "adaptacion": "Reducir la zona a 8 m en categorías pequeñas."
 },
 {
  "n": 5,
  "bloque": 1,
  "titulo": "Conexión entre portero, defensa y centro del campo en la construcción del juego",
  "objetivo": "Organizar y practicar la construcción del juego hasta el medio campo conectando portero, defensa y centro del campo: salida desde el portero, apoyos de los mediocentros y progresión ordenada entre líneas.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase a media distancia y control orientado bajo presión",
   "tacticos": "Conexión entre portero, defensa y centro del campo en la construcción del juego",
   "estrategicos": "Saque de puerta con portero apoyando",
   "psicologicos": "Cohesión y comunicación entre líneas"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "LUD-03"
  },
  "A": "TAC-24",
  "B": "TAC-21",
  "C": null,
  "partido": "REA-05",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Distancia entre líneas de 15-20 m. 2) El portero se ofrece con ángulo. 3) Los mediocentros se ofrecen de cara.",
  "correcciones": [
   "Los mediocentros se ofrecen de cara, entre líneas.",
   "Después de pasar, muévete: desmarques continuos.",
   "Control orientado hacia el espacio, no hacia el rival.",
   "Tranquilidad: pausa si llega la presión, salida si aparece el espacio.",
   "Comunica: avisa de quién viene a presionar."
  ],
  "adaptacion": "En fútbol 8 se trabaja con portero y tres líneas reducidas."
 },
 {
  "n": 6,
  "bloque": 2,
  "titulo": "Progresión del balón desde la zona de inicio hasta la zona de creación",
  "objetivo": "Organizar la progresión del balón desde la zona de inicio hasta la zona de creación: conquistar zonas con superioridad numérica, pasar a quien está libre y encontrar el espacio débil del rival.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase en progresión y control orientado",
   "tacticos": "Progresión del balón desde la zona de inicio hasta la zona de creación",
   "estrategicos": "Saque de puerta por zonas",
   "psicologicos": "Concentración sostenida durante toda la secuencia"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "RUE-01"
  },
  "A": "POS-05",
  "B": "TB-11",
  "C": null,
  "partido": "PAR-02",
  "definicion": "DEF-04",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Ocupar las tres zonas con orden. 2) Preparar con apoyos antes de pasar de zona. 3) Acelerar solo cuando hay espacio.",
  "correcciones": [
   "Al cruzar esta zona, uno o dos toques como máximo.",
   "Busca siempre a quien está libre, no a quien está marcado.",
   "Amplitud: laterales abiertos para abrir el campo.",
   "Perfílate antes de recibir: mira la presión y decide.",
   "El portero se ofrece con ángulo y juega a uno o dos toques."
  ],
  "adaptacion": "En fútbol 8 se divide el campo en dos zonas."
 },
 {
  "n": 7,
  "bloque": 2,
  "titulo": "Cambio de orientación para superar el bloque defensivo rival",
  "objetivo": "Practicar el cambio de orientación para superar el bloque defensivo rival: atraer por un lado, jugar al lado contrario y atacar el espacio débil con amplitud y profundidad.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase largo raso e interior con ambas piernas",
   "tacticos": "Cambio de orientación para superar el bloque defensivo rival",
   "estrategicos": "Córner con cambio de lado",
   "psicologicos": "Paciencia hasta encontrar el momento del cambio"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "RUE-03"
  },
  "A": "TEC-09",
  "B": "TAC-20",
  "C": null,
  "partido": "PAR-03",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Atraer antes de cambiar. 2) El lado débil debe estar ocupado. 3) El pase de cambio es rápido y preciso.",
  "correcciones": [
   "Ofrece una línea de pase en cada acción: ángulo y distancia.",
   "Distancias cortas entre jugadores, de 10 a 15 metros.",
   "Pasa y muévete: el tercer hombre aparece libre.",
   "Cambia de orientación cuando el lado se cierre.",
   "Tres en el área: primer palo, penalti y segundo palo."
  ],
  "adaptacion": "Reducir el campo y usar zonas laterales más grandes en categorías menores."
 },
 {
  "n": 8,
  "bloque": 2,
  "titulo": "Ataque posicional mediante amplitud y profundidad",
  "objetivo": "Organizar el ataque posicional mediante amplitud y profundidad: ocupar los carriles, fijar al rival y progresar con desmarques de ruptura y pases al espacio.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase en diagonal y pase centro raso",
   "tacticos": "Ataque posicional mediante amplitud y profundidad",
   "estrategicos": "Saque de banda ofensivo largo",
   "psicologicos": "Disciplina táctica y respeto de los espacios"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "LUD-04"
  },
  "A": "ESP-01",
  "B": "TAC-25",
  "C": null,
  "partido": "PAR-01",
  "definicion": "DEF-04",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Ocupar bandas y fondo con orden. 2) Perfilarse para jugar hacia delante. 3) Atacar el espacio a la espalda.",
  "correcciones": [
   "Cambia de orientación cuando el lado se cierre.",
   "Control orientado: prepara el siguiente pase con el primer toque.",
   "Amplitud y profundidad: ocupa tu carril y no lo abandones.",
   "Sal de la sombra del rival: aparece en su campo de visión.",
   "Progresa solo si el pase es seguro; si no, conserva."
  ],
  "adaptacion": "En fútbol 8 se trabaja con tres carriles y un jugador en profundidad."
 },
 {
  "n": 9,
  "bloque": 2,
  "titulo": "Progresión ofensiva mediante juego interior y exterior",
  "objetivo": "Entrenar la progresión ofensiva combinando el juego interior y el exterior: atraer por dentro, progresar por fuera y llegar a la zona de creación con superioridad numérica.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase interior y exterior con ambas piernas",
   "tacticos": "Progresión ofensiva mediante juego interior y exterior",
   "estrategicos": "Falta lateral con pase centro",
   "psicologicos": "Toma de decisiones rápida"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "RUE-04"
  },
  "A": "ESP-02",
  "B": "TB-08",
  "C": null,
  "partido": "PAR-05",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) El juego exterior atrae. 2) El interior progresa. 3) Cambiar de zona mantiene al rival en desequilibrio.",
  "correcciones": [
   "Sal de la sombra del rival: aparece en su campo de visión.",
   "Progresa solo si el pase es seguro; si no, conserva.",
   "Mira por encima del hombro antes de recibir.",
   "Juego interior para atraer, juego exterior para progresar.",
   "Paciencia: el espacio débil aparece si mueves el balón."
  ],
  "adaptacion": "Reducir las zonas a dos para jugadores más jóvenes."
 },
 {
  "n": 10,
  "bloque": 2,
  "titulo": "Generación de superioridades numéricas en los carriles exteriores",
  "objetivo": "Practicar la generación de superioridades numéricas en los carriles exteriores: lateral, extremo y mediocentro combinan para superar al rival por fuera.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Pase en diagonal y pared con ambas piernas",
   "tacticos": "Generación de superioridades numéricas en los carriles exteriores",
   "estrategicos": "Córner corto por banda",
   "psicologicos": "Valentía y compromiso en el uno contra uno"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "RUE-01"
  },
  "A": "TB-05",
  "B": "TB-11",
  "C": null,
  "partido": "REA-01",
  "definicion": "DEF-04",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Fijar para liberar. 2) El interior da la tercera opción. 3) Decidir rápido entre regate, pase corto o pase centro.",
  "correcciones": [
   "En el área no se controla: define de primeras.",
   "Tres en el área: primer palo, penalti y segundo palo.",
   "El lateral llega alto y deja equilibrio por si se pierde.",
   "Pared con el extremo y pase al espacio.",
   "Cuando sale el centro, el rematador ataca el balón."
  ],
  "adaptacion": "En categorías menores, 2v1 y 3v2 en espacios más cortos."
 },
 {
  "n": 11,
  "bloque": 3,
  "titulo": "Circulación del balón para atraer y superar la presión rival",
  "objetivo": "Entrenar la circulación del balón para atraer la presión rival y superarla: mover el balón con apoyos y distancias correctas hasta encontrar el espacio libre por el lado contrario.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase corto y cambio de orientación con ambas piernas",
   "tacticos": "Circulación del balón para atraer y superar la presión rival",
   "estrategicos": "Saque de banda defensivo para iniciar el ataque",
   "psicologicos": "Paciencia y comunicación constante"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "RUE-03"
  },
  "A": "TB-03",
  "B": "TB-08",
  "C": null,
  "partido": "REA-02",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Atraer a un lado para atacar el otro. 2) Cambiar de orientación con velocidad y precisión. 3) El lado débil debe estar ocupado antes del cambio.",
  "correcciones": [
   "Atrae la presión y suelta el balón al lado libre.",
   "Apoyos a distinta altura: nadie en la misma línea del balón.",
   "Si no hay línea de pase, ofrécete a otra altura.",
   "Los mediocentros se ofrecen de cara, entre líneas.",
   "Después de pasar, muévete: desmarques continuos."
  ],
  "adaptacion": "Reducir el espacio en categorías pequeñas."
 },
 {
  "n": 12,
  "bloque": 3,
  "titulo": "Conservación del balón para progresar en el juego ofensivo",
  "objetivo": "Practicar la conservación del balón para progresar en el juego ofensivo: pase seguro, control orientado y movimientos de apoyo que permitan avanzar sin perder la posesión.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase corto y control orientado en espacio reducido",
   "tacticos": "Conservación del balón para progresar en el juego ofensivo",
   "estrategicos": "Córner ofensivo corto para mantener la posesión",
   "psicologicos": "Paciencia y control de la ansiedad por progresar"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "RUE-02"
  },
  "A": "TB-04",
  "B": "TB-07",
  "C": null,
  "partido": "TB-13",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Conservar para provocar errores del rival. 2) Apoyos detrás del balón. 3) Progresar cuando el defensor se descoloca.",
  "correcciones": [
   "Cuenta los pases: la posesión también es defender.",
   "Ofrece una línea de pase en cada acción: ángulo y distancia.",
   "Distancias cortas entre jugadores, de 10 a 15 metros.",
   "Pasa y muévete: el tercer hombre aparece libre.",
   "Amplitud y profundidad: ocupa tu carril y no lo abandones."
  ],
  "adaptacion": "Reducir el espacio y el número de jugadores según la categoría."
 },
 {
  "n": 13,
  "bloque": 3,
  "titulo": "Creación de líneas de pase y apoyos para mantener la posesión",
  "objetivo": "Entrenar la creación de líneas de pase y apoyos para mantener la posesión: ángulos y distancias correctas, desmarques de apoyo y continuidad del juego después de cada pase.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase a un toque y control orientado",
   "tacticos": "Creación de líneas de pase y apoyos para mantener la posesión",
   "estrategicos": "Falta lateral ofensiva corta",
   "psicologicos": "Concentración y comunicación de los apoyos"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "CAL-03"
  },
  "A": "ESP-04",
  "B": "TB-08",
  "C": null,
  "partido": "PAR-01",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Al menos tres opciones de pase para el poseedor del balón. 2) Apoyos a tres alturas. 3) Movimiento antes de recibir.",
  "correcciones": [
   "Pasa y muévete: el tercer hombre aparece libre.",
   "Cambia de orientación cuando el lado se cierre.",
   "Control orientado: prepara el siguiente pase con el primer toque.",
   "Amplitud y profundidad: ocupa tu carril y no lo abandones.",
   "Sal de la sombra del rival: aparece en su campo de visión."
  ],
  "adaptacion": "Reducir los comodines o subir la exigencia de toques según el nivel."
 },
 {
  "n": 14,
  "bloque": 3,
  "titulo": "Conservación del balón ante presión organizada",
  "objetivo": "Practicar la conservación del balón ante presión organizada: perfil, pase a un toque y salida de la presión hacia quien está libre, manteniendo la superioridad numérica.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase corto y control orientado bajo presión",
   "tacticos": "Conservación del balón ante presión organizada",
   "estrategicos": "Saque de banda corto con apoyo",
   "psicologicos": "Paciencia y tolerancia a la presión"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "LUD-01"
  },
  "A": "TB-01",
  "B": "TAC-21",
  "C": null,
  "partido": "PAR-04",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Apoyos a distinta altura. 2) Orientar el cuerpo antes de recibir. 3) Calma del poseedor del balón.",
  "correcciones": [
   "Mira por encima del hombro antes de recibir.",
   "Juego interior para atraer, juego exterior para progresar.",
   "Paciencia: el espacio débil aparece si mueves el balón.",
   "Un toque para soltar, dos para controlar y orientar.",
   "Tras un pase atrás, ofrece de nuevo una opción hacia delante."
  ],
  "adaptacion": "Reducir el espacio y el número de toques en las categorías menores."
 },
 {
  "n": 15,
  "bloque": 3,
  "titulo": "Circulación del balón para generar espacios y ventajas",
  "objetivo": "Entrenar la circulación del balón para generar espacios y ventajas: mover al rival con pases rápidos, cambios de orientación y desmarques que abran líneas de pase.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase corto y cambio de ritmo con ambas piernas",
   "tacticos": "Circulación del balón para generar espacios y ventajas",
   "estrategicos": "Falta lateral corta",
   "psicologicos": "Comunicación y lectura de los espacios libres"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "LUD-02"
  },
  "A": "TB-02",
  "B": "TB-08",
  "C": null,
  "partido": "REA-02",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Circular rápido y con propósito. 2) Buscar siempre al jugador libre. 3) Cambiar de ritmo al recibir.",
  "correcciones": [
   "Un toque para soltar, dos para controlar y orientar.",
   "Tras un pase atrás, ofrece de nuevo una opción hacia delante.",
   "Cuenta los pases: la posesión también es defender.",
   "Ofrece una línea de pase en cada acción: ángulo y distancia.",
   "Distancias cortas entre jugadores, de 10 a 15 metros."
  ],
  "adaptacion": "En fútbol 8 se juega con 6v4 y menos zonas."
 },
 {
  "n": 16,
  "bloque": 4,
  "titulo": "Progresión ofensiva mediante apoyos, desmarques y tercer hombre",
  "objetivo": "Organizar la progresión ofensiva mediante apoyos, desmarques y tercer hombre: pase, movimiento y combinación para superar líneas con el rival en inferioridad.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pared y pase al espacio con ambas piernas",
   "tacticos": "Progresión ofensiva mediante apoyos, desmarques y tercer hombre",
   "estrategicos": "Córner corto con apoyo",
   "psicologicos": "Confianza en el equipo y compromiso en la ruptura"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "LUD-03"
  },
  "A": "TB-10",
  "B": "TAC-20",
  "C": null,
  "partido": "PAR-03",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) El apoyo juega de primeras y de cara. 2) La ruptura nace del toque, no antes. 3) El pase al espacio llega con ventaja.",
  "correcciones": [
   "Amplitud y profundidad: ocupa tu carril y no lo abandones.",
   "Sal de la sombra del rival: aparece en su campo de visión.",
   "Progresa solo si el pase es seguro; si no, conserva.",
   "Mira por encima del hombro antes de recibir.",
   "Juego interior para atraer, juego exterior para progresar."
  ],
  "adaptacion": "En categorías pequeñas se reduce a 2v1 y 3v2 con espacios más cortos."
 },
 {
  "n": 17,
  "bloque": 4,
  "titulo": "Coordinación de apoyos y desmarques para superar líneas rivales",
  "objetivo": "Organizar la coordinación de apoyos y desmarques para superar líneas rivales: apoyos cercanos, tercer hombre y pases entre líneas con el bloque compacto.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Pase corto y control orientado",
   "tacticos": "Coordinación de apoyos y desmarques para superar líneas rivales",
   "estrategicos": "Saque de banda con superación de línea",
   "psicologicos": "Comunicación y confianza entre jugadores"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "LUD-04"
  },
  "A": "POS-06",
  "B": "TAC-25",
  "C": null,
  "partido": "PAR-05",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Alternar apoyo y desmarque. 2) Pasar a un jugador en movimiento. 3) Perfilar el cuerpo antes de recibir.",
  "correcciones": [
   "Defensa y mediocampo conectados: de 15 a 20 metros entre líneas.",
   "Tercer hombre: pasa, muévete y ofrece la pared.",
   "Pared diagonal y ruptura: llega por la espalda.",
   "Extremos abiertos y laterales altos acompañando.",
   "Desdoblamiento interno: ocupa el carril que deja libre quien sale."
  ],
  "adaptacion": "En categorías menores, dos líneas en lugar de tres."
 },
 {
  "n": 18,
  "bloque": 4,
  "titulo": "Sincronización de rupturas y pases en profundidad",
  "objetivo": "Entrenar la sincronización de rupturas y pases en profundidad: el desmarque sale cuando el poseedor tiene el balón perfilado y el pase llega al espacio libre.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pase en profundidad y control orientado",
   "tacticos": "Sincronización de rupturas y pases en profundidad",
   "estrategicos": "Falta frontal con ruptura",
   "psicologicos": "Atención y compromiso en la ruptura"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "RUE-04"
  },
  "A": "POS-03",
  "B": "TAC-27",
  "C": null,
  "partido": "REA-01",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Ruptura desde detrás del balón. 2) Pase con ventaja. 3) Evitar el fuera de juego.",
  "correcciones": [
   "Extremos abiertos y laterales altos acompañando.",
   "Desdoblamiento interno: ocupa el carril que deja libre quien sale.",
   "Cambia de lugar con quien te acompaña: la permuta confunde a quien marca.",
   "Pase entre líneas y apoyo cercano.",
   "Fija al defensor para liberar a quien recibe."
  ],
  "adaptacion": "En categorías menores, línea de fuera de juego más amplia."
 },
 {
  "n": 19,
  "bloque": 4,
  "titulo": "Creación de espacios mediante fijaciones y movimientos coordinados",
  "objetivo": "Practicar la creación de espacios mediante fijaciones y movimientos coordinados: fijar al defensor, liberar a quien recibe y atacar el espacio que deja.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Pase corto y conducción con ambas piernas",
   "tacticos": "Creación de espacios mediante fijaciones y movimientos coordinados",
   "estrategicos": "Córner con fijación en el primer palo",
   "psicologicos": "Confianza en quien recibe el espacio"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "RUE-01"
  },
  "A": "POS-04",
  "B": "FIJ-05",
  "C": null,
  "partido": "REA-03",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Fijar con pocos jugadores. 2) Liberar a otros. 3) Pasar tras la fijación.",
  "correcciones": [
   "Pase entre líneas y apoyo cercano.",
   "Fija al defensor para liberar a quien recibe.",
   "Perfil abierto: recibe y juega hacia delante.",
   "Sincroniza: el desmarque sale cuando el balón está en los pies de quien pasa.",
   "Saque de banda: al espacio libre, no al jugador marcado."
  ],
  "adaptacion": "En categorías menores, 2v2 con comodín."
 },
 {
  "n": 20,
  "bloque": 4,
  "titulo": "Combinaciones ofensivas mediante paredes y tercer hombre",
  "objetivo": "Entrenar las combinaciones ofensivas mediante paredes y tercer hombre: pase, desmarque de apoyo y ruptura para superar líneas con pocos toques.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Pared, control orientado y pase al espacio",
   "tacticos": "Combinaciones ofensivas mediante paredes y tercer hombre",
   "estrategicos": "Falta lateral con pared",
   "psicologicos": "Atención y velocidad de decisión"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "RUE-03"
  },
  "A": "TB-03",
  "B": "TAC-20",
  "C": null,
  "partido": "TB-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Pared de primeras. 2) Desmarque inmediato. 3) Cambio de ritmo tras la pared.",
  "correcciones": [
   "Sincroniza: el desmarque sale cuando el balón está en los pies de quien pasa.",
   "Pase en profundidad solo si quien llega va libre.",
   "Escanea: ¿quién está solo y dónde está el espacio?",
   "Líneas cortas, pero juega rápido por dentro.",
   "Amplitud y profundidad: ocupa tu carril y no lo abandones."
  ],
  "adaptacion": "En categorías menores, solo paredes simples."
 },
 {
  "n": 21,
  "bloque": 4,
  "titulo": "Desdoblamientos, permutas y ocupación racional de espacios",
  "objetivo": "Practicar desdoblamientos, permutas y ocupación racional de espacios: cambios de posición coordinados que desorganizan al rival y mantienen el equilibrio.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Pase en diagonal y conducción",
   "tacticos": "Desdoblamientos, permutas y ocupación racional de espacios",
   "estrategicos": "Saque de banda con permuta",
   "psicologicos": "Compañerismo y comunicación en los cambios de posición"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "RUE-02"
  },
  "A": "TB-04",
  "B": "TAC-25",
  "C": null,
  "partido": "REA-05",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Ocupar el espacio que deja quien sale. 2) Comunicar la permuta. 3) Mantener los cinco carriles.",
  "correcciones": [
   "Líneas cortas, pero juega rápido por dentro.",
   "Defensa y mediocampo conectados: de 15 a 20 metros entre líneas.",
   "Tercer hombre: pasa, muévete y ofrece la pared.",
   "Pared diagonal y ruptura: llega por la espalda.",
   "Extremos abiertos y laterales altos acompañando."
  ],
  "adaptacion": "En categorías menores, permutas solo entre dos jugadores."
 },
 {
  "n": 22,
  "bloque": 5,
  "titulo": "Organización colectiva del ataque por bandas",
  "objetivo": "Organizar el ataque por bandas: superioridad numérica de lateral y extremo, combinaciones y desdoblamientos que terminen en un pase centro con el área ocupada.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Pase en diagonal y pase centro",
   "tacticos": "Organización colectiva del ataque por bandas",
   "estrategicos": "Saque de banda en ataque",
   "psicologicos": "Compañerismo y coordinación de movimientos"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "CAL-03"
  },
  "A": "TB-10",
  "B": "TB-11",
  "C": null,
  "partido": "PAR-02",
  "definicion": "DEF-01",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Ocupar carriles exterior, interior y central. 2) Lateral y extremo coordinados. 3) Llegar con tres rematadores.",
  "correcciones": [
   "Desdobla por fuera y llega al segundo palo.",
   "Pase centro rasante y fuerte: busca el primer palo o el penalti.",
   "Llega al área en el momento justo: timing, ni antes ni después.",
   "En el área no se controla: define de primeras.",
   "Tres en el área: primer palo, penalti y segundo palo."
  ],
  "adaptacion": "En fútbol 8 se ataca con lateral, extremo y delantero."
 },
 {
  "n": 23,
  "bloque": 5,
  "titulo": "Desdoblamientos y combinaciones ofensivas por banda",
  "objetivo": "Entrenar desdoblamientos y combinaciones ofensivas por banda: paredes, dobles y llegada por detrás de quien combina para finalizar con un pase centro.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Pase y pared en banda",
   "tacticos": "Desdoblamientos y combinaciones ofensivas por banda",
   "estrategicos": "Falta lateral con desdoblamiento",
   "psicologicos": "Coordinación y confianza en el equipo"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "LUD-01"
  },
  "A": "TEC-09",
  "B": "TAC-27",
  "C": null,
  "partido": "TAC-28",
  "definicion": "DEF-03",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) El extremo fija. 2) El lateral se desdobla por fuera. 3) Combinar antes de dar el pase centro.",
  "correcciones": [
   "Pared con el extremo y pase al espacio.",
   "Cuando sale el centro, el rematador ataca el balón.",
   "Si no hay centro, pase atrás al jugador que llega.",
   "Remata de primeras: de pie, de rodilla o de cabeza.",
   "Mira al portero y elige: palo corto o palo largo."
  ],
  "adaptacion": "En fútbol 8 se trabaja con lateral y extremo en banda reducida."
 },
 {
  "n": 24,
  "bloque": 5,
  "titulo": "Ataque por banda y ocupación coordinada del área",
  "objetivo": "Organizar el ataque por banda y la ocupación coordinada del área: primer palo, penalti y segundo palo, con el timing de llegada y la vigilancia ante la pérdida.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Pase centro raso y remate de primeras",
   "tacticos": "Ataque por banda y ocupación coordinada del área",
   "estrategicos": "Córner ofensivo con ocupación",
   "psicologicos": "Concentración y valentía en el área"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "LUD-02"
  },
  "A": "ESP-01",
  "B": "FIJ-01",
  "C": null,
  "partido": "TB-13",
  "definicion": "DEF-05",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Ocupar primer palo, segundo palo y llegada. 2) Carreras sincronizadas. 3) Pase centro al espacio libre.",
  "correcciones": [
   "Remata de primeras: de pie, de rodilla o de cabeza.",
   "Mira al portero y elige: palo corto o palo largo.",
   "Vigilancia atrás: alguien se queda por si se pierde.",
   "Amplitud: el extremo pisa la línea de banda.",
   "Cada persona conoce su señal y su zona de llegada."
  ],
  "adaptacion": "En categorías menores se trabaja con dos rematadores y una llegada."
 },
 {
  "n": 25,
  "bloque": 5,
  "titulo": "Creación de ocasiones mediante pases centro y pases atrás",
  "objetivo": "Practicar la creación de ocasiones mediante pases centro y pases atrás: pase rasante, llegada en el momento justo y remate de primeras, sin controlar.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pase centro raso y pase atrás",
   "tacticos": "Creación de ocasiones mediante pases centro y pases atrás",
   "estrategicos": "Falta lateral con pase atrás",
   "psicologicos": "Serenidad ante la portería"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "LUD-03"
  },
  "A": "ESP-02",
  "B": "FIJ-03",
  "C": null,
  "partido": "PAR-02",
  "definicion": "DEF-02",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Llegar a línea de fondo. 2) Pase atrás raso y preciso. 3) Remate de primeras.",
  "correcciones": [
   "Amplitud: el extremo pisa la línea de banda.",
   "Segundo palo siempre ocupado, aunque no llegue el balón.",
   "Desdobla por fuera y llega al segundo palo.",
   "Pase centro rasante y fuerte: busca el primer palo o el penalti.",
   "Observa quién es el ejecutor: ¿pierna izquierda o derecha?"
  ],
  "adaptacion": "En categorías menores, pases centro rasos y remates sin portero."
 },
 {
  "n": 26,
  "bloque": 5,
  "titulo": "Finalización de ataques mediante llegadas desde segunda línea",
  "objetivo": "Entrenar la finalización de ataques con llegadas desde segunda línea: apoyo, desmarque de ruptura y remate de primeras, manteniendo el equilibrio defensivo.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Remate de primeras y de fuera del área",
   "tacticos": "Finalización de ataques mediante llegadas desde segunda línea",
   "estrategicos": "Córner con llegada de segunda línea",
   "psicologicos": "Valentía y decisión al llegar"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "LUD-04"
  },
  "A": "TB-05",
  "B": "TB-11",
  "C": null,
  "partido": "PAR-05",
  "definicion": "DEF-01",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Llegar en carrera y sin balón. 2) Elegir el momento justo. 3) Mantener el equilibrio atrás.",
  "correcciones": [
   "Pase centro rasante y fuerte: busca el primer palo o el penalti.",
   "Llega al área en el momento justo: timing, ni antes ni después.",
   "En el área no se controla: define de primeras.",
   "Tres en el área: primer palo, penalti y segundo palo.",
   "Pared con el extremo y pase al espacio."
  ],
  "adaptacion": "En fútbol 8 se trabaja con un solo jugador de segunda línea."
 },
 {
  "n": 27,
  "bloque": 5,
  "titulo": "Finalización tras combinaciones, rupturas y pases al espacio",
  "objetivo": "Practicar la finalización tras combinaciones, rupturas y pases al espacio: leer la línea defensiva, atacar la espalda y definir de primeras.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pared, pase al espacio y remate",
   "tacticos": "Finalización tras combinaciones, rupturas y pases al espacio",
   "estrategicos": "Saque de banda con finalización",
   "psicologicos": "Frialdad ante la portería"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "RUE-04"
  },
  "A": "POS-03",
  "B": "TAC-20",
  "C": null,
  "partido": "REA-01",
  "definicion": "DEF-03",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Combinar y romper. 2) Pasar al espacio con ventaja. 3) Remate rápido y orientado.",
  "correcciones": [
   "Cuando sale el centro, el rematador ataca el balón.",
   "Si no hay centro, pase atrás al jugador que llega.",
   "Remata de primeras: de pie, de rodilla o de cabeza.",
   "Mira al portero y elige: palo corto o palo largo.",
   "Vigilancia atrás: alguien se queda por si se pierde."
  ],
  "adaptacion": "En categorías menores, 3v2 con portero y espacios cortos."
 },
 {
  "n": 28,
  "bloque": 6,
  "titulo": "Organización defensiva colectiva y protección del carril central",
  "objetivo": "Organizar la defensa colectiva y la protección del carril central: distancias cortas entre líneas, cierre de los pases interiores y coordinación del primer defensor con la cobertura.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Duelos y anticipación con ambas piernas",
   "tacticos": "Organización defensiva colectiva y protección del carril central",
   "estrategicos": "Córner defensivo con marcaje mixto",
   "psicologicos": "Disciplina táctica y concentración"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "CAL-03"
  },
  "A": "ESP-03",
  "B": "TB-09",
  "C": null,
  "partido": "REA-04",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Bloque corto y compacto. 2) Cerrar el carril central. 3) Orientar la presión hacia fuera.",
  "correcciones": [
   "Primer defensor al balón, segundo en cobertura.",
   "Cierra la línea de pase hacia el interior.",
   "Basculamos todos juntos hacia el lado del balón.",
   "Distancias cortas entre líneas: sin espacios entre nosotros.",
   "Recuperado el balón, levanta la cabeza y conserva."
  ],
  "adaptacion": "En categorías menores se trabaja con líneas de cuatro y bloque más corto."
 },
 {
  "n": 29,
  "bloque": 6,
  "titulo": "Coberturas defensivas y coordinación entre jugadores",
  "objetivo": "Entrenar las coberturas defensivas y la coordinación entre jugadores: primer defensor al balón, cobertura detrás y permutas cuando superan a un jugador.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Juego de piernas y anticipación defensiva",
   "tacticos": "Coberturas defensivas y coordinación entre jugadores",
   "estrategicos": "Falta lateral defensiva con coberturas",
   "psicologicos": "Comunicación constante entre defensores"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "LUD-01"
  },
  "A": "POS-04",
  "B": "FIJ-02",
  "C": null,
  "partido": "PAR-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) El defensor que cubre habla. 2) Distancia y ángulo correctos. 3) Intercambiar papeles tras el cambio de balón.",
  "correcciones": [
   "Distancias cortas entre líneas: sin espacios entre nosotros.",
   "Orienta al rival hacia la banda y presiona.",
   "Presiona cuando el pase sea lento; si no, temporiza.",
   "Perfil cerrado: oriéntalo y no le dejes girar.",
   "Los tres de zona despejan de cabeza, hacia los lados."
  ],
  "adaptacion": "En fútbol 8 se juega 2v2 y 4v3 con porterías pequeñas."
 },
 {
  "n": 30,
  "bloque": 6,
  "titulo": "Marcaje, vigilancia y protección de los espacios interiores",
  "objetivo": "Practicar el marcaje, la vigilancia y la protección de los espacios interiores: orientar al rival, cerrar el centro y anticipar los movimientos de ruptura.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Juego de pies defensivo y orientación del cuerpo",
   "tacticos": "Marcaje, vigilancia y protección de los espacios interiores",
   "estrategicos": "Córner defensivo con vigilancia",
   "psicologicos": "Atención sostenida y concentración"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "LUD-02"
  },
  "A": "ESP-03",
  "B": "FIJ-04",
  "C": null,
  "partido": "REA-04",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Marcar mirando balón y rival. 2) Vigilar la frontal. 3) Avisar de los cruces de marca.",
  "correcciones": [
   "Perfil cerrado: oriéntalo y no le dejes girar.",
   "Vigilancia: ¿quién llega por detrás de mí?",
   "Comunica: «mía», «sal», «cubro».",
   "Recuperado el balón, levanta la cabeza y conserva.",
   "El portero manda: coloca la barrera y dirige."
  ],
  "adaptacion": "En categorías menores, marcaje por zonas con referencias claras."
 },
 {
  "n": 31,
  "bloque": 6,
  "titulo": "Basculación defensiva y cierre de líneas de pase",
  "objetivo": "Entrenar la basculación defensiva y el cierre de las líneas de pase: todo el bloque se desplaza hacia el balón manteniendo distancias y superioridad en la zona.",
  "objetivos": {
   "fisicos": "Coordinación y agilidad en desplazamientos cortos",
   "tecnicos": "Desplazamientos laterales y orientación del cuerpo",
   "tacticos": "Basculación defensiva y cierre de líneas de pase",
   "estrategicos": "Falta lateral defensiva con basculación",
   "psicologicos": "Atención y rapidez de reacción"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "LUD-03"
  },
  "A": "POS-03",
  "B": "TAC-22",
  "C": null,
  "partido": "PAR-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Moverse juntos. 2) Cerrar el pase interior. 3) Mantener las distancias entre líneas.",
  "correcciones": [
   "Recuperado el balón, levanta la cabeza y conserva.",
   "No saltes solo: salta cuando alguien te cubre.",
   "La línea sube o baja toda junta.",
   "Cierra primero el centro; después, la banda.",
   "Si pierdes el balón, presiona los primeros segundos."
  ],
  "adaptacion": "En fútbol 8 se bascula en bloque de 3-3."
 },
 {
  "n": 32,
  "bloque": 6,
  "titulo": "Defensa del área ante pases centro desde las bandas y pases atrás",
  "objetivo": "Entrenar la defensa del área ante pases centro desde las bandas y pases atrás: ocupación de zonas, marcaje al rematador y despeje de cabeza hacia los lados.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Despeje de cabeza y anticipación",
   "tacticos": "Defensa del área ante pases centro desde las bandas y pases atrás",
   "estrategicos": "Falta lateral defensiva en el área",
   "psicologicos": "Valentía en los duelos aéreos"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "LUD-04"
  },
  "A": "POS-04",
  "B": "TAC-23",
  "C": null,
  "partido": "REA-04",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Ocupar primer palo, segundo palo y frontal. 2) Comunicar con el portero. 3) Despejar hacia fuera.",
  "correcciones": [
   "Vigilancia: ¿quién llega por detrás de mí?",
   "Comunica: «mía», «sal», «cubro».",
   "Recuperado el balón, levanta la cabeza y conserva.",
   "No saltes solo: salta cuando alguien te cubre.",
   "Orienta al rival hacia la banda y presiona."
  ],
  "adaptacion": "En categorías menores, pases centro rasos y menos jugadores en el área."
 },
 {
  "n": 33,
  "bloque": 7,
  "titulo": "Presión colectiva para orientar la salida rival",
  "objetivo": "Organizar la presión colectiva para orientar la salida del rival: primer jugador que presiona, cierre de los pases interiores y orientación hacia la banda.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Carrera de presión y orientación del cuerpo",
   "tacticos": "Presión colectiva para orientar la salida rival",
   "estrategicos": "Saque de puerta rival presionado",
   "psicologicos": "Valentía y compromiso en la presión"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "RUE-04"
  },
  "A": "FIS-03",
  "B": "TB-09",
  "C": null,
  "partido": "PAR-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Orientar hacia un lado. 2) Cerrar el pase interior. 3) Saltar todos a la vez.",
  "correcciones": [
   "Cierra primero el centro; después, la banda.",
   "Si pierdes el balón, presiona los primeros segundos.",
   "Primer defensor al balón, segundo en cobertura.",
   "Cierra la línea de pase hacia el interior.",
   "Basculamos todos juntos hacia el lado del balón."
  ],
  "adaptacion": "En categorías menores, presión en campo medio y por zonas."
 },
 {
  "n": 34,
  "bloque": 7,
  "titulo": "Coordinación de la primera línea de presión con la línea defensiva",
  "objetivo": "Coordinar la primera línea de presión con la línea defensiva: el bloque sube y baja unido, sin dejar espacios entre líneas y con vigilancia a la espalda.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Desplazamientos y anticipación",
   "tacticos": "Coordinación de la primera línea de presión con la línea defensiva",
   "estrategicos": "Falta defensiva con línea adelantada",
   "psicologicos": "Comunicación entre líneas"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "CAL-03"
  },
  "A": "ESP-04",
  "B": "TAC-22",
  "C": null,
  "partido": "REA-02",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Primera presión y línea defensiva conectadas. 2) Subir juntos. 3) Comunicación constante.",
  "correcciones": [
   "Cierra la línea de pase hacia el interior.",
   "Basculamos todos juntos hacia el lado del balón.",
   "Distancias cortas entre líneas: sin espacios entre nosotros.",
   "Orienta al rival hacia la banda y presiona.",
   "Presiona cuando el pase sea lento; si no, temporiza."
  ],
  "adaptacion": "En fútbol 8 se trabaja con dos líneas y portero."
 },
 {
  "n": 35,
  "bloque": 7,
  "titulo": "Repliegue colectivo y reorganización del bloque defensivo",
  "objetivo": "Practicar el repliegue colectivo y la reorganización del bloque defensivo: recuperar posiciones con orden, cerrar el centro y recomponer las líneas.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Desplazamientos defensivos y anticipación",
   "tacticos": "Repliegue colectivo y reorganización del bloque defensivo",
   "estrategicos": "Córner defensivo tras repliegue",
   "psicologicos": "Concentración y orden colectivo"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "LUD-01"
  },
  "A": "POS-02",
  "B": "FIJ-02",
  "C": null,
  "partido": "TB-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Repliegue rápido y en orden. 2) Formar el bloque antes que el rival progrese. 3) Comunicar la posición.",
  "correcciones": [
   "Orienta al rival hacia la banda y presiona.",
   "Presiona cuando el pase sea lento; si no, temporiza.",
   "Perfil cerrado: oriéntalo y no le dejes girar.",
   "Vigilancia: ¿quién llega por detrás de mí?",
   "Los tres de zona despejan de cabeza, hacia los lados."
  ],
  "adaptacion": "En categorías menores, repliegue a la propia mitad y bloque corto."
 },
 {
  "n": 36,
  "bloque": 7,
  "titulo": "Reorganización defensiva tras pérdida del balón en campo propio",
  "objetivo": "Organizar la reorganización defensiva tras la pérdida en campo propio: primeros segundos de presión, repliegue en cobertura y equilibrio entre líneas.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Desplazamientos defensivos y orientación del cuerpo",
   "tacticos": "Reorganización defensiva tras pérdida del balón en campo propio",
   "estrategicos": "Saque de puerta con riesgo",
   "psicologicos": "Serenidad y rapidez tras el error"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "LUD-02"
  },
  "A": "TB-01",
  "B": "TAC-23",
  "C": null,
  "partido": "REA-05",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Reacción inmediata. 2) Proteger primero el centro. 3) Cobertura del central cercano.",
  "correcciones": [
   "No saltes solo: salta cuando alguien te cubre.",
   "La línea sube o baja toda junta.",
   "Cierra primero el centro; después, la banda.",
   "Si pierdes el balón, presiona los primeros segundos.",
   "Primer defensor al balón, segundo en cobertura."
  ],
  "adaptacion": "En categorías menores, más espacio y portero que participa."
 },
 {
  "n": 37,
  "bloque": 8,
  "titulo": "Verticalidad en la salida: del juego corto a la alternativa directa",
  "objetivo": "Practicar la verticalidad desde la salida: combinar el juego corto con una alternativa directa, reconociendo cuándo la presión impide salir jugando y decidiendo entre el pase largo al espacio y la conservación.",
  "objetivos": {
   "fisicos": "Velocidad de reacción ante estímulos",
   "tecnicos": "Pase corto y pase largo con ambas piernas",
   "tacticos": "Verticalidad en la salida: del juego corto a la alternativa directa",
   "estrategicos": "Saque de puerta con señal (corto o largo)",
   "psicologicos": "Atención y adaptación rápida a lo que hace el rival"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "RUE-01"
  },
  "A": "POS-05",
  "B": "TAC-25",
  "C": null,
  "partido": "PAR-03",
  "definicion": "DEF-02",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Leer la presión rival antes de sacar. 2) Si es alta, jugar directo con apoyos; si es baja, jugar corto. 3) Preparar la segunda jugada.",
  "correcciones": [
   "Perfílate antes de recibir: mira la presión y decide.",
   "El portero se ofrece con ángulo y juega a uno o dos toques.",
   "Escanea la zona antes de recibir y busca el espacio libre.",
   "Atrae la presión y suelta el balón al lado libre.",
   "Cobertura: cuando te superan, cierra quien te cubre."
  ],
  "adaptacion": "El pase largo se adapta a la edad de los jugadores."
 },
 {
  "n": 38,
  "bloque": 8,
  "titulo": "Transición ofensiva tras recuperación en zonas interiores",
  "objetivo": "Entrenar la transición ofensiva tras la recuperación en zonas interiores: reconocer las zonas libres, decidir rápido y atacar antes de que el rival se reorganice.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pase en progresión y conducción",
   "tacticos": "Transición ofensiva tras recuperación en zonas interiores",
   "estrategicos": "Saque de puerta rápido tras parada",
   "psicologicos": "Decisión rápida tras recuperar"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "RUE-03"
  },
  "A": "POS-06",
  "B": "TAC-21",
  "C": null,
  "partido": "PAR-01",
  "definicion": "DEF-01",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Primer pase hacia delante. 2) Apoyo cercano. 3) Ocupar espacios rápido.",
  "correcciones": [
   "Todos hacia la línea del balón para crear superioridad.",
   "Equilibrio: dos jugadores por detrás del balón siempre.",
   "Primero el pase a quien está libre, luego el desmarque de ruptura.",
   "No mires el balón perdido: corre a tu puesto.",
   "Identifica las zonas libres antes de recuperar."
  ],
  "adaptacion": "En fútbol 8, 4v3 en espacios cortos."
 },
 {
  "n": 39,
  "bloque": 8,
  "titulo": "Transición ofensiva con verticalidad: progresión rápida y ocupación de espacios",
  "objetivo": "Practicar la transición ofensiva con verticalidad: progresión rápida, primer pase hacia delante, desmarques de ruptura y finalización en pocos segundos, ocupando los espacios libres.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Conducción, pase al espacio y remate",
   "tacticos": "Transición ofensiva con verticalidad: progresión rápida y ocupación de espacios",
   "estrategicos": "Córner defensivo con salida en contra",
   "psicologicos": "Frialdad y velocidad de decisión"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "RUE-02"
  },
  "A": "FIS-02",
  "B": "TAC-27",
  "C": null,
  "partido": "PAR-04",
  "definicion": "DEF-02",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Progresar rápido. 2) Ocupar carriles distintos. 3) Decidir entre conducir, pasar o rematar.",
  "correcciones": [
   "No mires el balón perdido: corre a tu puesto.",
   "Identifica las zonas libres antes de recuperar.",
   "Si no hay ataque directo, conserva y reorganiza.",
   "Cobertura: cuando te superan, cierra quien te cubre.",
   "Perfílate antes de recibir: mira la presión y decide."
  ],
  "adaptacion": "En categorías menores, transiciones ofensivas 2v1 y 3v2."
 },
 {
  "n": 40,
  "bloque": 8,
  "titulo": "Transición ofensiva según la zona de recuperación: directa, elaborada o mixta",
  "objetivo": "Entrenar la transición ofensiva según la zona de recuperación: ataque directo, transición elaborada o mixta, según dónde se recupere el balón.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase en progresión y conducción",
   "tacticos": "Transición ofensiva según la zona de recuperación: directa, elaborada o mixta",
   "estrategicos": "Saque de puerta según zona",
   "psicologicos": "Lectura rápida del contexto"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "RUE-01"
  },
  "A": "POS-05",
  "B": "TB-11",
  "C": null,
  "partido": "TAC-28",
  "definicion": "DEF-01",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Lectura de la zona. 2) Cambio de ritmo. 3) Apoyos tras recuperar.",
  "correcciones": [
   "Rápido, pero sin precipitarte: control orientado y pase.",
   "Vigila la espalda: el rival busca el balón largo.",
   "Reacciona al instante: ahora defiendo, ahora ataco.",
   "Tras perder, cinco segundos de presión y, si no, repliegue.",
   "Al recuperar, primer pase hacia el espacio libre."
  ],
  "adaptacion": "En categorías menores, dos zonas en lugar de tres."
 },
 {
  "n": 41,
  "bloque": 8,
  "titulo": "Decisión tras recuperar: verticalidad, conservación o reorganización",
  "objetivo": "Practicar la decisión tras recuperar el balón entre atacar con verticalidad, conservar o reorganizarse: leer al rival, elegir y ejecutar con rapidez y seguridad.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pase y conducción bajo presión",
   "tacticos": "Decisión tras recuperar: verticalidad, conservación o reorganización",
   "estrategicos": "Falta rápida tras recuperar",
   "psicologicos": "Toma de decisiones bajo presión"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "RUE-03"
  },
  "A": "TB-10",
  "B": "TAC-20",
  "C": null,
  "partido": "REA-03",
  "definicion": "DEF-02",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Mirar el desorden rival. 2) Comunicar la decisión. 3) Cambiar de ritmo.",
  "correcciones": [
   "Tras perder, cinco segundos de presión y, si no, repliegue.",
   "Al recuperar, primer pase hacia el espacio libre.",
   "Todos hacia la línea del balón para crear superioridad.",
   "Equilibrio: dos jugadores por detrás del balón siempre.",
   "Primero el pase a quien está libre, luego el desmarque de ruptura."
  ],
  "adaptacion": "En categorías menores, dos opciones en lugar de tres."
 },
 {
  "n": 42,
  "bloque": 9,
  "titulo": "Reacción inmediata tras pérdida en campo contrario",
  "objetivo": "Practicar la reacción inmediata tras la pérdida en campo contrario: presión tras la pérdida durante unos segundos y repliegue ordenado si no se recupera el balón.",
  "objetivos": {
   "fisicos": "Resistencia a la velocidad (repetición de esfuerzos cortos)",
   "tecnicos": "Carrera de presión y duelos",
   "tacticos": "Reacción inmediata tras pérdida en campo contrario",
   "estrategicos": "Saque de banda rápido tras recuperar",
   "psicologicos": "Intensidad y compromiso tras la pérdida"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "LUD-03"
  },
  "A": "ESP-02",
  "B": "TAC-22",
  "C": null,
  "partido": "TB-13",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Reaccionar en el primer segundo. 2) Cerrar el pase vertical. 3) Presionar juntos.",
  "correcciones": [
   "Reacciona al instante: ahora defiendo, ahora ataco.",
   "Tras perder, cinco segundos de presión y, si no, repliegue.",
   "Al recuperar, primer pase hacia el espacio libre.",
   "Todos hacia la línea del balón para crear superioridad.",
   "Equilibrio: dos jugadores por detrás del balón siempre."
  ],
  "adaptacion": "En categorías menores, presión en zonas más cortas."
 },
 {
  "n": 43,
  "bloque": 9,
  "titulo": "Reorganización colectiva durante la transición defensiva",
  "objetivo": "Organizar la reorganización colectiva durante la transición defensiva: repliegue en cobertura, hacia la línea del balón y ocupación de los puestos de la formación.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Desplazamientos defensivos y orientación del cuerpo",
   "tacticos": "Reorganización colectiva durante la transición defensiva",
   "estrategicos": "Saque de banda en contra",
   "psicologicos": "Calma y orden tras la pérdida"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "LUD-04"
  },
  "A": "POS-06",
  "B": "TAC-23",
  "C": null,
  "partido": "PAR-02",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Temporizar sin lanzarse. 2) Ayudas desde atrás. 3) Comunicación.",
  "correcciones": [
   "Cobertura: cuando te superan, cierra quien te cubre.",
   "Cada cambio de fase es una decisión: mirar, decidir, ejecutar y apoyar.",
   "Al recuperar, ocupa los espacios vacíos y abre el campo.",
   "Rápido, pero sin precipitarte: control orientado y pase.",
   "Vigila la espalda: el rival busca el balón largo."
  ],
  "adaptacion": "En categorías menores, más espacio y menos exigencia de tiempo."
 },
 {
  "n": 44,
  "bloque": 9,
  "titulo": "Equilibrio defensivo durante el ataque y protección ante la pérdida",
  "objetivo": "Entrenar el equilibrio defensivo durante el ataque y la protección ante la pérdida: vigilancias, jugadores por detrás del balón y presión inmediata.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Desplazamientos defensivos y anticipación",
   "tacticos": "Equilibrio defensivo durante el ataque y protección ante la pérdida",
   "estrategicos": "Córner ofensivo con equilibrio",
   "psicologicos": "Disciplina y compromiso colectivo"
  },
  "calentamiento": {
   "rondo": "RON-01",
   "tercero": "RUE-04"
  },
  "A": "TB-05",
  "B": "TAC-22",
  "C": null,
  "partido": "PAR-06",
  "definicion": null,
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 22,
   "D": 0,
   "pausas": 10
  },
  "ideas": "1) Mantener jugadores de seguridad. 2) Ocupar espacios por detrás del balón. 3) Reaccionar rápido tras la pérdida.",
  "correcciones": [
   "Equilibrio: dos jugadores por detrás del balón siempre.",
   "Primero el pase a quien está libre, luego el desmarque de ruptura.",
   "No mires el balón perdido: corre a tu puesto.",
   "Identifica las zonas libres antes de recuperar.",
   "Tras perder, cinco segundos de presión y, si no, repliegue."
  ],
  "adaptacion": "En categorías menores, dos jugadores de seguridad."
 },
 {
  "n": 45,
  "bloque": 10,
  "titulo": "Coordinación de movimientos ofensivos en el último tercio",
  "objetivo": "Organizar la coordinación de los movimientos ofensivos en el último tercio: ocupación racional de espacios, desmarques de ruptura y combinaciones para finalizar.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Pase entre líneas y remate",
   "tacticos": "Coordinación de movimientos ofensivos en el último tercio",
   "estrategicos": "Falta frontal con señales",
   "psicologicos": "Paciencia y confianza en la combinación"
  },
  "calentamiento": {
   "rondo": "RON-02",
   "tercero": "CAL-03"
  },
  "A": "POS-01",
  "B": "TB-12",
  "C": null,
  "partido": "REA-04",
  "definicion": "DEF-05",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Apoyar y romper de forma alterna. 2) Paciencia en la circulación. 3) Aprovechar el pase entre líneas.",
  "correcciones": [
   "Tres en el área: primer palo, penalti y segundo palo.",
   "El lateral llega alto y deja equilibrio por si se pierde.",
   "Pared con el extremo y pase al espacio.",
   "Cuando sale el centro, el rematador ataca el balón.",
   "Primero la señal, después el movimiento."
  ],
  "adaptacion": "En categorías menores, espacios más cortos y menos defensores."
 },
 {
  "n": 46,
  "bloque": 10,
  "titulo": "Coordinación entre líneas para conectar defensa, centro del campo y ataque",
  "objetivo": "Organizar la coordinación entre líneas para conectar defensa, centro del campo y ataque: distancias entre líneas, apoyos interiores y progresión ordenada.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Pase entre líneas y control orientado",
   "tacticos": "Coordinación entre líneas para conectar defensa, centro del campo y ataque",
   "estrategicos": "Córner ofensivo con equilibrio entre líneas",
   "psicologicos": "Cohesión y comunicación entre líneas"
  },
  "calentamiento": {
   "rondo": "RON-03",
   "tercero": "LUD-01"
  },
  "A": "TAC-11",
  "B": "TB-09",
  "C": null,
  "partido": "PAR-03",
  "definicion": "DEF-03",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Distancias cortas entre líneas. 2) Ofrecimiento de cara del mediocentro. 3) Apoyo del delantero.",
  "correcciones": [
   "Pared diagonal y ruptura: llega por la espalda.",
   "Extremos abiertos y laterales altos acompañando.",
   "Desdoblamiento interno: ocupa el carril que deja libre quien sale.",
   "Cambia de lugar con quien te acompaña: la permuta confunde a quien marca.",
   "Pase entre líneas y apoyo cercano."
  ],
  "adaptacion": "En fútbol 8, dos líneas y un delantero."
 },
 {
  "n": 47,
  "bloque": 10,
  "titulo": "Organización ofensiva en acciones a balón parado",
  "objetivo": "Organizar el ataque en acciones a balón parado: córners, tiros libres y saques de banda con roles asignados, señales acordadas y llegada al área en el momento justo.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Golpeo de balón parado, pase centro y remate",
   "tacticos": "Organización ofensiva en acciones a balón parado",
   "estrategicos": "Variantes de córner y falta ofensiva",
   "psicologicos": "Serenidad y concentración ante el balón parado"
  },
  "calentamiento": {
   "rondo": "RON-04",
   "tercero": "LUD-02"
  },
  "A": "POS-05",
  "B": "FIJ-01",
  "C": "FIJ-03",
  "partido": null,
  "definicion": "DEF-05",
  "tiempos": {
   "A": 15,
   "B": 20,
   "C": 20,
   "P": 0,
   "D": 0,
   "pausas": 15
  },
  "ideas": "1) Señales claras. 2) Ocupación de espacios. 3) Carreras coordinadas.",
  "correcciones": [
   "Cada uno conoce su señal y su zona.",
   "Crea distracción: dos se mueven para liberar a un tercero.",
   "Entra al área en el momento justo, no antes.",
   "Marcaje: estorba la carrera y el salto, no mires solo el balón.",
   "Cada persona conoce su señal y su zona de llegada."
  ],
  "adaptacion": "En categorías menores, dos variantes y pocos jugadores."
 },
 {
  "n": 48,
  "bloque": 10,
  "titulo": "Organización defensiva en córners y faltas laterales",
  "objetivo": "Organizar la defensa en córners y faltas laterales: tres defensores de zona y el resto en marcaje personal, barrera colocada por el portero y vigilancia del rechace.",
  "objetivos": {
   "fisicos": "Velocidad de reacción y acciones explosivas",
   "tecnicos": "Despeje de cabeza y anticipación",
   "tacticos": "Organización defensiva en córners y faltas laterales",
   "estrategicos": "Córner y falta lateral defensivos",
   "psicologicos": "Concentración colectiva y comunicación"
  },
  "calentamiento": {
   "rondo": "RON-05",
   "tercero": "LUD-03"
  },
  "A": "TAC-24",
  "B": "FIJ-02",
  "C": "FIJ-04",
  "partido": null,
  "definicion": "DEF-03",
  "tiempos": {
   "A": 15,
   "B": 20,
   "C": 20,
   "P": 0,
   "D": 0,
   "pausas": 15
  },
  "ideas": "1) Marcas y zonas claras. 2) Línea coordinada. 3) Comunicación con el portero.",
  "correcciones": [
   "Pase raso o aéreo, a la zona acordada.",
   "Extremos abiertos y laterales altos acompañando.",
   "Tres en el área: primer palo, penalti y segundo palo.",
   "Barrera junta y quieta hasta que salga el balón.",
   "Los tres de zona despejan de cabeza, hacia los lados."
  ],
  "adaptacion": "En categorías menores, defensa por zonas simples."
 },
 {
  "n": 49,
  "bloque": 10,
  "titulo": "Gestión del ritmo de juego y conservación de la ventaja",
  "objetivo": "Practicar la gestión del ritmo de juego y la conservación de la ventaja: cambiar el ritmo, proteger el balón y defender con él, sin renunciar al juego.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Conservación y pase seguro",
   "tacticos": "Gestión del ritmo de juego y conservación de la ventaja",
   "estrategicos": "Saque de banda y falta para ganar tiempo",
   "psicologicos": "Calma y madurez competitiva"
  },
  "calentamiento": {
   "rondo": "TEC-04",
   "tercero": "LUD-04"
  },
  "A": "TB-02",
  "B": "TB-09",
  "C": null,
  "partido": "PAR-01",
  "definicion": "DEF-05",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Elegir entre acelerar y pausar. 2) Alejar el balón de la portería propia. 3) Comunicar la gestión.",
  "correcciones": [
   "Cambia de ritmo: acelera cuando el rival se descuide.",
   "Cuando vamos ganando, conserva el balón sin renunciar al juego.",
   "Cuenta el tiempo restante y decide: arriesgar o cuidar.",
   "Cobertura detrás de cada jugador, siempre.",
   "Si perdemos, presión inmediata; si recuperamos, pausa y pase."
  ],
  "adaptacion": "En categorías menores, gestión sencilla de posesión."
 },
 {
  "n": 50,
  "bloque": 10,
  "titulo": "Aplicación del modelo de juego en situaciones reales de competición",
  "objetivo": "Aplicar el modelo de juego en situaciones reales de competición: salida, progresión, finalización y transiciones con las ideas de las sesiones anteriores.",
  "objetivos": {
   "fisicos": "Resistencia aeróbica intermitente",
   "tecnicos": "Aplicación completa del modelo de juego",
   "tacticos": "Aplicación del modelo de juego en situaciones reales de competición",
   "estrategicos": "Balón parado con marcador en juego",
   "psicologicos": "Mentalidad competitiva y adaptación a cada escenario"
  },
  "calentamiento": {
   "rondo": "CAL-04",
   "tercero": "RUE-04"
  },
  "A": "ESP-04",
  "B": "TAC-23",
  "C": null,
  "partido": "PAR-04",
  "definicion": "DEF-03",
  "tiempos": {
   "A": 19,
   "B": 19,
   "C": 0,
   "P": 17,
   "D": 5,
   "pausas": 10
  },
  "ideas": "1) Aplicar el modelo con orden. 2) Adaptarse al marcador y al minuto. 3) Liderazgo y comunicación.",
  "correcciones": [
   "Cobertura detrás de cada jugador, siempre.",
   "Si perdemos, presión inmediata; si recuperamos, pausa y pase.",
   "Equilibrio: no vayamos todos al ataque.",
   "Comunica el marcador y el tiempo al equipo.",
   "Un jugador vigila el rechace en la frontal."
  ],
  "adaptacion": "En categorías menores, escenarios simples (ganar o empatar)."
 }
];
// Esencial: la primera sesión de cada bloque. Entrenador: 25. Metodólogo: las 50.
export const SESIONES_POR_PLAN = {"esencial": [1, 6, 11, 16, 22, 28, 33, 37, 42, 45], "entrenador": [1, 2, 3, 6, 7, 11, 12, 16, 17, 18, 22, 23, 24, 28, 29, 33, 34, 37, 38, 39, 42, 43, 45, 46, 47]};
