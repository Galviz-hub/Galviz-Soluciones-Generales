
// ==========================================
// GALVIZ EVENTS
// NAVEGACIÓN GENERAL
// ==========================================


// 01. IDENTIFICAR LOS ELEMENTOS

const encabezado = document.getElementById("encabezado");

const botonMenu = document.getElementById("boton-menu");

const menuPrincipal = document.getElementById("menu-principal");


// 02. CAMBIAR EL FONDO AL DESPLAZARSE

function actualizarEncabezado() {

    if (!encabezado) return;

    if (window.scrollY > 40) {
        encabezado.classList.add("desplazado");
    } else {
        encabezado.classList.remove("desplazado");
    }

}

window.addEventListener("scroll", actualizarEncabezado);

actualizarEncabezado();


// 03. ABRIR Y CERRAR EL MENÚ MÓVIL

if (botonMenu && menuPrincipal) {

    botonMenu.addEventListener("click", function () {

        const estaAbierto =
            menuPrincipal.classList.toggle("abierto");

        botonMenu.setAttribute(
            "aria-expanded",
            String(estaAbierto)
        );

        botonMenu.setAttribute(
            "aria-label",
            estaAbierto ? "Cerrar menú" : "Abrir menú"
        );

    });


    // 04. CERRAR EL MENÚ AL SELECCIONAR UN ENLACE

    const enlaces = menuPrincipal.querySelectorAll("a");

    enlaces.forEach(function (enlace) {

        enlace.addEventListener("click", function () {

            menuPrincipal.classList.remove("abierto");

            botonMenu.setAttribute("aria-expanded", "false");

            botonMenu.setAttribute("aria-label", "Abrir menú");

        });

    });

}
