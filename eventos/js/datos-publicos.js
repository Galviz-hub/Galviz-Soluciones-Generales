/* GALVIZ EVENTS - CONEXIÓN 3: SOLO DATOS PUBLICADOS (sin datos de demostración).
   Funciona con Live Server y con GitHub Pages a través de JSONP de Apps Script.
   El proyecto receptor de Inscripciones conserva su doPost y su ruta normal doGet.
*/
(function () {
  'use strict';
  const ENDPOINT='https://script.google.com/macros/s/AKfycbza3Wo5YYSInp0pwuGy24Kzv2LzWU3J1D1c-4Vag_wI7oz_GHL1sneKE8RduJ4_dPlT/exec';
  const raiz=document.querySelector('.categoria-pagina');
  const clave=raiz && raiz.dataset.categoria;
  const esPlantilla=location.pathname.endsWith('/plantilla.html');
  const esHistorial=location.pathname.endsWith('/historial.html');
  const esLiguilla=location.pathname.endsWith('/liguilla.html');
  const esCampeonato=location.pathname.endsWith('/campeonato.html');
  const claves=['libre','master','liguilla-libre','liguilla-master'];
  const compDe=k=>k.startsWith('liguilla-')?'liguilla':'campeonato';
  const catDe=k=>k.endsWith('master')?'master':'libre';
  const aviso=(texto)=>{
    const target=document.getElementById('lista-equipos') || document.getElementById('historial-campeonato') ||
      document.querySelector('.liguilla-informacion') || document.querySelector('.campeonato-panel');
    if(target){const p=document.createElement('p');p.className='gd-aviso';p.textContent=texto;target.prepend(p);}
  };
  function cargarJSONP(){
    return new Promise((resolve,reject)=>{
      const nombre='galvizPublico'+Math.random().toString(36).slice(2,14);
      const script=document.createElement('script');let finalizado=false;
      const limpiar=()=>{delete window[nombre];script.remove();clearTimeout(tiempo);};
      const terminar=(err,datos)=>{if(finalizado)return;finalizado=true;limpiar();err?reject(err):resolve(datos);};
      window[nombre]=datos=>terminar(null,datos);
      const tiempo=setTimeout(()=>terminar(new Error('Tiempo de espera agotado')),18000);
      script.onerror=()=>terminar(new Error('No se pudo conectar con los datos deportivos'));
      script.src=ENDPOINT+'?modulo=deportes&callback='+nombre+'&_='+Date.now();
      document.head.appendChild(script);
    });
  }
  const texto=v=>String(v==null?'':v).trim();
  const numero=v=>Number.isInteger(v)&&v>=0?v:null;
  function edicionActual(datos,competicion){
    const eds=datos.ediciones.filter(e=>e.competicion===competicion);
    const peso=e=>({en_curso:3,proximo:2,finalizado:1}[e.estado]||0);
    eds.sort((a,b)=>peso(b)-peso(a)||texto(b.temporada).localeCompare(texto(a.temporada),'es')||texto(b.id).localeCompare(texto(a.id)));
    return eds[0]||null;
  }
  function sigla(nombre){return texto(nombre).split(/\s+/).slice(0,3).map(x=>x[0]||'').join('').toUpperCase()||'EQ';}
  function equipoPublico(e,jugadores){return {
    id:e.id,nombre:e.nombre,sigla:sigla(e.nombre),escudo:e.escudo||null,grupo:e.grupo||'',
    plantilla:jugadores.filter(j=>j.idEquipo===e.id).map(j=>({
      nombre:j.nombre,numero:j.numero,posicion:j.posicion
    }))
  };}
  function gruposCalendario(partidos,competicion){
    const cantidad=f=>({dieciseisavos:32,octavos:16,cuartos:8,semifinal:4,final:2}[f]||
      (/^ronda_\d+$/.test(f)?Number(f.slice(6)):0));
    const prioridad=f=>f==='grupos'||f==='jornada'?0:cantidad(f)?200-cantidad(f):300;
    const etiqueta=f=>({grupos:'Fase de grupos',semifinal:'Semifinales',final:'Gran final',
      cuartos:'Cuartos de final',octavos:'Octavos de final',dieciseisavos:'Dieciseisavos'}[f]||
      (/^ronda_\d+$/.test(f)?'Ronda de '+f.slice(6):'Fase por definir'));
    const ordenados=partidos.slice().sort((a,b)=>
      prioridad(a.fase)-prioridad(b.fase)||
      (Number(a.jornada)||0)-(Number(b.jornada)||0)||
      texto(a.fecha).localeCompare(texto(b.fecha))||texto(a.hora).localeCompare(texto(b.hora))||texto(a.id).localeCompare(texto(b.id)));
    const grupos=[];const indice=new Map();
    ordenados.forEach(p=>{
      const clave=[p.fase,p.jornada,p.fecha].join('|');
      if(!indice.has(clave)){
        const dia=grupos.length+1;
        const titulo=competicion==='liguilla'?'Liga':etiqueta(p.fase);
        const nombre=competicion==='liguilla'?'JORNADA '+(p.jornada||dia):
          p.fase==='grupos'?'DÍA '+(p.jornada||dia):
          p.fase==='semifinal'?'SEMIFINAL · '+(p.jornada==='2'?'VUELTA':'IDA'):
          etiqueta(p.fase).toLocaleUpperCase('es');
        indice.set(clave,grupos.length);
        grupos.push({dia,nombre,fase:titulo,fecha:p.fecha||null,partidos:[]});
      }
      grupos[indice.get(clave)].partidos.push({
        id:p.id,grupo:p.grupo?('Grupo '+texto(p.grupo).replace(/^grupo\s+/i,'').trim()):'',local:p.local||'',visitante:p.visitante||'',
        hora:p.hora||null,escenario:p.escenario||'',fase:p.fase,jornada:p.jornada,estado:p.estado||'programado',golesLocal:p.golesLocal,golesVisitante:p.golesVisitante,fecha:p.fecha||null
      });
    });
    return {demostracion:false,jornadas:grupos};
  }
  function marcadores(partidos){
    const obj={};partidos.forEach(p=>{
      if(['finalizado','en_juego'].includes(p.estado)&&numero(p.golesLocal)!==null&&numero(p.golesVisitante)!==null){
        obj[p.id]={local:p.local,visitante:p.visitante,golesLocal:p.golesLocal,golesVisitante:p.golesVisitante,
          penalesLocal:p.penalesLocal,penalesVisitante:p.penalesVisitante,clasificado:p.clasificado,estado:p.estado};
      }
    });return {demostracion:false,marcadores:obj};
  }
  function tablaLiga(equipos,partidos,desempates){
    const tabla=new Map(equipos.map(e=>[e.id,{id:e.id,equipo:e.nombre,puntos:0,gf:0,gc:0,pj:0}]));
    partidos.filter(p=>p.estado==='finalizado'&&numero(p.golesLocal)!==null&&numero(p.golesVisitante)!==null).forEach(p=>{
      const a=tabla.get(p.local),b=tabla.get(p.visitante);if(!a||!b)return;
      a.pj++;b.pj++;a.gf+=p.golesLocal;a.gc+=p.golesVisitante;b.gf+=p.golesVisitante;b.gc+=p.golesLocal;
      if(p.golesLocal>p.golesVisitante)a.puntos+=3;
      else if(p.golesLocal<p.golesVisitante)b.puntos+=3;
      else {a.puntos++;b.puntos++;}
    });
    const desempate=new Map(desempates.map(d=>[d.idEquipo,d.orden]));
    return Array.from(tabla.values()).sort((a,b)=>b.puntos-a.puntos||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf||
      (desempate.get(a.id)||9999)-(desempate.get(b.id)||9999)||a.equipo.localeCompare(b.equipo,'es'));
  }
  function historial(datos){
    const hist={campeonato:[],liguilla:[]};
    datos.ediciones.filter(e=>e.estado==='finalizado').forEach(ed=>{
      for(const categoria of ['libre','master']){
        const equipos=datos.equipos.filter(e=>e.idEdicion===ed.id&&e.categoria===categoria);
        const partidos=datos.partidos.filter(p=>p.idEdicion===ed.id&&p.categoria===categoria);
        const anio=parseInt(texto(ed.temporada).match(/\d{4}/)?.[0]||'',10);
        if(!anio)continue;
        if(ed.competicion==='campeonato'){
          const final=partidos.find(p=>p.fase==='final'&&p.estado==='finalizado'&&
            numero(p.golesLocal)!==null&&numero(p.golesVisitante)!==null);
          if(!final)continue;
          const local=equipos.find(e=>e.id===final.local),visita=equipos.find(e=>e.id===final.visitante);
          if(!local||!visita)continue;
          let ganador=final.clasificado;
          if(!ganador && final.golesLocal!==final.golesVisitante) ganador=final.golesLocal>final.golesVisitante?local.id:visita.id;
          if(!ganador && numero(final.penalesLocal)!==null&&numero(final.penalesVisitante)!==null&&final.penalesLocal!==final.penalesVisitante)
            ganador=final.penalesLocal>final.penalesVisitante?local.id:visita.id;
          if(ganador!==local.id&&ganador!==visita.id)continue;
          hist.campeonato.push({anio,categoria:categoria==='master'?'Máster':'Libre',
            campeon:ganador===local.id?local.nombre:visita.nombre,
            subcampeon:ganador===local.id?visita.nombre:local.nombre,
            marcadorFinal:final.golesLocal+' - '+final.golesVisitante,publicado:true});
        }else{
          if(equipos.length<5||!partidos.length||partidos.some(p=>p.estado!=='finalizado'))continue;
          const desempates=datos.desempates.filter(d=>d.idEdicion===ed.id&&d.categoria===categoria);
          const posiciones=tablaLiga(equipos,partidos,desempates);
          hist.liguilla.push({anio,categoria:categoria==='master'?'Máster':'Libre',
            posiciones:posiciones.slice(0,5),publicado:true});
        }
      }
    });return hist;
  }
  function preparar(datos){
    window.GALVIZ_DATOS_EQUIPOS={};window.GALVIZ_DATOS_PARTIDOS={};window.GALVIZ_DATOS_RESULTADOS={};
    window.GALVIZ_HISTORIAL=historial(datos);
    for(const k of claves){
      const ed=edicionActual(datos,compDe(k));const cat=catDe(k);
      const equipos=ed?datos.equipos.filter(e=>e.idEdicion===ed.id&&e.competicion===compDe(k)&&e.categoria===cat):[];
      const partidos=ed?datos.partidos.filter(p=>p.idEdicion===ed.id&&p.competicion===compDe(k)&&p.categoria===cat):[];
      const jugadores=ed?datos.jugadores.filter(j=>j.idEdicion===ed.id):[];
      window.GALVIZ_DATOS_EQUIPOS[k]=equipos.map(e=>equipoPublico(e,jugadores));
      window.GALVIZ_DATOS_PARTIDOS[k]=gruposCalendario(partidos,compDe(k));
      window.GALVIZ_DATOS_RESULTADOS[k]=marcadores(partidos);
    }
    window.GALVIZ_PUBLICACION_DEPORTIVA=datos;
    window.GALVIZ_FORMATOS_ELIMINATORIAS=Array.isArray(datos.formatosEliminatorias)?datos.formatosEliminatorias:[];
  }
  function cargarScript(ruta){return new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=ruta;script.onload=resolve;
    script.onerror=()=>reject(new Error('No se pudo cargar '+ruta));document.body.appendChild(script);
  });}
  function avisoVacio(){
    if(!clave)return;
    const equipos=window.GALVIZ_DATOS_EQUIPOS[clave]||[];
    const partidos=window.GALVIZ_DATOS_PARTIDOS[clave]?.jornadas||[];
    if(!equipos.length){const cont=document.getElementById('lista-equipos');if(cont){const p=document.createElement('p');p.className='gd-aviso';p.textContent='Todavía no hay equipos publicados en esta categoría.';cont.appendChild(p);}}
    if(!partidos.length){for(const id of ['lista-partidos','lista-resultados']){const cont=document.getElementById(id);if(cont){const p=document.createElement('p');p.className='gd-aviso';p.textContent='Todavía no hay partidos publicados.';cont.appendChild(p);}}}
  }
  function actualizarPortadas(datos){
    if(clave){
      const ed=edicionActual(datos,compDe(clave));
      const destino=document.querySelector('.categoria-portada');
      if(destino){
        const p=document.createElement('p');p.className='gd-edicion';
        p.textContent=ed?'Edición '+(ed.nombre||ed.temporada)+' · '+({en_curso:'En curso',proximo:'Próximamente',finalizado:'Finalizada'}[ed.estado]||ed.estado)
          :'No hay una edición publicada para esta competición';
        destino.appendChild(p);
      }
    }
    const comp=esLiguilla?'liguilla':esCampeonato?'campeonato':null;
    if(!comp)return;
    const ed=edicionActual(datos,comp);
    const textoEstado=ed?('Edición '+(ed.nombre||ed.temporada)+' · '+({en_curso:'En curso',proximo:'Próximamente',finalizado:'Finalizada'}[ed.estado]||ed.estado)):'No hay ediciones publicadas';
    const target=document.querySelector(comp==='liguilla'?'.liguilla-portada-contenido':'.campeonato-portada-texto');
    if(target){const p=document.createElement('p');p.className='gd-edicion';p.textContent=textoEstado;target.appendChild(p);}
    if(esLiguilla){
      const numeros={equipos:0,partidos:0};
      if(ed){numeros.equipos=datos.equipos.filter(e=>e.idEdicion===ed.id).length;numeros.partidos=datos.partidos.filter(p=>p.idEdicion===ed.id).length;}
      document.querySelectorAll('[data-gd-cifra]').forEach(el=>{el.textContent=String(numeros[el.dataset.gdCifra]||0);});
    }
  }
  async function iniciar(){
    try{
      const datos=await cargarJSONP();
      if(!datos||datos.ok!==true||!Array.isArray(datos.ediciones)||!Array.isArray(datos.equipos)||!Array.isArray(datos.partidos))throw new Error('Respuesta pública no válida');
      preparar(datos);actualizarPortadas(datos);
      if(clave){
        await cargarScript('../js/equipos.js');await cargarScript('../js/partidos.js');
        await cargarScript('../js/resultados.js');
        await cargarScript(compDe(clave)==='liguilla'?'../js/clasificacion-liguilla.js':'../js/clasificacion.js');
        avisoVacio();
      }else if(esPlantilla){await cargarScript('../js/plantilla.js');}
      else if(esHistorial){await cargarScript('../js/historial.js');}
    }catch(err){console.error('Galviz Events / datos deportivos:',err);aviso('No fue posible consultar los datos deportivos. Intenta actualizar la página.');}
  }
  iniciar();
})();
