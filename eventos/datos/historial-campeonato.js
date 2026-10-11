
/* ==========================================
   GALVIZ EVENTS
   HISTORIAL DEL CAMPEONATO ANUAL

   Aquí registraremos las ediciones
   oficialmente concluidas.

   Cada categoría tendrá su propio registro.
========================================== */


// 01. PREPARAR EL ALMACENAMIENTO

window.GALVIZ_HISTORIAL =
    window.GALVIZ_HISTORIAL || {};


// 02. EDICIONES DEL CAMPEONATO ANUAL

window.GALVIZ_HISTORIAL.campeonato = [

    /*
       Cuando concluya una edición,
       incorporaremos un registro con
       la siguiente estructura:

       {
           anio: 2027,
           categoria: "Libre",
           campeon: "Nombre del equipo",
           subcampeon: "Nombre del equipo",
           marcadorFinal: "2 - 1",
           goleador: "Nombre del jugador",
           goles: 8,
           publicado: true
       }

       La categoría puede ser:
       "Libre" o "Máster".

       El año y los valores anteriores
       son únicamente ejemplos del formato,
       no resultados oficiales.

       No añadiremos registros hasta
       que las ediciones hayan concluido.
    */

];
