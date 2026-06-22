import { getDatabase } from './database';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

const AVATARS_DIR = `${FileSystem.documentDirectory}avatars/`;

const ensureDirectoryExists = async (dir) => {
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

export const getProfile = async (userId) => {
  try {
    const db = getDatabase();
    const result = db.getFirstSync(
      'SELECT * FROM profiles WHERE id = ?',
      [userId]
    );
    return { data: result || null, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo cargar el perfil' };
  }
};

export const createProfile = async (profileData) => {
  try {
    const db = getDatabase();
    db.runSync(
      `INSERT INTO profiles (id, full_name, age, city, nationality, height_cm, weight_kg, foot, position_main, position_secondary, club, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profileData.id,
        profileData.full_name || '',
        profileData.age || null,
        profileData.city || '',
        profileData.nationality || '',
        profileData.height_cm || null,
        profileData.weight_kg || null,
        profileData.foot || 'derecha',
        profileData.position_main || '',
        profileData.position_secondary || '',
        profileData.club || '',
        profileData.category || '',
      ]
    );

    const created = db.getFirstSync('SELECT * FROM profiles WHERE id = ?', [profileData.id]);
    return { data: created, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo crear el perfil' };
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const db = getDatabase();
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(profileData)) {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return { data: null, error: 'No hay campos para actualizar' };
    }

    values.push(userId);
    db.runSync(`UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`, values);

    const updated = db.getFirstSync('SELECT * FROM profiles WHERE id = ?', [userId]);
    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar los cambios' };
  }
};

export const uploadAvatar = async (userId, imageFile) => {
  try {
    await ensureDirectoryExists(AVATARS_DIR);

    const fileExt = imageFile.uri.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    const destPath = `${AVATARS_DIR}${fileName}`;

    const destDir = `${AVATARS_DIR}${userId}/`;
    await ensureDirectoryExists(destDir);

    await FileSystem.copyAsync({ from: imageFile.uri, to: destPath });

    const db = getDatabase();
    db.runSync('UPDATE profiles SET photo_url = ? WHERE id = ?', [destPath, userId]);

    return { data: { photo_url: destPath }, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo subir la foto' };
  }
};

export const isProfileComplete = (profile) => {
  if (!profile) return false;
  const requiredFields = ['full_name', 'age', 'city', 'position_main'];
  return requiredFields.every(
    (field) => profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
  );
};
