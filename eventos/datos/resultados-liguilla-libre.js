
/* ==========================================
   GALVIZ EVENTS
   LIGUILLA - CATEGORÍA LIBRE

   RESULTADOS DE LA COMPETICIÓN

   Los resultados ilustrativos son exclusivos
   para la presentación del proyecto.

   Los resultados oficiales se registrarán
   individualmente cuando se disputen
   los encuentros.
========================================== */

(function () {

    // ======================================
    // 01. CONFIGURACIÓN GENERAL
    // ======================================

    window.GALVIZ_DATOS_RESULTADOS =
        window.GALVIZ_DATOS_RESULTADOS || {};

    const categoria = "liguilla-libre";

    const calendario =
        window.GALVIZ_DATOS_PARTIDOS?.[categoria];

    if (!calendario) return;


    // ======================================
    // 02. MODO DE DEMOSTRACIÓN
    // ======================================

    /*
       true:
       Muestra resultados ficticios para
       presentar el funcionamiento de la web.

       false:
       Muestra únicamente los resultados
       registrados en el apartado 03.
    */

    const modoDemostracion = true;


    // ======================================
    // 03. RESULTADOS OFICIALES
    // ======================================

    /*
       Cuando comience la competición,
       registraremos los marcadores aquí.

       Ejemplo de formato:

       LL01: {
           golesLocal: 2,
           golesVisitante: 1
       }

       Por ahora, no existen resultados
       oficiales y el objeto permanece vacío.
    */

    const resultadosOficiales = {

    };


    // ======================================
    // 04. GENERAR RESULTADOS ILUSTRATIVOS
    // ======================================

    function generarDemostracion() {

        const marcadores = {};

        calendario.jornadas.forEach(function (jornada) {

            jornada.partidos.forEach(function (partido) {

                const numeroLocal = Number(
                    partido.local.replace("ll-", "")
                );

                const numeroVisitante = Number(
                    partido.visitante.replace("ll-", "")
                );


                // En el ejemplo, los equipos
                // con identificadores menores
                // tienen mejores resultados.

                const ganaLocal =
                    numeroLocal < numeroVisitante;


                // Alternamos los marcadores
                // para dar variedad al prototipo.

                const golesGanador =
                    (numeroLocal + numeroVisitante) % 2
                    === 0 ? 1 : 2;


                marcadores[partido.id] = {

                    golesLocal:
                        ganaLocal ? golesGanador : 0,

                    golesVisitante:
                        ganaLocal ? 0 : golesGanador

                };

            });

        });

        return marcadores;

    }


    // ======================================
    // 05. SELECCIONAR LOS RESULTADOS
    // ======================================

    const marcadores = modoDemostracion
        ? generarDemostracion()
        : resultadosOficiales;


    // ======================================
    // 06. GUARDAR LOS DATOS
    // ======================================

    window.GALVIZ_DATOS_RESULTADOS[categoria] = {

        demostracion: modoDemostracion,

        marcadores: marcadores

    };

})();
