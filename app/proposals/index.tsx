import { useFocusEffect } from "expo-router";
import LionText from "../../components/LionText";
import Screen from "../../components/Screen";
import useNotifs from "../../hooks/useNotifs";

export default function() {
  useNotifs();

  // query proposals
  useFocusEffect(() => {
    // TODO
  });

  return (
    <Screen title="Proposals">
      <LionText italic textAlign="center">Under construction</LionText>
    </Screen>
  )
}
