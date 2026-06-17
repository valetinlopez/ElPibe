# Skill: Supabase

> Configuracion, servicios, autenticacion, Storage y RLS para ElPibe.

---

## Cuando usar este skill

- Crear o modificar `src/services/supabaseClient.js`
- Crear o modificar cualquier archivo en `src/services/*.service.js`
- Configurar tablas, RLS o Storage en Supabase Dashboard
- Manejar autenticacion (login, registro, sesion)
- Subir archivos a Storage

---

## Configuracion del Cliente

```js
// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU-ANON-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Patron de Servicio

Todos los servicios siguen este formato:

```js
// src/services/ejemplo.service.js
import { supabase } from './supabaseClient';

export const ejemploService = {
  async miFuncion(param) {
    try {
      const { data, error } = await supabase
        .from('tabla')
        .select('*')
        .eq('campo', param);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error en miFuncion:', error.message);
      return { data: null, error: error.message };
    }
  },
};
```

**Reglas del patron:**
- Siempre try/catch
- Siempre return `{ data, error }`
- Mensajes de error en espanol
- Nunca lanzar errores sin capturar

---

## Auth Service

```js
// src/services/auth.service.js
import { supabase } from './supabaseClient';

export const authService = {
  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data: session, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
```

---

## Profile Service

```js
// src/services/profile.service.js
import { supabase } from './supabaseClient';

export const profileService = {
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async createProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateProfile(userId, profileData) {
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
      return { data: null, error: error.message };
    }
  },

  async uploadAvatar(userId, imageFile) {
    try {
      const fileName = `avatar-${userId}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await this.updateProfile(userId, { photo_url: urlData.publicUrl });

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  isProfileComplete(profile) {
    if (!profile) return false;
    const required = ['full_name', 'age', 'city', 'position_main', 'club', 'category'];
    return required.every(field => profile[field] && profile[field].trim() !== '');
  },
};
```

---

## Stats Service

```js
// src/services/stats.service.js
import { supabase } from './supabaseClient';

export const statsService = {
  async getStats(profileId) {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('profile_id', profileId)
        .order('season', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getStatsBySeason(profileId, season) {
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
      return { data: null, error: error.message };
    }
  },

  async upsertStats(statsData) {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .upsert(statsData, { onConflict: 'profile_id,season' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deleteStats(statsId) {
    try {
      const { error } = await supabase
        .from('player_stats')
        .delete()
        .eq('id', statsId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
```

---

## Attributes Service

```js
// src/services/attributes.service.js
import { supabase } from './supabaseClient';

export const attributesService = {
  async getAttributes(profileId) {
    try {
      const { data, error } = await supabase
        .from('player_attributes')
        .select('*')
        .eq('profile_id', profileId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getAttributesByDimension(profileId, dimension) {
    try {
      const { data, error } = await supabase
        .from('player_attributes')
        .select('*')
        .eq('profile_id', profileId)
        .eq('dimension', dimension);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async upsertAttributes(attributesArray) {
    try {
      const { data, error } = await supabase
        .from('player_attributes')
        .upsert(attributesArray, { onConflict: 'profile_id,dimension,attribute_name' })
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  calculateRadarAverages(attributes) {
    const dimensions = ['technical', 'physical', 'tactical', 'mental'];
    const averages = {};

    dimensions.forEach(dim => {
      const dimAttrs = attributes.filter(a => a.dimension === dim);
      if (dimAttrs.length > 0) {
        const sum = dimAttrs.reduce((acc, a) => acc + a.score, 0);
        averages[dim] = Math.round((sum / dimAttrs.length) * 10) / 10;
      } else {
        averages[dim] = 0;
      }
    });

    return averages;
  },
};
```

---

## Media Service

```js
// src/services/media.service.js
import { supabase } from './supabaseClient';
import * as FileSystem from 'expo-file-system';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_DURATION = 60; // 60 segundos

export const mediaService = {
  async uploadMedia(profileId, file, type, category, subcategory = '') {
    try {
      // Validar tamano
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE;

      if (fileInfo.size > maxSize) {
        throw new Error(
          type === 'video'
            ? 'El video supera los 50MB'
            : 'La foto supera los 10MB'
        );
      }

      // Upload a Supabase Storage
      const fileName = `${profileId}/${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Guardar registro en tabla
      const { data, error } = await supabase
        .from('media_items')
        .insert({
          profile_id: profileId,
          type,
          category,
          subcategory,
          storage_path: fileName,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getMediaByProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getMediaByCategory(profileId, category) {
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
      return { data: null, error: error.message };
    }
  },

  async deleteMedia(mediaId, storagePath) {
    try {
      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Eliminar registro
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async getSignedUrl(storagePath) {
    try {
      const { data, error } = await supabase.storage
        .from('media')
        .createSignedUrl(storagePath, 3600); // 1 hora

      if (error) throw error;
      return { data: data.signedUrl, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
```

---

## Storage Buckets (Configurar en Dashboard)

1. **avatars** (privado)
   - Tamaño max: 5MB
   - Tipos: image/jpeg, image/png, image/webp

2. **media** (privado)
   - Tamaño max: 50MB
   - Tipos: video/mp4, image/jpeg, image/png

---

## SQL de Tablas

```sql
-- Ejecutar en Supabase SQL Editor

-- profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  age INT2,
  city TEXT,
  nationality TEXT,
  height_cm INT2,
  weight_kg INT2,
  foot TEXT CHECK (foot IN ('izquierda', 'derecha', 'ambidiestro')),
  position_main TEXT,
  position_secondary TEXT,
  club TEXT,
  category TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- player_stats
CREATE TABLE player_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season TEXT,
  matches INT2 DEFAULT 0,
  minutes INT4 DEFAULT 0,
  goals INT2 DEFAULT 0,
  assists INT2 DEFAULT 0,
  yellow_cards INT2 DEFAULT 0,
  red_cards INT2 DEFAULT 0,
  UNIQUE(profile_id, season)
);

-- player_attributes
CREATE TABLE player_attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dimension TEXT CHECK (dimension IN ('technical', 'physical', 'tactical', 'mental')),
  attribute_name TEXT,
  score INT2 CHECK (score >= 1 AND score <= 10),
  UNIQUE(profile_id, dimension, attribute_name)
);

-- media_items
CREATE TABLE media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('video', 'photo')),
  category TEXT,
  subcategory TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Politicas profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Politicas player_stats
CREATE POLICY "Users can view own stats" ON player_stats FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own stats" ON player_stats FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own stats" ON player_stats FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own stats" ON player_stats FOR DELETE USING (auth.uid() = profile_id);

-- Politicas player_attributes
CREATE POLICY "Users can view own attributes" ON player_attributes FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can upsert own attributes" ON player_attributes FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own attributes" ON player_attributes FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own attributes" ON player_attributes FOR DELETE USING (auth.uid() = profile_id);

-- Politicas media_items
CREATE POLICY "Users can view own media" ON media_items FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own media" ON media_items FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own media" ON media_items FOR DELETE USING (auth.uid() = profile_id);
```

---

*Skill Supabase v1.0 — ElPibe*
