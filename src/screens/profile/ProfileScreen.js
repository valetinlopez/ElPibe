import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, BadgeCheck, Pencil, Clipboard } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../services/profile.service';
import { calculateRadarAverages } from '../../services/attributes.service';
import { getMediaByProfile } from '../../services/media.service';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import RadarChart from '../../components/RadarChart';
import MediaCard from '../../components/MediaCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getProfile(user.id);
      setProfile(data);

      if (data) {
        const { data: radar } = await calculateRadarAverages(data.id);
        setRadarData(radar);

        const { data: mediaData } = await getMediaByProfile(data.id);
        setMedia(mediaData?.slice(0, 4) || []);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <SkeletonLoader variant="circle" width={96} height={96} />
          <SkeletonLoader variant="text" width={200} height={28} />
          <SkeletonLoader variant="rectangle" width={width - 32} height={200} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Avatar
              uri={profile?.photo_url}
              size={96}
              profileComplete={!!profile?.position_main}
              onPressEdit={() => navigation.navigate('EditarPerfil')}
            />
            <View style={styles.nameColumn}>
              <Text style={styles.name}>{profile?.full_name || 'JUGADOR'}</Text>
              <Badge variant="highlight" label={profile?.position_main?.toUpperCase() || '--'} />
            </View>
            {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditarPerfil')}
              activeOpacity={0.7}
            >
              <Pencil size={16} color={colors.textSecondary} />
              <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.firstSection}>
          <View style={styles.cardRow}>
            <Card style={styles.infoCard}>
              <Shield size={30} color={colors.accentBlueBright} />
              <Text style={styles.infoLabel}>MI CLUB</Text>
              <Text style={styles.infoValue}>{profile?.club || 'Sin club'}</Text>
            </Card>
            <Card style={styles.infoCard}>
              <BadgeCheck size={30} color={colors.accentBlueBright} />
              <Text style={styles.infoLabel}>CATEGORÍA</Text>
              <Text style={styles.infoValue}>{profile?.category || 'Sin categoría'}</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Clipboard size={18} color={colors.accentBlueBright} />
            <Text style={styles.sectionTitle}>FICHA TÉCNICA</Text>
          </View>
          {radarData && <RadarChart data={radarData} size={width - 64} />}
        </View>

        {media.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DESTACADOS</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TabMedia')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mediaGrid}>
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  uri={item.storage_path}
                  type={item.type}
                  category={item.category}
                  style={styles.mediaItem}
                  onPress={() => {
                    if (item.type === 'video') {
                      navigation.navigate('TabMedia', {
                        screen: 'VideoPlayer',
                        params: { uri: item.storage_path, category: item.category },
                      });
                    }
                  }}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Todavía no subiste ninguna jugada.</Text>
              <Text style={styles.emptySubtitle}>¡Mostrá lo que tenés!</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('TabMedia')}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyButtonText}>SUBIR PRIMERA JUGADA</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 64 + spacing[6],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  hero: {
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: spacing[8],
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: spacing[5],
    paddingHorizontal: spacing[4],
  },
  nameColumn: {
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  name: {
    ...typography.displayMD,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bio: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurfaceOverlay,
  },
  editButtonText: {
    ...typography.bodySM,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  firstSection: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  sectionSubtitle: {
    ...typography.bodySM,
    color: colors.textTertiary,
    marginBottom: spacing[4],
  },
  seeAll: {
    ...typography.bodySM,
    color: colors.textLink,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing[2],
    textTransform: 'uppercase',
  },
  infoValue: {
    ...typography.headingMD,
    color: colors.textPrimary,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  mediaItem: {
    width: (width - spacing[4] * 2 - spacing[2]) / 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
  },
  emptyTitle: {
    ...typography.headingMD,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodyMD,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  emptyButton: {
    marginTop: spacing[5],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radii.full,
    backgroundColor: colors.accentBlue,
  },
  emptyButtonText: {
    ...typography.bodySM,
    color: colors.textOnAccent,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
