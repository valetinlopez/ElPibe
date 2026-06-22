import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function StatCard({ value, label, isRecord = false, icon: Icon }) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        {Icon && <Icon size={24} color={isRecord ? colors.accentGold : colors.textSecondary} style={styles.icon} />}
        <Text style={[styles.value, isRecord && styles.valueRecord]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
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
    paddingVertical: 8,
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    ...typography.displayMD,
    color: colors.textPrimary,
  },
  valueRecord: {
    color: colors.accentGold,
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
