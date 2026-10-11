
/* ==========================================
   GALVIZ EVENTS
   RESULTADOS DEL CAMPEONATO ANUAL

   Compatible con Libre y Máster.
========================================== */

(function () {

    // ======================================
    // 01. OBTENER LA CATEGORÍA Y SUS DATOS
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

    const resultados =
        window.GALVIZ_DATOS_RESULTADOS?.[categoria];

    if (!calendario || !resultados) return;

    const marcadores = resultados.marcadores || {};


    // ======================================
    // 02. IDENTIFICAR LOS CONTENEDORES
    // ======================================

    const destacado = document.getElementById(
        "ultimo-resultado"
    );

    const selector = document.getElementById(
        "selector-resultados"
    );

    const lista = document.getElementById(
        "lista-resultados"
    );

    if (!destacado || !selector || !lista) return;


    // ======================================
    // 03. FUNCIONES AUXILIARES
    // ======================================

    function crearElemento(etiqueta, clase, texto) {

        const elemento = document.createElement(etiqueta);

        if (clase) elemento.className = clase;

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;

    }


    function obtenerEquipo(id) {

        return equipos.find(function (equipo) {

            return equipo.id === id;

        }) || {
            id: null,
            nombre: id || "Por definir",
            sigla: "—",
            escudo: null
        };

    }


    function crearParticipante(equipo) {

        const participante = crearElemento(
            "div",
            "resultado-participante"
        );

        const escudo = crearElemento(
            "div",
            "partido-escudo"
        );

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

        const nombre = crearElemento(
            "span",
            "resultado-equipo-nombre",
            equipo.nombre
        );

        participante.appendChild(escudo);
        participante.appendChild(nombre);

        return participante;

    }


    // ======================================
    // 04. OBTENER UN RESULTADO
    // ======================================

    function obtenerResultado(partido) {

        const marcador = marcadores[partido.id];

        if (!marcador) return null;

        const golesValidos =
            Number.isInteger(marcador.golesLocal) &&
            Number.isInteger(marcador.golesVisitante) &&
            marcador.golesLocal >= 0 &&
            marcador.golesVisitante >= 0;

        if (!golesValidos) return null;

        return {

            local: obtenerEquipo(
                marcador.local || partido.local
            ),

            visitante: obtenerEquipo(
                marcador.visitante || partido.visitante
            ),

            golesLocal: marcador.golesLocal,

            golesVisitante: marcador.golesVisitante

        };

    }


    // ======================================
    // 05. CREAR EL MARCADOR VISUAL
    // ======================================

    function crearMarcador(resultado) {

        const enfrentamiento = crearElemento(
            "div",
            "resultado-enfrentamiento"
        );

        const marcador = crearElemento(
            "strong",
            "resultado-marcador",
            resultado.golesLocal +
            " - " +
            resultado.golesVisitante
        );

        enfrentamiento.appendChild(
            crearParticipante(resultado.local)
        );

        enfrentamiento.appendChild(marcador);

        enfrentamiento.appendChild(
            crearParticipante(resultado.visitante)
        );

        return enfrentamiento;

    }


    function agregarDetalles(destino, partido) {
        const detalles = [partido.fecha, partido.hora, partido.escenario].filter(Boolean);
        if (detalles.length) destino.appendChild(crearElemento('p','partido-horario',detalles.join(' · ')));
        if (partido.estado === 'en_juego') {
            const a = crearElemento('a','galviz-en-vivo','● EN VIVO · VER TRANSMISIONES');
            a.href = '../transmisiones.html';
            destino.appendChild(a);
        }
    }

    // ======================================
    // 06. ÚLTIMO ENCUENTRO
    // ======================================

    function mostrarUltimoEncuentro() {

        destacado.replaceChildren();

        const encuentros = [];

        calendario.jornadas.forEach(function (jornada) {

            jornada.partidos.forEach(function (partido) {

                const resultado = obtenerResultado(partido);

                if (resultado) {

                    encuentros.push({
                        jornada,
                        partido,
                        resultado
                    });

                }

            });

        });


        // NO EXISTEN RESULTADOS

        if (encuentros.length === 0) {

            destacado.appendChild(
                crearElemento(
                    "p",
                    "resultado-sin-datos",
                    "Los resultados estarán disponibles " +
                    "cuando comience el campeonato."
                )
            );

            return;

        }


        // ÚLTIMO RESULTADO REGISTRADO

        const ultimo = encuentros.filter(x=>x.partido.estado==='en_juego').at(-1) || encuentros[encuentros.length - 1];

        const etiqueta = crearElemento(
            "p",
            "partido-destacado-etiqueta",
            resultados.demostracion
                ? "ÚLTIMO ENCUENTRO · DEMOSTRACIÓN"
                : "ÚLTIMO ENCUENTRO"
        );

        const fase = crearElemento(
            "p",
            "partido-fase",
            ultimo.partido.grupo
        );

        const estado = crearElemento(
            "p",
            "resultado-estado",
            ultimo.partido.estado === 'en_juego' ? 'EN VIVO' : 'Finalizado'
        );

        destacado.appendChild(etiqueta);

        destacado.appendChild(fase);

        destacado.appendChild(
            crearMarcador(ultimo.resultado)
        );

        destacado.appendChild(estado);
        agregarDetalles(destacado, ultimo.partido);

    }


    // ======================================
    // 07. CREAR UNA TARJETA DE RESULTADO
    // ======================================

    function crearTarjeta(partido) {

        const resultado = obtenerResultado(partido);

        if (!resultado) return null;

        const tarjeta = crearElemento(
            "article",
            "resultado-tarjeta"
        );

        const fase = crearElemento(
            "p",
            "partido-fase",
            partido.grupo
        );

        const estado = crearElemento(
            "p",
            "resultado-estado",
            resultados.demostracion
                ? "Finalizado · Demostración"
                : partido.estado === 'en_juego' ? 'EN VIVO' : 'Finalizado'
        );

        tarjeta.appendChild(fase);

        tarjeta.appendChild(
            crearMarcador(resultado)
        );

        tarjeta.appendChild(estado);
        agregarDetalles(tarjeta, partido);

        return tarjeta;

    }


    // ======================================
    // 08. CORONACIÓN Y RECONOCIMIENTOS
    // ======================================

    function mostrarCoronacion(jornada) {

        if (!jornada.ceremonia) return;

        const partidoFinal = jornada.partidos[0];

        const final = obtenerResultado(partidoFinal);

        if (!final) return;

        const ceremonia = crearElemento(
            "div",
            "resultado-coronacion"
        );

        const titulo = crearElemento(
            "h3",
            "",
            "CORONACIÓN Y RECONOCIMIENTOS"
        );

        ceremonia.appendChild(titulo);

        if (final.golesLocal !== final.golesVisitante) {

            const campeon =
                final.golesLocal > final.golesVisitante
                    ? final.local
                    : final.visitante;

            ceremonia.appendChild(
                crearParticipante(campeon)
            );

            ceremonia.appendChild(
                crearElemento(
                    "p",
                    "resultado-campeon",
                    "CAMPEÓN · " + campeon.nombre
                )
            );

        }

        lista.appendChild(ceremonia);

    }


    // ======================================
    // 09. MOSTRAR LOS RESULTADOS POR DÍA
    // ======================================

    function mostrarJornada(numeroDia) {

        const jornada = calendario.jornadas.find(
            function (elemento) {

                return elemento.dia === numeroDia;

            }
        );

        if (!jornada) return;

        lista.replaceChildren();

        lista.appendChild(
            crearElemento(
                "h3",
                "resultados-jornada-titulo",
                jornada.nombre + " · " + jornada.fase
            )
        );

        let cantidad = 0;

        jornada.partidos.forEach(function (partido) {

            const tarjeta = crearTarjeta(partido);

            if (tarjeta) {

                lista.appendChild(tarjeta);

                cantidad++;

            }

        });


        if (cantidad === 0) {

            lista.appendChild(
                crearElemento(
                    "p",
                    "resultado-sin-datos",
                    "Todavía no hay resultados " +
                    "disponibles para esta jornada."
                )
            );

        }

        mostrarCoronacion(jornada);


        // RESALTAR EL DÍA SELECCIONADO

        selector.querySelectorAll("button").forEach(
            function (boton) {

                const activo =
                    Number(boton.dataset.dia) === numeroDia;

                boton.classList.toggle("activo", activo);

                boton.setAttribute(
                    "aria-pressed",
                    String(activo)
                );

            }
        );

    }


    // ======================================
    // 10. CREAR EL SELECTOR DE DÍAS
    // ======================================

    calendario.jornadas.forEach(function (jornada) {

        const boton = crearElemento(
            "button",
            "jornada-boton",
            jornada.nombre
        );

        boton.type = "button";

        boton.dataset.dia = jornada.dia;

        boton.addEventListener("click", function () {

            mostrarJornada(jornada.dia);

        });

        selector.appendChild(boton);

    });


    // ======================================
    // 11. INICIAR RESULTADOS
    // ======================================

    mostrarUltimoEncuentro();

    const jornadasConResultados =
        calendario.jornadas.filter(function (jornada) {

            return jornada.partidos.some(function (partido) {

                return obtenerResultado(partido) !== null;

            });

        });

    const jornadaViva = jornadasConResultados.find(j => j.partidos.some(p => p.estado === 'en_juego'));
    const diaInicial = jornadaViva ? jornadaViva.dia : jornadasConResultados.length
        ? jornadasConResultados[jornadasConResultados.length - 1].dia : 1;

    mostrarJornada(diaInicial);

})();
