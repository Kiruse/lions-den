import styled from '@emotion/native'
import Constants from 'expo-constants'
import LionButton from '../components/LionButton'
import LionText from '../components/LionText'
import Screen from '../components/Screen'
import { requestPushToken } from '../hooks/useNotifs'

export default function Settings() {
  return (
    <Screen title="Settings" background={undefined} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
      <KVs>
        <KV>
          <Key italic>Version</Key>
          <Value italic>{Constants.expoConfig?.version || '?'}</Value>
        </KV>
        <Btn mode="contained" onPress={requestPushToken}>
          Register for Push Notifications
        </Btn>
      </KVs>
    </Screen>
  )
}

const KVs = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
`

const KV = styled.View`
  flex-direction: row;
  gap: 8px;
`

const Key = styled(LionText)`
  flex: 1;
`

const Value = styled(LionText)`
  flex: 2;
`

const Btn = styled(LionButton)`
  margin: 12px 0;
`
