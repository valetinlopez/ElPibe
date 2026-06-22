import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors } from '../constants/colors';

export default function Avatar({ uri, size = 96, profileComplete = false, loading, onPressEdit }) {
  const borderWidth = profileComplete ? 2 : 2;
  const borderColor = profileComplete ? colors.accentBlueMetal : colors.borderDefault;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
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
        ) : uri ? (
          <Image source={{ uri }} style={[styles.image, { borderRadius: size / 2 }]} />
        ) : (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <Camera size={size * 0.4} color={colors.textTertiary} />
          </View>
        )}
      </View>

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
});
