/* GALVIZ EVENTS - Solo comunicados y premios. No modifica el circuito deportivo. */
(function(){'use strict';
 const ENDPOINT='https://script.google.com/macros/s/AKfycbza3Wo5YYSInp0pwuGy24Kzv2LzWU3J1D1c-4Vag_wI7oz_GHL1sneKE8RduJ4_dPlT/exec';
 const $=s=>document.querySelector(s),ruta=location.pathname;
 const inicio=/\/eventos\/futbol\/(?:index\.html)?$/.test(ruta);
 const comp=/\/eventos\/futbol\/campeonato\.html$/.test(ruta)?'campeonato':/\/eventos\/futbol\/liguilla\.html$/.test(ruta)?'liguilla':'';
 if(!inicio&&!comp)return;
 function cargar(){return new Promise((ok,no)=>{const nombre='galvizPublicoCP'+Math.random().toString(36).slice(2,12),s=document.createElement('script');let hecho=false;
 const fin=(e,d)=>{if(hecho)return;hecho=true;clearTimeout(t);delete window[nombre];s.remove();e?no(e):ok(d);};window[nombre]=d=>fin(null,d);
 const t=setTimeout(()=>fin(new Error('Tiempo agotado')),18000);s.onerror=()=>fin(new Error('Sin conexión'));
 s.src=ENDPOINT+'?modulo=deportes&callback='+nombre+'&_='+Date.now();document.head.append(s);});}
 function elemento(tag,txt){const n=document.createElement(tag);if(txt!=null)n.textContent=txt;return n;}
 const estilo=elemento('style');estilo.textContent=`.cp-fondo{position:fixed;inset:0;background:#000b;z-index:99999;display:grid;place-items:center;padding:18px}.cp-ventana{position:relative;background:#151a21;color:white;border:1px solid #d7b568;border-radius:16px;max-width:650px;width:100%;max-height:88vh;overflow:auto;padding:28px;box-shadow:0 15px 55px #0009}.cp-ventana h2{font-size:27px;margin:5px 40px 15px 0}.cp-ventana p{white-space:pre-wrap;line-height:1.65}.cp-ventana img{max-width:100%;max-height:230px;object-fit:contain;border-radius:8px;margin:12px 0}.cp-cerrar{position:absolute;right:14px;top:10px;border:0;background:transparent;color:white;font-size:30px;cursor:pointer}.cp-link{display:inline-block;margin-top:12px;padding:12px 20px;background:#d7b568;color:#151515;text-decoration:none;border-radius:8px;font-weight:bold}.cp-otros{margin-top:15px;white-space:pre-wrap}`;document.head.append(estilo);
 function anuncios(datos){const arr=Array.isArray(datos.comunicados)?datos.comunicados:[];if(!arr.length)return;
 const anuncio=arr[arr.length-1];
 const fondo=elemento('div');fondo.className='cp-fondo';const ventana=elemento('section');ventana.className='cp-ventana';ventana.setAttribute('role','dialog');ventana.setAttribute('aria-modal','true');ventana.setAttribute('aria-label','Comunicado oficial');
 const cerrar=elemento('button','×');cerrar.type='button';cerrar.className='cp-cerrar';cerrar.setAttribute('aria-label','Cerrar comunicado');const fin=()=>{fondo.remove();};cerrar.addEventListener('click',fin);fondo.addEventListener('click',e=>{if(e.target===fondo)fin();});
 ventana.append(cerrar,elemento('small','COMUNICADO OFICIAL'),elemento('h2',anuncio.titulo));if(anuncio.imagen){const img=elemento('img');img.src=anuncio.imagen;img.alt=anuncio.titulo;img.loading='lazy';ventana.append(img);}ventana.append(elemento('p',anuncio.contenido));
 if(anuncio.enlace){const a=elemento('a',anuncio.textoEnlace||'Más información');a.href=anuncio.enlace;a.target='_blank';a.rel='noopener noreferrer';a.className='cp-link';ventana.append(a);}fondo.append(ventana);document.body.append(fondo);cerrar.focus();}
 const dinero=n=>n===null||n===undefined?'Por definir':'S/ '+Number(n).toLocaleString('es-PE',{maximumFractionDigits:2});
 function premios(datos){
  const eds=(datos.ediciones||[]).filter(e=>e.competicion===comp);
  const peso=e=>({en_curso:3,proximo:2,finalizado:1}[e.estado]||0);
  eds.sort((a,b)=>peso(b)-peso(a)||String(b.temporada).localeCompare(String(a.temporada)));
  const ed=eds[0];if(!ed)return;
  const items=(datos.premios||[]).filter(p=>String(p.idEdicion)===String(ed.id)&&p.competicion===comp);
  if(!items.length)return;
  const bloque=$('#panel-premios');if(!bloque)return;
  const total=items.reduce((s,p)=>s+(Number(p.campeon)||0)+(Number(p.subcampeon)||0),0);
  if(comp==='campeonato'){
   // Se conservan exactamente las tarjetas y clases CSS existentes.
   const totalEl=bloque.querySelector('.campeonato-premios-total strong');
   if(totalEl)totalEl.textContent=dinero(total);
   const aviso=bloque.querySelector('.campeonato-aviso');
   if(aviso)aviso.textContent='Premios oficiales · '+ed.nombre;
   bloque.querySelectorAll('.campeonato-premio').forEach(card=>{
    const encabezado=card.querySelector('h3');const cat=encabezado&&/MÁSTER|MASTER/i.test(encabezado.textContent)?'master':'libre';
    const p=items.find(x=>x.categoria===cat);
    if(!p){card.hidden=true;return;}card.hidden=false;
    const montos=card.querySelectorAll('div strong');
    if(montos[0])montos[0].textContent=dinero(p.campeon);
    if(montos[1])montos[1].textContent=dinero(p.subcampeon);
    let otros=card.querySelector('.cp-otros');
    if(p.otros){if(!otros){otros=elemento('p');otros.className='cp-otros';card.append(otros);}otros.textContent=p.otros;}
    else if(otros)otros.remove();
   });
  }else{
   // Liguilla: mantener el panel, contenedor y encabezado originales.
   const cont=bloque.querySelector('.liguilla-contenedor');if(!cont)return;
   const descripcion=cont.querySelector('.liguilla-encabezado p:last-child');
   if(descripcion)descripcion.textContent='Premios oficiales · '+ed.nombre;
   let caja=cont.querySelector('.cp-premios-liguilla');if(!caja){caja=elemento('div');caja.className='cp-premios-liguilla';cont.append(caja);}caja.replaceChildren();
   caja.style.cssText='max-width:920px;margin:30px auto;';
   const suma=elemento('p','PREMIOS TOTALES: '+dinero(total));suma.style.cssText='text-align:center;font-size:1.5rem;font-weight:700;margin-bottom:25px';caja.append(suma);
   const grid=elemento('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px';
   items.forEach(p=>{const card=elemento('article');card.style.cssText='border:1px solid currentColor;border-radius:12px;padding:22px';card.append(elemento('h3','CATEGORÍA '+(p.categoria==='master'?'MÁSTER':'LIBRE')));card.append(elemento('p','Campeón: '+dinero(p.campeon)));card.append(elemento('p','Subcampeón: '+dinero(p.subcampeon)));if(p.otros)card.append(elemento('p',p.otros));grid.append(card);});
   caja.append(grid);
  }
 }

 cargar().then(datos=>{if(!datos||!datos.ok)return;if(inicio)anuncios(datos);if(comp)premios(datos);}).catch(e=>console.warn('Comunicados/premios no disponibles; se conserva la página original.',e));
})();
