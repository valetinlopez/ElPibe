export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} es obligatorio`;
  }
  return null;
};

export const validateBio = (bio) => {
  if (bio && bio.length > 500) {
    return 'La bio no puede superar los 500 caracteres';
  }
  return null;
};

export const validateFileSize = (fileSize, type) => {
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB

  const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE;

  if (fileSize > maxSize) {
    return type === 'video'
      ? 'El video supera los 50MB'
      : 'La foto supera los 10MB';
  }
  return null;
};

export const validateVideoDuration = (duration) => {
  const MAX_DURATION = 60; // 60 segundos

  if (duration > MAX_DURATION) {
    return 'El video no puede durar más de 60 segundos';
  }
  return null;
};
