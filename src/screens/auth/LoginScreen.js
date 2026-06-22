import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completá todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.appLogo}
                resizeMode="contain"
              />
              <Text style={styles.logo}>EL PIBE</Text>
            </View>
            <Text style={styles.tagline}>
              El potrero digital para los que sienten la 10.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              icon={Mail}
              keyboardType="email-address"
            />

            <Input
              label="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              icon={showPassword ? EyeOff : Eye}
              secureTextEntry={!showPassword}
              onIconPress={() => setShowPassword(!showPassword)}
            />

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              label="ENTRAR A LA CANCHA"
              icon={LogIn}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              ¿No tenés cuenta?{' '}
              <Text style={styles.registerHighlight}>Registrate</Text>
            </Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginTop: spacing[12],
    marginBottom: spacing[8],
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing[4],
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  logo: {
    ...typography.displayXL,
    color: colors.textPrimary,
    letterSpacing: 2,
    marginTop: spacing[2],
  },
  tagline: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  form: {
    marginTop: spacing[4],
  },
  errorContainer: {
    backgroundColor: colors.accentRedCard + '1A',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accentRedCard,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  errorText: {
    ...typography.bodySM,
    color: colors.accentRedCard,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing[5],
    minHeight: 44,
    justifyContent: 'center',
  },
  forgotText: {
    ...typography.bodySM,
    color: colors.textLink,
  },
  loginButton: {
    width: '100%',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: spacing[8],
    minHeight: 44,
    justifyContent: 'center',
  },
  registerText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  registerHighlight: {
    color: colors.textLink,
    fontWeight: '600',
  },
});
