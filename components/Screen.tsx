import { ComponentType, ReactNode, Suspense, useMemo } from "react";
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { LionTitle } from "./LionText";
import { Stack } from "expo-router";
import { css } from "@emotion/native";

export interface ScreenProps {
  children?: ReactNode;
  title?: ReactNode;
  StickyHeaderComponent?: ComponentType;
  style?: StyleProp<ViewStyle>;
}

export default function Screen({ children, title, StickyHeaderComponent, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const topInset = insets.top + 2;
  
  // Jotai uses Suspense, so we wrap the whole screen in it
  return (
    <Suspense fallback={<LoadingScreen />}>
    <SafeAreaView edges={['left', 'right']} style={styles.superContainer}>
      {typeof title === 'string' ? (
        <LionTitle
          bold
          textAlign="center"
          color="white"
          style={css`
            background-color: black;
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
      <ScrollView
        StickyHeaderComponent={StickyHeaderComponent}
        style={[styles.container, style]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
    </Suspense>
  )
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#f3f410',
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
  header: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'black',
  },
});
