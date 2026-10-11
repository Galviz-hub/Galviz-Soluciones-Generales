
/* ==========================================
   GALVIZ EVENTS
   CLASIFICACIÓN DE LA LIGUILLA

   Sistema de liga a una sola vuelta.

   Compatible con las categorías
   Libre y Máster de la Liguilla.
========================================== */

(function () {

    // ======================================
    // 01. IDENTIFICAR LA CATEGORÍA
    // ======================================

    const pagina = document.querySelector(
        ".categoria-pagina"
    );

    if (!pagina) return;

    const categoria = pagina.dataset.categoria;


    // ======================================
    // 02. OBTENER LOS DATOS
    // ======================================

    const equipos =
        window.GALVIZ_DATOS_EQUIPOS?.[categoria] || [];

    const calendario =
        window.GALVIZ_DATOS_PARTIDOS?.[categoria];

    const datosResultados =
        window.GALVIZ_DATOS_RESULTADOS?.[categoria];

    if (!calendario || !datosResultados) return;

    const marcadores =
        datosResultados.marcadores || {};


    // ======================================
    // 03. IDENTIFICAR EL CONTENEDOR
    // ======================================

    const contenedor = document.getElementById(
        "tabla-liguilla"
    );

    if (!contenedor) return;


    // ======================================
    // 04. PREPARAR LAS POSICIONES
    // ======================================

    function prepararPosiciones() {

        return equipos.map(function (equipo) {

            return {

                id: equipo.id,

                nombre: equipo.nombre,

                pj: 0,

                g: 0,

                e: 0,

                p: 0,

                gf: 0,

                gc: 0,

                dg: 0,

                puntos: 0

            };

        });

    }


    // ======================================
    // 05. VALIDAR UN MARCADOR
    // ======================================

    function marcadorValido(marcador) {

        return (
            marcador &&
            Number.isInteger(marcador.golesLocal) &&
            Number.isInteger(marcador.golesVisitante) &&
            marcador.golesLocal >= 0 &&
            marcador.golesVisitante >= 0
        );

    }


    // ======================================
    // 06. CALCULAR LA CLASIFICACIÓN
    // ======================================

    function calcularClasificacion() {

        const posiciones = prepararPosiciones();

        const equiposPorId = new Map(
            posiciones.map(function (equipo) {

                return [equipo.id, equipo];

            })
        );

        let partidosJugados = 0;

        let partidosProgramados = 0;


        // RECORRER LAS JORNADAS

        calendario.jornadas.forEach(function (jornada) {

            jornada.partidos.forEach(function (partido) {

                partidosProgramados++;

                const marcador =
                    marcadores[partido.id];


                // OMITIR PARTIDOS SIN RESULTADO

                if (!marcadorValido(marcador)) {
                    return;
                }


                // IDENTIFICAR LOS PARTICIPANTES

                const localId =
                    marcador.local || partido.local;

                const visitanteId =
                    marcador.visitante || partido.visitante;

                const local = equiposPorId.get(
                    localId
                );

                const visitante = equiposPorId.get(
                    visitanteId
                );

                if (!local || !visitante) {
                    return;
                }


                // REGISTRAR PARTIDOS JUGADOS

                partidosJugados++;

                local.pj++;

                visitante.pj++;


                // REGISTRAR LOS GOLES

                local.gf += marcador.golesLocal;

                local.gc += marcador.golesVisitante;

                visitante.gf += marcador.golesVisitante;

                visitante.gc += marcador.golesLocal;


                // VICTORIA DEL LOCAL

                if (
                    marcador.golesLocal >
                    marcador.golesVisitante
                ) {

                    local.g++;

                    local.puntos += 3;

                    visitante.p++;

                }


                // VICTORIA DEL VISITANTE

                else if (
                    marcador.golesLocal <
                    marcador.golesVisitante
                ) {

                    visitante.g++;

                    visitante.puntos += 3;

                    local.p++;

                }


                // EMPATE

                else {

                    local.e++;

                    visitante.e++;

                    local.puntos++;

                    visitante.puntos++;

                }

            });

        });


        // ==================================
        // 07. CALCULAR DIFERENCIA DE GOLES
        // ==================================

        posiciones.forEach(function (equipo) {

            equipo.dg = equipo.gf - equipo.gc;

        });


        // ==================================
        // 08. ORDENAR LAS POSICIONES
        // ==================================

        /*
           Orden provisional:
           1. Mayor cantidad de puntos.
           2. Mayor diferencia de goles.
           3. Mayor cantidad de goles a favor.

           Los criterios definitivos
           dependerán de las bases oficiales.
        */

        posiciones.sort(function (a, b) {

            return (
                b.puntos - a.puntos ||
                b.dg - a.dg ||
                b.gf - a.gf
            );

        });


        return {

            posiciones: posiciones,

            partidosJugados: partidosJugados,

            partidosProgramados: partidosProgramados

        };

    }


    // ======================================
    // 09. CONSTRUIR LA TABLA
    // ======================================

    function mostrarClasificacion() {

        const datos = calcularClasificacion();

        const posiciones = datos.posiciones;

        contenedor.replaceChildren();


        // AVISO DE DEMOSTRACIÓN

        if (datosResultados.demostracion) {

            const aviso = document.createElement("p");

            aviso.className = "plantilla-nota";

            aviso.textContent =
                "Clasificación ilustrativa para " +
                "la presentación del proyecto.";

            aviso.style.marginBottom = "20px";

            contenedor.appendChild(aviso);

        }


        // TABLA

        const tabla = document.createElement("table");

        tabla.className = "clasificacion-tabla";


        // DESCRIPCIÓN PARA ACCESIBILIDAD

        const descripcion =
            document.createElement("caption");

        descripcion.textContent =
            "Clasificación general de la Liguilla";

        tabla.appendChild(descripcion);


        // ENCABEZADOS

        const encabezado =
            document.createElement("thead");

        const filaEncabezado =
            document.createElement("tr");

        const columnas = [

            "#",
            "Equipo",
            "PJ",
            "G",
            "E",
            "P",
            "GF",
            "GC",
            "DG",
            "Pts"

        ];

        columnas.forEach(function (columna) {

            const celda =
                document.createElement("th");

            celda.scope = "col";

            celda.textContent = columna;

            filaEncabezado.appendChild(celda);

        });

        encabezado.appendChild(
            filaEncabezado
        );

        tabla.appendChild(encabezado);


        // FILAS DE LOS EQUIPOS

        const cuerpo =
            document.createElement("tbody");

        posiciones.forEach(function (equipo, indice) {

            const fila =
                document.createElement("tr");


            // RESALTAR AL LÍDER

            if (indice === 0) {

                fila.classList.add(
                    "clasificacion-zona"
                );

            }


            // DATOS DE LA FILA

            const valores = [

                indice + 1,

                equipo.nombre,

                equipo.pj,

                equipo.g,

                equipo.e,

                equipo.p,

                equipo.gf,

                equipo.gc,

                equipo.dg > 0
                    ? "+" + equipo.dg
                    : equipo.dg,

                equipo.puntos

            ];


            // CREAR LAS CELDAS

            valores.forEach(function (valor, posicion) {

                const celda = document.createElement(
                    posicion === 1 ? "th" : "td"
                );

                if (posicion === 1) {

                    celda.scope = "row";

                }

                celda.textContent = valor;

                fila.appendChild(celda);

            });

            cuerpo.appendChild(fila);

        });

        tabla.appendChild(cuerpo);

        contenedor.appendChild(tabla);


        // ==================================
        // 10. ESTADO DE LA COMPETICIÓN
        // ==================================

        const estado = document.createElement("p");

        estado.className = "plantilla-nota";

        estado.textContent =
            "Encuentros disputados: " +
            datos.partidosJugados +
            " de " +
            datos.partidosProgramados + ".";

        contenedor.appendChild(estado);


        // ==================================
        // 11. DETERMINAR SI HAY CAMPEÓN
        // ==================================

        const competicionTerminada =
            datos.partidosProgramados > 0 &&
            datos.partidosJugados ===
            datos.partidosProgramados;


        if (competicionTerminada && posiciones.length > 1) {

            const primero = posiciones[0];

            const segundo = posiciones[1];


            // Evitar declarar un campeón
            // cuando el empate no está resuelto.

            const primerPuestoDefinido =

                primero.puntos !== segundo.puntos ||

                primero.dg !== segundo.dg ||

                primero.gf !== segundo.gf;


            if (primerPuestoDefinido) {

                const anuncio =
                    document.createElement("p");

                anuncio.className =
                    "clasificacion-campeon";

                anuncio.style.marginTop = "25px";

                anuncio.textContent =
                    (datosResultados.demostracion
                        ? "CAMPEÓN · DEMOSTRACIÓN · "
                        : "PRIMER PUESTO · ") +
                    primero.nombre;

                contenedor.appendChild(anuncio);

            }

        }

    }


    // ======================================
    // 12. INICIAR LA CLASIFICACIÓN
    // ======================================

    mostrarClasificacion();

})();
