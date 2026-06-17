import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgBase },
      }}
    >
      <Stack.Screen name="Ajustes" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
