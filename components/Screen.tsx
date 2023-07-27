import { css } from '@emotion/native'
import { ReactNode, Suspense } from 'react'
import { ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LionTitle } from './LionText'

export interface ScreenProps {
  children?: ReactNode;
  title?: ReactNode;
  /** Background image to use. If present but undefined, no image will be used. Otherwise, semi-transparent Roar Logo will be used. */
  background?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

export default function Screen({ children, title, style, ...props }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const topInset = insets.top + 2;

  const image = 'background' in props ? props.background : require('../assets/background.png');

  // Jotai uses Suspense, so we wrap the whole screen in it
  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.superContainer, { backgroundColor: theme.colors.background }]}>
    <ImageBackground
      source={image}
      resizeMode="contain"
      style={{ flex: 1 }}
    >
    <Suspense fallback={<LoadingScreen />}>
      {typeof title === 'string' ? (
        <LionTitle
          bold
          textAlign="center"
          color="white"
          style={css`
            background-color: ${theme.colors.onBackground};
            padding: 8px 4px;
            padding-top: ${topInset+''}px;
            margin: 0;
          `}
        >
          {title}
        </LionTitle>
      ) : (
        title
      )}
      <View style={[styles.container, style]}>
        {children}
      </View>
    </Suspense>
    </ImageBackground>
    </SafeAreaView>
  )
}

function LoadingScreen() {
  const theme = useTheme();
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});
