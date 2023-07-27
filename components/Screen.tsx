import { css } from '@emotion/native'
import { ComponentType, ReactNode, Suspense } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LionTitle } from './LionText'

export interface ScreenProps {
  children?: ReactNode;
  title?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Screen({ children, title, style }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const topInset = insets.top + 2;

  // Jotai uses Suspense, so we wrap the whole screen in it
  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.superContainer, { backgroundColor: theme.colors.background }]}>
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
