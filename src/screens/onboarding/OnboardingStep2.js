import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { footOptions } from '../../constants/positions';

export default function OnboardingStep2({ data, onNext, onBack }) {
  const [heightCm, setHeightCm] = useState(data?.heightCm?.toString() || '');
  const [weightKg, setWeightKg] = useState(data?.weightKg?.toString() || '');
  const [foot, setFoot] = useState(data?.foot || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!heightCm || !weightKg || !foot) {
      setError('Completá todos los campos');
      return;
    }
    onNext({ heightCm: parseInt(heightCm), weightKg: parseInt(weightKg), foot });
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
        <ProgressBar currentStep={2} totalSteps={3} />

        <Text style={styles.title}>DATOS FÍSICOS</Text>
        <Text style={styles.subtitle}>Definí tu físico de cancha.</Text>

        <View style={styles.form}>
          <Input
            label="Altura (cm)"
            value={heightCm}
            onChangeText={setHeightCm}
            placeholder="178"
            keyboardType="numeric"
          />

          <Input
            label="Peso (kg)"
            value={weightKg}
            onChangeText={setWeightKg}
            placeholder="75"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Pierna hábil</Text>
          <View style={styles.chipContainer}>
            {footOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.chip,
                  foot === option.id && styles.chipActive,
                ]}
                onPress={() => setFoot(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    foot === option.id && styles.chipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
            label="SIGUIENTE"
            onPress={handleNext}
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
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
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
    ...typography.bodyMD,
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
