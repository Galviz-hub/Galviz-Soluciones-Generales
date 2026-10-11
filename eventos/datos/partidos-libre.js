
/* ==========================================
   GALVIZ EVENTS
   CAMPEONATO ANUAL - CATEGORÍA LIBRE

   CALENDARIO DE PARTIDOS

   DATOS ILUSTRATIVOS PARA LA PRESENTACIÓN
========================================== */


// 01. ORGANIZACIÓN DE LOS DATOS

window.GALVIZ_DATOS_PARTIDOS =
    window.GALVIZ_DATOS_PARTIDOS || {};


// 02. CALENDARIO DE LA CATEGORÍA LIBRE

window.GALVIZ_DATOS_PARTIDOS.libre = {

    demostracion: true,

    jornadas: [

        // ==================================
        // DÍA 1 - FASE DE GRUPOS
        // ==================================

        {
            dia: 1,
            nombre: "DÍA 1",
            fase: "Fase de grupos",
            fecha: null,

            partidos: [

                {
                    id: "L01",
                    grupo: "Grupo A",
                    local: "libre-01",
                    visitante: "libre-02",
                    hora: null
                },

                {
                    id: "L02",
                    grupo: "Grupo A",
                    local: "libre-03",
                    visitante: "libre-04",
                    hora: null
                },

                {
                    id: "L03",
                    grupo: "Grupo B",
                    local: "libre-05",
                    visitante: "libre-06",
                    hora: null
                },

                {
                    id: "L04",
                    grupo: "Grupo B",
                    local: "libre-07",
                    visitante: "libre-08",
                    hora: null
                }

            ]
        },


        // ==================================
        // DÍA 2 - FASE DE GRUPOS
        // ==================================

        {
            dia: 2,
            nombre: "DÍA 2",
            fase: "Fase de grupos",
            fecha: null,

            partidos: [

                {
                    id: "L05",
                    grupo: "Grupo A",
                    local: "libre-01",
                    visitante: "libre-03",
                    hora: null
                },

                {
                    id: "L06",
                    grupo: "Grupo A",
                    local: "libre-02",
                    visitante: "libre-04",
                    hora: null
                },

                {
                    id: "L07",
                    grupo: "Grupo B",
                    local: "libre-05",
                    visitante: "libre-07",
                    hora: null
                },

                {
                    id: "L08",
                    grupo: "Grupo B",
                    local: "libre-06",
                    visitante: "libre-08",
                    hora: null
                }

            ]
        },


        // ==================================
        // DÍA 3 - FASE DE GRUPOS
        // ==================================

        {
            dia: 3,
            nombre: "DÍA 3",
            fase: "Fase de grupos",
            fecha: null,

            partidos: [

                {
                    id: "L09",
                    grupo: "Grupo A",
                    local: "libre-01",
                    visitante: "libre-04",
                    hora: null
                },

                {
                    id: "L10",
                    grupo: "Grupo A",
                    local: "libre-02",
                    visitante: "libre-03",
                    hora: null
                },

                {
                    id: "L11",
                    grupo: "Grupo B",
                    local: "libre-05",
                    visitante: "libre-08",
                    hora: null
                },

                {
                    id: "L12",
                    grupo: "Grupo B",
                    local: "libre-06",
                    visitante: "libre-07",
                    hora: null
                }

            ]
        },


        // ==================================
        // DÍA 4 - SEMIFINALES DE IDA
        // ==================================

        {
            dia: 4,
            nombre: "DÍA 4",
            fase: "Semifinales de ida",
            fecha: null,

            partidos: [

                {
                    id: "L13",
                    grupo: "Semifinal 1 - Ida",
                    local: "1.º Grupo A",
                    visitante: "2.º Grupo B",
                    hora: null
                },

                {
                    id: "L14",
                    grupo: "Semifinal 2 - Ida",
                    local: "1.º Grupo B",
                    visitante: "2.º Grupo A",
                    hora: null
                }

            ]
        },


        // ==================================
        // DÍA 5 - SEMIFINALES DE VUELTA
        // ==================================

        {
            dia: 5,
            nombre: "DÍA 5",
            fase: "Semifinales de vuelta",
            fecha: null,

            partidos: [

                {
                    id: "L15",
                    grupo: "Semifinal 1 - Vuelta",
                    local: "2.º Grupo B",
                    visitante: "1.º Grupo A",
                    hora: null
                },

                {
                    id: "L16",
                    grupo: "Semifinal 2 - Vuelta",
                    local: "2.º Grupo A",
                    visitante: "1.º Grupo B",
                    hora: null
                }

            ]
        },


        // ==================================
        // DÍA 6 - GRAN FINAL
        // ==================================

        {
            dia: 6,
            nombre: "DÍA 6",
            fase: "Gran final",
            fecha: null,

            partidos: [

                {
                    id: "L17",
                    grupo: "Gran final",
                    local: "Ganador Semifinal 1",
                    visitante: "Ganador Semifinal 2",
                    hora: null
                }

            ],

            ceremonia: true
        }

    ]

};
