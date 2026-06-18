import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) {
      setError('Ingresá tu email para continuar');
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <Text style={styles.title}>RECUPERAR CONTRASEÑA</Text>
          <Text style={styles.subtitle}>
            Ingresá tu email y te mandamos un link para restablecer tu contraseña.
          </Text>

          {sent ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✉️</Text>
              <Text style={styles.successTitle}>¡Listo!</Text>
              <Text style={styles.successText}>
                Te mandamos un email a <Text style={styles.emailHighlight}>{email}</Text> con las instrucciones para recuperar tu contraseña.
              </Text>
              <Button
                variant="primary"
                label="VOLVER AL LOGIN"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                label="Tu correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                icon={Mail}
                keyboardType="email-address"
                error={error}
              />

              <Button
                variant="primary"
                label="ENVIAR LINK DE RECUPERACIÓN"
                onPress={handleReset}
                loading={loading}
                style={styles.resetButton}
              />
            </View>
          )}

          <Button
            variant="ghost"
            label="Volver al login"
            onPress={() => navigation.goBack()}
            style={styles.linkBack}
          />
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
  },
  title: {
    ...typography.displayMD,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  subtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  form: {
    gap: spacing[4],
  },
  resetButton: {
    width: '100%',
  },
  linkBack: {
    marginTop: 'auto',
    marginBottom: spacing[8],
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  successIcon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  successTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
    marginBottom: spacing[3],
  },
  successText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  emailHighlight: {
    color: colors.textLink,
    fontWeight: '600',
  },
  backButton: {
    width: 200,
  },
});
