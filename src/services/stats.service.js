import { getDatabase } from './database';
import * as Crypto from 'expo-crypto';

export const getStats = async (profileId) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      'SELECT * FROM player_stats WHERE profile_id = ? ORDER BY season DESC',
      [profileId]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar las estadísticas' };
  }
};

export const getStatsBySeason = async (profileId, season) => {
  try {
    const db = getDatabase();
    const result = db.getFirstSync(
      'SELECT * FROM player_stats WHERE profile_id = ? AND season = ?',
      [profileId, season]
    );
    return { data: result || null, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar las estadísticas' };
  }
};

export const upsertStats = async (statsData) => {
  try {
    const db = getDatabase();
    const existing = db.getFirstSync(
      'SELECT id FROM player_stats WHERE profile_id = ? AND season = ?',
      [statsData.profile_id, statsData.season]
    );

    if (existing) {
      db.runSync(
        `UPDATE player_stats
         SET matches = ?, minutes = ?, goals = ?, assists = ?, yellow_cards = ?, red_cards = ?
         WHERE id = ?`,
        [
          statsData.matches || 0,
          statsData.minutes || 0,
          statsData.goals || 0,
          statsData.assists || 0,
          statsData.yellow_cards || 0,
          statsData.red_cards || 0,
          existing.id,
        ]
      );
      const updated = db.getFirstSync('SELECT * FROM player_stats WHERE id = ?', [existing.id]);
      return { data: updated, error: null };
    } else {
      const id = Crypto.randomUUID();
      db.runSync(
        `INSERT INTO player_stats (id, profile_id, season, matches, minutes, goals, assists, yellow_cards, red_cards)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          statsData.profile_id,
          statsData.season,
          statsData.matches || 0,
          statsData.minutes || 0,
          statsData.goals || 0,
          statsData.assists || 0,
          statsData.yellow_cards || 0,
          statsData.red_cards || 0,
        ]
      );
      const created = db.getFirstSync('SELECT * FROM player_stats WHERE id = ?', [id]);
      return { data: created, error: null };
    }
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar las estadísticas' };
  }
};

export const deleteStats = async (statsId) => {
  try {
    const db = getDatabase();
    db.runSync('DELETE FROM player_stats WHERE id = ?', [statsId]);
    return { error: null };
  } catch (error) {
    return { error: 'No se pudieron eliminar las estadísticas' };
  }
};
