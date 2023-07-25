import { ComponentType, ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
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
  
  return (
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
  )
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#f3f410',
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
