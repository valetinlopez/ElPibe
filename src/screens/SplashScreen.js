import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function SplashScreen({ navigation }) {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (session) {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [session, loading, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>EL PIBE</Text>
        <ActivityIndicator
          size="large"
          color={colors.accentBlueBright}
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.displayXL,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  loader: {
    marginTop: 32,
  },
});
