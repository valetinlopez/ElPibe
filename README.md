# ⚽ El Pibe

> El potrero digital para los que sienten la 10.

App móvil para futbolistas amateurs. Registrate, armá tu ficha deportiva, subí tus mejores jugadas, cargá estadisticas y medí tus atributos con radar tactico. Todo 100% offline, sin backend.

---

## 📱 Plataformas

| Plataforma | Soporte |
|-----------|---------|
| iOS 15+ | ✅ Expo Go + standalone |
| Android 10+ | ✅ Expo Go + standalone |
| Web | ✅ (modo desarrollo / pruebas) |

---

## 🧰 Tech Stack

| Capa | Tecnologia | Version |
|------|------------|---------|
| Frontend | React Native + Expo | SDK 54 |
| Lenguaje | **JavaScript** | ES2020+ |
| Navegacion | React Navigation | v7 (Stack + Bottom Tabs) |
| Estilos | StyleSheet (design system propio) | — |
| Base de datos local | expo-sqlite (native) / WebDB (web) | — |
| Archivos locales | expo-file-system | v19 |
| Almacenamiento seguro | expo-secure-store | v15 |
| Iconografia | lucide-react-native | v1.20 |
| SVG / Charts | react-native-svg | v15.12 |
| Video | expo-video | v3 |
| Autenticacion | Custom local (SHA-256) | — |
| UUIDs | expo-crypto | v15 |

---

## 🚀 Instalacion y uso

```bash
# Clonar
git clone <repo-url>
cd ElPibe

# Instalar dependencias
npm install

# Iniciar en Expo Go
npx expo start

# Escanear el QR con Expo Go (iOS/Android)
# O presionar 'w' para abrir en navegador web
```

### Scripts disponibles

| Comando | Accion |
|---------|--------|
| `npm start` | Inicia Metro Bundler |
| `npm run tunnel` | Inicia con tunnel ngrok (requiere misma WiFi o ngrok configurado) |
| `npm run android` | Abre en emulador Android |
| `npm run ios` | Abre en simulador iOS |
| `npm run web` | Abre en navegador web |

---

## 🏗️ Arquitectura

```
App.js                    ← Entry point: SafeAreaProvider + AuthProvider + RootNavigator
  └─ AuthContext.js       ← Estado global de sesion (custom, SHA-256 local)
      └─ RootNavigator
          ├─ Splash       ← Verifica sesion → redirige a Auth o MainTabs
          ├─ AuthStack    ← Login → Register → ForgotPassword → Onboarding (3 pasos)
          └─ MainTabs     ← 4 tabs con Stack anidado
              ├─ TabPerfil    → MiPerfil → EditarPerfil
              ├─ TabStats     → Estadisticas → Atributos
              ├─ TabMedia     → Biblioteca → SubirMultimedia → VideoPlayer
              └─ TabAjustes  → Ajustes
```

### Flujo de datos

```
Screens → Services (capa de negocio) → Database (persistencia)
   │            │                           │
   │   profile.service.js          ┌─ expo-sqlite (iOS/Android)
   │   stats.service.js            │
   │   attributes.service.js       └─ WebDB → localStorage (web)
   │   media.service.js (filesystem + DB)
   │
   └─ AuthContext.js → storage.js → SecureStore / localStorage
```

---

## 💾 Base de Datos Local

El proyecto usa **almacenamiento 100% local**. No hay backend ni Supabase en esta version.

| Tabla | Campos clave | Proposito |
|-------|-------------|-----------|
| `profiles` | id, full_name, age, city, nationality, height_cm, weight_kg, foot, position_main, position_secondary, club, category, bio, photo_url | Perfil del jugador |
| `player_stats` | id, profile_id, season, matches, minutes, goals, assists, yellow_cards, red_cards | Estadisticas por temporada |
| `player_attributes` | id, profile_id, dimension, attribute_name, score | Atributos en 4 dimensiones (technical, physical, tactical, mental) |
| `media_items` | id, profile_id, type, category, subcategory, description, storage_path, created_at | Archivos multimedia (videos/fotos) |

**Estrategia dual**:
- **iOS/Android**: `expo-sqlite` (`openDatabaseSync`) con SQL real
- **Web**: Clase `WebDB` que emula SQL sobre arrays en memoria, persistidos en `localStorage` como JSON

Los archivos multimedia (fotos, videos, avatars) se guardan en `FileSystem.documentDirectory` en subcarpetas `avatars/` y `media/`. En web se almacenan como **data URIs base64** directamente en la DB.

---

## 🎨 Diseño

App 100% dark mode. Identidad visual inspirada en el futbol de barrio argentino.

| Elemento | Valor |
|----------|-------|
| Fondo base | `#0B0E14` |
| Superficies | `#12161F` / `#1A1F2B` |
| Acento principal | `#2D6FE0` (azul metalico, max 1-2 elementos por pantalla) |
| Tipografia display | Winner Condensed Medium |
| Tipografia body | Inter |
| Tipografia mono | JetBrains Mono (dorsales/IDs) |
| Microcopy | **Voseo argentino** en toda la UI |
| Regla de diseño | Todos los tap targets >= 44x44px |

---

## ✨ Features

### MVP actual
- [x] Registro con wizard de 3 pasos (datos personales → fisicos → deportivos)
- [x] Login / logout con auth local (SHA-256)
- [x] Perfil completo: avatar, datos fisicos, posicion, club, biografia
- [x] Edicion de perfil (todos los campos)
- [x] Subida de videos (max 60s, 50MB) y fotos (max 10MB)
- [x] Biblioteca multimedia con grilla 2 columnas, filtros por categoria y FAB
- [x] Reproductor de video fullscreen
- [x] Estadisticas por temporada con KPIs y metricas derivadas (goles/partido)
- [x] Atributos con sliders +/- en 4 dimensiones (19 skills)
- [x] Radar chart SVG en tiempo real
- [x] Settings con logout, editar perfil, contacto, reportar bugs
- [x] Tab bar responsiva con safe area insets

### Proximamente
- [ ] Separar secciones Fotos y Videos
- [ ] Notificaciones push
- [ ] Backend real con Supabase para sync multi-dispositivo
- [ ] Perfil publico compartible via deep link
- [ ] Highlights / mejores jugadas automaticas
- [ ] Tests automatizados

---

## 📂 Estructura del proyecto

```
/src
  /screens           → Pantallas de la app
    /auth            → Login, Register, ForgotPassword
    /onboarding      → Wizard de 3 pasos
    /profile         → MiPerfil, EditarPerfil
    /media           → BibliotecaMultimedia, SubirMultimedia, VideoPlayer
    /stats           → Estadisticas
    /attributes      → Atributos
    /settings        → Ajustes
  /components        → 13 componentes reutilizables
  /navigation        → RootNavigator, AuthStack, MainTabs, 4 stacks anidados
  /services          → Capa de persistencia (database, profile, stats, attributes, media)
  /context           → AuthContext (sesion global)
  /constants         → colors, typography, spacing, radii, positions, dimensions, categories
  /utils             → validations, formatters, storage
App.js               → Entry point
```

---

## 🛡️ Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 📝 Créditos

Construido con React Native + Expo. Hecho para el potrero.

**El Pibe v1.0.0** — Buenos Aires, 2026.
