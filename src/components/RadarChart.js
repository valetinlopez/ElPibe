import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import Card from './Card';

const DIMENSIONS = ['Técnica', 'Física', 'Táctica', 'Mental'];
const DIMENSION_KEYS = ['technical', 'physical', 'tactical', 'mental'];
const MAX_SCORE = 10;

export default function RadarChart({ data, size: propSize }) {
  const screenWidth = Dimensions.get('window').width - 64;
  const size = propSize || Math.min(screenWidth, 280);
  const center = size / 2;
  const radius = (size / 2) - 40;

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
    const r = (value / MAX_SCORE) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = DIMENSION_KEYS.map((key, index) => {
    const value = data?.[key] || 0;
    return getPoint(index, value);
  });

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <Card style={styles.card}>
      <Svg width={size} height={size}>
        <G>
          {gridLevels.map((level) => {
            const levelPoints = DIMENSION_KEYS.map((_, index) => getPoint(index, level));
            const levelPolygon = levelPoints.map((p) => `${p.x},${p.y}`).join(' ');
            return (
              <Polygon
                key={level}
                points={levelPolygon}
                fill="none"
                stroke={colors.borderSubtle}
                strokeWidth={0.5}
                opacity={0.3}
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
                opacity={0.3}
              />
            );
          })}

          <Polygon
            points={polygonPoints}
            fill="rgba(45,111,224,0.18)"
            stroke={colors.accentBlueBright}
            strokeWidth={2}
          />

          {dataPoints.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={colors.accentBlueBright}
            />
          ))}

          {DIMENSIONS.map((label, index) => {
            const labelPoint = getPoint(index, MAX_SCORE + 2);
            return (
              <SvgText
                key={`label-${index}`}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.textSecondary}
                fontSize={12}
                fontFamily="Inter"
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
    paddingVertical: 16,
  },
});
