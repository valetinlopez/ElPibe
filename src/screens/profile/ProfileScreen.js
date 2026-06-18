import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Shield, BadgeCheck, ChevronRight, Swords } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../services/profile.service';
import { calculateRadarAverages } from '../../services/attributes.service';
import { getMediaByProfile } from '../../services/media.service';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import RadarChart from '../../components/RadarChart';
import MediaCard from '../../components/MediaCard';
import Button from '../../components/Button';
import SkeletonLoader from '../../components/SkeletonLoader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await getProfile(user?.id);
    setProfile(data);

    if (data) {
      const { data: radar } = await calculateRadarAverages(data.id);
      setRadarData(radar);

      const { data: mediaData } = await getMediaByProfile(data.id);
      setMedia(mediaData?.slice(0, 4) || []);
    }

    setLoading(false);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Avatar
              uri={profile?.photo_url}
              size={96}
              profileComplete={true}
              onPressEdit={() => navigation.navigate('EditarPerfil')}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{profile?.full_name || 'JUGADOR'}</Text>
              <Badge variant="highlight" label={profile?.position_main?.toUpperCase() || 'MED'} />
            </View>
            {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            <TouchableOpacity style={styles.photoLink}>
              <Text style={styles.photoLinkText}>FOTO DE CANCHA</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.cardRow}>
            <Card style={styles.infoCard}>
              <Shield size={20} color={colors.accentBlueBright} />
              <Text style={styles.infoLabel}>MI CLUB</Text>
              <Text style={styles.infoValue}>{profile?.club || 'Sin club'}</Text>
            </Card>
            <Card style={styles.infoCard}>
              <BadgeCheck size={20} color={colors.accentBlueBright} />
              <Text style={styles.infoLabel}>CATEGORÍA</Text>
              <Text style={styles.infoValue}>{profile?.category || 'Sin categoría'}</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FICHA TÉCNICA</Text>
          <Text style={styles.sectionSubtitle}># {profile?.id?.slice(0, 4).toUpperCase() || '0000'}</Text>
          {radarData && <RadarChart data={radarData} size={width - 64} />}
        </View>

        {media.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DESTACADOS</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TabMedia')}>
                <Text style={styles.seeAll}>ver todo</Text>
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
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Button
            variant="primary"
            label="DESAFIAR AL JUGADOR"
            icon={Swords}
            onPress={() => {}}
            style={styles.challengeButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  hero: {
    position: 'relative',
    paddingBottom: spacing[6],
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgBase,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: spacing[4],
    paddingHorizontal: spacing[4],
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  name: {
    ...typography.displayLG,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  bio: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
  },
  photoLink: {
    marginTop: spacing[4],
  },
  photoLinkText: {
    ...typography.bodySM,
    color: colors.textLink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: spacing[4],
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
  challengeButton: {
    width: '100%',
  },
});
