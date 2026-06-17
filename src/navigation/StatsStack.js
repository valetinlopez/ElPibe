import { createStackNavigator } from '@react-navigation/stack';
import StatsScreen from '../screens/stats/StatsScreen';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();

export default function StatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgBase },
      }}
    >
      <Stack.Screen name="Estadisticas" component={StatsScreen} />
    </Stack.Navigator>
  );
}
