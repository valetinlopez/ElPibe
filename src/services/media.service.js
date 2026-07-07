import { Platform } from 'react-native';
import { getDatabase } from './database';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import { validateFileSize } from '../utils/validations';

const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;

const ensureDirectoryExists = async (dir) => {
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

export const uploadMedia = async (profileId, file, type, category, subcategory = null, description = null) => {
  try {
    const validacionTamano = validateFileSize(file.fileSize || 0, type);
    if (validacionTamano) {
      return { data: null, error: validacionTamano };
    }

    const db = getDatabase();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    let storagePath = '';

    if (Platform.OS === 'web') {
      const encoding = type === 'video' ? 'base64' : 'base64';
      const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding });
      const mimeType = type === 'video' ? 'video/mp4' : 'image/jpeg';
      storagePath = `data:${mimeType};base64,${base64}`;
    } else {
      await ensureDirectoryExists(MEDIA_DIR);
      const uriSegments = file.uri.split('/').pop().split('?')[0].split('.');
      const fileExt = uriSegments.length > 1 ? uriSegments.pop() : (type === 'video' ? 'mp4' : 'jpg');
      const timestamp = Date.now();
      const fileName = `${profileId}/${type}_${timestamp}.${fileExt}`;
      const destDir = `${MEDIA_DIR}${profileId}/`;
      await ensureDirectoryExists(destDir);
      const destPath = `${destDir}${type}_${timestamp}.${fileExt}`;
      await FileSystem.copyAsync({ from: file.uri, to: destPath });
      storagePath = destPath;
    }

    db.runSync(
      `INSERT INTO media_items (id, profile_id, type, category, subcategory, description, storage_path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, profileId, type, category || '', subcategory || '', description || '', storagePath, now]
    );

    const created = db.getFirstSync('SELECT * FROM media_items WHERE id = ?', [id]);
    if (!created) {
      created = { id, profile_id: profileId, type, category, subcategory, description, storage_path: storagePath, created_at: now };
    }
    return { data: created, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo subir el archivo multimedia' };
  }
};

export const getMediaByProfile = async (profileId) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      'SELECT * FROM media_items WHERE profile_id = ? ORDER BY created_at DESC',
      [profileId]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo cargar la biblioteca multimedia' };
  }
};

export const getMediaByCategory = async (profileId, category) => {
  try {
    const db = getDatabase();
    const results = db.getAllSync(
      'SELECT * FROM media_items WHERE profile_id = ? AND category = ? ORDER BY created_at DESC',
      [profileId, category]
    );
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudieron cargar los archivos de esa categoría' };
  }
};

export const deleteMedia = async (mediaId, storagePath) => {
  try {
    if (!storagePath?.startsWith('data:')) {
      const fileInfo = await FileSystem.getInfoAsync(storagePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(storagePath);
      }
    }

    const db = getDatabase();
    db.runSync('DELETE FROM media_items WHERE id = ?', [mediaId]);

    return { error: null };
  } catch (error) {
    return { error: 'No se pudo eliminar el archivo multimedia' };
  }
};

export const getMediaUrl = (storagePath) => {
  return storagePath || null;
};

export const updateMediaDescription = async (mediaId, description) => {
  try {
    const db = getDatabase();
    db.runSync('UPDATE media_items SET description = ? WHERE id = ?', [description || '', mediaId]);
    const updated = db.getFirstSync('SELECT * FROM media_items WHERE id = ?', [mediaId]);
    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: 'No se pudo actualizar la descripción' };
  }
};
