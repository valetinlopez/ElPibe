import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Trophy, AlertTriangle, Sliders, MapPin, Clock, User } from 'lucide-react-native';
import FootballIcon from '../../components/FootballIcon';
import BootIcon from '../../components/BootIcon';
import { useAuth } from '../../context/AuthContext';
import { getStatsBySeason, upsertStats } from '../../services/stats.service';
import { calculateRadarAverages } from '../../services/attributes.service';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import RadarChart from '../../components/RadarChart';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Toast from '../../components/Toast';
import SkeletonLoader from '../../components/SkeletonLoader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';

const SEASONS = ['2026', '2025', '2024'];

export default function StatsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [season, setSeason] = useState('2026');
  const [stats, setStats] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  const [matches, setMatches] = useState('');
  const [goals, setGoals] = useState('');
  const [assists, setAssists] = useState('');
  const [minutes, setMinutes] = useState('');
  const [yellowCards, setYellowCards] = useState('');
  const [redCards, setRedCards] = useState('');

  useEffect(() => {
    loadStats();
  }, [season]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (user?.id) {
        const { data: radar } = await calculateRadarAverages(user.id);
        setRadarData(radar);
      }
    });
    return unsubscribe;
  }, [user?.id, navigation]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await getStatsBySeason(user?.id, season);
      setStats(data);

      if (data) {
        setMatches(data.matches?.toString() || '');
        setGoals(data.goals?.toString() || '');
        setAssists(data.assists?.toString() || '');
        setMinutes(data.minutes?.toString() || '');
        setYellowCards(data.yellow_cards?.toString() || '');
        setRedCards(data.red_cards?.toString() || '');
      } else {
        setMatches('');
        setGoals('');
        setAssists('');
        setMinutes('');
        setYellowCards('');
        setRedCards('');
      }

      const { data: radar } = await calculateRadarAverages(user?.id);
      setRadarData(radar);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const statsData = {
        profile_id: user?.id,
        season,
        matches: parseInt(matches) || 0,
        goals: parseInt(goals) || 0,
        assists: parseInt(assists) || 0,
        minutes: parseInt(minutes) || 0,
        yellow_cards: parseInt(yellowCards) || 0,
        red_cards: parseInt(redCards) || 0,
      };

      const { error } = await upsertStats(statsData);

      if (error) {
        setToast({ visible: true, type: 'error', message: error });
      } else {
        setToast({ visible: true, type: 'success', message: '¡Estadísticas guardadas!' });
        const { data: radar } = await calculateRadarAverages(user?.id);
        setRadarData(radar);
      }
    } catch (error) {
      setToast({ visible: true, type: 'error', message: 'Algo salió mal, probá de nuevo' });
    } finally {
      setSaving(false);
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <SkeletonLoader variant="rectangle" width="100%" height={100} />
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} variant="rectangle" width="48%" height={80} />
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <EmptyState
      icon={Trophy}
      title="Todavía no cargaste estadísticas."
      description="¡Armá tu ficha!"
      actionLabel="CARGAR PRIMERAS STATS"
      onAction={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.seasonSelector}>
          {SEASONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.seasonChip, season === s && styles.seasonChipActive]}
              onPress={() => setSeason(s)}
            >
              <Text style={[styles.seasonText, season === s && styles.seasonTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? renderLoading() : (
          <>
            <View style={styles.statsGrid}>
              <StatCard value={matches || '0'} label="PARTIDOS" icon={MapPin} />
              <StatCard value={goals || '0'} label="GOLES" icon={FootballIcon} />
              <StatCard value={assists || '0'} label="ASISTENCIAS" icon={BootIcon} />
              <StatCard value={minutes || '0'} label="MINUTOS" icon={Clock} />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.yellowCard}>
                <AlertTriangle size={18} color={colors.accentGold} />
                <Text style={styles.cardLabel}>AMARILLAS</Text>
                <Text style={styles.cardValue}>{yellowCards || '0'}</Text>
              </View>
              <View style={styles.redCard}>
                <AlertTriangle size={18} color={colors.accentRedCard} />
                <Text style={styles.cardLabel}>ROJAS</Text>
                <Text style={styles.cardValue}>{redCards || '0'}</Text>
              </View>
            </View>

            {parseInt(matches) > 0 && (
              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>
                    {(parseInt(goals) / parseInt(matches)).toFixed(2)}
                  </Text>
                  <Text style={styles.metricLabel}>GOLES/PARTIDO</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>
                    {(parseInt(assists) / parseInt(matches)).toFixed(2)}
                  </Text>
                  <Text style={styles.metricLabel}>ASIST./PARTIDO</Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EDITAR ESTADÍSTICAS</Text>
              <View style={styles.formRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Partidos</Text>
                  <TextInput
                    style={styles.input}
                    value={matches}
                    onChangeText={setMatches}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Goles</Text>
                  <TextInput
                    style={styles.input}
                    value={goals}
                    onChangeText={setGoals}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Asistencias</Text>
                  <TextInput
                    style={styles.input}
                    value={assists}
                    onChangeText={setAssists}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Minutos</Text>
                  <TextInput
                    style={styles.input}
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Amarillas</Text>
                  <TextInput
                    style={styles.input}
                    value={yellowCards}
                    onChangeText={setYellowCards}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Rojas</Text>
                  <TextInput
                    style={styles.input}
                    value={redCards}
                    onChangeText={setRedCards}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <Button
                variant="primary"
                label="GUARDAR ESTADÍSTICAS"
                onPress={handleSave}
                loading={saving}
                style={styles.saveButton}
              />
            </View>

            {radarData && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <User size={18} color={colors.accentBlueBright} />
                  <Text style={styles.sectionTitle}>FICHA TÉCNICA</Text>
                </View>
                <RadarChart data={radarData} />
              </View>
            )}

            <Button
              variant="secondary"
              label="EDITAR ATRIBUTOS"
              icon={Sliders}
              onPress={() => navigation.navigate('Atributos')}
              style={styles.attributesButton}
            />
          </>
        )}
      </ScrollView>

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: 64 + spacing[8],
  },
  seasonSelector: {
    flexDirection: 'row',
    gap: spacing[2],
    marginVertical: spacing[4],
  },
  seasonChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  seasonChipActive: {
    backgroundColor: colors.accentBlueDim,
    borderColor: colors.accentBlue,
  },
  seasonText: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  seasonTextActive: {
    color: colors.accentBlueBright,
  },
  loadingContainer: {
    gap: spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  yellowCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  redCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  cardValue: {
    ...typography.headingMD,
    color: colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderSubtle,
  },
  metricValue: {
    ...typography.headingLG,
    color: colors.accentBlueBright,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
  section: {
    marginTop: spacing[4],
  },
  sectionTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
    marginBottom: spacing[4],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  input: {
    ...typography.bodyMD,
    color: colors.textPrimary,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    height: 52,
    textAlign: 'left',
  },
  saveButton: {
    width: '100%',
    marginTop: spacing[4],
  },
  attributesButton: {
    width: '100%',
    marginTop: spacing[6],
  },
});
