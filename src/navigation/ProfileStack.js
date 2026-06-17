import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgBase },
      }}
    >
      <Stack.Screen name="MiPerfil" component={ProfileScreen} />
      <Stack.Screen
        name="EditarPerfil"
        component={EditProfileScreen}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
}
