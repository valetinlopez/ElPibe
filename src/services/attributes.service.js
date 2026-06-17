import { supabase } from './supabaseClient';

/**
 * Obtener todos los atributos de un jugador.
 */
export const getAttributes = async (profileId) => {
  try {
    const { data, error } = await supabase
      .from('player_attributes')
      .select('*')
      .eq('profile_id', profileId)
      .order('dimension');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los atributos' };
  }
};

/**
 * Obtener atributos de una dimensión específica.
 * dimension: 'technical' | 'physical' | 'tactical' | 'mental'
 */
export const getAttributesByDimension = async (profileId, dimension) => {
  try {
    const { data, error } = await supabase
      .from('player_attributes')
      .select('*')
      .eq('profile_id', profileId)
      .eq('dimension', dimension)
      .order('attribute_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los atributos de esa dimensión' };
  }
};

/**
 * Crear o actualizar múltiples atributos (batch upsert).
 * Recibe un array de objetos: [{ profile_id, dimension, attribute_name, score }]
 */
export const upsertAttributes = async (attributesArray) => {
  try {
    const { data, error } = await supabase
      .from('player_attributes')
      .upsert(attributesArray, {
        onConflict: 'profile_id,dimension,attribute_name',
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar los atributos' };
  }
};

/**
 * Calcular promedio de atributos por dimensión para el radar chart.
 * Retorna: { technical: 7.5, physical: 6.2, tactical: 8.0, mental: 7.1 }
 */
export const calculateRadarAverages = async (profileId) => {
  try {
    const { data, error } = await supabase
      .from('player_attributes')
      .select('dimension, score')
      .eq('profile_id', profileId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        data: { technical: 0, physical: 0, tactical: 0, mental: 0 },
        error: null,
      };
    }

    const agrupados = data.reduce((acc, item) => {
      if (!acc[item.dimension]) {
        acc[item.dimension] = { total: 0, count: 0 };
      }
      acc[item.dimension].total += item.score;
      acc[item.dimension].count += 1;
      return acc;
    }, {});

    const promedios = {};
    for (const dim of ['technical', 'physical', 'tactical', 'mental']) {
      if (agrupados[dim]) {
        promedios[dim] = Math.round((agrupados[dim].total / agrupados[dim].count) * 10) / 10;
      } else {
        promedios[dim] = 0;
      }
    }

    return { data: promedios, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron calcular los promedios' };
  }
};
