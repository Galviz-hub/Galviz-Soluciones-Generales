
/* ==========================================
   GALVIZ EVENTS
   ACCESO A LOS CANALES OFICIALES

   Este archivo lee la configuración
   de eventos/datos/canales.js.
========================================== */

(function () {

    // ======================================
    // 01. OBTENER LA CONFIGURACIÓN
    // ======================================

    const canales =
        window.GALVIZ_CANALES || {};


    // ======================================
    // 02. DOMINIOS PERMITIDOS
    // ======================================

    const dominios = {

        kick: "kick.com",

        twitch: "twitch.tv",

        tiktok: "tiktok.com"

    };


    // ======================================
    // 03. VALIDAR CADA ENLACE
    // ======================================

    function validarEnlace(valor, plataforma) {

        if (typeof valor !== "string") {
            return null;
        }

        try {

            const direccion = new URL(
                valor
            );

            const dominioPermitido =
                dominios[plataforma];

            const nombreDominio =
                direccion.hostname.toLowerCase();

            const dominioCorrecto =
                nombreDominio === dominioPermitido ||
                nombreDominio.endsWith(
                    "." + dominioPermitido
                );

            if (
                direccion.protocol === "https:" &&
                dominioCorrecto &&
                direccion.pathname !== "/"
            ) {

                return direccion.href;

            }

        } catch (error) {

            return null;

        }

        return null;

    }


    // ======================================
    // 04. IDENTIFICAR LAS TARJETAS
    // ======================================

    const tarjetas = document.querySelectorAll(
        ".transmisiones-canal[data-canal]"
    );


    // ======================================
    // 05. ACTUALIZAR LOS ACCESOS
    // ======================================

    tarjetas.forEach(function (tarjeta) {

        const plataforma =
            tarjeta.dataset.canal;

        const configuracion =
            canales[plataforma];

        const pendiente = tarjeta.querySelector(
            ".transmisiones-canal-pendiente"
        );

        if (!configuracion || !pendiente) {
            return;
        }

        const enlace = validarEnlace(
            configuracion.enlace,
            plataforma
        );

        // Conservar el estado pendiente
        // mientras no exista un enlace válido.

        if (!enlace) {
            return;
        }


        // CREAR EL BOTÓN

        const boton = document.createElement(
            "a"
        );

        boton.className =
            "transmisiones-canal-enlace";

        boton.href = enlace;

        boton.target = "_blank";

        boton.rel =
            "noopener noreferrer";

        boton.textContent =
            "VISITAR CANAL →";


        // REEMPLAZAR EL TEXTO PENDIENTE

        pendiente.replaceWith(boton);

    });

})();
