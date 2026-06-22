import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { User, Lock, Bell, FileText, Shield, MessageCircle, Bug, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';

function SettingsItem({ icon: Icon, label, onPress, color = colors.textPrimary }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Icon size={20} color={color} />
        <Text style={[styles.itemLabel, { color }]}>{label}</Text>
      </View>
      <ChevronRight size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

function SettingsSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut: authSignOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    setLoading(true);
    await authSignOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="AJUSTES" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <SettingsSection title="CUENTA">
          <SettingsItem
            icon={User}
            label="Editar perfil"
            onPress={() => navigation.navigate('TabPerfil', { screen: 'EditarPerfil' })}
          />
          <SettingsItem
            icon={Lock}
            label="Cambiar contraseña"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="PREFERENCIAS">
          <SettingsItem
            icon={Bell}
            label="Notificaciones"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="LEGAL">
          <SettingsItem
            icon={FileText}
            label="Términos y condiciones"
            onPress={() => {}}
          />
          <SettingsItem
            icon={Shield}
            label="Política de privacidad"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="SOPORTE">
          <SettingsItem
            icon={MessageCircle}
            label="Contacto"
            onPress={() => {}}
          />
          <SettingsItem
            icon={Bug}
            label="Reportar bug"
            onPress={() => {}}
          />
        </SettingsSection>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={loading}
        >
          <LogOut size={20} color={colors.accentRedCard} />
          <Text style={styles.logoutText}>
            {loading ? 'Cerrando sesión...' : 'CERRAR SESIÓN'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>ElPibe v1.0.0</Text>
      </ScrollView>
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
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[2],
    marginLeft: spacing[4],
  },
  sectionContent: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  itemLabel: {
    ...typography.bodyMD,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    paddingVertical: spacing[4],
    marginTop: spacing[4],
    borderWidth: 1,
    borderColor: colors.accentRedCard,
  },
  logoutText: {
    ...typography.buttonText,
    color: colors.accentRedCard,
    textTransform: 'uppercase',
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[6],
  },
});
