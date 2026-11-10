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

// En iOS la ruta absoluta de documentDirectory cambia entre reinstalaciones/actualizaciones,
// así que guardamos la ruta relativa ("avatars/...") y la resolvemos al leer.
const resolvePhotoUrl = (profile) => {
  if (!profile || !profile.photo_url) return profile;
  const url = profile.photo_url;
  if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('blob:')) return profile;
  const idx = url.indexOf('avatars/');
  if (idx === -1 || !FileSystem.documentDirectory) return profile;
  return { ...profile, photo_url: `${FileSystem.documentDirectory}${url.slice(idx)}` };
};

export const getProfile = async (userId) => {
  try {
    const db = getDatabase();
    const result = db.getFirstSync(
      'SELECT * FROM profiles WHERE id = ?',
      [userId]
    );
    return { data: resolvePhotoUrl(result) || null, error: null };
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
    return { data: resolvePhotoUrl(updated), error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron guardar los cambios' };
  }
};

export const uploadAvatar = async (userId, imageFile) => {
  try {
    const db = getDatabase();

    // Web: no hay filesystem, guardamos la imagen como data URI
    if (!FileSystem.documentDirectory) {
      const blob = await (await fetch(imageFile.uri)).blob();
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      db.runSync('UPDATE profiles SET photo_url = ? WHERE id = ?', [dataUri, userId]);
      return { data: { photo_url: dataUri }, error: null };
    }

    await ensureDirectoryExists(AVATARS_DIR);
    const destDir = `${AVATARS_DIR}${userId}/`;
    await ensureDirectoryExists(destDir);

    // Extensión segura (la URI de iOS puede traer query o no tener extensión)
    const cleanUri = imageFile.uri.split('?')[0];
    const rawExt = cleanUri.includes('.') ? cleanUri.split('.').pop().toLowerCase() : '';
    const fileExt = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : 'jpg';

    // Nombre único para evitar que la imagen quede cacheada con la foto vieja
    const relativePath = `avatars/${userId}/avatar-${Date.now()}.${fileExt}`;
    const destPath = `${FileSystem.documentDirectory}${relativePath}`;

    await FileSystem.copyAsync({ from: imageFile.uri, to: destPath });

    // Borrar fotos anteriores del usuario
    const files = await FileSystem.readDirectoryAsync(destDir);
    await Promise.all(
      files
        .filter((f) => `${destDir}${f}` !== destPath)
        .map((f) => FileSystem.deleteAsync(`${destDir}${f}`, { idempotent: true }))
    );

    db.runSync('UPDATE profiles SET photo_url = ? WHERE id = ?', [relativePath, userId]);

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
