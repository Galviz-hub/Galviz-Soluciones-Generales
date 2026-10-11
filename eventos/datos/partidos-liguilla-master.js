
/* ==========================================
   GALVIZ EVENTS
   LIGUILLA - CATEGORÍA MÁSTER

   CALENDARIO DE COMPETICIÓN

   Sistema de liga a una sola vuelta:
   - 12 equipos
   - 11 jornadas
   - 6 encuentros por jornada
   - 66 partidos en total

   Datos ilustrativos para la presentación.
========================================== */

(function () {

    // ======================================
    // 01. PREPARAR EL ALMACENAMIENTO
    // ======================================

    window.GALVIZ_DATOS_PARTIDOS =
        window.GALVIZ_DATOS_PARTIDOS || {};


    // ======================================
    // 02. IDENTIFICADORES DE LOS EQUIPOS
    // ======================================

    const equipos = [

        "lm-01",
        "lm-02",
        "lm-03",
        "lm-04",
        "lm-05",
        "lm-06",
        "lm-07",
        "lm-08",
        "lm-09",
        "lm-10",
        "lm-11",
        "lm-12"

    ];


    // ======================================
    // 03. FECHAS DE LAS JORNADAS
    // ======================================

    /*
       Cuando tengamos las fechas oficiales,
       podremos registrarlas aquí.

       Ejemplo:
       1: "15/11/2026"

       Por ahora, todas están pendientes.
    */

    const fechas = {

        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null

    };


    // ======================================
    // 04. HORARIOS DE LOS PARTIDOS
    // ======================================

    /*
       Aquí podremos establecer un horario
       diferente para cada encuentro.

       Ejemplo:
       LM01: "09:00",
       LM02: "10:00"

       No añadiremos horarios ficticios.
    */

    const horarios = {

    };


    // ======================================
    // 05. GENERAR EL CALENDARIO
    // ======================================

    function generarCalendario() {

        const jornadas = [];

        // Copia de los equipos para organizar
        // los enfrentamientos sin alterar
        // sus identificadores originales.

        const orden = [...equipos];

        let numeroPartido = 1;


        // GENERAR LAS 11 JORNADAS

        for (let dia = 1; dia <= 11; dia++) {

            const partidos = [];


            // GENERAR LOS SEIS ENCUENTROS

            for (let i = 0; i < 6; i++) {

                const primero = orden[i];

                const segundo = orden[11 - i];


                // Alternar la localía del
                // primer enfrentamiento.

                let local = primero;

                let visitante = segundo;

                if (i === 0 && dia % 2 === 0) {

                    local = segundo;

                    visitante = primero;

                }


                // IDENTIFICADOR DEL PARTIDO

                const id = "LM" +
                    String(numeroPartido).padStart(
                        2,
                        "0"
                    );


                // REGISTRAR EL ENCUENTRO

                partidos.push({

                    id: id,

                    grupo: "Jornada " + dia,

                    local: local,

                    visitante: visitante,

                    hora: horarios[id] || null

                });


                numeroPartido++;

            }


            // REGISTRAR LA JORNADA

            jornadas.push({

                dia: dia,

                nombre: "JORNADA " + dia,

                fase: "Fase de liga",

                fecha: fechas[dia] || null,

                partidos: partidos

            });


            // ROTACIÓN DE LOS EQUIPOS
            // El primero permanece fijo.

            const ultimo = orden.pop();

            orden.splice(1, 0, ultimo);

        }

        return jornadas;

    }


    // ======================================
    // 06. GUARDAR LOS DATOS
    // ======================================

    window.GALVIZ_DATOS_PARTIDOS[
        "liguilla-master"
    ] = {

        demostracion: true,

        jornadas: generarCalendario()

    };

})();
