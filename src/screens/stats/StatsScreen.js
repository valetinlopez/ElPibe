import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

export default function StatsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 'bold' }}>
          Estadísticas
        </Text>
      </View>
    </SafeAreaView>
  );
}
