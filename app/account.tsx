import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';

import LionButton from '../components/LionButton';
import { snackbar } from '../components/LionSnackbars';
import LionText, { bakeText } from '../components/LionText';
import Screen from '../components/Screen';
import Spacer from '../components/Spacer';
import { getCosmosLinkURL, getJWTPayload } from '../misc/helpers';
import { shortaddr } from '../misc/utils';
import {
  login as _login, recover as _recover, setToken, useAddress, useToken
} from '../stores/user';

const Text = bakeText({
  textAlign: 'center',
});

export default function Account() {
  const token = useToken();

  if (!token) {
    return <LoginScreen />;
  } else {
    return <AccountScreen />;
  }
}

function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [tokenID, setTokenID] = useState('');

  const login = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await _recover(tokenID);
      await _login(token); // auto-sets token in store
    } catch (e: any) {
      console.error(e);
      snackbar({
        content: `An error occurred: ${e.message}`
      });
    } finally {
      setLoading(false);
    }
  }, [loading, tokenID]);

  return (
    <Screen title="Login" background={undefined}>
      <Halves>
        <Half>
          <Text>
            You can login on this device by pressing this button:
          </Text>
          <LionButton
            mode="elevated"
            loading={loading}
            onPress={() => {
              Linking.openURL(
                getCosmosLinkURL('/?redirect=' + encodeURIComponent(Linking.createURL('/post-login')))
              );
            }}
          >
            To Login Site
          </LionButton>
        </Half>
        <Separator>
          <Text>- OR -</Text>
        </Separator>
        <Half>
          <Text>
            To login from a different device, go to this URL:
          </Text>
          <Text italic>https://cosmos-link.kiruse.dev/</Text>
          <Text>
            Once you're done, return here and enter your Token ID here:
          </Text>

          <Spacer size={12} />
          <TextInput
            label="Token ID"
            onChangeText={setTokenID}
            contentStyle={{ textAlign: 'center' }}
            onSubmitEditing={login}
          />
          <Spacer size={4} />
          <LionButton
            mode='elevated'
            loading={loading}
            onPress={login}
          >
            Login
          </LionButton>
        </Half>
      </Halves>
    </Screen>
  )
}

function AccountScreen() {
  const token = useToken();

  const payload = token ? getJWTPayload(token) : {};
  const {
    type,
    address: addr,
  } = payload;

  return (
    <Screen title="Your Account" style={{ padding: 20 }}>
      <View style={{ flex: 1 }}>
        {type === 'wallet' ? (
          <LionText textAlign="center">
            Logged in as <LionText italic>{shortaddr(addr)}</LionText>
          </LionText>
        ) : (
          <LionText textAlign="center">
            Logged in anonymously
          </LionText>
        )}
      </View>
      <LionButton
        mode="elevated"
        disabled={type === 'anonymous'}
        icon={props => <MaterialIcons name="logout" {...props} />}
        onPress={() => {
          setToken(null);
        }}
      >
        Logout
      </LionButton>
    </Screen>
  )
}

const Halves = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
`

const Half = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 20px;
`

const Separator = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
`
