# PLAN DE EJECUCIÓN — ElPibe (React Native + Expo)

## Resumen del Proyecto

 **Stack** : React Native + Expo (JS) · Supabase (Auth + Postgres + Storage) · NativeWind · React Navigation

**Pantallas** (10): Login, Registro, Onboarding Wizard, Mi Perfil, Editar Perfil, Biblioteca Multimedia, Subir Multimedia, Estadísticas, Atributos, Splash

 **Diseño** : Dark mode (#0B0E14), acento azul metálico (#2D6FE0), tipografía condensada tipo dorsal, voseo argentino, Lucide icons

---

## FASE 0 — PROYECTO Y CONFIGURACIÓN INICIAL

### Ticket 0.1: Inicializar proyecto Expo blank

* [X] Ejecutar `npx create-expo-app ElPibe --template blank`
* [X] Verificar que arranca en Expo Go
* [X] Configurar `app.json`: nombre "ElPibe", orientación portrait, splash background #0B0E14

### Ticket 0.2: Instalar dependencias core

* [X] `npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs`
* [X] `npx expo install react-native-screens react-native-safe-area-context`
* [X] `npx expo install @supabase/supabase-js`
* [X] `npx expo install nativewind tailwindcss`
* [X] `npx expo install expo-image-picker expo-media-library`
* [X] `npx expo install @react-native-async-storage/async-storage`
* [X] `npx expo install react-native-svg` (para radar chart)
* [X] `npx expo install lucide-react-native`
* [X] `npx expo install expo-secure-store` (para tokens)

### Ticket 0.3: Configurar NativeWind / Tailwind

* [X] Crear `tailwind.config.js` con la paleta de colores del DESIGN.md
* [X] Crear `global.css` con los tokens de color
* [X] Configurar babel para NativeWind
* [X] Verificar que una pantalla usa clases de Tailwind correctamente

### Ticket 0.4: Crear estructura de carpetas

* [X] Crear `/src/screens`
* [X] Crear `/src/components`
* [X] Crear `/src/navigation`
* [X] Crear `/src/services`
* [X] Crear `/src/context`
* [X] Crear `/src/utils`
* [X] Crear `/src/constants` (colores, tipografía, etc.)

### Ticket 0.5: Crear theme constants

* [X] Crear `src/constants/colors.js` con todos los tokens del DESIGN.md
* [X] Crear `src/constants/typography.js` con escalas tipográficas
* [X] Crear `src/constants/spacing.js` con sistema de espaciado
* [X] Crear `src/constants/radii.js` con border radius

---

## FASE 1 — SUPABASE Y SEGURIDAD

### Ticket 1.1: Configurar cliente Supabase

* [X] Crear `src/services/supabaseClient.js`
* [X] Configurar URL y anon key desde variables de entorno
* [X] Exportar cliente inicializado

### Ticket 1.2: Crear tablas en Supabase (SQL)

* [X] Script SQL para tabla `profiles` con todos los campos del ERS
* [X] Script SQL para tabla `player_stats`
* [X] Script SQL para tabla `player_attributes`
* [X] Script SQL para tabla `media_items`
* [ ] Ejecutar en Supabase Dashboard (pendiente manual)

### Ticket 1.3: Configurar RLS en todas las tablas

* [X] Habilitar RLS en `profiles`
* [X] Habilitar RLS en `player_stats`
* [X] Habilitar RLS en `player_attributes`
* [X] Habilitar RLS en `media_items`
* [X] Crear políticas SELECT/INSERT/UPDATE/DELETE por usuario
* [ ] Probar con dos cuentas de que no cruzan datos (pendiente manual)

### Ticket 1.4: Configurar Storage buckets

* [X] Crear bucket `avatars` (privado) — SQL listo
* [X] Crear bucket `media` (privado) — SQL listo
* [X] Configurar políticas de acceso por usuario
* [ ] Probar upload y generación de signed URLs (pendiente manual)

---

## FASE 2 — SERVICIOS (Capa de datos)

### Ticket 2.1: Servicio de Autenticación

* [ ] Crear `src/services/auth.service.js`
* [ ] Función `signUp(email, password, fullName)`
* [ ] Función `signIn(email, password)`
* [ ] Función `signOut()`
* [ ] Función `resetPassword(email)`
* [ ] Función `getCurrentSession()`
* [ ] Función `getCurrentUser()`
* [ ] Todas con try/catch y mensajes en español

### Ticket 2.2: Servicio de Perfiles

* [ ] Crear `src/services/profile.service.js`
* [ ] Función `getProfile(userId)`
* [ ] Función `createProfile(profileData)`
* [ ] Función `updateProfile(userId, profileData)`
* [ ] Función `uploadAvatar(userId, imageFile)`
* [ ] Función `isProfileComplete(profile)` (para onboarding)

### Ticket 2.3: Servicio de Estadísticas

* [ ] Crear `src/services/stats.service.js`
* [ ] Función `getStats(profileId)`
* [ ] Función `getStatsBySeason(profileId, season)`
* [ ] Función `upsertStats(statsData)`
* [ ] Función `deleteStats(statsId)`

### Ticket 2.4: Servicio de Atributos

* [ ] Crear `src/services/attributes.service.js`
* [ ] Función `getAttributes(profileId)`
* [ ] Función `getAttributesByDimension(profileId, dimension)`
* [ ] Función `upsertAttributes(attributesArray)`
* [ ] Función `calculateRadarAverages(profileId)`

### Ticket 2.5: Servicio de Multimedia

* [ ] Crear `src/services/media.service.js`
* [ ] Función `uploadMedia(profileId, file, type, category, subcategory)`
* [ ] Función `getMediaByProfile(profileId)`
* [ ] Función `getMediaByCategory(profileId, category)`
* [ ] Función `deleteMedia(mediaId, storagePath)`
* [ ] Validación de tamaño (50MB video, 10MB foto)
* [ ] Validación de duración (60s max video)

---

## FASE 3 — CONTEXTO Y NAVEGACIÓN

### Ticket 3.1: AuthContext

* [ ] Crear `src/context/AuthContext.js`
* [ ] State: `user`, `session`, `profile`, `loading`
* [ ] Funciones: `signIn`, `signUp`, `signOut`, `refreshProfile`
* [ ] Persistir sesión con `expo-secure-store`
* [ ] Provider que envuelve toda la app

### Ticket 3.2: Navegación — Auth Stack

* [ ] Crear `src/navigation/AuthStack.js`
* [ ] Screens: Login, Registro, ForgotPassword
* [ ] Transiciones: slide from bottom

### Ticket 3.3: Navegación — Main Tabs

* [ ] Crear `src/navigation/MainTabs.js`
* [ ] 4 tabs: Perfil, Estadísticas, Multimedia, Ajustes
* [ ] Tab bar con estilo del DESIGN.md (fondo #1A1F2B, borde superior)
* [ ] Íconos Lucide: User, BarChart2, Camera, Settings
* [ ] Tab activo: color #4C8DFF con indicador de 3px

### Ticket 3.4: Navegación — Profile Stack (nested)

* [ ] Screens: MiPerfil, EditarPerfil, Atributos
* [ ] Header con título uppercase display-md

### Ticket 3.5: Navegación — Multimedia Stack (nested)

* [ ] Screens: BibliotecaMultimedia, SubirMultimedia, VerMedia
* [ ] FAB flotante para subir

### Ticket 3.6: Navegación — Root Navigator

* [ ] Crear `src/navigation/RootNavigator.js`
* [ ] Lógica: si hay sesión → MainTabs, si no → AuthStack
* [ ] Splash screen mientras verifica sesión

---

## FASE 4 — COMPONENTES REUTILIZABLES

### Ticket 4.1: Componente Button

* [ ] Crear `src/components/Button.js`
* [ ] Variantes: primary (pill, azul), secondary (outline), ghost (texto)
* [ ] Estados: enabled, disabled (opacidad 0.4), loading
* [ ] Estilo: radius-full, alto 52px, uppercase en primary

### Ticket 4.2: Componente Input

* [ ] Crear `src/components/Input.js`
* [ ] Label flotante, placeholder, icono izquierdo
* [ ] Estados: focus (borde azul), error (borde rojo + mensaje)
* [ ] Estilo: fondo #20262F, radio 12px, alto 52px

### Ticket 4.3: Componente Card

* [ ] Crear `src/components/Card.js`
* [ ] Variantes: default, raised, glow-blue
* [ ] Estilo: fondo #12161F, radio 16px, elevation-card

### Ticket 4.4: Componente Badge / Chip

* [ ] Crear `src/components/Badge.js`
* [ ] Variantes: default, destacada (azul), logro (dorado), tarjeta amarilla/roja
* [ ] Radio: sm o full según tipo

### Ticket 4.5: Componente Avatar

* [ ] Crear `src/components/Avatar.js`
* [ ] Circular 96px, borde 2px
* [ ] Borde azul si perfil completo, gris si incompleto
* [ ] Icono de cámara overlay para edición

### Ticket 4.6: Componente Header

* [ ] Crear `src/components/Header.js`
* [ ] Altura 56px + safe area
* [ ] Título centrado uppercase display-md
* [ ] Botón back (izquierda) y acción derecha opcionales

### Ticket 4.7: Componente RadarChart

* [ ] Crear `src/components/RadarChart.js`
* [ ] Usar react-native-svg
* [ ] 4 dimensiones: Técnica, Física, Táctica, Mental
* [ ] Fondo #12161F, polígono azul con glow
* [ ] Labels en las puntas, mínimo 280x280px
* [ ] Tamaño proporcional con Dimensions

### Ticket 4.8: Componente MediaCard

* [ ] Crear `src/components/MediaCard.js`
* [ ] Aspect ratio 9:16 (video) o 1:1 (foto)
* [ ] Overlay con gradiente, ícono play, duración
* [ ] Badge de categoría arriba a la izquierda

### Ticket 4.9: Componente StatCard

* [ ] Crear `src/components/StatCard.js`
* [ ] Número grande display-md, label debajo body-sm
* [ ] Grid: 2x2 o 3 en fila
* [ ] Color dorado si es récord

### Ticket 4.10: Componente ProgressBar (Onboarding)

* [ ] Crear `src/components/ProgressBar.js`
* [ ] Segmentos: activo #2D6FE0, pendiente #272E3A
* [ ] Transición animada entre pasos

### Ticket 4.11: Componente Toast / Snackbar

* [ ] Crear `src/components/Toast.js`
* [ ] Variantes: success (verde), error (rojo), warning (amarillo)
* [ ] Auto-dismiss 2.5s, borde izquierdo 3px
* [ ] Posición inferior

### Ticket 4.12: Componente EmptyState

* [ ] Crear `src/components/EmptyState.js`
* [ ] Ilustración outline monocromática + detalle azul
* [ ] Texto con personalidad (voseo) + CTA opcional

### Ticket 4.13: Componente SkeletonLoader

* [ ] Crear `src/components/SkeletonLoader.js`
* [ ] Shimmer animation entre #12161F y #20262F
* [ ] Variantes: rectángulo, círculo, texto

---

## FASE 5 — PANTALLAS DE AUTENTICACIÓN

### Ticket 5.1: Splash Screen

* [ ] Crear `src/screens/SplashScreen.js`
* [ ] Logo "EL PIBE" con tipografía condensada
* [ ] Verificar sesión activa con Supabase
* [ ] Si hay sesión → MainTabs, si no → AuthStack
* [ ] Fondo #0B0E14

### Ticket 5.2: Login Screen

* [ ] Crear `src/screens/auth/LoginScreen.js`
* [ ] Logo "EL PIBE" arriba
* [ ] Tagline: "El potrero digital para los que sienten la 10."
* [ ] Input email con ícono mail
* [ ] Input contraseña con ícono ojo (toggle visibility)
* [ ] Link "¿Olvidaste tu contraseña?"
* [ ] Botón primario "ENTRAR A LA CANCHA" + ícono pelota
* [ ] Separador "O USÁ"
* [ ] Botones secundarios Google y Apple (placeholder por ahora)
* [ ] Link inferior "¿No tenés cuenta? Registrate"
* [ ] Funcional: llamar auth.service.signIn

### Ticket 5.3: Registro Screen

* [ ] Crear `src/screens/auth/RegisterScreen.js`
* [ ] Header con flecha back + logo "EL PIBE"
* [ ] Título "CREÁ TU FICHA" display-xl
* [ ] Subtítulo "Completá tus datos para saltar a la cancha."
* [ ] Progress bar (3 segmentos)
* [ ] Input "Nombre Completo (como en el dorsal)"
* [ ] Input "Tu Correo Electrónico"
* [ ] Input "Contraseña Segura"
* [ ] Checkbox "Acepto los términos de juego y la política de privacidad del club."
* [ ] Botón primario "EMPEZAR MI CARRERA" + ícono rayo
* [ ] Link inferior "¿Ya sos parte del equipo? Iniciá sesión acá"
* [ ] Footer visual "BUENOS AIRES • EST. 2024"
* [ ] Funcional: llamar auth.service.signUp

### Ticket 5.4: Forgot Password Screen

* [ ] Crear `src/screens/auth/ForgotPasswordScreen.js`
* [ ] Input email
* [ ] Botón "ENVIAR LINK DE RECUPERACIÓN"
* [ ] Mensaje de confirmación
* [ ] Funcional: llamar auth.service.resetPassword

---

## FASE 6 — ONBOARDING

### Ticket 6.1: Onboarding Wizard — Paso 1 (Datos Personales)

* [ ] Crear `src/screens/onboarding/OnboardingStep1.js`
* [ ] Progress bar indicando paso 1 de 3
* [ ] Input: nombre completo
* [ ] Input: edad
* [ ] Input: ciudad
* [ ] Input: nacionalidad
* [ ] Botón "SIGUIENTE" sticky abajo

### Ticket 6.2: Onboarding Wizard — Paso 2 (Datos Físicos)

* [ ] Crear `src/screens/onboarding/OnboardingStep2.js`
* [ ] Progress bar paso 2 de 3
* [ ] Input: altura (cm)
* [ ] Input: peso (kg)
* [ ] Selector: pierna hábil (izquierda / derecha / ambidiestro)
* [ ] Botones "ATRÁS" y "SIGUIENTE"

### Ticket 6.3: Onboarding Wizard — Paso 3 (Datos Deportivos)

* [ ] Crear `src/screens/onboarding/OnboardingStep3.js`
* [ ] Progress bar paso 3 de 3
* [ ] Selector: posición principal
* [ ] Selector: posición secundaria
* [ ] Input: club
* [ ] Input: categoría
* [ ] Botones "ATRÁS" y "EMPEZAR MI CARRERA"
* [ ] Guardar profile en Supabase y marcar onboarding completo

### Ticket 6.4: Onboarding Container

* [ ] Crear `src/screens/onboarding/OnboardingScreen.js`
* [ ] Contenedor con transición slide horizontal
* [ ] Manejar estado global del wizard
* [ ] Al completar: crear perfil + redirigir a MainTabs

---

## FASE 7 — PANTALLA DE PERFIL

### Ticket 7.1: Mi Perfil — Header

* [ ] Crear `src/screens/profile/ProfileScreen.js`
* [ ] Header con gradiente hero (#0B0E14 → #1C3A66)
* [ ] Avatar circular 96px con borde azul
* [ ] Badge de verificación (opcional)
* [ ] Nombre display-lg uppercase
* [ ] Bio debajo del nombre
* [ ] FOTO DE CANCHA link

### Ticket 7.2: Mi Perfil — Cards Club y Categoría

* [ ] Dos cards en fila: "MI CLUB" y "CATEGORÍA"
* [ ] Estilo Card del DESIGN.md
* [ ] Ícono shield para club, badge para categoría
* [ ] Datos: club name y "U-21 Elite Local"

### Ticket 7.3: Mi Perfil — Ficha Técnica

* [ ] Sección "FICHA TÉCNICA" con # de dorsal
* [ ] Radar chart de 4 dimensiones (Técnica, Física, Táctica, Mental)
* [ ] O barras de progreso: RITMO, REGATE, TIRO
* [ ] Componente RadarChart

### Ticket 7.4: Mi Perfil — Destacados (Media Preview)

* [ ] Sección "DESTACADOS"
* [ ] Grilla 2 columnas de thumbnails de media
* [ ] Ícono play en videos
* [ ] Link "ver todo" a biblioteca multimedia

### Ticket 7.5: Mi Perfil — Botón Desafiar

* [ ] Botón primario "DESAFIAR AL JUGADOR"
* [ ] (Placeholder funcional por ahora, solo visual)

---

## FASE 8 — EDITAR PERFIL

### Ticket 8.1: Editar Perfil — Screen

* [ ] Crear `src/screens/profile/EditProfileScreen.js`
* [ ] Header "EDITAR PERFIL" con back arrow
* [ ] Avatar con ícono cámara overlay
* [ ] Link "FOTO DE CANCHA"

### Ticket 8.2: Editar Perfil — Formulario

* [ ] Input "Tu nombre de crack" con valor actual
* [ ] Textarea "Sobre vos (Bio)" max 500 caracteres
* [ ] Input "Club actual"
* [ ] Input "Categoría"
* [ ] Selector chips: "Posición preferida" (ENGANCHE, DELANTERO, EXTREMO, etc.)
* [ ] Botón primario "GUARDAR CAMBIOS" + ícono check

### Ticket 8.3: Editar Perfil — Identidad Potrera

* [ ] Card "IDENTIDAD POTRERA" con ícono dorado
* [ ] "ID de Jugador": #10-FERREYRA-2024
* [ ] "Estatus": badge TITULAR (verde)

### Ticket 8.4: Editar Perfil — Funcionalidad

* [ ] Cargar datos actuales del perfil al montar
* [ ] Validar campos obligatorios
* [ ] Llamar profile.service.updateProfile
* [ ] Toast de éxito/error
* [ ] Navegación de vuelta a perfil

---

## FASE 9 — BIBLIOTECA MULTIMEDIA

### Ticket 9.1: Biblioteca Multimedia — Screen

* [ ] Crear `src/screens/media/MediaLibraryScreen.js`
* [ ] Header "MEDIA" + subtítulo "Tus mejores jugadas en el potrero"
* [ ] Ícono de filtro arriba a la derecha
* [ ] FAB flotante (ícono cámara) abajo a la derecha

### Ticket 9.2: Biblioteca — Grid de Media

* [ ] Grilla 2 columnas, gap 8px
* [ ] Componente MediaCard para cada item
* [ ] Videos: aspect ratio 9:16, overlay con play + duración
* [ ] Fotos: aspect ratio 1:1
* [ ] Badge de categoría en cada card

### Ticket 9.3: Biblioteca — Empty State

* [ ] Ilustración outline de cámara
* [ ] Texto: "Todavía no subiste ninguna jugada. ¡Mostrá lo que tenés!"
* [ ] Botón CTA "SUBIR PRIMERA JUGADA"

### Ticket 9.4: Biblioteca — Filtrado

* [ ] Bottom sheet con opciones de categoría
* [ ] Filtros: Todas, Ofensiva, Defensiva, Jugadas con pelota, Sin pelota
* [ ] Aplicar filtro y recargar grilla

---

## FASE 10 — SUBIR MULTIMEDIA

### Ticket 10.1: Subir Multimedia — Screen

* [ ] Crear `src/screens/media/UploadMediaScreen.js`
* [ ] Header "SUBIR JUGADA" con back

### Ticket 10.2: Selector de Archivo

* [ ] Botón "Elegir desde galería" + ícono image
* [ ] Botón "Grabar ahora" + ícono camera
* [ ] Usar expo-image-picker
* [ ] Validar tamaño: max 50MB video, 10MB foto
* [ ] Validar duración: max 60s video
* [ ] Preview del archivo seleccionado

### Ticket 10.3: Clasificación

* [ ] Selector de categoría: Ofensiva, Defensiva, Con pelota, Sin pelota
* [ ] Selector de subcategoría (opcional)
* [ ] Input de título/descripción (opcional)

### Ticket 10.4: Upload y Confirmación

* [ ] Barra de progreso de upload
* [ ] Llamar media.service.uploadMedia
* [ ] Toast de éxito: "¡Jugada subida!"
* [ ] Redirigir a biblioteca

---

## FASE 11 — ESTADÍSTICAS

### Ticket 11.1: Estadísticas — Screen

* [ ] Crear `src/screens/stats/StatsScreen.js`
* [ ] Header "ESTADÍSTICAS" uppercase
* [ ] Selector de temporada

### Ticket 11.2: KPI Cards

* [ ] Grid 2x2 de StatCards
* [ ] Partidos jugados
* [ ] Goles
* [ ] Asistencias
* [ ] Tarjetas (amarillas/rojas)
* [ ] Números grandes display-md

### Ticket 11.3: Formulario de Stats

* [ ] Inputs editables para cada stat
* [ ] Botón "GUARDAR ESTADÍSTICAS"
* [ ] Validar que sean números >= 0

### Ticket 11.4: Radar de Atributos (en Stats)

* [ ] Sección "FICHA TÉCNICA"
* [ ] Radar chart con promedio por dimensión
* [ ] Componente RadarChart reutilizado

### Ticket 11.5: Empty State Stats

* [ ] "Todavía no cargaste estadísticas. ¡Armá tu ficha!"
* [ ] Botón "CARGAR PRIMERAS STATS"

---

## FASE 12 — ATRIBUTOS

### Ticket 12.1: Atributos — Screen

* [ ] Crear `src/screens/attributes/AttributesScreen.js`
* [ ] Header "ATRIBUTOS" uppercase
* [ ] Radar chart arriba (preview en tiempo real)

### Ticket 12.2: Sliders por Dimensión

* [ ] Sección TÉCNICA: Regate, Control, Pase, Tiro, Visión
* [ ] Sección FÍSICA: Velocidad, Resistencia, Fuerza, Salto
* [ ] Sección TÁCTICA: Posicionamiento, Juego aéreo, Marcaje
* [ ] Sección MENTAL: Liderazgo, Concentración, Creatividad
* [ ] Cada atributo: slider 1-10 + número display
* [ ] Valor >=8 en color azul bright

### Ticket 12.3: Actualización en Tiempo Real

* [ ] Al mover slider, recalcular promedios
* [ ] Actualizar radar chart instantáneamente
* [ ] Debounce antes de guardar

### Ticket 12.4: Guardar Atributos

* [ ] Botón "GUARDAR ATRIBUTOS"
* [ ] Llamar attributes.service.upsertAttributes
* [ ] Toast de confirmación

---

## FASE 13 — PANTALLA AJUSTES

### Ticket 13.1: Ajustes — Screen

* [ ] Crear `src/screens/settings/SettingsScreen.js`
* [ ] Header "AJUSTES" uppercase

### Ticket 13.2: Opciones de Ajustes

* [ ] Sección cuenta: Editar perfil, Cambiar contraseña
* [ ] Sección preferencias: Notificaciones (placeholder)
* [ ] Sección legal: Términos, Privacidad
* [ ] Sección soporte: Contacto, Reportar bug
* [ ] Botón "CERRAR SESIÓN" (rojo)

### Ticket 13.3: Funcionalidad Logout

* [ ] Confirmación antes de cerrar sesión
* [ ] Llamar auth.service.signOut
* [ ] Limpiar estado del AuthContext
* [ ] Redirigir a AuthStack

---

## FASE 14 — UTILIDADES Y HELPERS

### Ticket 14.1: Validaciones

* [ ] Crear `src/utils/validations.js`
* [ ] Validar email
* [ ] Validar contraseña (min 6 chars)
* [ ] Validar campos obligatorios del perfil
* [ ] Validar tamaño de archivo

### Ticket 14.2: Formateo

* [ ] Crear `src/utils/formatters.js`
* [ ] Formatear números de stats
* [ ] Formatear duración de video (mm:ss)
* [ ] Formatear fecha de creación

### Ticket 14.3: Constantes de UI

* [ ] Crear `src/constants/positions.js` (posiciones de fútbol)
* [ ] Crear `src/constants/categories.js` (categorías de media)
* [ ] Crear `src/constants/dimensions.js` (dimensiones de atributos)

---

## FASE 15 — TESTING Y CALIDAD

### Ticket 15.1: Testing Manual por Pantalla

* [ ] Login: registrar, login, cerrar sesión, recuperar password
* [ ] Onboarding: completar los 3 pasos, verificar guardado
* [ ] Perfil: ver datos, editar, cambiar foto
* [ ] Multimedia: subir video, subir foto, eliminar, filtrar
* [ ] Estadísticas: cargar stats, verificar display
* [ ] Atributos: mover sliders, verificar radar

### Ticket 15.2: Testing de Seguridad

* [ ] Verificar RLS: usuario A no ve datos de usuario B
* [ ] Verificar que Storage buckets son privados
* [ ] Verificar que signed URLs expiran

### Ticket 15.3: Testing de UI/UX

* [ ] Verificar dark mode en todas las pantallas
* [ ] Verificar que el azul aparece max 1-2 veces por pantalla
* [ ] Verificar tap targets >= 44x44px
* [ ] Verificar microcopy en voseo argentino
* [ ] Verificar empty states con texto con personalidad

### Ticket 15.4: Performance

* [ ] Perfil carga en <2s en 4G
* [ ] No hay re-renders innecesarios
* [ ] Imágenes optimizadas para mobile

---

## FASE 16 — SEO / ASO (App Store Optimization)

### Ticket 16.1: Metadata App Store

* [ ] Nombre: "ElPibe — El potrero digital"
* [ ] Subtítulo: "Tu ficha de futbolista amateur"
* [ ] Keywords: futbolista, amateur, perfil, estadísticas, potrero, ficha, jugador
* [ ] Descripción optimizada con keywords naturales

### Ticket 16.2: Screenshots y Preview

* [ ] Capturar screenshots de cada pantalla principal
* [ ] Crear preview video de la app
* [ ] Resolución: 1290x2796 (iPhone) o equivalente

### Ticket 16.3: Deep Links (opcional)

* [ ] Configurar deep linking para compartir perfil
* [ ] Formato: `elpibe://profile/{userId}`

### Ticket 16.4: Analytics

* [ ] Integrar Expo Analytics o similar
* [ ] Eventos: registro, login, perfil_completado, media_subido, stats_guardadas
* [ ] Dashboard de métricas básicas

---

## RESUMEN DE FASES

| Fase            | Descripción              | Tickets              |
| --------------- | ------------------------- | -------------------- |
| 0               | Proyecto y Configuración | 5                    |
| 1               | Supabase y Seguridad      | 4                    |
| 2               | Servicios (capa de datos) | 5                    |
| 3               | Contexto y Navegación    | 6                    |
| 4               | Componentes Reutilizables | 13                   |
| 5               | Pantallas de Auth         | 4                    |
| 6               | Onboarding                | 4                    |
| 7               | Pantalla de Perfil        | 5                    |
| 8               | Editar Perfil             | 4                    |
| 9               | Biblioteca Multimedia     | 4                    |
| 10              | Subir Multimedia          | 4                    |
| 11              | Estadísticas             | 5                    |
| 12              | Atributos                 | 4                    |
| 13              | Ajustes                   | 3                    |
| 14              | Utilidades                | 3                    |
| 15              | Testing y Calidad         | 4                    |
| 16              | SEO / ASO                 | 4                    |
| **TOTAL** |                           | **81 tickets** |

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```
Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6 → Fase 7 → Fase 8 → Fase 9 → Fase 10 → Fase 11 → Fase 12 → Fase 13 → Fase 14 → Fase 15 → Fase 16
```

**Dependencias clave:**

* Fase 1 (Supabase) DEBE completarse antes de Fase 2 (Servicios)
* Fase 2 (Servicios) DEBE completarse antes de Fase 5-13 (Pantallas)
* Fase 3 (Navegación) DEBE completarse antes de Fase 5 (Pantallas)
* Fase 4 (Componentes) se puede hacer en paralelo con Fase 2-3
* Fase 15 (Testing) se ejecuta incrementalmente después de cada fase
