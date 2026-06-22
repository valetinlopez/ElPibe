import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Video } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

export default function MediaCard({ uri, type = 'photo', category, duration, onPress }) {
  const isVideo = type === 'video';

  return (
    <TouchableOpacity
      style={[styles.container, isVideo && styles.containerVideo]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${isVideo ? 'Video' : 'Foto'}: ${category || ''}`}
    >
      {isVideo ? (
        <View style={styles.videoPlaceholder}>
          <Video size={32} color={colors.textTertiary} />
          <Text style={styles.videoLabel}>VIDEO</Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.overlay} />

      {isVideo && (
        <View style={styles.playContainer}>
          <View style={styles.playBg}>
            <Play size={24} color={colors.textOnAccent} fill={colors.textOnAccent} />
          </View>
        </View>
      )}

      {category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
        </View>
      )}

      {duration && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.bgSurface,
  },
  containerVideo: {
    aspectRatio: 9 / 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.bgSurfaceOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  videoLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  playContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(11,14,20,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textOnAccent,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(11,14,20,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  durationText: {
    ...typography.caption,
    color: colors.textOnAccent,
  },
});
