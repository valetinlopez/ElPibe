import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Camera, Filter, Plus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getMediaByProfile, getMediaByCategory } from '../../services/media.service';
import Header from '../../components/Header';
import MediaCard from '../../components/MediaCard';
import EmptyState from '../../components/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { mediaCategories } from '../../constants/categories';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing[4] * 2 - spacing[2]) / 2;

export default function MediaLibraryScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const profileId = user?.id;
      if (!profileId) {
        setMedia([]);
        setLoading(false);
        return;
      }
      const fetchMedia = async () => {
        setLoading(true);
        try {
          const { data } = filter
            ? await getMediaByCategory(profileId, filter)
            : await getMediaByProfile(profileId);
          setMedia(data || []);
        } catch (error) {
          console.error('Error cargando multimedia:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMedia();
    }, [filter, user?.id])
  );

  const handleFilterSelect = (categoryId) => {
    setFilter(filter === categoryId ? null : categoryId);
    setShowFilterSheet(false);
  };

  const handleMediaPress = (item) => {
    if (item.type === 'video') {
      navigation.navigate('VideoPlayer', {
        uri: item.storage_path,
        category: item.category,
      });
    }
  };

  const renderMediaItem = ({ item }) => (
    <MediaCard
      uri={item.storage_path}
      type={item.type}
      category={item.category}
      style={styles.mediaItem}
      onPress={() => handleMediaPress(item)}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      icon={Camera}
      title="Todavía no subiste ninguna jugada."
      description="¡Mostrá lo que tenés!"
      actionLabel="SUBIR PRIMERA JUGADA"
      onAction={() => navigation.navigate('SubirMultimedia')}
    />
  );

  const renderLoading = () => (
    <View style={styles.grid}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonLoader key={i} variant="rectangle" width={CARD_WIDTH} height={CARD_WIDTH * 1.5} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="MEDIA"
        rightAction={() => setShowFilterSheet(true)}
        rightLabel={<Filter size={20} color={colors.textLink} />}
      />

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Tus mejores jugadas en el potrero</Text>
        {filter && (
          <TouchableOpacity onPress={() => setFilter(null)}>
            <Text style={styles.clearFilter}>Limpiar filtro</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? renderLoading() : (
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SubirMultimedia')}
        activeOpacity={0.8}
      >
        <Plus size={28} color={colors.textOnAccent} />
      </TouchableOpacity>

      {showFilterSheet && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayBg}
            onPress={() => setShowFilterSheet(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>FILTRAR POR CATEGORÍA</Text>
            {mediaCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterOption,
                  filter === cat.id && styles.filterOptionActive,
                ]}
                onPress={() => handleFilterSelect(cat.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === cat.id && styles.filterTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  subtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  clearFilter: {
    ...typography.bodySM,
    color: colors.textLink,
  },
  list: {
    paddingHorizontal: spacing[4],
    paddingBottom: 64 + spacing[12],
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  mediaItem: {
    width: CARD_WIDTH,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
  },
  fab: {
    position: 'absolute',
    bottom: 64 + spacing[4],
    right: spacing[4],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,14,20,0.75)',
  },
  bottomSheet: {
    backgroundColor: colors.bgSurfaceRaised,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderDefault,
    alignSelf: 'center',
    marginBottom: spacing[5],
  },
  sheetTitle: {
    ...typography.headingMD,
    color: colors.textPrimary,
    marginBottom: spacing[4],
  },
  filterOption: {
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  filterOptionActive: {
    backgroundColor: colors.accentBlueDim,
    marginHorizontal: -spacing[5],
    paddingHorizontal: spacing[5],
    borderBottomColor: colors.accentBlue,
  },
  filterText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.accentBlueBright,
    fontWeight: '600',
  },
});
