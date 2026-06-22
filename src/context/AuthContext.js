import { createContext, useContext, useState, useEffect } from 'react';
import * as Crypto from 'expo-crypto';
import { initDatabase } from '../services/database';
import { storageGetItem, storageSetItem, storageDeleteItem } from '../utils/storage';

const AuthContext = createContext({});

const sanitizeKey = (key) => {
  return key.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const hashPassword = async (password) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || !context.signIn) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        initDatabase();

        const userJson = await storageGetItem('auth_user');
        const sessionJson = await storageGetItem('auth_session');

        if (userJson && sessionJson) {
          const parsedUser = JSON.parse(userJson);
          const parsedSession = JSON.parse(sessionJson);
          setUser(parsedUser);
          setSession(parsedSession);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email, password) => {
    try {
      const key = sanitizeKey(email);
      const storedHash = await storageGetItem(`auth_hash_${key}`);
      const storedUser = await storageGetItem(`auth_user_${key}`);

      if (!storedHash || !storedUser) {
        return { data: null, error: 'No existe una cuenta con este email' };
      }

      const inputHash = await hashPassword(password);
      if (inputHash !== storedHash) {
        return { data: null, error: 'Email o contraseña incorrectos' };
      }

      const parsedUser = JSON.parse(storedUser);
      const userData = { id: parsedUser.id, email: parsedUser.email, user_metadata: parsedUser.user_metadata };
      const sessionData = { user: userData, access_token: 'local_session' };

      setUser(userData);
      setSession(sessionData);

      await storageSetItem('auth_user', JSON.stringify(userData));
      await storageSetItem('auth_session', JSON.stringify(sessionData));

      return { data: { user: userData }, error: null };
    } catch (error) {
      console.error('Error en signIn:', error);
      return { data: null, error: 'Algo salió mal, probá de nuevo' };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const key = sanitizeKey(email);
      const existingHash = await storageGetItem(`auth_hash_${key}`);
      if (existingHash) {
        return { data: null, error: 'Este email ya está registrado' };
      }

      const userId = Crypto.randomUUID();
      const passwordHash = await hashPassword(password);

      const userData = {
        id: userId,
        email,
        user_metadata: { full_name: fullName },
      };

      await storageSetItem(`auth_hash_${key}`, passwordHash);
      await storageSetItem(`auth_user_${key}`, JSON.stringify(userData));

      setUser(userData);
      const sessionData = { user: userData, access_token: 'local_session' };
      setSession(sessionData);

      await storageSetItem('auth_user', JSON.stringify(userData));
      await storageSetItem('auth_session', JSON.stringify(sessionData));

      return { data: { user: userData }, error: null };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { data: null, error: 'Algo salió mal, probá de nuevo' };
    }
  };

  const signOut = async () => {
    try {
      await storageDeleteItem('auth_user');
      await storageDeleteItem('auth_session');

      setUser(null);
      setSession(null);

      return { error: null };
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error: 'No se pudo cerrar sesión' };
    }
  };

  const resetPassword = async (email) => {
    try {
      const key = sanitizeKey(email);
      const existingUser = await storageGetItem(`auth_user_${key}`);
      if (!existingUser) {
        return { error: 'No existe una cuenta con este email' };
      }
      return { error: null };
    } catch (error) {
      console.error('Error en resetPassword:', error);
      return { error: 'Algo salió mal, probá de nuevo' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
