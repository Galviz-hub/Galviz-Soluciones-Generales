
/* ==========================================
   GALVIZ EVENTS
   CAMPEONATO ANUAL - CATEGORÍA MÁSTER

   RESULTADOS ILUSTRATIVOS

   Los identificadores M01 a M17 corresponden
   a los encuentros de partidos-master.js.

   Los datos se actualizarán conforme
   se disputen los encuentros oficiales.
========================================== */


// 01. PREPARAR EL ALMACENAMIENTO DE DATOS

window.GALVIZ_DATOS_RESULTADOS =
    window.GALVIZ_DATOS_RESULTADOS || {};


// 02. MARCADORES DE LA CATEGORÍA MÁSTER

window.GALVIZ_DATOS_RESULTADOS.master = {

    demostracion: true,

    marcadores: {

        // ==================================
        // DÍA 1 - FASE DE GRUPOS
        // ==================================

        M01: { golesLocal: 2, golesVisitante: 0 },

        M02: { golesLocal: 1, golesVisitante: 0 },

        M03: { golesLocal: 2, golesVisitante: 0 },

        M04: { golesLocal: 1, golesVisitante: 0 },


        // ==================================
        // DÍA 2 - FASE DE GRUPOS
        // ==================================

        M05: { golesLocal: 2, golesVisitante: 1 },

        M06: { golesLocal: 2, golesVisitante: 0 },

        M07: { golesLocal: 1, golesVisitante: 0 },

        M08: { golesLocal: 2, golesVisitante: 0 },


        // ==================================
        // DÍA 3 - FASE DE GRUPOS
        // ==================================

        M09: { golesLocal: 3, golesVisitante: 1 },

        M10: { golesLocal: 2, golesVisitante: 1 },

        M11: { golesLocal: 2, golesVisitante: 1 },

        M12: { golesLocal: 2, golesVisitante: 1 },


        // ==================================
        // DÍA 4 - SEMIFINALES DE IDA
        // ==================================

        M13: {
            local: "master-01",
            visitante: "master-06",
            golesLocal: 2,
            golesVisitante: 0
        },

        M14: {
            local: "master-05",
            visitante: "master-02",
            golesLocal: 1,
            golesVisitante: 0
        },


        // ==================================
        // DÍA 5 - SEMIFINALES DE VUELTA
        // ==================================

        M15: {
            local: "master-06",
            visitante: "master-01",
            golesLocal: 1,
            golesVisitante: 1
        },

        M16: {
            local: "master-02",
            visitante: "master-05",
            golesLocal: 1,
            golesVisitante: 2
        },


        // ==================================
        // DÍA 6 - GRAN FINAL
        // ==================================

        M17: {
            local: "master-01",
            visitante: "master-05",
            golesLocal: 2,
            golesVisitante: 1
        }

    }

};
