
/* ==========================================
   GALVIZ EVENTS
   HISTORIAL DE LA LIGUILLA

   Aquí registraremos las temporadas
   oficialmente concluidas.

   Cada categoría tendrá su propio registro.
========================================== */


// 01. PREPARAR EL ALMACENAMIENTO

window.GALVIZ_HISTORIAL =
    window.GALVIZ_HISTORIAL || {};


// 02. TEMPORADAS DE LA LIGUILLA

window.GALVIZ_HISTORIAL.liguilla = [

    /*
       Cuando concluya una temporada,
       incorporaremos un registro con
       la siguiente estructura:

       {
           anio: 2027,
           categoria: "Libre",

           posiciones: [

               { equipo: "Equipo 1", puntos: 33 },
               { equipo: "Equipo 2", puntos: 28 },
               { equipo: "Equipo 3", puntos: 25 },
               { equipo: "Equipo 4", puntos: 22 },
               { equipo: "Equipo 5", puntos: 19 }

           ],

           goleador: "Nombre del jugador",
           goles: 12,

           publicado: true
       }

       La categoría puede ser:
       "Libre" o "Máster".

       Los nombres, puntos y año anteriores
       son ejemplos de la estructura.
       No son resultados oficiales.

       La primera posición corresponde
       al campeón de la temporada.
    */

];
