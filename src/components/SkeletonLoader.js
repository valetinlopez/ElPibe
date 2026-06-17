import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { radii } from '../constants/radii';

export default function SkeletonLoader({ variant = 'rectangle', width, height }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getWidth = () => {
    if (width) return width;
    switch (variant) {
      case 'circle':
        return 64;
      case 'text':
        return 200;
      default:
        return '100%';
    }
  };

  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'circle':
        return 64;
      case 'text':
        return 16;
      default:
        return 120;
    }
  };

  return (
    <Animated.View
      style={[
        styles.base,
        variant === 'circle' && styles.circle,
        {
          width: getWidth(),
          height: getHeight(),
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
  },
  circle: {
    borderRadius: radii.full,
  },
});
