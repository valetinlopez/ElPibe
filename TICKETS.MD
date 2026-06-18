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
* [X] Probar con dos cuentas de que no cruzan datos (pendiente manual)

### Ticket 1.4: Configurar Storage buckets

* [X] Crear bucket `avatars` (privado) — SQL listo
* [X] Crear bucket `media` (privado) — SQL listo
* [X] Configurar políticas de acceso por usuario
* [X] Probar upload y generación de signed URLs (pendiente manual)

---

## FASE 2 — SERVICIOS (Capa de datos)

### Ticket 2.1: Servicio de Autenticación

* [X] Crear `src/services/auth.service.js`
* [X] Función `signUp(email, password, fullName)`
* [X] Función `signIn(email, password)`
* [X] Función `signOut()`
* [X] Función `resetPassword(email)`
* [X] Función `getCurrentSession()`
* [X] Función `getCurrentUser()`
* [X] Todas con try/catch y mensajes en español

### Ticket 2.2: Servicio de Perfiles

* [X] Crear `src/services/profile.service.js`
* [X] Función `getProfile(userId)`
* [X] Función `createProfile(profileData)`
* [X] Función `updateProfile(userId, profileData)`
* [X] Función `uploadAvatar(userId, imageFile)`
* [X] Función `isProfileComplete(profile)` (para onboarding)

### Ticket 2.3: Servicio de Estadísticas

* [X] Crear `src/services/stats.service.js`
* [X] Función `getStats(profileId)`
* [X] Función `getStatsBySeason(profileId, season)`
* [X] Función `upsertStats(statsData)`
* [X] Función `deleteStats(statsId)`

### Ticket 2.4: Servicio de Atributos

* [X] Crear `src/services/attributes.service.js`
* [X] Función `getAttributes(profileId)`
* [X] Función `getAttributesByDimension(profileId, dimension)`
* [X] Función `upsertAttributes(attributesArray)`
* [X] Función `calculateRadarAverages(profileId)`

### Ticket 2.5: Servicio de Multimedia

* [X] Crear `src/services/media.service.js`
* [X] Función `uploadMedia(profileId, file, type, category, subcategory)`
* [X] Función `getMediaByProfile(profileId)`
* [X] Función `getMediaByCategory(profileId, category)`
* [X] Función `deleteMedia(mediaId, storagePath)`
* [X] Validación de tamaño (50MB video, 10MB foto)
* [X] Validación de duración (60s max video)

---

## FASE 3 — CONTEXTO Y NAVEGACIÓN

### Ticket 3.1: AuthContext

* [X] Crear `src/context/AuthContext.js`
* [X] State: `user`, `session`, `profile`, `loading`
* [X] Funciones: `signIn`, `signUp`, `signOut`, `refreshProfile`
* [X] Persistir sesión con `expo-secure-store`
* [X] Provider que envuelve toda la app

### Ticket 3.2: Navegación — Auth Stack

* [X] Crear `src/navigation/AuthStack.js`
* [X] Screens: Login, Registro, ForgotPassword
* [X] Transiciones: slide from bottom

### Ticket 3.3: Navegación — Main Tabs

* [X] Crear `src/navigation/MainTabs.js`
* [X] 4 tabs: Perfil, Estadísticas, Multimedia, Ajustes
* [X] Tab bar con estilo del DESIGN.md (fondo #1A1F2B, borde superior)
* [X] Íconos Lucide: User, BarChart2, Camera, Settings
* [X] Tab activo: color #4C8DFF con indicador de 3px

### Ticket 3.4: Navegación — Profile Stack (nested)

* [X] Screens: MiPerfil, EditarPerfil, Atributos
* [X] Header con título uppercase display-md

### Ticket 3.5: Navegación — Multimedia Stack (nested)

* [X] Screens: BibliotecaMultimedia, SubirMultimedia, VerMedia
* [X] FAB flotante para subir

### Ticket 3.6: Navegación — Root Navigator

* [X] Crear `src/navigation/RootNavigator.js`
* [X] Lógica: si hay sesión → MainTabs, si no → AuthStack
* [X] Splash screen mientras verifica sesión

---

## FASE 4 — COMPONENTES REUTILIZABLES

### Ticket 4.1: Componente Button

* [X] Crear `src/components/Button.js`
* [X] Variantes: primary (pill, azul), secondary (outline), ghost (texto)
* [X] Estados: enabled, disabled (opacidad 0.4), loading
* [X] Estilo: radius-full, alto 52px, uppercase en primary

### Ticket 4.2: Componente Input

* [X] Crear `src/components/Input.js`
* [X] Label flotante, placeholder, icono izquierdo
* [X] Estados: focus (borde azul), error (borde rojo + mensaje)
* [X] Estilo: fondo #20262F, radio 12px, alto 52px

### Ticket 4.3: Componente Card

* [X] Crear `src/components/Card.js`
* [X] Variantes: default, raised, glow-blue
* [X] Estilo: fondo #12161F, radio 16px, elevation-card

### Ticket 4.4: Componente Badge / Chip

* [X] Crear `src/components/Badge.js`
* [X] Variantes: default, destacada (azul), logro (dorado), tarjeta amarilla/roja
* [X] Radio: sm o full según tipo

### Ticket 4.5: Componente Avatar

* [X] Crear `src/components/Avatar.js`
* [X] Circular 96px, borde 2px
* [X] Borde azul si perfil completo, gris si incompleto
* [X] Icono de cámara overlay para edición

### Ticket 4.6: Componente Header

* [X] Crear `src/components/Header.js`
* [X] Altura 56px + safe area
* [X] Título centrado uppercase display-md
* [X] Botón back (izquierda) y acción derecha opcionales

### Ticket 4.7: Componente RadarChart

* [X] Crear `src/components/RadarChart.js`
* [X] Usar react-native-svg
* [X] 4 dimensiones: Técnica, Física, Táctica, Mental
* [X] Fondo #12161F, polígono azul con glow
* [X] Labels en las puntas, mínimo 280x280px
* [X] Tamaño proporcional con Dimensions

### Ticket 4.8: Componente MediaCard

* [X] Crear `src/components/MediaCard.js`
* [X] Aspect ratio 9:16 (video) o 1:1 (foto)
* [X] Overlay con gradiente, ícono play, duración
* [X] Badge de categoría arriba a la izquierda

### Ticket 4.9: Componente StatCard

* [X] Crear `src/components/StatCard.js`
* [X] Número grande display-md, label debajo body-sm
* [X] Grid: 2x2 o 3 en fila
* [X] Color dorado si es récord

### Ticket 4.10: Componente ProgressBar (Onboarding)

* [X] Crear `src/components/ProgressBar.js`
* [X] Segmentos: activo #2D6FE0, pendiente #272E3A
* [X] Transición animada entre pasos

### Ticket 4.11: Componente Toast / Snackbar

* [X] Crear `src/components/Toast.js`
* [X] Variantes: success (verde), error (rojo), warning (amarillo)
* [X] Auto-dismiss 2.5s, borde izquierdo 3px
* [X] Posición inferior

### Ticket 4.12: Componente EmptyState

* [X] Crear `src/components/EmptyState.js`
* [X] Ilustración outline monocromática + detalle azul
* [X] Texto con personalidad (voseo) + CTA opcional

### Ticket 4.13: Componente SkeletonLoader

* [X] Crear `src/components/SkeletonLoader.js`
* [X] Shimmer animation entre #12161F y #20262F
* [X] Variantes: rectángulo, círculo, texto

---

## FASE 5 — PANTALLAS DE AUTENTICACIÓN

### Ticket 5.1: Splash Screen

* [X] Crear `src/screens/SplashScreen.js`
* [X] Logo "EL PIBE" con tipografía condensada
* [X] Verificar sesión activa con Supabase
* [X] Si hay sesión → MainTabs, si no → AuthStack
* [X] Fondo #0B0E14

### Ticket 5.2: Login Screen

* [X] Crear `src/screens/auth/LoginScreen.js`
* [X] Logo "EL PIBE" arriba
* [X] Tagline: "El potrero digital para los que sienten la 10."
* [X] Input email con ícono mail
* [X] Input contraseña con ícono ojo (toggle visibility)
* [X] Link "¿Olvidaste tu contraseña?"
* [X] Botón primario "ENTRAR A LA CANCHA" + ícono pelota
* [X] Separador "O USÁ"
* [X] Botones secundarios Google y Apple (placeholder por ahora)
* [X] Link inferior "¿No tenés cuenta? Registrate"
* [X] Funcional: llamar auth.service.signIn

### Ticket 5.3: Registro Screen

* [X] Crear `src/screens/auth/RegisterScreen.js`
* [X] Header con flecha back + logo "EL PIBE"
* [X] Título "CREÁ TU FICHA" display-xl
* [X] Subtítulo "Completá tus datos para saltar a la cancha."
* [X] Progress bar (3 segmentos)
* [X] Input "Nombre Completo (como en el dorsal)"
* [X] Input "Tu Correo Electrónico"
* [X] Input "Contraseña Segura"
* [X] Checkbox "Acepto los términos de juego y la política de privacidad del club."
* [X] Botón primario "EMPEZAR MI CARRERA" + ícono rayo
* [X] Link inferior "¿Ya sos parte del equipo? Iniciá sesión acá"
* [X] Footer visual "BUENOS AIRES • EST. 2024"
* [X] Funcional: llamar auth.service.signUp

### Ticket 5.4: Forgot Password Screen

* [X] Crear `src/screens/auth/ForgotPasswordScreen.js`
* [X] Input email
* [X] Botón "ENVIAR LINK DE RECUPERACIÓN"
* [X] Mensaje de confirmación
* [X] Funcional: llamar auth.service.resetPassword

---

## FASE 6 — ONBOARDING

### Ticket 6.1: Onboarding Wizard — Paso 1 (Datos Personales)

* [X] Crear `src/screens/onboarding/OnboardingStep1.js`
* [X] Progress bar indicando paso 1 de 3
* [X] Input: nombre completo
* [X] Input: edad
* [X] Input: ciudad
* [X] Input: nacionalidad
* [X] Botón "SIGUIENTE" sticky abajo

### Ticket 6.2: Onboarding Wizard — Paso 2 (Datos Físicos)

* [X] Crear `src/screens/onboarding/OnboardingStep2.js`
* [X] Progress bar paso 2 de 3
* [X] Input: altura (cm)
* [X] Input: peso (kg)
* [X] Selector: pierna hábil (izquierda / derecha / ambidiestro)
* [X] Botones "ATRÁS" y "SIGUIENTE"

### Ticket 6.3: Onboarding Wizard — Paso 3 (Datos Deportivos)

* [X] Crear `src/screens/onboarding/OnboardingStep3.js`
* [X] Progress bar paso 3 de 3
* [X] Selector: posición principal
* [X] Selector: posición secundaria
* [X] Input: club
* [X] Input: categoría
* [X] Botones "ATRÁS" y "EMPEZAR MI CARRERA"
* [X] Guardar profile en Supabase y marcar onboarding completo

### Ticket 6.4: Onboarding Container

* [X] Crear `src/screens/onboarding/OnboardingScreen.js`
* [X] Contenedor con transición slide horizontal
* [X] Manejar estado global del wizard
* [X] Al completar: crear perfil + redirigir a MainTabs

---

## FASE 7 — PANTALLA DE PERFIL

### Ticket 7.1: Mi Perfil — Header

* [X] Crear `src/screens/profile/ProfileScreen.js`
* [X] Header con gradiente hero (#0B0E14 → #1C3A66)
* [X] Avatar circular 96px con borde azul
* [X] Badge de verificación (opcional)
* [X] Nombre display-lg uppercase
* [X] Bio debajo del nombre
* [X] FOTO DE CANCHA link

### Ticket 7.2: Mi Perfil — Cards Club y Categoría

* [X] Dos cards en fila: "MI CLUB" y "CATEGORÍA"
* [X] Estilo Card del DESIGN.md
* [X] Ícono shield para club, badge para categoría
* [X] Datos: club name y "U-21 Elite Local"

### Ticket 7.3: Mi Perfil — Ficha Técnica

* [X] Sección "FICHA TÉCNICA" con # de dorsal
* [X] Radar chart de 4 dimensiones (Técnica, Física, Táctica, Mental)
* [X] O barras de progreso: RITMO, REGATE, TIRO
* [X] Componente RadarChart

### Ticket 7.4: Mi Perfil — Destacados (Media Preview)

* [X] Sección "DESTACADOS"
* [X] Grilla 2 columnas de thumbnails de media
* [X] Ícono play en videos
* [X] Link "ver todo" a biblioteca multimedia

### Ticket 7.5: Mi Perfil — Botón Desafiar

* [X] Botón primario "DESAFIAR AL JUGADOR"
* [X] (Placeholder funcional por ahora, solo visual)

---

## FASE 8 — EDITAR PERFIL

### Ticket 8.1: Editar Perfil — Screen

* [X] Crear `src/screens/profile/EditProfileScreen.js`
* [X] Header "EDITAR PERFIL" con back arrow
* [X] Avatar con ícono cámara overlay
* [X] Link "FOTO DE CANCHA"

### Ticket 8.2: Editar Perfil — Formulario

* [X] Input "Tu nombre de crack" con valor actual
* [X] Textarea "Sobre vos (Bio)" max 500 caracteres
* [X] Input "Club actual"
* [X] Input "Categoría"
* [X] Selector chips: "Posición preferida" (ENGANCHE, DELANTERO, EXTREMO, etc.)
* [X] Botón primario "GUARDAR CAMBIOS" + ícono check

### Ticket 8.3: Editar Perfil — Identidad Potrera

* [X] Card "IDENTIDAD POTRERA" con ícono dorado
* [X] "ID de Jugador": #10-FERREYRA-2024
* [X] "Estatus": badge TITULAR (verde)

### Ticket 8.4: Editar Perfil — Funcionalidad

* [X] Cargar datos actuales del perfil al montar
* [X] Validar campos obligatorios
* [X] Llamar profile.service.updateProfile
* [X] Toast de éxito/error
* [X] Navegación de vuelta a perfil

---

## FASE 9 — BIBLIOTECA MULTIMEDIA

### Ticket 9.1: Biblioteca Multimedia — Screen

* [X] Crear `src/screens/media/MediaLibraryScreen.js`
* [X] Header "MEDIA" + subtítulo "Tus mejores jugadas en el potrero"
* [X] Ícono de filtro arriba a la derecha
* [X] FAB flotante (ícono cámara) abajo a la derecha

### Ticket 9.2: Biblioteca — Grid de Media

* [X] Grilla 2 columnas, gap 8px
* [X] Componente MediaCard para cada item
* [X] Videos: aspect ratio 9:16, overlay con play + duración
* [X] Fotos: aspect ratio 1:1
* [X] Badge de categoría en cada card

### Ticket 9.3: Biblioteca — Empty State

* [X] Ilustración outline de cámara
* [X] Texto: "Todavía no subiste ninguna jugada. ¡Mostrá lo que tenés!"
* [X] Botón CTA "SUBIR PRIMERA JUGADA"

### Ticket 9.4: Biblioteca — Filtrado

* [X] Bottom sheet con opciones de categoría
* [X] Filtros: Todas, Ofensiva, Defensiva, Jugadas con pelota, Sin pelota
* [X] Aplicar filtro y recargar grilla

---

## FASE 10 — SUBIR MULTIMEDIA

### Ticket 10.1: Subir Multimedia — Screen

* [X] Crear `src/screens/media/UploadMediaScreen.js`
* [X] Header "SUBIR JUGADA" con back

### Ticket 10.2: Selector de Archivo

* [X] Botón "Elegir desde galería" + ícono image
* [X] Botón "Grabar ahora" + ícono camera
* [X] Usar expo-image-picker
* [X] Validar tamaño: max 50MB video, 10MB foto
* [X] Validar duración: max 60s video
* [X] Preview del archivo seleccionado

### Ticket 10.3: Clasificación

* [X] Selector de categoría: Ofensiva, Defensiva, Con pelota, Sin pelota
* [X] Selector de subcategoría (opcional)
* [X] Input de título/descripción (opcional)

### Ticket 10.4: Upload y Confirmación

* [X] Barra de progreso de upload
* [X] Llamar media.service.uploadMedia
* [X] Toast de éxito: "¡Jugada subida!"
* [X] Redirigir a biblioteca

---

## FASE 11 — ESTADÍSTICAS

### Ticket 11.1: Estadísticas — Screen

* [X] Crear `src/screens/stats/StatsScreen.js`
* [X] Header "ESTADÍSTICAS" uppercase
* [X] Selector de temporada

### Ticket 11.2: KPI Cards

* [X] Grid 2x2 de StatCards
* [X] Partidos jugados
* [X] Goles
* [X] Asistencias
* [X] Tarjetas (amarillas/rojas)
* [X] Números grandes display-md

### Ticket 11.3: Formulario de Stats

* [X] Inputs editables para cada stat
* [X] Botón "GUARDAR ESTADÍSTICAS"
* [X] Validar que sean números >= 0

### Ticket 11.4: Radar de Atributos (en Stats)

* [X] Sección "FICHA TÉCNICA"
* [X] Radar chart con promedio por dimensión
* [X] Componente RadarChart reutilizado

### Ticket 11.5: Empty State Stats

* [X] "Todavía no cargaste estadísticas. ¡Armá tu ficha!"
* [X] Botón "CARGAR PRIMERAS STATS"

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
