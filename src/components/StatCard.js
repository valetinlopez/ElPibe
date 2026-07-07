import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function StatCard({ value, label, isRecord = false, icon: Icon }) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        {Icon && (
          <Icon
            size={18}
            color={isRecord ? colors.accentGold : colors.accentBlueBright}
            style={styles.icon}
          />
        )}
        <Text style={[styles.value, isRecord && styles.valueRecord]}>{value}</Text>
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  icon: {
    marginBottom: 4,
  },
  value: {
    ...typography.headingLG,
    color: colors.textPrimary,
  },
  valueRecord: {
    color: colors.accentGold,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
