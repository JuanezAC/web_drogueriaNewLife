# Droguería New Life · Sitio web informativo

Sitio web informativo y responsive para una droguería local. Es una landing page de una sola
página, construida únicamente con **HTML5, CSS3 y JavaScript (vanilla)**. No incluye backend,
base de datos, carrito de compras ni pasarela de pago.

## Estructura

```
drogueria-web/
│
├── index.html          # Estructura completa de una página (todas las secciones)
│
├── css/
│   └── styles.css      # Sistema de diseño, layout y responsive (variables CSS en :root)
│
├── js/
│   └── script.js       # Configuración del negocio y funcionalidades puntuales
│
├── assets/
│   ├── images/         # Reservado para futuras imágenes (logos, fotos del local)
│   └── icons/          # Reservado para futuros iconos · los actuales son SVG inline
│
└── README.md
```

## Cómo visualizar el sitio

Abre `index.html` directamente en cualquier navegador moderno. No requiere servidor ni
herramienta de construcción.

## Dónde reemplazar la información del negocio

Toda la información comercial está centralizada y es fácil de sustituir:

1. **Datos de contacto y WhatsApp** → constante `CONFIG` en `js/script.js`
   (`whatsappNumber` y `whatsappMessage`). El número va en formato internacional, solo dígitos.
2. **Nombre, dirección, horarios y metadatos** → sección correspondiente de `index.html`
   (encabezado, sección de ubicación, pie de página) y etiquetas `<meta>`.
3. **Datos estructurados (Schema.org)** → bloque `application/ld+json` en `index.html`,
   tipo `Pharmacy`.

El número de WhatsApp, la dirección y los horarios actuales son valores de ejemplo y deben
reemplazarse por los reales antes de publicar.

## Cómo personalizar el diseño

Los colores, tipografías, radios, sombras y transiciones se definen una sola vez como
variables CSS en `:root` al inicio de `css/styles.css`. Cambia esas variables para ajustar
toda la identidad visual sin tocar el resto del código.

## Cómo agregar una categoría o servicio

Duplica una tarjeta existente dentro de su retícula en `index.html` y actualiza el texto y
el `id`/`aria-controls` si se trata de una categoría con acordeón.

## Notas de accesibilidad

- Navegación por teclado y estados de foco visibles.
- `prefers-reduced-motion` respetado en animaciones.
- Enlaces de WhatsApp se construyen con JavaScript a partir de `CONFIG`.