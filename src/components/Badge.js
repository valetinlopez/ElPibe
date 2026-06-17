import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

export default function Badge({ variant = 'default', label, icon: Icon }) {
  return (
    <View
      style={[
        styles.base,
        variant === 'highlight' && styles.highlight,
        variant === 'achievement' && styles.achievement,
        variant === 'yellow' && styles.yellow,
        variant === 'red' && styles.red,
      ]}
    >
      {Icon && <Icon size={14} color={getTextColor(variant)} style={styles.icon} />}
      <Text style={[styles.label, { color: getTextColor(variant) }]}>{label}</Text>
    </View>
  );
}

const getTextColor = (variant) => {
  switch (variant) {
    case 'highlight':
      return colors.accentBlueBright;
    case 'achievement':
      return colors.accentGold;
    case 'yellow':
      return colors.bgBase;
    case 'red':
      return colors.textOnAccent;
    default:
      return colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceOverlay,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  highlight: {
    backgroundColor: colors.accentBlueDim,
  },
  achievement: {
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  yellow: {
    backgroundColor: colors.accentYellowCard,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  red: {
    backgroundColor: colors.accentRedCard,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    ...typography.caption,
  },
});
