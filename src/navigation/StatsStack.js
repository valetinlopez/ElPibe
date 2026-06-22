import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatsScreen from '../screens/stats/StatsScreen';
import AttributesScreen from '../screens/attributes/AttributesScreen';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function StatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgBase },
      }}
    >
      <Stack.Screen name="Estadisticas" component={StatsScreen} />
      <Stack.Screen name="Atributos" component={AttributesScreen} />
    </Stack.Navigator>
  );
}
