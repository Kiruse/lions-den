import { Image, ImageStyle, StyleProp } from 'react-native'

export interface RoarLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function RoarLogo({ size = 100, style }: RoarLogoProps) {
  return (
    <Image
      source={require('../assets/roar-logo.png')}
      style={[{ width: size, height: size }, style]}
    />
  )
}
