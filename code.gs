// Constante global para evitar llamadas repetidas
var ID_SHEET = "1Fg4a2PzXApzGhlfkTohQQT1cy-GnZ1e7b-jzRXZ-_1I";

/**
 * Función genérica para consultar variables en la pestaña de configuración de forma segura.
 */
function obtenerConfig(nombreVariable) {
  var ss = SpreadsheetApp.openById(ID_SHEET);
  var hojaConfig = ss.getSheetByName("Configuracion") || ss.getSheetByName("Config") || ss.getSheetByName("configuracion");
  if (!hojaConfig) return null;
  
  var datos = hojaConfig.getDataRange().getValues();
  var varBuscada = String(nombreVariable || "").trim().toUpperCase();

  for (var i = 1; i < datos.length; i++) {
    // Validar que la celda de la columna A no esté vacía antes de aplicar trim
    if (datos[i][0] !== undefined && datos[i][0] !== null && datos[i][0] !== "") {
      var claveCelda = String(datos[i][0]).trim().toUpperCase();
      if (claveCelda === varBuscada) {
        return datos[i][1];
      }
    }
  }
  return null;
}

/**
 * Lee la bandeja de entrada, procesa reenvíos o correos directos y los registra en Google Sheets.
 */
function registrarOficios() {
  var ss = SpreadsheetApp.openById(ID_SHEET);
  var hoja = ss.getSheetByName("mails-flujo") || ss.getSheets()[0];
  
  var emailDerivador = obtenerConfig("EMAIL_DERIVADOR");
  if (emailDerivador) emailDerivador = String(emailDerivador).toLowerCase().trim();
  
  var dominiosRaw = obtenerConfig("DOMINIOS_PERMITIDOS");
  var dominiosPermitidos = String(dominiosRaw).split(",").map(function(d) { 
    return String(d || "").trim().toLowerCase(); 
  });
  
  // Buscar únicamente hilos no leídos en la bandeja de entrada
  var hilos = GmailApp.search('is:unread in:inbox');
  var nuevasFilas = [];
  
  for (var i = 0; i < hilos.length; i++) {
    var mensajes = hilos[i].getMessages();
    
    for (var j = 0; j < mensajes.length; j++) {
      var mensaje = mensajes[j];
      
      if (mensaje.isUnread()) {
        var cuerpoCompleto = mensaje.getPlainBody() || "";
        // Trunca el texto en la primera línea de reenvío o respuesta para limpiar la vista corta
        var cuerpo = cuerpoCompleto.split(/(?:_{3,}|-{3,}|De:|From:|Enviado:)/i)[0].trim();
        var asunto = mensaje.getSubject() || "";
        var idMensaje = mensaje.getId();
        var remitenteActual = String(mensaje.getFrom() || "").toLowerCase();
        
        // CASO A: Correo reenviado por el Derivador Interno
        if (emailDerivador && remitenteActual.indexOf(emailDerivador) !== -1) {
          
          // Se busca en cuerpoCompleto (sin truncar) para no perder el encabezado de reenvío
          var regexExplicita = /(?:De|From|Enviado por):\s*.*?(?:[<|\b])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:[>|\b])/i;
          var coincidencia = cuerpoCompleto.match(regexExplicita);
          var correoOriginal = "";

          if (coincidencia && coincidencia[1]) {
            correoOriginal = coincidencia[1].toLowerCase().trim();
          } else {
            // Fallback: Busca cualquier email dentro del cuerpo que no sea el del derivador
            var regexCualquierEmail = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;
            var todosLosEmails = cuerpoCompleto.match(regexCualquierEmail) || [];
            
            for (var k = 0; k < todosLosEmails.length; k++) {
              var emailEncontrado = todosLosEmails[k].toLowerCase().trim();
              if (emailEncontrado !== emailDerivador) {
                correoOriginal = emailEncontrado;
                break;
              }
            }
          }

          if (correoOriginal !== "") {
            nuevasFilas.push([new Date(), correoOriginal, asunto, idMensaje, cuerpo, "TRUE", "Recibido"]);
          } else {
            nuevasFilas.push([new Date(), mensaje.getFrom(), asunto, idMensaje, cuerpo, "FALSE", "Error al extraer emisor original"]);
          }
          
        } 
        // CASO B: Correo recibido directamente desde una entidad externa
        else {
          var correoLimpio = remitenteActual.replace(/^.*<([^>]+)>.*$/, "$1").trim();
          var dominioValido = dominiosPermitidos.some(function(dominio) { 
            return dominio !== "" && correoLimpio.endsWith(dominio); 
          });
          
          if (dominioValido) { 
            nuevasFilas.push([new Date(), correoLimpio, asunto, idMensaje, cuerpo, "", "Pendiente IA"]);
          } else {
            nuevasFilas.push([new Date(), mensaje.getFrom(), asunto, idMensaje, cuerpo, "FALSE", "Ignorado (Filtro inicial)"]);
          }
        }
        
        // Marcar como leído inmediatamente
        mensaje.markRead();
      }
    }
  }
  
  // Inserción masiva en la planilla
  if (nuevasFilas.length > 0) {
    hoja.getRange(hoja.getLastRow() + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);
  }
}

/**
 * Procesa las filas pendientes en la planilla, envía los correos de respuesta y actualiza los estados.
 */
function procesarRespuestas() {
  var ss = SpreadsheetApp.openById(ID_SHEET);
  var hoja = ss.getSheetByName("mails-flujo") || ss.getSheets()[0];
  
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return; // Planilla vacía o solo con encabezados
  
  var rango = hoja.getRange(2, 1, ultimaFila - 1, 7);
  var datos = rango.getValues();
  var formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfE_58BrTsGT4bJaJoU91PMMm-87fMI0mjfYnbmEcH6zLwAkg/viewform?usp=dialog";
  
  var huboCambios = false;

  for (var i = 0; i < datos.length; i++) {
    var correoDestinatario = String(datos[i][1] || ""); // Columna B
    var asunto = String(datos[i][2] || "");             // Columna C
    var aprobacionIA = datos[i][5];                     // Columna F
    var estado = String(datos[i][6] || "");             // Columna G
    
    // Evaluar únicamente filas que requieran procesamiento
    if (estado === "Análisis IA completado" || estado === "Recibido") {
      var esAprobado = (aprobacionIA === true || String(aprobacionIA).toUpperCase() === "TRUE");
      
      if (esAprobado) {
        var nombreDestino = correoDestinatario.split("<")[0].replace(/"/g, "").trim();
        if (!nombreDestino || nombreDestino.indexOf("@") !== -1) {
          nombreDestino = "Usuario/a";
        }

        var asuntoCorreo = "Re: " + (asunto || "Requerimiento de Información — Formulario de Ingreso Oficial");
        
        var cuerpoMensajePlano = "Estimado/a " + nombreDestino + ",\n\n" +
                                 "Para proceder con la gestión de su requerimiento de información, le solicitamos completar nuestro formulario de ingreso oficial en el siguiente enlace:\n" +
                                 formUrl + "\n\n" +
                                 "Una vez enviado, nuestro equipo legal procesará los datos de forma inmediata.\n\n" +
                                 "Saludos cordiales,\n" +
                                 "Área Legal — PedidosYa.";
        
        var cuerpoHtml = 
          '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
          '  <div style="background-color: #E11D48; padding: 1.5rem; text-align: center;">' +
          '    <h2 style="color: white; margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.3px;">Área Legal — PedidosYa</h2>' +
          '  </div>' +
          '  <div style="padding: 2rem; background-color: #FFFFFF;">' +
          '    <p style="color: #475569; font-size: 0.95rem; margin-top: 0;">Estimado/a ' + nombreDestino + ',</p>' +
          '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
          '      Para gestionar su requerimiento de manera oportuna, le solicitamos completar nuestro formulario de ingreso oficial:' +
          '    </p>' +
          '    <div style="text-align: center; margin: 2rem 0;">' +
          '      <a href="' + formUrl + '" target="_blank" style="background-color: #E11D48; color: white; padding: 0.85rem 2rem; font-size: 0.95rem; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(225, 29, 72, 0.25); font-family: sans-serif;">Completar Formulario de Registro</a>' +
          '    </div>' +
          '    <p style="color: #475569; font-size: 0.85rem; line-height: 1.5; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">' +
          '      <strong>Nota:</strong> Tras enviar el formulario, nuestro equipo legal gestionará su solicitud lo más pronto posible.' +
          '    </p>' +
          '    <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 2rem 0;">' +
          '    <p style="color: #64748B; font-size: 0.8rem; line-height: 1.4; margin-bottom: 0; text-align: center;">' +
          '      Este es un correo institucional generado de forma automática. Por favor, no responda directamente a este mensaje.<br>' +
          '      © 2026 PedidosYa Legal. Todos los derechos reservados.' +
          '    </p>' +
          '  </div>' +
          '</div>';
        
        var correoLimpio = correoDestinatario.replace(/^.*<([^>]+)>.*$/, "$1").trim();

        if (correoLimpio !== "") {
          GmailApp.sendEmail(correoLimpio, asuntoCorreo, cuerpoMensajePlano, {
            htmlBody: cuerpoHtml
          });
        }
        
        datos[i][6] = "Respondido";
        huboCambios = true;
      } else {
        datos[i][6] = "Ignorado por IA";
        huboCambios = true;
      }
    }
  }

  // Escribir los cambios en lote
  if (huboCambios) {
    rango.setValues(datos);
  }
}