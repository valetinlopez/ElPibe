-- =============================================
-- ELPIBE - Storage Buckets y Políticas
-- Ejecutar DESPUÉS de 01_tables.sql y 02_rls_policies.sql
-- =============================================

-- =============================================
-- NOTA: Los buckets se crean desde el Dashboard
-- de Supabase → Storage → New Bucket
-- =============================================

-- Bucket 1: avatars
-- Nombre: avatars
-- Privado: SÍ (Private)
-- Tamaño máximo: 5 MB
-- Tipos permitidos: image/jpeg, image/png, image/webp

-- Bucket 2: media
-- Nombre: media
-- Privado: SÍ (Private)
-- Tamaño máximo: 50 MB
-- Tipos permitidos: video/mp4, image/jpeg, image/png, image/webp

-- =============================================
-- Políticas de Storage para bucket 'avatars'
-- =============================================

-- Un usuario puede SUBIR su propio avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
  );

-- Un usuario puede VER su propio avatar
CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
  );

-- Un usuario puede ELIMINAR su propio avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (string_to_array(name, '/'))[2]
  );

-- =============================================
-- Políticas de Storage para bucket 'media'
-- =============================================

-- Un usuario puede SUBIR su propio contenido multimedia
CREATE POLICY "Users can upload own media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Un usuario puede VER su propio contenido multimedia
CREATE POLICY "Users can view own media files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Un usuario puede ELIMINAR su propio contenido multimedia
CREATE POLICY "Users can delete own media files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.uid()::text = (string_to_array(name, '/'))[1]
  );
