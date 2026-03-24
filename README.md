🛠️ A.S.A.P. Billing & Estimation System
Una herramienta web ligera, profesional y eficiente diseñada para la gestión de cobros y presupuestos de A.S.A.P. Home Maintenance. Este sistema permite alternar dinámicamente entre formatos de Factura (Invoice) y Estimación (Estimate), optimizando el flujo de trabajo administrativo.

🚀 Características Principales
Modo Dual Dinámico: Cambia entre Factura y Estimación con un solo clic sin perder los datos ingresados.

Lógica Contable Automatizada: * Invoice: Calcula automáticamente un anticipo del 50% (Advance) y muestra el saldo pendiente (Balance Due).

Estimate: Muestra el total proyectado al 100% para aprobación del cliente.

Optimización de Impresión (WYSIWYG): * Configuración CSS avanzada para forzar la impresión de gráficos y colores de fondo.

Eliminación automática de la segunda hoja en blanco.

Ocultamiento inteligente de controles web (botones, editores) al generar el PDF.

Persistencia de Datos: Los datos del cliente y los ítems se mantienen intactos al alternar modos.

Valores por Defecto Inteligentes: Pre-configurado para operaciones en New York, USA, con moneda forzada en USD.

Gestión de Ítems (CRUD): Interfaz fluida para agregar, editar y eliminar tareas o servicios con descripciones detalladas.

💻 Tecnologías Utilizadas
Este proyecto fue construido bajo la filosofía de Zero Dependencies, garantizando velocidad de carga y facilidad de mantenimiento:

HTML5: Estructura semántica para documentos contables.

CSS3: Diseño responsivo con uso de Variables CSS (:root) y directivas @media print personalizadas.

Vanilla JavaScript (ES6+): Lógica de estado, manipulación del DOM y cálculos financieros precisos.

📖 Cómo Utilizar el Sistema
Datos del Cliente: Completa la sección "Bill To". Por defecto, el sistema sugiere New York, pero los campos son editables.

Gestión de Servicios:

Haz clic en "Agregar ítem".

Ingresa el título y la descripción.

Define la cantidad y el precio unitario mediante los diálogos emergentes.

Selección de Modo:

Usa el botón superior para decidir si entregarás una Estimación (válida por tiempo limitado) o una Factura de cobro.

Generación de Documento:

Haz clic en "Imprimir / Guardar PDF".

En la configuración de impresión del navegador, asegúrate de que el destino sea "Guardar como PDF".

⚖️ Lógica de Negocio Aplicada
Nota Contable: Este sistema implementa una política de recaudo de 50/50. En el modo Factura, el sistema asume que se requiere un abono inicial del 50% para iniciar o finalizar el servicio, facilitando la gestión de flujo de caja para el prestador del servicio.

🛠️ Instalación y Despliegue
Al ser un proyecto estático, no requiere servidor de backend ni bases de datos complejas:

Clona el repositorio:

Bash
git clone https://github.com/Rayo-Dev10/invoice.git
Abre el archivo index.html en cualquier navegador moderno.

(Opcional) Despliega en GitHub Pages para acceso remoto rápido.

📝 Roadmap / Futuras Mejoras
[ ] Implementar localStorage para guardar facturas localmente en el navegador.

[ ] Agregar selector de porcentaje de anticipo (30%, 50%, 100%).

[ ] Generación automática de códigos QR para métodos de pago.

Desarrollado por Rayo Palatianos Combinando tecnología y procesos contables.
