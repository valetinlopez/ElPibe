import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import Card from './Card';

const DIMENSIONS = ['Técnica', 'Física', 'Táctica', 'Mental'];
const DIMENSION_KEYS = ['technical', 'physical', 'tactical', 'mental'];
const MAX_SCORE = 10;
const GRID_LEVELS = [2, 4, 6, 8, 10];

export default function RadarChart({ data, size: propSize }) {
  const screenWidth = Dimensions.get('window').width - 64;
  const size = propSize || Math.min(screenWidth, 280);
  const center = size / 2;
  const radius = (size / 2) - 52;

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / DIMENSION_KEYS.length - Math.PI / 2;
    const r = (value / MAX_SCORE) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = DIMENSION_KEYS.map((key, index) => {
    const rawValue = data?.[key];
    const value = (rawValue == null || isNaN(rawValue) || !isFinite(rawValue))
      ? 0
      : Math.max(0, Math.min(MAX_SCORE, rawValue));
    return { ...getPoint(index, value), value };
  });

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const labelPositions = DIMENSIONS.map((_, index) => getPoint(index, MAX_SCORE + 3.5));

  const formatValue = (val) => {
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(1);
  };

  const getLabelAnchor = (index) => {
    if (index === 1) return 'end';
    if (index === 3) return 'start';
    return 'middle';
  };

  return (
    <Card style={styles.card}>
      <Svg width={size} height={size}>
        <G>
          {GRID_LEVELS.map((level) => {
            const levelPoints = DIMENSION_KEYS.map((_, index) => getPoint(index, level));
            const levelPolygon = levelPoints.map((p) => `${p.x},${p.y}`).join(' ');
            return (
              <Polygon
                key={level}
                points={levelPolygon}
                fill="none"
                stroke={colors.borderSubtle}
                strokeWidth={0.5}
                opacity={0.4}
              />
            );
          })}

          {DIMENSION_KEYS.map((_, index) => {
            const point = getPoint(index, MAX_SCORE);
            return (
              <Line
                key={`line-${index}`}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke={colors.borderSubtle}
                strokeWidth={0.5}
                opacity={0.4}
              />
            );
          })}

          <Polygon
            points={polygonPoints}
            fill={colors.accentBlue + '40'}
            stroke={colors.accentBlueBright}
            strokeWidth={2}
          />

          {dataPoints.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={colors.accentBlueBright}
            />
          ))}

          <SvgText
            x={getPoint(0, 10).x}
            y={getPoint(0, 10).y - 16}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.textTertiary}
            fontSize={9}
            fontFamily="Inter"
          >
            10
          </SvgText>

          {dataPoints.map((point, index) => {
            if (point.value === 0) return null;
            return (
              <SvgText
                key={`val-${index}`}
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.accentBlueBright}
                fontSize={11}
                fontFamily="Inter"
                fontWeight="bold"
              >
                {formatValue(point.value)}
              </SvgText>
            );
          })}

          {DIMENSIONS.map((label, index) => {
            const labelPoint = labelPositions[index];
            return (
              <SvgText
                key={`label-${index}`}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={getLabelAnchor(index)}
                dominantBaseline="middle"
                fill={colors.textSecondary}
                fontSize={typography.bodySM.fontSize}
                fontFamily={typography.bodySM.fontFamily}
              >
                {label}
              </SvgText>
            );
          })}
        </G>
      </Svg>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
});
