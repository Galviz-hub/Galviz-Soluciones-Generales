
/* ==========================================
   GALVIZ EVENTS
   CAMPEONATO ANUAL

   PRESENTACIÓN DEL CALENDARIO DE PARTIDOS
   Compatible con Libre y Máster.
========================================== */

(function () {

    // ======================================
    // 01. IDENTIFICAR LA CATEGORÍA Y LOS DATOS
    // ======================================

    const pagina = document.querySelector(
        ".categoria-pagina"
    );

    if (!pagina) return;

    const categoria = pagina.dataset.categoria;

    const equipos =
        window.GALVIZ_DATOS_EQUIPOS?.[categoria] || [];

    const calendario =
        window.GALVIZ_DATOS_PARTIDOS?.[categoria];

    if (!calendario) return;


    // ======================================
    // 02. IDENTIFICAR LOS CONTENEDORES
    // ======================================

    const contenedorDestacado = document.getElementById(
        "proximo-partido"
    );

    const selector = document.getElementById(
        "selector-partidos"
    );

    const lista = document.getElementById(
        "lista-partidos"
    );

    if (!contenedorDestacado || !selector || !lista) {
        return;
    }


    // ======================================
    // 03. IDENTIFICAR CADA EQUIPO
    // ======================================

    function obtenerEquipo(id) {

        const equipo = equipos.find(function (elemento) {
            return elemento.id === id;
        });

        // Durante las eliminatorias, algunos
        // participantes todavía no están definidos.

        return equipo || {
            nombre: id || "Por definir",
            sigla: "—",
            escudo: null
        };

    }


    // ======================================
    // 04. CREAR EL ESCUDO
    // ======================================

    function crearEscudo(equipo) {

        const escudo = document.createElement("div");

        escudo.className = "partido-escudo";

        if (equipo.escudo) {

            const imagen = document.createElement("img");

            imagen.src = equipo.escudo;
            imagen.alt = "Escudo de " + equipo.nombre;
            imagen.loading = "lazy";

            escudo.appendChild(imagen);

        } else {

            escudo.textContent = equipo.sigla;

            escudo.setAttribute(
                "aria-hidden",
                "true"
            );

        }

        return escudo;

    }


    // ======================================
    // 05. CREAR LA PRESENTACIÓN DE UN EQUIPO
    // ======================================

    function crearParticipante(equipo) {

        const participante = document.createElement("div");

        participante.className = "partido-participante";

        const nombre = document.createElement("span");

        nombre.className = "partido-equipo-nombre";

        nombre.textContent = equipo.nombre;

        participante.appendChild(
            crearEscudo(equipo)
        );

        participante.appendChild(nombre);

        return participante;

    }


    // ======================================
    // 06. FECHA Y HORA
    // ======================================

    function obtenerHorario(jornada, partido) {

        if (!jornada.fecha && !partido.hora) {

            return "Fecha y hora por confirmar";

        }

        const fecha = jornada.fecha ||
            "Fecha por confirmar";

        const hora = partido.hora ||
            "Hora por confirmar";

        return fecha + " · " + hora;

    }


    function agregarEstadoYEscenario(contenedor, partido) {
        if (partido.escenario) {
            const lugar = document.createElement('p');
            lugar.className = 'partido-horario';
            lugar.textContent = 'Escenario: ' + partido.escenario;
            contenedor.appendChild(lugar);
        }
        const nombres = {programado:'PROGRAMADO',en_juego:'EN VIVO',finalizado:'FINALIZADO',
            suspendido:'SUSPENDIDO',cancelado:'CANCELADO'};
        if (partido.estado === 'en_juego') {
            const enlace = document.createElement('a');
            enlace.href = '../transmisiones.html';
            enlace.className = 'galviz-en-vivo';
            enlace.textContent = '● EN VIVO · VER TRANSMISIONES';
            enlace.setAttribute('aria-label','Ir a la sección de transmisiones de Galviz Events');
            contenedor.appendChild(enlace);
        } else if (nombres[partido.estado]) {
            const estado = document.createElement('p');
            estado.className = 'partido-horario';
            estado.textContent = nombres[partido.estado];
            contenedor.appendChild(estado);
        }
    }

    // ======================================
    // 07. MOSTRAR EL PARTIDO DESTACADO
    // ======================================

    function mostrarDestacado() {

        const jornada = calendario.jornadas.find(j => j.partidos.some(p => p.estado === 'en_juego')) ||
            calendario.jornadas.find(j => j.partidos.some(p => p.estado === 'programado')) || calendario.jornadas[0];

        const partido = jornada?.partidos.find(p => p.estado === 'en_juego') ||
            jornada?.partidos.find(p => p.estado === 'programado') || jornada?.partidos[0];

        if (!partido) return;

        const local = obtenerEquipo(partido.local);

        const visitante = obtenerEquipo(
            partido.visitante
        );

        contenedorDestacado.replaceChildren();


        // ETIQUETA

        const etiqueta = document.createElement("p");

        etiqueta.className = "partido-destacado-etiqueta";

        etiqueta.textContent = calendario.demostracion
            ? "PARTIDO DESTACADO · DEMOSTRACIÓN"
            : "PARTIDO DESTACADO";


        // ENFRENTAMIENTO

        const enfrentamiento =
            document.createElement("div");

        enfrentamiento.className =
            "partido-enfrentamiento";

        const versus = document.createElement("span");

        versus.className = "partido-versus";

        versus.textContent = partido.estado === 'en_juego' &&
            Number.isInteger(partido.golesLocal) && Number.isInteger(partido.golesVisitante)
            ? partido.golesLocal + ' - ' + partido.golesVisitante : 'VS';

        enfrentamiento.appendChild(
            crearParticipante(local)
        );

        enfrentamiento.appendChild(versus);

        enfrentamiento.appendChild(
            crearParticipante(visitante)
        );


        // FECHA Y HORA

        const horario = document.createElement("p");

        horario.className = "partido-horario";

        horario.textContent = obtenerHorario(
            jornada,
            partido
        );


        // INCORPORAR ELEMENTOS

        contenedorDestacado.appendChild(etiqueta);

        contenedorDestacado.appendChild(
            enfrentamiento
        );

        contenedorDestacado.appendChild(horario);
        agregarEstadoYEscenario(contenedorDestacado, partido);

    }


    // ======================================
    // 08. CREAR LAS TARJETAS DE PARTIDOS
    // ======================================

    function crearTarjeta(partido, jornada) {

        const local = obtenerEquipo(partido.local);

        const visitante = obtenerEquipo(
            partido.visitante
        );

        const tarjeta = document.createElement("article");

        tarjeta.className = "partido-tarjeta";


        // GRUPO O FASE

        const fase = document.createElement("p");

        fase.className = "partido-fase";

        fase.textContent = partido.grupo;


        // ENFRENTAMIENTO

        const enfrentamiento =
            document.createElement("div");

        enfrentamiento.className =
            "partido-enfrentamiento";

        const versus = document.createElement("span");

        versus.className = "partido-versus";

        versus.textContent = partido.estado === 'en_juego' &&
            Number.isInteger(partido.golesLocal) && Number.isInteger(partido.golesVisitante)
            ? partido.golesLocal + ' - ' + partido.golesVisitante : 'VS';

        enfrentamiento.appendChild(
            crearParticipante(local)
        );

        enfrentamiento.appendChild(versus);

        enfrentamiento.appendChild(
            crearParticipante(visitante)
        );


        // HORARIO

        const horario = document.createElement("p");

        horario.className = "partido-horario";

        horario.textContent = obtenerHorario(
            jornada,
            partido
        );


        // CONSTRUIR TARJETA

        tarjeta.appendChild(fase);

        tarjeta.appendChild(enfrentamiento);

        tarjeta.appendChild(horario);
        agregarEstadoYEscenario(tarjeta, partido);

        return tarjeta;

    }


    // ======================================
    // 09. MOSTRAR LOS PARTIDOS DE UN DÍA
    // ======================================

    function mostrarJornada(numeroDia) {

        const jornada = calendario.jornadas.find(
            function (elemento) {

                return elemento.dia === numeroDia;

            }
        );

        if (!jornada) return;

        lista.replaceChildren();


        // TÍTULO DE LA JORNADA

        const titulo = document.createElement("h3");

        titulo.className = "partidos-jornada-titulo";

        titulo.textContent =
            jornada.nombre + " · " + jornada.fase;

        lista.appendChild(titulo);


        // TARJETAS

        jornada.partidos.forEach(function (partido) {

            lista.appendChild(
                crearTarjeta(partido, jornada)
            );

        });


        // CEREMONIA DEL DÍA 6

        if (jornada.ceremonia) {

            const ceremonia = document.createElement("div");

            ceremonia.className = "partidos-ceremonia";

            const tituloCeremonia =
                document.createElement("h4");

            tituloCeremonia.textContent =
                "CORONACIÓN Y RECONOCIMIENTOS";

            const descripcion =
                document.createElement("p");

            descripcion.textContent =
                "Ceremonia de premiación y " +
                "reconocimiento al finalizar " +
                "la competición.";

            ceremonia.appendChild(
                tituloCeremonia
            );

            ceremonia.appendChild(
                descripcion
            );

            lista.appendChild(ceremonia);

        }


        // ACTUALIZAR EL SELECTOR

        const botones = selector.querySelectorAll(
            "button"
        );

        botones.forEach(function (boton) {

            const activo =
                Number(boton.dataset.dia) === numeroDia;

            boton.classList.toggle(
                "activo",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(activo)
            );

        });

    }


    // ======================================
    // 10. CREAR EL SELECTOR DE LOS SEIS DÍAS
    // ======================================

    function crearSelector() {

        selector.replaceChildren();

        calendario.jornadas.forEach(function (jornada) {

            const boton = document.createElement("button");

            boton.type = "button";

            boton.className = "jornada-boton";

            boton.dataset.dia = jornada.dia;

            boton.textContent = jornada.nombre;

            boton.addEventListener(
                "click",
                function () {

                    mostrarJornada(jornada.dia);

                }
            );

            selector.appendChild(boton);

        });

    }


    // ======================================
    // 11. INICIAR EL CALENDARIO
    // ======================================

    crearSelector();

    mostrarDestacado();

    const jornadaViva = calendario.jornadas.find(j => j.partidos.some(p => p.estado === 'en_juego'));
    mostrarJornada(jornadaViva ? jornadaViva.dia : 1);

})();
