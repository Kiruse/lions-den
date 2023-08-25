import Constants from 'expo-constants';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Switch, useTheme } from 'react-native-paper';
import tinycolor from 'tinycolor2';

import styled, { css } from '@emotion/native';

import LionButton from '../components/LionButton';
import LionText, { LionTextProps } from '../components/LionText';
import Screen from '../components/Screen';
import useNotifs, { requestPushToken } from '../hooks/useNotifs';
import { snackbar } from '../components/LionSnackbars';
import Spacer from '../components/Spacer';
import { setToken } from '../stores/user';

export default function Settings() {
  const { token: pushtoken, clearToken } = useNotifs();

  const handleRequestPushToken = useCallback(async () => {
    if (pushtoken) {
      console.log('clearing token');
      await clearToken();
    } else {
      const tok = await requestPushToken();
      if (!tok) {
        snackbar({
          mode: 'error',
          title: 'Oh no!',
          content: 'Couldn\'t get the push token. You may need to manually enable notifications in your phone settings.',
        });
      }
    }
  }, [pushtoken]);

  return (
    <Screen title="Settings" background={undefined} style={{ paddingVertical: 4 }}>
      <KVs>
        <KV>
          <Key italic>Version</Key>
          <Value italic>{Constants.expoConfig?.version || '?'}</Value>
        </KV>
        <KV even style={{ alignItems: 'center' }}>
          <LionText style={{ flex: 1 }}>Enable push notifications</LionText>
          <Switch value={!!pushtoken} onValueChange={handleRequestPushToken} />
        </KV>
        <Spacer size={12} />
        <LionText textAlign='center' italic bold>
          Advanced Settings
        </LionText>
        <LionText style={{ marginHorizontal: 4 }}>
          You shouldn't touch these settings unless you know what you're doing or are instructed to
          do so by the developer(s).
        </LionText>
        <LionButton
          mode='contained'
          onPress={() => {setToken(null)}}
          style={{ marginHorizontal: 4 }}
        >
          Reset token
        </LionButton>
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

function KV({ even, style, ...props }: LionTextProps & { even?: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={[css`
        flex-direction: row;
        gap: 8px;
        background-color: ${even
          ? tinycolor(theme.colors.background).darken(5).toRgbString()
          : 'transparent'};
        padding: 4px 8px;
      `, style]}
      {...props}
    />
  )
}

const Key = styled(LionText)`
  flex: 1;
`

const Value = styled(LionText)`
  flex: 2;
`

const Btn = styled(LionButton)`
  margin: 12px 0;
`
