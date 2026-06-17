@AGENTS.md

# CLAUDE.md — ElPibe

## Skills Disponibles

Carga un skill con `/skill <nombre>` cuando necesites trabajar en un area especifica:

- **supabase**: Configuracion de Supabase, servicios, RLS, Storage, autenticacion
- **ui-components**: Design system, componentes reutilizables, colores, tipografia
- **navigation**: Estructura de navegacion, stacks, tabs, flows de pantalla
- **screens**: Implementacion de cada pantalla del MVP
- **data-model**: Modelo de datos, tablas, relaciones, migraciones SQL

## Comandos Utiles

```bash
# Iniciar Expo
npm start

# Instalar dependencias
npx expo install <package>

# Ejecutar en dispositivo
npm run android
npm run ios

# Lint (si se configura)
npm run lint
```

## Orden de Ejecucion

Segui el plan de ejecucion en `PLAN_EJECUCION.md` (si existe) o segui las fases:

1. Fase 0: Proyecto y Configuracion
2. Fase 1: Supabase y Seguridad
3. Fase 2: Servicios
4. Fase 3: Contexto y Navegacion
5. Fase 4: Componentes
6. Fase 5-13: Pantallas
7. Fase 14: Utilidades
8. Fase 15: Testing
9. Fase 16: SEO/ASO
