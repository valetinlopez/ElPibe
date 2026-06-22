import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={24} color={colors.textOnAccent} />
        </TouchableOpacity>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </View>
        )}
      </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
