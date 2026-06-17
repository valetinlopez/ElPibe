# Skill: Data Model

> Modelo de datos, tablas, relaciones y migraciones SQL para ElPibe.

---

## Cuando usar este skill

- Crear o modificar tablas en Supabase
- Ejecutar migraciones SQL
- Entender relaciones entre tablas
- Configurar RLS

---

## Diagrama de Relaciones

```
auth.users (Supabase Auth)
    │
    │ 1:1
    ▼
profiles
    │
    │ 1:N
    ├── player_stats
    │
    │ 1:N
    ├── player_attributes
    │
    │ 1:N
    └── media_items
```

---

## SQL Completo de Tablas

```sql
-- =============================================
-- ELPIBE - Modelo de Datos
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Tabla: profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  age INT2,
  city TEXT,
  nationality TEXT,
  height_cm INT2,
  weight_kg INT2,
  foot TEXT CHECK (foot IN ('izquierda', 'derecha', 'ambidiestro')),
  position_main TEXT,
  position_secondary TEXT,
  club TEXT,
  category TEXT,
  bio TEXT CHECK (length(bio) <= 500),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: player_stats
CREATE TABLE player_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  matches INT2 DEFAULT 0 CHECK (matches >= 0),
  minutes INT4 DEFAULT 0 CHECK (minutes >= 0),
  goals INT2 DEFAULT 0 CHECK (goals >= 0),
  assists INT2 DEFAULT 0 CHECK (assists >= 0),
  yellow_cards INT2 DEFAULT 0 CHECK (yellow_cards >= 0),
  red_cards INT2 DEFAULT 0 CHECK (red_cards >= 0),
  UNIQUE(profile_id, season)
);

-- Tabla: player_attributes
CREATE TABLE player_attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('technical', 'physical', 'tactical', 'mental')),
  attribute_name TEXT NOT NULL,
  score INT2 NOT NULL CHECK (score >= 1 AND score <= 10),
  UNIQUE(profile_id, dimension, attribute_name)
);

-- Tabla: media_items
CREATE TABLE media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video', 'photo')),
  category TEXT,
  subcategory TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDICES (para performance)
-- =============================================

CREATE INDEX idx_player_stats_profile ON player_stats(profile_id);
CREATE INDEX idx_player_stats_season ON player_stats(profile_id, season);
CREATE INDEX idx_player_attributes_profile ON player_attributes(profile_id);
CREATE INDEX idx_player_attributes_dimension ON player_attributes(profile_id, dimension);
CREATE INDEX idx_media_items_profile ON media_items(profile_id);
CREATE INDEX idx_media_items_category ON media_items(profile_id, category);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Politicas para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Politicas para player_stats
CREATE POLICY "Users can view own stats"
  ON player_stats FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own stats"
  ON player_stats FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own stats"
  ON player_stats FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own stats"
  ON player_stats FOR DELETE
  USING (auth.uid() = profile_id);

-- Politicas para player_attributes
CREATE POLICY "Users can view own attributes"
  ON player_attributes FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can upsert own attributes"
  ON player_attributes FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own attributes"
  ON player_attributes FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own attributes"
  ON player_attributes FOR DELETE
  USING (auth.uid() = profile_id);

-- Politicas para media_items
CREATE POLICY "Users can view own media"
  ON media_items FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own media"
  ON media_items FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own media"
  ON media_items FOR DELETE
  USING (auth.uid() = profile_id);
```

---

## Storage Buckets

```sql
-- Crear buckets en Supabase Dashboard > Storage

-- Bucket: avatars
-- Nombre: avatars
-- Privado: SI
-- Tamaño max: 5MB
-- Tipos permitidos: image/jpeg, image/png, image/webp

-- Bucket: media
-- Nombre: media
-- Privado: SI
-- Tamaño max: 50MB
-- Tipos permitidos: video/mp4, image/jpeg, image/png
```

---

## Politicas de Storage

```sql
-- Bucket avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '-'))[2]
  );

CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '-'))[2]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '-'))[2]
  );

-- Bucket media
CREATE POLICY "Users can upload own media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can view own media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );
```

---

## Atributos por Dimensión

### Technical (Técnica)
- Regate
- Control balón
- Pase corto
- Pase largo
- Tiro
- Visión de juego

### Physical (Física)
- Velocidad
- Resistencia
- Fuerza
- Salto
- Agilidad

### Tactical (Táctica)
- Posicionamiento
- Juego aéreo
- Marcaje
- Lectura del juego

### Mental (Mental)
- Liderazgo
- Concentración
- Creatividad
- Determinación

---

## Queries Comunes

```js
// Obtener perfil completo
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Obtener stats de una temporada
const { data } = await supabase
  .from('player_stats')
  .select('*')
  .eq('profile_id', profileId)
  .eq('season', '2026')
  .single();

// Obtener atributos por dimensión
const { data } = await supabase
  .from('player_attributes')
  .select('*')
  .eq('profile_id', profileId)
  .eq('dimension', 'technical');

// Obtener media por categoría
const { data } = await supabase
  .from('media_items')
  .select('*')
  .eq('profile_id', profileId)
  .eq('category', 'ofensiva')
  .order('created_at', { ascending: false });

// Upsert stats (insertar o actualizar)
const { data } = await supabase
  .from('player_stats')
  .upsert({
    profile_id: profileId,
    season: '2026',
    matches: 10,
    goals: 5,
    assists: 3,
  }, { onConflict: 'profile_id,season' })
  .select()
  .single();

// Calcular promedios de radar
const calculateRadarAverages = (attributes) => {
  const dimensions = ['technical', 'physical', 'tactical', 'mental'];
  return dimensions.reduce((acc, dim) => {
    const dimAttrs = attributes.filter(a => a.dimension === dim);
    acc[dim] = dimAttrs.length
      ? dimAttrs.reduce((sum, a) => sum + a.score, 0) / dimAttrs.length
      : 0;
    return acc;
  }, {});
};
```

---

## Migraciones Futuras

Si se necesitan cambios en el esquema, crear un archivo de migración:

```sql
-- migrations/001_add_field.sql
ALTER TABLE profiles ADD COLUMN new_field TEXT;
```

---

*Skill Data Model v1.0 — ElPibe*
