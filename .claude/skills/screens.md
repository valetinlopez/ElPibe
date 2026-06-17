# Skill: Pantallas

> Implementacion de cada pantalla del MVP de ElPibe.

---

## Cuando usar este skill

- Crear o modificar archivos en `/src/screens/`
- Implementar UI de cada pantalla del ERS
- Conectar pantallas con servicios de Supabase
- Manejar estados de carga, error y vacio

---

## Patron de Screen

Toda pantalla sigue esta estructura:

```jsx
// src/screens/ejemplo/EjemploScreen.js
import { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { colors } from '../../constants/colors';

export default function EjemploScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // ... fetch data
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0E14]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.accentBlueBright} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      <Header title="TITULO" />
      <ScrollView className="flex-1 px-4">
        {/* Contenido */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Splash Screen

```jsx
// src/screens/SplashScreen.js
import { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SplashScreen() {
  const { loading } = useAuth();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-[#0B0E14] items-center justify-center">
      <Animated.View style={{ opacity }} className="items-center">
        <Text className="text-[40px] font-bold text-[#F4F5F7] tracking-wider uppercase"
          style={{ fontFamily: 'WinnerCondensedMedium' }}
        >
          EL PIBE
        </Text>
        <View className="w-16 h-1 bg-[#2D6FE0] mt-2" />
      </Animated.View>
    </View>
  );
}
```

---

## Login Screen

```jsx
// src/screens/auth/LoginScreen.js
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completá todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signIn(email, password);
    if (result.error) {
      setError('Algo salió mal, probá de nuevo');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      <ScrollView className="flex-1 px-6 pt-8">
        {/* Logo */}
        <View className="items-center mb-8">
          <Text className="text-[40px] font-bold text-[#F4F5F7] tracking-wider uppercase"
            style={{ fontFamily: 'WinnerCondensedMedium' }}
          >
            EL PIBE
          </Text>
          <View className="w-16 h-1 bg-[#2D6FE0] mt-2 mb-4" />
          <Text className="text-[14px] text-[#A8AFBD] text-center">
            El potrero digital para los que{'\n'}sienten la 10.
          </Text>
        </View>

        {/* Formulario */}
        <View className="mb-6">
          <Input
            label="Tu email"
            value={email}
            onChangeText={setEmail}
            placeholder="pibe@potrero.com"
            icon={<Mail size={20} color="#A8AFBD" />}
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            icon={<Lock size={20} color="#A8AFBD" />}
          />
        </View>

        {/* Olvidaste contraseña */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          className="items-end mb-6"
        >
          <Text className="text-[14px] text-[#4C8DFF]">
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Error */}
        {error ? (
          <Text className="text-[14px] text-[#E5484D] text-center mb-4">
            {error}
          </Text>
        ) : null}

        {/* Boton principal */}
        <Button
          title="ENTRAR A LA CANCHA"
          onPress={handleLogin}
          loading={loading}
        />

        {/* Separador */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-[#343C4A]" />
          <Text className="mx-4 text-[12px] text-[#6B7280]">O USÁ</Text>
          <View className="flex-1 h-px bg-[#343C4A]" />
        </View>

        {/* Social login (placeholder) */}
        <View className="flex-row gap-4 mb-8">
          <Button title="Google" variant="secondary" onPress={() => {}} />
          <Button title="Apple" variant="secondary" onPress={() => {}} />
        </View>

        {/* Link registro */}
        <View className="items-center pb-8">
          <Text className="text-[14px] text-[#A8AFBD]">
            ¿No tenés cuenta?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-[#4C8DFF] font-semibold">Registrate</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Register Screen

```jsx
// src/screens/auth/RegisterScreen.js
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Completá todos los campos');
      return;
    }
    if (!acceptTerms) {
      setError('Aceptá los términos para continuar');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signUp(email, password, fullName);
    if (result.error) {
      setError('Algo salió mal, probá de nuevo');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#F4F5F7" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[20px] font-bold text-[#F4F5F7] tracking-wider uppercase"
          style={{ fontFamily: 'WinnerCondensedMedium' }}
        >
          EL PIBE
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Titulo */}
        <Text className="text-[40px] font-bold text-[#F4F5F7] tracking-wider uppercase mb-2"
          style={{ fontFamily: 'WinnerCondensedMedium' }}
        >
          CREÁ TU FICHA
        </Text>
        <Text className="text-[14px] text-[#A8AFBD] mb-6">
          Completá tus datos para saltar a la cancha.
        </Text>

        {/* Progress bar */}
        <View className="flex-row gap-2 mb-8">
          <View className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[#2D6FE0]' : 'bg-[#272E3A]'}`} />
          <View className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#2D6FE0]' : 'bg-[#272E3A]'}`} />
          <View className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#2D6FE0]' : 'bg-[#272E3A]'}`} />
        </View>

        {/* Formulario */}
        <View className="mb-6">
          <Input
            label="Nombre Completo (como en el dorsal)"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ej: Diego Armando"
            icon={<User size={20} color="#A8AFBD" />}
          />
          <Input
            label="Tu Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="vos@elpibe.com"
            icon={<Mail size={20} color="#A8AFBD" />}
          />
          <Input
            label="Contraseña Segura"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            icon={<Lock size={20} color="#A8AFBD" />}
          />
        </View>

        {/* Terminos */}
        <TouchableOpacity
          onPress={() => setAcceptTerms(!acceptTerms)}
          className="flex-row items-start mb-6"
        >
          <View className={`w-5 h-5 rounded border mr-3 mt-0.5 items-center justify-center
            ${acceptTerms ? 'bg-[#2D6FE0] border-[#2D6FE0]' : 'border-[#343C4A]'}`}
          >
            {acceptTerms && <Text className="text-white text-[12px]">✓</Text>}
          </View>
          <Text className="text-[13px] text-[#A8AFBD] flex-1">
            Acepto los{' '}
            <Text className="text-[#4C8DFF]">términos de juego</Text>
            {' '}y la política de privacidad del club.
          </Text>
        </TouchableOpacity>

        {/* Error */}
        {error ? (
          <Text className="text-[14px] text-[#E5484D] text-center mb-4">
            {error}
          </Text>
        ) : null}

        {/* Boton */}
        <Button
          title="EMPEZAR MI CARRERA"
          onPress={handleRegister}
          loading={loading}
        />

        {/* Footer visual */}
        <View className="bg-[#12161F] rounded-2xl border border-[#272E3A] p-6 mt-8 mb-4">
          <Text className="text-[13px] text-[#A8AFBD] uppercase tracking-wider">
            BUENOS AIRES • EST. 2024
          </Text>
        </View>

        {/* Link login */}
        <View className="items-center pb-8">
          <Text className="text-[14px] text-[#A8AFBD]">
            ¿Ya sos parte del equipo?{' '}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-[#4C8DFF] font-semibold">Iniciá sesión acá</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Profile Screen

```jsx
// src/screens/profile/ProfileScreen.js
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profile.service';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await profileService.getProfile(user.id);
    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0E14]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4C8DFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      {/* Header con gradiente */}
      <View className="bg-[#0B0E14] pb-6">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-[20px] font-bold text-[#F4F5F7] tracking-wider uppercase"
            style={{ fontFamily: 'WinnerCondensedMedium' }}
          >
            EL PIBE
          </Text>
          <Avatar uri={profile?.photo_url} size={36} />
        </View>

        {/* Avatar grande */}
        <View className="items-center mt-4">
          <Avatar
            uri={profile?.photo_url}
            size={96}
            isComplete={profileService.isProfileComplete(profile)}
          />
          <Text className="text-[32px] font-bold text-[#F4F5F7] tracking-wider uppercase mt-4"
            style={{ fontFamily: 'WinnerCondensedMedium' }}
          >
            {profile?.full_name?.toUpperCase()}
          </Text>
          {profile?.bio && (
            <Text className="text-[14px] text-[#A8AFBD] text-center px-8 mt-2">
              {profile?.bio}
            </Text>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Club y Categoria */}
        <View className="flex-row gap-4 mt-4">
          <Card className="flex-1 items-center">
            <Text className="text-[11px] text-[#A8AFBD] uppercase tracking-wider mb-2">
              MI CLUB
            </Text>
            <Text className="text-[16px] font-semibold text-[#F4F5F7]">
              {profile?.club || 'Sin club'}
            </Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-[11px] text-[#A8AFBD] uppercase tracking-wider mb-2">
              CATEGORÍA
            </Text>
            <Badge label={profile?.category || 'Sin categoría'} variant="destacada" />
          </Card>
        </View>

        {/* Boton desafiar */}
        <Button
          title="DESAFIAR AL JUGADOR"
          onPress={() => {}}
          className="mt-6"
        />

        {/* Ficha tecnica */}
        <Card className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[17px] font-semibold text-[#F4F5F7]">
              FICHA TÉCNICA
            </Text>
            <Text className="text-[14px] text-[#4C8DFF]">#10</Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-[11px] text-[#A8AFBD] uppercase">RITMO</Text>
              <View className="w-16 h-1 bg-[#272E3A] rounded-full mt-2">
                <View className="w-12 h-1 bg-[#2D6FE0] rounded-full" />
              </View>
            </View>
            <View className="items-center">
              <Text className="text-[11px] text-[#A8AFBD] uppercase">REGATE</Text>
              <View className="w-16 h-1 bg-[#272E3A] rounded-full mt-2">
                <View className="w-10 h-1 bg-[#2D6FE0] rounded-full" />
              </View>
            </View>
            <View className="items-center">
              <Text className="text-[11px] text-[#A8AFBD] uppercase">TIRO</Text>
              <View className="w-16 h-1 bg-[#272E3A] rounded-full mt-2">
                <View className="w-14 h-1 bg-[#2D6FE0] rounded-full" />
              </View>
            </View>
          </View>
        </Card>

        {/* Destacados */}
        <View className="mt-6 mb-8">
          <Text className="text-[17px] font-semibold text-[#F4F5F7] mb-4">
            DESTACADOS
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1 aspect-square bg-[#12161F] rounded-xl" />
            <View className="flex-1 aspect-square bg-[#12161F] rounded-xl" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Edit Profile Screen

```jsx
// src/screens/profile/EditProfileScreen.js
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { Toast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profile.service';

const POSITIONS = ['ENGANCHE', 'DELANTERO', 'EXTREMO', 'MEDIOCAMPISTA', 'DEFENSOR', 'ARQUERO'];

export default function EditProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [club, setClub] = useState('');
  const [category, setCategory] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await profileService.getProfile(user.id);
    setProfile(data);
    setFullName(data?.full_name || '');
    setBio(data?.bio || '');
    setClub(data?.club || '');
    setCategory(data?.category || '');
    setPosition(data?.position_main || '');
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await profileService.updateProfile(user.id, {
      full_name: fullName,
      bio,
      club,
      category,
      position_main: position,
    });
    setLoading(false);
    if (error) {
      setToast({ visible: true, message: 'Algo salió mal', type: 'error' });
    } else {
      setToast({ visible: true, message: '¡Perfil guardado!', type: 'success' });
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await profileService.uploadAvatar(user.id, result.assets[0]);
      loadProfile();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#F4F5F7" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[24px] font-bold text-[#F4F5F7] tracking-wider uppercase"
          style={{ fontFamily: 'WinnerCondensedMedium' }}
        >
          EDITAR PERFIL
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Avatar */}
        <View className="items-center mt-4 mb-6">
          <Avatar
            uri={profile?.photo_url}
            size={96}
            isComplete={false}
            onPressEdit={pickImage}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text className="text-[12px] text-[#2D6FE0] mt-2 uppercase tracking-wider">
              FOTO DE CANCHA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <Input
          label="Tu nombre de crack"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Mateo 'El 10' Ferreyra"
        />

        <View className="mb-4">
          <Text className="text-[13px] text-[#A8AFBD] mb-2">Sobre vos (Bio)</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Si querés jugar, jugá en serio..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            maxLength={500}
            className="bg-[#20262F] rounded-xl p-4 text-[#F4F5F7] text-[16px] border border-[#343C4A] min-h-[100px]"
          />
          <Text className="text-[11px] text-[#6B7280] text-right mt-1">
            {bio.length}/500
          </Text>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Input
              label="Club actual"
              value={club}
              onChangeText={setClub}
              placeholder="Fuerte Apache FC"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Categoría"
              value={category}
              onChangeText={setCategory}
              placeholder="U-21 Elite Local"
            />
          </View>
        </View>

        {/* Posiciones */}
        <View className="mb-6">
          <Text className="text-[13px] text-[#A8AFBD] mb-3">
            Posición preferida
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {POSITIONS.map((pos) => (
              <TouchableOpacity
                key={pos}
                onPress={() => setPosition(pos)}
                className={`px-4 py-2 rounded-full border ${
                  position === pos
                    ? 'bg-[#1C3A66] border-[#2D6FE0]'
                    : 'bg-transparent border-[#343C4A]'
                }`}
              >
                <Text className={`text-[13px] ${
                  position === pos ? 'text-[#4C8DFF]' : 'text-[#A8AFBD]'
                }`}>
                  {pos}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Identidad Potrera */}
        <Card className="mb-6">
          <Text className="text-[17px] font-semibold text-[#D4AF37] mb-4">
            IDENTIDAD POTRERA
          </Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[14px] text-[#A8AFBD]">ID de Jugador</Text>
            <Text className="text-[14px] text-[#4C8DFF]">#10-FERREYRA-2024</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[14px] text-[#A8AFBD]">Estatus</Text>
            <Badge label="TITULAR" variant="destacada" />
          </View>
        </Card>

        {/* Boton guardar */}
        <Button
          title="GUARDAR CAMBIOS"
          onPress={handleSave}
          loading={loading}
        />

        <View className="h-8" />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
}
```

---

## Media Library Screen

```jsx
// src/screens/media/MediaLibraryScreen.js
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Camera } from 'lucide-react-native';
import { MediaCard } from '../../components/MediaCard';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { mediaService } from '../../services/media.service';

export default function MediaLibraryScreen({ navigation }) {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const { data } = await mediaService.getMediaByProfile(user.id);
    setMedia(data || []);
    setLoading(false);
  };

  const filteredMedia = filter === 'all'
    ? media
    : media.filter(m => m.category === filter);

  return (
    <SafeAreaView className="flex-1 bg-[#0B0E14]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-[20px] font-bold text-[#F4F5F7] tracking-wider uppercase"
          style={{ fontFamily: 'WinnerCondensedMedium' }}
        >
          EL PIBE
        </Text>
        <Avatar uri={user.user_metadata?.avatar_url} size={36} />
      </View>

      {/* Titulo */}
      <View className="flex-row items-center justify-between px-4 mb-4">
        <View>
          <Text className="text-[24px] font-bold text-[#F4F5F7] tracking-wider uppercase"
            style={{ fontFamily: 'WinnerCondensedMedium' }}
          >
            MEDIA
          </Text>
          <Text className="text-[14px] text-[#A8AFBD]">
            Tus mejores jugadas en el potrero
          </Text>
        </View>
        <TouchableOpacity className="bg-[#20262F] p-3 rounded-xl">
          <Filter size={20} color="#A8AFBD" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Todavía no subiste ninguna jugada"
          description="¡Mostrá lo que tenés!"
          ctaTitle="SUBIR PRIMERA JUGADA"
          onCtaPress={() => navigation.navigate('SubirMultimedia')}
        />
      ) : (
        <FlatList
          data={filteredMedia}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <MediaCard
              uri={item.storage_path}
              type={item.type}
              category={item.category}
              onPress={() => {}}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SubirMultimedia')}
        className="absolute bottom-24 right-6 bg-[#2D6FE0] w-14 h-14 rounded-full items-center justify-center"
      >
        <Camera size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

---

*Skill Pantallas v1.0 — ElPibe*
