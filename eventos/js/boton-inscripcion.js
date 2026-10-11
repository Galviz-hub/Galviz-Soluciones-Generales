/* Acceso flotante universal a la sección oficial de inscripción. */
(function(){
  'use strict';
  const enFutbol=/\/futbol\//.test(location.pathname);
  const enFormulario=enFutbol && /\/futbol\/(?:index\.html)?$/.test(location.pathname);
  const enlace=document.createElement('a');
  enlace.className='gd-inscribete-flotante';
  enlace.href=enFutbol?'index.html#inscripciones':'futbol/index.html#inscripciones';
  enlace.textContent='⚽ INSCRÍBETE';
  enlace.setAttribute('aria-label','Ir al formulario de inscripción de equipos');
  document.body.appendChild(enlace);
  if(enFormulario && 'IntersectionObserver' in window){
    const destino=document.getElementById('inscripciones');
    if(destino){
      const observer=new IntersectionObserver(entradas=>{
        enlace.hidden=entradas.some(e=>e.isIntersecting);
      },{threshold:0.15});
      observer.observe(destino);
    }
  }
})();
