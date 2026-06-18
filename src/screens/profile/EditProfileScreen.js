import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check, ChevronLeft, Shield } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/profile.service';
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
import { positions } from '../../constants/positions';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [club, setClub] = useState('');
  const [category, setCategory] = useState('');
  const [positionMain, setPositionMain] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await getProfile(user?.id);
    if (data) {
      setFullName(data.full_name || '');
      setBio(data.bio || '');
      setClub(data.club || '');
      setCategory(data.category || '');
      setPositionMain(data.position_main || '');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setToast({ visible: true, type: 'error', message: 'El nombre es obligatorio' });
      return;
    }

    setLoading(true);

    const { error } = await updateProfile(user?.id, {
      full_name: fullName.trim(),
      bio: bio.trim() || null,
      club: club.trim() || null,
      category: category.trim() || null,
      position_main: positionMain || null,
    });

    if (error) {
      setToast({ visible: true, type: 'error', message: error });
    } else {
      setToast({ visible: true, type: 'success', message: '¡Perfil actualizado!' });
      setTimeout(() => navigation.goBack(), 1500);
    }

    setLoading(false);
  };

  const playerId = `#${user?.id?.slice(0, 4).toUpperCase() || '0000'}-${fullName.split(' ')[0]?.toUpperCase() || 'JUGADOR'}-2024`;

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
              uri={null}
              size={96}
              profileComplete={false}
              onPressEdit={() => {}}
            />
            <TouchableOpacity style={styles.photoLink}>
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
                <Text style={styles.identityLabel}>Estatus</Text>
                <Badge variant="highlight" label="TITULAR" />
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
