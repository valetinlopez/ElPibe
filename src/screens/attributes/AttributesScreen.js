import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getAttributes, upsertAttributes, calculateRadarAverages } from '../../services/attributes.service';
import Header from '../../components/Header';
import RadarChart from '../../components/RadarChart';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radii } from '../../constants/radii';
import { attributesByDimension, dimensionLabels } from '../../constants/dimensions';

const { width } = Dimensions.get('window');

function AttributeSlider({ label, value, onChange }) {
  const handleMinus = () => {
    if (value > 1) onChange(value - 1);
  };

  const handlePlus = () => {
    if (value < 10) onChange(value + 1);
  };

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.header}>
        <Text style={sliderStyles.label}>{label}</Text>
        <Text
          style={[
            sliderStyles.value,
            value >= 8 && sliderStyles.valueHighlight,
          ]}
        >
          {value}/10
        </Text>
      </View>
      <View style={sliderStyles.counterRow}>
        <TouchableOpacity
          onPress={handleMinus}
          disabled={value <= 1}
          activeOpacity={0.6}
          style={[sliderStyles.counterBtn, value <= 1 && sliderStyles.counterBtnDisabled]}
        >
          <Minus size={20} color={value <= 1 ? colors.textTertiary : colors.textPrimary} />
        </TouchableOpacity>
        <View style={sliderStyles.trackContainer}>
          <View style={sliderStyles.track}>
            <View
              style={[
                sliderStyles.fill,
                { width: `${(value / 10) * 100}%` },
                value >= 8 && sliderStyles.fillHighlight,
              ]}
            />
          </View>
          <View style={sliderStyles.ticksRow}>
            {[2, 4, 6, 8].map((num) => (
              <View key={`tick-${num}`} style={sliderStyles.tick} />
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePlus}
          disabled={value >= 10}
          activeOpacity={0.6}
          style={[sliderStyles.counterBtn, value >= 10 && sliderStyles.counterBtnDisabled]}
        >
          <Plus size={20} color={value >= 10 ? colors.textTertiary : colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AttributesScreen() {
  const { user } = useAuth();
  const [attributes, setAttributes] = useState({});
  const [radarData, setRadarData] = useState({ technical: 0, physical: 0, tactical: 0, mental: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const { data } = await getAttributes(user.id);

    if (data && data.length > 0) {
      const attrs = {};
      data.forEach((attr) => {
        attrs[attr.attribute_name] = attr.score;
      });
      setAttributes(attrs);
      updateRadar(attrs);
    } else {
      const defaultAttrs = {};
      Object.values(attributesByDimension).flat().forEach((a) => {
        defaultAttrs[a.id] = 5;
      });
      setAttributes(defaultAttrs);
      updateRadar(defaultAttrs);
    }

    setLoading(false);
  };

  const updateRadar = useCallback((attrs) => {
    const dimensions = Object.keys(attributesByDimension);
    const averages = {};

    dimensions.forEach((dim) => {
      const dimAttrs = attributesByDimension[dim];
      const scores = dimAttrs.map((a) => attrs[a.id] || 5);
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      averages[dim] = Math.round(avg * 10) / 10;
    });

    setRadarData(averages);
  }, []);

  const handleValueChange = (attrId, value) => {
    const newAttrs = { ...attributes, [attrId]: value };
    setAttributes(newAttrs);
    updateRadar(newAttrs);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);

    const attrsArray = [];
    Object.keys(attributesByDimension).forEach((dim) => {
      attributesByDimension[dim].forEach((attr) => {
        attrsArray.push({
          profile_id: user.id,
          dimension: dim,
          attribute_name: attr.id,
          score: attributes[attr.id] || 5,
        });
      });
    });

    const { error } = await upsertAttributes(attrsArray);

    if (error) {
      setToast({ visible: true, type: 'error', message: error });
    } else {
      updateRadar(attributes);
      setToast({ visible: true, type: 'success', message: '¡Atributos guardados!' });
    }

    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="ATRIBUTOS" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.radarContainer}>
          <RadarChart data={radarData} size={width - 64} />
        </View>

        {Object.keys(attributesByDimension).map((dim) => (
          <View key={dim} style={styles.dimensionSection}>
            <Text style={styles.dimensionTitle}>
              {dimensionLabels[dim].toUpperCase()}
            </Text>
            {attributesByDimension[dim].map((attr) => (
              <AttributeSlider
                key={attr.id}
                label={attr.label}
                value={attributes[attr.id] || 5}
                onChange={(val) => handleValueChange(attr.id, val)}
              />
            ))}
          </View>
        ))}

        <Button
          variant="primary"
          label="GUARDAR ATRIBUTOS"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
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
  radarContainer: {
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  dimensionSection: {
    marginBottom: spacing[6],
  },
  dimensionTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
    marginBottom: spacing[4],
    letterSpacing: 0.5,
  },
  saveButton: {
    width: '100%',
    marginTop: spacing[4],
  },
});

const sliderStyles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  value: {
    ...typography.headingMD,
    color: colors.textPrimary,
  },
  valueHighlight: {
    color: colors.accentBlueBright,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgSurfaceOverlay,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.4,
    borderColor: colors.borderSubtle,
  },
  trackContainer: {
    flex: 1,
  },
  track: {
    height: 6,
    backgroundColor: colors.bgSurfaceOverlay,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accentBlueMetal,
    borderRadius: 3,
  },
  fillHighlight: {
    backgroundColor: colors.accentBlueBright,
  },
  ticksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
  tick: {
    width: 2,
    height: 4,
    borderRadius: 1,
    backgroundColor: colors.borderSubtle,
  },
});
