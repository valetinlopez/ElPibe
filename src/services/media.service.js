import { supabase } from './supabaseClient';
import { validateFileSize } from '../utils/validations';

/**
 * Subir un archivo multimedia (video o foto) a Supabase Storage
 * y registrar su metadata en la tabla media_items.
 */
export const uploadMedia = async (profileId, file, type, category, subcategory = null) => {
  try {
    const validacionTamano = validateFileSize(file.fileSize || 0, type);
    if (validacionTamano) {
      return { data: null, error: validacionTamano };
    }

    const fileExt = file.uri.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${profileId}/${type}_${timestamp}.${fileExt}`;
    const filePath = `media/${fileName}`;

    const arrayBuffer = await fetch(file.uri).then((res) => res.arrayBuffer());

    const contentType = type === 'video' ? `video/${fileExt}` : `image/${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, arrayBuffer, { contentType });

    if (uploadError) throw uploadError;

    const mediaData = {
      profile_id: profileId,
      type,
      category,
      subcategory,
      storage_path: filePath,
    };

    const { data: dbData, error: dbError } = await supabase
      .from('media_items')
      .insert(mediaData)
      .select()
      .single();

    if (dbError) throw dbError;

    return { data: dbData, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo subir el archivo multimedia' };
  }
};

/**
 * Obtener todos los archivos multimedia de un jugador.
 */
export const getMediaByProfile = async (profileId) => {
  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo cargar la biblioteca multimedia' };
  }
};

/**
 * Obtener archivos multimedia filtrados por categoría.
 */
export const getMediaByCategory = async (profileId, category) => {
  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('profile_id', profileId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los archivos de esa categoría' };
  }
};

/**
 * Eliminar un archivo multimedia: primero de Storage, luego de la tabla.
 */
export const deleteMedia = async (mediaId, storagePath) => {
  try {
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([storagePath]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('media_items')
      .delete()
      .eq('id', mediaId);

    if (dbError) throw dbError;

    return { error: null };
  } catch (error) {
    return { error: 'No se pudo eliminar el archivo multimedia' };
  }
};

/**
 * Obtener la URL pública de un archivo en Storage.
 */
export const getMediaUrl = (storagePath) => {
  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(storagePath);

  return data?.publicUrl || null;
};
