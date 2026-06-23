import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, ChevronLeft, Shield } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, uploadAvatar } from '../../services/profile.service';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Toast from '../../components/Toast';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { positions, footOptions } from '../../constants/positions';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [nationality, setNationality] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [foot, setFoot] = useState('derecha');
  const [club, setClub] = useState('');
  const [category, setCategory] = useState('');
  const [positionMain, setPositionMain] = useState('');
  const [positionSecondary, setPositionSecondary] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await getProfile(user?.id);
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
      setBio(data.bio || '');
      setAge(data.age?.toString() || '');
      setCity(data.city || '');
      setNationality(data.nationality || '');
      setHeightCm(data.height_cm?.toString() || '');
      setWeightKg(data.weight_kg?.toString() || '');
      setFoot(data.foot || 'derecha');
      setClub(data.club || '');
      setCategory(data.category || '');
      setPositionMain(data.position_main || '');
      setPositionSecondary(data.position_secondary || '');
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setToast({ visible: true, type: 'error', message: 'Necesitás dar permiso para acceder a tus fotos' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setPhotoLoading(true);
    try {
      const { error } = await uploadAvatar(user?.id, result.assets[0]);
      if (error) {
        setToast({ visible: true, type: 'error', message: error });
      } else {
        await loadProfile();
        setToast({ visible: true, type: 'success', message: '¡Foto actualizada!' });
      }
    } catch (e) {
      setToast({ visible: true, type: 'error', message: 'Algo salió mal, probá de nuevo' });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setToast({ visible: true, type: 'error', message: 'El nombre es obligatorio' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateProfile(user?.id, {
        full_name: fullName.trim(),
        bio: bio.trim() || null,
        age: age ? parseInt(age) : null,
        city: city.trim() || null,
        nationality: nationality.trim() || null,
        height_cm: heightCm ? parseInt(heightCm) : null,
        weight_kg: weightKg ? parseInt(weightKg) : null,
        foot: foot,
        club: club.trim() || null,
        category: category.trim() || null,
        position_main: positionMain.trim() || null,
        position_secondary: positionSecondary.trim() || null,
      });

      if (error) {
        setToast({ visible: true, type: 'error', message: error });
      } else {
        setToast({ visible: true, type: 'success', message: '¡Perfil actualizado!' });
        setTimeout(() => {
          if (route.params?.backTo === 'Settings') {
            navigation.navigate('TabAjustes');
          } else {
            navigation.goBack();
          }
        }, 1500);
      }
    } catch (error) {
      setToast({ visible: true, type: 'error', message: 'Algo salió mal, probá de nuevo' });
    } finally {
      setLoading(false);
    }
  };

  const playerId = `#${user?.id?.slice(0, 4).toUpperCase() || '0000'}-${fullName.split(' ')[0]?.toUpperCase() || 'JUGADOR'}-${new Date().getFullYear()}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="EDITAR PERFIL"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <Avatar
              uri={profile?.photo_url}
              size={96}
              profileComplete={true}
              loading={photoLoading}
              onPressEdit={handlePickPhoto}
            />
            <TouchableOpacity style={styles.photoLink} onPress={handlePickPhoto}>
              <Text style={styles.photoLinkText}>FOTO DE CANCHA</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input
              label="Tu nombre de crack"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nombre completo"
            />

            <View style={styles.textareaContainer}>
              <Text style={styles.label}>Sobre vos (Bio)</Text>
              <TextInput
                style={styles.textarea}
                value={bio}
                onChangeText={(text) => text.length <= 500 && setBio(text)}
                placeholder="Contanos quién sos..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{bio.length}/500</Text>
            </View>

            <Input
              label="Club actual"
              value={club}
              onChangeText={setClub}
              placeholder="Tu club"
            />

            <Input
              label="Categoría"
              value={category}
              onChangeText={setCategory}
              placeholder="U-21 Elite Local"
            />

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Edad</Text>
                <TextInput
                  style={styles.numberInput}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={2}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Ciudad</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Tu ciudad"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Nacionalidad</Text>
                <TextInput
                  style={styles.textInput}
                  value={nationality}
                  onChangeText={setNationality}
                  placeholder="Argentina"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Pie</Text>
                <View style={styles.footToggle}>
                  {footOptions.slice(0, 2).map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.footBtn, foot === option.id && styles.footBtnActive]}
                      onPress={() => setFoot(option.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.footBtnText, foot === option.id && styles.footBtnTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Altura (cm)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={3}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={weightKg}
                  onChangeText={setWeightKg}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.chipSection}>
              <Text style={styles.label}>Posición preferida</Text>
              <View style={styles.chipContainer}>
                {positions.map((pos) => (
                  <TouchableOpacity
                    key={pos.id}
                    style={[
                      styles.chip,
                      positionMain === pos.id && styles.chipActive,
                    ]}
                    onPress={() => setPositionMain(pos.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        positionMain === pos.id && styles.chipTextActive,
                      ]}
                    >
                      {pos.short}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.chipSection}>
              <Text style={styles.label}>Posición alternativa</Text>
              <TextInput
                style={styles.textInput}
                value={positionSecondary}
                onChangeText={setPositionSecondary}
                placeholder="Mediocampista creativo, segundo delantero..."
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <Card style={styles.identityCard}>
              <View style={styles.identityHeader}>
                <Shield size={20} color={colors.accentGold} />
                <Text style={styles.identityTitle}>IDENTIDAD POTRERA</Text>
              </View>
              <View style={styles.identityRow}>
                <Text style={styles.identityLabel}>ID de Jugador</Text>
                <Text style={styles.identityValue}>{playerId}</Text>
              </View>
              <View style={styles.identityRow}>
                <Text style={styles.identityLabel}>Posición</Text>
                <Badge variant="highlight" label={positionMain?.toUpperCase() || 'SIN POSICIÓN'} />
              </View>
            </Card>

            <Button
              variant="primary"
              label="GUARDAR CAMBIOS"
              icon={Check}
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  photoLink: {
    marginTop: spacing[3],
  },
  photoLinkText: {
    ...typography.bodySM,
    color: colors.textLink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  form: {
    gap: spacing[4],
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  halfField: {
    flex: 1,
  },
  textInput: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    height: 52,
  },
  numberInput: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    height: 52,
    textAlign: 'center',
  },
  footToggle: {
    flexDirection: 'row',
    gap: spacing[2],
    height: 52,
  },
  footBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
  },
  footBtnActive: {
    backgroundColor: colors.accentBlueDim,
    borderColor: colors.accentBlue,
  },
  footBtnText: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  footBtnTextActive: {
    color: colors.accentBlueBright,
  },
  textareaContainer: {
    marginBottom: spacing[4],
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  textarea: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    padding: spacing[4],
    minHeight: 100,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing[1],
  },
  chipSection: {
    marginBottom: spacing[4],
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
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
  identityCard: {
    marginTop: spacing[4],
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  identityTitle: {
    ...typography.headingMD,
    color: colors.accentGold,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  identityLabel: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  identityValue: {
    ...typography.headingMD,
    color: colors.textPrimary,
    fontFamily: 'JetBrainsMono',
  },
  saveButton: {
    width: '100%',
    marginTop: spacing[4],
  },
});
