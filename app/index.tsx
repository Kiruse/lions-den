import Screen from '../components/Screen'
import LionText, { LionTitle } from '../components/LionText'
import RoarLogo from '../components/RoarLogo'
import { StyleSheet, View } from 'react-native'

export default function App() {
  return (
    <Screen title="Lions' Den" style={{ padding: 8 }}>
      <RoarLogo size={256} style={{ alignSelf: 'center' }} />
      <View style={styles.contentContainer}>
        <LionTitle>Welcome to the Lions' Den!</LionTitle>
        <LionText bold>This app is a work in progress.</LionText>
        <LionText>
          The Lions' Den mobile app is intended to become a hub of information for the Lions' Den
          community aka the Pride. Here, we will feed you news on the Pride's latest projects &
          campaigns, and especially notify you of new governance proposals.
        </LionText>
        <LionText>News & proposals will show up here, eventually. :)</LionText>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
