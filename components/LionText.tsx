import { useMemo } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { Text, TextProps } from 'react-native-paper'

export interface LionTextProps {
  children?: string;
  fontFamily?: string;
  fontSize?: number;
  textAlign?: TextStyle['textAlign'];
  italic?: boolean;
  bold?: boolean;
  color?: TextStyle['color'];
  style?: StyleProp<TextStyle>;
}

export default function LionText({
  children,
  fontFamily,
  fontSize,
  textAlign,
  italic = false,
  bold = false,
  color,
  style,
}: LionTextProps)
{
  const _style = useMemo<TextStyle>(() => ({
    fontFamily,
    fontSize,
    fontWeight: bold ? 'bold' : undefined,    // these two need to affect fontFamily as well
    fontStyle: italic ? 'italic' : undefined, // these two need to affect fontFamily as well
    textAlign,
    color,
    marginVertical: 4,
  }), [fontFamily, fontSize, textAlign, bold, italic, color]);
  return <Text style={[_style, style]}>{children}</Text>
}

export function LionTitle({ style, ...props }: LionTextProps) {
  return <LionText fontSize={20} bold style={[{ marginBottom: 20 }, style]} {...props} />
}
