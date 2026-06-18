import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { positions } from '../../constants/positions';

export default function OnboardingStep3({ data, onNext, onBack, loading }) {
  const [positionMain, setPositionMain] = useState(data?.positionMain || '');
  const [positionSecondary, setPositionSecondary] = useState(data?.positionSecondary || '');
  const [club, setClub] = useState(data?.club || '');
  const [category, setCategory] = useState(data?.category || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!positionMain) {
      setError('Elegí tu posición principal');
      return;
    }
    onNext({ positionMain, positionSecondary, club, category });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboard}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar currentStep={3} totalSteps={3} />

        <Text style={styles.title}>DATOS DEPORTIVOS</Text>
        <Text style={styles.subtitle}>Definí tu rol en la cancha.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Posición principal *</Text>
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
                  {pos.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Posición secundaria</Text>
          <View style={styles.chipContainer}>
            {positions.map((pos) => (
              <TouchableOpacity
                key={pos.id}
                style={[
                  styles.chip,
                  positionSecondary === pos.id && styles.chipActive,
                ]}
                onPress={() => setPositionSecondary(
                  positionSecondary === pos.id ? '' : pos.id
                )}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    positionSecondary === pos.id && styles.chipTextActive,
                  ]}
                >
                  {pos.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Club"
            value={club}
            onChangeText={setClub}
            placeholder="Tu club actual"
          />

          <Input
            label="Categoría"
            value={category}
            onChangeText={setCategory}
            placeholder="U-21 Elite Local"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.buttons}>
          <Button
            variant="ghost"
            label="ATRÁS"
            onPress={onBack}
            style={styles.backButton}
          />
          <Button
            variant="primary"
            label="EMPEZAR MI CARRERA"
            onPress={handleNext}
            loading={loading}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
  title: {
    ...typography.displayMD,
    color: colors.textPrimary,
    marginTop: spacing[6],
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    marginBottom: spacing[6],
  },
  form: {
    gap: spacing[3],
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: spacing[2],
    marginTop: spacing[2],
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
  error: {
    ...typography.bodySM,
    color: colors.accentRedCard,
    marginTop: spacing[2],
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[6],
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
