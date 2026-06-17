import { supabase } from './supabaseClient';

/**
 * Obtener todas las estadísticas de un jugador.
 */
export const getStats = async (profileId) => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('profile_id', profileId)
      .order('season', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar las estadísticas' };
  }
};

/**
 * Obtener estadísticas de una temporada específica.
 */
export const getStatsBySeason = async (profileId, season) => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('profile_id', profileId)
      .eq('season', season)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se encontraron estadísticas para esa temporada' };
  }
};

/**
 * Crear o actualizar estadísticas (upsert).
 * Si ya existe una stats para esa temporada, la actualiza.
 */
export const upsertStats = async (statsData) => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .upsert(statsData, {
        onConflict: 'profile_id,season',
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar las estadísticas' };
  }
};

/**
 * Eliminar un registro de estadísticas por su ID.
 */
export const deleteStats = async (statsId) => {
  try {
    const { error } = await supabase
      .from('player_stats')
      .delete()
      .eq('id', statsId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: 'No se pudieron eliminar las estadísticas' };
  }
};
