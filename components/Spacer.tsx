import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

export interface SpacerProps {
  size: number;
  vertical?: boolean;
}

export default function Spacer({ size, vertical }: SpacerProps) {
  const style = useMemo<ViewStyle>(() => vertical ? ({
    width: size,
  }) : ({
    height: size,
  }), [size, vertical]);
  return <View style={style} />;
}
