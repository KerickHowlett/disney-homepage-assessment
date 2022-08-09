import type { ContainerSetType } from '../types';

export const HOME_API = 'home.json';
export const TARGET_ASPECT_RATIO = '1.78';

export const ContainerType: Record<string, ContainerSetType> = {
    CuratedSet: 'CuratedSet',
    SetRef: 'SetRef',
} as const;
