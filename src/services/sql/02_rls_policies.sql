-- =============================================
-- ELPIBE - Row Level Security (RLS) Policies
-- Ejecutar DESPUÉS de 01_tables.sql
-- =============================================

-- =============================================
-- Habilitar RLS en todas las tablas
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Políticas para profiles
-- =============================================

-- Un usuario puede VER su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Un usuario puede ACTUALIZAR su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Un usuario puede INSERTAR su propio perfil (solo uno)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- Políticas para player_stats
-- =============================================

-- Un usuario puede VER sus propias estadísticas
CREATE POLICY "Users can view own stats"
  ON player_stats FOR SELECT
  USING (auth.uid() = profile_id);

-- Un usuario puede INSERTAR sus propias estadísticas
CREATE POLICY "Users can insert own stats"
  ON player_stats FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Un usuario puede ACTUALIZAR sus propias estadísticas
CREATE POLICY "Users can update own stats"
  ON player_stats FOR UPDATE
  USING (auth.uid() = profile_id);

-- Un usuario puede ELIMINAR sus propias estadísticas
CREATE POLICY "Users can delete own stats"
  ON player_stats FOR DELETE
  USING (auth.uid() = profile_id);

-- =============================================
-- Políticas para player_attributes
-- =============================================

-- Un usuario puede VER sus propios atributos
CREATE POLICY "Users can view own attributes"
  ON player_attributes FOR SELECT
  USING (auth.uid() = profile_id);

-- Un usuario puede INSERTAR sus propios atributos
CREATE POLICY "Users can insert own attributes"
  ON player_attributes FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Un usuario puede ACTUALIZAR sus propios atributos
CREATE POLICY "Users can update own attributes"
  ON player_attributes FOR UPDATE
  USING (auth.uid() = profile_id);

-- Un usuario puede ELIMINAR sus propios atributos
CREATE POLICY "Users can delete own attributes"
  ON player_attributes FOR DELETE
  USING (auth.uid() = profile_id);

-- =============================================
-- Políticas para media_items
-- =============================================

-- Un usuario puede VER su propio contenido multimedia
CREATE POLICY "Users can view own media"
  ON media_items FOR SELECT
  USING (auth.uid() = profile_id);

-- Un usuario puede INSERTAR su propio contenido multimedia
CREATE POLICY "Users can insert own media"
  ON media_items FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Un usuario puede ELIMINAR su propio contenido multimedia
CREATE POLICY "Users can delete own media"
  ON media_items FOR DELETE
  USING (auth.uid() = profile_id);
