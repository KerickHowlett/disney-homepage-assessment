import type { Container, HomeAPIResponse } from '../../types';

export function getContainers(response: HomeAPIResponse | null): Container[] {
    return (response?.data.StandardCollection.containers as Container[]) ?? [];
}
