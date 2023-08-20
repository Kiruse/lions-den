import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';

import LionText from '../components/LionText';
import Screen from '../components/Screen';
import { setToken, useAddress } from '../stores/user';

export default function PostLogin() {
  const url = Linking.useURL();
  const success = useMemo(() => {
    if (!url)
      return false;

    const { queryParams } = Linking.parse(url);
    console.log(queryParams);
    if (!queryParams || typeof queryParams.token !== 'string')
      return false;
    setToken(queryParams.token);
  }, []);
  const address = useAddress() || '...';

  // return to home page after 5 seconds
  useEffect(() => {
    let mounted = true;
    let timeout = setTimeout(() => {
      if (!mounted) return;
      router.replace('/');
    }, 5000);
    return () => {
      mounted = false;
      clearTimeout(timeout);
    }
  }, []);

  if (!success) {
    return (
      <Screen title="Login Failed" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LionText textAlign='center'>
          Weird, something went wrong.{'\n'}
          Returning to home screen in a few seconds.
        </LionText>
      </Screen>
    )
  } else {
    return (
      <Screen title="Login Success" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LionText textAlign='center'>
          You're now logged in as {address}!{'\n'}
          Returning to home screen in a few seconds.
        </LionText>
      </Screen>
    )
  }
}
