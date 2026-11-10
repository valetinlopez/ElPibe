import Svg, { Circle, Path } from 'react-native-svg';

// Balón clásico: pentágono central relleno + costuras hacia el borde
export default function FootballIcon({ size = 20, color = '#4C8DFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.7" fill="none" />
      <Path
        d="M12 8.6 L15.23 10.95 L14 14.75 L10 14.75 L8.77 10.95 Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={color}
      />
      <Path
        d="M12 8.6 L12 2.5 M15.23 10.95 L21 9.06 M14 14.75 L17.58 19.69 M10 14.75 L6.42 19.69 M8.77 10.95 L3 9.06"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
