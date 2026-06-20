import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, CircleDot } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

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
            <Text style={styles.logo}>EL PIBE</Text>
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
              error={error && !password ? error : null}
            />

            <Input
              label="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              icon={showPassword ? EyeOff : Lock}
              secureTextEntry={!showPassword}
              onIconPress={() => setShowPassword(!showPassword)}
              error={error && !email ? error : null}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              label="ENTRAR A LA CANCHA"
              icon={CircleDot}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O USÁ</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              variant="secondary"
              label="GOOGLE"
              onPress={() => {}}
              style={styles.socialButton}
            />
            <Button
              variant="secondary"
              label="APPLE"
              onPress={() => {}}
              style={styles.socialButton}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              ¿No tenés cuenta? <Text style={styles.registerHighlight}>Registrate</Text>
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
  logo: {
    ...typography.displayXL,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing[6],
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing[5],
  },
  forgotText: {
    ...typography.bodySM,
    color: colors.textLink,
  },
  loginButton: {
    width: '100%',
  },
  errorText: {
    ...typography.bodySM,
    color: colors.accentRedCard,
    marginBottom: spacing[3],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginHorizontal: spacing[3],
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  socialButton: {
    flex: 1,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 'auto',
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
