import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper'

type Orientation = 'up' | 'left' | 'down' | 'right' | number;

export interface ChevronProps {
  /** Orientation of the chevron. Can be up, left, right, down, or a counter-clockwise rotation in degrees. Defaults to up. */
  orientation?: Orientation;
  /** Size of the chevron. Defaults to 20. */
  size?: number;
  /** The color of the chevron. Defaults to `theme.colors.onBackground`. */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Chevron({ orientation, size, color, style }: ChevronProps) {
  const rotation = getOrientation(orientation ?? 'up');
  const deg = useRef(new Animated.Value(rotation)).current;
  const theme = useTheme();

  useEffect(() => {
    Animated.timing(deg, {
      toValue: rotation,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [rotation]);

  return (
    <Animated.View style={[{
      transform: [{
        rotate: deg.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    }, style]}>
      <Ionicons name="chevron-up" size={size ?? 20} color={color ?? theme.colors.onBackground} />
    </Animated.View>
  )
}

function getOrientation(orientation: Orientation): number {
  switch (orientation) {
    case 'up':
      return 0;
    case 'left':
      return 90;
    case 'down':
      return 180;
    case 'right':
      return 270;
    default:
      return orientation;
  }
}
