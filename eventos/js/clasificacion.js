

/* ==========================================

   GALVIZ EVENTS

   CAMPEONATO ANUAL - CLASIFICACIÓN



   Calcula las tablas y muestra las

   semifinales y la gran final.



   Compatible con Libre y Máster.

========================================== */



(function () {



    // ======================================

    // 01. OBTENER LOS DATOS

    // ======================================



    const pagina = document.querySelector(

        ".categoria-pagina"

    );



    if (!pagina) return;



    const categoria = pagina.dataset.categoria;



    const equipos =

        window.GALVIZ_DATOS_EQUIPOS?.[categoria] || [];



    const calendario =

        window.GALVIZ_DATOS_PARTIDOS?.[categoria];



    const datosResultados =

        window.GALVIZ_DATOS_RESULTADOS?.[categoria];



    if (!calendario) return;



    const marcadores =

        datosResultados?.marcadores || {};





    // ======================================

    // 02. CONTENEDORES DE LA PÁGINA

    // ======================================



    const contenedorGrupos = document.getElementById("tablas-grupos");

    const eliminatorias = document.getElementById("cuadro-eliminatorias");



    if (!contenedorGrupos || !eliminatorias) return;





    // ======================================

    // 03. FUNCIONES AUXILIARES

    // ======================================



    function crearElemento(etiqueta, clase, texto) {



        const elemento = document.createElement(

            etiqueta

        );



        if (clase) {

            elemento.className = clase;

        }



        if (texto !== undefined) {

            elemento.textContent = texto;

        }



        return elemento;



    }





    function obtenerEquipo(id) {



        return equipos.find(function (equipo) {



            return equipo.id === id;



        }) || {

            id: id,

            nombre: id || "Por definir",

            sigla: "—"

        };



    }





    function obtenerResultado(partido) {



        if (!partido) return null;



        const resultado = partido.estado === 'finalizado' ? marcadores[partido.id] : null;



        if (!resultado) return null;



        if (

            !Number.isInteger(resultado.golesLocal) ||

            !Number.isInteger(resultado.golesVisitante) ||

            resultado.golesLocal < 0 ||

            resultado.golesVisitante < 0

        ) {

            return null;

        }



        return {

            local: resultado.local || partido.local,

            visitante:

                resultado.visitante || partido.visitante,

            golesLocal: resultado.golesLocal,

            golesVisitante: resultado.golesVisitante,

            penalesLocal: resultado.penalesLocal,

            penalesVisitante: resultado.penalesVisitante,

            clasificado: resultado.clasificado

        };



    }





    // ======================================

    // 04. IDENTIFICAR LOS EQUIPOS POR GRUPO

    // ======================================



    // Acepta "A", "Grupo A", "grupo c", "1", etc. sin imponer un máximo.

    function normalizarGrupo(valor) {

        const nombre = String(valor == null ? "" : valor)

            .trim().replace(/^grupo\s+/i, "").trim();

        return nombre ? "Grupo " + nombre.toLocaleUpperCase("es") : "";

    }



    const grupos = new Map();

    const equiposVisibles = new Set(equipos.map(equipo => equipo.id));

    const grupoDeEquipo = new Map();



    function incorporar(grupo, id) {

        if (!grupo || !id || !equiposVisibles.has(id)) return;

        // La asignación oficial del equipo prevalece sobre el grupo del partido.

        if (grupoDeEquipo.has(id) && grupoDeEquipo.get(id) !== grupo) return;

        if (!grupoDeEquipo.has(id)) grupoDeEquipo.set(id, grupo);

        if (!grupos.has(grupo)) grupos.set(grupo, new Set());

        grupos.get(grupo).add(id);

    }



    equipos.forEach(function (equipo) {

        const grupo = normalizarGrupo(equipo.grupo);

        if (!grupo) return;

        grupoDeEquipo.set(equipo.id, grupo);

        incorporar(grupo, equipo.id);

    });



    // Un partido de grupos puede aportar el grupo de un equipo aún sin asignación.

    // No se crean equipos ficticios ni se muestran equipos sin publicar.

    calendario.jornadas.forEach(function (jornada) {

        jornada.partidos.forEach(function (partido) {

            if (partido.fase !== "grupos") return;

            const grupo = normalizarGrupo(partido.grupo);

            if (!grupo) return;

            incorporar(grupo, partido.local);

            incorporar(grupo, partido.visitante);

        });

    });





    // ======================================

    // 05. CALCULAR LA TABLA DE UN GRUPO

    // ======================================



    function calcularTabla(nombreGrupo) {



        const posiciones = Array.from(

            grupos.get(nombreGrupo) || []

        ).map(function (id) {



            return {

                id: id,

                nombre: obtenerEquipo(id).nombre,

                pj: 0,

                g: 0,

                e: 0,

                p: 0,

                gf: 0,

                gc: 0,

                dg: 0,

                puntos: 0

            };



        });



        const posicionesPorId = new Map(

            posiciones.map(function (equipo) {



                return [equipo.id, equipo];



            })

        );





        // Procesar los encuentros de grupos



        calendario.jornadas

            .filter(function (jornada) {

                return jornada.partidos.some(p => p.fase === "grupos");

            })

            .forEach(function (jornada) {



                jornada.partidos.forEach(function (partido) {



                    if (partido.fase !== "grupos" || normalizarGrupo(partido.grupo) !== nombreGrupo) {

                        return;

                    }



                    const resultado =

                        obtenerResultado(partido);



                    if (!resultado) return;



                    const local = posicionesPorId.get(

                        resultado.local

                    );



                    const visitante = posicionesPorId.get(

                        resultado.visitante

                    );



                    if (!local || !visitante) return;





                    // Partidos jugados



                    local.pj++;

                    visitante.pj++;





                    // Goles a favor y en contra



                    local.gf += resultado.golesLocal;

                    local.gc += resultado.golesVisitante;



                    visitante.gf += resultado.golesVisitante;

                    visitante.gc += resultado.golesLocal;





                    // Victorias, empates y derrotas



                    if (

                        resultado.golesLocal >

                        resultado.golesVisitante

                    ) {



                        local.g++;

                        local.puntos += 3;

                        visitante.p++;



                    } else if (

                        resultado.golesLocal <

                        resultado.golesVisitante

                    ) {



                        visitante.g++;

                        visitante.puntos += 3;

                        local.p++;



                    } else {



                        local.e++;

                        visitante.e++;



                        local.puntos++;

                        visitante.puntos++;



                    }



                });



            });





        // Calcular diferencia de goles



        posiciones.forEach(function (equipo) {



            equipo.dg = equipo.gf - equipo.gc;



        });





        // Orden provisional para la demostración



        posiciones.sort(function (a, b) {



            return (

                b.puntos - a.puntos ||

                b.dg - a.dg ||

                b.gf - a.gf

            );



        });



        return posiciones;



    }





    // ======================================

    // 06. CONSTRUIR UNA TABLA HTML

    // ======================================



    function construirTabla(contenedor, nombreGrupo) {



        const posiciones = calcularTabla(

            nombreGrupo

        );



        const tabla = document.createElement(

            "table"

        );



        tabla.className = "clasificacion-tabla";



        const descripcion = document.createElement(

            "caption"

        );



        descripcion.textContent =

            "Tabla de posiciones del " + nombreGrupo;



        tabla.appendChild(descripcion);





        // Encabezados de las columnas



        const cabecera = document.createElement(

            "thead"

        );



        const filaCabecera = document.createElement(

            "tr"

        );



        const columnas = [

            "#", "Equipo", "PJ", "G", "E",

            "P", "GF", "GC", "DG", "Pts"

        ];



        columnas.forEach(function (columna) {



            const celda = document.createElement(

                "th"

            );



            celda.scope = "col";

            celda.textContent = columna;



            filaCabecera.appendChild(celda);



        });



        cabecera.appendChild(filaCabecera);



        tabla.appendChild(cabecera);





        // Filas de los equipos



        const cuerpo = document.createElement(

            "tbody"

        );



        posiciones.forEach(function (equipo, indice) {



            const fila = document.createElement(

                "tr"

            );



            if (indice < 2) {



                fila.classList.add(

                    "clasificacion-zona"

                );



            }



            const valores = [

                indice + 1,

                equipo.nombre,

                equipo.pj,

                equipo.g,

                equipo.e,

                equipo.p,

                equipo.gf,

                equipo.gc,

                equipo.dg > 0

                    ? "+" + equipo.dg

                    : equipo.dg,

                equipo.puntos

            ];



            valores.forEach(function (valor, posicion) {



                const celda = document.createElement(

                    posicion === 1 ? "th" : "td"

                );



                if (posicion === 1) {

                    celda.scope = "row";

                }



                celda.textContent = valor;



                fila.appendChild(celda);



            });



            cuerpo.appendChild(fila);



        });



        tabla.appendChild(cuerpo);



        contenedor.replaceChildren(tabla);



    }





    // ======================================

    // 07. CONSTRUIR UNA SEMIFINAL

    // ======================================



    function mostrarSemifinal(

        numero,

        partidoIda,

        partidoVuelta

    ) {



        if (!partidoIda) return;



        const ida = obtenerResultado(

            partidoIda

        );



        const vuelta = obtenerResultado(

            partidoVuelta

        );



        // Los participantes serán los del

        // resultado o los del calendario.



        const equipo1 =

            ida?.local || partidoIda.local;



        const equipo2 =

            ida?.visitante || partidoIda.visitante;



        const tarjeta = crearElemento(

            "article",

            "clasificacion-eliminatoria"

        );



        tarjeta.appendChild(

            crearElemento(

                "h4",

                "clasificacion-fase",

                "SEMIFINAL " + numero

            )

        );



        tarjeta.appendChild(

            crearElemento(

                "p",

                "clasificacion-enfrentamiento",

                obtenerEquipo(equipo1).nombre +

                " vs. " +

                obtenerEquipo(equipo2).nombre

            )

        );





        // Resultado de ida



        tarjeta.appendChild(

            crearElemento(

                "p",

                "clasificacion-marcador",

                "Ida: " + (

                    ida

                        ? ida.golesLocal +

                          " - " +

                          ida.golesVisitante

                        : "Pendiente"

                )

            )

        );





        // Resultado de vuelta

        // Mostrarlo en el orden local-visitante

        // correspondiente al partido de vuelta.



        tarjeta.appendChild(

            crearElemento(

                "p",

                "clasificacion-marcador",

                "Vuelta: " + (

                    vuelta

                        ? vuelta.golesLocal +

                          " - " +

                          vuelta.golesVisitante

                        : "Pendiente"

                )

            )

        );





        // Calcular el marcador global



        if (ida && vuelta) {



            const global1 =

                ida.golesLocal +

                (

                    vuelta.local === equipo1

                        ? vuelta.golesLocal

                        : vuelta.golesVisitante

                );



            const global2 =

                ida.golesVisitante +

                (

                    vuelta.local === equipo2

                        ? vuelta.golesLocal

                        : vuelta.golesVisitante

                );



            tarjeta.appendChild(

                crearElemento(

                    "strong",

                    "clasificacion-global",

                    "GLOBAL: " +

                    global1 + " - " + global2

                )

            );



            // No se declara un ganador automático

            // si el global está empatado.

            // El desempate dependerá de las bases.



        } else {



            tarjeta.appendChild(

                crearElemento(

                    "strong",

                    "clasificacion-global",

                    "GLOBAL: Pendiente"

                )

            );



        }



        eliminatorias.appendChild(tarjeta);



    }





    // ======================================

    // 08. CONSTRUIR LA GRAN FINAL

    // ======================================



    function mostrarFinal(partidoFinal) {



        if (!partidoFinal) return;



        const final = obtenerResultado(

            partidoFinal

        );



        const local = obtenerEquipo(

            final?.local || partidoFinal.local

        );



        const visitante = obtenerEquipo(

            final?.visitante || partidoFinal.visitante

        );



        const tarjeta = crearElemento(

            "article",

            "clasificacion-final"

        );



        tarjeta.appendChild(

            crearElemento(

                "h4",

                "clasificacion-fase",

                "GRAN FINAL"

            )

        );



        tarjeta.appendChild(

            crearElemento(

                "p",

                "clasificacion-enfrentamiento",

                local.nombre +

                " vs. " +

                visitante.nombre

            )

        );



        tarjeta.appendChild(

            crearElemento(

                "strong",

                "clasificacion-global",

                final

                    ? final.golesLocal +

                      " - " +

                      final.golesVisitante

                    : "Resultado pendiente"

            )

        );





        // Resolver por marcador, penales o clasificado oficial del panel.

        if (final) {

            let ganador = final.clasificado || '';

            if (!ganador && final.golesLocal !== final.golesVisitante) {

                ganador = final.golesLocal > final.golesVisitante ? local.id : visitante.id;

            }

            if (!ganador && Number.isInteger(final.penalesLocal) &&

                Number.isInteger(final.penalesVisitante) && final.penalesLocal !== final.penalesVisitante) {

                ganador = final.penalesLocal > final.penalesVisitante ? local.id : visitante.id;

            }

            if (final.golesLocal === final.golesVisitante && Number.isInteger(final.penalesLocal) &&

                Number.isInteger(final.penalesVisitante)) {

                tarjeta.appendChild(crearElemento('p','clasificacion-marcador',

                    'Penales: '+final.penalesLocal+' - '+final.penalesVisitante));

            }

            if (ganador === local.id || ganador === visitante.id) {

                tarjeta.appendChild(crearElemento('p','clasificacion-campeon',

                    'CAMPEÓN · '+(ganador===local.id?local.nombre:visitante.nombre)));

            }

        }



        eliminatorias.appendChild(tarjeta);



    }





    // ======================================

    // 09. CUADRO ELIMINATORIO DINÁMICO

    // ======================================



    const todosPartidos = calendario.jornadas.flatMap(j => j.partidos);

    const cuposFase = fase => ({final:2,semifinal:4,cuartos:8,octavos:16,

        dieciseisavos:32}[fase] || (/^ronda_\d+$/.test(fase)?Number(fase.slice(6)):0));

    const nombreFase = fase => ({final:'GRAN FINAL',semifinal:'SEMIFINALES',

        cuartos:'CUARTOS DE FINAL',octavos:'OCTAVOS DE FINAL',

        dieciseisavos:'DIECISEISAVOS DE FINAL'}[fase] ||

        (/^ronda_\d+$/.test(fase)?'RONDA DE '+fase.slice(6):'FASE ELIMINATORIA'));

    function mostrarCruce(partido, numero) {

        const resultado = obtenerResultado(partido);

        const tarjeta = crearElemento('article','clasificacion-eliminatoria');

        tarjeta.appendChild(crearElemento('h4','clasificacion-fase','CRUCE '+numero));

        tarjeta.appendChild(crearElemento('p','clasificacion-enfrentamiento',

            obtenerEquipo(partido.local).nombre+' vs. '+obtenerEquipo(partido.visitante).nombre));

        tarjeta.appendChild(crearElemento('strong','clasificacion-global',

            resultado?resultado.golesLocal+' - '+resultado.golesVisitante:'Resultado pendiente'));

        if(resultado && Number.isInteger(resultado.penalesLocal) && Number.isInteger(resultado.penalesVisitante)) {

            tarjeta.appendChild(crearElemento('p','clasificacion-marcador',

                'Penales: '+resultado.penalesLocal+' - '+resultado.penalesVisitante));

        }

        if(resultado && resultado.clasificado &&

            [partido.local,partido.visitante].includes(resultado.clasificado)) {

            tarjeta.appendChild(crearElemento('p','clasificacion-marcador',

                'Clasificado: '+obtenerEquipo(resultado.clasificado).nombre));

        }

        return tarjeta;

    }

    function vueltaCorrespondiente(ida, vueltas) {

        return vueltas.find(v =>

            (v.local===ida.local && v.visitante===ida.visitante) ||

            (v.local===ida.visitante && v.visitante===ida.local));

    }



    // ======================================

    // 10. MOSTRAR CLASIFICACIÓN Y RONDAS

    // ======================================



    contenedorGrupos.replaceChildren();

    const nombresGrupos = Array.from(grupos.keys()).sort((a,b)=>

        a.localeCompare(b,'es',{numeric:true,sensitivity:'base'}));

    if(!nombresGrupos.length) {

        contenedorGrupos.appendChild(crearElemento('p','gd-aviso',

            'Aún no hay equipos publicados con un grupo asignado.'));

    } else {

        nombresGrupos.forEach(nombreGrupo=>{

            const tarjeta=crearElemento('div','categoria-grupo');

            tarjeta.appendChild(crearElemento('h3','',nombreGrupo.toLocaleUpperCase('es')));

            const tabla=crearElemento('div','categoria-tabla-contenedor');

            construirTabla(tabla,nombreGrupo);

            tarjeta.appendChild(tabla);

            contenedorGrupos.appendChild(tarjeta);

        });

    }

    eliminatorias.replaceChildren();

    const fases=Array.from(new Set(todosPartidos.filter(p=>cuposFase(p.fase)>0).map(p=>p.fase)))

        .sort((a,b)=>cuposFase(b)-cuposFase(a));

    if(!fases.length) {

        const pub = window.GALVIZ_PUBLICACION_DEPORTIVA || {};

        const eds = (pub.ediciones || []).filter(e=>e.competicion==='campeonato');

        const prioridad = {en_curso:3,proximo:2,finalizado:1};

        eds.sort((a,b)=>(prioridad[b.estado]||0)-(prioridad[a.estado]||0)||

            String(b.temporada).localeCompare(String(a.temporada),'es')||String(b.id).localeCompare(String(a.id)));

        const formato = (window.GALVIZ_FORMATOS_ELIMINATORIAS || []).find(f=>

            eds[0] && f.idEdicion===eds[0].id && f.categoria===categoria && f.competicion==='campeonato');

        if(!formato) {

            eliminatorias.appendChild(crearElemento('p','gd-aviso',

                'El formato eliminatorio se publicará cuando la organización lo configure en el panel.'));

        } else {

            const cupos=Number(formato.cupos),porGrupo=Number(formato.porGrupo);

            if(!Number.isInteger(cupos)||cupos<2||cupos>128||!Number.isInteger(porGrupo)||porGrupo<1){

                eliminatorias.appendChild(crearElemento('p','gd-aviso','Formato eliminatorio pendiente de validación.'));

            } else {

                // Proyección pública por posiciones. No muestra nombres de equipos.
                // Los resultados en juego no se incluyen en calcularTabla().
                const gruposOrdenados = nombresGrupos.map(nombre => ({
                    nombre, posiciones: calcularTabla(nombre)
                }));
                const plazas = [];
                for (let puesto = 0; puesto < porGrupo; puesto++) {
                    gruposOrdenados.forEach(g => {
                        if (g.posiciones[puesto]) plazas.push({
                            grupo: g.nombre, puesto: puesto + 1,
                            equipo: g.posiciones[puesto]
                        });
                    });
                }
                const plazasDirectas = plazas.length;
                if (formato.extras === 'mejores_siguientes' && plazas.length < cupos) {
                    const candidatos = gruposOrdenados.flatMap(g =>
                        g.posiciones.slice(porGrupo).map((equipo, i) => ({
                            grupo: g.nombre, puesto: porGrupo + i + 1, equipo
                        })));
                    // Comparación proporcional si los grupos tienen distinta cantidad
                    // de partidos; desempates restantes estables y deterministas.
                    const rendimiento = p => p.equipo.pj ? p.equipo.puntos / p.equipo.pj : 0;
                    const diferencia = p => p.equipo.pj ? p.equipo.dg / p.equipo.pj : 0;
                    const goles = p => p.equipo.pj ? p.equipo.gf / p.equipo.pj : 0;
                    candidatos.sort((a,b) => rendimiento(b)-rendimiento(a) ||
                        diferencia(b)-diferencia(a) || goles(b)-goles(a) ||
                        a.grupo.localeCompare(b.grupo,'es',{numeric:true}) || a.puesto-b.puesto);
                    plazas.push(...candidatos.slice(0,cupos-plazas.length));
                }
                const etiqueta = plaza => plaza ?
                    plaza.puesto + '.º ' + plaza.grupo : 'Cupo pendiente';
                // Orden de cabezas de serie: primero posición en el grupo y luego
                // rendimiento deportivo. Se usa solo para la proyección visual.
                const valor = p => p.equipo.pj ? p.equipo.puntos / p.equipo.pj : 0;
                const dif = p => p.equipo.pj ? p.equipo.dg / p.equipo.pj : 0;
                const favor = p => p.equipo.pj ? p.equipo.gf / p.equipo.pj : 0;
                const sembrados = plazas.slice(0,cupos).sort((a,b) =>
                    a.puesto-b.puesto || valor(b)-valor(a) || dif(b)-dif(a) ||
                    favor(b)-favor(a) || a.grupo.localeCompare(b.grupo,'es',{numeric:true}));
                // Emparejar mitad superior contra mitad inferior. Un matching
                // bipartito busca evitar cruces del mismo grupo globalmente,
                // en vez de usar una elección local que bloquee otros cruces.
                const mitad = Math.ceil(sembrados.length/2);
                const cabezas = sembrados.slice(0,mitad);
                const rivales = sembrados.slice(mitad);
                const asignacion = Array(cabezas.length).fill(-1);
                const usados = Array(rivales.length).fill(false);
                function asignar(i, evitarMismoGrupo) {
                    if (i === cabezas.length) return true;
                    const opciones = rivales.map((r,j)=>j)
                        .filter(j=>!usados[j] && (!evitarMismoGrupo ||
                            rivales[j].grupo !== cabezas[i].grupo))
                        .sort((a,b)=>Math.abs((rivales.length-1-a)-i)-
                            Math.abs((rivales.length-1-b)-i));
                    for (const j of opciones) {
                        usados[j]=true;
                        asignacion[i]=j;
                        if (asignar(i+1,evitarMismoGrupo)) return true;
                        usados[j]=false;
                        asignacion[i]=-1;
                    }
                    return false;
                }
                // Los cuadros normales tienen cupos pares; si faltan equipos,
                // se dejan espacios vacantes sin atribuir clasificados falsos.
                const sinRepeticion = cabezas.length===rivales.length && asignar(0,true);
                if (!sinRepeticion) {
                    usados.fill(false);
                    asignacion.fill(-1);
                    asignar(0,false);
                }
                const parejas = cabezas.map((c,i)=>[c,
                    asignacion[i]>=0 ? rivales[asignacion[i]] : null]);
                while (parejas.length < cupos/2) parejas.push([null,null]);
                if (!sinRepeticion && plazas.length===cupos) {
                    eliminatorias.appendChild(crearElemento('p','gd-aviso',
                        'No es posible evitar todos los cruces entre equipos del mismo grupo con la distribución actual.'));
                }
                const rondas=[];
                for(let n=cupos;n>=2 && Number.isInteger(n);n/=2) rondas.push(n);
                rondas.forEach((n,indiceRonda)=>{
                    const section=crearElemento('section','clasificacion-ronda');
                    section.appendChild(crearElemento('h4','clasificacion-ronda-titulo',
                        nombreFase(({2:'final',4:'semifinal',8:'cuartos',16:'octavos',32:'dieciseisavos'})[n]||'ronda_'+n)));
                    const grid=crearElemento('div','clasificacion-ronda-cruces');
                    for(let i=0;i<n/2;i++){
                        const card=crearElemento('article','clasificacion-eliminatoria');
                        card.appendChild(crearElemento('h4','clasificacion-fase',
                            n===2?'FINAL':'CRUCE '+(i+1)));
                        let nombres;
                        if(indiceRonda===0) {
                            const par=parejas[i];
                            nombres=etiqueta(par[0])+' vs. '+etiqueta(par[1]);
                        } else {
                            nombres='Ganador cruce '+(i*2+1)+' vs. Ganador cruce '+(i*2+2);
                        }
                        card.appendChild(crearElemento('p','clasificacion-enfrentamiento',nombres));
                        grid.appendChild(card);
                    }
                    section.appendChild(grid);
                    eliminatorias.appendChild(section);
                });
                // Un empate total en los criterios visibles requiere desempate oficial.
                // Los nombres son una referencia de tabla, no una clasificación ratificada.
                if(plazasDirectas>cupos) {
                    eliminatorias.prepend(crearElemento('p','gd-aviso',
                        'El formato necesita revisión: los cupos directos superan los disponibles.'));
                }

            }

        }

    }

    fases.forEach(fase=>{

        const seccion=crearElemento('section','clasificacion-ronda');

        seccion.appendChild(crearElemento('h4','clasificacion-ronda-titulo',nombreFase(fase)));

        const rejilla=crearElemento('div','clasificacion-ronda-cruces');

        const partidos=todosPartidos.filter(p=>p.fase===fase);

        if(fase==='semifinal') {

            const idas=partidos.filter(p=>String(p.jornada)==='1');

            const vueltas=partidos.filter(p=>String(p.jornada)==='2');

            idas.forEach((ida,i)=>{

                // Se conserva la lógica existente de ida y vuelta.

                const antes=eliminatorias;

                // mostrarSemifinal escribe en eliminatorias; trasladamos la tarjeta al grupo visual.

                mostrarSemifinal(i+1,ida,vueltaCorrespondiente(ida,vueltas));

                const tarjeta=antes.lastElementChild;

                if(tarjeta)rejilla.appendChild(tarjeta);

            });

            // No inventar una ida si únicamente se publicó la vuelta.

            if(!idas.length) rejilla.appendChild(crearElemento('p','gd-aviso','Semifinales pendientes de publicación.'));

        }else if(fase==='final') {

            partidos.forEach(partido=>{

                mostrarFinal(partido);

                const tarjeta=eliminatorias.lastElementChild;

                if(tarjeta)rejilla.appendChild(tarjeta);

            });

        }else {

            partidos.forEach((partido,i)=>rejilla.appendChild(mostrarCruce(partido,i+1)));

        }

        seccion.appendChild(rejilla);

        eliminatorias.appendChild(seccion);

    });

})();
