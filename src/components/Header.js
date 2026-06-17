import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function Header({ title, onBack, rightAction, rightLabel }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Volver"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightAction ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={rightAction}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {rightLabel ? (
              <Text style={styles.rightLabel}>{rightLabel}</Text>
            ) : null}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    minWidth: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
  title: {
    ...typography.displayMD,
    color: colors.textPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rightLabel: {
    ...typography.bodyMD,
    color: colors.textLink,
  },
});
