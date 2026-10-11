
/* ==========================================
   GALVIZ EVENTS
   CATEGORÍAS: LIBRE Y MÁSTER

   CONTROL DE LAS PESTAÑAS
========================================== */


// ==========================================
// 01. IDENTIFICAR LOS ELEMENTOS
// ==========================================

const pestanasCategoria = document.querySelectorAll(
    ".categoria-pestana"
);

const panelesCategoria = document.querySelectorAll(
    ".categoria-panel"
);


// ==========================================
// 02. FUNCIÓN PARA CAMBIAR DE PESTAÑA
// ==========================================

function mostrarPestanaCategoria(nombre, moverFoco = false) {

    // 02.1 ACTUALIZAR LOS BOTONES

    pestanasCategoria.forEach(function (pestana) {

        const seleccionada =
            pestana.dataset.pestana === nombre;

        // Cambiar el diseño de la pestaña

        pestana.classList.toggle(
            "activa",
            seleccionada
        );

        // Actualizar los atributos de accesibilidad

        pestana.setAttribute(
            "aria-selected",
            String(seleccionada)
        );

        pestana.tabIndex = seleccionada ? 0 : -1;

        // Mover el foco si se utiliza el teclado

        if (seleccionada && moverFoco) {
            pestana.focus();
        }

    });


    // 02.2 MOSTRAR EL CONTENIDO CORRESPONDIENTE

    panelesCategoria.forEach(function (panel) {

        const seleccionado =
            panel.dataset.panel === nombre;

        panel.hidden = !seleccionado;

    });

}


// ==========================================
// 03. CAMBIAR DE PESTAÑA CON EL RATÓN
// ==========================================

pestanasCategoria.forEach(function (pestana) {

    pestana.addEventListener("click", function () {

        const nombre = pestana.dataset.pestana;

        mostrarPestanaCategoria(nombre);

    });

});


// ==========================================
// 04. NAVEGACIÓN CON EL TECLADO
// ==========================================

pestanasCategoria.forEach(function (pestana, indice) {

    pestana.addEventListener("keydown", function (evento) {

        let nuevoIndice = indice;

        // Flecha derecha

        if (evento.key === "ArrowRight") {

            nuevoIndice =
                (indice + 1) % pestanasCategoria.length;

        }

        // Flecha izquierda

        else if (evento.key === "ArrowLeft") {

            nuevoIndice =
                (indice - 1 + pestanasCategoria.length)
                % pestanasCategoria.length;

        }

        // Primera pestaña

        else if (evento.key === "Home") {

            nuevoIndice = 0;

        }

        // Última pestaña

        else if (evento.key === "End") {

            nuevoIndice = pestanasCategoria.length - 1;

        }

        else {

            return;

        }

        evento.preventDefault();

        const nuevaPestana =
            pestanasCategoria[nuevoIndice];

        mostrarPestanaCategoria(
            nuevaPestana.dataset.pestana,
            true
        );

    });

});


// ==========================================
// 05. MOSTRAR EQUIPOS AL INICIAR
// ==========================================

if (pestanasCategoria.length > 0) {

    mostrarPestanaCategoria("equipos");

}
