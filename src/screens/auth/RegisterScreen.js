import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Mail, Lock, User, Zap } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Completá todos los campos');
      return;
    }

    if (!acceptTerms) {
      setError('Aceptá los términos para continuar');
      return;
    }

    setLoading(true);
    setError('');

    const { error: authError } = await signUp(email, password, fullName);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logo}>EL PIBE</Text>
          </View>

          <Text style={styles.title}>CREÁ TU FICHA</Text>
          <Text style={styles.subtitle}>
            Completá tus datos para saltar a la cancha.
          </Text>

          <ProgressBar currentStep={1} totalSteps={3} />

          <View style={styles.form}>
            <Input
              label="Nombre Completo (como en el dorsal)"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Tu nombre de crack"
              icon={User}
            />

            <Input
              label="Tu Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              icon={Mail}
              keyboardType="email-address"
            />

            <Input
              label="Contraseña Segura"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              icon={Lock}
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={styles.checkbox}
              activeOpacity={0.7}
            >
              <View style={[styles.check, acceptTerms && styles.checkActive]}>
                {acceptTerms && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                Acepto los términos de juego y la política de privacidad del club.
              </Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              label="EMPEZAR MI CARRERA"
              icon={Zap}
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              ¿Ya sos parte del equipo? <Text style={styles.loginHighlight}>Iniciá sesión acá</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>BUENOS AIRES • EST. 2024</Text>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  logo: {
    ...typography.displayLG,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  title: {
    ...typography.displayXL,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  form: {
    marginTop: spacing[6],
    marginBottom: spacing[6],
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[6],
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurfaceOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
    marginTop: 2,
  },
  checkActive: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
  },
  checkIcon: {
    color: colors.textOnAccent,
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    ...typography.bodySM,
    color: colors.textSecondary,
    flex: 1,
  },
  errorText: {
    ...typography.bodySM,
    color: colors.accentRedCard,
    marginBottom: spacing[3],
  },
  registerButton: {
    width: '100%',
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  loginText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  loginHighlight: {
    color: colors.textLink,
    fontWeight: '600',
  },
  footer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
