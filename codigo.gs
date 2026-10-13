// ==========================================
// CONFIGURACIÓN DE CONEXIÓN
// ==========================================
// Si tu script es un Script Independiente (creado desde script.google.com), 
// Google no sabe qué hoja leer automáticamente. 
// Copia el ID de tu Google Sheet (el código largo en la URL entre /d/ y /edit) y pégalo aquí abajo:
var SPREADSHEET_ID = "1Fg4a2PzXApzGhlfkTohQQT1cy-GnZ1e7b-jzRXZ-_1I"; 

/**
 * Función auxiliar para obtener la hoja de cálculo de forma resiliente,
 * ya sea vinculada o mediante ID si es independiente.
 */
function obtenerSpreadsheetActiva() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    if (SPREADSHEET_ID && SPREADSHEET_ID !== "0") {
      try {
        ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        Logger.log("Conectado exitosamente usando el ID de hoja de cálculo.");
      } catch (err) {
        Logger.log("Error al intentar abrir la hoja por ID: " + err.toString());
      }
    }
  }
  return ss;
}

/**
 * Recupera de forma dinámica cualquier variable de configuración guardada en la pestaña 'config' o 'Configuracion'.
 * @param {string} clave Nombre de la variable (ej: "DRIVE_FOLDER_ID")
 * @return {string} El valor configurado en la hoja de cálculo
 */
function obtenerConfig(clave) {
  try {
    var ss = obtenerSpreadsheetActiva();
    var sheet = getSheetCaseInsensitive(ss, 'config') || getSheetCaseInsensitive(ss, 'Configuracion');
    if (!sheet) return "";
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return "";
    
    var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0].toString().trim() === clave) {
        return data[i][1].toString().trim();
      }
    }
  } catch (e) {
    Logger.log("Error al obtener configuración para " + clave + ": " + e.toString());
  }
  return "";
}

/**
 * EJECUTAR ESTA FUNCIÓN UNA SOLA VEZ DESDE EL EDITOR
 * PARA CREAR EL ACTIVADOR AUTOMÁTICAMENTE.
 */
function crearActivadorFormulario() {
  var ss = obtenerSpreadsheetActiva();
  if (!ss) {
    Logger.log("Error: No se pudo obtener la hoja de cálculo. Ingresa el SPREADSHEET_ID al inicio del código.");
    return;
  }
  
  var triggers = ScriptApp.getUserTriggers(ss);
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onFormSubmit') {
      Logger.log('El activador ya existe.');
      return; 
    }
  }
  
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
    
  Logger.log('Activador creado exitosamente.');
}

/**
 * Sirve la aplicación web del Dashboard.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('dashboard').evaluate()
    .setTitle('Dashboard de Requerimientos Legales')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Auxiliar para incluir archivos secundarios.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Extrae el ID único del archivo de Google Drive a partir de su URL para descarga directa.
 */
function extraerIdDeUrl(url) {
  if (!url) return "";
  var urlStr = url.toString().trim();
  
  // Caso de parámetro id en url: ?id=xxxxxx
  var idMatch = urlStr.match(/id=([^&]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  
  // Caso de ruta de url: /d/xxxxxx/
  var pathMatch = urlStr.match(/\/d\/([^/]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }
  
  return "";
}

/**
 * Reacciona automáticamente al envío del formulario, procesa la información,
 * genera el ID correlativo único y guarda los datos en la pestaña de destino "dashboard-status".
 * Soporta la estructura robusta de 18 columnas alineadas exactamente con el Google Sheet físico (incluye url_response).
 * Maneja dinámicamente la ubicación del archivo adjunto (Columna Q para Rider, Columna D para Usuario).
 */
function onFormSubmit(e) {
  var ss = obtenerSpreadsheetActiva();
  if (!ss) {
    throw new Error("No se pudo obtener la hoja de cálculo activa. Configura el SPREADSHEET_ID.");
  }
  
  var sheetOrigin = getSheetCaseInsensitive(ss, 'Form Responses 1') || getSheetCaseInsensitive(ss, 'form response 1');
  var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
  
  if (!sheetOrigin) {
    throw new Error("No se pudo encontrar la hoja de origen 'Form Responses 1'.");
  }
  
  // Si la hoja de destino no existe, la creamos con las 19 cabeceras oficiales
  if (!sheetDest) {
    sheetDest = ss.insertSheet('dashboard-status');
    sheetDest.appendRow([
      'id_req', 'correo_oficio', 'fecha', 'entidad', 'sujeto', 'status', 'url_file', 'id_file', 'es_valido', 'datos_adicionales', 'nombre', 'apellido1', 'apellido2', 'correo_usuario', 'rider_patente', 'telefono_usuario', 'Conexion_empresa', 'url_response', 'informacion_adicional'
    ]);
  }
  
  var rowNum;
  if (e && e.range) {
    rowNum = e.range.getRow();
  } else {
    rowNum = sheetOrigin.getLastRow();
  }
  
  if (rowNum < 2) return; // Cabecera
  
  // Obtener los valores de la fila enviada
  var maxCol = sheetOrigin.getLastColumn();
  var rowValues = sheetOrigin.getRange(rowNum, 1, 1, maxCol).getValues()[0];
  
  // Mapear según la estructura real de Form Responses 1
  var timestampVal = rowValues[0];
  var correoOficioVal = rowValues[1] ? rowValues[1].toString().trim() : "";
  var sujetoVal = rowValues[2] ? rowValues[2].toString().trim() : "Usuario";
  
  // Manejar dinámicamente el archivo adjunto: 
  // Columna Q (índice 16) para Rider, Columna D (índice 3) para Usuario
  var urlFileVal = "";
  if (sujetoVal === 'Rider') {
    urlFileVal = rowValues[16] ? rowValues[16].toString().trim() : "";
  } else {
    urlFileVal = rowValues[3] ? rowValues[3].toString().trim() : "";
  }
  
  var datosAdicValRider = rowValues[4];
  var conexionEmpresaVal = rowValues[5] ? rowValues[5].toString().trim() : "";
  var datosAdicValUsuario = rowValues[6];
  
  var riderNombre = rowValues[7] ? rowValues[7].toString().trim() : "";
  var riderApellido1 = rowValues[8] ? rowValues[8].toString().trim() : "";
  var riderApellido2 = rowValues[9] ? rowValues[9].toString().trim() : "";
  var riderPatente = rowValues[10] ? rowValues[10].toString().trim() : "";
  
  var usuarioNombre = rowValues[11] ? rowValues[11].toString().trim() : "";
  var usuarioApellido1 = rowValues[12] ? rowValues[12].toString().trim() : "";
  var usuarioApellido2 = rowValues[13] ? rowValues[13].toString().trim() : "";
  var usuarioCorreo = rowValues[14] ? rowValues[14].toString().trim() : "";
  var usuarioTelefono = rowValues[15] ? rowValues[15].toString().trim() : "";

  // Generar ID único usando el número de fila física de origen
  var emailLower = correoOficioVal.toLowerCase();
  var entidadCode = 'O';
  var entidadText = 'Otros';
  
  if (emailLower.indexOf('@investigaciones.cl') !== -1) {
    entidadCode = 'I';
    entidadText = 'PDI';
  } else if (emailLower.indexOf('@carabineros.cl') !== -1) {
    entidadCode = 'C';
    entidadText = 'Carabineros';
  } else if (emailLower.indexOf('@minpublico.cl') !== -1) {
    entidadCode = 'F';
    entidadText = 'Fiscalía';
  }
  
  var strRowNum = rowNum.toString();
  while (strRowNum.length < 3) {
    strRowNum = '0' + strRowNum;
  }
  var reqId = 'REQ-' + entidadCode + '-' + strRowNum;
  
  // Formatear Fecha
  var fechaStr = "";
  if (timestampVal) {
    if (timestampVal instanceof Date) {
      var dia = ('0' + timestampVal.getDate()).slice(-2);
      var mes = ('0' + (timestampVal.getMonth() + 1)).slice(-2);
      fechaStr = dia + '/' + mes + '/' + timestampVal.getFullYear();
    } else {
      fechaStr = timestampVal.toString().trim().split(' ')[0];
    }
  }
  
  var estadoVal = 'Nuevo';
  var idFileVal = extraerIdDeUrl(urlFileVal);
  
  // Evaluar datos_adicionales
  var datosAdicRaw = (sujetoVal === 'Rider') ? datosAdicValRider : datosAdicValUsuario;
  var datosAdicionalesVal = "false";
  if (datosAdicRaw === true || datosAdicRaw === "TRUE" || datosAdicRaw === "True" || datosAdicRaw === 1) {
    datosAdicionalesVal = "true";
  } else if (datosAdicRaw) {
    var daStr = datosAdicRaw.toString().toLowerCase().trim();
    if (daStr === "si" || daStr === "sí" || daStr === "true") {
      datosAdicionalesVal = "true";
    }
  }

  // Determinar los campos de identidad según el sujeto
  var finalNombre = "";
  var finalApellido1 = "";
  var finalApellido2 = "";
  var finalCorreoUsuario = "";
  var finalRiderPatente = "";
  var finalTelefonoUsuario = "";

  if (sujetoVal === 'Rider') {
    finalNombre = riderNombre;
    finalApellido1 = riderApellido1;
    finalApellido2 = riderApellido2;
    finalRiderPatente = riderPatente;
  } else {
    finalNombre = usuarioNombre;
    finalApellido1 = usuarioApellido1;
    finalApellido2 = usuarioApellido2;
    finalCorreoUsuario = usuarioCorreo;
    finalTelefonoUsuario = usuarioTelefono;
  }
  
  // Obtener la información adicional de la última columna de Form Responses 1
  var infoAdicionalUsuarioVal = rowValues[rowValues.length - 1] ? rowValues[rowValues.length - 1].toString().trim() : "";

  // Guardar fila respetando exactamente las 19 columnas de dashboard-status
  sheetDest.appendRow([
    reqId,                 // 1. id_req
    correoOficioVal,       // 2. correo_oficio
    fechaStr,              // 3. fecha
    entidadText,           // 4. entidad
    sujetoVal,             // 5. sujeto (Rider o Usuario)
    estadoVal,             // 6. status
    urlFileVal,            // 7. url_file
    idFileVal,             // 8. id_file
    "",                    // 9. es_valido (vacío al inicio)
    datosAdicionalesVal,   // 10. datos_adicionales
    finalNombre,           // 11. nombre
    finalApellido1,        // 12. apellido1
    finalApellido2,        // 13. apellido2
    finalCorreoUsuario,    // 14. correo_usuario
    finalRiderPatente,     // 15. rider_patente
    finalTelefonoUsuario,  // 16. telefono_usuario
    conexionEmpresaVal,    // 17. Conexion_empresa
    "",                    // 18. url_response
    infoAdicionalUsuarioVal // 19. informacion_adicional
  ]);
}

/**
 * Lee la hoja dashboard-status (de 19 columnas) de forma extremadamente robusta y rápida.
 * Detecta de manera automática si existen filas antiguas que sufrieron desvíos de columnas (shifted),
 * las repara de manera autónoma y permanente en Google Sheets (guardando 19 columnas), y retorna el JSON
 * mapeado de forma correcta (incluyendo url_response e informacion_adicional) para que el Dashboard muestre la información al instante.
 * Además, auto-sana cualquier fila donde el url_file (Columna G) haya quedado vacío, yendo a buscarlo dinámicamente
 * a la Columna D de Form Responses 1 de origen y guardándolo permanentemente.
 */
function obtenerDatosDashboard() {
  try {
    var ss = obtenerSpreadsheetActiva();
    if (!ss) {
      Logger.log("Error: No se pudo obtener la hoja de cálculo. Verifica el SPREADSHEET_ID.");
      return [];
    }
    
    var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
    var sheetOrigin = getSheetCaseInsensitive(ss, 'Form Responses 1') || getSheetCaseInsensitive(ss, 'form response 1');
    
    if (!sheetDest) {
      Logger.log("Error: No se encontró la pestaña 'dashboard-status'.");
      return [];
    }
    
    var lastRowDest = sheetDest.getLastRow();
    if (lastRowDest < 2) {
      Logger.log("La hoja de destino está vacía (Fila < 2)");
      return [];
    }
    
    // Obtener todas las filas de dashboard-status (leemos hasta 19 columnas para incluir informacion_adicional)
    var destRange = sheetDest.getRange(2, 1, lastRowDest - 1, 19);
    var destValues = destRange.getValues();
    
    var lastRowOrigin = sheetOrigin ? sheetOrigin.getLastRow() : 0;
    var originValues = [];
    if (sheetOrigin && lastRowOrigin >= 2) {
      // Leemos exactamente hasta la columna 18 para poder extraer el archivo de los usuarios de forma correcta
      originValues = sheetOrigin.getRange(2, 1, lastRowOrigin - 1, 18).getValues();
    }
    
    var data = [];
    var sheetUpdated = false;
    
    for (var i = 0; i < destValues.length; i++) {
      var rowDest = destValues[i];
      var rowNumInSheet = i + 2;
      
      var idVal = rowDest[0] ? rowDest[0].toString().trim() : '';
      var correoOficioVal = rowDest[1] ? rowDest[1].toString().trim() : '';
      
      // DETECTAR SI LA FILA ESTÁ DESPLAZADA (La columna 2 es correo_oficio, por lo que debe contener '@')
      var isShifted = (correoOficioVal !== "" && correoOficioVal.indexOf('@') === -1);
      
      var fechaStr = '';
      var entidadVal = '';
      var sujetoVal = 'Usuario';
      var statusVal = 'Nuevo';
      var urlFileVal = '';
      var idFileVal = '';
      var esValidoVal = '';
      var datosAdicionalesVal = false;
      var nombreVal = '';
      var apellido1Val = '';
      var apellido2Val = '';
      var correoUsuarioVal = '';
      var riderPatenteVal = '';
      var telefonoUsuarioVal = '';
      var conexionEmpresaVal = '';
      var urlResponseVal = '';
      var infoAdicionalVal = '';
      
      if (isShifted) {
        // --- FILA DESPLAZADA DETECTADA: INICIAR AUTO-CORRECCIÓN (SELF-HEALING) ---
        Logger.log("Auto-corrección activa para fila desplazada " + rowNumInSheet + " (ID: " + idVal + ")");
        
        // Reconstruir desde los valores desplazados
        var oldFechaVal = rowDest[1];
        if (oldFechaVal) {
          if (oldFechaVal instanceof Date) {
            fechaStr = Utilities.formatDate(oldFechaVal, Session.getScriptTimeZone() || "GMT", "dd/MM/yyyy");
          } else {
            fechaStr = oldFechaVal.toString().trim().split(' ')[0];
          }
        }
        
        entidadVal = rowDest[2] ? rowDest[2].toString().trim() : '';
        sujetoVal = rowDest[3] ? rowDest[3].toString().trim() : 'Usuario';
        statusVal = rowDest[4] ? rowDest[4].toString().trim() : 'Nuevo';
        urlFileVal = rowDest[5] ? rowDest[5].toString().trim() : '';
        esValidoVal = rowDest[6] ? rowDest[6].toString().trim() : '';
        idFileVal = extraerIdDeUrl(urlFileVal);
        
        // Cargar datos ricos desde Form Responses 1 para reparar la fila por completo
        var idParts = idVal.split('-');
        var rowIndexOrigin = idParts.length >= 3 ? parseInt(idParts[2], 10) : -1;
        var rowOrigin = null;
        if (rowIndexOrigin >= 2 && (rowIndexOrigin - 2) < originValues.length) {
          rowOrigin = originValues[rowIndexOrigin - 2];
        }
        
        if (rowOrigin) {
          correoOficioVal = rowOrigin[1] ? rowOrigin[1].toString().trim() : '';
          conexionEmpresaVal = rowOrigin[5] ? rowOrigin[5].toString().trim() : '';
          
          var datosAdicRaw = (sujetoVal === 'Rider') ? rowOrigin[4] : rowOrigin[6];
          if (datosAdicRaw === true || datosAdicRaw === "TRUE" || datosAdicRaw === "True" || datosAdicRaw === 1) {
            datosAdicionalesVal = true;
          } else if (datosAdicRaw) {
            var daStr = datosAdicRaw.toString().toLowerCase().trim();
            if (daStr === "si" || daStr === "sí" || daStr === "true") {
              datosAdicionalesVal = true;
            }
          }
          
          // Reparar urlFileVal con la columna correcta de origen: Q (16) para Rider, D (3) para Usuario
          if (sujetoVal === 'Rider') {
            urlFileVal = (rowOrigin.length >= 17 && rowOrigin[16]) ? rowOrigin[16].toString().trim() : '';
          } else {
            urlFileVal = rowOrigin[3] ? rowOrigin[3].toString().trim() : '';
          }
          idFileVal = extraerIdDeUrl(urlFileVal);
          
          if (sujetoVal === 'Rider') {
            nombreVal = rowOrigin[7] ? rowOrigin[7].toString().trim() : '';
            apellido1Val = rowOrigin[8] ? rowOrigin[8].toString().trim() : '';
            apellido2Val = rowOrigin[9] ? rowOrigin[9].toString().trim() : '';
            riderPatenteVal = rowOrigin[10] ? rowOrigin[10].toString().trim() : '';
          } else {
            nombreVal = rowOrigin[11] ? rowOrigin[11].toString().trim() : '';
            apellido1Val = rowOrigin[12] ? rowOrigin[12].toString().trim() : '';
            apellido2Val = rowOrigin[13] ? rowOrigin[13].toString().trim() : '';
            correoUsuarioVal = rowOrigin[14] ? rowOrigin[14].toString().trim() : '';
            telefonoUsuarioVal = rowOrigin[15] ? rowOrigin[15].toString().trim() : '';
          }
          
          // Obtener información adicional de la última columna de Form Responses 1
          infoAdicionalVal = rowOrigin[rowOrigin.length - 1] ? rowOrigin[rowOrigin.length - 1].toString().trim() : "";
        }
        
        // Guardar la fila reparada permanentemente en dashboard-status (19 columnas)
        sheetDest.getRange(rowNumInSheet, 1, 1, 19).setValues([[
          idVal,
          correoOficioVal,
          fechaStr,
          entidadVal,
          sujetoVal,
          statusVal,
          urlFileVal,
          idFileVal,
          esValidoVal,
          datosAdicionalesVal ? "true" : "false",
          nombreVal,
          apellido1Val,
          apellido2Val,
          correoUsuarioVal,
          riderPatenteVal,
          telefonoUsuarioVal,
          conexionEmpresaVal,
          "", // url_response vacía inicialmente
          infoAdicionalVal // 19. informacion_adicional
        ]]);
        sheetUpdated = true;
        
      } else {
        // --- FILA EN FORMATO CORRECTO DE 19 COLUMNAS ---
        var fechaVal = rowDest[2];
        if (fechaVal) {
          if (fechaVal instanceof Date) {
            fechaStr = Utilities.formatDate(fechaVal, Session.getScriptTimeZone() || "GMT", "dd/MM/yyyy");
          } else {
            fechaStr = fechaVal.toString().trim().split(' ')[0];
          }
        }
        
        entidadVal = rowDest[3] ? rowDest[3].toString().trim() : '';
        sujetoVal = rowDest[4] ? rowDest[4].toString().trim() : 'Usuario';
        statusVal = rowDest[5] ? rowDest[5].toString().trim() : 'Nuevo';
        urlFileVal = rowDest[6] ? rowDest[6].toString().trim() : '';
        esValidoVal = rowDest[8] ? rowDest[8].toString().trim() : '';
        
        // --- AUTO-SANAR URL_FILE VACÍO (COLUMNA G) ---
        if (urlFileVal === "") {
          var idParts = idVal.split('-');
          var rowIndexOrigin = idParts.length >= 3 ? parseInt(idParts[2], 10) : -1;
          var rowOrigin = null;
          if (rowIndexOrigin >= 2 && (rowIndexOrigin - 2) < originValues.length) {
            rowOrigin = originValues[rowIndexOrigin - 2];
          }
          if (rowOrigin) {
            if (sujetoVal === 'Rider') {
              urlFileVal = (rowOrigin.length >= 17 && rowOrigin[16]) ? rowOrigin[16].toString().trim() : '';
            } else {
              urlFileVal = rowOrigin[3] ? rowOrigin[3].toString().trim() : '';
            }
            if (urlFileVal !== "") {
              idFileVal = extraerIdDeUrl(urlFileVal);
              sheetDest.getRange(rowNumInSheet, 7).setValue(urlFileVal); // Columna 7 (G)
              sheetDest.getRange(rowNumInSheet, 8).setValue(idFileVal);  // Columna 8 (H)
              sheetUpdated = true;
              Logger.log("Auto-sanado Columna G/H vacía para el ID: " + idVal);
            }
          }
        } else {
          idFileVal = rowDest[7] ? rowDest[7].toString().trim() : '';
        }
        
        var datosAdicRaw = rowDest[9];
        if (datosAdicRaw === true || datosAdicRaw === "true" || datosAdicRaw === "TRUE" || datosAdicRaw === 1) {
          datosAdicionalesVal = true;
        } else if (datosAdicRaw) {
          var daStr = datosAdicRaw.toString().toLowerCase().trim();
          if (daStr === "si" || daStr === "sí" || daStr === "true") {
            datosAdicionalesVal = true;
          }
        }
        
        nombreVal = rowDest[10] ? rowDest[10].toString().trim() : '';
        apellido1Val = rowDest[11] ? rowDest[11].toString().trim() : '';
        apellido2Val = rowDest[12] ? rowDest[12].toString().trim() : '';
        correoUsuarioVal = rowDest[13] ? rowDest[13].toString().trim() : '';
        riderPatenteVal = rowDest[14] ? rowDest[14].toString().trim() : '';
        telefonoUsuarioVal = rowDest[15] ? rowDest[15].toString().trim() : '';
        conexionEmpresaVal = rowDest[16] ? rowDest[16].toString().trim() : '';
        urlResponseVal = rowDest[17] ? rowDest[17].toString().trim() : '';
        infoAdicionalVal = rowDest[18] ? rowDest[18].toString().trim() : '';
      }
      
      // Construir el objeto unificado de acuerdo con la interfaz requerida por el frontend
      var item = {
        'id': idVal,
        'fecha': fechaStr,
        'entidad': entidadVal,
        'sujeto': sujetoVal,
        'estado': statusVal,
        'url_file': urlFileVal,
        'id_file': idFileVal,
        'es_valido': esValidoVal,
        'correo_oficio': correoOficioVal,
        'datos_adicionales': datosAdicionalesVal,
        'conexion_empresa': conexionEmpresaVal,
        'url_response': urlResponseVal,
        'informacion_adicional': infoAdicionalVal
      };
      
      // Mapear detalles de identidad condicionalmente
      if (sujetoVal === 'Rider') {
        item['rider_nombre'] = nombreVal;
        item['rider_apellido1'] = apellido1Val;
        item['rider_apellido2'] = apellido2Val;
        item['rider_patente'] = riderPatenteVal;
      } else {
        item['usuario_nombre'] = nombreVal;
        item['usuario_apellido1'] = apellido1Val;
        item['usuario_apellido2'] = apellido2Val;
        item['usuario_correo'] = correoUsuarioVal;
        item['usuario_telefono'] = telefonoUsuarioVal;
      }
      
      data.push(item);
    }
    
    if (sheetUpdated) {
      Logger.log("Auto-corrección completada de forma persistente en Google Sheets.");
    }
    
    return data;
  } catch (error) {
    Logger.log("Error crítico en obtenerDatosDashboard: " + error.toString());
    return [];
  }
}

/**
 * Obtiene una hoja de cálculo buscando por nombre sin distinguir entre mayúsculas y minúsculas,
 * y eliminando espacios en blanco adicionales al inicio y final del nombre.
 */
function getSheetCaseInsensitive(ss, name) {
  if (!ss || !name) {
    return null;
  }
  
  var sheets = ss.getSheets();
  var nameLower = name.toLowerCase().replace(/[\s_-]+/g, '');
  
  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName().toLowerCase().replace(/[\s_-]+/g, '');
    if (sheetName === nameLower) {
      return sheets[i];
    }
  }
  return null;
}

/**
 * Encuentra de forma segura la fila que corresponde a un ID de requerimiento en dashboard-status.
 */
function encontrarFilaPorIdReq(sheetDest, idReq) {
  var lastRow = sheetDest.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheetDest.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0].toString().trim() === idReq.toString().trim()) {
      return i + 2; // +2 porque el rango empieza en fila 2
    }
  }
  return -1;
}

/**
 * Obtiene la dirección de correo institucional (correo_oficio) a partir de la columna 2 en dashboard-status.
 */
function obtenerCorreoOficioPorId(idReq) {
  var ss = obtenerSpreadsheetActiva();
  var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
  if (!sheetDest) return "";
  var rowNum = encontrarFilaPorIdReq(sheetDest, idReq);
  if (rowNum === -1) return "";
  return sheetDest.getRange(rowNum, 2).getValue().toString().trim(); // Columna 2 es correo_oficio
}

/**
 * Procesa la aceptación del requerimiento, actualiza su estado a "En Proceso" (Columna 6)
 * y envía un correo electrónico en formato HTML notificando el inicio de la gestión.
 */
function procesarAceptacionBackend(idReq) {
  try {
    var ss = obtenerSpreadsheetActiva();
    var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
    if (!sheetDest) throw new Error("No se encontró la pestaña 'dashboard-status'");
    var rowNum = encontrarFilaPorIdReq(sheetDest, idReq);
    if (rowNum === -1) throw new Error("Requerimiento " + idReq + " no encontrado");
    
    // 1. Actualizar estado a "En Proceso" (Columna 6) en la base de datos
    sheetDest.getRange(rowNum, 6).setValue("En Proceso");
    
    // 2. Obtener correo electrónico de destino (Columna 2)
    var correoOficio = obtenerCorreoOficioPorId(idReq);
    if (!correoOficio) {
      throw new Error("No se pudo obtener el correo del oficio para el requerimiento " + idReq);
    }

    var cuerpoMensajePlano = "Estimado/a,\n\nAcusamos recibo de su requerimiento de información, el cual ya se encuentra en proceso de revisión por parte de nuestro equipo legal.\n\nActualmente nos encontramos analizando los antecedentes con la rigurosidad que el caso amerita. Nos comunicaremos nuevamente con usted por esta misma vía una vez que el proceso de evaluación haya concluido.\n\nAtentamente,\nÁrea Legal - PedidosYa.";
    
    // Diseñar plantilla HTML corporativa de inicio de gestión (Aceptación)
    var cuerpoHtml = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
      '  <div style="background-color: #E11D48; padding: 1.5rem; text-align: center;">' +
      '    <h2 style="color: white; margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.3px;">Área Legal — PedidosYa</h2>' +
      '  </div>' +
      '  <div style="padding: 2rem; background-color: #FFFFFF;">' +
      '    <p style="color: #475569; font-size: 0.95rem; margin-top: 0;">Estimado/a,</p>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      Acusamos recibo de su requerimiento de información, el cual <strong>ya se encuentra en proceso de revisión</strong> por parte de nuestro equipo legal.' +
      '    </p>' +
      '    <div style="background-color: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0;">' +
      '      <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">' +
      '        <tr>' +
      '          <td style="color: #0369A1; font-weight: 600; padding: 0.25rem 0; width: 35%;">Estado:</td>' +
      '          <td style="color: #0284C7; font-weight: bold; padding: 0.25rem 0;">⏳ EN PROCESO</td>' +
      '        </tr>' +
      '      </table>' +
      '    </div>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      Actualmente nos encontramos analizando los antecedentes con la rigurosidad que el caso amerita. Nos comunicaremos nuevamente con usted por esta misma vía una vez que el proceso de evaluación haya concluido.' +
      '    </p>' +
      '    <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 2rem 0;">' +
      '    <p style="color: #64748B; font-size: 0.8rem; line-height: 1.4; margin-bottom: 0; text-align: center;">' +
      '      Este es un correo institucional generado de forma automática. Por favor, no responda directamente a este mensaje.<br>' +
      '      © 2026 PedidosYa Legal. Todos los derechos reservados.' +
      '    </p>' +
      '  </div>' +
      '</div>';
      
    // Enviar correo electrónico institucional en formato HTML con un asunto descriptivo
    GmailApp.sendEmail(correoOficio, "Confirmación de requerimiento - Área Legal PedidosYa", cuerpoMensajePlano, {
      htmlBody: cuerpoHtml
    });
    
    return { success: true, id: idReq, email_sent_to: correoOficio };
  } catch (error) {
    Logger.log("Error en procesarAceptacionBackend: " + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Procesa el rechazo de un requerimiento, actualiza su estado a "Rechazado" (Columna 6) y envía un correo electrónico en formato HTML.
 */
function procesarRechazoBackend(idReq, motivo, comentarioEspecifico) {
  try {
    var ss = obtenerSpreadsheetActiva();
    var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
    if (!sheetDest) throw new Error("No se encontró la pestaña 'dashboard-status'");
    var rowNum = encontrarFilaPorIdReq(sheetDest, idReq);
    if (rowNum === -1) throw new Error("Requerimiento " + idReq + " no encontrado");
    
    // Determinar el motivo detallado
    var motivoTexto = "";
    if (motivo === "falta_orden") {
      motivoTexto = "Resolución Oficial Adjunta inválida";
    } else if (motivo === "conexion_inconsistente") {
      motivoTexto = "Fundamentación de conexión con la empresa poco concisa";
    } else if (motivo === "sin_datos") {
      motivoTexto = "Datos insuficientes para la búsqueda (la persona no registra conexión)";
    } else if (motivo === "otro") {
      motivoTexto = comentarioEspecifico; // Ya viene con el valor de la especificación
    } else {
      motivoTexto = motivo;
    }

    // Actualizar estado a "Rechazado" (Columna 6) y almacenar motivo de rechazo en url_response (Columna 18)
    sheetDest.getRange(rowNum, 6).setValue("Rechazado");
    sheetDest.getRange(rowNum, 18).setValue(motivoTexto);
    
    // Obtener correo electrónico de destino (Columna 2)
    var correoOficio = obtenerCorreoOficioPorId(idReq);
    if (!correoOficio) {
      throw new Error("No se pudo obtener el correo del oficio para el requerimiento " + idReq);
    }
    
    var cuerpoMensajePlano = "Estimado/a,\n\nNos dirigimos a usted en relación con su requerimiento de información.\n\nTras el análisis correspondiente, le informamos que lamentablemente no ha sido posible dar curso a su solicitud por el siguiente motivo: " + motivoTexto + ".\n\nPara poder gestionar su requerimiento de manera exitosa, le solicitamos amablemente que ingrese una nueva solicitud a través del formulario, subsanando el punto señalado.\n\nAtentamente,\nÁrea Legal - PedidosYa.";
    
    // Diseñar plantilla HTML corporativa de rechazo (sin número de requerimiento)
    var cuerpoHtml = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
      '  <div style="background-color: #E11D48; padding: 1.5rem; text-align: center;">' +
      '    <h2 style="color: white; margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.3px;">Área Legal — PedidosYa</h2>' + 
      '  </div>' +  
      '  <div style="padding: 2rem; background-color: #FFFFFF;">' +
      '    <p style="color: #475569; font-size: 0.95rem; margin-top: 0;">Estimado/a,</p>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      Nos dirigimos a usted en relación con su requerimiento de información. Tras el análisis correspondiente, le informamos que lamentablemente <strong>no ha sido posible dar curso a su solicitud</strong>.' +
      '    </p>' +
      '    <div style="background-color: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0;">' +
      '      <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">' +
      '        <tr>' +
      '          <td style="color: #9B2C2C; font-weight: 600; padding: 0.25rem 0; width: 25%;">Motivo:</td>' +
      '          <td style="color: #7B241C; padding: 0.25rem 0;">' + motivoTexto + '</td>' +
      '        </tr>' +
      '      </table>' +
      '    </div>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      Para poder gestionar su requerimiento de manera exitosa, le solicitamos amablemente que ingrese una nueva solicitud a través del formulario, subsanando el punto señalado.' +
      '    </p>' +
      '    <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 2rem 0;">' +
      '    <p style="color: #64748B; font-size: 0.8rem; line-height: 1.4; margin-bottom: 0; text-align: center;">' +
      '      Este es un correo institucional generado de forma automática. Por favor, no responda directamente a este mensaje.<br>' +
      '      © 2026 PedidosYa Legal. Todos los derechos reservados.' +
      '    </p>' +
      '  </div>' +
      '</div>';
      
    // Enviar correo electrónico institucional en formato HTML
    GmailApp.sendEmail(correoOficio, "Actualización sobre su solicitud de información - Área Legal PedidosYa", cuerpoMensajePlano, {
      htmlBody: cuerpoHtml
    });
    
    return { success: true, id: idReq, email_sent_to: correoOficio };
  } catch (error) {
    Logger.log("Error en procesarRechazoBackend: " + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Guarda el archivo de respuesta en Google Drive, actualiza el estado a "Resuelto" (Columna 6),
 * registra la URL del archivo PDF en la columna 18 y envía un correo con el PDF adjunto en formato HTML.
 */
function procesarResolucionBackend(idReq, fileBase64, fileName) {
  try {
    var ss = obtenerSpreadsheetActiva();
    var sheetDest = getSheetCaseInsensitive(ss, 'dashboard-status');
    if (!sheetDest) throw new Error("No se encontró la pestaña 'dashboard-status'");
    var rowNum = encontrarFilaPorIdReq(sheetDest, idReq);
    if (rowNum === -1) throw new Error("Requerimiento " + idReq + " no encontrado");
    
    // 1. Decodificar Base64 y guardar el PDF en Google Drive (en carpeta dinámica o por defecto)
    var folder;
    if (typeof DRIVE_FOLDER_ID !== 'undefined' && DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== "") {
      try {
        folder = DriveApp.getFolderById(DRIVE_FOLDER_ID.trim());
      } catch (folderError) {
        Logger.log("No se pudo acceder a la carpeta por ID: " + folderError.toString() + ". Se creará o buscará por nombre.");
      }
    }
    
    if (!folder) {
      var folderName = "Respuestas_Requerimientos";
      var folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
    }
    
    var contentType = "application/pdf";
    var decodedData = Utilities.base64Decode(fileBase64);
    var blob = Utilities.newBlob(decodedData, contentType, fileName);
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();
    
    // 2. Actualizar estado a "Resuelto" (Columna 6) y registrar url_response (Columna 18) en la base de datos
    sheetDest.getRange(rowNum, 6).setValue("Resuelto");
    sheetDest.getRange(rowNum, 18).setValue(fileUrl);
    
    // 3. Enviar correo formal con el archivo PDF adjunto
    var correoOficio = obtenerCorreoOficioPorId(idReq);
    if (!correoOficio) {
      throw new Error("No se pudo obtener el correo del oficio para el requerimiento " + idReq);
    }
    
 var cuerpoMensajePlano = "Estimado/a,\n\nEn respuesta a su requerimiento de información, hacemos entrega formal de los antecedentes solicitados.\n\nLa información requerida se encuentra adjunta a este mensaje. Con este envío, damos por concluida la gestión de su solicitud.\n\nAtentamente,\nÁrea Legal - PedidosYa.";
    
    // Diseñar plantilla HTML corporativa de resolución
    var cuerpoHtml = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">' +
      '  <div style="background-color: #E11D48; padding: 1.5rem; text-align: center;">' +
      '    <h2 style="color: white; margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.3px;">Área Legal — PedidosYa</h2>' +
      '  </div>' +
      '  <div style="padding: 2rem; background-color: #FFFFFF;">' +
      '    <p style="color: #475569; font-size: 0.95rem; margin-top: 0;">Estimado/a,</p>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      En respuesta a su requerimiento de información, hacemos <strong>entrega formal</strong> de los antecedentes solicitados.' +
      '    </p>' +
      '    <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0;">' +
      '      <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">' +
      '        <tr>' +
      '          <td style="color: #15803D; font-weight: 600; padding: 0.25rem 0; width: 35%;">Estado:</td>' +
      '          <td style="color: #166534; font-weight: bold; padding: 0.25rem 0;">✓ SOLICITUD RESUELTA</td>' +
      '        </tr>' +
      '      </table>' +
      '    </div>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      La información requerida se encuentra <strong>adjunta a este mensaje</strong>.' +
      '    </p>' +
      '    <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">' +
      '      Con este envío, damos por concluida la gestión de su requerimiento.' +
      '    </p>' +
      '    <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 2rem 0;">' +
      '    <p style="color: #64748B; font-size: 0.8rem; line-height: 1.4; margin-bottom: 0; text-align: center;">' +
      '      Este es un correo institucional generado de forma automática. Por favor, no responda directamente a este mensaje.<br>' +
      '      © 2026 PedidosYa Legal. Todos los derechos reservados.' +
      '    </p>' +
      '  </div>' +
      '</div>';
    
    // Enviar correo electrónico con el archivo adjunto y asunto descriptivo
    GmailApp.sendEmail(correoOficio, "Resolución de requerimiento de información - Área Legal PedidosYa", cuerpoMensajePlano, {
      attachments: [blob],
      htmlBody: cuerpoHtml
    });
    
    return { success: true, id: idReq, email_sent_to: correoOficio, file_url: fileUrl };
  } catch (error) {
    Logger.log("Error en procesarResolucionBackend: " + error.toString());
    return { success: false, error: error.toString() };
  }
}