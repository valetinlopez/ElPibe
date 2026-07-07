# AGENTS.md — ElPibe

> Guía para que cualquier IA trabaje correctamente sobre el proyecto ElPibe.
> LEER ANTES DE ESCRIBIR CÓDIGO. Actualizado: 6 julio 2026.

---

## 0. Qué es ElPibe

App móvil para futbolistas amateurs. Los jugadores se registran, crean un perfil deportivo, suben contenido multimedia (videos/fotos), y registran estadísticas y atributos básicos.

**100% Local — Sin backend**: toda la persistencia es local usando `expo-sqlite` (iOS/Android) y `localStorage` (web). No hay Supabase, no hay servidor propio.

---

## 1. Stack Tecnologico

| Capa | Tecnologia | Version |
|------|------------|---------|
| Frontend | React Native + Expo | SDK **54** |
| Lenguaje | **JavaScript** (NO TypeScript) | — |
| Estilos | StyleSheet con design system propio | — |
| Navegacion | React Navigation (Stack + Bottom Tabs) | v7 |
| Base de datos | expo-sqlite (native) / WebDB (web) | — |
| Cliente de datos | NO usa Supabase | — |
| Auth | Custom local (SHA-256 via expo-crypto) | — |
| Iconografia | lucide-react-native | v1.20 |
| SVG / Charts | react-native-svg | v15 |
| Storage local | @react-native-async-storage/async-storage | — |
| Tokens seguros | expo-secure-store | v15 |
| Video | expo-video | v3 |
| UUIDs | expo-crypto | v15 |

---

## 2. Reglas Inquebrantables

### 2.1 Lenguaje
- **JavaScript puro**. NUNCA usar TypeScript.
- Archivos `.js` o `.jsx`. NUNCA `.ts` o `.tsx`.
- Comentarios en **español** cuando sea relevante.

### 2.2 Backend
- **NUNCA** crear Express, FastAPI, o cualquier servidor propio.
- **NO HAY SUPABASE** en este proyecto. No instalar `@supabase/supabase-js`.
- Toda persistencia es local: `expo-sqlite` (iOS/Android) o `localStorage` (web).
- Todas las llamadas a DB van en la capa `/src/services/`, **NUNCA** inline en componentes de pantalla.

### 2.3 Estilos
- Usar **StyleSheet** (no NativeWind/Tailwind — no están instalados).
- Colores SIEMPRE desde `src/constants/colors.js`.
- NUNCA hardcodear colores hex en componentes.
- Seguir el `DESIGN.md` al pie de la letra.

### 2.4 Seguridad (local)
- Los datos son locales al dispositivo. No hay RLS porque no hay backend compartido.
- Storage buckets son locales al dispositivo. En web se usa `localStorage`.
- La auth es SHA-256 con `expo-crypto`, no es autentificación real — es solo verificación local de contraseña.

### 2.5 Navegacion
- Usar React Navigation con estructura: Root → AuthStack | MainTabs.
- MainTabs tiene 4 tabs: Perfil, Estadísticas, Multimedia, Ajustes.
- Cada tab puede tener su propio Stack anidado.

---

## 3. Estructura de Carpetas

```
/src
  /screens           -> Pantallas de la app
    /auth            -> Login, Register, ForgotPassword
    /onboarding      -> Wizard de 3 pasos
    /profile         -> MiPerfil, EditarPerfil
    /media           -> BibliotecaMultimedia, SubirMultimedia, VideoPlayer
    /stats           -> Estadisticas
    /attributes      -> Atributos
    /settings        -> Ajustes
  /components        -> Componentes reutilizables (Button, Input, Card, etc.)
  /navigation        -> RootNavigator, AuthStack, MainTabs, 4 stacks anidados
  /services          -> Capa de persistencia (database, profile, stats, attributes, media)
  /context           -> AuthContext (sesion global)
  /constants         -> colors.js, typography.js, spacing.js, radii.js, positions.js, dimensions.js, categories.js
  /utils             -> validations.js, formatters.js, storage.js
App.js               -> Entry point
index.js             -> registerRootComponent
```

---

## 4. Modelo de Datos (SQLite local)

### profiles
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | TEXT | PK (uuid del auth local) |
| full_name | TEXT | |
| age | INTEGER | |
| city | TEXT | |
| nationality | TEXT | |
| height_cm | INTEGER | |
| weight_kg | INTEGER | |
| foot | TEXT | 'izquierda' / 'derecha' / 'ambidiestro' |
| position_main | TEXT | |
| position_secondary | TEXT | |
| club | TEXT | |
| category | TEXT | |
| bio | TEXT | max 500 chars |
| photo_url | TEXT | path local en FileSystem |
| created_at | TEXT | ISO timestamp |

### player_stats
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | TEXT | PK (uuid) |
| profile_id | TEXT | FK a profiles(id) |
| season | TEXT | ej. '2026' |
| matches | INTEGER | default 0 |
| minutes | INTEGER | default 0 |
| goals | INTEGER | default 0 |
| assists | INTEGER | default 0 |
| yellow_cards | INTEGER | default 0 |
| red_cards | INTEGER | default 0 |

### player_attributes
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | TEXT | PK (uuid) |
| profile_id | TEXT | FK a profiles(id) |
| dimension | TEXT | 'technical' / 'physical' / 'tactical' / 'mental' |
| attribute_name | TEXT | |
| score | INTEGER | rango 1 a 10 |

### media_items
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | TEXT | PK (uuid) |
| profile_id | TEXT | FK a profiles(id) |
| type | TEXT | 'video' / 'photo' |
| category | TEXT | |
| subcategory | TEXT | |
| description | TEXT | |
| storage_path | TEXT | path local o data URI (web) |
| created_at | TEXT | ISO timestamp |

---

## 5. Estrategia de Persistencia Dual

```
Screens → Services → Database (expo-sqlite / WebDB)
                        ↓
           ┌─ expo-sqlite openDatabaseSync (iOS/Android)
           └─ WebDB → localStorage (web)
```

### database.js
- `initDatabase()` crea las 4 tablas si no existen
- En iOS/Android usa `expo-sqlite` (`openDatabaseSync`)
- En web usa la clase `WebDB` que emula SQL sobre arrays en memoria + `localStorage`
- Los archivos multimedia se guardan en `FileSystem.documentDirectory` (`avatars/`, `media/`)

### AuthContext.js
- Auth local con SHA-256 via `expo-crypto`
- Credenciales guardadas en `expo-secure-store` (native) o `localStorage` (web)
- Sesión: `auth_user` y `auth_session` en SecureStore/localStorage

---

## 6. Design System (resumen rapido)

### Colores base
| Token | Hex | Uso |
|-------|-----|-----|
| bg-base | #0B0E14 | Fondo principal app |
| bg-surface | #12161F | Fondo de cards |
| bg-surface-raised | #1A1F2B | Cards elevadas, modales |
| bg-surface-overlay | #20262F | Inputs, chips |
| border-subtle | #272E3A | Bordes sutiles |
| border-default | #343C4A | Bordes de inputs |

### Acento azul (max 1-2 por pantalla)
| Token | Hex | Uso |
|-------|-----|-----|
| accent-blue | #2D6FE0 | CTAs principales |
| accent-blue-bright | #4C8DFF | Hover/press, highlights |
| accent-blue-metal | #3A5A8C | Bordes activos, badges |
| accent-blue-dim | #1C3A66 | Fondo chips azul |

### Texto
| Token | Hex | Uso |
|-------|-----|-----|
| text-primary | #F4F5F7 | Titulos |
| text-secondary | #A8AFBD | Subtitulos |
| text-tertiary | #6B7280 | Placeholders |
| text-on-accent | #FFFFFF | Sobre fondo azul |
| text-link | #4C8DFF | Enlaces |

### Tipografia
- **Display/Headings**: Bebas Neue (o fallback sistema sans-serif bold) — requiere cargar con expo-font si se quiere custom
- **Body/UI**: Inter (fallback sistema)
- **Mono (decorativo)**: JetBrains Mono (solo dorsal/ID) — requiere cargar con expo-font si se quiere custom

**Nota**: Las custom fonts (Bebas Neue, Inter, JetBrains Mono) NO están cargadas actualmente. El app usa fallbacks del sistema. Si necesitás fonts custom, instalá `expo-font` y configurá.

### Escala
| Token | Size | Peso | Uso |
|-------|------|------|-----|
| display-xl | 40px | 700 | Splash, stats hero |
| display-lg | 32px | 700 | Nombre jugador |
| display-md | 24px | 700 | Titulos de pantalla |
| heading-lg | 20px | 600 | Titulos de seccion |
| heading-md | 17px | 600 | Sub-secciones |
| body-lg | 16px | 400 | Bio, contenido |
| body-md | 14px | 400 | Texto estandar |
| body-sm | 13px | 400 | Labels |
| caption | 11px | 500 | Timestamps |
| button-text | 15px | 600 | Botones (uppercase en CTAs) |

### Radios
| Token | Valor | Uso |
|-------|-------|-----|
| radius-sm | 8px | Chips, badges |
| radius-md | 12px | Inputs |
| radius-lg | 16px | Cards |
| radius-xl | 20px | Bottom sheets |
| radius-full | 999px | Botones pill, avatares |

### Botones
- **Primary**: fondo #2D6FE0, pill (radius-full), alto 52px, uppercase
- **Secondary**: transparente, borde 1.5px #343C4A, pill
- **Ghost**: sin fondo ni borde, solo texto
- **FAB**: circular 56px, fondo #2D6FE0

### Inputs
- Fondo: #20262F
- Borde: 1px #343C4A, focus: 1.5px #2D6FE0
- Radio: 12px, Alto: 52px
- Error: borde #E5484D

---

## 7. Microcopy (tono de la UI)

- **Voseo argentino** en TODA la UI: "Subi tu video", "Completa tu perfil"
- CTAs cortos y directos: "DALE QUE VA", "SUBIR JUGADA", "GUARDAR PERFIL"
- Errores con calidez: "Algo salio mal, proba de nuevo"
- Empty states con personalidad: "Todavia no subiste ninguna jugada. Mostra lo que tenes!"

---

## 8. Pantallas (MVP)

| Pantalla | Descripcion |
|----------|-------------|
| Splash | Verifica sesion, redirige |
| Login | Email + password, auth local SHA-256 |
| Registro | "CREA TU FICHA", wizard 3 pasos |
| Onboarding | Completar perfil deportivo (3 pasos) |
| Mi Perfil | Avatar, datos, ficha tecnica, destacados |
| Editar Perfil | Formulario con todos los campos |
| Biblioteca Media | Grilla 2 columnas, FAB upload |
| Subir Multimedia | Seleccionar + clasificar + subir |
| VideoPlayer | Reproductor fullscreen |
| Estadisticas | KPI cards + metricas por temporada |
| Atributos | Sliders por dimension + radar chart SVG |
| Ajustes | Cuenta, editar perfil, logout |

---

## 9. Funciones de Servicio (API surface)

### database.js
- `initDatabase()` — inicializa SQLite/WebDB y crea tablas
- `getDatabase()` — retorna la instancia de DB

### profile.service.js
- `getProfile(userId)`
- `createProfile(profileData)`
- `updateProfile(userId, profileData)`
- `uploadAvatar(userId, imageFile)`
- `isProfileComplete(profile)`

### stats.service.js
- `getStats(profileId)`
- `getStatsBySeason(profileId, season)`
- `upsertStats(statsData)`
- `deleteStats(statsId)`

### attributes.service.js
- `getAttributes(profileId)`
- `getAttributesByDimension(profileId, dimension)`
- `upsertAttributes(attributesArray)`
- `calculateRadarAverages(profileId)`

### media.service.js
- `uploadMedia(profileId, file, type, category, subcategory, description)`
- `getMediaByProfile(profileId)`
- `getMediaByCategory(profileId, category)`
- `deleteMedia(mediaId, storagePath)`
- `getMediaUrl(storagePath)`

### storage.js (utils)
- `storageGetItem(key)`
- `storageSetItem(key, value)`
- `storageDeleteItem(key)`

---

## 10. Comandos Disponibles

```bash
npm start          # Expo Metro Bundler (LAN)
npm run tunnel     # Expo via ngrok (WAN) — requiere @expo/ngrok
npm run android    # Abre emulador Android
npm run ios        # Abre simulador iOS
npm run web        # Abre en navegador web
```

---

## 11. Requisitos No Funcionales

- Videos max 60s y 50MB
- Fotos max 10MB
- Compatible con Expo Go y standalone iOS 15+ / Android 10+
- Orientacion: solo portrait (`app.json`: `"orientation": "portrait"`)
- Tap targets: minimo 44x44px

---

## 12. Errores Comunes a Evitar

- **NO usar** `@supabase/supabase-js` — no hay Supabase
- **NO usar** NativeWind/Tailwind — no está instalado
- **NO usar** `createServer`, Express, FastAPI — no hay backend
- **NO asumir** que las credenciales de auth son seguras (son SHA-256 local, no hashes dedicados)
- **NO hardcodear** colores — usar siempre `src/constants/colors.js`
- **NO usar** `expo-file-system/legacy` — usar `expo-file-system` directamente (o verificar que `legacy` funcione en SDK 54)

---

## 13. Dependencias Clave (package.json)

```json
{
  "expo": "~54.0.35",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-sqlite": "~16.0.10",
  "expo-secure-store": "~15.0.0",
  "expo-crypto": "~15.0.9",
  "expo-file-system": "~19.0.23",
  "expo-image-picker": "~17.0.0",
  "expo-video": "~3.0.16",
  "react-native-svg": "15.12.1",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@react-navigation/native": "^7.3.3",
  "@react-navigation/bottom-tabs": "^7.18.2",
  "lucide-react-native": "^1.20.0",
  "@expo/ngrok": "^4.1.0"
}
```

---

## 14. Checklist de Calidad (antes de cada commit)

- [ ] JavaScript puro (no TypeScript)
- [ ] Colores desde constants, no hardcodeados
- [ ] Max 1-2 elementos azules por pantalla
- [ ] Microcopy en voseo argentino
- [ ] Tap targets >= 44x44px
- [ ] Servicios centralizados en /src/services, no inline en screens
- [ ] Manejo de errores con try/catch
- [ ] Mensajes de error en español
- [ ] NO agregar dependencias de Supabase o backend externo
- [ ] NO agregar NativeWind/Tailwind

---

*ElPibe — Guia para IA v2.0*