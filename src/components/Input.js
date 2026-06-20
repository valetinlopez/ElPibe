import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  onIconPress,
  style,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {Icon && (
          <TouchableOpacity
            onPress={onIconPress}
            disabled={!onIconPress}
            style={styles.iconButton}
            activeOpacity={onIconPress ? 0.7 : 1}
          >
            <Icon size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, Icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    height: 52,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: colors.accentBlue,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: colors.accentRedCard,
  },
  icon: {
    marginRight: 10,
  },
  iconButton: {
    marginRight: 10,
    padding: 2,
  },
  input: {
    flex: 1,
    ...typography.bodyMD,
    color: colors.textPrimary,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  error: {
    ...typography.caption,
    color: colors.accentRedCard,
    marginTop: 6,
  },
});
