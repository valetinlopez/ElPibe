import Svg, { Rect, Circle, Path } from 'react-native-svg';

// Cancha de fútbol vista desde arriba (para "Partidos")
export default function PitchIcon({ size = 20, color = '#4C8DFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2.5" y="5" width="19" height="14" rx="2" stroke={color} strokeWidth="1.7" fill="none" />
      <Path d="M12 5 L12 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.6" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M2.5 9.5 L5.5 9.5 L5.5 14.5 L2.5 14.5 M21.5 9.5 L18.5 9.5 L18.5 14.5 L21.5 14.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
