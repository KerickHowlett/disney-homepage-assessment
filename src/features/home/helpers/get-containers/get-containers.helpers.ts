import type { Container, HomeAPIResponse } from '../../types';

export function getContainers(response: HomeAPIResponse | null): ReadonlyArray<Container> {
    return response?.data.StandardCollection.containers ?? [];
}
