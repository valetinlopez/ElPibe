# Skill: Navegacion

> Estructura de navegacion, stacks, tabs y flows de pantalla para ElPibe.

---

## Cuando usar este skill

- Crear o modificar archivos en `/src/navigation/`
- Configurar React Navigation
- Cambiar la estructura de stacks o tabs
- Agregar nuevas pantallas a la navegacion

---

## Estructura General

```
RootNavigator
  ├── AuthStack (si NO hay sesion)
  │     ├── Login
  │     ├── Register
  │     └── ForgotPassword
  │
  └── MainTabs (si hay sesion)
        ├── TabPerfil → ProfileStack
        │     ├── MiPerfil
        │     └── EditarPerfil
        │
        ├── TabStats → StatsStack
        │     └── Estadisticas
        │
        ├── TabMedia → MediaStack
        │     ├── BibliotecaMultimedia
        │     └── SubirMultimedia
        │
        └── TabAjustes → SettingsStack
              └── Ajustes
```

---

## Dependencias a Instalar

```bash
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-masked-view/masked-view
```

---

## RootNavigator

```jsx
// src/navigation/RootNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {session ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

---

## AuthStack

```jsx
// src/navigation/AuthStack.js
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0E14' },
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
```

---

## MainTabs

```jsx
// src/navigation/MainTabs.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User, BarChart2, Camera, Settings } from 'lucide-react-native';
import ProfileStack from './ProfileStack';
import StatsStack from './StatsStack';
import MediaStack from './MediaStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4C8DFF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#1A1F2B',
          borderTopColor: '#272E3A',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="TabPerfil"
        component={ProfileStack}
        options={{
          tabBarLabel: 'PERFIL',
          tabBarIcon: ({ color, size }) => (
            <User size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TabStats"
        component={StatsStack}
        options={{
          tabBarLabel: 'STATS',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TabMedia"
        component={MediaStack}
        options={{
          tabBarLabel: 'MEDIA',
          tabBarIcon: ({ color, size }) => (
            <Camera size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TabAjustes"
        component={SettingsStack}
        options={{
          tabBarLabel: 'AJUSTES',
          tabBarIcon: ({ color, size }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## ProfileStack

```jsx
// src/navigation/ProfileStack.js
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0E14' },
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
```

---

## StatsStack

```jsx
// src/navigation/StatsStack.js
import { createStackNavigator } from '@react-navigation/stack';
import StatsScreen from '../screens/stats/StatsScreen';

const Stack = createStackNavigator();

export default function StatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0E14' },
      }}
    >
      <Stack.Screen name="Estadisticas" component={StatsScreen} />
    </Stack.Navigator>
  );
}
```

---

## MediaStack

```jsx
// src/navigation/MediaStack.js
import { createStackNavigator } from '@react-navigation/stack';
import MediaLibraryScreen from '../screens/media/MediaLibraryScreen';
import UploadMediaScreen from '../screens/media/UploadMediaScreen';

const Stack = createStackNavigator();

export default function MediaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0E14' },
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
```

---

## SettingsStack

```jsx
// src/navigation/SettingsStack.js
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0E14' },
      }}
    >
      <Stack.Screen name="Ajustes" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

---

## Onboarding (fuera de tabs)

Si el usuario no ha completado el onboarding, mostrarlo antes de MainTabs:

```jsx
// En RootNavigator.js, despues del login:
{session ? (
  profile && profileService.isProfileComplete(profile) ? (
    <MainTabs />
  ) : (
    <OnboardingScreen />
  )
) : (
  <AuthStack />
)}
```

---

## Navegacion entre pantallas

```js
// Desde cualquier screen con useNavigation:
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navegar a editar perfil
navigation.navigate('EditarPerfil');

// Navegar a subir multimedia
navigation.navigate('SubirMultimedia');

// Volver atras
navigation.goBack();

// Navegar a un tab especifico
navigation.navigate('TabMedia');
```

---

## Configuracion de Transiciones

```js
// En screenOptions del Stack:
screenOptions={{
  cardStyleInterpolator: ({ current, next }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
      ],
    },
  }),
}}
```

---

## App.js (Entry Point)

```jsx
// App.js
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css'; // NativeWind

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
```

---

*Skill Navegacion v1.0 — ElPibe*
