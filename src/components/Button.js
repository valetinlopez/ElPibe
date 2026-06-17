import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

export default function Button({
  variant = 'primary',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon: Icon,
  style,
}) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.textOnAccent : colors.accentBlueBright} />
      ) : (
        <>
          {Icon && <Icon size={20} color={isPrimary ? colors.textOnAccent : colors.accentBlueBright} style={styles.icon} />}
          <Text
            style={[
              styles.label,
              isPrimary && styles.labelPrimary,
              isSecondary && styles.labelSecondary,
              isGhost && styles.labelGhost,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24,
    borderRadius: radii.full,
  },
  primary: {
    backgroundColor: colors.accentBlue,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    ...typography.buttonText,
    textTransform: 'uppercase',
  },
  labelPrimary: {
    color: colors.textOnAccent,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelGhost: {
    color: colors.textLink,
  },
  labelDisabled: {
    color: colors.textTertiary,
  },
});
