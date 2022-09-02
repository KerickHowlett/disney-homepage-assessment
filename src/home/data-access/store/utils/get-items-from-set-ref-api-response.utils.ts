import { isNil } from '@disney/shared';
import type { ContainerItem, PersonalizedSetKeys, SetRefAPIResponse } from '../types';
import { getFirstPropertyValueOfSet } from './get-first-property-value-of-set.utils';

export function getItemsFromSetRefAPIResponse(response: SetRefAPIResponse | null): ContainerItem[] {
    if (isNil(response)) return [];

    const { data } = response;
    const setKey: PersonalizedSetKeys = getFirstPropertyValueOfSet(data);
    if (isNil(response?.data[setKey])) return [];

    const { items } = response.data[setKey];
    return items as ContainerItem[];
}
