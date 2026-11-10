import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, X } from 'lucide-react-native';
import { colors } from '../constants/colors';

export default function Avatar({ uri, size = 96, profileComplete = false, loading, onPressEdit }) {
  const insets = useSafeAreaInsets();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Si cambia la foto, reintentamos cargarla
  useEffect(() => {
    setImageFailed(false);
  }, [uri]);

  const borderWidth = 2;
  const borderColor = profileComplete ? colors.accentBlueMetal : colors.borderDefault;
  const hasImage = !!uri && !imageFailed;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity
        activeOpacity={hasImage ? 0.8 : 1}
        disabled={!hasImage || loading}
        onPress={() => setPreviewVisible(true)}
        accessibilityLabel="Ver foto de perfil"
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor,
          },
        ]}
      >
        {loading ? (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <ActivityIndicator size={size * 0.3} color={colors.accentBlueBright} />
          </View>
        ) : hasImage ? (
          <Image
            source={{ uri }}
            style={[styles.image, { borderRadius: size / 2 }]}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <Camera size={size * 0.4} color={colors.textTertiary} />
          </View>
        )}
      </TouchableOpacity>

      {onPressEdit && !loading && (
        <TouchableOpacity
          style={[styles.editButton, { bottom: size * 0.02, right: size * 0.02 }]}
          onPress={onPressEdit}
          activeOpacity={0.7}
          accessibilityLabel="Editar foto de perfil"
        >
          <Camera size={16} color={colors.textOnAccent} />
        </TouchableOpacity>
      )}

      {/* Vista previa a pantalla completa */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.previewOverlay}>
          <StatusBar barStyle="light-content" />
          {/* Tocar el fondo también cierra */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setPreviewVisible(false)}
          />
          {hasImage && (
            <Image
              source={{ uri }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={() => setImageFailed(true)}
            />
          )}
          <TouchableOpacity
            style={[styles.previewClose, { top: Math.max(insets.top, 44) + 8 }]}
            onPress={() => setPreviewVisible(false)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Cerrar foto"
          >
            <X size={24} color={colors.textOnAccent} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bgSurfaceOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bgBase,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewClose: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
