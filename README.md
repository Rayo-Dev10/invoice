# Invoice

Aplicación web estática para crear invoices y estimates listos para imprimir o guardar como PDF. Está pensada para uso rápido, sin dependencias y sin backend.

## Qué hace

- Alterna entre modo invoice y estimate sin perder los datos cargados.
- Alterna entre perfil empresa y perfil personal.
- Permite editar el porcentaje de anticipo o depósito directamente.
- Calcula totales automáticamente en USD.
- Permite agregar, editar y eliminar ítems del documento.
- Oculta controles de edición al imprimir.
- Funciona abriendo el archivo HTML directamente en el navegador.

## Estado actual

El proyecto refleja este comportamiento real:

- Perfil por defecto: empresa.
- Perfil alternativo: personal, reemplazando A.S.A.P. Home Maintenance por Enrique Arias en las zonas visibles del encabezado.
- El campo Advance % se vacía al enfocarlo para facilitar la edición y se normaliza entre 0 y 100 al salir del campo.
- En estimate, el documento muestra total estimado y, si aplica, required deposit.
- En invoice, el documento usa el porcentaje indicado para calcular el advance y el balance mostrado.

## Uso rápido

1. Abre [index.html](index.html) en tu navegador.
2. Completa la sección Bill To con los datos del cliente.
3. Usa Agregar ítem para cargar concepto, detalles, cantidad y valor unitario.
4. Ajusta el porcentaje en Advance % según el anticipo o depósito deseado.
5. Alterna entre invoice y estimate según el tipo de documento.
6. Alterna entre empresa y personal según quién emite el documento.
7. Usa Imprimir / Guardar PDF para exportarlo.

## Lógica del documento

### Invoice

- Título: INVOICE.
- Campos de cabecera: Invoice Number, Invoice Date y Payment Due.
- Muestra Advance y Balance Due según el porcentaje indicado.
- Si el porcentaje es 0 o 100, la fila intermedia del anticipo se oculta.

### Estimate

- Título: ESTIMATE.
- Campos de cabecera: Estimate Number, Estimate Date y Valid Until.
- Si el porcentaje es menor que 100, muestra Required Deposit.
- El total inferior siempre muestra el Estimate Total.

## Estructura del proyecto

- [index.html](index.html): estructura del documento y controles.
- [styles.css](styles.css): diseño visual, estados de botones y reglas de impresión.
- [app.js](app.js): estado, cálculos, alternancias y CRUD de ítems.

## Tecnologías

- HTML5
- CSS3
- JavaScript vanilla

## Desarrollo local

No requiere instalación.

```bash
git clone https://github.com/Rayo-Dev10/invoice.git
cd invoice
start index.html
```

También puedes abrir [index.html](index.html) manualmente con cualquier navegador moderno.

## Ventajas del enfoque actual

- Sin dependencias externas.
- Carga instantánea.
- Fácil de modificar.
- Adecuado para uso en escritorio o móvil.
- Ideal para generar PDFs rápidos sin backend.

## Mejoras posibles

- Guardado local con localStorage.
- Plantillas de datos del emisor.
- Autonumeración de documentos.
- Duplicado de ítems frecuentes.
- Campos de dirección y contacto configurables por perfil.

## Autor

Desarrollado por Rayo Palatianos.
