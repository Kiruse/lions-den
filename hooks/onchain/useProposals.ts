import { PropData } from '../../misc/types';
import { useResource } from '../useResource'
import { getSmartQuery } from './useSmartQuery'

const PROPS_BATCH_SIZE = 50;

export function useProposals(address: string) {
  return useResource(async () => {
    const result: PropData[] = [];
    let data: PropData[] = [];
    let batch = 0;
    do {
      ({ proposals: data } = await getSmartQuery(address, {
        proposals: {
          limit: PROPS_BATCH_SIZE,
          start_after: batch * PROPS_BATCH_SIZE,
        },
      }));
      result.push(...data);
      batch++;
    } while (data.length === PROPS_BATCH_SIZE);
    return result;
  }, [address]);
}
