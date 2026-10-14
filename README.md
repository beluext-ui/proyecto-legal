# ⚖️ Sistema de Gestión de Requerimientos Legales
### 🟥 PedidosYa Legal & Compliance Chile

Plataforma integral para centralizar, auditar, procesar y responder con trazabilidad a los requerimientos de información y oficios judiciales emitidos por autoridades públicas de Chile (**Policía de Investigaciones - PDI**, **Carabineros de Chile** y **Ministerio Público / Fiscalías**).

Desarrollada sobre el ecosistema **Google Workspace** (**Google Apps Script**, **Google Sheets**, **Gmail**, **Google Drive**, **Google Forms**) y una interfaz web moderna en **HTML5/CSS3/JavaScript**.

---

## 🚀 Características Principales

- **📥 Recepción Automatizada y Derivación:**
  - Ingesta directa de oficios recibidos vía Gmail o canalizados a través de un derivador interno (`code.gs`).
  - Registro sincronizado con Google Forms y generación automática de identificadores correlativos únicos (`REQ-[ENTIDAD]-[CORRELATIVO]`, ej. `REQ-I-024` para PDI).
- **🖥️ Dashboard Web Unificado:**
  - Interfaz visual moderna, responsiva y rápida para analistas legales (`dashboard.html`, `funciones.html`).
  - Filtros en tiempo real por término de búsqueda, fecha, entidad pública solicitante, estado y tipo de sujeto (Usuarios vs. Riders/Repartidores).
- **🔄 Gestión del Ciclo de Vida del Requerimiento:**
  - **Nuevo:** Revisión y admisibilidad del oficio judicial y sus adjuntos.
  - **En Proceso:** Derivación técnica con selector interactivo de etiquetas (tags) para extracción de datos (RUT, IP, fotografía, domicilios, etc.).
  - **Respuesta Lista:** Confirmación de archivo PDF consolidado de extracción técnica.
  - **Resuelto:** Despacho automático de correo institucional formal hacia la autoridad con el documento PDF adjunto.
  - **Rechazado:** Notificación inmediata con motivo formal de rechazo en caso de vicios o falta de fundamentación legal.
- **📊 Material de Capacitación Integrado:**
  - Presentación web interactiva en diapositivas (`slides.html`).
  - Presentación en Markdown / Marp (`MANUAL_SLIDES.md`).
  - Generador automatizado de presentaciones en Google Slides mediante Apps Script (`generadorSlides.gs`).

---

## 🏛️ Arquitectura del Flujo de Trabajo

```
   [ Correo Autoridad (Gmail) ]            [ Google Form (Entrada) ]
                │                                       │
                ▼                                       ▼
       ( registrarOficios )                     ( onFormSubmit )
                │                                       │
                └───────────────► 📋 ◄──────────────────┘
                            Google Sheets
                          (dashboard-status)
                                 │
                                 ▼
                     🖥️ [ DASHBOARD LEGAL ]
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
           [ ACEPTAR ]     [ RECHAZAR ]    [ FINALIZAR ]
           Deriva con      Notifica vía    Envía correo a
          tags a equipo     correo con     la autoridad con
             técnico          motivo         PDF adjunto
```

---

## 📂 Estructura del Proyecto

| Archivo | Descripción |
| :--- | :--- |
| **`codigo.gs`** | Backend principal de Google Apps Script: triggers de formulario, lógica de estados, gestión en Google Sheets, integración con Google Drive y despacho de correos. |
| **`code.gs`** | Módulo de lectura, análisis y registro automático de oficios desde la bandeja de entrada de Gmail. |
| **`triggers.gs`** | Rutina de inicialización y alta resiliente de activadores (`onFormSubmit`) en Apps Script. |
| **`dashboard.html`** | Estructura visual, estilos CSS e interfaz de usuario de la aplicación web del Analista Legal. |
| **`funciones.html`** | Funciones cliente en JavaScript (control de modales, llamadas a `google.script.run`, reactividad de filtros y rendering de etiquetas). |
| **`generadorSlides.gs`** | Script automatizado para construir la presentación de inducción directamente en Google Slides. |
| **`slides.html`** | Diapositivas web interactivas con modo proyector y exportación a PDF. |
| **`MANUAL.md`** | Manual técnico y administrativo detallado del sistema. |
| **`MANUAL_USUARIO.md`** | Manual de operación paso a paso para el Analista Legal. |
| **`MANUAL_SLIDES.md`** | Guión de diapositivas en formato Marp/Markdown. |

---

## ⚙️ Puesta en Marcha y Configuración

### 1. Requisitos Previos
- Cuenta institucional de Google Workspace con permisos para crear hojas de cálculo, formularios y proyectos de Google Apps Script.
- Acceso a Google Drive para alojar documentos y respuestas en PDF.

### 2. Configuración de Google Sheets
1. Crear una hoja de cálculo en Google Sheets y copiar su ID (el código alfanumérico entre `/d/` y `/edit` en la URL).
2. Crear una pestaña llamada `Configuracion` (o `config`) con las siguientes variables:
   | Variable | Valor de ejemplo |
   | :--- | :--- |
   | `EMAIL_DERIVADOR` | `derivador.legal@pedidosya.com` |
   | `DOMINIOS_PERMITIDOS` | `investigaciones.cl,carabineros.cl,minpublico.cl` |
   | `DRIVE_FOLDER_ID` | `1Fg4a2PzXApzGhlfkTohQQT1cy-GnZ1e...` |
3. Actualizar la variable `SPREADSHEET_ID` / `ID_SHEET` en `codigo.gs`, `code.gs` y `triggers.gs`.

### 3. Configuración de Activadores (Triggers)
En el editor de Apps Script (`Extensiones > Apps Script`):
- Ejecutar la función `crearActivadorFormulario()` desde `triggers.gs` o `codigo.gs` para registrar automáticamente el activador del formulario de recepción.

### 4. Despliegue de la Aplicación Web (Dashboard)
1. En Google Apps Script, hacer clic en **Implementar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. **Ejecutar como:** `Usuario que accede a la aplicación web` (o cuenta de servicio).
4. **Quién tiene acceso:** `Solo usuarios de mi organización`.
5. Copiar la URL generada y compartirla con el equipo legal.

---

## 🔒 Seguridad y Cumplimiento

- **Protección de Datos:** Las respuestas y órdenes judiciales quedan almacenadas exclusivamente en la unidad corporativa de Google Drive designada.
- **Control de Dominios:** `code.gs` valida dominios institucionales autorizados antes de procesar cualquier comunicación judicial.
- **Trazabilidad:** Cada requerimiento genera una línea de tiempo y un registro inmutable en la hoja central de auditoría.

---

## 📄 Licencia

Uso interno y confidencial para **PedidosYa Chile - Legal & Compliance**.
