import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User, BarChart2, Camera, Settings } from 'lucide-react-native';
import ProfileStack from './ProfileStack';
import StatsStack from './StatsStack';
import MediaStack from './MediaStack';
import SettingsStack from './SettingsStack';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentBlueBright,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.bgSurfaceRaised,
          borderTopColor: colors.borderSubtle,
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
