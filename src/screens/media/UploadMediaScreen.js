import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X, Check, Video } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { uploadMedia } from '../../services/media.service';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { mediaCategories } from '../../constants/categories';

export default function UploadMediaScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  const pickFromGallery = async (mediaType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'video'
        ? ['videos']
        : mediaType === 'photo'
        ? ['images']
        : ['images', 'videos'],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      validateAndSetFile(asset, asset.type === 'video' ? 'video' : 'photo');
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      validateAndSetFile(asset, 'photo');
    }
  };

  const validateAndSetFile = (asset, type) => {
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
    const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

    if (asset.fileSize > (type === 'video' ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE)) {
      setToast({
        visible: true,
        type: 'error',
        message: type === 'video' ? 'El video supera los 50MB' : 'La foto supera los 10MB',
      });
      return;
    }

    setFile(asset);
    setFileType(type);
  };

  const handleUpload = async () => {
    if (!file || !category) {
      setToast({ visible: true, type: 'error', message: 'Seleccioná un archivo y una categoría' });
      return;
    }

    if (!user?.id) {
      setToast({ visible: true, type: 'error', message: 'No hay usuario activo' });
      return;
    }

    setLoading(true);

    const { error } = await uploadMedia(
      user.id,
      file,
      fileType,
      category,
      subcategory || null,
      description || null
    );

    if (error) {
      setToast({ visible: true, type: 'error', message: error });
      setLoading(false);
    } else {
      setToast({ visible: true, type: 'success', message: '¡Jugada subida!' });
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileType(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="SUBIR JUGADA" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {!file ? (
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => pickFromGallery('mixed')}
              activeOpacity={0.7}
            >
              <ImageIcon size={32} color={colors.accentBlueBright} />
              <Text style={styles.selectorTitle}>Elegir desde galería</Text>
              <Text style={styles.selectorSubtitle}>Videos o fotos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={takePhoto}
              activeOpacity={0.7}
            >
              <Camera size={32} color={colors.accentBlueBright} />
              <Text style={styles.selectorTitle}>Grabar ahora</Text>
              <Text style={styles.selectorSubtitle}>Tomar una foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {fileType === 'video' ? 'Video seleccionado' : 'Foto seleccionada'}
              </Text>
              <TouchableOpacity onPress={removeFile} style={styles.removeButton}>
                <X size={20} color={colors.accentRedCard} />
              </TouchableOpacity>
            </View>
            {fileType === 'video' ? (
              <View style={styles.videoPlaceholder}>
                <Video size={40} color={colors.textTertiary} />
                <Text style={styles.videoText}>Video seleccionado</Text>
                {file.duration && (
                  <Text style={styles.durationText}>
                    {Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}
                  </Text>
                )}
              </View>
            ) : (
              <Image source={{ uri: file.uri }} style={styles.imagePreview} />
            )}
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.chipContainer}>
            {mediaCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  category === cat.id && styles.chipActive,
                ]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === cat.id && styles.chipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.textareaContainer}>
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={styles.textarea}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
              placeholder="Contá qué hiciste en esta jugada..."
              placeholderTextColor={colors.textTertiary}
              textAlignVertical="top"
            />
          </View>
        </View>

        <Button
          variant="primary"
          label="SUBIR JUGADA"
          icon={Check}
          onPress={handleUpload}
          loading={loading}
          disabled={!file || !category}
          style={styles.uploadButton}
        />
      </ScrollView>

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    marginVertical: spacing[6],
  },
  selectorButton: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
    padding: spacing[5],
    alignItems: 'center',
    gap: spacing[3],
  },
  selectorTitle: {
    ...typography.headingMD,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  selectorSubtitle: {
    ...typography.bodySM,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  previewContainer: {
    marginVertical: spacing[4],
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  previewTitle: {
    ...typography.headingMD,
    color: colors.textPrimary,
  },
  removeButton: {
    padding: spacing[2],
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: radii.md,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    ...typography.bodyMD,
    color: colors.textTertiary,
  },
  durationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing[2],
  },
  form: {
    marginTop: spacing[4],
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  chipActive: {
    backgroundColor: colors.accentBlueDim,
    borderColor: colors.accentBlue,
  },
  chipText: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accentBlueBright,
  },
  textareaContainer: {
    marginBottom: spacing[4],
  },
  textarea: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    padding: spacing[4],
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButton: {
    width: '100%',
    marginTop: spacing[4],
  },
});
