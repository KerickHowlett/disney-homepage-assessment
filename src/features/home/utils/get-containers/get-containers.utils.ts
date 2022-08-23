import { isNil } from '@common/utils';
import type { Container, HomeAPIResponse } from '../../types';

export function getContainers(response: HomeAPIResponse): Container[] {
    if (isNil(response)) return [];
    return response.data.StandardCollection.containers as Container[];
}
