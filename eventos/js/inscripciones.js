
/*
 * GALVIZ EVENTS - INSCRIPCIONES
 * Consulta los estados desde la API Publica.
 * El envio de solicitudes permanece en el servidor
 * independiente de Inscripciones.
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formulario-inscripcion');
  if (!form) return;

  const competicion = document.getElementById('competicion');
  const categoria = document.getElementById('categoria');
  const boton = document.getElementById('boton-inscripcion');
  const estado = document.getElementById('estado-inscripcion');
  const enlaceBases = document.getElementById('enlace-bases-formulario');
  const bases = document.getElementById('aceptar-bases');
  const privacidad = document.getElementById('aceptar-privacidad');

  if (![competicion, categoria, boton, estado, bases, privacidad].every(Boolean)) {
    console.error('Faltan elementos del formulario de inscripciones.');
    return;
  }

  let enviando = false;
  let controles = null;
  let consultando = false;

  const URL_ESTADOS =
    'https://script.google.com/macros/s/AKfycbza3Wo5YYSInp0pwuGy24Kzv2LzWU3J1D1c-4Vag_wI7oz_GHL1sneKE8RduJ4_dPlT/exec';

  const estadoControl = document.createElement('p');
  estadoControl.className = 'futbol-aviso-solicitud';
  estadoControl.setAttribute('role', 'status');
  form.insertBefore(estadoControl, form.firstChild);

  function permitido() {
    return !!(
      controles &&
      controles[competicion.value] &&
      controles[competicion.value][categoria.value] === 'ABIERTAS'
    );
  }

  function mensajeControl() {
    if (!controles) {
      return 'Consultando disponibilidad de inscripciones…';
    }

    if (!competicion.value || !categoria.value) {
      return 'Selecciona competición y categoría para consultar las inscripciones.';
    }

    return permitido()
      ? 'Inscripciones abiertas para esta competición y categoría.'
      : 'Inscripciones cerradas para esta competición y categoría.';
  }

  function consultarEstados() {
    if (consultando) return Promise.resolve(false);

    consultando = true;
    controles = null;
    actualizarBoton();

    return new Promise(function (resolver) {
      const callback = 'galvizEstado' +
        Math.random().toString(36).slice(2, 14);

      const script = document.createElement('script');
      let completo = false;

      const tiempo = setTimeout(function () {
        terminar(null);
      }, 18000);

      function terminar(datos) {
        if (completo) return;
        completo = true;

        clearTimeout(tiempo);
        delete window[callback];
        script.remove();

        const mapa = {};

        if (datos && datos.ok === true && datos.competiciones) {
          for (const comp of ['campeonato', 'liguilla']) {
            const ed = datos.competiciones[comp];

            mapa[comp] = {
              libre: ed && ed.libre === true
                ? 'ABIERTAS'
                : 'CERRADAS',
              master: ed && ed.master === true
                ? 'ABIERTAS'
                : 'CERRADAS'
            };
          }

          controles = mapa;
        }

        consultando = false;
        actualizarBoton();
        resolver(!!controles);
      }

      window[callback] = terminar;

      script.onerror = function () {
        terminar(null);
      };

      script.src = URL_ESTADOS +
        '?modulo=control&callback=' +
        callback +
        '&_=' + Date.now();

      document.head.appendChild(script);
    });
  }

  const URL_SERVIDOR = (form.getAttribute('action') || '').trim();

  function esOrigenAppsScript(origen) {
    try {
      const url = new URL(origen);
      const host = url.hostname.toLowerCase();

      return url.protocol === 'https:' && (
        host === 'script.google.com' ||
        host === 'script.googleusercontent.com' ||
        host.endsWith('.script.googleusercontent.com') ||
        host.endsWith('-script.googleusercontent.com')
      );
    } catch (_) {
      return false;
    }
  }

  function actualizarBases() {
    if (!enlaceBases) return;

    const documento = window.GALVIZ_BASES &&
      window.GALVIZ_BASES[competicion.value];

    if (!documento || !documento.archivo) {
      enlaceBases.hidden = true;
      enlaceBases.removeAttribute('href');
      return;
    }

    enlaceBases.href = documento.archivo;
    enlaceBases.textContent =
      'VER ' + documento.titulo.toUpperCase() + ' →';
    enlaceBases.hidden = false;
  }

  function mostrarEstado(tipo, mensaje, id) {
    estado.className =
      'futbol-estado-inscripcion futbol-estado-' + tipo;

    estado.replaceChildren();

    const texto = document.createElement('p');
    texto.textContent = mensaje;
    estado.appendChild(texto);

    if (id) {
      const codigo = document.createElement('strong');
      codigo.className = 'futbol-codigo-solicitud';
      codigo.textContent = 'Código de solicitud: ' + id;
      estado.appendChild(codigo);

      const aviso = document.createElement('small');
      aviso.className = 'futbol-aviso-solicitud';
      aviso.textContent =
        'Tu solicitud será revisada por Galviz Events. ' +
        'Enviarla no confirma automáticamente la inscripción ' +
        'ni reserva un cupo.';

      estado.appendChild(aviso);
    }

    estado.hidden = false;
  }

  function formularioListo() {
    const whatsapp = String(
      form.elements.whatsapp?.value || ''
    ).replace(/\D/g, '');

    const email = String(
      form.elements.correo?.value || ''
    ).trim();

    const obligatoriosTexto = [
      'equipo',
      'procedencia',
      'responsable'
    ];

    return form.checkValidity() &&
      obligatoriosTexto.every(function (nombre) {
        return String(
          form.elements[nombre]?.value || ''
        ).trim().length > 0;
      }) &&
      /^\d{9,15}$/.test(whatsapp) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function actualizarBoton() {
    const listo =
      !enviando &&
      permitido() &&
      formularioListo();

    estadoControl.textContent = mensajeControl();

    boton.disabled = enviando || !listo;

    boton.classList.toggle(
      'futbol-boton-listo', listo
    );

    boton.classList.toggle(
      'futbol-boton-enviando', enviando
    );

    boton.setAttribute(
      'aria-busy', enviando ? 'true' : 'false'
    );

    boton.textContent = enviando
      ? 'ENVIANDO SOLICITUD...'
      : 'ENVIAR SOLICITUD';
  }

  for (const opcion of categoria.options) {
    if (opcion.value === 'libre') {
      opcion.disabled = false;
      opcion.textContent = 'Libre';
    } else if (opcion.value === 'master') {
      opcion.disabled = false;
      opcion.textContent = 'Máster';
    }
  }

  [bases, privacidad].forEach(function (check) {
    check.disabled = false;

    const etiqueta = check.closest('label');

    if (etiqueta) {
      etiqueta.classList.remove(
        'futbol-consentimiento-inactivo'
      );
    }
  });

  actualizarBases();

  form.addEventListener('input', actualizarBoton);
  form.addEventListener('change', actualizarBoton);
  competicion.addEventListener('change', actualizarBases);
  window.addEventListener('pageshow', actualizarBoton);

  actualizarBoton();

  function enviarSolicitud() {
    return new Promise(function (resolver, rechazar) {
      const nonce = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID().replace(/-/g, '')
        : String(Date.now()) + String(Math.random()).slice(2);

      const iframe = document.createElement('iframe');

      iframe.name = 'galviz_respuesta_' + nonce;
      iframe.title = 'Confirmación de inscripción';
      iframe.hidden = true;
      iframe.style.display = 'none';

      document.body.appendChild(iframe);

      const transporte = document.createElement('input');
      transporte.type = 'hidden';
      transporte.name = '_gi_transporte';
      transporte.value = 'iframe';

      const campoNonce = document.createElement('input');
      campoNonce.type = 'hidden';
      campoNonce.name = '_gi_nonce';
      campoNonce.value = nonce;

      form.append(transporte, campoNonce);

      const targetOriginal = form.getAttribute('target');
      let terminado = false;
      let timeout;

      function limpiar() {
        window.removeEventListener('message', recibir);
        clearTimeout(timeout);

        transporte.remove();
        campoNonce.remove();

        if (targetOriginal === null) {
          form.removeAttribute('target');
        } else {
          form.setAttribute('target', targetOriginal);
        }

        setTimeout(function () {
          iframe.remove();
        }, 1000);
      }

      function recibir(evento) {
        const datos = evento.data;

        if (!esOrigenAppsScript(evento.origin)) return;

        if (
          !datos ||
          datos.tipo !== 'galviz-inscripcion-resultado' ||
          datos.nonce !== nonce
        ) {
          return;
        }

        if (terminado) return;
        terminado = true;

        limpiar();

        if (
          typeof datos.ok !== 'boolean' ||
          typeof datos.mensaje !== 'string'
        ) {
          rechazar(
            new Error('Respuesta del servidor no válida.')
          );
          return;
        }

        resolver(datos);
      }

      window.addEventListener('message', recibir);

      timeout = setTimeout(function () {
        if (terminado) return;

        terminado = true;
        limpiar();

        rechazar(
          new Error(
            'No se recibió confirmación. ' +
            'Comprueba la hoja antes de reenviar.'
          )
        );
      }, 35000);

      try {
        form.setAttribute('target', iframe.name);
        form.submit();
      } catch (error) {
        if (!terminado) {
          terminado = true;
          limpiar();
          rechazar(error);
        }
      }
    });
  }

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    if (enviando) return;

    if (!formularioListo()) {
      form.reportValidity();
      actualizarBoton();
      return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(URL_SERVIDOR)) {
      mostrarEstado(
        'error',
        'No está configurada correctamente la aplicación de inscripciones.'
      );
      return;
    }

    const disponible = await consultarEstados();

    if (!disponible || !permitido()) {
      mostrarEstado(
        'error',
        'Las inscripciones de esta categoría están cerradas ' +
        'o no se pudo verificar su disponibilidad.'
      );
      return;
    }

    enviando = true;
    actualizarBoton();

    mostrarEstado(
      'enviando',
      'Estamos enviando tu solicitud. No cierres esta página.'
    );

    try {
      const resultado = await enviarSolicitud();

      mostrarEstado(
        resultado.ok ? 'exito' : 'error',
        resultado.mensaje,
        resultado.id || null
      );

      if (resultado.ok) {
        form.reset();
        actualizarBases();
      }
    } catch (error) {
      console.error(
        'Error de confirmación de solicitud:', error
      );

      mostrarEstado(
        'error',
        'No pudimos confirmar el resultado del envío. ' +
        'Para evitar una solicitud duplicada, no vuelvas ' +
        'a enviarla de inmediato. Contacta a la organización ' +
        'si necesitas verificarla.'
      );
    } finally {
      enviando = false;
      actualizarBoton();
    }
  });

  consultarEstados();

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !enviando) {
      consultarEstados();
    }
  });

  console.log(
    'Galviz Events: control de inscripciones vinculado a estados públicos.'
  );
});
