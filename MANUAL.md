# 📖 Manual de Uso - Sistema de Gestión de Requerimientos Legales
### 🟥 PedidosYa Legal & Compliance Chile

> 📽️ **Versión en Diapositivas (Slides):**
> * **Diapositivas Web Interactivas:** Abre [`slides.html`](slides.html) para navegar, proyectar en pantalla completa o imprimir a PDF.
> * **Diapositivas Markdown:** Revisa [`MANUAL_SLIDES.md`](MANUAL_SLIDES.md) para Marp, PowerPoint o Google Slides.
> * **Generador para Google Drive:** Revisa [`generadorSlides.gs`](generadorSlides.gs) para generar la presentación en Google Slides vía script.

---

## 📌 1. Introducción y Propósito del Sistema

El **Sistema de Gestión de Requerimientos Legales** es una solución integral desarrollada sobre el ecosistema de **Google Workspace (Google Sheets, Gmail, Google Drive, Google Forms)** y **Google Apps Script**. Su propósito fundamental es centralizar, analizar, procesar y responder de forma eficiente, ágil y segura a los oficios judiciales y requerimientos de información emitidos por autoridades públicas chilenas (como la **PDI, Carabineros de Chile, y el Ministerio Público / Fiscalía**).

El sistema se divide en dos grandes interfaces:
1. **Un Motor de Backend (Google Apps Script):** Automatiza la lectura de correos institucionales, el registro de casos, el control de estados y el despacho de correos automáticos.
2. **Un Dashboard Web Moderno (HTML5/CSS3/JavaScript):** Proporciona al Analista Legal una bandeja visual unificada para buscar, filtrar y gestionar el ciclo de vida completo de cada requerimiento de forma profesional.

---

## 🎨 2. Arquitectura del Flujo de Trabajo

El flujo del requerimiento judicial atraviesa por distintas etapas automatizadas e interacciones del analista:

```
[ Correo de Autoridad ] ──> ( Lectura de Gmail / Registro de Oficios )
                                          │
                                          ▼
[ Formulario de Registro ] ──> ( Registro en "dashboard-status" )
                                          │
                                          ▼
                                🖥️ [ DASHBOARD WEB ]
                             /            │           \
                            /             │            \
                           ▼              ▼             ▼
                     [ Aceptar ]    [ Rechazar ]   [ Finalizar ]
                     Deriva caso     Envía mail     Carga PDF y
                     al equipo       formal con     envía correo
                     técnico         el motivo      a la entidad
```

1. **Lectura y Registro de Correos (`code.gs`):** El script `registrarOficios` analiza la bandeja de entrada de Gmail buscando correos no leídos de dominios autorizados o derivados internamente. Registra la información básica en la pestaña `mails-flujo`.
2. **Formulario de Registro de Entrada (`codigo.gs`):** Las autoridades o el derivador legal completan el Google Form. Al ser enviado, el trigger de `onFormSubmit` en `codigo.gs` intercepta el envío, genera un ID correlativo único con formato `REQ-[ENTIDAD]-[CORRELATIVO]` (por ejemplo: `REQ-I-024` para PDI) y crea una fila consolidada en la pestaña central `dashboard-status`.
3. **Bandeja de Entrada del Analista (`dashboard.html`):** Los requerimientos se cargan dinámicamente en el Dashboard Web. Desde aquí, el Analista Legal filtra los casos, revisa la información cargada y los documentos adjuntos originales.
4. **Gestión de Estados en el Dashboard:**
   * **Nuevo:** Caso recién ingresado. Permite al analista evaluar si es admisible.
   * **En Proceso:** El analista acepta el requerimiento y define las variables/tags técnicas que se le solicitarán al equipo de datos (extracción).
   * **Respuesta Lista:** El equipo técnico ha adjuntado los datos extraídos (archivo PDF).
   * **Resuelto:** El analista carga la resolución y el sistema envía de forma automática un correo electrónico corporativo formal a la entidad con el PDF consolidado adjunto.
   * **Rechazado:** Si el oficio contiene errores (ej: firma inválida, falta de fundamentación de conexión), se rechaza con un solo clic. El sistema notifica de inmediato a la autoridad mediante correo formal detallando el motivo del rechazo.

---

## 🛠️ 3. Guía de Configuración Inicial (Para Administradores)

Para desplegar y poner en marcha este sistema en su cuenta de Google Workspace, siga estos pasos:

### Paso 1: Configurar el Archivo de Google Sheets
1. Cree un Google Sheet y copie su ID único de la barra de direcciones (el código largo entre `/d/` y `/edit`).
2. Cree una pestaña llamada **`Configuracion`** con el siguiente formato:
   
   | Variable | Valor |
   | :--- | :--- |
   | `EMAIL_DERIVADOR` | _[Correo del derivador interno]_ |
   | `DOMINIOS_PERMITIDOS` | `investigaciones.cl,carabineros.cl,minpublico.cl` |
   | `DRIVE_FOLDER_ID` | _[ID de la carpeta de Google Drive para guardar respuestas]_ |

3. Pegue el ID del documento de Google Sheets en la variable global del código de Apps Script:
   * En `code.gs`: `var ID_SHEET = "TU_ID_AQUÍ";`
   * En `codigo.gs`: `var SPREADSHEET_ID = "TU_ID_AQUÍ";`
   * En `triggers.gs`: `const SPREADSHEET_ID = 'TU_ID_AQUÍ';`

### Paso 2: Crear el Activador Automático de Formularios (Triggers)
Para que los requerimientos se registren en tiempo real al enviar el formulario:
1. Abra el editor de **Google Apps Script** desde el Google Sheet (`Extensiones > Apps Script`).
2. En el menú de funciones, seleccione la función **`crearActivadorFormulario`** y haga clic en **Ejecutar**. Esto registrará el activador de envío de manera resiliente sin que tenga que configurarlo visualmente.

---
🚀 *ESPACIO PARA CAPTURA DE PANTALLA: Configuración del Trigger de Formulario en Google Apps Script*
![Configuración del Trigger de Formulario en Apps Script](https://placehold.co/800x400/ea044e/ffffff?text=Captura+de+Pantalla:+Ejecucion+de+crearActivadorFormulario+en+Apps+Script)
---

### Paso 3: Publicar la Aplicación Web (Dashboard)
1. En la esquina superior derecha del editor de Apps Script, haga clic en **Implementar > Nueva implementación**.
2. Seleccione el tipo **Aplicación web**.
3. Configure los accesos:
   * **Ejecutar como:** `Usuario que accede a la aplicación web` o `Yo (tu correo)`.
   * **Quién tiene acceso:** `Cualquier persona` o `Solo los usuarios de mi organización` (Recomendado por seguridad de cumplimiento).
4. Copie la **URL de la aplicación web** provista. Esta será la URL de acceso directo al Dashboard Legal.

---

## 🖥️ 4. Guía de Operación del Dashboard Legal (Paso a Paso)

### 4.1 Pantalla Principal e Interfaz
Al abrir la URL de la aplicación web, se presentará el Panel de Gestión de Requerimientos Legales:

---
🖥️ *ESPACIO PARA CAPTURA DE PANTALLA: Vista general de la Bandeja de Requerimientos y Sidebar*
![Bandeja de Requerimientos - Dashboard General](https://placehold.co/800x450/f8fafc/0f172a?text=Captura+de+Pantalla:+Dashboard+General+-+Bandeja+de+Requerimientos)
---

La interfaz cuenta con los siguientes componentes clave:
* **A) Sidebar (Navegación Lateral):** Permite aislar y filtrar rápidamente todos los registros de la bandeja según la naturaleza del sujeto involucrado (**Todos**, **Usuarios** o **Riders**).
* **B) Panel de Filtros Unificado:** Permite hacer búsquedas acumulativas y en tiempo real por término de texto (ID, nombre, correo, patente), filtrado de fecha de oficio, y selectores desplegables para entidades (PDI, Carabineros, Fiscalía) y estados (Nuevo, En Proceso, Resuelto, Rechazado).
* **C) Tabla de Requerimientos:** Muestra el listado de todos los oficios registrados en Google Sheets con scroll inteligente de hasta un 55% de la pantalla para compactación visual óptima.
* **D) Botón Recargar:** Invoca una llamada asíncrona directa a Google Sheets para refrescar los datos sin recargar la pestaña del navegador.
* **E) Campanita de Notificaciones:** Despliega alertas del sistema y un registro en tiempo real de los correos formales enviados automáticamente por la plataforma.

---

### 4.2 Proceso de Revisión y Gestión de un Requerimiento

#### Paso 1: Abrir el Detalle del Ticket
Ubique el requerimiento que desea gestionar en la tabla y haga clic en **Ver Detalles** en la columna derecha. Se abrirá el modal de detalles con un diseño elegante y estructurado.

El modal cargará automáticamente secciones según el sujeto:
* **Si es Rider:** Mostrará sus nombres, apellidos y patente del vehículo registrada en el requerimiento.
* **Si es Usuario:** Mostrará sus nombres, apellidos, correo, teléfono, y agregará una sección con la **Conexión de la Empresa** (obtenida de los logs técnicos) e **Información Adicional Recibida**.
* **Visualización del Oficio:** El botón **Ver doc. adjunto** en la esquina inferior izquierda abrirá de forma segura en una nueva pestaña el PDF oficial del requerimiento legal almacenado en Google Drive.

---
🔍 *ESPACIO PARA CAPTURA DE PANTALLA: Modal de Detalles con información condicional de Usuario / Rider*
![Modal de Detalles del Ticket](https://placehold.co/650x500/ffffff/1f2937?text=Captura+de+Pantalla:+Modal+de+Detalles+del+Requerimiento)
---

#### Paso 2: Aceptar y Derivar el Caso (Iniciar Búsqueda Técnica)
Si el requerimiento es válido y procede su tramitación:
1. Haga clic en el botón azul **Aceptar Req.**
2. Se desplegará el modal interactivo de **Aceptar Requerimiento**.
3. Seleccione de la lista desplegable los campos de datos exactos que se le solicitarán al equipo técnico de extracción (ej: *Fotografía Cédula Identidad, RUT, Domicilio Particular*, etc.).
4. Haga clic en **Agregar** para ir creando etiquetas visuales (Multiselect Tags).
5. Escriba comentarios adicionales si es necesario y haga clic en **Derivar Caso**. El requerimiento pasará automáticamente al estado **En Proceso** y se enviará un correo de confirmación de recepción formal y automatizado en formato HTML a la entidad correspondiente.

---
🏷️ *ESPACIO PARA CAPTURA DE PANTALLA: Formulario de derivación de caso con selección múltiple de tags*
![Modal Aceptar y Derivar Caso](https://placehold.co/500x400/ffffff/111827?text=Captura+de+Pantalla:+Modal+de+Aceptacion+con+Multi-Tags)
---

#### Paso 3: Carga de Respuesta y Cierre Exitoso
Cuando el requerimiento está **En Proceso** y el equipo de datos entrega la extracción:
1. Abra el detalle del requerimiento en proceso. El sistema activará el módulo visual verde **Cargar Respuesta del Requerimiento**.
2. Haga clic en **Cargar respuesta (PDF)** y seleccione el archivo de respuesta consolidado en su computadora. El sistema validará que sea un formato PDF válido.
3. El botón **Finalizar y enviar respuesta** se habilitará. Haga clic en él.
4. El sistema subirá el archivo de forma asíncrona a la carpeta de Google Drive configurada, actualizará el estado del caso a **Resuelto**, guardará la URL del archivo de manera persistente en la planilla y **enviará de manera automática el correo institucional formal a la autoridad adjuntando el PDF de respuesta con un elegante diseño HTML corporativo**.

---
📤 *ESPACIO PARA CAPTURA DE PANTALLA: Módulo de Carga de Respuesta PDF (Verde)*
![Módulo de Carga de Respuesta PDF](https://placehold.co/650x300/f0fdf4/16a34a?text=Captura+de+Pantalla:+Módulo+Verde+de+Carga+de+Respuestas)
---

#### Paso 4: Rechazo Formal de un Requerimiento (Si no es Admisible)
Si al revisar el oficio original detecta que no es admisible por inconsistencias en la fundamentación de conexión, datos insuficientes o falta de resolución judicial válida:
1. En el modal principal de detalles, haga clic en el botón rojo **Rechazar Req.**
2. En el modal emergente de rechazo, seleccione el motivo correspondiente de la lista desplegable:
   * *Resolución Judicial Adjunta inválida*
   * *Fundamentación de conexión poco concisa*
   * *Datos insuficientes para la búsqueda*
   * *Otro (especifique)*: Habilitará un campo de texto para redactar un motivo personalizado.
3. Haga clic en **Confirmar Rechazo**.
4. El caso cambiará su estado a **Rechazado** en Google Sheets, y el backend **enviará automáticamente un correo electrónico formal a la autoridad solicitante indicando el rechazo, citando detalladamente el motivo de la denegación y adjuntando una plantilla HTML instructiva** para el reingreso oportuno de la solicitud legal.

---
❌ *ESPACIO PARA CAPTURA DE PANTALLA: Formulario de rechazo con opciones y justificación por correo*
![Modal de Rechazo del Caso](https://placehold.co/500x350/ffffff/991b1b?text=Captura+de+Pantalla:+Formulario+de+Rechazo+de+Requerimientos)
---

---

## 🚨 5. Buenas Prácticas y Cumplimiento de Seguridad

Dado que este sistema maneja información de carácter altamente confidencial y sensible (enmarcado en la legislación de protección de datos personales y secreto de sumarios judiciales), se deben cumplir estrictamente los siguientes lineamientos:

1. **Gestión de Accesos:** No comparta la URL pública del Dashboard fuera del personal legal autorizado. Utilice la restricción por dominio corporativo al publicar la Aplicación Web.
2. **Resguardo de Credenciales:** El archivo de código de Google Apps Script nunca debe exponer claves privadas ni tokens directamente. El acceso a los recursos de Google Drive y Gmail se hereda de los permisos de la cuenta que ejecuta o publica el script.
3. **Mantenimiento de Hojas de Cálculo:** No altere de forma manual el orden, nombres o cantidad de las columnas en la pestaña **`dashboard-status`** (contiene 19 columnas), ya que el backend de self-healing y carga masiva del dashboard lee y escribe en lote respetando estrictamente estas posiciones de columnas físicas.
4. **Archivos de Google Drive:** La carpeta de Drive configurada bajo la variable `DRIVE_FOLDER_ID` debe contar con políticas de retención y borrado seguro de acuerdo con los lineamientos de cumplimiento normativo de PedidosYa.

---
*Fin del Manual de Operación - PedidosYa Legal Chile - Versión 1.0 (2026)*
