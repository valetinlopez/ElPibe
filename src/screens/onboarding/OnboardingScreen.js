import { useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { createProfile } from '../../services/profile.service';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [slideAnim] = useState(new Animated.Value(0));

  const slideTo = (toValue) => {
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    slideTo(-width);
    setTimeout(() => {
      setStep((prev) => prev + 1);
      slideAnim.setValue(width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 50);
  };

  const handleBack = () => {
    slideTo(width);
    setTimeout(() => {
      setStep((prev) => prev - 1);
      slideAnim.setValue(-width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 50);
  };

  const handleComplete = async (stepData) => {
    const allData = { ...formData, ...stepData };
    setLoading(true);

    const profileData = {
      id: user.id,
      full_name: allData.fullName,
      age: allData.age,
      city: allData.city,
      nationality: allData.nationality,
      height_cm: allData.heightCm,
      weight_kg: allData.weightKg,
      foot: allData.foot,
      position_main: allData.positionMain,
      position_secondary: allData.positionSecondary || null,
      club: allData.club || null,
      category: allData.category || null,
    };

    const { error } = await createProfile(profileData);

    if (!error) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }

    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <OnboardingStep1 data={formData} onNext={handleNext} />;
      case 2:
        return <OnboardingStep2 data={formData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <OnboardingStep3 data={formData} onNext={handleComplete} onBack={handleBack} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {renderStep()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    flex: 1,
  },
});
