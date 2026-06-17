# Skill: UI / Componentes

> Design system completo, componentes reutilizables y reglas de estilo para ElPibe.

---

## Cuando usar este skill

- Crear o modificar componentes en `/src/components/`
- Aplicar estilos con NativeWind
- Usar colores, tipografia o espaciado desde constants
- Crear nuevos componentes UI

---

## Tokens de Color (siempre importar desde constants)

```js
// src/constants/colors.js
export const colors = {
  // Superficies
  bgBase: '#0B0E14',
  bgSurface: '#12161F',
  bgSurfaceRaised: '#1A1F2B',
  bgSurfaceOverlay: '#20262F',

  // Bordes
  borderSubtle: '#272E3A',
  borderDefault: '#343C4A',

  // Acento azul (MAX 1-2 por pantalla)
  accentBlue: '#2D6FE0',
  accentBlueBright: '#4C8DFF',
  accentBlueMetal: '#3A5A8C',
  accentBlueDim: '#1C3A66',

  // Acentos secundarios
  accentSky: '#75AADB',
  accentGold: '#D4AF37',
  accentRedCard: '#E5484D',
  accentYellowCard: '#F2C94C',
  accentGreenSuccess: '#3FB873',

  // Texto
  textPrimary: '#F4F5F7',
  textSecondary: '#A8AFBD',
  textTertiary: '#6B7280',
  textOnAccent: '#FFFFFF',
  textLink: '#4C8DFF',
};
```

---

## Componente Button

```jsx
// src/components/Button.js
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | ghost
  loading = false,
  disabled = false,
  icon,
}) => {
  const baseStyle = 'items-center justify-center rounded-full h-[52px] px-6';

  const variants = {
    primary: disabled
      ? 'bg-[#20262F]'
      : 'bg-[#2D6FE0]',
    secondary: 'border border-[#343C4A] bg-transparent',
    ghost: 'bg-transparent',
  };

  const textVariants = {
    primary: disabled ? 'text-[#6B7280]' : 'text-white',
    secondary: 'text-[#F4F5F7]',
    ghost: 'text-[#4C8DFF]',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnAccent} />
      ) : (
        <Text
          className={`font-semibold text-[15px] uppercase tracking-wide ${textVariants[variant]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

---

## Componente Input

```jsx
// src/components/Input.js
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../constants/colors';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  icon,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-[13px] text-[#A8AFBD] mb-2">{label}</Text>
      <View
        className={`flex-row items-center bg-[#20262F] rounded-xl h-[52px] px-4 border ${
          error
            ? 'border-[#E5484D]'
            : focused
            ? 'border-[#2D6FE0]'
            : 'border-[#343C4A]'
        }`}
      >
        {icon && (
          <View className="mr-3">
            {icon}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[#F4F5F7] text-[16px]"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <Eye size={20} color="#A8AFBD" />
            ) : (
              <EyeOff size={20} color="#A8AFBD" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-[11px] text-[#E5484D] mt-1">{error}</Text>
      )}
    </View>
  );
};
```

---

## Componente Card

```jsx
// src/components/Card.js
import { View } from 'react-native';

export const Card = ({
  children,
  variant = 'default', // default | raised | glow-blue
  className = '',
}) => {
  const variants = {
    default: 'bg-[#12161F] rounded-2xl border border-[#272E3A]',
    raised: 'bg-[#1A1F2B] rounded-2xl border border-[#343C4A]',
    'glow-blue': 'bg-[#12161F] rounded-2xl border border-[#2D6FE0]',
  };

  return (
    <View className={`${variants[variant]} p-4 ${className}`}>
      {children}
    </View>
  );
};
```

---

## Componente Badge

```jsx
// src/components/Badge.js
import { View, Text } from 'react-native';

export const Badge = ({
  label,
  variant = 'default', // default | destacada | gold | tarjeta-amarilla | tarjeta-roja
}) => {
  const variants = {
    default: 'bg-[#20262F]',
    destacada: 'bg-[#1C3A66]',
    gold: 'bg-[rgba(212,175,55,0.15)]',
    'tarjeta-amarilla': 'bg-[#F2C94C]',
    'tarjeta-roja': 'bg-[#E5484D]',
  };

  const textVariants = {
    default: 'text-[#A8AFBD]',
    destacada: 'text-[#4C8DFF]',
    gold: 'text-[#D4AF37]',
    'tarjeta-amarilla': 'text-black',
    'tarjeta-roja': 'text-white',
  };

  return (
    <View
      className={`${variants[variant]} px-3 py-1 rounded-lg self-start`}
    >
      <Text className={`text-[11px] font-medium ${textVariants[variant]}`}>
        {label}
      </Text>
    </View>
  );
};
```

---

## Componente Avatar

```jsx
// src/components/Avatar.js
import { View, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';

export const Avatar = ({
  uri,
  size = 96,
  isComplete = false,
  onPressEdit,
}) => {
  const borderColor = isComplete ? '#3A5A8C' : '#343C4A';

  return (
    <View className="items-center">
      <View
        className="rounded-full border-2 overflow-hidden"
        style={{
          width: size,
          height: size,
          borderColor,
        }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-[#20262F]">
            <User size={40} color="#6B7280" />
          </View>
        )}
      </View>
      {onPressEdit && (
        <TouchableOpacity
          onPress={onPressEdit}
          className="absolute bottom-0 right-0 bg-[#2D6FE0] rounded-full p-2"
        >
          <Camera size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
```

---

## Componente Header

```jsx
// src/components/Header.js
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export const Header = ({
  title,
  onBack,
  rightAction,
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#0B0E14]">
      <View className="w-11">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#F4F5F7" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-[24px] font-bold text-[#F4F5F7] tracking-wider uppercase">
        {title}
      </Text>
      <View className="w-11 items-end">
        {rightAction}
      </View>
    </View>
  );
};
```

---

## Componente StatCard

```jsx
// src/components/StatCard.js
import { View, Text } from 'react-native';
import { colors } from '../constants/colors';

export const StatCard = ({
  value,
  label,
  isHighlight = false,
}) => {
  return (
    <View className="bg-[#12161F] rounded-2xl border border-[#272E3A] p-4 items-center flex-1">
      <Text
        className={`text-[24px] font-bold ${
          isHighlight ? 'text-[#D4AF37]' : 'text-[#F4F5F7]'
        }`}
      >
        {value}
      </Text>
      <Text className="text-[11px] text-[#A8AFBD] uppercase tracking-wider mt-1">
        {label}
      </Text>
    </View>
  );
};
```

---

## Componente MediaCard

```jsx
// src/components/MediaCard.js
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Play } from 'lucide-react-native';

export const MediaCard = ({
  uri,
  type, // video | photo
  category,
  duration,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl overflow-hidden"
      activeOpacity={0.9}
    >
      <Image
        source={{ uri }}
        className="w-full"
        style={{
          aspectRatio: type === 'video' ? 9 / 16 : 1,
        }}
        resizeMode="cover"
      />
      {/* Overlay inferior */}
      <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <View className="flex-row items-center">
          {type === 'video' && (
            <Play size={12} color="white" fill="white" />
          )}
          {duration && (
            <Text className="text-white text-[11px] ml-1">{duration}</Text>
          )}
        </View>
      </View>
      {/* Badge categoria */}
      {category && (
        <View className="absolute top-2 left-2 bg-[rgba(11,14,20,0.7)] px-2 py-1 rounded">
          <Text className="text-white text-[11px]">{category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
```

---

## Componente EmptyState

```jsx
// src/components/EmptyState.js
import { View, Text } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Camera,
  title,
  description,
  ctaTitle,
  onCtaPress,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="mb-4">
        <Icon size={64} color="#3A5A8C" strokeWidth={1} />
      </View>
      <Text className="text-[16px] text-[#A8AFBD] text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-[14px] text-[#6B7280] text-center mb-6">
          {description}
        </Text>
      )}
      {ctaTitle && onCtaPress && (
        <Button title={ctaTitle} onPress={onCtaPress} />
      )}
    </View>
  );
};
```

---

## Componente Toast

```jsx
// src/components/Toast.js
import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { CheckCircle, AlertCircle } from 'lucide-react-native';

export const Toast = ({
  visible,
  message,
  type = 'success', // success | error
  onDismiss,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss?.());
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor = type === 'success' ? '#1A1F2B' : '#1A1F2B';
  const borderColor = type === 'success' ? '#3FB873' : '#E5484D';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? '#3FB873' : '#E5484D';

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute bottom-24 left-4 right-4"
    >
      <View
        className="flex-row items-center p-4 rounded-xl border-l-4"
        style={{
          backgroundColor: bgColor,
          borderLeftColor: borderColor,
        }}
      >
        <Icon size={20} color={iconColor} />
        <Text className="text-[#F4F5F7] text-[14px] ml-3 flex-1">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};
```

---

## Reglas de Estilo

1. **Colores**: SIEMPRE desde `colors.js`, nunca hardcodear hex
2. **Tipografia**: Usar estilos de NativeWind (`text-[size]`, `font-bold`, etc.)
3. **Espaciado**: Sistema base 4px (p-1=4, p-2=8, p-3=12, p-4=16, etc.)
4. **Border radius**: `rounded-lg`=12, `rounded-xl`=16, `rounded-2xl`=20, `rounded-full`=999
5. **Azul**: Max 1-2 elementos por pantalla
6. **Tap targets**: Minimo 44x44px (usar `hitSlop`)
7. **Dark mode**: SIEMPRE fondo oscuro, nunca blanco

---

*Skill UI/Componentes v1.0 — ElPibe*
