import { snackbar } from '../components/LionSnackbars';
import { getToken, setToken } from '../stores/user';
import { getJWTPayload } from './helpers';
import request from './requests';

export async function login(token: string) {
  // if we have an existing anonymous token, upgrade it. otherwise just log in.
  const existingToken = await getToken();

  const type = existingToken ? getJWTPayload(existingToken)?.type : null;
  if (type === 'anonymous')
    return await _upgrade(token);
  return await _login(token);
}

async function _login(token: string) {
  try {
    await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/login',
      body: token,
    });
    await setToken(token);
  } catch (err: any) {
    console.error('Failed to login:', err);
    snackbar({
      mode: 'error',
      content: 'Failed to login: ' + err.message || 'Unknown error',
    });
  }
}

async function _upgrade(token: string) {
  try {
    await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/upgrade',
      body: token,
    });
    await setToken(token);
  } catch (err: any) {
    console.error('Failed to upgrade user:', err);
    snackbar({
      mode: 'error',
      content: 'Failed to upgrade account: ' + err.message || 'Unknown error',
    });
  }
}

export async function recover(tokenID: string) {
  return await request({
    method: 'POST',
    api: 'cosmos-link',
    url: 'v1/recover',
    type: 'text',
    expects: 'text',
    body: tokenID,
  });
}
