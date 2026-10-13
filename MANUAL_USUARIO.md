# 🖥️ Manual de Operación para el Analista Legal
### 🟥 Sistema de Bandeja de Requerimientos - PedidosYa Chile

> 📽️ **¿Prefieres ver este manual en diapositivas?**
> * **Versión Web Interactiva:** Abre el archivo [`slides.html`](slides.html) en tu navegador para ver o proyectar las diapositivas con modo pantalla completa y exportación a PDF.
> * **Versión Markdown/Marp:** Consulta [`MANUAL_SLIDES.md`](MANUAL_SLIDES.md) para exportar a PowerPoint (`.pptx`) o PDF.
> * **Versión Google Slides:** Ejecuta la función `crearGoogleSlidesManual()` en [`generadorSlides.gs`](generadorSlides.gs) para generar la presentación en Google Drive.

---

## 📌 1. Introducción al Sistema

Bienvenido/a al **Panel de Gestión de Requerimientos Legales** de PedidosYa. Esta plataforma web ha sido diseñada exclusivamente para facilitar y agilizar tu trabajo diario en el análisis, procesamiento y respuesta de los oficios de información emitidos por las instituciones públicas chilenas (como la **Policía de Investigaciones (PDI)**, **Carabineros de Chile** y las distintas **Fiscalías del Ministerio Público**).

A través de esta herramienta visual, podrás:
1. Recibir y centralizar todos los oficios ingresados por el formulario oficial de PedidosYa.
2. Filtrar y buscar casos de forma instantánea por palabras clave, fechas, entidad o estado.
3. Derivar la extracción de datos al equipo de sistemas con un selector de etiquetas dinámicas (tags).
4. Responder formalmente a las autoridades enviando un correo electrónico institucional de forma automática con un PDF de respuesta adjunto.
5. Denegar o rechazar requerimientos que no cumplan con los criterios formales obligatorios de forma automatizada y legal.

---

## 🌐 2. Acceso y Entorno de Trabajo

Para ingresar a la plataforma, abre la URL que te ha facilitado el Administrador del Sistema en tu navegador web (preferentemente Google Chrome). 

### Componentes Clave de la Interfaz:

---
🖥️ *ESPACIO PARA CAPTURA DE PANTALLA: Vista general de la pantalla principal con la tabla y el panel de filtros*
![Bandeja de Requerimientos - Panel Principal](https://placehold.co/800x450/f8fafc/0f172a?text=Captura+de+Pantalla:+Interfaz+Principal+del+Dashboard)
---

* **1. Barra de Navegación Lateral (Sidebar):** Ubicada a la izquierda de la pantalla. Te permite filtrar de forma rápida todos los requerimientos mostrados en la bandeja según el sujeto involucrado:
  * **Dashboard (Todos):** Muestra el listado completo de requerimientos.
  * **Usuarios:** Aísla de forma exclusiva los requerimientos dirigidos a clientes o cuentas de usuarios de la aplicación.
  * **Riders:** Muestra solo las solicitudes dirigidas a repartidores.
* **2. Panel de Filtros Unificado:** Situado en la parte superior. Te permite combinar filtros acumulativos en tiempo real:
  * **Buscar (Texto):** Escribe el ID del requerimiento (ej: `REQ-I-001`), el correo electrónico del oficio, el nombre del sujeto o la patente de un vehículo para buscar coincidencias instantáneas.
  * **Fecha:** Permite escribir o buscar requerimientos asociados a una fecha específica de ingreso.
  * **Entidad:** Selector desplegable para mostrar solo requerimientos provenientes de la **PDI**, **Carabineros** o **Fiscalía**.
  * **Estado:** Selector desplegable para ver casos en estados específicos (**Nuevo**, **En Proceso**, **Resuelto** o **Rechazado**).
  * **Botón "Limpiar Filtros":** Restablece todos los criterios de búsqueda al instante para volver a ver la bandeja completa.
* **3. Tabla de Requerimientos:** Presenta de manera ordenada los requerimientos ingresados en el sistema con su N° de Requerimiento, Fecha de registro, Entidad Solicitante, Tipo de Sujeto, Estado actual (representado con colores intuitivos) y el botón de acción rápida **Ver Detalles**.
* **4. Botón Recargar:** Localizado sobre la esquina derecha de la tabla. Al presionarlo, actualizará los datos desde la hoja central en tiempo real, mostrándote una animación de carga para garantizar que la información de la bandeja siempre esté al día sin necesidad de refrescar la ventana completa.
* **5. Campanita de Notificaciones:** Ubicada en la esquina superior derecha junto a tu perfil. Muestra avisos y confirmaciones de sistema en tiempo real cuando completas una acción o cuando se envían correos automáticos a las autoridades.

---

## 📂 3. Procesamiento de Requerimientos (Paso a Paso)

El ciclo de vida de un requerimiento judicial se gestiona en 4 etapas operativas clave dentro de la plataforma:

### 3.1 Paso 1: Revisión y Análisis del Oficio
Cuando un requerimiento ingresa al sistema, aparecerá por defecto en estado **Nuevo** (etiqueta color azul claro).
1. Haz clic en **Ver Detalles** al final de la fila del requerimiento que deseas revisar.
2. Se abrirá el modal de detalles unificado.
3. Evalúa la **Información de la Solicitud** (Entidad, Correo Oficio, Fecha) y los **Datos Adicionales de Identidad** (RUT, Nombres, Apellidos).
4. Para abrir el documento original de oficio adjunto (PDF), haz clic en el botón **Ver doc. adjunto** en la esquina inferior izquierda. Esto abrirá el archivo de forma segura en una pestaña nueva para que analices si la orden judicial es válida, está firmada correctamente y fundamenta la solicitud.

---
🔍 *ESPACIO PARA CAPTURA DE PANTALLA: Modal de Detalles con información relevante de la orden judicial*
![Detalles del Requerimiento en Modal](https://placehold.co/650x500/ffffff/1f2937?text=Captura+de+Pantalla:+Lectura+de+Detalles+de+un+Ticket)
---

* **Visualización Condicional Automática:**
  * **Si el ticket es de un Rider:** El sistema te mostrará automáticamente los datos de patente del vehículo asociado.
  * **Si el ticket es de un Usuario:** El sistema te presentará información de **Conexión con la Empresa** (últimos accesos) e **Información Adicional Recibida** por parte de la autoridad.

---

### 3.2 Paso 2: Aceptar y Derivar el Caso (Iniciar Extracción Técnica)
Si determinaste que el requerimiento cumple con todos los estándares legales y procede la entrega de información:
1. Dentro del modal de detalles del requerimiento, haz clic en el botón azul **Aceptar Req.** en la esquina inferior derecha.
2. Se desplegará el cuadro interactivo de **Aceptar Requerimiento**.
3. Haz clic en el selector desplegable **Datos a solicitar** y elige las variables de información técnica específicas que la autoridad te ha ordenado recolectar (como *Fotografía Rostro, RUT, Domicilio Particular y/o laboral, Dirección IP*, etc.).
4. Haz clic en **Agregar** para cada variable. Verás cómo se generan dinámicamente etiquetas visuales de color azul para darte un control exacto de lo solicitado. Si te equivocas, puedes borrar cualquier etiqueta haciendo clic en la pequeña "x" de su extremo derecho.
5. De forma opcional, escribe instrucciones claras o especificaciones de fecha en la caja de **Comentarios adicionales** (ej: *"Extracción válida solo para la noche del 14 de agosto"*).
6. Haz clic en **Derivar Caso**. 
   * *¿Qué hace el sistema automáticamente?* Modifica el estado del requerimiento a **En Proceso** (color amarillo), actualiza la bandeja y envía un correo electrónico de recepción formal, redactado de manera corporativa y con diseño oficial, directamente al correo electrónico de la autoridad judicial informándoles que su requerimiento ya está siendo procesado de manera oficial.

---
🏷️ *ESPACIO PARA CAPTURA DE PANTALLA: Modal de aceptación y derivación visual por medio de multi-tags*
![Derivación con Selección de Tags](https://placehold.co/500x400/ffffff/111827?text=Captura+de+Pantalla:+Derivar+con+Seleccion+Multi-Tags)
---

---

### 3.3 Paso 3: Cargar Respuesta y Cerrar Requerimiento (Resolución)
Una vez que el equipo de sistemas o datos adjunte los antecedentes correspondientes en la plataforma:
1. Identifica el requerimiento en proceso en tu bandeja y haz clic en **Ver Detalles**.
2. Verás habilitado el módulo especial verde **Cargar Respuesta del Requerimiento**.
3. Haz clic en **Cargar respuesta (PDF)** y selecciona el archivo oficial de respuesta que deseas entregar a la autoridad judicial. El sistema te informará de inmediato si el archivo cargado no es del tipo PDF para evitar errores de formato en el despacho.
4. Una vez cargado, se visualizará el nombre del archivo adjunto y el botón **Finalizar y enviar respuesta** se activará. Haz clic en él.
5. El sistema procesará el caso: cambiará su estado a **Resuelto** (color verde) en la base de datos, almacenará de forma permanente el enlace al PDF oficial de respuesta en el sistema y **enviará de manera automática un correo institucional formal en HTML al correo del oficio con el PDF consolidado de respuesta adjunto**, dando por resuelto y cerrado el caso con éxito.

---
📤 *ESPACIO PARA CAPTURA DE PANTALLA: Panel interactivo verde de carga de respuesta PDF y cierre exitoso*
![Carga de Respuestas PDF](https://placehold.co/650x300/f0fdf4/16a34a?text=Captura+de+Pantalla:+Formulario+de+Carga+de+Respuestas+en+PDF)
---

---

### 3.4 Paso 4: Rechazar un Requerimiento (Oficios Inválidos o Incompletos)
En caso de que el oficio no cumpla con los requisitos obligatorios de ley (ej: no contiene la resolución judicial firmada por el juez, no hay fundamentación clara de la relación del imputado con el delito o no posee información mínima para realizar una búsqueda en la base de datos):
1. En el modal principal de detalles del requerimiento legal, haz clic en el botón rojo **Rechazar Req.**
2. En la pantalla emergente de confirmación de rechazo, selecciona el **Motivo del Rechazo** desde el selector desplegable:
   * *Resolución Judicial Adjunta inválida* (cuando el oficio adjunto no es admisible o carece de firmas).
   * *Fundamentación de conexión poco concisa* (cuando no hay nexo claro de por qué se pide la información).
   * *Datos insuficientes para la búsqueda* (cuando faltan correos, RUT o datos mínimos del sujeto).
   * *Otro (especifique)*: Al seleccionarlo, se desplegará de forma inteligente un cuadro de texto para que redactes de manera detallada el motivo legal del rechazo.
3. Haz clic en el botón rojo **Confirmar Rechazo**.
4. El requerimiento pasará automáticamente al estado **Rechazado** (color rojo) en la tabla general.
5. El sistema **despachará de manera instantánea un correo electrónico formal redactado en formato HTML corporativo a la autoridad judicial correspondiente**, informándoles detalladamente que la solicitud fue denegada por improcedencia legal, especificando el motivo exacto del rechazo e indicándoles las instrucciones para corregir la solicitud y reingresarla a través del formulario oficial.

---
❌ *ESPACIO PARA CAPTURA DE PANTALLA: Selector de motivos de rechazo en modal y botón de confirmación*
![Motivos de Rechazo e Ingreso de Comentario](https://placehold.co/500x350/ffffff/991b1b?text=Captura+de+Pantalla:+Proceso+de+Rechazo+de+Oficios)
---

---

## 📊 4. Control de Notificaciones de Envío

Para brindarte total tranquilidad sobre cada acción ejecutada, el sistema incluye una **Burbuja Flotante de Notificaciones** en el extremo inferior derecho de la pantalla. 

Cada vez que realices una acción (como un aceptación, un rechazo o el envío de respuestas en PDF), aparecerá un aviso del sistema en tiempo real. Esta alerta te mostrará el **Asunto** exacto del correo despachado, la dirección del destinatario y el cuerpo del mensaje enviado, asegurándote un control completo sobre las respuestas emitidas a la PDI, Carabineros o Fiscalías.

---
🔔 *ESPACIO PARA CAPTURA DE PANTALLA: Vista previa de una notificación de correo enviado con éxito*
![Alerta de Confirmación de Envío de Correo](https://placehold.co/420x200/0f172a/f1f5f9?text=Captura+de+Pantalla:+Notificacion+de+Correo+Despachado+con+Exito)
---

---
*Manual de Operación de Requerimientos Legales - PedidosYa Legal Chile - Versión 1.0 (2026)*
