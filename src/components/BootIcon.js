import Svg, { Path } from 'react-native-svg';

// Botín de fútbol de perfil: caña, empeine con cordones, suela con tapones
export default function BootIcon({ size = 20, color = '#4C8DFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4.5 L10.5 4.5 L10.5 8 Q10.5 10 13 10.8 L19 12.5 Q22 13.4 22 16 L22 17 L3 17 Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M3 17 L3 19 L22 19 L22 17"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={color}
      />
      <Path
        d="M5.5 19 L5.5 21.5 M10.5 19 L10.5 21.5 M15.5 19 L15.5 21.5 M20 19 L20 21.5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M13 12.2 L14.2 10.9 M15.8 13 L17 11.7"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
