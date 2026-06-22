import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MediaLibraryScreen from '../screens/media/MediaLibraryScreen';
import UploadMediaScreen from '../screens/media/UploadMediaScreen';
import VideoPlayerScreen from '../screens/media/VideoPlayerScreen';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

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
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
