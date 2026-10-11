
/* ==========================================
   GALVIZ EVENTS
   CONTROL VISUAL DE LAS TRANSMISIONES

   Este archivo lee la configuración
   de eventos/datos/transmisiones.js.
========================================== */

(function () {

    // ======================================
    // 01. LEER LA CONFIGURACIÓN
    // ======================================

    const configuracion =
        window.GALVIZ_TRANSMISION || {};

    const estadosPermitidos = [
        "inactivo",
        "programado",
        "en-vivo"
    ];

    const estado = estadosPermitidos.includes(
        configuracion.estado
    )
        ? configuracion.estado
        : "inactivo";


    // ======================================
    // 02. IDENTIFICAR LOS ELEMENTOS
    // ======================================

    const panel = document.getElementById(
        "estado-transmision"
    );

    const etiqueta = document.getElementById(
        "etiqueta-estado"
    );

    const titulo = document.getElementById(
        "titulo-estado"
    );

    const descripcion = document.getElementById(
        "descripcion-estado"
    );

    if (
        !panel ||
        !etiqueta ||
        !titulo ||
        !descripcion
    ) {
        return;
    }


    // ======================================
    // 03. INFORMACIÓN SEGÚN EL ESTADO
    // ======================================

    const contenido = {

        inactivo: {

            etiqueta: "SIN TRANSMISIÓN ACTIVA",

            titulo: "PRÓXIMAMENTE EN DIRECTO",

            descripcion:
                "Actualmente no tenemos una " +
                "transmisión en curso. " +
                "Cuando se programe un evento, " +
                "publicaremos aquí la información."

        },

        programado: {

            etiqueta: "PRÓXIMA TRANSMISIÓN",

            titulo: "TRANSMISIÓN PROGRAMADA",

            descripcion:
                "Estamos preparando una nueva " +
                "transmisión. Próximamente " +
                "compartiremos más información."

        },

        "en-vivo": {

            etiqueta: "TRANSMISIÓN EN VIVO",

            titulo: "ESTAMOS EN DIRECTO",

            descripcion:
                "Acompáñanos y disfruta " +
                "de nuestra transmisión."

        }

    };


    // ======================================
    // 04. ACTUALIZAR EL PANEL
    // ======================================

    const informacion = contenido[estado];

    panel.dataset.estado = estado;

    etiqueta.textContent =
        informacion.etiqueta;

    titulo.textContent =
        configuracion.titulo ||
        informacion.titulo;

    descripcion.textContent =
        configuracion.descripcion ||
        informacion.descripcion;


    // ======================================
    // 05. VALIDAR EL ENLACE
    // ======================================

    function obtenerEnlaceSeguro(valor) {

        if (typeof valor !== "string") {
            return null;
        }

        try {

            const direccion = new URL(valor);

            if (
                direccion.protocol === "https:" ||
                direccion.protocol === "http:"
            ) {

                return direccion.href;

            }

        } catch (error) {

            return null;

        }

        return null;

    }


    // ======================================
    // 06. CREAR EL ACCESO A LA TRANSMISIÓN
    // ======================================

    const enlace = obtenerEnlaceSeguro(
        configuracion.enlace
    );

    if (estado === "en-vivo" && enlace) {

        const boton = document.createElement(
            "a"
        );

        boton.className =
            "transmisiones-ver-directo";

        boton.href = enlace;

        boton.target = "_blank";

        boton.rel = "noopener noreferrer";

        boton.textContent =
            "VER TRANSMISIÓN →";

        panel.appendChild(boton);

    }

})();
