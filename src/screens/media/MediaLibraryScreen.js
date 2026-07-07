import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Camera, Filter, Plus, Play, Pencil, Trash2, X } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getMediaByProfile, getMediaByCategory, deleteMedia, updateMediaDescription } from '../../services/media.service';
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

  const [selectedItem, setSelectedItem] = useState(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState('');

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

  const handleLongPress = (item) => {
    setSelectedItem(item);
    setShowActionSheet(true);
  };

  const handleEditPress = (item) => {
    setSelectedItem(item);
    setEditDescription(item.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    const { error } = await updateMediaDescription(selectedItem.id, editDescription);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setShowEditModal(false);
      setSelectedItem(null);
      const profileId = user?.id;
      if (profileId) {
        const { data } = filter
          ? await getMediaByCategory(profileId, filter)
          : await getMediaByProfile(profileId);
        setMedia(data || []);
      }
    }
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    Alert.alert(
      'Eliminar jugada',
      '¿Estás seguro que querés eliminar esta jugada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteMedia(selectedItem.id, selectedItem.storage_path);
            setShowActionSheet(false);
            setSelectedItem(null);
            const profileId = user?.id;
            if (profileId) {
              const { data } = filter
                ? await getMediaByCategory(profileId, filter)
                : await getMediaByProfile(profileId);
              setMedia(data || []);
            }
          },
        },
      ]
    );
  };

  const handleWatch = () => {
    if (!selectedItem) return;
    setShowActionSheet(false);
    if (selectedItem.type === 'video') {
      navigation.navigate('VideoPlayer', {
        uri: selectedItem.storage_path,
        category: selectedItem.category,
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
      onLongPress={() => handleLongPress(item)}
      onEditPress={() => handleEditPress(item)}
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
        rightAction={() => setShowFilterSheet(true)}
        rightLabel={<Filter size={20} color={colors.textLink} />}
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>JUGADAS</Text>
        {filter && (
          <TouchableOpacity onPress={() => setFilter(null)}>
            <Text style={styles.clearFilter}>Limpiar filtro</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>Tus mejores jugadas en el potrero</Text>

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

      {showActionSheet && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayBg}
            onPress={() => setShowActionSheet(false)}
          />
          <View style={styles.actionSheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>
              {selectedItem?.category?.toUpperCase() || 'JUGADA'}
            </Text>

            {selectedItem?.type === 'video' && (
              <TouchableOpacity style={styles.actionOption} onPress={handleWatch}>
                <Play size={20} color={colors.accentBlueBright} />
                <Text style={styles.actionText}>Ver video</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => {
                setShowActionSheet(false);
                handleEditPress(selectedItem);
              }}
            >
              <Pencil size={20} color={colors.accentBlueBright} />
              <Text style={styles.actionText}>Editar descripción</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOption} onPress={handleDelete}>
              <Trash2 size={20} color={colors.accentRedCard} />
              <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowActionSheet(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDITAR DESCRIPCIÓN</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.editInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Agregá una descripción..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveModalText}>GUARDAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginTop: spacing[2],
  },
  title: {
    ...typography.displayMD,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
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
  actionSheet: {
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
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  actionText: {
    ...typography.bodyMD,
    color: colors.textPrimary,
  },
  deleteText: {
    color: colors.accentRedCard,
  },
  cancelButton: {
    marginTop: spacing[4],
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  cancelText: {
    ...typography.bodyMD,
    color: colors.textLink,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,14,20,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  modalContent: {
    backgroundColor: colors.bgSurfaceRaised,
    borderRadius: radii.lg,
    padding: spacing[5],
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  modalTitle: {
    ...typography.headingMD,
    color: colors.textPrimary,
  },
  editInput: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing[4],
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3],
  },
  cancelModalButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  cancelModalText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  saveModalButton: {
    backgroundColor: colors.accentBlue,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radii.full,
  },
  saveModalText: {
    ...typography.bodySM,
    color: colors.textOnAccent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
