import { supabase } from './supabaseClient';

/**
 * Obtener el perfil de un usuario por su ID.
 */
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo cargar el perfil' };
  }
};

/**
 * Crear un nuevo perfil de jugador.
 */
export const createProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo crear el perfil' };
  }
};

/**
 * Actualizar el perfil de un usuario.
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar los cambios' };
  }
};

/**
 * Subir avatar del usuario a Supabase Storage.
 * Retorna la URL firmada de la imagen.
 */
export const uploadAvatar = async (userId, imageFile) => {
  try {
    const fileExt = imageFile.uri.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const arrayBuffer = await fetch(imageFile.uri).then((res) => res.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ photo_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { data: { photo_url: publicUrl }, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo subir la foto' };
  }
};

/**
 * Verificar si el perfil del usuario está completo.
 * Campos obligatorios: full_name, age, city, position_main.
 */
export const isProfileComplete = (profile) => {
  if (!profile) return false;

  const requiredFields = ['full_name', 'age', 'city', 'position_main'];
  return requiredFields.every(
    (field) => profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
  );
};
