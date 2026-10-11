
/* ==========================================
   GALVIZ EVENTS
   PRESENTACIÓN DE LOS EQUIPOS

   Este archivo construye las tarjetas
   utilizando los datos de cada categoría.
========================================== */


// 01. IDENTIFICAR LA CATEGORÍA

const paginaCategoria = document.querySelector(
    ".categoria-pagina"
);

const categoriaActual =
    paginaCategoria?.dataset.categoria;


// 02. OBTENER LOS EQUIPOS

const equiposActuales =
    window.GALVIZ_DATOS_EQUIPOS?.[categoriaActual] || [];


// 03. IDENTIFICAR EL CONTENEDOR

const contenedorEquipos = document.getElementById(
    "lista-equipos"
);


// 04. CONSTRUIR LAS TARJETAS

function mostrarEquipos() {

    if (!contenedorEquipos) return;

    contenedorEquipos.replaceChildren();

    equiposActuales.forEach(function (equipo) {

        // TARJETA

        const tarjeta = document.createElement("article");

        tarjeta.className = "equipo-tarjeta";


        // ESCUDO

        const escudo = document.createElement("div");

        escudo.className = "equipo-escudo";

        if (equipo.escudo) {

            const imagen = document.createElement("img");

            imagen.src = equipo.escudo;

            imagen.alt = "Escudo de " + equipo.nombre;

            imagen.loading = "lazy";

            escudo.appendChild(imagen);

        } else {

            escudo.textContent = equipo.sigla;

            escudo.setAttribute("aria-hidden", "true");

        }


        // NOMBRE DEL EQUIPO

        const nombre = document.createElement("h3");

        nombre.className = "equipo-nombre";

        nombre.textContent = equipo.nombre;


        
        // ACCESO A LA PLANTILLA

        const boton = document.createElement("a");

        boton.className = "equipo-enlace";

        boton.textContent = "Ver plantilla →";

        boton.href =
         "plantilla.html?categoria=" +
            encodeURIComponent(categoriaActual) +
        "&equipo=" +
            encodeURIComponent(equipo.id);


        // INCORPORAR ELEMENTOS

        tarjeta.appendChild(escudo);

        tarjeta.appendChild(nombre);

        tarjeta.appendChild(boton);

        contenedorEquipos.appendChild(tarjeta);

    });

}


// 05. MOSTRAR LOS EQUIPOS

mostrarEquipos();
