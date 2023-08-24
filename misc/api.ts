import request from './requests';

export async function setPushToken(pushtoken: string) {
  try {
    await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/pushtoken',
      type: 'json',
      body: {
        project: 'lions-den',
        pushtoken,
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to set push token:', err);
    return false;
  }
}

export async function clearPushToken(pushtoken: string) {
  try {
    await request({
      method: 'DELETE',
      api: 'cosmos-link',
      url: 'v1/pushtoken',
      type: 'json',
      body: {
        project: 'lions-den',
        pushtoken,
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to clear push token:', err);
    return false;
  }
}
