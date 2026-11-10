import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';

export default function VideoPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { uri, category } = route.params || {};

  if (!uri) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <SafeAreaView style={styles.header} edges={['top']}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color={colors.textOnAccent} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return <PlayerContent uri={uri} category={category} navigation={navigation} />;
}

// Componente separado para no llamar hooks después de un return condicional
function PlayerContent({ uri, category, navigation }) {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
      />

      {/* Header propio con inset superior explícito: queda debajo de la hora/notch de iOS */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 44) + spacing[2] }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Cerrar video"
        >
          <X size={24} color={colors.textOnAccent} />
        </TouchableOpacity>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // Todo agrupado a la izquierda: la derecha queda libre para overlays del sistema/dev
    justifyContent: 'flex-start',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(11,14,20,0.75)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textOnAccent,
  },
});
