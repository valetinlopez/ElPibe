import { View, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../constants/colors';
import { radii } from '../constants/radii';

export default function ProgressBar({ currentStep, totalSteps }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep && styles.segmentActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.borderSubtle,
  },
  segmentActive: {
    backgroundColor: colors.accentBlue,
  },
});
