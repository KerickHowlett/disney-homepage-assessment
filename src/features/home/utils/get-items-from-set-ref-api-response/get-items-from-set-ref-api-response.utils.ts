import type { ContainerItem, SetRefAPIResponse } from '../../types';

export function getItemsFromSetRefAPIResponse(response: SetRefAPIResponse | null): ContainerItem[] {
    return (response?.data?.CuratedSet?.items as ContainerItem[]) ?? [];
}
