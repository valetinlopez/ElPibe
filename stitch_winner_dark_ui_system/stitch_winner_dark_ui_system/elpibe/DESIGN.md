---
name: ElPibe
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#8c909f'
  outline-variant: '#424753'
  surface-tint: '#afc6ff'
  primary: '#afc6ff'
  on-primary: '#002d6d'
  primary-container: '#2d6fe0'
  on-primary-container: '#fcfaff'
  inverse-primary: '#0059c8'
  secondary: '#97ccfe'
  on-secondary: '#003353'
  secondary-container: '#034d79'
  on-secondary-container: '#88bdef'
  tertiary: '#eac349'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#afc6ff'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#004299'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#97ccfe'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004a75'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
  bg-surface: '#12161F'
  bg-surface-raised: '#1A1F2B'
  bg-surface-overlay: '#20262F'
  border-subtle: '#272E3A'
  border-default: '#343C4A'
  accent-blue-bright: '#4C8DFF'
  accent-blue-metal: '#3A5A8C'
  accent-blue-dim: '#1C3A66'
  text-primary: '#F4F5F7'
  text-secondary: '#A8AFBD'
  text-tertiary: '#6B7280'
  accent-red-card: '#E5484D'
  accent-yellow-card: '#F2C94C'
  accent-green-success: '#3FB873'
typography:
  display-xl:
    fontFamily: anybody
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: 0.5px
  display-lg:
    fontFamily: anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.5px
  display-md:
    fontFamily: anybody
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.5px
  heading-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  heading-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  button-text:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  dorsal-id:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-5: 20px
  space-6: 24px
  space-8: 32px
  space-10: 40px
  space-12: 48px
---

# DESIGN.md — ElPibe

> Sistema de diseño completo para la app móvil **ElPibe**. Este documento está pensado para alimentar herramientas de generación de UI como **Google Stitch** o **v0**, y también como referencia de diseño para cualquier desarrollador o IA que trabaje en el frontend (React Native + Expo).

---

## 0. Concepto y Dirección de Arte

**ElPibe** es una identidad deportiva digital para futbolistas amateurs. La dirección visual combina dos mundos:

1. **Porteño / de la pa­ternal**: barrio, asfalto, potrero, paredones, la estética cruda y directa del fútbol de barrio de Buenos Aires.
2. **Maradoneano**: la épica, el 10, la camiseta albiceleste, el ídolo popular. No es nostalgia ni un homenaje literal — es la sensación de que cualquier pibe de potrero puede ser el próximo crack.

La paleta es **dark mode** por defecto (no hay versión light en esta fase). El dark no es "tech corporativo": es noche de cancha de barrio con reflector, asfalto, y un golpe de **azul metalizado** que actúa como acento — nunca como color dominante. El azul es el "10" en la espalda: aparece puntual, brilla, y se retira.

**Mood references**: pintura urbana de Caminito desaturada hacia tonos oscuros, murales de Maradona, luz de reflector de cancha de potrero a la noche, texturas de asfalto y pared descascarada, tipografía de camiseta de fútbol (números/nombres en la espalda).

---

## 1. Paleta de Colores

### 1.1 Colores Base (Dark Surface System)

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#0B0E14` | Fondo principal de la app (casi negro, con tinte azulado frío) |
| `--bg-surface` | `#12161F` | Fondo de cards, contenedores principales |
| `--bg-surface-raised` | `#1A1F2B` | Cards elevadas, modales, bottom sheets |
| `--bg-surface-overlay` | `#20262F` | Inputs, chips, elementos interactivos en reposo |
| `--border-subtle` | `#272E3A` | Bordes sutiles entre secciones |
| `--border-default` | `#343C4A` | Bordes de inputs, divisores visibles |

### 1.2 Acento — Azul Metálico (uso puntual, NO dominante)

| Token | Hex | Uso |
|---|---|---|
| `--accent-blue` | `#2D6FE0` | Color primario de acción: CTAs principales, links activos, ícono de tab activo |
| `--accent-blue-bright` | `#4C8DFF` | Hover/press state, glow sutil, highlights de stats destacadas |
| `--accent-blue-metal` | `#3A5A8C` | Variante "metalizada" más apagada — usar en bordes activos, badges secundarios, sombras de glow |
| `--accent-blue-dim` | `#1C3A66` | Fondo de chips/badges con texto azul claro encima |

**Regla de uso del azul**: el azul metálico aparece en máximo 1-2 elementos por pantalla. Botón primario, ícono activo de tab bar, borde de avatar destacado, o número de camiseta. Si una pantalla tiene más de dos elementos azules compitiendo, está mal usado.

### 1.3 Acentos Secundarios — Identidad Albiceleste / Maradoneana

| Token | Hex | Uso |
|---|---|---|
| `--accent-sky` | `#75AADB` | Celeste albiceleste — uso muy puntual: insignia, detalle de splash/onboarding, separador de sección "stats" |
| `--accent-gold` | `#D4AF37` | Dorado apagado — usado SOLO para logros, medallas, número "10", estados de "destacado" |
| `--accent-red-card` | `#E5484D` | Tarjeta roja, errores, eliminar contenido |
| `--accent-yellow-card` | `#F2C94C` | Tarjeta amarilla, warnings |
| `--accent-green-success` | `#3FB873` | Confirmaciones, estado "completado", goles/asistencias positivas |

### 1.4 Texto

| Token | Hex | Uso |
|---|---|---|
| `--text-primary` | `#F4F5F7` | Títulos, texto principal |
| `--text-secondary` | `#A8AFBD` | Subtítulos, descripciones, labels |
| `--text-tertiary` | `#6B7280` | Placeholders, texto deshabilitado, timestamps |
| `--text-on-accent` | `#FFFFFF` | Texto sobre fondo azul/acento |
| `--text-link` | `#4C8DFF` | Enlaces de texto |

### 1.5 Gradientes (uso muy controlado)

- **`--gradient-hero`**: `linear-gradient(135deg, #0B0E14 0%, #14202E 60%, #1C3A66 100%)` — usar solo en header de perfil o splash, simula "luz de reflector nocturna" tocando con azul metálico en una esquina.
- **`--gradient-card-glow`**: `linear-gradient(180deg, rgba(45,111,224,0.12) 0%, rgba(45,111,224,0) 100%)` — glow sutil arriba de cards destacadas (ej. card de stats principales).

---

## 2. Tipografía

### 2.1 Familias

- **Display / Headings**: `"Winner Condensed Medium"` (fallback: `system-ui, sans-serif` bold) — tipografía de número de camiseta, condensada, con carácter. Usar SOLO en: título de pantalla, nombre del jugador en el header de perfil, números grandes de stats (ej. "23" goles).
- **Body / UI**: `"Inter"` (fallback: `system-ui, -apple-system, sans-serif`) — toda la tipografía funcional: labels, inputs, botones, texto de bio, navegación.
- **Mono (opcional, decorativo)**: `"JetBrains Mono"` — usar solo para el "dorsal" o el ID del jugador si se decide mostrarlo (ej. `#10`), nunca para contenido funcional.

### 2.2 Escala Tipográfica (mobile)

| Token | Tamaño | Line-height | Peso | Familia | Uso |
|---|---|---|---|---|---|
| `display-xl` | 40px | 44px | 700 | Winner Condensed Medium | Splash, número hero de stat principal |
| `display-lg` | 32px | 36px | 700 | Winner Condensed Medium | Nombre del jugador en header de perfil |
| `display-md` | 24px | 28px | 700 | Winner Condensed Medium | Títulos de pantalla (ej. "MI PERFIL") |
| `heading-lg` | 20px | 26px | 600 | Inter | Títulos de sección dentro de pantalla |
| `heading-md` | 17px | 22px | 600 | Inter | Sub-secciones, nombres de card |
| `body-lg` | 16px | 22px | 400 | Inter | Texto de bio, contenido principal |
| `body-md` | 14px | 20px | 400 | Inter | Texto estándar de UI, descripciones |
| `body-sm` | 13px | 18px | 400 | Inter | Labels de input, captions |
| `caption` | 11px | 14px | 500 | Inter | Timestamps, metadatos, badges |
| `button-text` | 15px | 20px | 600 | Inter | Texto de botones (siempre uppercase en CTAs primarios) |

**Regla**: los títulos de pantalla y nombres de jugador usan mayúsculas + tracking levemente expandido (`letter-spacing: 0.5px`) para evocar el dorsal de camiseta. El resto del texto va en sentence case normal.

---

## 3. Espaciado y Grid (Mobile-First)

### 3.1 Sistema de espaciado (base 4px)

| Token | Valor |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |

### 3.2 Reglas de Layout

- **Margen horizontal de pantalla**: `16px` (`space-4`) en todas las pantallas. En pantallas con mucho contenido visual (ej. biblioteca multimedia) se puede reducir a `12px`.
- **Espaciado entre secciones verticales**: `24px` (`space-6`) mínimo.
- **Espaciado entre elementos dentro de una card**: `12px` (`space-3`).
- **Safe areas**: respetar `SafeAreaView` de Expo en todas las pantallas. Top safe area + `8px` extra antes del primer elemento. Bottom safe area + tab bar height.
- **Grid de biblioteca multimedia**: grilla de 2 columnas en mobile, gap de `8px`, aspect ratio 1:1 para fotos y 9:16 para thumbnails de video (formato vertical, como reels).

---

## 4. Bordes, Radios y Elevación

### 4.1 Border Radius

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 8px | Chips, badges, inputs pequeños |
| `radius-md` | 12px | Inputs estándar, botones secundarios |
| `radius-lg` | 16px | Cards estándar |
| `radius-xl` | 20px | Cards destacadas, bottom sheets (solo esquinas superiores) |
| `radius-full` | 999px | Botones primarios (pill shape), avatares, badges circulares |

**Nota de identidad**: los botones primarios (CTA) usan `radius-full` (forma de pastilla) para evocar el botín/pelota — un detalle sutil de personalidad sin caer en literal.

### 4.2 Elevación / Sombras (dark mode — usar glow, no sombra negra)

En dark mode las sombras negras no se ven. En su lugar, usar **glow de borde** con el azul metálico o un sutil brillo blanco:

| Token | Definición | Uso |
|---|---|---|
| `elevation-card` | `0px 2px 8px rgba(0,0,0,0.4)` + borde `1px solid --border-subtle` | Cards en reposo |
| `elevation-raised` | `0px 4px 16px rgba(0,0,0,0.5)` + borde `1px solid --border-default` | Cards elevadas, modales |
| `elevation-glow-blue` | `0px 0px 16px rgba(45,111,224,0.25)` | Elemento destacado/activo (ej. card de stat principal, avatar con borde activo) |
| `elevation-glow-gold` | `0px 0px 12px rgba(212,175,55,0.2)` | Logros, badges dorados |

---

## 5. Componentes

### 5.1 Botones

**Primario (CTA principal)**
- Fondo: `--accent-blue`, fondo en estado press: `--accent-blue-bright`
- Forma: `radius-full`, alto `52px`, padding horizontal `24px`
- Texto: `button-text`, `--text-on-accent`, uppercase
- Estado disabled: fondo `--bg-surface-overlay`, texto `--text-tertiary`
- Solo UN botón primario visible por pantalla como máximo.

**Secundario (outline)**
- Fondo: transparente, borde `1.5px solid --border-default`
- Texto: `--text-primary`
- Forma: `radius-full`, mismo alto que primario
- Estado press: borde cambia a `--accent-blue-metal`

**Texto / Ghost**
- Sin fondo ni borde, solo texto `--text-link` o `--text-secondary`
- Uso: "Olvidé mi contraseña", "Cancelar", acciones secundarias dentro de modales

**Botón de ícono (FAB / acciones flotantes)**
- Circular, `radius-full`, tamaño `56px`, fondo `--accent-blue`
- Usado para "Subir multimedia" como FAB flotante sobre la biblioteca

### 5.2 Inputs

- Fondo: `--bg-surface-overlay`
- Borde: `1px solid --border-default`, en focus: `1.5px solid --accent-blue`
- Radio: `radius-md`
- Alto: `52px`
- Padding horizontal: `16px`
- Label flotante arriba del input en `body-sm`, `--text-secondary`
- Placeholder: `--text-tertiary`
- Estado error: borde `--accent-red-card` + texto de error debajo en `caption` rojo
- Iconos dentro del input (ej. ojo para mostrar contraseña): `--text-secondary`, tap target mínimo `44x44px`

### 5.3 Cards

**Card de Perfil (header)**
- Fondo: `--gradient-hero`
- Avatar circular `96px`, borde `2px solid --accent-blue-metal`
- Nombre en `display-lg`, uppercase
- Posición + club en `body-md`, `--text-secondary`, debajo del nombre
- Badge de categoría (ej. "Primera B") en chip con fondo `--accent-blue-dim` y texto `--accent-blue-bright`

**Card de Estadística (KPI individual)**
- Fondo: `--bg-surface`, `radius-lg`, `elevation-card`
- Número grande en `display-md` o `display-xl` según contexto, color `--text-primary` (o `--accent-gold` si es un récord/logro)
- Label debajo en `body-sm`, `--text-secondary`, uppercase, letter-spacing leve
- Grid de 2x2 o 3 en fila para mostrar partidos/goles/asistencias/tarjetas

**Card de Media (thumbnail biblioteca)**
- Aspect ratio 9:16 (formato vertical tipo reel) para video, 1:1 para foto
- `radius-md`, overflow hidden
- Overlay inferior con gradiente negro a transparente + ícono de play (si es video) + categoría en `caption`
- Badge de categoría arriba a la izquierda, fondo semi-transparente `rgba(11,14,20,0.7)`, texto blanco

**Card de Atributo (dentro de sección Atributos)**
- Fila horizontal: nombre del atributo (`body-md`) a la izquierda, slider o stepper a la derecha
- Valor numérico en `heading-md`, color `--accent-blue-bright` cuando el valor es ≥8

### 5.4 Radar Chart (Atributos)

- Fondo del gráfico: `--bg-surface`, sin grid lines marcadas (líneas muy sutiles `--border-subtle` al 30% opacidad)
- Polígono de datos: relleno `rgba(45,111,224,0.18)`, borde `2px solid --accent-blue-bright`
- Puntos de vértice: círculos pequeños `--accent-blue-bright` con glow sutil
- Labels de las 4 dimensiones (Técnica, Física, Táctica, Mental) en `body-sm`, `--text-secondary`, posicionados en las puntas
- Tamaño mínimo recomendado en mobile: `280x280px` centrado

### 5.5 Tab Bar (navegación inferior)

- Fondo: `--bg-surface-raised`, borde superior `1px solid --border-subtle`
- Altura: `64px` + safe area inferior
- Ícono inactivo: `--text-tertiary`, tamaño `24px`
- Ícono activo: `--accent-blue-bright`, con punto/línea indicadora de `3px` debajo en `--accent-blue`
- Label debajo del ícono en `caption`, solo visible en tab activo (o siempre, según decisión final — recomendado: siempre visible para claridad)
- 4 tabs: **Perfil** (ícono persona), **Estadísticas** (ícono gráfico/trofeo), **Multimedia** (ícono cámara/play), **Ajustes** (ícono engranaje)

### 5.6 Header de Pantalla

- Altura: `56px` + safe area superior
- Fondo: `--bg-base` (transparente respecto al contenido, sin elevación salvo scroll)
- Título centrado o alineado a la izquierda en `display-md`, uppercase
- Botón de back (si aplica): ícono flecha, `--text-primary`, tap target `44x44px`
- Acción derecha (ej. "Editar"): texto `--text-link` o ícono `--accent-blue-bright`

### 5.7 Badges / Chips

- Forma: `radius-sm` para chips rectangulares, `radius-full` para badges tipo "pill"
- Fondo por defecto: `--bg-surface-overlay`
- Variante destacada (categoría, club): fondo `--accent-blue-dim`, texto `--accent-blue-bright`
- Variante logro/medalla: fondo `rgba(212,175,55,0.15)`, texto `--accent-gold`, ícono de medalla
- Tarjetas amarilla/roja: chip pequeño cuadrado redondeado (`radius-sm`), proporción 3:4 imitando tarjeta real, color sólido correspondiente

### 5.8 Bottom Sheets / Modales

- Fondo: `--bg-surface-raised`
- Radio: `radius-xl` solo en esquinas superiores
- Handle bar arriba centrado: `40x4px`, `--border-default`, `radius-full`
- Padding interno: `20px` horizontal, `24px` superior
- Overlay de fondo: `rgba(11,14,20,0.75)`

### 5.9 Formularios de Onboarding (Wizard)

- Indicador de progreso arriba: barra de pasos segmentada, segmento activo en `--accent-blue`, segmentos pendientes en `--border-subtle`
- Un solo grupo de campos visible por paso (no abrumar)
- Botón primario "Siguiente" fijo abajo (sticky), botón ghost "Atrás" a la izquierda del mismo
- Transición entre pasos: slide horizontal sutil

---

## 6. Iconografía

- Set de íconos: **Lucide** (`lucide-react-native` o equivalente), trazo de `2px`, estilo outline (no filled, salvo estado activo donde puede pasar a filled sutil)
- Tamaño estándar: `24px` en navegación, `20px` en inline con texto, `32px` en estados destacados (ej. ícono de categoría grande)
- Color por defecto: `--text-secondary`; en estado activo/seleccionado: `--accent-blue-bright`
- Íconos deportivos específicos a usar: balón (perfil/inicio), trofeo o gráfico de barras (estadísticas), cámara/play (multimedia), target/radar (atributos), medalla (logros)

---

## 7. Imágenes y Media

- **Fotos de perfil**: siempre circulares, con borde de `2px` en `--accent-blue-metal` cuando el perfil está completo al 100%, borde gris `--border-default` si está incompleto (esto da feedback visual de completitud sin texto).
- **Thumbnails de video**: siempre con overlay de play centrado, ícono `48px` blanco semi-transparente sobre fondo circular `rgba(0,0,0,0.4)`.
- **Estados vacíos (empty states)**: ilustración simple en línea (outline, monocromática en `--text-tertiary` con un detalle en `--accent-blue-metal`), nunca fotos stock. Texto de apoyo en `body-md`, `--text-secondary`, con CTA debajo si aplica (ej. "Subí tu primer video").
- **Placeholder de carga de imagen**: skeleton shimmer en tonos `--bg-surface` → `--bg-surface-overlay`, nunca gris genérico claro.

---

## 8. Tono de Microcopy (texto de la UI)

El texto de la interfaz debe sonar como un pibe de barrio hablando con otro jugador, no como una corporación. Reglas:

- Usar **voseo argentino** en toda la UI: "Subí tu video", "Completá tu perfil", "Editá tus datos" (nunca "Sube tu video" o "Completa tu perfil" en español neutro).
- CTAs cortos y directos: "DALE QUE VA", "SUBIR JUGADA", "GUARDAR PERFIL" — más cancha que oficina.
- Mensajes de error con calidez, no frialdad técnica: en vez de "Error 400: Bad Request", usar "Algo salió mal, probá de nuevo".
- Empty states con personalidad: "Todavía no subiste ninguna jugada. ¡Mostrá lo que tenés!" en vez de "No hay contenido disponible".

---

## 9. Estados y Feedback

| Estado | Tratamiento visual |
|---|---|
| Loading | Spinner circular en `--accent-blue-bright`, o skeleton shimmer para listas/cards |
| Success (ej. guardado) | Toast/snackbar inferior, fondo `--bg-surface-raised`, ícono check en `--accent-green-success`, auto-dismiss 2.5s |
| Error | Toast inferior, fondo `--bg-surface-raised`, ícono alerta en `--accent-red-card`, borde izquierdo `3px` rojo |
| Empty state | Ilustración outline + texto + CTA, centrado verticalmente en el espacio disponible |
| Disabled | Opacidad `0.4` sobre el elemento, sin cambiar color base |

---

## 10. Responsividad Mobile (breakpoints internos)

Aunque es una app nativa (no web responsive en el sentido tradicional), se debe garantizar buen comportamiento en distintos tamaños de pantalla físicos:

| Categoría | Ancho aproximado | Consideración |
|---|---|---|
| Compacto | 360–390px (ej. gama media Android) | Reducir margen horizontal a `12px`, grid de multimedia sigue en 2 columnas pero con gap `6px` |
| Estándar | 390–428px (ej. iPhone 14/15, gama alta Android) | Layout base de este documento |
| Grande | 428px+ (ej. iPhone Pro Max) | Aumentar levemente el padding interno de cards (`+4px`), sin cambiar la grilla |

---

## 11. Accesibilidad

- Contraste mínimo texto/fondo: `4.5:1` para texto body, `3:1` para texto display grande — verificado contra `--bg-base` y `--bg-surface`.
- Todos los botones e inputs deben tener `accessibilityLabel` descriptivo.
- El azul de acento (`--accent-blue-bright`) sobre `--bg-base` cumple AA para texto de tamaño body; evitar usarlo en texto menor a `14px`.
- Nunca comunicar un estado (error/éxito/tarjeta amarilla-roja) solo por color: siempre acompañar con ícono o texto.
