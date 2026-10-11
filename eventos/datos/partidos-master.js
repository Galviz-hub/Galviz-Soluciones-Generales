
/* ==========================================
   GALVIZ EVENTS
   CAMPEONATO ANUAL - CATEGORÍA MÁSTER

   CALENDARIO DE PARTIDOS

   Datos ilustrativos para la presentación.
   Aquí actualizaremos las fechas,
   los horarios y los enfrentamientos.
========================================== */


// 01. PREPARAR EL ALMACENAMIENTO DE DATOS

window.GALVIZ_DATOS_PARTIDOS =
    window.GALVIZ_DATOS_PARTIDOS || {};


// 02. CALENDARIO DE LA CATEGORÍA MÁSTER

window.GALVIZ_DATOS_PARTIDOS.master = {

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
                    id: "M01",
                    grupo: "Grupo A",
                    local: "master-01",
                    visitante: "master-02",
                    hora: null
                },

                {
                    id: "M02",
                    grupo: "Grupo A",
                    local: "master-03",
                    visitante: "master-04",
                    hora: null
                },

                {
                    id: "M03",
                    grupo: "Grupo B",
                    local: "master-05",
                    visitante: "master-06",
                    hora: null
                },

                {
                    id: "M04",
                    grupo: "Grupo B",
                    local: "master-07",
                    visitante: "master-08",
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
                    id: "M05",
                    grupo: "Grupo A",
                    local: "master-01",
                    visitante: "master-03",
                    hora: null
                },

                {
                    id: "M06",
                    grupo: "Grupo A",
                    local: "master-02",
                    visitante: "master-04",
                    hora: null
                },

                {
                    id: "M07",
                    grupo: "Grupo B",
                    local: "master-05",
                    visitante: "master-07",
                    hora: null
                },

                {
                    id: "M08",
                    grupo: "Grupo B",
                    local: "master-06",
                    visitante: "master-08",
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
                    id: "M09",
                    grupo: "Grupo A",
                    local: "master-01",
                    visitante: "master-04",
                    hora: null
                },

                {
                    id: "M10",
                    grupo: "Grupo A",
                    local: "master-02",
                    visitante: "master-03",
                    hora: null
                },

                {
                    id: "M11",
                    grupo: "Grupo B",
                    local: "master-05",
                    visitante: "master-08",
                    hora: null
                },

                {
                    id: "M12",
                    grupo: "Grupo B",
                    local: "master-06",
                    visitante: "master-07",
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
                    id: "M13",
                    grupo: "Semifinal 1 - Ida",
                    local: "1.º Grupo A",
                    visitante: "2.º Grupo B",
                    hora: null
                },

                {
                    id: "M14",
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
                    id: "M15",
                    grupo: "Semifinal 1 - Vuelta",
                    local: "2.º Grupo B",
                    visitante: "1.º Grupo A",
                    hora: null
                },

                {
                    id: "M16",
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
                    id: "M17",
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
