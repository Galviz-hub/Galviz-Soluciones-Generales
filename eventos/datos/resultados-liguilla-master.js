
/* ==========================================
   GALVIZ EVENTS
   LIGUILLA - CATEGORÍA MÁSTER

   RESULTADOS DE LA COMPETICIÓN

   Los resultados ilustrativos se utilizan
   exclusivamente para la presentación.

   Los marcadores oficiales se registrarán
   conforme se disputen los encuentros.
========================================== */

(function () {

    // ======================================
    // 01. CONFIGURACIÓN GENERAL
    // ======================================

    window.GALVIZ_DATOS_RESULTADOS =
        window.GALVIZ_DATOS_RESULTADOS || {};

    const categoria = "liguilla-master";

    const calendario =
        window.GALVIZ_DATOS_PARTIDOS?.[categoria];

    if (!calendario) return;


    // ======================================
    // 02. MODO DE DEMOSTRACIÓN
    // ======================================

    /*
       true:
       Genera los 66 resultados ficticios
       para mostrar el funcionamiento.

       false:
       Utiliza únicamente los resultados
       registrados en el apartado 03.
    */

    const modoDemostracion = true;


    // ======================================
    // 03. RESULTADOS OFICIALES
    // ======================================

    /*
       Cuando comience la competición,
       registraremos los resultados aquí.

       Ejemplo de formato:

       LM01: {
           golesLocal: 2,
           golesVisitante: 1
       }

       Por ahora no existen resultados
       oficiales.
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
                    partido.local.replace("lm-", "")
                );

                const numeroVisitante = Number(
                    partido.visitante.replace("lm-", "")
                );


                // En el prototipo, los equipos
                // con identificadores menores
                // obtienen mejores resultados.

                const ganaLocal =
                    numeroLocal < numeroVisitante;


                // Alternar los marcadores
                // entre 1-0 y 2-0.

                const golesGanador =
                    (numeroLocal + numeroVisitante) % 2
                    === 0 ? 1 : 2;


                // REGISTRAR EL MARCADOR

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
