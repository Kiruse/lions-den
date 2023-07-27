import utf8 from 'utf8'
import base64 from 'react-native-base64'
import { useResource } from '../useResource'
import constants from '../../misc/constants'

export async function getSmartQuery(address: string, query: any) {
  query = base64.encode(utf8.encode(JSON.stringify(query)));
  const res = await fetch(`${constants.defaultLcd}/cosmwasm/wasm/v1/contract/${address}/smart/${query}`)
  if (!res.ok) throw Object.assign(Error(`Request error ${res.status}`), { res });
  const { data } = (await res.json()) || {};
  return data;
}

export function useSmartQuery(address: string, query: any) {
  return useResource(
    () => getSmartQuery(address, query),
    [address, query]
  );
}
