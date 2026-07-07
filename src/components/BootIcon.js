import Svg, { Path, G, Line } from 'react-native-svg';

export default function BootIcon({ size = 20, color = '#4C8DFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4 L5 14 Q5 18 9 19 L20 20 Q23 20 23 17 L23 14 Q23 12 20 12 L14 11 L10 8 Q8 7 6 7 L5 7 Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <G stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
        <Line x1="8" y1="9" x2="12" y2="11" />
        <Line x1="9" y1="11" x2="13" y2="12.5" />
        <Line x1="10" y1="13" x2="14" y2="14" />
      </G>
      <Path
        d="M5 14 L5 17 Q5 19 7 19 L9 19"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
