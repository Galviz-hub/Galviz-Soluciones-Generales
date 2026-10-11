
/* ==========================================
   GALVIZ EVENTS
   CAMPEONATO ANUAL - CATEGORÍA LIBRE

   RESULTADOS ILUSTRATIVOS

   Para actualizar un resultado, modifica
   únicamente los goles del partido.

   Los identificadores L01 a L17 corresponden
   al archivo partidos-libre.js.
========================================== */


window.GALVIZ_DATOS_RESULTADOS =
    window.GALVIZ_DATOS_RESULTADOS || {};


window.GALVIZ_DATOS_RESULTADOS.libre = {

    demostracion: true,

    marcadores: {

        // ==================================
        // DÍA 1 - FASE DE GRUPOS
        // ==================================

        L01: { golesLocal: 2, golesVisitante: 0 },
        L02: { golesLocal: 1, golesVisitante: 0 },
        L03: { golesLocal: 2, golesVisitante: 0 },
        L04: { golesLocal: 1, golesVisitante: 0 },


        // ==================================
        // DÍA 2 - FASE DE GRUPOS
        // ==================================

        L05: { golesLocal: 2, golesVisitante: 1 },
        L06: { golesLocal: 2, golesVisitante: 0 },
        L07: { golesLocal: 1, golesVisitante: 0 },
        L08: { golesLocal: 2, golesVisitante: 0 },


        // ==================================
        // DÍA 3 - FASE DE GRUPOS
        // ==================================

        L09: { golesLocal: 3, golesVisitante: 1 },
        L10: { golesLocal: 2, golesVisitante: 1 },
        L11: { golesLocal: 2, golesVisitante: 1 },
        L12: { golesLocal: 2, golesVisitante: 1 },


        // ==================================
        // DÍA 4 - SEMIFINALES DE IDA
        // ==================================

        L13: {
            local: "libre-01",
            visitante: "libre-06",
            golesLocal: 2,
            golesVisitante: 0
        },

        L14: {
            local: "libre-05",
            visitante: "libre-02",
            golesLocal: 1,
            golesVisitante: 0
        },


        // ==================================
        // DÍA 5 - SEMIFINALES DE VUELTA
        // ==================================

        L15: {
            local: "libre-06",
            visitante: "libre-01",
            golesLocal: 1,
            golesVisitante: 1
        },

        L16: {
            local: "libre-02",
            visitante: "libre-05",
            golesLocal: 1,
            golesVisitante: 2
        },


        // ==================================
        // DÍA 6 - GRAN FINAL
        // ==================================

        L17: {
            local: "libre-01",
            visitante: "libre-05",
            golesLocal: 2,
            golesVisitante: 1
        }

    }

};
