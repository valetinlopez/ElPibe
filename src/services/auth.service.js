import { supabase } from './supabaseClient';

/**
 * Registrar nuevo usuario con email y contraseña.
 * Crea el usuario en Supabase Auth y retorna los datos.
 */
export const signUp = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { data: null, error: mensaje };
  }
};

/**
 * Iniciar sesión con email y contraseña.
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { data: null, error: mensaje };
  }
};

/**
 * Cerrar sesión actual.
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { error: mensaje };
  }
};

/**
 * Enviar email de recuperación de contraseña.
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'elpibe://reset-password',
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { error: mensaje };
  }
};

/**
 * Obtener la sesión actual del usuario.
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { session: null, error: mensaje };
  }
};

/**
 * Obtener el usuario actual autenticado.
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    const mensaje = traducirError(error.message);
    return { user: null, error: mensaje };
  }
};

/**
 * Traducir mensajes de error de Supabase al español.
 */
const traducirError = (mensaje) => {
  if (mensaje.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos';
  }
  if (mensaje.includes('User already registered')) {
    return 'Este email ya está registrado';
  }
  if (mensaje.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (mensaje.includes('Unable to validate email address')) {
    return 'El formato del email no es válido';
  }
  if (mensaje.includes('Email not confirmed')) {
    return 'Confirmá tu email para poder iniciar sesión';
  }
  if (mensaje.includes('For security purposes')) {
    return 'Esperá unos segundos antes de intentar de nuevo';
  }
  return 'Algo salió mal, probá de nuevo';
};
