
/* ==========================================
   GALVIZ EVENTS
   CONFIGURACIÓN DE LAS TRANSMISIONES

   Modifica este archivo cuando tengamos
   una transmisión programada o en directo.
========================================== */


window.GALVIZ_TRANSMISION = {

    // ======================================
    // 01. ESTADO DE LA TRANSMISIÓN
    // ======================================

    /*
       Estados disponibles:

       "inactivo"   → Sin transmisión activa
       "programado" → Próximamente
       "en-vivo"    → Transmitiendo en directo
    */

    estado: "inactivo",


    // ======================================
    // 02. INFORMACIÓN DEL EVENTO
    // ======================================

    titulo: "",

    descripcion: "",


    // ======================================
    // 03. ENLACE DE LA TRANSMISIÓN
    // ======================================

    /*
       Introduce aquí la dirección completa
       de Kick, Twitch o TikTok.

       Ejemplo:
       "https://www.twitch.tv/nombre-del-canal"

       Por ahora, no tenemos un enlace oficial.
    */

    enlace: null

};
