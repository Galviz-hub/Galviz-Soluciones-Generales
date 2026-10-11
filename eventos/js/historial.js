
/* ==========================================
   GALVIZ EVENTS
   PRESENTACIÓN DEL HISTORIAL

   Muestra únicamente los registros
   oficiales marcados como publicados.
========================================== */

(function () {

    // ======================================
    // 01. OBTENER LOS DATOS
    // ======================================

    const datos = window.GALVIZ_HISTORIAL || {};

    const campeonato = datos.campeonato || [];

    const liguilla = datos.liguilla || [];


    // ======================================
    // 02. IDENTIFICAR LOS CONTENEDORES
    // ======================================

    const contenedorCampeonato =
        document.getElementById(
            "historial-campeonato"
        );

    const contenedorLiguilla =
        document.getElementById(
            "historial-liguilla"
        );


    // ======================================
    // 03. CREAR ELEMENTOS
    // ======================================

    function crearElemento(etiqueta, clase, texto) {

        const elemento = document.createElement(
            etiqueta
        );

        if (clase) {
            elemento.className = clase;
        }

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;

    }


    // ======================================
    // 04. CREAR UN RECONOCIMIENTO
    // ======================================

    function crearReconocimiento(
        etiqueta,
        valor,
        esCampeon = false
    ) {

        const contenedor = crearElemento(
            "div",
            esCampeon
                ? "historial-reconocimiento historial-reconocimiento-campeon"
                : "historial-reconocimiento"
        );

        contenedor.appendChild(
            crearElemento("span", "", etiqueta)
        );

        contenedor.appendChild(
            crearElemento("strong", "", valor)
        );

        return contenedor;

    }


    // ======================================
    // 05. HISTORIAL DEL CAMPEONATO ANUAL
    // ======================================

    function mostrarCampeonato() {

        if (!contenedorCampeonato) return;

        const registros = campeonato
            .filter(function (registro) {

                return (
                    registro.publicado === true &&
                    registro.anio &&
                    registro.categoria &&
                    registro.campeon &&
                    registro.subcampeon &&
                    registro.marcadorFinal
                );

            })
            .sort(function (a, b) {

                return b.anio - a.anio;

            });


        // Conservar el mensaje inicial
        // mientras no existan registros.

        if (registros.length === 0) return;

        contenedorCampeonato.replaceChildren();


        registros.forEach(function (registro) {

            const tarjeta = crearElemento(
                "article",
                "historial-tarjeta"
            );


            // AÑO Y COMPETICIÓN

            tarjeta.appendChild(
                crearElemento(
                    "p",
                    "historial-anio",
                    "EDICIÓN " + registro.anio
                )
            );

            tarjeta.appendChild(
                crearElemento(
                    "h3",
                    "historial-titulo",
                    "Campeonato Anual"
                )
            );

            tarjeta.appendChild(
                crearElemento(
                    "span",
                    "historial-categoria",
                    "CATEGORÍA " +
                    registro.categoria.toUpperCase()
                )
            );


            // RECONOCIMIENTOS

            const reconocimientos = crearElemento(
                "div",
                "historial-reconocimientos"
            );

            reconocimientos.appendChild(
                crearReconocimiento(
                    "CAMPEÓN",
                    registro.campeon,
                    true
                )
            );

            reconocimientos.appendChild(
                crearReconocimiento(
                    "SUBCAMPEÓN",
                    registro.subcampeon
                )
            );

            reconocimientos.appendChild(
                crearReconocimiento(
                    "RESULTADO DE LA FINAL",
                    registro.marcadorFinal
                )
            );

            if (registro.goleador) {

                const detalleGoleador =
                    registro.goles !== undefined
                        ? registro.goleador +
                          " · " +
                          registro.goles +
                          " goles"
                        : registro.goleador;

                reconocimientos.appendChild(
                    crearReconocimiento(
                        "MÁXIMO GOLEADOR",
                        detalleGoleador
                    )
                );

            }

            tarjeta.appendChild(
                reconocimientos
            );

            contenedorCampeonato.appendChild(
                tarjeta
            );

        });

    }


    // ======================================
    // 06. HISTORIAL DE LA LIGUILLA
    // ======================================

    function mostrarLiguilla() {

        if (!contenedorLiguilla) return;

        const registros = liguilla
            .filter(function (registro) {

                return (
                    registro.publicado === true &&
                    registro.anio &&
                    registro.categoria &&
                    Array.isArray(registro.posiciones) &&
                    registro.posiciones.length >= 5 &&
                    registro.posiciones
                        .slice(0, 5)
                        .every(function (posicion) {

                            return (
                                posicion.equipo &&
                                Number.isFinite(
                                    posicion.puntos
                                )
                            );

                        })
                );

            })
            .sort(function (a, b) {

                return b.anio - a.anio;

            });


        // Conservar el mensaje inicial
        // mientras no existan registros.

        if (registros.length === 0) return;

        contenedorLiguilla.replaceChildren();


        registros.forEach(function (registro) {

            const tarjeta = crearElemento(
                "article",
                "historial-tarjeta"
            );


            // TEMPORADA Y CATEGORÍA

            tarjeta.appendChild(
                crearElemento(
                    "p",
                    "historial-anio",
                    "TEMPORADA " + registro.anio
                )
            );

            tarjeta.appendChild(
                crearElemento(
                    "h3",
                    "historial-titulo",
                    "Liguilla"
                )
            );

            tarjeta.appendChild(
                crearElemento(
                    "span",
                    "historial-categoria",
                    "CATEGORÍA " +
                    registro.categoria.toUpperCase()
                )
            );


            // TABLA DE LOS CINCO PRIMEROS

            const tablaContenedor = crearElemento(
                "div",
                "historial-tabla-contenedor"
            );

            const tabla = crearElemento(
                "table",
                "historial-tabla"
            );

            const cabecera = document.createElement(
                "thead"
            );

            const filaCabecera = document.createElement(
                "tr"
            );

            ["#", "Equipo", "Pts"].forEach(
                function (titulo) {

                    filaCabecera.appendChild(
                        crearElemento(
                            "th",
                            "",
                            titulo
                        )
                    );

                }
            );

            cabecera.appendChild(filaCabecera);

            tabla.appendChild(cabecera);


            // POSICIONES

            const cuerpo = document.createElement(
                "tbody"
            );

            registro.posiciones
                .slice(0, 5)
                .forEach(function (posicion, indice) {

                    const fila = document.createElement(
                        "tr"
                    );

                    if (indice === 0) {

                        fila.className =
                            "historial-tabla-campeon";

                    }

                    fila.appendChild(
                        crearElemento(
                            "td",
                            "",
                            indice + 1
                        )
                    );

                    fila.appendChild(
                        crearElemento(
                            "td",
                            "",
                            posicion.equipo
                        )
                    );

                    fila.appendChild(
                        crearElemento(
                            "td",
                            "",
                            posicion.puntos
                        )
                    );

                    cuerpo.appendChild(fila);

                });

            tabla.appendChild(cuerpo);

            tablaContenedor.appendChild(tabla);

            tarjeta.appendChild(
                tablaContenedor
            );


            // RECONOCIMIENTOS

            const reconocimientos = crearElemento(
                "div",
                "historial-reconocimientos"
            );

            reconocimientos.appendChild(
                crearReconocimiento(
                    "CAMPEÓN",
                    registro.posiciones[0].equipo,
                    true
                )
            );

            if (registro.goleador) {

                const detalleGoleador =
                    registro.goles !== undefined
                        ? registro.goleador +
                          " · " +
                          registro.goles +
                          " goles"
                        : registro.goleador;

                reconocimientos.appendChild(
                    crearReconocimiento(
                        "MÁXIMO GOLEADOR",
                        detalleGoleador
                    )
                );

            }

            tarjeta.appendChild(
                reconocimientos
            );

            contenedorLiguilla.appendChild(
                tarjeta
            );

        });

    }


    // ======================================
    // 07. INICIAR EL HISTORIAL
    // ======================================

    mostrarCampeonato();

    mostrarLiguilla();

})();
