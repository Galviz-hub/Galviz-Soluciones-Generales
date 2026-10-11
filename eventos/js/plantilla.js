
/* ==========================================
   GALVIZ EVENTS
   FICHA INDIVIDUAL DEL EQUIPO
========================================== */


// 01. IDENTIFICAR EL EQUIPO SOLICITADO

const parametros = new URLSearchParams(
    window.location.search
);

const categoria = parametros.get("categoria");

const equipoId = parametros.get("equipo");


// 02. OBTENER LOS DATOS

const equipos = (
    window.GALVIZ_DATOS_EQUIPOS?.[categoria] || []
);

const equipo = equipos.find(function (elemento) {

    return elemento.id === equipoId;

});


// 03. IDENTIFICAR LOS ELEMENTOS DE LA PÁGINA

const nombreElemento = document.getElementById(
    "plantilla-nombre"
);

const escudoElemento = document.getElementById(
    "plantilla-escudo"
);

const categoriaElemento = document.getElementById(
    "plantilla-categoria"
);

const listaJugadores = document.getElementById(
    "lista-jugadores"
);

const notaElemento = document.getElementById(
    "plantilla-nota"
);

const enlaceVolver = document.getElementById(
    "volver-categoria"
);


// 04. CONFIGURAR EL ENLACE PARA REGRESAR

if (categoria === "liguilla-libre") {

    enlaceVolver.href = "liguilla-libre.html";

} else if (categoria === "liguilla-master") {

    enlaceVolver.href = "liguilla-master.html";

} else if (categoria === "master") {

    enlaceVolver.href = "master.html";

} else {

    enlaceVolver.href = "libre.html";

}


// 05. MOSTRAR LOS DATOS DEL EQUIPO

if (equipo) {

    // 05.1 NOMBRE Y CATEGORÍA

    nombreElemento.textContent = equipo.nombre;

    

// IDENTIFICAR LA COMPETICIÓN Y LA MODALIDAD

if (categoria === "liguilla-libre") {

    categoriaElemento.textContent =
        "Liguilla · Categoría Libre · Fútbol 7";

} else if (categoria === "liguilla-master") {

    categoriaElemento.textContent =
        "Liguilla · Categoría Máster · Fútbol 6";

} else if (categoria === "master") {

    categoriaElemento.textContent =
        "Campeonato Anual · Categoría Máster";

} else {

    categoriaElemento.textContent =
        "Campeonato Anual · Categoría Libre";

}


    document.title =
        equipo.nombre + " | Galviz Events";


    // 05.2 ESCUDO DEL EQUIPO

    if (equipo.escudo) {

        const imagen = document.createElement("img");

        imagen.src = equipo.escudo;

        imagen.alt = "Escudo de " + equipo.nombre;

        escudoElemento.appendChild(imagen);

    } else {

        escudoElemento.textContent = equipo.sigla;

        escudoElemento.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    // 05.3 OBTENER LA PLANTILLA

    let jugadores;

    if (Array.isArray(equipo.plantilla)) {

        // Utilizar los datos del equipo.
        jugadores = equipo.plantilla;

        notaElemento.textContent = "";

    } else {
        jugadores = [];
        notaElemento.textContent = "";
    }



    // 05.4 CONSTRUIR LA LISTA DE JUGADORES

    listaJugadores.replaceChildren();

    jugadores.forEach(function (jugador, indice) {

        const fila = document.createElement("li");

        fila.className = "plantilla-jugador";


        const numero = document.createElement("span");

        numero.className = "plantilla-numero";

        numero.textContent = jugador && typeof jugador === "object" && jugador.numero !== null
            ? String(jugador.numero).padStart(2, "0")
            : "—";


        const nombre = document.createElement("span");

        nombre.className = "plantilla-jugador-nombre";

        nombre.textContent = jugador && typeof jugador === "object"
            ? jugador.nombre + (jugador.posicion ? " · " + jugador.posicion : "")
            : String(jugador);


        fila.appendChild(numero);

        fila.appendChild(nombre);

        listaJugadores.appendChild(fila);

    });


    // AVISO SI LA PLANTILLA ESTÁ VACÍA

    if (jugadores.length === 0) {

        notaElemento.textContent =
            "La plantilla todavía no está disponible.";

    }

} else {

    // 06. EQUIPO NO ENCONTRADO

    nombreElemento.textContent =
        "EQUIPO NO ENCONTRADO";

    categoriaElemento.textContent =
        "No se encontró el equipo solicitado.";

    notaElemento.textContent = "";

    document.title =
        "Equipo no encontrado | Galviz Events";

}
