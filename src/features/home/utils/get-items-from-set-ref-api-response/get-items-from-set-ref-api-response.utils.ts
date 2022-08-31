import { isNil } from '@common/utils';
import type { ContainerItem, PersonalizedSetKeys, SetRefAPIResponse } from '../../types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

export function getItemsFromSetRefAPIResponse(response: SetRefAPIResponse | null): ContainerItem[] {
    if (isNil(response)) return [];

    const { data } = response;
    const setKey: PersonalizedSetKeys = getOnlyKeyOfSet(data);
    if (isNil(response?.data[setKey])) return [];

    const { items } = response.data[setKey];
    return items as ContainerItem[];
}
