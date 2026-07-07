import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

export default function Header({ title, onBack, rightAction, rightLabel }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const canGoBack = navigation.canGoBack() || !!onBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      navigation.goBack();
    }
  };

  const handleLogoPress = () => {
    navigation.navigate('TabPerfil', { screen: 'MiPerfil' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 2 }]}>
      <View style={styles.row}>
        <View style={styles.leftSlot}>
          {canGoBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              accessibilityLabel="Volver"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ChevronLeft size={26} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {title ? (
          <View style={styles.titleContainer}>
            <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={handleLogoPress}
            activeOpacity={0.8}
            accessibilityLabel="Ir a mi perfil"
          >
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
            />
          </TouchableOpacity>
        )}

        <View style={styles.rightSlot}>
          {rightAction ? (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={rightAction}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              {typeof rightLabel === 'string' ? (
                <Text style={styles.rightLabel}>{rightLabel}</Text>
              ) : (
                rightLabel
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  leftSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
    height: 40,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    ...typography.headingMD,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  rightButton: {
    minWidth: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightLabel: {
    ...typography.bodyMD,
    color: colors.textLink,
  },
});
