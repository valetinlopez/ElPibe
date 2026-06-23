import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

function VideoThumbnail({ uri }) {
  if (!uri) {
    return (
      <View style={styles.contentWrapper}>
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Play size={20} color={colors.textOnAccent} fill={colors.textOnAccent} />
          </View>
        </View>
      </View>
    );
  }

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.muted = true;
  });

  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  return (
    <View style={styles.contentWrapper}>
      <VideoView
        player={player}
        style={styles.media}
        nativeControls={false}
        contentFit="cover"
      />
      <View style={styles.playOverlay}>
        <View style={styles.playButton}>
          <Play size={20} color={colors.textOnAccent} fill={colors.textOnAccent} />
        </View>
      </View>
    </View>
  );
}

export default function MediaCard({ uri, type = 'photo', category, duration, onPress, style }) {
  const isVideo = type === 'video';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`${isVideo ? 'Video' : 'Foto'}: ${category || ''}`}
    >
      {isVideo ? (
        <VideoThumbnail uri={uri} />
      ) : (
        <Image
          source={{ uri }}
          style={styles.media}
          resizeMode="cover"
        />
      )}

      {category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
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
    aspectRatio: 1,
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.bgSurfaceOverlay,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(11,14,20,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textOnAccent,
  },
});
