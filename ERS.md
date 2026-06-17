# ELPIBE

### App de Perfiles de Futbolistas Amateurs — Modelo Simplificado

**ESPECIFICACION DE REQUISITOS DE SOFTWARE (ERS)**
Version 2.0 — Modelo Reducido (Serverless / BaaS)

---

| Campo             | Descripcion                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| Proyecto          | ElPibe                                                                    |
| Tipo de documento | ERS + System Prompt para IA                                               |
| Version           | 2.0 — Sin backend propio                                                 |
| Fecha             | 16 de junio de 2026                                                       |
| Stack tecnologico | React Native + Expo (JavaScript) · Supabase (Auth + Postgres + Storage)  |
| Alcance           | Registro, perfil de jugador, multimedia, estadisticas y atributos basicos |

---

## 0. Por que este cambio de enfoque

La version original de ElPibe (entonces Scout AI) proponia un backend propio en FastAPI con base PostgreSQL administrada manualmente. Este modelo reducido reemplaza esa capa por Supabase, un servicio Backend-as-a-Service (BaaS) que entrega autenticacion, base de datos relacional y almacenamiento de archivos listos para usar, consumidos directamente desde la app movil mediante un SDK de JavaScript.

Ventajas para este alcance de entrega:

* Cero codigo de servidor: no hay que programar, desplegar ni mantener una API.
* Postgres real: se conserva el mismo motor relacional usado en el proyecto original, solo que administrado por Supabase.
* Seguridad delegada: Supabase Auth maneja JWT, hashing de contrasenas y sesiones automaticamente.
* Row Level Security (RLS): las reglas de quien puede ver o editar que dato se definen como politicas SQL sobre las tablas, no como middleware propio.
* Tiempo de desarrollo reducido: todo el esfuerzo se concentra en el frontend React Native.

---

## 1. Instruccion de Sistema — Prompt para IA

> Este bloque puede copiarse directo como system prompt en Claude, Cursor, Copilot, Codex o cualquier asistente de codigo para trabajar sobre este proyecto.

```
SYSTEM PROMPT — ELPIBE (MODELO SIMPLIFICADO)

You are the AI assistant for ElPibe, a simplified mobile-only app for
amateur football players. There is NO custom backend: all data
persistence, auth and file storage is handled by Supabase, consumed
directly from the React Native client via the official JS SDK.

== PROJECT SCOPE ==
Players can register, log in, create a sports profile, upload
videos/photos, write a description, and register basic stats and
attributes. There are no scouts, no search, no favorites in this
version — single role: PLAYER.

== TECH STACK ==
Frontend: React Native + Expo (JavaScript, NOT TypeScript) + NativeWind / Tailwind
Backend-as-a-Service: Supabase (PostgreSQL + Auth + Storage)
Client SDK: @supabase/supabase-js
Auth: Supabase Auth (email + password), session via JWT handled internally by the SDK
Storage: Supabase Storage buckets for video/photo (private, served via signed URLs)
Navigation: React Navigation (stack + tabs)
State: React Context or Zustand for auth/session state

== DATA MODEL (Postgres tables) ==
profiles: id (uuid, fk auth.users), full_name, age, city, nationality,
  height, weight, foot, position_main, position_secondary, club,
  category, bio, photo_url, created_at
player_stats: id, profile_id (fk), season, matches, minutes, goals,
  assists, yellow_cards, red_cards
player_attributes: id, profile_id (fk), dimension
  (technical/physical/tactical/mental), attribute_name, score (1-10)
media_items: id, profile_id (fk), type (video/photo), category,
  subcategory, storage_path, created_at

== SECURITY RULES ==
Enable Row Level Security (RLS) on every table.
A user can SELECT/UPDATE/INSERT only rows where profile_id = auth.uid() (own data).
Profiles are visible only to authenticated users (no public/anonymous read access).
Storage buckets are private; access only via signed URLs generated server-side by Supabase.

== BEHAVIOR RULES ==
- Never suggest writing a custom Express/FastAPI backend; all logic
  goes through the Supabase client SDK or Postgres RLS policies.
- Use plain JavaScript (no TypeScript types) consistent with the
  project's .js/.jsx files.
- Wrap all Supabase calls in try/catch and surface user-friendly error messages.
- Keep Supabase queries inside a dedicated /services or /lib/supabase
  folder, never inline in screen components.
- Validate file size/duration client-side before uploading video to Storage.
- Comment complex logic in Spanish when relevant to match the rest of
  the codebase.
```

---

## 2. Descripcion General

### 2.1 Proposito

Definir los requisitos de una version reducida de ElPibe: una aplicacion movil donde futbolistas amateurs se registran, crean un perfil deportivo, suben contenido multimedia y registran estadisticas y atributos basicos. No incluye backend propio ni roles de scout/entrenador en esta etapa.

### 2.2 Alcance

Incluido en esta version:

* Registro e inicio de sesion (Supabase Auth).
* Perfil deportivo del jugador (datos personales, fisicos y deportivos).
* Carga de foto de perfil, videos y fotos de jugadas (Supabase Storage).
* Descripcion personal / biografia del jugador.
* Estadisticas basicas (partidos, goles, asistencias, tarjetas).
* Radar de atributos (tecnica, fisica, tactica, mental).

Explicitamente fuera de alcance en esta version:

* Roles de scout, entrenador o club.
* Buscador de talento y sistema de favoritos.
* Analisis de video con IA (Scout Vision AI).
* Chat, geolocalizacion, rankings y marketplace.

### 2.3 Usuario del Sistema

| Rol                | Descripcion                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PLAYER (unico rol) | Se registra, gestiona su propio perfil deportivo, sube su propia multimedia y administra sus propias estadisticas y atributos. No puede ver ni editar datos de otros usuarios en esta version. |

---

## 3. Arquitectura Tecnica

### 3.1 Diagrama de Flujo (conceptual)

> App React Native (Expo, JS) → @supabase/supabase-js → Supabase Platform [ Auth | Postgres + RLS | Storage ]. No existe servidor intermedio propio: el cliente movil habla directo con Supabase.

### 3.2 Stack Tecnologico

| Capa                    | Tecnologia                                               |
| ----------------------- | -------------------------------------------------------- |
| Frontend movil          | React Native + Expo (JavaScript)                         |
| Estilos                 | NativeWind (Tailwind para RN)                            |
| Navegacion              | React Navigation (Stack + Bottom Tabs)                   |
| Backend-as-a-Service    | Supabase (Postgres 15 + Auth + Storage)                  |
| Cliente de datos        | @supabase/supabase-js                                    |
| Autenticacion           | Supabase Auth — email + password, sesion JWT automatica |
| Almacenamiento de media | Supabase Storage (buckets privados + signed URLs)        |
| Manejo de estado        | Context API o Zustand para sesion de usuario             |

### 3.3 Por que Supabase Storage y no Cloudinary

Para este alcance se recomienda usar Supabase Storage en lugar de un servicio externo como Cloudinary:

* Un solo proveedor para Auth, base de datos y archivos simplifica la configuracion y las variables de entorno.
* Los buckets de Storage pueden protegerse con las mismas politicas RLS que el resto de las tablas.
* Para el volumen y duracion de video esperados en un MVP academico, no se necesita transcodificacion ni streaming adaptativo.

Limitacion a tener en cuenta: Supabase Storage no comprime ni optimiza video automaticamente, por lo que se debe limitar el tamano y duracion de los archivos subidos (ver Requisitos No Funcionales).

---

## 4. Modelo de Datos (Supabase / PostgreSQL)

### 4.1 Tabla: profiles

| Campo              | Tipo / Detalle                                   |
| ------------------ | ------------------------------------------------ |
| id                 | uuid — referencia a auth.users(id), primary key |
| full_name          | text                                             |
| age                | int2                                             |
| city               | text                                             |
| nationality        | text                                             |
| height_cm          | int2                                             |
| weight_kg          | int2                                             |
| foot               | text — 'izquierda' / 'derecha' / 'ambidiestro'  |
| position_main      | text                                             |
| position_secondary | text                                             |
| club               | text                                             |
| category           | text                                             |
| bio                | text                                             |
| photo_url          | text — path en Storage                          |
| created_at         | timestamptz default now()                        |

### 4.2 Tabla: player_stats

| Campo        | Tipo / Detalle                               |
| ------------ | -------------------------------------------- |
| id           | uuid, primary key, default gen_random_uuid() |
| profile_id   | uuid — fk a profiles(id)                    |
| season       | text — ej. '2026'                           |
| matches      | int2 default 0                               |
| minutes      | int4 default 0                               |
| goals        | int2 default 0                               |
| assists      | int2 default 0                               |
| yellow_cards | int2 default 0                               |
| red_cards    | int2 default 0                               |

### 4.3 Tabla: player_attributes

| Campo          | Tipo / Detalle            |
| -------------- | ------------------------- |
| id             | uuid, primary key         |
| profile_id     | uuid — fk a profiles(id) |
| dimension      | text — 'technical'       |
| attribute_name | text                      |
| score          | int2 — rango 1 a 10      |

### 4.4 Tabla: media_items

| Campo        | Tipo / Detalle                                     |
| ------------ | -------------------------------------------------- |
| id           | uuid, primary key                                  |
| profile_id   | uuid — fk a profiles(id)                          |
| type         | text — 'video'                                    |
| category     | text — fase ofensiva / defensiva / etc.           |
| subcategory  | text                                               |
| storage_path | text — ruta dentro del bucket de Supabase Storage |
| created_at   | timestamptz default now()                          |

---

## 5. Seguridad — Row Level Security

Al no existir un backend propio que valide permisos, toda la seguridad de acceso a datos recae en politicas RLS de Postgres, activadas en Supabase.

### 5.1 Politica General

> Regla base para las 4 tablas: un usuario solo puede leer, insertar, actualizar o borrar filas donde profile_id (o id, en la tabla profiles) sea igual a auth.uid().

### 5.2 Ejemplo de Politica SQL

```sql
alter table profiles enable row level security;

create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);
```

---

## 6. Requisitos Funcionales

### RF-01: Autenticacion

| ID      | Descripcion                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| RF-01.1 | El sistema debe permitir registrar un usuario con email y contrasena usando Supabase Auth. |
| RF-01.2 | El sistema debe permitir iniciar sesion con email y contrasena.                            |
| RF-01.3 | El sistema debe permitir cerrar sesion y limpiar el estado local.                          |
| RF-01.4 | El sistema debe permitir recuperar contrasena via email (flujo nativo de Supabase Auth).   |
| RF-01.5 | La app debe persistir la sesion entre cierres (token guardado de forma segura).            |

### RF-02: Perfil del Jugador

| ID      | Descripcion                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| RF-02.1 | Tras el primer registro, el usuario debe completar un formulario inicial de perfil (onboarding).                   |
| RF-02.2 | El jugador debe poder editar en cualquier momento: nombre, edad, ciudad, nacionalidad, altura, peso, pierna habil. |
| RF-02.3 | El jugador debe poder editar posicion principal, posicion secundaria, club y categoria.                            |
| RF-02.4 | El jugador debe poder escribir y editar una descripcion personal (bio) de hasta 500 caracteres.                    |
| RF-02.5 | El jugador debe poder subir o cambiar su foto de perfil.                                                           |

### RF-03: Multimedia

| ID      | Descripcion                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------ |
| RF-03.1 | El jugador debe poder subir videos y fotos desde la galeria del dispositivo o grabarlos en el momento. |
| RF-03.2 | Cada archivo subido debe poder clasificarse por categoria (ofensiva, defensiva, etc.).                 |
| RF-03.3 | El jugador debe poder ver su propia biblioteca multimedia organizada por categoria.                    |
| RF-03.4 | El jugador debe poder eliminar contenido multimedia propio.                                            |

### RF-04: Estadisticas y Atributos

| ID      | Descripcion                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| RF-04.1 | El jugador debe poder registrar y editar estadisticas por temporada (partidos, goles, asistencias, tarjetas). |
| RF-04.2 | El jugador debe poder asignar un puntaje (1-10) a cada atributo dentro de las 4 dimensiones.                  |
| RF-04.3 | El sistema debe mostrar un grafico de radar con el promedio de cada dimension.                                |

---

## 7. Requisitos No Funcionales

| Categoria          | Requisito                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Rendimiento        | Las pantallas de perfil deben cargar en menos de 2 segundos con conexion 4G.                                       |
| Limite de archivos | Videos de hasta 60 segundos y 50 MB; fotos de hasta 10 MB.                                                         |
| Seguridad          | Todas las tablas deben tener RLS habilitado antes de pasar a produccion.                                           |
| Compatibilidad     | La app debe correr en Expo Go y como build standalone en iOS 15+ / Android 10+.                                    |
| Usabilidad         | El formulario de perfil debe dividirse en pasos (wizard) para no abrumar al usuario.                               |
| Disponibilidad     | Dependiente del SLA de Supabase (plan gratuito: apto para desarrollo y demo academica).                            |
| Mantenibilidad     | Toda llamada a Supabase debe centralizarse en una capa de servicios, nunca directo en los componentes de pantalla. |

---

## 8. Pantallas de la Aplicacion (MVP)

| Pantalla              | Descripcion                                                                            |
| --------------------- | -------------------------------------------------------------------------------------- |
| Splash / Carga        | Verifica sesion activa y redirige a Login o Home.                                      |
| Login                 | Formulario de email y contrasena, link a registro y recuperacion.                      |
| Registro              | Alta de cuenta nueva via Supabase Auth.                                                |
| Onboarding de Perfil  | Wizard de pasos para completar datos personales, fisicos y deportivos por primera vez. |
| Mi Perfil             | Vista principal con foto, datos, bio y radar de atributos.                             |
| Editar Perfil         | Formulario para modificar cualquier dato del perfil.                                   |
| Biblioteca Multimedia | Grilla de videos/fotos propios organizados por categoria.                              |
| Subir Multimedia      | Selector de archivo + categoria + confirmacion de subida.                              |
| Estadisticas          | Formulario y listado de estadisticas por temporada.                                    |
| Atributos             | Sliders o inputs para puntuar cada atributo, con preview del radar.                    |

---

## 9. Estructura de Carpetas Sugerida

```
/src
  /screens          -> Login, Register, Profile, MediaLibrary, Stats, Attributes
  /components       -> componentes reutilizables (RadarChart, MediaCard, etc.)
  /navigation       -> Stack y Tabs de React Navigation
  /services
    supabaseClient.js  -> inicializacion del cliente Supabase
    auth.service.js    -> login, registro, logout, recuperar password
    profile.service.js -> CRUD de profiles
    stats.service.js   -> CRUD de player_stats
    attributes.service.js -> CRUD de player_attributes
    media.service.js   -> upload/list/delete en Storage + media_items
  /context          -> AuthContext (sesion global)
  /utils            -> validaciones, formato de fechas, etc.
App.js
```

---

## 10. Criterios de Aceptacion

| Modulo        | Criterio de Aceptacion                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticacion | Un usuario puede registrarse, cerrar la app, volver a abrirla y seguir logueado sin reingresar credenciales.                            |
| Perfil        | Un jugador puede completar el onboarding y luego editar cualquier campo, viendo los cambios reflejados al instante.                     |
| Multimedia    | Un jugador puede subir un video, verlo clasificado en su categoria, y eliminarlo correctamente.                                         |
| Estadisticas  | Un jugador puede registrar stats de una temporada y verlas listadas correctamente.                                                      |
| Atributos     | El radar se redibuja automaticamente al cambiar cualquier puntaje de atributo.                                                          |
| Seguridad     | Un usuario autenticado no puede leer ni modificar el perfil, stats o multimedia de otro usuario (verificado con dos cuentas de prueba). |

---

*ElPibe — Modelo Simplificado v2.0*
*React Native + Expo (JS) + Supabase — Documento academico + System Prompt para IA*
