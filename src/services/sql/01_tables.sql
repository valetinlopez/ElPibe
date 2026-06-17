-- =============================================
-- ELPIBE - Creación de Tablas
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Tabla: profiles
-- Almacena el perfil deportivo de cada jugador
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
-- Estadísticas del jugador por temporada
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
-- Atributos del jugador por dimensión (1-10)
CREATE TABLE player_attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('technical', 'physical', 'tactical', 'mental')),
  attribute_name TEXT NOT NULL,
  score INT2 NOT NULL CHECK (score >= 1 AND score <= 10),
  UNIQUE(profile_id, dimension, attribute_name)
);

-- Tabla: media_items
-- Videos y fotos del jugador
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
-- Índices para performance
-- =============================================

CREATE INDEX idx_player_stats_profile ON player_stats(profile_id);
CREATE INDEX idx_player_stats_season ON player_stats(profile_id, season);
CREATE INDEX idx_player_attributes_profile ON player_attributes(profile_id);
CREATE INDEX idx_player_attributes_dimension ON player_attributes(profile_id, dimension);
CREATE INDEX idx_media_items_profile ON media_items(profile_id);
CREATE INDEX idx_media_items_category ON media_items(profile_id, category);
