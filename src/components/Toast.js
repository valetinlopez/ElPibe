import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { radii } from '../constants/radii';

export default function Toast({ visible, type = 'success', message, onDismiss }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss?.());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: colors.accentGreenSuccess, borderColor: colors.accentGreenSuccess };
      case 'error':
        return { icon: AlertCircle, color: colors.accentRedCard, borderColor: colors.accentRedCard };
      case 'warning':
        return { icon: AlertTriangle, color: colors.accentYellowCard, borderColor: colors.accentYellowCard };
      default:
        return { icon: CheckCircle, color: colors.accentGreenSuccess, borderColor: colors.accentGreenSuccess };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
          opacity,
          borderLeftColor: config.borderColor,
        },
      ]}
    >
      <Icon size={20} color={config.color} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurfaceRaised,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
});
