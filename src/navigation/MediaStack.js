import { createStackNavigator } from '@react-navigation/stack';
import MediaLibraryScreen from '../screens/media/MediaLibraryScreen';
import UploadMediaScreen from '../screens/media/UploadMediaScreen';
import { colors } from '../constants/colors';

const Stack = createStackNavigator();

export default function MediaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bgBase },
      }}
    >
      <Stack.Screen name="BibliotecaMultimedia" component={MediaLibraryScreen} />
      <Stack.Screen
        name="SubirMultimedia"
        component={UploadMediaScreen}
        options={{ presentation: 'modal', animationEnabled: true }}
      />
    </Stack.Navigator>
  );
}
