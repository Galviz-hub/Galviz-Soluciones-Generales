
// ==========================================
// GALVIZ EVENTS
// CAMPEONATO ANUAL
// CONTROL DE LAS PESTAÑAS PRINCIPALES
// ==========================================


// 01. IDENTIFICAR LAS PESTAÑAS Y LOS PANELES

const pestanasCampeonato = document.querySelectorAll(
    ".campeonato-pestana"
);

const panelesCampeonato = document.querySelectorAll(
    ".campeonato-panel"
);


// 02. FUNCIÓN PARA CAMBIAR DE PESTAÑA

function mostrarPestana(nombre, moverFoco = false) {

    // Actualizar los botones

    pestanasCampeonato.forEach(function (pestana) {

        const seleccionada =
            pestana.dataset.pestana === nombre;

        pestana.classList.toggle(
            "activa",
            seleccionada
        );

        pestana.setAttribute(
            "aria-selected",
            String(seleccionada)
        );

        pestana.tabIndex = seleccionada ? 0 : -1;

        if (seleccionada && moverFoco) {
            pestana.focus();
        }

    });


    // Mostrar únicamente el panel seleccionado

    panelesCampeonato.forEach(function (panel) {

        const seleccionado =
            panel.dataset.panel === nombre;

        panel.hidden = !seleccionado;

    });

}


// 03. CAMBIAR DE PESTAÑA AL HACER CLIC

pestanasCampeonato.forEach(function (pestana) {

    pestana.addEventListener("click", function () {

        const nombre = pestana.dataset.pestana;

        mostrarPestana(nombre);

    });

});


// 04. NAVEGACIÓN MEDIANTE EL TECLADO

pestanasCampeonato.forEach(function (pestana, indice) {

    pestana.addEventListener("keydown", function (evento) {

        let nuevoIndice = indice;

        if (evento.key === "ArrowRight") {

            nuevoIndice =
                (indice + 1) % pestanasCampeonato.length;

        } else if (evento.key === "ArrowLeft") {

            nuevoIndice =
                (indice - 1 + pestanasCampeonato.length)
                % pestanasCampeonato.length;

        } else if (evento.key === "Home") {

            nuevoIndice = 0;

        } else if (evento.key === "End") {

            nuevoIndice = pestanasCampeonato.length - 1;

        } else {

            return;

        }

        evento.preventDefault();

        const nuevaPestana =
            pestanasCampeonato[nuevoIndice];

        mostrarPestana(
            nuevaPestana.dataset.pestana,
            true
        );

    });

});


// 05. MOSTRAR INFORMACIÓN AL INICIAR

mostrarPestana("informacion");

// Si una portada enlaza directamente a Categorías, activar también su pestaña.
document.querySelectorAll('[data-gd-abrir="categorias"]').forEach(function(enlace) {
    enlace.addEventListener('click', function() {
        mostrarPestana('categorias');
    });
});
