import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

export default function Header({ title, onBack, rightAction, rightLabel }) {
  const navigation = useNavigation();

  const canGoBack = navigation.canGoBack() || !!onBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.navigate('TabPerfil', { screen: 'MiPerfil' });
    }
  };

  const handleLogoPress = () => {
    navigation.navigate('TabPerfil', { screen: 'MiPerfil' });
  };

  return (
    <View style={styles.container}>
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
              <ChevronLeft size={24} color={colors.textPrimary} />
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
    paddingTop: spacing[1],
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  leftSlot: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
    height: 36,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    minWidth: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightLabel: {
    ...typography.bodyMD,
    color: colors.textLink,
  },
});
