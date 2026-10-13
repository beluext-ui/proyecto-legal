/**
 * @fileoverview Script automatizado para generar la presentación oficial del Manual
 * en Google Slides dentro de Google Drive con la identidad visual de PedidosYa.
 * 
 * INSTRUCCIONES:
 * 1. Abre tu proyecto en el editor de Google Apps Script (script.google.com).
 * 2. Agrega este archivo o copia la función `crearGoogleSlidesManual()`.
 * 3. Ejecuta la función `crearGoogleSlidesManual()`.
 * 4. La URL de la presentación en Google Slides se mostrará en los registros (Logs).
 */

function crearGoogleSlidesManual() {
  const TITULO_PRESENTACION = "Manual de Operación Legal - PedidosYa Chile (2026)";
  const COLOR_PRIMARIO = "#EA044E";     // Rojo PedidosYa
  const COLOR_FONDO_OSCURO = "#0F172A"; // Slate Oscuro
  const COLOR_TEXTO_MUTED = "#64748B";

  // Crear la presentación en la raíz de Google Drive
  const deck = SlidesApp.create(TITULO_PRESENTACION);
  Logger.log("Creando presentación en Google Slides: " + deck.getName());

  // Diapositiva 1: Portada
  const slidePortada = deck.getSlides()[0];
  slidePortada.getBackground().setSolidFill(COLOR_FONDO_OSCURO);
  
  const shapeTitulo = slidePortada.insertTextBox("Bandeja de Requerimientos Legales\nManual para el Analista Legal", 60, 100, 600, 150);
  const textTitulo = shapeTitulo.getText();
  textTitulo.getTextStyle().setFontFamily("Inter").setFontSize(28).setBold(true).setForegroundColor("#FFFFFF");
  textTitulo.getRange(0, 36).getTextStyle().setForegroundColor(COLOR_PRIMARIO);

  const shapeSub = slidePortada.insertTextBox("PedidosYa Legal & Compliance Chile • Versión Automatizada 2026\nGestión de Oficios Judiciales (PDI, Carabineros, Fiscalías)", 60, 270, 600, 80);
  shapeSub.getText().getTextStyle().setFontFamily("Inter").setFontSize(14).setForegroundColor("#94A3B8");

  // Lista de diapositivas de contenido
  const contenidoSlides = [
    {
      titulo: "Propósito y Objetivos del Sistema",
      subtitulo: "Centralización y eficiencia operativa",
      puntos: [
        "Centralización total: Unifica los oficios recibidos por formulario oficial en un solo panel web.",
        "Criterio y rigor jurídico: Evaluación de admisibilidad, mandatos judiciales y nexo causal.",
        "Derivación técnica estandarizada: Petición de antecedentes a sistemas mediante multietiquetas.",
        "Despacho automatizado: Correos corporativos automáticos con PDF de respuesta o rechazo fundado."
      ]
    },
    {
      titulo: "Arquitectura y Flujo del Requerimiento",
      subtitulo: "Ciclo de vida de la orden judicial",
      puntos: [
        "1. Ingreso: Autoridad envía oficio vía Formulario Oficial o correo institucional.",
        "2. Registro: Trigger genera correlativo único (ej: REQ-I-024) y almacena en Google Sheets.",
        "3. Análisis Legal: El analista evalúa la validez jurídica en el Dashboard Web.",
        "4. Cierre y Despacho: Extracción de datos, subida de PDF y despacho automático a la entidad."
      ]
    },
    {
      titulo: "Estados Oficiales del Requerimiento",
      subtitulo: "Identificación visual mediante colores de estado",
      puntos: [
        "Nuevo (Azul): Caso recibido pendiente de análisis de admisibilidad legal.",
        "En Proceso (Amarillo): Solicitud acogida a trámite. Se derivó a sistemas con tags y se notificó a la autoridad.",
        "Resuelto (Verde): Informe PDF adjuntado y despachado por correo formal a la institución solicitante.",
        "Rechazado (Rojo): Oficio inadmisible (sin firma, sin fundamento). Se envió correo formal con el motivo."
      ]
    },
    {
      titulo: "Entorno del Dashboard Web",
      subtitulo: "Componentes clave para el trabajo diario",
      puntos: [
        "Sidebar Lateral: Filtra requerimientos por sujeto (Todos, Usuarios o Riders).",
        "Barra de Filtros Unificada: Búsqueda dinámica por ID, RUT, patente, fechas, entidad y estado.",
        "Tabla Compacta: Vista ordenada con scroll inteligente optimizado para pantallas corporativas.",
        "Campanita de Notificaciones: Registro de auditoría con los correos automáticos emitidos."
      ]
    },
    {
      titulo: "Paso 1: Recepción y Análisis del Oficio",
      subtitulo: "Examen de admisibilidad jurídica obligatoria",
      puntos: [
        "1. Ubicar el ticket en estado 'Nuevo' y presionar 'Ver Detalles'.",
        "2. Revisar la identidad del sujeto (RUT, nombres, datos de contacto).",
        "3. Hacer clic en 'Ver doc. adjunto' para abrir el PDF original de la orden judicial en Drive.",
        "4. Comprobar firma electrónica válida, nexo causal explícito y suficiencia de antecedentes."
      ]
    },
    {
      titulo: "Visualización Dinámica: Rider vs. Usuario",
      subtitulo: "Adaptación según el tipo de persona investigada",
      puntos: [
        "Caso Rider: Muestra de forma destacada el campo de Patente del Vehículo (procedimientos de tránsito o flagrancia).",
        "Caso Usuario: Despliega la sección 'Conexión con la Empresa' (fechas e IPs de acceso).",
        "Información Adicional: Exhibe detalles provistos por la fiscalía (órdenes de pedido, números de tarjeta)."
      ]
    },
    {
      titulo: "Paso 2: Aceptar y Derivar a Sistemas",
      subtitulo: "Selección de etiquetas técnicas (tags) y notificación",
      puntos: [
        "1. Presionar 'Aceptar Req.' dentro del modal de detalles del caso admisible.",
        "2. Seleccionar variables del menú (RUT, Fotografía Rostro, IPs, Teléfono, etc.) y pulsar 'Agregar'.",
        "3. Indicar especificaciones temporales en 'Comentarios adicionales' si aplica.",
        "4. Presionar 'Derivar Caso'. El estado cambia a 'En Proceso' y se notifica formalmente a la autoridad."
      ]
    },
    {
      titulo: "Paso 3: Carga de Respuesta y Cierre",
      subtitulo: "Informe pericial PDF y despacho oficial a la autoridad",
      puntos: [
        "1. En el ticket 'En Proceso', abrir 'Ver Detalles' y acceder al panel verde de carga.",
        "2. Pulsar 'Cargar respuesta (PDF)' y seleccionar el archivo de peritaje (valida extensión PDF).",
        "3. Hacer clic en 'Finalizar y enviar respuesta'.",
        "4. El backend almacena el PDF en Drive, cambia el ticket a 'Resuelto' y despacha el correo formal con el PDF adjunto."
      ]
    },
    {
      titulo: "Paso 4: Rechazo Formal por Inadmisibilidad",
      subtitulo: "Procedimiento ante órdenes defectuosas o incompletas",
      puntos: [
        "1. Hacer clic en 'Rechazar Req.' dentro del modal de detalles.",
        "2. Elegir la causal: Resolución inválida, Fundamentación poco concisa, Datos insuficientes u Otro.",
        "3. Presionar 'Confirmar Rechazo'.",
        "4. El caso pasa a 'Rechazado' y se envía de forma inmediata un correo oficial citando el motivo legal y los pasos para subsanar."
      ]
    },
    {
      titulo: "Trazabilidad y Notificaciones en Tiempo Real",
      subtitulo: "Supervisión total de las comunicaciones procesales",
      puntos: [
        "Campana de Notificaciones: Mantiene el historial de las acciones completadas en la jornada.",
        "Burbuja Emergente de Envío: Despliega confirmación visual con destinatario, asunto y cuerpo del correo enviado.",
        "Cero dudas operativas: Certeza absoluta de que la fiscalía o policía recibió la comunicación formal."
      ]
    },
    {
      titulo: "Seguridad y Cumplimiento de Datos",
      subtitulo: "Obligaciones legales estrictas del equipo",
      puntos: [
        "Secreto Procesal (Art. 182 Código Procesal Penal): Prohibición estricta de divulgar carpetas investigativas.",
        "Protección de Datos Personales: Entrega acotada exclusivamente a lo decretado por la autoridad judicial.",
        "Control de Acceso: Restricción exclusiva para cuentas de dominio corporativo autorizadas.",
        "Integridad de Sheets: No alterar manualmente las 19 columnas de la pestaña 'dashboard-status'."
      ]
    },
    {
      titulo: "Checklist Operativo Diario del Analista",
      subtitulo: "Protocolo de inicio y cierre de jornada",
      puntos: [
        "☀️ Inicio: Presionar 'Recargar', priorizar casos 'Nuevos' de flagrancia (PDI/Carabineros) y derivar a sistemas.",
        "🌙 Cierre: Gestionar tickets 'En Proceso', subir informes PDF, despachar cierres y validar plazos perentorios.",
        "Verificación: Comprobar en notificaciones que todos los correos automáticos fueron despachados con éxito."
      ]
    }
  ];

  // Crear cada diapositiva de contenido
  contenidoSlides.forEach(function(item, index) {
    const slide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    
    // Franja decorativa superior
    const franja = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, 0, 720, 8);
    franja.getFill().setSolidFill(COLOR_PRIMARIO);
    franja.getBorder().setTransparent();

    // Título de la diapositiva
    const boxTitulo = slide.insertTextBox(item.titulo, 40, 30, 640, 50);
    boxTitulo.getText().getTextStyle().setFontFamily("Inter").setFontSize(20).setBold(true).setForegroundColor(COLOR_FONDO_OSCURO);

    // Subtítulo
    const boxSub = slide.insertTextBox(item.subtitulo, 40, 70, 640, 25);
    boxSub.getText().getTextStyle().setFontFamily("Inter").setFontSize(11).setForegroundColor(COLOR_TEXTO_MUTED);

    // Contenedor de puntos clave
    const boxContenido = slide.insertTextBox("", 40, 110, 640, 250);
    const textContenido = boxContenido.getText();
    
    item.puntos.forEach(function(punto, pIdx) {
      if (pIdx > 0) textContenido.appendParagraph("");
      const p = textContenido.appendParagraph("• " + punto);
      p.getTextStyle().setFontFamily("Inter").setFontSize(13).setForegroundColor("#1E293B");
    });

    // Pie de diapositiva
    const boxFooter = slide.insertTextBox("PedidosYa Legal & Compliance • Chile | Diapositiva " + (index + 2) + " de " + (contenidoSlides.length + 1), 40, 370, 640, 20);
    boxFooter.getText().getTextStyle().setFontFamily("Inter").setFontSize(9).setForegroundColor("#94A3B8");
  });

  const url = deck.getUrl();
  Logger.log("✅ Presentación creada con éxito en Google Slides!");
  Logger.log("URL de acceso: " + url);
  return url;
}
