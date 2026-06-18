import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export default function OnboardingStep1({ data, onNext }) {
  const [fullName, setFullName] = useState(data?.fullName || '');
  const [age, setAge] = useState(data?.age || '');
  const [city, setCity] = useState(data?.city || '');
  const [nationality, setNationality] = useState(data?.nationality || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!fullName || !age || !city || !nationality) {
      setError('Completá todos los campos');
      return;
    }
    onNext({ fullName, age: parseInt(age), city, nationality });
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
        <ProgressBar currentStep={1} totalSteps={3} />

        <Text style={styles.title}>DATOS PERSONALES</Text>
        <Text style={styles.subtitle}>Contanos sobre vos.</Text>

        <View style={styles.form}>
          <Input
            label="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre de crack"
          />

          <Input
            label="Edad"
            value={age}
            onChangeText={setAge}
            placeholder="22"
            keyboardType="numeric"
          />

          <Input
            label="Ciudad"
            value={city}
            onChangeText={setCity}
            placeholder="Buenos Aires"
          />

          <Input
            label="Nacionalidad"
            value={nationality}
            onChangeText={setNationality}
            placeholder="Argentino"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button
          variant="primary"
          label="SIGUIENTE"
          onPress={handleNext}
          style={styles.button}
        />
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
  error: {
    ...typography.bodySM,
    color: colors.accentRedCard,
    marginTop: spacing[2],
  },
  button: {
    width: '100%',
    marginTop: spacing[6],
  },
});
