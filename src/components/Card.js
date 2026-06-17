import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { radii } from '../constants/radii';

export default function Card({ variant = 'default', children, style }) {
  return (
    <View
      style={[
        styles.base,
        variant === 'raised' && styles.raised,
        variant === 'glow' && styles.glow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  raised: {
    backgroundColor: colors.bgSurfaceRaised,
    borderColor: colors.borderDefault,
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  glow: {
    borderColor: colors.accentBlueMetal,
    shadowColor: colors.accentBlue,
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
});
