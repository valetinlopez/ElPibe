import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 'bold' }}>
          Forgot Password
        </Text>
      </View>
    </SafeAreaView>
  );
}
