import Svg, { Circle, Path, G } from 'react-native-svg';

export default function FootballIcon({ size = 20, color = '#4C8DFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M12 7.5 L13.5 10 L16 10.5 L14 12.2 L14.5 15 L12 13.8 L9.5 15 L10 12.2 L8 10.5 L10.5 10 Z"
        fill={color}
        opacity="0.3"
      />
      <G stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <Path d="M12 2.5 L12 5.5" />
        <Path d="M4.5 8 L7 9.5" />
        <Path d="M2.5 16 L5 14.5" />
        <Path d="M4.5 20 L7 18.5" />
        <Path d="M19.5 8 L17 9.5" />
        <Path d="M21.5 16 L19 14.5" />
        <Path d="M19.5 20 L17 18.5" />
      </G>
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}
