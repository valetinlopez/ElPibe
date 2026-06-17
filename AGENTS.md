# AGENTS.md — ElPibe

> Guía completa para que cualquier IA trabaje correctamente sobre el proyecto ElPibe.
> LEER ANTES DE ESCRIBIR CÓDIGO. Actualizado: 16 de junio de 2026.

---

## 0. Qué es ElPibe

App móvil para futbolistas amateurs donde se registran, crean un perfil deportivo, suben contenido multimedia (videos/fotos) y registran estadísticas y atributos básicos. **No hay backend propio**: todo usa Supabase (Auth + Postgres + Storage).

**Rol único**: PLAYER. No hay scouts, entrenadores ni busqueda de talento en esta version.

---

## 1. Stack Tecnologico

| Capa | Tecnologia | Version |
|------|------------|---------|
| Frontend | React Native + Expo | SDK 56 |
| Lenguaje | **JavaScript** (NO TypeScript) | — |
| Estilos | NativeWind (Tailwind para RN) | — |
| Navegacion | React Navigation (Stack + Bottom Tabs) | — |
| Backend | Supabase (Postgres + Auth + Storage) | — |
| Cliente de datos | @supabase/supabase-js | — |
| Iconografia | lucide-react-native | — |
| SVG / Charts | react-native-svg | — |
| Storage local | @react-native-async-storage/async-storage | — |
| Tokens seguros | expo-secure-store | — |

---

## 2. Reglas Inquebrantables

### 2.1 Lenguaje
- **JavaScript puro**. NUNCA usar TypeScript.
- Archivos `.js` o `.jsx`. NUNCA `.ts` o `.tsx`.
- Comentarios en **espanol** cuando sea relevante.

### 2.2 Backend
- **NUNCA** crear Express, FastAPI, o cualquier servidor propio.
- Toda persistencia de datos es a traves de `@supabase/supabase-js`.
- Todas las llamadas a Supabase van en la capa `/src/services/`, **NUNCA** inline en componentes de pantalla.

### 2.3 Estilos
- Usar **NativeWind** (clases de Tailwind) para todos los estilos.
- Colores SIEMPRE desde `src/constants/colors.js`.
- NUNCA hardcodear colores hex en componentes.
- Seguir el DESIGN.md al pie de la letra.

### 2.4 Seguridad
- Todas las tablas deben tener **RLS habilitado** antes de ir a produccion.
- Un usuario solo puede CRUD sobre sus propias filas (`profile_id = auth.uid()`).
- Storage buckets son **privados**. Acceso solo via signed URLs.

### 2.5 Navegacion
- Usar React Navigation con estructura: Root → AuthStack | MainTabs.
- MainTabs tiene 4 tabs: Perfil, Estadistics, Multimedia, Ajustes.
- Cada tab puede tener su propio Stack anidado.

---

## 3. Estructura de Carpetas

```
/src
  /screens           -> Pantallas de la app
    /auth            -> Login, Register, ForgotPassword
    /onboarding      -> Wizard de 3 pasos
    /profile         -> MiPerfil, EditarPerfil
    /media           -> BibliotecaMultimedia, SubirMultimedia
    /stats           -> Estadisticas
    /attributes      -> Atributos
    /settings        -> Ajustes
  /components        -> Componentes reutilizables (Button, Input, Card, etc.)
  /navigation        -> RootNavigator, AuthStack, MainTabs
  /services          -> Capa de Supabase
    supabaseClient.js
    auth.service.js
    profile.service.js
    stats.service.js
    attributes.service.js
    media.service.js
  /context           -> AuthContext (sesion global)
  /constants         -> colors.js, typography.js, spacing.js, radii.js, positions.js
  /utils             -> validaciones.js, formatters.js
App.js               -> Entry point
```

---

## 4. Modelo de Datos (Supabase / Postgres)

### profiles
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | uuid | PK, fk a auth.users |
| full_name | text | |
| age | int2 | |
| city | text | |
| nationality | text | |
| height_cm | int2 | |
| weight_kg | int2 | |
| foot | text | 'izquierda' / 'derecha' / 'ambidiestro' |
| position_main | text | |
| position_secondary | text | |
| club | text | |
| category | text | |
| bio | text | max 500 chars |
| photo_url | text | path en Storage |
| created_at | timestamptz | default now() |

### player_stats
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | uuid | PK, default gen_random_uuid() |
| profile_id | uuid | FK a profiles(id) |
| season | text | ej. '2026' |
| matches | int2 | default 0 |
| minutes | int4 | default 0 |
| goals | int2 | default 0 |
| assists | int2 | default 0 |
| yellow_cards | int2 | default 0 |
| red_cards | int2 | default 0 |

### player_attributes
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | uuid | PK |
| profile_id | uuid | FK a profiles(id) |
| dimension | text | 'technical' / 'physical' / 'tactical' / 'mental' |
| attribute_name | text | |
| score | int2 | rango 1 a 10 |

### media_items
| Campo | Tipo | Detalle |
|-------|------|---------|
| id | uuid | PK |
| profile_id | uuid | FK a profiles(id) |
| type | text | 'video' / 'photo' |
| category | text | ofensiva/defensiva/etc |
| subcategory | text | |
| storage_path | text | ruta en Supabase Storage |
| created_at | timestamptz | default now() |

---

## 5. Politicas RLS (SQL)

```sql
-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- player_stats
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON player_stats FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own stats" ON player_stats FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own stats" ON player_stats FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own stats" ON player_stats FOR DELETE USING (auth.uid() = profile_id);

-- player_attributes
ALTER TABLE player_attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attributes" ON player_attributes FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can upsert own attributes" ON player_attributes FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own attributes" ON player_attributes FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own attributes" ON player_attributes FOR DELETE USING (auth.uid() = profile_id);

-- media_items
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own media" ON media_items FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own media" ON media_items FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own media" ON media_items FOR DELETE USING (auth.uid() = profile_id);
```

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
- **Display/Headings**: Winner Condensed Medium (condensada, tipo dorsal)
- **Body/UI**: Inter
- **Mono (decorativo)**: JetBrains Mono (solo dorsal/ID)

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
| Login | Email + password, social login (placeholder) |
| Registro | "CREA TU FICHA", wizard 3 pasos |
| Onboarding | Completar perfil deportivo |
| Mi Perfil | Avatar, datos, ficha tecnica, destacados |
| Editar Perfil | Formulario con todos los campos |
| Biblioteca Media | Grilla 2 columnas, FAB upload |
| Subir Multimedia | Seleccionar + clasificar + subir |
| Estadisticas | KPI cards + radar chart |
| Atributos | Sliders por dimension + radar |
| Ajustes | Cuenta, preferencias, logout |

---

## 9. Funciones de Servicio (API surface)

### auth.service.js
- signUp(email, password, fullName)
- signIn(email, password)
- signOut()
- resetPassword(email)
- getCurrentSession()
- getCurrentUser()

### profile.service.js
- getProfile(userId)
- createProfile(profileData)
- updateProfile(userId, profileData)
- uploadAvatar(userId, imageFile)
- isProfileComplete(profile)

### stats.service.js
- getStats(profileId)
- getStatsBySeason(profileId, season)
- upsertStats(statsData)
- deleteStats(statsId)

### attributes.service.js
- getAttributes(profileId)
- getAttributesByDimension(profileId, dimension)
- upsertAttributes(attributesArray)
- calculateRadarAverages(profileId)

### media.service.js
- uploadMedia(profileId, file, type, category, subcategory)
- getMediaByProfile(profileId)
- getMediaByCategory(profileId, category)
- deleteMedia(mediaId, storagePath)

---

## 10. Requisitos No Funcionales

- Perfil carga en <2s en 4G
- Videos max 60s y 50MB
- Fotos max 10MB
- Compatible con Expo Go y standalone iOS 15+ / Android 10+
- Orientacion: solo portrait (configurar en app.json)
- Tap targets: minimo 44x44px

---

## 11. Checklist de Calidad (antes de cada commit)

- [ ] JavaScript puro (no TypeScript)
- [ ] Colores desde constants, no hardcodeados
- [ ] Max 1-2 elementos azules por pantalla
- [ ] Microcopy en voseo argentino
- [ ] Tap targets >= 44x44px
- [ ] Servicios centralizados, no inline en screens
- [ ] RLS habilitado en todas las tablas
- [ ] Manejo de errores con try/catch
- [ ] Mensajes de error en espanol

---

*ElPibe — Guia para IA v1.0*
