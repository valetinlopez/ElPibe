import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  return (
    <View style={sliderStyles.container}>
      <Text style={sliderStyles.label}>{label}</Text>
      <View style={sliderStyles.sliderRow}>
        <View style={sliderStyles.track}>
          <View
            style={[
              sliderStyles.fill,
              { width: `${(value / 10) * 100}%` },
              value >= 8 && sliderStyles.fillHighlight,
            ]}
          />
        </View>
        <Text
          style={[
            sliderStyles.value,
            value >= 8 && sliderStyles.valueHighlight,
          ]}
        >
          {value}
        </Text>
      </View>
      <View style={sliderStyles.slider}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <View
            key={num}
            style={[
              sliderStyles.dot,
              num <= value && sliderStyles.dotActive,
              num >= 8 && sliderStyles.dotHighlight,
            ]}
          />
        ))}
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
    const { data } = await getAttributes(user?.id);

    if (data && data.length > 0) {
      const attrs = {};
      data.forEach((attr) => {
        attrs[attr.attribute_name] = attr.score;
      });
      setAttributes(attrs);
      updateRadar(attrs);
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
    setSaving(true);

    const attrsArray = [];
    Object.keys(attributesByDimension).forEach((dim) => {
      attributesByDimension[dim].forEach((attr) => {
        attrsArray.push({
          profile_id: user?.id,
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
    paddingBottom: spacing[8],
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
  label: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  track: {
    flex: 1,
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
  value: {
    ...typography.headingMD,
    color: colors.textPrimary,
    width: 28,
    textAlign: 'center',
  },
  valueHighlight: {
    color: colors.accentBlueBright,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderSubtle,
  },
  dotActive: {
    backgroundColor: colors.accentBlueMetal,
  },
  dotHighlight: {
    backgroundColor: colors.accentBlueBright,
  },
});
