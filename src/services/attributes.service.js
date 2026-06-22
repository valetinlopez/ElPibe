import { getDatabase } from './database';
import * as Crypto from 'expo-crypto';

export const getAttributes = async (profileId) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      'SELECT * FROM player_attributes WHERE profile_id = ? ORDER BY dimension, attribute_name',
      [profileId]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los atributos' };
  }
};

export const getAttributesByDimension = async (profileId, dimension) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      'SELECT * FROM player_attributes WHERE profile_id = ? AND dimension = ? ORDER BY attribute_name',
      [profileId, dimension]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los atributos' };
  }
};

export const upsertAttributes = async (attributesArray) => {
  try {
    const db = getDatabase();

    for (const attr of attributesArray) {
      const existing = db.getFirstSync(
        'SELECT id FROM player_attributes WHERE profile_id = ? AND dimension = ? AND attribute_name = ?',
        [attr.profile_id, attr.dimension, attr.attribute_name]
      );

      if (existing) {
        db.runSync(
          'UPDATE player_attributes SET score = ? WHERE id = ?',
          [attr.score, existing.id]
        );
      } else {
        const id = Crypto.randomUUID()
        db.runSync(
          'INSERT INTO player_attributes (id, profile_id, dimension, attribute_name, score) VALUES (?, ?, ?, ?, ?)',
          [id, attr.profile_id, attr.dimension, attr.attribute_name, attr.score]
        );
      }
    }

    const results = db.getAllSync(
      'SELECT * FROM player_attributes WHERE profile_id = ? ORDER BY dimension, attribute_name',
      [attributesArray[0]?.profile_id]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar los atributos' };
  }
};

export const calculateRadarAverages = async (profileId) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      `SELECT dimension, ROUND(AVG(score), 1) as average
       FROM player_attributes
       WHERE profile_id = ?
       GROUP BY dimension`,
      [profileId]
    );

    const radarData = {};
    results.forEach((row) => {
      radarData[row.dimension] = row.average;
    });

    return { data: radarData, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron calcular los promedios' };
  }
};
