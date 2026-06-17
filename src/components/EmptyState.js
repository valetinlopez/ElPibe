import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={64} color={colors.accentBlueMetal} strokeWidth={1.5} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          label={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.8,
  },
  title: {
    ...typography.headingMD,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
