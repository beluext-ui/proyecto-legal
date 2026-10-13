---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #FFFFFF
color: #0F172A
style: |
  section {
    font-family: 'Inter', sans-serif;
    padding: 40px 60px;
  }
  h1 {
    color: #EA044E;
  }
  h2 {
    color: #0F172A;
    border-bottom: 2px solid #EA044E;
    padding-bottom: 8px;
  }
  footer {
    font-size: 0.65rem;
    color: #94A3B8;
  }
  .highlight {
    background-color: #FFF1F2;
    border-left: 5px solid #EA044E;
    padding: 10px 15px;
    border-radius: 4px;
  }
  .tag {
    background-color: #EA044E;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
---

# ⚖️ Bandeja de Requerimientos Legales
### Manual de Operación para el Analista Legal
**PedidosYa Chile • Legal & Compliance**

*Versión 1.0 (2026) — Automatización e Inteligencia Operativa*

---

## 📌 1. Propósito y Objetivos del Sistema

* **Centralización total:** Recibe y procesa en una sola interfaz todos los requerimientos judiciales de **PDI**, **Carabineros** y **Fiscalías**.
* **Criterio legal fundado:** Evaluación de firmas electrónicas, mandatos judiciales y nexos causales antes de cualquier extracción.
* **Control técnico unificado:** Solicitud de datos al equipo de sistemas mediante multietiquetas (tags).
* **Despacho automatizado:** Emisión de correos oficiales con PDF de respuesta o denegaciones fundadas sin intervención manual en clientes de correo.

---

## ⚙️ 2. Flujo Integral del Requerimiento

```
[ Oficio de Autoridad ] 
          │
          ▼
[ Formulario Oficial / Gmail ]
          │
          ▼
[ Registro en Sheets (REQ-I-001) ]
          │
          ▼
🖥️ [ PANEL WEB LEGAL ]
    ├──> 1. Aceptar Req.  ──> [ Notificación + Extracción Técnica ]
    ├──> 2. Cargar PDF    ──> [ Cierre + Despacho Oficial con PDF ]
    └──> 3. Rechazar Req. ──> [ Notificación Fundada de Rechazo ]
```

---

## 🏷️ 3. Estados Oficiales del Ticket

| Estado | Color | Significado Operativo |
| :--- | :--- | :--- |
| **Nuevo** | 🔵 Azul | Caso recién ingresado. Requiere análisis de admisibilidad jurídica. |
| **En Proceso** | 🟡 Amarillo | Caso aceptado con tags técnicas. La autoridad fue notificada formalmente. |
| **Resuelto** | 🟢 Verde | Informe pericial cargado y correo oficial con PDF despachado. |
| **Rechazado** | 🔴 Rojo | Oficio inválido o inadmisible. Se notificó causal formal a la fiscalía. |

---

## 🖥️ 4. Entorno del Dashboard Web

* **1. Sidebar Lateral:** Aísla requerimientos según sujeto:
  * `Dashboard` (Vista global)
  * `Usuarios` (Cuentas de clientes / fraude)
  * `Riders` (Repartidores asociados)
* **2. Barra de Filtros Unificada:** Búsqueda en vivo por ID, RUT, patente, fechas, entidad y estado.
* **3. Tabla de Requerimientos:** Scroll inteligente (55% de pantalla) para visualización rápida de casos.
* **4. Campanita de Notificaciones:** Historial en vivo de envíos de correo realizados por la plataforma.

---

## 🔍 5. Herramientas de Filtro y Búsqueda

* **Búsqueda por texto libre:** Escriba el ID (`REQ-I-024`), RUT, nombres o patente y la tabla se filtra al instante.
* **Selectores rápidos de Entidad:** Aísle casos de la **PDI**, **Carabineros de Chile** o **Ministerio Público**.
* **Control de Plazos:** Filtro por fecha de ingreso para cumplir plazos legales urgentes.
* **Botón Recargar:** Sincroniza datos directos de Google Sheets con indicador visual de carga.

<div class="highlight">
💡 <b>Tip de Productividad:</b> Los filtros son combinables. Puede ver en 1 segundo todos los requerimientos "Nuevos" de la "PDI".
</div>

---

## 📋 6. Paso 1: Análisis del Oficio Judicial

1. Ubique el requerimiento en estado **Nuevo** y presione **Ver Detalles**.
2. Examine el RUT, nombres del investigado y datos de contacto.
3. Presione el botón **📄 Ver doc. adjunto** para abrir el PDF original de la orden judicial almacenada en Drive.

**Criterios de Admisibilidad Obligatorios:**
* ✅ Firma electrónica avanzada o timbre oficial verificable.
* ✅ Nexo causal directo entre el hecho investigado y la cuenta de PedidosYa.
* ✅ Datos mínimos suficientes para la búsqueda en bases de datos.

---

## 👥 7. Casos Especiales: Rider vs. Usuario

El sistema adapta dinámicamente la información mostrada según la persona sujeta a investigación:

* 🛵 **Si el ticket es de un Rider:**
  * Se exhibe el campo prioritario de **Patente del Vehículo**.
  * Útil para procedimientos por colisiones o delitos flagrantes en ruta.
* 👤 **Si el ticket es de un Usuario:**
  * Se visualiza la sección de **Conexión con la Empresa** (últimos accesos e IPs).
  * Incluye la **Información Adicional Recibida** (órdenes de compra, números de tarjeta).

---

## 🏷️ 8. Paso 2: Aceptar y Derivar Caso

Cuando el requerimiento es admisible jurídicamente:
1. En el modal de detalles, presione **Aceptar Req.**
2. En el menú desplegable, seleccione las variables técnicas a extraer (*RUT, Fotografía de Rostro, IPs, Teléfonos*).
3. Presione **Agregar** para generar las etiquetas (tags) visuales.
4. Ingrese comentarios técnicos si aplica (ej: *"revisar pedidos entre las 20:00 y 23:00 hrs"*).
5. Presione **Derivar Caso**.

<div class="highlight">
🤖 <b>Automatización:</b> El ticket pasa a <b>En Proceso</b> y el backend despacha un correo formal a la fiscalía confirmando el ingreso formal de la orden.
</div>

---

## 📤 9. Paso 3: Carga de Respuesta y Cierre

Una vez completada la extracción pericial por el área de sistemas:
1. Abra el detalle del ticket **En Proceso**.
2. Acceda al módulo verde **Cargar Respuesta del Requerimiento**.
3. Haga clic en **Cargar respuesta (PDF)** y elija el informe consolidado.
4. El sistema valida automáticamente la extensión `.pdf`.
5. Presione **Finalizar y enviar respuesta**.

<div class="highlight">
✅ <b>Cierre Automático:</b> El PDF se archiva de forma segura en Google Drive, el ticket pasa a <b>Resuelto</b> y se envía el correo corporativo formal a la entidad con el PDF adjunto.
</div>

---

## ❌ 10. Paso 4: Rechazo Formal por Inadmisibilidad

Si el oficio judicial no cumple con los requisitos legales de procedencia:
1. En el modal de detalles, presione el botón rojo **Rechazar Req.**
2. Elija la causal correspondiente:
   * *Resolución Judicial Adjunta inválida*
   * *Fundamentación de conexión poco concisa*
   * *Datos insuficientes para la búsqueda*
   * *Otro (especifique)* ➔ Redacte el motivo legal fundado.
3. Presione **Confirmar Rechazo**.
4. El sistema envía una notificación formal a la fiscalía detallando el motivo de rechazo y las vías para subsanar la orden.

---

## 🔔 11. Trazabilidad y Notificaciones en Vivo

* **Campana Superior de Alertas:** Muestra el historial cronológico de todas las acciones operativas ejecutadas en la sesión.
* **Burbuja de Confirmación en Tiempo Real:** Al despachar correos institucionales, se muestra una ventana con:
  * 📧 Correo de destino de la autoridad.
  * 📝 Asunto oficial generado.
  * 📄 Vista previa del cuerpo HTML despachado.

---

## 🔒 12. Seguridad y Cumplimiento Normativo

1. **Secreto Procesal (Art. 182 CPP):** Las carpetas investigativas de la fiscalía son estrictamente reservadas. Prohibida la descarga a equipos personales.
2. **Protección de Datos Personales:** Entrega limitada estrictamente a los antecedentes solicitados bajo mandato judicial válido.
3. **Acceso Restringido:** Uso exclusivo para personal autorizado de PedidosYa mediante cuenta corporativa.
4. **Integridad de Base de Datos:** No modificar manualmente columnas en la hoja `dashboard-status`.

---

## ✅ 13. Checklist Diario del Analista Legal

### ☀️ Inicio de Jornada
* [ ] Presionar **Recargar** para sincronizar requerimientos de la noche.
* [ ] Revisar requerimientos en estado **Nuevo** de Carabineros/PDI (prioridad flagrancia).
* [ ] Validar admisibilidad y derivar a sistemas con tags correspondientes.

### 🌙 Cierre de Jornada
* [ ] Revisar tickets **En Proceso** con extracciones terminadas.
* [ ] Cargar PDFs de respuesta y despachar resoluciones formales.
* [ ] Verificar en la campana de notificaciones el éxito de los envíos.
* [ ] Asegurar que ningún oficio con plazo judicial perentorio quede sin atender.

---

## 📞 Soporte y Mesa de Ayuda Legal

* **Área:** Legal & Compliance — PedidosYa Chile
* **Contacto Técnico:** legal.chile@pedidosya.com
* **Ubicación de Archivos:** Google Drive Oficial / Carpeta de Requerimientos Legales

*© 2026 PedidosYa. Documento de uso interno y confidencial.*
